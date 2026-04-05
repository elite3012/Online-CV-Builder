package com.cvbuilder.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cvbuilder.model.Template;
import com.cvbuilder.service.TemplateService;

/**
 * Template Controller - Handles CV template operations (UC5A, US7)
 * Get available templates for user selection
 */
@RestController
@RequestMapping("/api/template")
@CrossOrigin(origins = "*")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @GetMapping()
    public List<Template> getAllTemplates() {
        return templateService.getAllTemplates();
    }

    @GetMapping("/{id}")
    public Optional<Template> getTemplateById(@PathVariable Long id) {
        return templateService.getTemplateById(id);
    }
}
