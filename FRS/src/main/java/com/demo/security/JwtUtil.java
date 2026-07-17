package com.demo.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Secret key (must be at least 32 characters)
    private static final String SECRET =
            "mySecretKeyForFlightReservationSystem2026";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Token valid for 24 hours
    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

    // Generate JWT Token
    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    // Extract Email
    public String extractUsername(String token) {

        return getClaims(token).getSubject();
    }

    // Validate Token
    public boolean validateToken(String token, String email) {

        return extractUsername(token).equals(email)
                && !isTokenExpired(token);
    }

    // Check Expiry
    private boolean isTokenExpired(String token) {

        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // Read Claims
    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}