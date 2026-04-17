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
    public ResponseEntity<MatchingResult> analyzeJD(@RequestBody Map<String, Object> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        Long cvId = request.containsKey("cvId") ? Long.valueOf(request.get("cvId").toString()) : null;
        String jdText = request.containsKey("jdText") ? request.get("jdText").toString() : null;

        if (cvId == null || jdText == null || jdText.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            MatchingResult result = matchingService.matchCvToJd(cvId, jdText, principal.getName());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("unauthorized") || e.getMessage().contains("not found")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.badRequest().build();
        }
    }
}
