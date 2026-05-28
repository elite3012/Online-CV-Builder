package com.cvbuilder.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cvbuilder.dto.NLPResult;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NLPService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
            "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if",
            "in", "into", "is", "it", "no", "not", "of", "on", "or", "such",
            "that", "the", "their", "then", "there", "these", "they", "this",
            "to", "was", "will", "with", "who", "which", "where", "our", "we",
            "your", "you", "from", "than", "while", "across", "under", "using"));

    private static final Set<String> GENERIC_TERMS = new HashSet<>(Arrays.asList(
            "ability", "background", "candidate", "communication", "company", "culture",
            "degree", "duties", "environment", "experience", "ideal", "including",
            "knowledge", "looking", "manage", "management", "metric", "metrics",
            "opportunity", "preferred", "qualification", "qualifications", "required",
            "requirements", "requiring", "responsibilities", "responsibility", "role",
            "skills", "strong", "team", "using", "work", "working", "years", "profile",
            "task", "tasks", "join", "basic", "good", "minimal", "guidance", "support",
            "understand", "understanding", "willingness", "interest", "majoring"));

    private static final Set<String> SINGLE_TERM_ALLOWLIST = new HashSet<>(Arrays.asList(
            "python", "java", "react", "spring", "sql", "postgresql", "docker",
            "kubernetes", "aws", "azure", "gcp", "git", "linux", "tensorflow",
            "pytorch", "langchain", "sharepoint", "devops", "nlp", "llm", "rag",
            "fastapi", "django", "flask", "transformers", "retrieval", "summarization",
            "evaluation", "accuracy", "latency", "analytics", "english", "chatbot"));

    private static final List<String> SIGNAL_PHRASES = List.of(
            "microsoft copilot studio",
            "langchain framework",
            "ai agent architecture",
            "engineering use cases",
            "data ingestion pipelines",
            "data ingestion pipeline",
            "enterprise data sources",
            "enterprise data source",
            "intelligent retrieval",
            "test report summarization",
            "problem solving support",
            "power platform",
            "software engineering",
            "computer science",
            "data engineering",
            "machine learning",
            "deep learning",
            "rest apis",
            "rest api",
            "agent development",
            "chatbot development",
            "document analysis",
            "agent workflows",
            "prompt design",
            "tool integration",
            "memory management",
            "problem solving",
            "international team",
            "english communication",
            "product owners",
            "data experts",
            "ai agents",
            "ai agent",
            "copilot studio");

    private static final Set<String> SIGNAL_KEYWORDS = new HashSet<>(Arrays.asList(
            "ai", "agent", "agents", "architecture", "copilot", "studio", "langchain",
            "python", "azure", "devops", "sharepoint", "database", "databases", "api",
            "apis", "retrieval", "summarization", "document", "analysis", "engineering",
            "platform", "power", "evaluation", "accuracy", "latency", "chatbot",
            "machine", "learning", "deep", "english", "communication", "workflow",
            "workflows", "prompt", "integration", "memory", "testing", "enterprise"));

    private static final Pattern STRUCTURED_SECTION_PATTERN = Pattern.compile(
            "(?im)^(job title|company / industry|responsibilities|required skills|qualifications|nice-to-have)\\s*:\\s*");

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
        String cleanedText = normalizeForMatching(normalizedText);
        List<String> tokens = tokenize(cleanedText);
        List<String> cleanTokens = removeStopwords(tokens);

        return new NLPResult(rawText, normalizedText, cleanTokens);
    }

    public List<String> extractMatchSignals(String rawText) {
        if (rawText == null || rawText.trim().isEmpty()) {
            return List.of();
        }

        LinkedHashSet<String> signals = new LinkedHashSet<>();
        Map<String, String> structuredSections = parseStructuredSections(rawText);

        addSignal(signals, normalizePhrase(structuredSections.get("job title"), 6, true));
        extractSectionSignals(signals, structuredSections.get("responsibilities"));
        extractSectionSignals(signals, structuredSections.get("required skills"));
        extractSectionSignals(signals, structuredSections.get("qualifications"));
        extractSectionSignals(signals, structuredSections.get("nice-to-have"));
        addSignal(signals, normalizePhrase(structuredSections.get("company / industry"), 4, true));
        extractKnownSignals(signals, rawText);

        if (signals.isEmpty()) {
            extractSectionSignals(signals, rawText);
            extractKnownSignals(signals, rawText);
        }

        return signals.stream().limit(12).collect(Collectors.toList());
    }

    public Set<String> buildTokenSet(String text) {
        return tokenize(normalizeForMatching(text)).stream()
                .map(this::normalizeToken)
                .filter(token -> !token.isBlank())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public String normalizeForMatching(String text) {
        if (text == null) {
            return "";
        }

        return normalizeWhitespace(text.toLowerCase(Locale.ROOT))
                .replaceAll("\\b(?:e\\.?g\\.?|i\\.?e\\.?)\\b", " ")
                .replaceAll("[^a-zA-Z0-9+#./\\s-]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    public boolean matchesSignal(String signal, String normalizedText, Set<String> tokenSet) {
        String normalizedSignal = normalizePhrase(signal, 6, true);
        if (normalizedSignal.isBlank()) {
            return false;
        }

        List<String> signalTokens = tokenize(normalizedSignal).stream()
                .map(this::normalizeToken)
                .filter(token -> !token.isBlank())
                .collect(Collectors.toList());

        if (signalTokens.isEmpty()) {
            return false;
        }

        if (signalTokens.size() == 1) {
            return tokenSet.contains(signalTokens.get(0));
        }

        if (containsWholePhrase(normalizedText, normalizedSignal)) {
            return true;
        }

        return signalTokens.stream().allMatch(tokenSet::contains);
    }

    private void extractSectionSignals(Set<String> signals, String sectionText) {
        if (sectionText == null || sectionText.isBlank()) {
            return;
        }

        String[] chunks = sectionText.split("[\\n,;|]");
        for (String chunk : chunks) {
            String cleanedChunk = cleanupSignalText(chunk);
            if (cleanedChunk.isBlank()) {
                continue;
            }

            boolean foundKnownSignal = extractKnownSignals(signals, cleanedChunk);
            if (!foundKnownSignal) {
                String shortPhrase = normalizePhrase(cleanedChunk, 3, false);
                if (!shortPhrase.isBlank()) {
                    addSignal(signals, shortPhrase);
                }
                extractMeaningfulNgrams(signals, cleanedChunk, 3, 2);
            }
        }
    }

    private boolean extractKnownSignals(Set<String> signals, String text) {
        String normalizedText = normalizeForMatching(text);
        if (normalizedText.isBlank()) {
            return false;
        }

        boolean found = false;
        Set<String> tokenSet = buildTokenSet(normalizedText);
        for (String phrase : SIGNAL_PHRASES) {
            if (matchesSignal(phrase, normalizedText, tokenSet)) {
                found = addSignal(signals, phrase) || found;
            }
        }

        for (String term : SINGLE_TERM_ALLOWLIST) {
            if (matchesSignal(term, normalizedText, tokenSet)) {
                found = addSignal(signals, term) || found;
            }
        }

        return found;
    }

    private void extractMeaningfulNgrams(Set<String> signals, String text, int maxSize, int minSize) {
        List<String> tokens = tokenize(normalizeForMatching(cleanupSignalText(text))).stream()
                .map(this::normalizeToken)
                .filter(token -> !token.isBlank())
                .collect(Collectors.toList());

        for (int size = maxSize; size >= minSize; size--) {
            for (int index = 0; index <= tokens.size() - size; index++) {
                List<String> window = tokens.subList(index, index + size);
                if (!isUsefulSignalWindow(window)) {
                    continue;
                }
                addSignal(signals, String.join(" ", window));
            }
        }
    }

    private boolean isUsefulSignalWindow(List<String> window) {
        if (window.isEmpty()) {
            return false;
        }
        if (window.stream().anyMatch(token -> token.length() <= 1)) {
            return false;
        }
        if (STOPWORDS.contains(window.get(0)) || STOPWORDS.contains(window.get(window.size() - 1))) {
            return false;
        }
        if (GENERIC_TERMS.contains(window.get(0)) || GENERIC_TERMS.contains(window.get(window.size() - 1))) {
            return false;
        }
        if (window.stream().allMatch(GENERIC_TERMS::contains)) {
            return false;
        }
        return window.stream().anyMatch(this::isSignalKeyword);
    }

    private boolean isSignalKeyword(String token) {
        return SIGNAL_KEYWORDS.contains(token)
                || SINGLE_TERM_ALLOWLIST.contains(token)
                || token.contains("+")
                || token.contains("#")
                || token.contains("/");
    }

    private Map<String, String> parseStructuredSections(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return Collections.emptyMap();
        }

        Matcher matcher = STRUCTURED_SECTION_PATTERN.matcher(rawText);
        Map<String, String> sections = new LinkedHashMap<>();
        String currentLabel = null;
        int currentStart = 0;

        while (matcher.find()) {
            if (currentLabel != null) {
                sections.put(currentLabel, rawText.substring(currentStart, matcher.start()).trim());
            }
            currentLabel = matcher.group(1).trim().toLowerCase(Locale.ROOT);
            currentStart = matcher.end();
        }

        if (currentLabel != null) {
            sections.put(currentLabel, rawText.substring(currentStart).trim());
        }

        return sections;
    }

    private boolean containsWholePhrase(String normalizedText, String phrase) {
        String escapedPhrase = Pattern.quote(normalizePhrase(phrase, 6, true));
        if (escapedPhrase.isBlank()) {
            return false;
        }
        return Pattern.compile("(^|\\s)" + escapedPhrase + "(\\s|$)").matcher(normalizedText).find();
    }

    private String cleanupSignalText(String text) {
        if (text == null) {
            return "";
        }

        return normalizeWhitespace(text)
                .replaceAll("(?i)^(your\\s+tasks?|your\\s+profile|join\\s+as)\\s*:?\\s*", "")
                .replaceAll("(?i)\\b(?:e\\.?g\\.?|i\\.?e\\.?)\\b", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String normalizePhrase(String phrase, int maxWords, boolean allowSingleWord) {
        String cleaned = cleanupSignalText(phrase);
        if (cleaned.isBlank()) {
            return "";
        }

        List<String> tokens = tokenize(normalizeForMatching(cleaned)).stream()
                .map(this::normalizeToken)
                .filter(token -> !token.isBlank())
                .collect(Collectors.toCollection(ArrayList::new));

        while (!tokens.isEmpty() && (STOPWORDS.contains(tokens.get(0)) || GENERIC_TERMS.contains(tokens.get(0)))) {
            tokens.remove(0);
        }
        while (!tokens.isEmpty()
                && (STOPWORDS.contains(tokens.get(tokens.size() - 1))
                        || GENERIC_TERMS.contains(tokens.get(tokens.size() - 1)))) {
            tokens.remove(tokens.size() - 1);
        }

        if (tokens.isEmpty() || tokens.size() > maxWords) {
            return "";
        }

        if (tokens.size() == 1) {
            return allowSingleWord && SINGLE_TERM_ALLOWLIST.contains(tokens.get(0))
                    ? tokens.get(0)
                    : "";
        }

        if (tokens.stream().allMatch(GENERIC_TERMS::contains)) {
            return "";
        }

        if (!tokens.stream().anyMatch(this::isSignalKeyword)) {
            return "";
        }

        return String.join(" ", tokens);
    }

    private boolean addSignal(Set<String> signals, String signal) {
        String cleaned = normalizePhrase(signal, 6, true);
        if (!cleaned.isBlank()) {
            return signals.add(cleaned);
        }
        return false;
    }

    private String normalizeWhitespace(String text) {
        if (text == null) {
            return "";
        }
        return text.trim().replaceAll("\\s+", " ");
    }

    private List<String> tokenize(String text) {
        if (text == null || text.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.stream(text.split("\\s+"))
                .filter(word -> !word.isEmpty())
                .collect(Collectors.toList());
    }

    private List<String> removeStopwords(List<String> tokens) {
        return tokens.stream()
                .filter(token -> !STOPWORDS.contains(token))
                .collect(Collectors.toList());
    }

    private String normalizeToken(String token) {
        String normalized = token.toLowerCase(Locale.ROOT)
                .replaceAll("^[^a-z0-9+#/-]+|[^a-z0-9+#/-]+$", "")
                .trim();

        if (normalized.endsWith("ies") && normalized.length() > 4) {
            return normalized.substring(0, normalized.length() - 3) + "y";
        }
        if (normalized.endsWith("s") && normalized.length() > 3 && !normalized.endsWith("ss")) {
            return normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    private String buildCVText(String cvContentJson) {
        try {
            Map<String, Object> map = objectMapper.readValue(cvContentJson, new TypeReference<Map<String, Object>>() {
            });
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
