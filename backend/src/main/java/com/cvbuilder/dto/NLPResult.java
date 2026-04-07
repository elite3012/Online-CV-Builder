package com.cvbuilder.dto;

import java.util.List;

public class NLPResult {

    private String originalText;
    private String normalizedText;
    private List<String> tokens;

    public NLPResult() {}

    public NLPResult(String originalText, String normalizedText, List<String> tokens) {
        this.originalText = originalText;
        this.normalizedText = normalizedText;
        this.tokens = tokens;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getNormalizedText() {
        return normalizedText;
    }

    public void setNormalizedText(String normalizedText) {
        this.normalizedText = normalizedText;
    }

    public List<String> getTokens() {
        return tokens;
    }

    public void setTokens(List<String> tokens) {
        this.tokens = tokens;
    }
}
