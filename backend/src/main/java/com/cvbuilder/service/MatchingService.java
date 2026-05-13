package com.cvbuilder.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cvbuilder.dto.MatchingResult;
import com.cvbuilder.dto.NLPResult;
import com.cvbuilder.model.CV;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MatchingService {

    @Autowired
    private NLPService nlpService;

    @Autowired
    private CVService cvService;

    @Value("${ai.service.enabled:true}")
    private boolean aiServiceEnabled;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Value("${ai.service.timeoutMs:2500}")
    private int aiServiceTimeoutMs;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MatchingResult checkAtsOnly(Long cvId, String userEmail) {
        CV cv = cvService.getCVByIdAndOwner(cvId, userEmail);
        return analyzeWithPython("ats", cv, null).orElseGet(() -> buildAtsFallback(cv));
    }

    public MatchingResult matchCvToJd(Long cvId, String jdText, String userEmail) {
        CV cv = cvService.getCVByIdAndOwner(cvId, userEmail);

        if (jdText == null || jdText.trim().isEmpty()) {
            return buildEmptyResult("Job Description is empty.");
        }

        return analyzeWithPython("match", cv, jdText).orElseGet(() -> buildKeywordFallback(cv, jdText));
    }

    private Optional<MatchingResult> analyzeWithPython(String mode, CV cv, String jdText) {
        if (!aiServiceEnabled) {
            return Optional.empty();
        }

        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("mode", mode);
            payload.put("jdText", jdText);
            payload.put("cv", buildCvPayload(cv));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiServiceUrl + "/analyze"))
                    .timeout(Duration.ofMillis(aiServiceTimeoutMs))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Optional.empty();
            }

            MatchingResult result = objectMapper.readValue(response.body(), MatchingResult.class);
            return Optional.of(normalizeResult(result, "python-semantic-service"));
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    private MatchingResult buildAtsFallback(CV cv) {
        String cvContent = buildCvContent(cv);
        List<String> atsWarnings = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score = 100;

        if (cvContent.isEmpty()) {
            atsWarnings.add("CV appears to be empty or lacks processable text.");
            suggestions.add("Add a summary, skills, education, and work experience before exporting.");
            MatchingResult result = new MatchingResult(0, false, new ArrayList<>(), new ArrayList<>(), atsWarnings,
                    suggestions);
            result.setAnalysisEngine("java-ats-fallback");
            result.setSectionCoverage(0.0);
            result.setFocusAreas(List.of("Add essential resume sections before running analysis again."));
            return result;
        }

        if (cv.getPersonalInformation() == null) {
            score -= 20;
            atsWarnings.add("Missing personal information section.");
            suggestions.add("Add your full name, job title, email, phone, and location.");
        } else {
            if (isBlank(cv.getPersonalInformation().getFullName())) {
                score -= 10;
                atsWarnings.add("Missing full name.");
            }
            if (isBlank(cv.getPersonalInformation().getEmail())) {
                score -= 10;
                atsWarnings.add("Missing contact email.");
            }
            if (isBlank(cv.getPersonalInformation().getJobTitle())) {
                score -= 5;
                atsWarnings.add("Missing target job title.");
            }
        }

        if (isBlank(cv.getSummary())) {
            score -= 15;
            atsWarnings.add("Missing professional summary.");
            suggestions.add("Add a concise 3-4 line summary with target role, experience, and core strengths.");
        }

        if (cv.getSkills() == null || cv.getSkills().isEmpty()) {
            score -= 15;
            atsWarnings.add("Missing skills section.");
            suggestions.add("List hard skills, domain tools, and platforms as explicit keywords.");
        }

        if (cv.getExperiences() == null || cv.getExperiences().isEmpty()) {
            score -= 20;
            atsWarnings.add("Missing work experience section.");
            suggestions.add("Add role titles, companies, dates, and achievement-focused bullet points.");
        }

        if (cv.getEducations() == null || cv.getEducations().isEmpty()) {
            score -= 10;
            atsWarnings.add("Missing education section.");
        }

        if (cvContent.length() < 300) {
            score -= 10;
            atsWarnings.add("CV text is short. ATS may rank resumes with sparse detail lower.");
            suggestions.add("Add measurable achievements, relevant tools, and domain keywords.");
        }

        score = Math.max(0, Math.min(100, score));
        boolean atsPassed = score >= 70 && atsWarnings.size() <= 3;
        double sectionCoverage = calculateSectionCoverage(cv);

        if (suggestions.isEmpty()) {
            suggestions.add("ATS structure looks solid. Run semantic JD analysis for role-specific recommendations.");
        }

        MatchingResult result = new MatchingResult(score, atsPassed, new ArrayList<>(), new ArrayList<>(), atsWarnings,
                suggestions);
        result.setAnalysisEngine("java-ats-fallback");
        result.setSectionCoverage(sectionCoverage);
        result.setStrengths(buildAtsStrengths(cv, score));
        result.setFocusAreas(limitList(mergeLists(atsWarnings, suggestions), 3));
        return normalizeResult(result, "java-ats-fallback");
    }

    private MatchingResult buildKeywordFallback(CV cv, String jdText) {
        NLPResult jdNlp = nlpService.preprocessJD(jdText);
        Set<String> jdTokens = new HashSet<>(jdNlp.getTokens());

        if (jdTokens.isEmpty()) {
            return buildEmptyResult("Job Description does not contain recognizable keywords.");
        }

        String cvContent = buildCvContent(cv);
        NLPResult cvNlp = nlpService.preprocessCV(cvContent);
        Set<String> cvTokens = new HashSet<>(cvNlp.getTokens());

        if (cvTokens.isEmpty()) {
            return buildEmptyResult("CV appears to be empty or lacks processable text.");
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String jdToken : jdTokens) {
            if (cvTokens.contains(jdToken)) {
                matchedSkills.add(jdToken);
            } else {
                missingSkills.add(jdToken);
            }
        }

        int score = (int) Math.round(((double) matchedSkills.size() / jdTokens.size()) * 100);
        boolean atsPassed = score >= 60;
        List<String> atsWarnings = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        if (score < 40) {
            atsWarnings.add("Low overlap with Job Description keywords. Your CV may be screened out early.");
            suggestions.add("Align your summary, skills, and project bullets with the target role terminology.");
        } else if (score < 70) {
            suggestions.add("Add more exact keywords from the JD to improve alignment.");
        } else {
            suggestions.add("Keyword alignment is strong. Tighten metrics and achievements to strengthen recruiter impact.");
        }

        if (missingSkills.size() > 10) {
            atsWarnings.add("Many JD terms are missing. Consider whether the resume is targeting the right role.");
        }

        if (cvContent.length() < 200) {
            atsWarnings.add("CV text is very short. Matching quality improves with more detailed evidence.");
        }

        MatchingResult result = new MatchingResult(score, atsPassed, limitList(matchedSkills, 15),
                limitList(missingSkills, 15), atsWarnings, suggestions);
        result.setAnalysisEngine("java-keyword-fallback");
        result.setKeywordCoverage((double) score);
        result.setSectionCoverage(calculateSectionCoverage(cv));
        result.setStrengths(limitList(matchedSkills, 3).stream()
                .map(skill -> "Matched JD term: " + skill)
                .collect(Collectors.toList()));
        result.setFocusAreas(limitList(missingSkills, 3).stream()
                .map(skill -> "Missing JD term: " + skill)
                .collect(Collectors.toList()));
        return normalizeResult(result, "java-keyword-fallback");
    }

    private MatchingResult normalizeResult(MatchingResult result, String fallbackEngine) {
        result.setMatchedSkills(nonNullList(result.getMatchedSkills()));
        result.setMissingSkills(nonNullList(result.getMissingSkills()));
        result.setAtsWarnings(nonNullList(result.getAtsWarnings()));
        result.setSuggestions(nonNullList(result.getSuggestions()));
        result.setStrengths(nonNullList(result.getStrengths()));
        result.setFocusAreas(nonNullList(result.getFocusAreas()));

        if (isBlank(result.getAnalysisEngine())) {
            result.setAnalysisEngine(fallbackEngine);
        }

        if (result.getSectionCoverage() != null) {
            result.setSectionCoverage(roundMetric(result.getSectionCoverage()));
        }
        if (result.getKeywordCoverage() != null) {
            result.setKeywordCoverage(roundMetric(result.getKeywordCoverage()));
        }
        if (result.getSemanticScore() != null) {
            result.setSemanticScore(roundMetric(result.getSemanticScore()));
        }

        return result;
    }

    private MatchingResult buildEmptyResult(String warningMsg) {
        MatchingResult result = new MatchingResult(0, false, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(),
                new ArrayList<>());
        result.getAtsWarnings().add(warningMsg);
        result.setAnalysisEngine("java-fallback");
        result.setStrengths(new ArrayList<>());
        result.setFocusAreas(List.of(warningMsg));
        return result;
    }

    private Map<String, Object> buildCvPayload(CV cv) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("title", cv.getTitle());
        payload.put("summary", cv.getSummary());
        payload.put("fullText", buildCvContent(cv));
        payload.put("personalInformation", buildPersonalInformationPayload(cv));
        payload.put("skills", cv.getSkills() == null ? List.of()
                : cv.getSkills().stream()
                        .map(skill -> safeText(skill.getSkillName()))
                        .filter(text -> !text.isBlank())
                        .collect(Collectors.toList()));
        payload.put("experiences", cv.getExperiences() == null ? List.of()
                : cv.getExperiences().stream().map(experience -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("company", experience.getCompany());
                    map.put("jobTitle", experience.getJobTitle());
                    map.put("startDate", experience.getStartDate());
                    map.put("endDate", experience.getEndDate());
                    map.put("description", experience.getDescription());
                    return map;
                }).collect(Collectors.toList()));
        payload.put("educations", cv.getEducations() == null ? List.of()
                : cv.getEducations().stream().map(education -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("school", education.getSchool());
                    map.put("degree", education.getDegree());
                    map.put("startDate", String.valueOf(education.getStartDate()));
                    map.put("endDate", String.valueOf(education.getEndDate()));
                    map.put("description", education.getDescription());
                    return map;
                }).collect(Collectors.toList()));
        payload.put("projects", cv.getProjects() == null ? List.of()
                : cv.getProjects().stream().map(project -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("projectName", project.getProjectName());
                    map.put("role", project.getRole());
                    map.put("description", project.getDescription());
                    map.put("link", project.getLink());
                    return map;
                }).collect(Collectors.toList()));
        payload.put("certificates", cv.getCertificates() == null ? List.of()
                : cv.getCertificates().stream().map(certificate -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("certificateName", certificate.getCertificateName());
                    map.put("organization", certificate.getOrganization());
                    map.put("issueDate", String.valueOf(certificate.getIssueDate()));
                    return map;
                }).collect(Collectors.toList()));
        return payload;
    }

    private Map<String, Object> buildPersonalInformationPayload(CV cv) {
        Map<String, Object> personalInformation = new LinkedHashMap<>();
        if (cv.getPersonalInformation() == null) {
            return personalInformation;
        }

        personalInformation.put("fullName", cv.getPersonalInformation().getFullName());
        personalInformation.put("jobTitle", cv.getPersonalInformation().getJobTitle());
        personalInformation.put("email", cv.getPersonalInformation().getEmail());
        personalInformation.put("phone", cv.getPersonalInformation().getPhone());
        personalInformation.put("location", cv.getPersonalInformation().getLocation());
        personalInformation.put("linkedIn", cv.getPersonalInformation().getLinkedIn());
        personalInformation.put("website", cv.getPersonalInformation().getWebsite());
        return personalInformation;
    }

    private String buildCvContent(CV cv) {
        StringBuilder sb = new StringBuilder();
        appendCvContent(cv, sb);
        return sb.toString().trim();
    }

    private void appendCvContent(CV cv, StringBuilder sb) {
        if (cv.getPersonalInformation() != null) {
            sb.append(safeText(cv.getPersonalInformation().getJobTitle())).append(" ");
            sb.append(safeText(cv.getPersonalInformation().getLocation())).append(" ");
        }
        if (cv.getSummary() != null) {
            sb.append(cv.getSummary()).append(" ");
        }
        if (cv.getEducations() != null) {
            cv.getEducations().forEach(education -> {
                sb.append(safeText(education.getDegree())).append(" ");
                sb.append(safeText(education.getSchool())).append(" ");
                sb.append(safeText(education.getDescription())).append(" ");
            });
        }
        if (cv.getExperiences() != null) {
            cv.getExperiences().forEach(experience -> {
                sb.append(safeText(experience.getJobTitle())).append(" ");
                sb.append(safeText(experience.getCompany())).append(" ");
                sb.append(safeText(experience.getDescription())).append(" ");
            });
        }
        if (cv.getSkills() != null) {
            cv.getSkills().forEach(skill -> sb.append(safeText(skill.getSkillName())).append(" "));
        }
        if (cv.getProjects() != null) {
            cv.getProjects().forEach(project -> {
                sb.append(safeText(project.getProjectName())).append(" ");
                sb.append(safeText(project.getRole())).append(" ");
                sb.append(safeText(project.getDescription())).append(" ");
            });
        }
        if (cv.getCertificates() != null) {
            cv.getCertificates().forEach(certificate -> {
                sb.append(safeText(certificate.getCertificateName())).append(" ");
                sb.append(safeText(certificate.getOrganization())).append(" ");
            });
        }
    }

    private List<String> buildAtsStrengths(CV cv, int score) {
        List<String> strengths = new ArrayList<>();
        if (!isBlank(cv.getSummary())) {
            strengths.add("Professional summary is present.");
        }
        if (cv.getSkills() != null && !cv.getSkills().isEmpty()) {
            strengths.add("Skills section gives the parser explicit keywords.");
        }
        if (cv.getExperiences() != null && !cv.getExperiences().isEmpty()) {
            strengths.add("Experience section provides role evidence.");
        }
        if (strengths.isEmpty() && score >= 70) {
            strengths.add("Core ATS sections are mostly complete.");
        }
        return limitList(strengths, 3);
    }

    private double calculateSectionCoverage(CV cv) {
        int totalSections = 5;
        int completedSections = 0;

        if (cv.getPersonalInformation() != null
                && !isBlank(cv.getPersonalInformation().getFullName())
                && !isBlank(cv.getPersonalInformation().getEmail())) {
            completedSections++;
        }
        if (!isBlank(cv.getSummary())) {
            completedSections++;
        }
        if (cv.getSkills() != null && !cv.getSkills().isEmpty()) {
            completedSections++;
        }
        if (cv.getExperiences() != null && !cv.getExperiences().isEmpty()) {
            completedSections++;
        }
        if (cv.getEducations() != null && !cv.getEducations().isEmpty()) {
            completedSections++;
        }

        return roundMetric((completedSections * 100.0) / totalSections);
    }

    private List<String> mergeLists(List<String> primary, List<String> secondary) {
        List<String> merged = new ArrayList<>(primary);
        merged.addAll(secondary);
        return merged;
    }

    private List<String> limitList(List<String> values, int maxItems) {
        if (values == null || values.isEmpty()) {
            return new ArrayList<>();
        }
        if (values.size() <= maxItems) {
            return new ArrayList<>(values);
        }
        return new ArrayList<>(values.subList(0, maxItems));
    }

    private List<String> nonNullList(List<String> values) {
        return values == null ? new ArrayList<>() : values;
    }

    private double roundMetric(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
