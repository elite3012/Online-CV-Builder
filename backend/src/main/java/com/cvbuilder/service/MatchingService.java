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
        if (cv.getSummary() != null)
            sb.append(cv.getSummary()).append(" ");
        if (cv.getEducations() != null) {
            cv.getEducations().forEach(e -> {
                if (e.getDegree() != null)
                    sb.append(e.getDegree()).append(" ");
                // if (e.getMajor() != null) sb.append(e.getMajor()).append(" ");
                if (e.getSchool() != null)
                    sb.append(e.getSchool()).append(" ");
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
                if (p.getDescription() != null)
                    sb.append(p.getDescription()).append(" ");
            });
        }
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
}
