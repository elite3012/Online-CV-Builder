package com.cvbuilder.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cvbuilder.dto.NLPResult;

@Service
public class NLPService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
        "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", 
        "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", 
        "that", "the", "their", "then", "there", "these", "they", "this", 
        "to", "was", "will", "with", "who", "which", "where", "our", "we"
    ));

    public NLPResult preprocessJD(String jdText) {
        if (jdText == null || jdText.trim().isEmpty()) {
            return new NLPResult("", "", List.of());
        }
        return preprocessText(jdText);
    }

    public NLPResult preprocessCV(String cvContentJson) {
        if (cvContentJson == null || cvContentJson.trim().isEmpty()) {
            return new NLPResult("", "", List.of());
        }
        String cvText = buildCVText(cvContentJson);
        return preprocessText(cvText);
    }

    public NLPResult preprocessText(String rawText) {
        if (rawText == null) {
            return new NLPResult("", "", List.of());
        }

        String normalizedText = normalizeWhitespace(rawText);
        String cleanedText = removePunctuation(normalizedText.toLowerCase());
        List<String> tokens = tokenize(cleanedText);
        List<String> cleanTokens = removeStopwords(tokens);
        
        // In the future, light stemming or semantic normalization can be added here
        
        return new NLPResult(rawText, normalizedText, cleanTokens);
    }

    private String removePunctuation(String text) {
        if (text == null) return "";
        // Replaces all punctuation and special chars except alphanumeric and spaces
        return text.replaceAll("[^a-zA-Z0-9\\s]", " ");
    }

    private String normalizeWhitespace(String text) {
        if (text == null) return "";
        return text.trim().replaceAll("\\s+", " ");
    }

    private List<String> tokenize(String text) {
        if (text == null || text.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.stream(text.split("\\s+"))
                .filter(w -> !w.isEmpty())
                .collect(Collectors.toList());
    }

    private List<String> removeStopwords(List<String> tokens) {
        return tokens.stream()
                .filter(token -> !STOPWORDS.contains(token))
                .collect(Collectors.toList());
    }

    private String buildCVText(String cvContentJson) {
        try {
            Map<String, Object> map = objectMapper.readValue(cvContentJson, new TypeReference<Map<String, Object>>() {});
            StringBuilder sb = new StringBuilder();

            appendField(sb, map.get("summary"));
            appendField(sb, map.get("skills"));

            if (map.containsKey("experience")) {
                Object expObj = map.get("experience");
                if (expObj instanceof List) {
                    for (Object exp : (List<?>) expObj) {
                        if (exp instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> expMap = (Map<String, Object>) exp;
                            appendField(sb, expMap.get("role"));
                            appendField(sb, expMap.get("description"));
                        }
                    }
                }
            }

            if (map.containsKey("education")) {
                Object eduObj = map.get("education");
                if (eduObj instanceof List) {
                    for (Object edu : (List<?>) eduObj) {
                        if (edu instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> eduMap = (Map<String, Object>) edu;
                            appendField(sb, eduMap.get("degree"));
                            appendField(sb, eduMap.get("school"));
                            appendField(sb, eduMap.get("description"));
                        }
                    }
                }
            }

            if (map.containsKey("projects")) {
                Object projObj = map.get("projects");
                if (projObj instanceof List) {
                    for (Object proj : (List<?>) projObj) {
                        if (proj instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> projMap = (Map<String, Object>) proj;
                            appendField(sb, projMap.get("name"));
                            appendField(sb, projMap.get("role"));
                            appendField(sb, projMap.get("description"));
                        }
                    }
                }
            }

            if (map.containsKey("certificates")) {
                Object certObj = map.get("certificates");
                if (certObj instanceof List) {
                    for (Object cert : (List<?>) certObj) {
                        if (cert instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> certMap = (Map<String, Object>) cert;
                            appendField(sb, certMap.get("name"));
                        }
                    }
                }
            }

            return normalizeWhitespace(sb.toString());
        } catch (Exception e) {
            // Log warning if needed, but fall back to just using the raw string itself
            // Removing braces and quotes to get a raw string representation of JSON
            return normalizeWhitespace(cvContentJson.replaceAll("[\"{}\\[\\]:]", " "));
        }
    }

    private void appendField(StringBuilder sb, Object textObj) {
        if (textObj != null) {
            String text = textObj.toString().trim();
            if (!text.isEmpty()) {
                sb.append(text).append(" ");
            }
        }
    }
}