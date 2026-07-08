package com.cvbuilder.security;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    public static final String AUTH_COOKIE_NAME = "cvb_auth";
    private static final String TOKEN_VERSION_CLAIM = "tokenVersion";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expirationMs:1800000}") // Default 30 minutes
    private long jwtExpirationMs;

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, int tokenVersion) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(email)
                .claim(TOKEN_VERSION_CLAIM, tokenVersion)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // e.g. ExpiredJwtException, UnsupportedJwtException, MalformedJwtException,
            // SignatureException, IllegalArgumentException
            log.warn("JWT invalid: {}", e.getClass().getSimpleName());
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public int getTokenVersionFromToken(String token) {
        Object version = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get(TOKEN_VERSION_CLAIM);

        if (version instanceof Number number) {
            return number.intValue();
        }
        if (version instanceof String text) {
            return Integer.parseInt(text);
        }
        return 0;
    }
}
