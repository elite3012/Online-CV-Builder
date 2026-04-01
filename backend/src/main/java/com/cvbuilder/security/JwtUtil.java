package com.cvbuilder.security;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private String secret = "thisisasecretkeyfortestpurposesonlysochangeitinprod123456789";

    // Basic sprint 2 mock impl, recommend io.jsonwebtoken:jjwt-api:0.11.5
    public String generateToken(String email) {
        return "mock-jwt-token." + email; // Mock format
    }

    public boolean validateToken(String token) {
        return token != null && token.startsWith("mock-jwt-token");
    }

    public String getEmailFromToken(String token) {
        return token.replace("mock-jwt-token.", "");
    }
}
