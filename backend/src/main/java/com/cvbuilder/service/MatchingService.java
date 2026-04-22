package com.cvbuilder.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cvbuilder.dto.MatchingResult;
import com.cvbuilder.dto.NLPResult;
import com.cvbuilder.model.CV;

@Service
public class MatchingService {

    @Autowired
    private NLPService nlpService;

    @Autowired
    private CVService cvService; // Need this to load CV safely with ownership check

    public MatchingResult checkAtsOnly(Long cvId, String userEmail) {
        CV cv = cvService.getCVByIdAndOwner(cvId, userEmail);

        StringBuilder cvContentBuilder = new StringBuilder();
        appendCvContent(cv, cvContentBuilder);
        String cvContent = cvContentBuilder.toString().trim();

        List<String> atsWarnings = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score = 100;

        if (cvContent.isEmpty()) {
            atsWarnings.add("CV appears to be empty or lacks processable text.");
            suggestions.add("Add a summary, skills, education, and work experience before exporting.");
            return new MatchingResult(0, false, new ArrayList<>(), new ArrayList<>(), atsWarnings, suggestions);
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
        }

        if (isBlank(cv.getSummary())) {
            score -= 15;
            atsWarnings.add("Missing professional summary.");
            suggestions.add("Add a concise 3-4 line summary with target role, experience, and core strengths.");
        }

        if (cv.getSkills() == null || cv.getSkills().isEmpty()) {
            score -= 15;
            atsWarnings.add("Missing skills section.");
            suggestions.add("List hard skills and tools as comma-separated keywords.");
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

        if (suggestions.isEmpty()) {
            suggestions.add("ATS structure looks solid. For better matching, run JD Matching with a complete job description.");
        }

        return new MatchingResult(score, atsPassed, new ArrayList<>(), new ArrayList<>(), atsWarnings, suggestions);
    }

    public MatchingResult matchCvToJd(Long cvId, String jdText, String userEmail) {
        // 1. Load CV and ensure ownership
        CV cv = cvService.getCVByIdAndOwner(cvId, userEmail);

        // 2. Preprocess JD text
        if (jdText == null || jdText.trim().isEmpty()) {
            return buildEmptyResult("Job Description is empty.");
        }
        NLPResult jdNlp = nlpService.preprocessJD(jdText);
        Set<String> jdTokens = new HashSet<>(jdNlp.getTokens());

        if (jdTokens.isEmpty()) {
            return buildEmptyResult("Job Description does not contain recognizable keywords.");
        }

        // 3. Preprocess CV content
        StringBuilder sb = new StringBuilder();
        appendCvContent(cv, sb);
        String cvContent = sb.toString();
        NLPResult cvNlp = nlpService.preprocessCV(cvContent);
        Set<String> cvTokens = new HashSet<>(cvNlp.getTokens());

        if (cvTokens.isEmpty()) {
            return buildEmptyResult("CV appears to be empty or lacks processable text.");
        }

        // 4. Calculate Match overlap (simple Keyword/Token overlap for Sprint 4)
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

        // 5. ATS Rules evaluation
        boolean atsPassed = score >= 60; // Arbitrary Sprint 4 threshold

        List<String> atsWarnings = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        if (score < 40) {
            atsWarnings.add("Low overlap with Job Description keywords. Your CV might be automatically rejected.");
            suggestions.add(
                    "Analyze the 'Missing Skills' and incorporate them naturally into your experience if applicable.");
        } else if (score < 70) {
            suggestions.add("Add more specific keywords from the JD to boost your match score.");
        } else {
            suggestions.add("Good match! Ensure your formatting is clean and easy to read.");
        }

        if (missingSkills.size() > 10) {
            atsWarnings.add("A high number of terms from the JD are missing. Ensure you are targeting the right role.");
        }

        if (cvContent.length() < 200) {
            atsWarnings.add("CV text is very short. ATS may reject resumes lacking adequate detail.");
        }

        // Keep missing and matched lists reasonable length if huge
        if (matchedSkills.size() > 15) {
            matchedSkills = matchedSkills.subList(0, 15);
        }
        if (missingSkills.size() > 15) {
            missingSkills = missingSkills.subList(0, 15);
        }

        return new MatchingResult(score, atsPassed, matchedSkills, missingSkills, atsWarnings, suggestions);
    }

    private MatchingResult buildEmptyResult(String warningMsg) {
        MatchingResult result = new MatchingResult(0, false, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(),
                new ArrayList<>());
        result.getAtsWarnings().add(warningMsg);
        return result;
    }

    private void appendCvContent(CV cv, StringBuilder sb) {
        if (cv.getSummary() != null)
            sb.append(cv.getSummary()).append(" ");
        if (cv.getEducations() != null) {
            cv.getEducations().forEach(e -> {
                if (e.getDegree() != null)
                    sb.append(e.getDegree()).append(" ");
                if (e.getSchool() != null)
                    sb.append(e.getSchool()).append(" ");
                if (e.getDescription() != null)
                    sb.append(e.getDescription()).append(" ");
            });
        }
        if (cv.getExperiences() != null) {
            cv.getExperiences().forEach(e -> {
                if (e.getJobTitle() != null)
                    sb.append(e.getJobTitle()).append(" ");
                if (e.getCompany() != null)
                    sb.append(e.getCompany()).append(" ");
                if (e.getDescription() != null)
                    sb.append(e.getDescription()).append(" ");
            });
        }
        if (cv.getSkills() != null) {
            cv.getSkills().forEach(s -> {
                if (s.getSkillName() != null)
                    sb.append(s.getSkillName()).append(" ");
            });
        }
        if (cv.getProjects() != null) {
            cv.getProjects().forEach(p -> {
                if (p.getProjectName() != null)
                    sb.append(p.getProjectName()).append(" ");
                if (p.getRole() != null)
                    sb.append(p.getRole()).append(" ");
                if (p.getDescription() != null)
                    sb.append(p.getDescription()).append(" ");
            });
        }
        if (cv.getCertificates() != null) {
            cv.getCertificates().forEach(c -> {
                if (c.getCertificateName() != null)
                    sb.append(c.getCertificateName()).append(" ");
                if (c.getOrganization() != null)
                    sb.append(c.getOrganization()).append(" ");
            });
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
