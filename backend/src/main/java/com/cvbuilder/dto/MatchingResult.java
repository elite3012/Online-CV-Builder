package com.cvbuilder.dto;

import java.util.List;

public class MatchingResult {

    private int score;
    private boolean atsPassed;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> atsWarnings;
    private List<String> suggestions;

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

}
