package com.cvbuilder.controller;

import com.cvbuilder.dto.RegisterRequest;
import com.cvbuilder.dto.LoginRequest;
import com.cvbuilder.dto.AuthResponse;
import com.cvbuilder.security.JwtUtil;
import com.cvbuilder.service.AuthService;
import com.cvbuilder.security.RateLimiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Duration;
import java.util.regex.Pattern;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    @Value("${auth.cookie.secure:false}")
    private boolean authCookieSecure;

    @Value("${auth.cookie.sameSite:Strict}")
    private String authCookieSameSite;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    public static class UpdateProfileRequest {
        public String fullName;
        public String email;
    }

    public static class ChangePasswordRequest {
        public String currentPassword;
        public String newPassword;
        public String confirmPassword;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validation
            if (request == null || request.getEmail() == null || !Pattern.matches(EMAIL_REGEX, request.getEmail().trim())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email format"));
            }
            if (request.getFullName() == null || request.getFullName().trim().length() < 2) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Full name must be at least 2 characters"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Password minimum length is 8"));
            }
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Passwords do not match"));
            }
            
            AuthResponse response = authService.register(request);
            return authResponse(response, HttpStatus.CREATED);
            
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        String key = request.getEmail().trim().toLowerCase();

        if (rateLimiterService.isBlocked(key)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of(
                            "message", "Too many login attempts. Please try again later.",
                            "retryAfterSeconds", rateLimiterService.retryAfterSeconds(key)
                    ));
        }

        try {
            AuthResponse response = authService.login(request);
            rateLimiterService.recordSuccess(key);
            return authResponse(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            rateLimiterService.recordFailure(key);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Session expired. Please log in again."));
        }

        try {
            return ResponseEntity.ok(authService.getCurrentUser(principal.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Session expired. Please log in again."));
        }

        if (request.fullName == null || request.fullName.trim().length() < 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Full name must be at least 2 characters"));
        }

        if (request.email == null || !Pattern.matches(EMAIL_REGEX, request.email.trim())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email format"));
        }

        try {
            AuthResponse response = authService.updateCurrentUser(principal.getName(), request.fullName, request.email);
            return authResponse(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Session expired. Please log in again."));
        }

        if (request.currentPassword == null || request.currentPassword.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Current password is required"));
        }

        if (request.newPassword == null || request.newPassword.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Password minimum length is 8"));
        }

        if (!request.newPassword.equals(request.confirmPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Passwords do not match"));
        }

        try {
            AuthResponse response = authService.changePassword(principal.getName(), request.currentPassword, request.newPassword);
            return authResponse(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.SET_COOKIE, clearAuthCookie().toString())
                    .body(Map.of("message", "Session expired. Please log in again."));
        }

        authService.logout(principal.getName());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearAuthCookie().toString())
                .body(Map.of("message", "Logged out successfully"));
    }

    private ResponseEntity<AuthResponse> authResponse(AuthResponse response, HttpStatus status) {
        AuthResponse body = new AuthResponse(null, response.getId(), response.getFullName(), response.getEmail());

        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, buildAuthCookie(response.getToken()).toString())
                .body(body);
    }

    private ResponseCookie buildAuthCookie(String token) {
        return ResponseCookie.from(JwtUtil.AUTH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(authCookieSecure)
                .sameSite(authCookieSameSite)
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpirationMs))
                .build();
    }

    private ResponseCookie clearAuthCookie() {
        return ResponseCookie.from(JwtUtil.AUTH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(authCookieSecure)
                .sameSite(authCookieSameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }
}
