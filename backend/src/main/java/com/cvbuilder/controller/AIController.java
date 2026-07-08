package com.cvbuilder.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cvbuilder.dto.MatchingResult;
import com.cvbuilder.service.MatchingService;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private MatchingService matchingService;

    // Matching front-end payload { cvId, jdText }
    @PostMapping("/analyze-jd")
    public ResponseEntity<?> analyzeJD(@RequestBody Map<String, Object> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Session expired. Please log in again."));
        }
        
        Long cvId = parseCvId(request.get("cvId"));
        String jdText = parseString(request.get("jdText"));
        boolean atsOnly = Boolean.parseBoolean(parseString(request.get("atsOnly")));
        String engine = parseString(request.get("engine"));
        if (engine == null || engine.isBlank()) {
            engine = "auto";
        }

        if (cvId == null || (!atsOnly && (jdText == null || jdText.trim().isEmpty()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please choose a resume and paste a job description."));
        }

        try {
            MatchingResult result = atsOnly
                    ? matchingService.checkAtsOnly(cvId, principal.getName(), engine)
                    : matchingService.matchCvToJd(cvId, jdText, principal.getName(), engine);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("unauthorized") || e.getMessage().contains("not found")) {
                return ResponseEntity.status(403).body(Map.of("message", "CV not found or you do not have access."));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Long parseCvId(Object rawCvId) {
        if (rawCvId == null || rawCvId.toString().isBlank()) {
            return null;
        }

        try {
            return Long.valueOf(rawCvId.toString());
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private String parseString(Object value) {
        return value == null ? null : value.toString();
    }
}
