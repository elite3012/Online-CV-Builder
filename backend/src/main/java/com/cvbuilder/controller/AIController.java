package com.cvbuilder.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cvbuilder.dto.MatchingResult;
import com.cvbuilder.service.MatchingService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private MatchingService matchingService;

    // Matching front-end payload { cvId, jdText }
    @PostMapping("/analyze-jd")
    public ResponseEntity<?> analyzeJD(@RequestBody Map<String, Object> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Session expired. Please log in again."));
        }
        
        Long cvId = request.containsKey("cvId") ? Long.valueOf(request.get("cvId").toString()) : null;
        String jdText = request.containsKey("jdText") ? request.get("jdText").toString() : null;
        boolean atsOnly = request.containsKey("atsOnly") && Boolean.parseBoolean(request.get("atsOnly").toString());

        if (cvId == null || (!atsOnly && (jdText == null || jdText.trim().isEmpty()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please choose a resume and paste a job description."));
        }

        try {
            MatchingResult result = atsOnly
                    ? matchingService.checkAtsOnly(cvId, principal.getName())
                    : matchingService.matchCvToJd(cvId, jdText, principal.getName());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("unauthorized") || e.getMessage().contains("not found")) {
                return ResponseEntity.status(403).body(Map.of("message", "CV not found or you do not have access."));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
