package com.cvbuilder.controller;

import com.cvbuilder.model.CV;
import com.cvbuilder.service.CVService;
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

    public static class CreateCVRequest {
        public String title;
        public Long templateId;
    }

    public static class UpdateCVRequest {
        public String title;
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
    public ResponseEntity<CV> updateCV(@PathVariable Long id, @RequestBody UpdateCVRequest request, Principal principal) {
        if (request.title == null || request.title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        CV updatedCV = cvService.updateCVTitle(id, request.title, principal.getName());
        return ResponseEntity.ok(updatedCV);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCV(@PathVariable Long id, Principal principal) {
        cvService.deleteCV(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}