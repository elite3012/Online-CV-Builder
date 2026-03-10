package com.cvbuilder.controller;

import org.springframework.web.bind.annotation.*;

/**
 * Export Controller - Handles CV export to PDF/DOCX (UC5B, US8)
 * Includes validation, template loading, and ownership checks
 */
@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    // POST /api/export/{cvId}/pdf - Export CV to PDF
    // POST /api/export/{cvId}/docx - Export CV to DOCX
    // Must validate CV, load template, check ownership before export
}
