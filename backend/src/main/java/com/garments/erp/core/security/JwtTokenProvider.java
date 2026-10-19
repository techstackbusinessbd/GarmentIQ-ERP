package com.garments.erp.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * =============================================================================
 * [EN] Cryptographic JWT Token Provider and Verification Component (JJWT 0.12.x)
 * [BN] ক্রিপ্টোগ্রাফিক জেডব্লিউটি টোকেন প্রস্তুতকারী ও যাচাইকরণ কম্পোনেন্ট
 * =============================================================================
 * [EN] Issues digitally signed HMAC-SHA256 tokens encapsulating multi-tenant claims
 *      (tenant_id, user_id, roles, permissions) and cryptographically validates tokens.
 * [BN] মাল্টি-টেন্যান্ট ক্লেইমস (tenant_id, user_id, roles, permissions) অন্তর্ভুক্ত করে
 *      ডিজিটালি সাইন করা HMAC-SHA256 টোকেন তৈরি এবং স্বাক্ষর যাচাই করার কাজ পরিচালনা করে।
 */
@Slf4j
@Component
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param jwtProperties [EN] Injected JWT configuration properties / [BN] জেডব্লিউটি কনফিগারেশন প্রোপার্টিজ
     */
    public JwtTokenProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    /**
     * [EN] Generates standard HMAC-SHA256 secret key from configured secret string
     * [BN] কনফিগার করা সিক্রেট স্ট্রিং থেকে HMAC-SHA256 সিক্রেট কি তৈরি করে
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * [EN] Generates cryptographically signed access token embedding multi-tenant claims
     * [BN] মাল্টি-টেন্যান্ট ক্লেইমস সংযুক্ত করে ক্রিপ্টোগ্রাফিক এক্সেস টোকেন তৈরি করে
     *
     * @param userId      [EN] User UUID / [BN] ইউজার আইডি
     * @param tenantId    [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param username    [EN] Login username / [BN] ইউজারনেম
     * @param email       [EN] Corporate email / [BN] প্রাতিষ্ঠানিক ইমেইল
     * @param roles       [EN] Assigned roles / [BN] রোলের তালিকা
     * @param permissions [EN] Granular permissions / [BN] পারমিশন তালিকা
     * @return [EN] Compact serialized JWT string / [BN] সাইন করা জেডব্লিউটি স্ট্রিং
     */
    public String generateAccessToken(UUID userId, UUID tenantId, String username, String email,
                                      Collection<String> roles, Collection<String> permissions) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpirationMs());

        return Jwts.builder()
                .subject(username)
                .claim("tenant_id", tenantId.toString())
                .claim("user_id", userId.toString())
                .claim("email", email)
                .claim("roles", new ArrayList<>(roles))
                .claim("permissions", new ArrayList<>(permissions))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * [EN] Generates long-lived refresh token for silent session renewal
     * [BN] সেশন স্বয়ংক্রিয় নবায়নের জন্য দীর্ঘমেয়াদী রিফ্রেশ টোকেন তৈরি করে
     *
     * @param userId   [EN] User UUID / [BN] ইউজার আইডি
     * @param username [EN] Login username / [BN] ইউজারনেম
     * @return [EN] Serialized refresh JWT string / [BN] রিফ্রেশ টোকেন স্ট্রিং
     */
    public String generateRefreshToken(UUID userId, String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getRefreshExpirationMs());

        return Jwts.builder()
                .subject(username)
                .claim("user_id", userId.toString())
                .claim("token_type", "REFRESH")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * [EN] Validates token authenticity, signature integrity, and expiration status
     * [BN] টোকেনের সত্যতা, ডিজিটাল স্বাক্ষর ও মেয়াদোত্তীর্ণ অবস্থা নিখুঁতভাবে যাচাই করে
     *
     * @param token [EN] Serialized JWT string / [BN] যাচাইযোগ্য টোকেন
     * @return [EN] true if valid, false otherwise / [BN] বৈধ হলে true
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("Invalid JWT cryptographic signature: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token algorithm: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT token claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    /**
     * [EN] Extracts username subject from signed JWT
     * [BN] টোকেন থেকে লগইন ইউজারনেম বের করে
     */
    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * [EN] Extracts tenant organization UUID from signed token claims
     * [BN] টোকেনের ক্লেইমস থেকে টেন্যান্টের ইউনিক আইডি (UUID) বের করে
     */
    public UUID getTenantIdFromToken(String token) {
        String tenantIdStr = getClaims(token).get("tenant_id", String.class);
        return (tenantIdStr != null) ? UUID.fromString(tenantIdStr) : null;
    }

    /**
     * [EN] Extracts user account UUID from signed token claims
     * [BN] টোকেন থেকে ইউজারের ইউনিক আইডি (UUID) বের করে
     */
    public UUID getUserIdFromToken(String token) {
        String userIdStr = getClaims(token).get("user_id", String.class);
        return (userIdStr != null) ? UUID.fromString(userIdStr) : null;
    }

    /**
     * [EN] Extracts assigned role codes list from token claims
     * [BN] টোকেনের ক্লেইমস থেকে নির্ধারিত রোল কোডের তালিকা বের করে
     */
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        Object rolesObj = getClaims(token).get("roles");
        if (rolesObj instanceof List<?> list) {
            return (List<String>) list;
        }
        return Collections.emptyList();
    }

    /**
     * [EN] Extracts granular permissions list from token claims
     * [BN] টোকেন থেকে গ্র্যানুলার পারমিশন কোডের তালিকা বের করে
     */
    @SuppressWarnings("unchecked")
    public List<String> getPermissionsFromToken(String token) {
        Object permsObj = getClaims(token).get("permissions");
        if (permsObj instanceof List<?> list) {
            return (List<String>) list;
        }
        return Collections.emptyList();
    }

    /**
     * [EN] Cryptographically parses and extracts claims payload from signed token
     * [BN] টোকেনের স্বাক্ষর পরীক্ষা করে ক্লেইমস পে-লোড রিড করে
     */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
