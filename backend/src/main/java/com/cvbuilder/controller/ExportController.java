package com.cvbuilder.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cvbuilder.model.CV;
import com.cvbuilder.service.CVService;
import com.cvbuilder.service.ExportService;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private CVService cvService;

    @Autowired
    private ExportService exportService;

    @GetMapping("/pdf/{cvId}")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long cvId, Principal principal) {
        CV cv = cvService.getCVByIdAndOwner(cvId, principal.getName());
        byte[] fileData = exportService.exportCvToPdf(cv);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + buildFileName(cv, "pdf") + "\"")
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .body(fileData);
    }

    @GetMapping("/docx/{cvId}")
    public ResponseEntity<byte[]> exportDocx(@PathVariable Long cvId, Principal principal) {
        CV cv = cvService.getCVByIdAndOwner(cvId, principal.getName());
        byte[] fileData = exportService.exportCvToDocx(cv);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + buildFileName(cv, "docx") + "\"")
            .header(HttpHeaders.CONTENT_TYPE,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                .body(fileData);
    }

    private String buildFileName(CV cv, String extension) {
        String baseName = cv.getTitle();
        if (baseName == null || baseName.trim().isEmpty()) {
            baseName = "cv-" + cv.getId();
        }

        String sanitized = baseName.trim().toLowerCase().replaceAll("[^a-z0-9-]+", "-").replaceAll("-+", "-");
        sanitized = sanitized.replaceAll("(^-|-$)", "");

        if (sanitized.isEmpty()) {
            sanitized = "cv-" + cv.getId();
        }

        return sanitized + "." + extension;
    }
}
