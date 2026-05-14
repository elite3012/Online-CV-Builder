package com.cvbuilder.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.cvbuilder.controller.CVController.UpdateCVRequest;
import com.cvbuilder.dto.ImportedCvResult;
import com.cvbuilder.model.CV;
import com.cvbuilder.model.Certificate;
import com.cvbuilder.model.Education;
import com.cvbuilder.model.Experience;
import com.cvbuilder.model.PersonalInformation;
import com.cvbuilder.model.Project;
import com.cvbuilder.model.Skill;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CVImportService {

    @Autowired
    private CVService cvService;

    @Autowired
    private ValidationService validationService;

    @Value("${ai.service.enabled:true}")
    private boolean aiServiceEnabled;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Value("${ai.service.importTimeoutMs:20000}")
    private int importTimeoutMs;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ImportedCvResult importCv(MultipartFile file, Long templateId, String title, String userEmail) {
        if (!aiServiceEnabled) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AI import service is currently disabled.");
        }

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please upload a CV file to import.");
        }

        ParsedImportPayload parsedPayload = requestParsedCv(file);
        String resolvedTitle = resolveTitle(title, parsedPayload.title, file.getOriginalFilename());

        CV createdCv = cvService.createCV(templateId, resolvedTitle, userEmail);
        UpdateCVRequest updateRequest = buildUpdateRequest(resolvedTitle, parsedPayload);
        CV updatedCv = cvService.updateCV(createdCv.getId(), updateRequest, userEmail);

        return new ImportedCvResult(
                updatedCv,
                sanitize(parsedPayload.detectedRole),
                sanitize(parsedPayload.suggestedTemplate),
                parsedPayload.confidence,
                sanitizeList(parsedPayload.insights));
    }

    private ParsedImportPayload requestParsedCv(MultipartFile file) {
        try {
            String boundary = "----cvbuilder-import-" + UUID.randomUUID();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiServiceUrl + "/import-cv"))
                    .timeout(Duration.ofMillis(importTimeoutMs))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(buildMultipartBody(file, boundary))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, extractErrorMessage(response.body()));
            }

            return objectMapper.readValue(response.body(), ParsedImportPayload.class);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The AI import service could not process this CV right now.");
        }
    }

    private HttpRequest.BodyPublisher buildMultipartBody(MultipartFile file, String boundary) throws IOException {
        String filename = sanitizeFilename(file.getOriginalFilename());
        String contentType = file.getContentType() == null || file.getContentType().isBlank()
                ? "application/octet-stream"
                : file.getContentType();

        List<byte[]> bodyParts = new ArrayList<>();
        bodyParts.add(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        bodyParts.add(("Content-Disposition: form-data; name=\"file\"; filename=\"" + filename + "\"\r\n")
                .getBytes(StandardCharsets.UTF_8));
        bodyParts.add(("Content-Type: " + contentType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        bodyParts.add(file.getBytes());
        bodyParts.add("\r\n".getBytes(StandardCharsets.UTF_8));
        bodyParts.add(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
        return HttpRequest.BodyPublishers.ofByteArrays(bodyParts);
    }

    private UpdateCVRequest buildUpdateRequest(String title, ParsedImportPayload parsedPayload) {
        UpdateCVRequest request = new UpdateCVRequest();
        request.title = title;
        request.summary = sanitize(parsedPayload.summary);
        request.personalInformation = buildPersonalInformation(parsedPayload);
        request.educations = buildEducations(parsedPayload.educations);
        request.experiences = buildExperiences(parsedPayload.experiences);
        request.projects = buildProjects(parsedPayload.projects);
        request.certificates = buildCertificates(parsedPayload.certificates);
        request.skills = buildSkills(parsedPayload.skills);
        return request;
    }

    private PersonalInformation buildPersonalInformation(ParsedImportPayload parsedPayload) {
        PersonalInformation info = new PersonalInformation();
        ParsedPersonalInformation source = parsedPayload.personalInformation == null
                ? new ParsedPersonalInformation()
                : parsedPayload.personalInformation;

        info.setFullName(sanitize(source.fullName));
        info.setJobTitle(resolveJobTitle(source.jobTitle, parsedPayload.detectedRole));
        info.setEmail(sanitize(source.email));
        info.setPhone(sanitize(source.phone));
        info.setLocation(sanitize(source.location));
        info.setLinkedIn(sanitize(source.linkedIn));
        info.setWebsite(sanitize(source.website));
        return info;
    }

    private List<Education> buildEducations(List<ParsedEducation> parsedEducations) {
        List<Education> educations = new ArrayList<>();
        if (parsedEducations == null) {
            return educations;
        }

        for (ParsedEducation parsedEducation : parsedEducations) {
            String school = sanitize(parsedEducation.school);
            String degree = sanitize(parsedEducation.degree);
            if (school.isBlank() || degree.isBlank()) {
                continue;
            }

            Education education = new Education();
            education.setSchool(school);
            education.setDegree(degree);
            education.setStartDate(parseLocalDateTime(parsedEducation.startDate));
            education.setEndDate(parseLocalDateTime(parsedEducation.endDate));
            education.setDescription(sanitize(parsedEducation.description));
            educations.add(education);
        }

        return educations;
    }

    private List<Experience> buildExperiences(List<ParsedExperience> parsedExperiences) {
        List<Experience> experiences = new ArrayList<>();
        if (parsedExperiences == null) {
            return experiences;
        }

        for (ParsedExperience parsedExperience : parsedExperiences) {
            String company = sanitize(parsedExperience.company);
            String jobTitle = sanitize(parsedExperience.jobTitle);
            String description = sanitize(parsedExperience.description);

            if (company.isBlank() && jobTitle.isBlank() && description.isBlank()) {
                continue;
            }

            Experience experience = new Experience();
            experience.setCompany(company.isBlank() ? "Imported Experience" : company);
            experience.setJobTitle(jobTitle);
            experience.setStartDate(parseDateString(parsedExperience.startDate));
            experience.setEndDate(parseDateString(parsedExperience.endDate));
            experience.setDescription(description);
            experiences.add(experience);
        }

        return experiences;
    }

    private List<Project> buildProjects(List<ParsedProject> parsedProjects) {
        List<Project> projects = new ArrayList<>();
        if (parsedProjects == null) {
            return projects;
        }

        for (ParsedProject parsedProject : parsedProjects) {
            String projectName = sanitize(parsedProject.projectName);
            String role = sanitize(parsedProject.role);
            String description = sanitize(parsedProject.description);
            String link = sanitize(parsedProject.link);

            if (projectName.isBlank() && role.isBlank() && description.isBlank()) {
                continue;
            }

            Project project = new Project();
            project.setProjectName(projectName.isBlank() ? "Imported Project" : projectName);
            project.setRole(role);
            project.setDescription(description);
            project.setLink(link);
            projects.add(project);
        }

        return projects;
    }

    private List<Certificate> buildCertificates(List<ParsedCertificate> parsedCertificates) {
        List<Certificate> certificates = new ArrayList<>();
        if (parsedCertificates == null) {
            return certificates;
        }

        for (ParsedCertificate parsedCertificate : parsedCertificates) {
            String certificateName = sanitize(parsedCertificate.certificateName);
            String organization = sanitize(parsedCertificate.organization);
            if (certificateName.isBlank()) {
                continue;
            }

            Certificate certificate = new Certificate();
            certificate.setCertificateName(certificateName);
            certificate.setOrganization(organization);
            certificate.setIssueDate(parseLocalDateTime(parsedCertificate.issueDate));
            certificates.add(certificate);
        }

        return certificates;
    }

    private List<Skill> buildSkills(List<String> parsedSkills) {
        List<Skill> skills = new ArrayList<>();
        if (parsedSkills == null) {
            return skills;
        }

        for (String parsedSkill : parsedSkills) {
            String skillName = sanitize(parsedSkill);
            if (skillName.isBlank()) {
                continue;
            }

            Skill skill = new Skill();
            skill.setSkillName(skillName);
            skills.add(skill);
        }

        return skills;
    }

    private LocalDateTime parseLocalDateTime(String value) {
        String sanitized = sanitize(value);
        if (sanitized.isBlank()) {
            return null;
        }

        try {
            if (sanitized.length() == 10) {
                return LocalDate.parse(sanitized).atStartOfDay();
            }
            return LocalDateTime.parse(sanitized);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String parseDateString(String value) {
        String sanitized = sanitize(value);
        if (sanitized.isBlank()) {
            return "";
        }

        try {
            if (sanitized.length() >= 10) {
                return LocalDate.parse(sanitized.substring(0, 10)).toString();
            }
        } catch (Exception ignored) {
            return sanitized;
        }

        return sanitized;
    }

    private String resolveTitle(String requestedTitle, String parsedTitle, String filename) {
        String explicitTitle = sanitize(requestedTitle);
        if (!explicitTitle.isBlank()) {
            return explicitTitle;
        }

        String importedTitle = sanitize(parsedTitle);
        if (!importedTitle.isBlank()) {
            return importedTitle;
        }

        String baseFilename = sanitizeFilename(filename).replaceFirst("\\.[^.]+$", "");
        return baseFilename.isBlank() ? "Imported CV" : baseFilename;
    }

    private String resolveJobTitle(String jobTitle, String detectedRole) {
        String explicitJobTitle = sanitize(jobTitle);
        if (!explicitJobTitle.isBlank()) {
            return explicitJobTitle;
        }
        return sanitize(detectedRole);
    }

    private String sanitize(String value) {
        if (value == null) {
            return "";
        }
        return validationService.sanitizeBasic(value).trim();
    }

    private List<String> sanitizeList(List<String> values) {
        List<String> sanitized = new ArrayList<>();
        if (values == null) {
            return sanitized;
        }

        for (String value : values) {
            String cleaned = sanitize(value);
            if (!cleaned.isBlank() && !sanitized.contains(cleaned)) {
                sanitized.add(cleaned);
            }
        }
        return sanitized;
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) {
            return "resume";
        }
        return filename.replaceAll("[\\r\\n\\\\/]+", "_").trim();
    }

    private String extractErrorMessage(String responseBody) {
        try {
            ErrorPayload payload = objectMapper.readValue(responseBody, ErrorPayload.class);
            String detail = sanitize(payload.detail);
            return detail.isBlank() ? "The AI import service could not parse this CV." : detail;
        } catch (Exception ignored) {
            return "The AI import service could not parse this CV.";
        }
    }

    public static class ParsedImportPayload {
        public String title;
        public String summary;
        public String detectedRole;
        public String suggestedTemplate;
        public Double confidence;
        public ParsedPersonalInformation personalInformation;
        public List<String> skills;
        public List<ParsedEducation> educations;
        public List<ParsedExperience> experiences;
        public List<ParsedProject> projects;
        public List<ParsedCertificate> certificates;
        public List<String> insights;
    }

    public static class ParsedPersonalInformation {
        public String fullName;
        public String jobTitle;
        public String email;
        public String phone;
        public String location;
        public String linkedIn;
        public String website;
    }

    public static class ParsedEducation {
        public String school;
        public String degree;
        public String startDate;
        public String endDate;
        public String description;
    }

    public static class ParsedExperience {
        public String company;
        public String jobTitle;
        public String startDate;
        public String endDate;
        public String description;
    }

    public static class ParsedProject {
        public String projectName;
        public String role;
        public String link;
        public String description;
    }

    public static class ParsedCertificate {
        public String certificateName;
        public String organization;
        public String issueDate;
    }

    public static class ErrorPayload {
        public String detail;
    }
}
