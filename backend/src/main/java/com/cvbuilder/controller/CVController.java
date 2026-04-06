package com.cvbuilder.controller;

import com.cvbuilder.model.CV;
import com.cvbuilder.service.CVService;
import com.cvbuilder.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cv")
@CrossOrigin(origins = "*") 
public class CVController {

    @Autowired
    private CVService cvService;
    
    @Autowired
    private ValidationService validationService;

    public static class CreateCVRequest {
        public String title;
        public Long templateId;
    }

    public static class UpdateCVRequest {
        public String title;
        public String content;
    }

    @GetMapping
    public ResponseEntity<List<CV>> getAllCVs(Principal principal) {
        List<CV> cvs = cvService.getAllCVsForUser(principal.getName());
        return ResponseEntity.ok(cvs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CV> getCV(@PathVariable Long id, Principal principal) {
        CV cv = cvService.getCVByIdAndOwner(id, principal.getName());
        return ResponseEntity.ok(cv);
    }

    @PostMapping
    public ResponseEntity<CV> createCV(@RequestBody CreateCVRequest request, Principal principal) {
        if (request.title == null || request.title.trim().isEmpty() || request.templateId == null) {
            return ResponseEntity.badRequest().build(); 
        }
        
        CV createdCV = cvService.createCV(request.title, request.templateId, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCV);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCV(@PathVariable Long id, @RequestBody UpdateCVRequest request, Principal principal) {
        if (request.title == null || request.title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title cannot be empty");
        }
        if (validationService.containsXssPayload(request.content)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("XSS payload detected in content. Request rejected.");
        }
        
        CV updatedCV = cvService.updateCV(id, request.title, request.content, principal.getName());
        return ResponseEntity.ok(updatedCV);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCV(@PathVariable Long id, Principal principal) {
        cvService.deleteCV(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}