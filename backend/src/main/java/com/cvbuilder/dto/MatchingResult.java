package com.cvbuilder.dto;

import java.util.List;

public class MatchingResult {

    private int score;
    private boolean atsPassed;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> atsWarnings;
    private List<String> suggestions;
    private String analysisEngine;
    private Double semanticScore;
    private Double keywordCoverage;
    private Double sectionCoverage;
    private List<String> strengths;
    private List<String> focusAreas;

    public MatchingResult() {
    }

    public MatchingResult(int score, boolean atsPassed, List<String> matchedSkills, List<String> missingSkills,
            List<String> atsWarnings, List<String> suggestions) {
        this.score = score;
        this.atsPassed = atsPassed;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.atsWarnings = atsWarnings;
        this.suggestions = suggestions;
    }

    public MatchingResult(int score, boolean atsPassed, List<String> matchedSkills, List<String> missingSkills,
            List<String> atsWarnings, List<String> suggestions, String analysisEngine, Double semanticScore,
            Double keywordCoverage, Double sectionCoverage, List<String> strengths, List<String> focusAreas) {
        this.score = score;
        this.atsPassed = atsPassed;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.atsWarnings = atsWarnings;
        this.suggestions = suggestions;
        this.analysisEngine = analysisEngine;
        this.semanticScore = semanticScore;
        this.keywordCoverage = keywordCoverage;
        this.sectionCoverage = sectionCoverage;
        this.strengths = strengths;
        this.focusAreas = focusAreas;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public boolean isAtsPassed() {
        return atsPassed;
    }

    public void setAtsPassed(boolean atsPassed) {
        this.atsPassed = atsPassed;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getAtsWarnings() {
        return atsWarnings;
    }

    public void setAtsWarnings(List<String> atsWarnings) {
        this.atsWarnings = atsWarnings;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public String getAnalysisEngine() {
        return analysisEngine;
    }

    public void setAnalysisEngine(String analysisEngine) {
        this.analysisEngine = analysisEngine;
    }

    public Double getSemanticScore() {
        return semanticScore;
    }

    public void setSemanticScore(Double semanticScore) {
        this.semanticScore = semanticScore;
    }

    public Double getKeywordCoverage() {
        return keywordCoverage;
    }

    public void setKeywordCoverage(Double keywordCoverage) {
        this.keywordCoverage = keywordCoverage;
    }

    public Double getSectionCoverage() {
        return sectionCoverage;
    }

    public void setSectionCoverage(Double sectionCoverage) {
        this.sectionCoverage = sectionCoverage;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getFocusAreas() {
        return focusAreas;
    }

    public void setFocusAreas(List<String> focusAreas) {
        this.focusAreas = focusAreas;
    }

}
