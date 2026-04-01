package com.cvbuilder.dto;

/**
 * Auth Response DTO - contains JWT token
 */
public class AuthResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String fullName, String email) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
