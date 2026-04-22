package com.cvbuilder.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cvbuilder.model.CV;
import com.cvbuilder.model.Certificate;
import com.cvbuilder.model.Education;
import com.cvbuilder.model.Experience;
import com.cvbuilder.model.PersonalInformation;
import com.cvbuilder.model.Project;
import com.cvbuilder.model.Skill;
import com.cvbuilder.service.CVService;
import com.cvbuilder.service.ValidationService;

@RestController
@RequestMapping("/api/cv")
@CrossOrigin(origins = "http://localhost:3000")
public class CVController {

    @Autowired
    private CVService cvService;

    @Autowired
    private ValidationService validationService;

    public static class CreateCVRequest {
        public Long templateId;
        public String title;
    }

    public static class UpdateCVRequest {
        public String title;
        public Long templateId;
        public String summary;
        public PersonalInformation personalInformation;
        public List<Education> educations;
        public List<Experience> experiences;
        public List<Project> projects;
        public List<Certificate> certificates;
        public List<Skill> skills;
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
        if (request.templateId == null) {
            return ResponseEntity.badRequest().build();
        }

        CV createdCV = cvService.createCV(request.templateId, request.title, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCV);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCV(@PathVariable Long id, @RequestBody UpdateCVRequest request,
            Principal principal) {
        if (request.summary != null && validationService.containsXssPayload(request.summary)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("XSS payload detected in summary. Request rejected.");
        }

        CV updatedCV = cvService.updateCV(id, request, principal.getName());
        return ResponseEntity.ok(updatedCV);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCV(@PathVariable Long id, Principal principal) {
        cvService.deleteCV(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
