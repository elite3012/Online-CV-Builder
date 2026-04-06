package com.cvbuilder.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

/**
 * Validation Service - Handles validation logic (UC6, US12)
 * Provides clear error messages
 */
@Service
public class ValidationService {

    // Simple XSS detection for backend hardening (Sprint 2)
    private static final Pattern XSS_PATTERN = Pattern.compile("(?i)<script.*?>.*?</script.*?>|javascript:|onerror=|onload=|eval\\(|<iframe|<object|<embed|<applet");

    public boolean containsXssPayload(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        return XSS_PATTERN.matcher(input).find();
    }

    public String sanitizeBasic(String input) {
        if (input == null) return null;
        return input.replaceAll("(?i)<script.*?>.*?</script.*?>", "")
                    .replaceAll("(?i)javascript:", "")
                    .replaceAll("(?i)onerror=", "")
                    .replaceAll("(?i)onload=", "");
    }

    // Validate email format
    // Validate required fields
    // Validate date ranges
    // Generate clear error messages
}
