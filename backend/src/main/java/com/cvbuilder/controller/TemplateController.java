package com.cvbuilder.controller;

import org.springframework.web.bind.annotation.*;

/**
 * Template Controller - Handles CV template operations (UC5A, US7)
 * Get available templates for user selection
 */
@RestController
@RequestMapping("/api/template")
@CrossOrigin(origins = "*")
public class TemplateController {

    // GET /api/template - Get all available templates
    // GET /api/template/{id} - Get specific template details
}
