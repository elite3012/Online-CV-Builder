package com.cvbuilder.dto;

import java.util.List;

import com.cvbuilder.model.CV;

public class ImportedCvResult {
    private CV cv;
    private String detectedRole;
    private String suggestedTemplate;
    private Double confidence;
    private List<String> insights;

    public ImportedCvResult(CV cv, String detectedRole, String suggestedTemplate, Double confidence,
            List<String> insights) {
        this.cv = cv;
        this.detectedRole = detectedRole;
        this.suggestedTemplate = suggestedTemplate;
        this.confidence = confidence;
        this.insights = insights;
    }

    public CV getCv() {
        return cv;
    }

    public void setCv(CV cv) {
        this.cv = cv;
    }

    public String getDetectedRole() {
        return detectedRole;
    }

    public void setDetectedRole(String detectedRole) {
        this.detectedRole = detectedRole;
    }

    public String getSuggestedTemplate() {
        return suggestedTemplate;
    }

    public void setSuggestedTemplate(String suggestedTemplate) {
        this.suggestedTemplate = suggestedTemplate;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public List<String> getInsights() {
        return insights;
    }

    public void setInsights(List<String> insights) {
        this.insights = insights;
    }
}
