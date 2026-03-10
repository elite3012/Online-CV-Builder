package com.cvbuilder.controller;

import org.springframework.web.bind.annotation.*;

/**
 * Auth Controller - Handles user authentication (UC1, UC2, US1)
 * Register, Login, Logout
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    // POST /api/auth/register - UC1 Register Account
    // POST /api/auth/login - UC2 Log In
    // POST /api/auth/logout - Logout
}
