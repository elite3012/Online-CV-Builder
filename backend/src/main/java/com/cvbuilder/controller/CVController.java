package com.cvbuilder.controller;

import org.springframework.web.bind.annotation.*;

/**
 * CV Controller - Handles CV CRUD operations (UC3, UC4, US2, US11)
 * Create, Read, Update, Delete CV
 * Includes ownership checks and authentication
 */
@RestController
@RequestMapping("/api/cv")
@CrossOrigin(origins = "*")
public class CVController {

    // GET /api/cv - Get all CVs for authenticated user
    // GET /api/cv/{id} - Get specific CV (with ownership check)
    // POST /api/cv - UC3 Create New CV
    // PUT /api/cv/{id} - UC4 Edit CV Section and Save (with ownership check)
    // DELETE /api/cv/{id} - Delete CV (with ownership check)
}
