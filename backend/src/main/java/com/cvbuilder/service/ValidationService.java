package com.cvbuilder.service;

import com.cvbuilder.dto.ValidationErrorResponse;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validation Service - Handles validation logic (UC6, US12)
 * Provides clear error messages
 */
@Service
public class ValidationService {

    // Simple XSS detection for backend hardening (Sprint 2)
    private static final Pattern XSS_PATTERN = Pattern.compile("(?i)<script.*?>.*?</script.*?>|javascript:|onerror=|onload=|eval\\(|<iframe|<object|<embed|<applet");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    public List<ValidationErrorResponse> validateCvData(String email, String summary, LocalDate startDate, LocalDate endDate) {
        List<ValidationErrorResponse> errors = new ArrayList<>();

        if (!isValidEmail(email)) {
            errors.add(new ValidationErrorResponse("email", "Invalid email format."));
        }

        if (isNotBlank(summary) && containsXssPayload(summary)) {
            errors.add(new ValidationErrorResponse("summary", "Potential malicious script detected in summary."));
        }

        if (startDate != null && endDate != null && !isValidDateRange(startDate, endDate)) {
            errors.add(new ValidationErrorResponse("dates", "End date must be after the start date."));
        }

        return errors.isEmpty() ? null : errors; 
    }

    public boolean containsXssPayload(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        return XSS_PATTERN.matcher(input).find();
    }
    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) return false;
        return EMAIL_PATTERN.matcher(email).matches();
    }
    public boolean isNotBlank(String input) {
        return input != null && !input.trim().isEmpty();
    }
    public boolean isValidDateRange(LocalDate start, LocalDate end) {
        if (start == null || end == null) return true;
        return start.isBefore(end);
    }

    public String sanitizeBasic(String input) {
        if (input == null) return null;
        return input.replaceAll("(?i)<script.*?>.*?</script.*?>", "")
                    .replaceAll("(?i)javascript:", "")
                    .replaceAll("(?i)onerror=", "")
                    .replaceAll("(?i)onload=", "");
    }
}
