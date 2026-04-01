package com.cvbuilder.controller;

import com.cvbuilder.dto.RegisterRequest;
import com.cvbuilder.dto.LoginRequest;
import com.cvbuilder.dto.AuthResponse;
import com.cvbuilder.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Pattern;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validation
            if (!Pattern.matches(EMAIL_REGEX, request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email format"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Password minimum length is 8"));
            }
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Passwords do not match"));
            }
            
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Logout is handled client side by removing the token, but we expose the endpoint
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
