package com.garments.erp.core.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for Cryptographic JWT Token Provider
 * [BN] ক্রিপ্টোগ্রাফিক জেডব্লিউটি টোকেন প্রস্তুতকারকের ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Validates HMAC-SHA256 digital signature, multi-tenant claims encoding,
 *      claims extraction, and expired/tampered token rejection.
 * [BN] HMAC-SHA256 ডিজিটাল স্বাক্ষর, মাল্টি-টেন্যান্ট ক্লেইমস এনকোডিং ও পার্সিং,
 *      এবং মেয়াদোত্তীর্ণ বা বিকৃত টোকেন প্রত্যাখান নিখুঁতভাবে যাচাই করে।
 */
class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private JwtProperties jwtProperties;

    private UUID sampleUserId;
    private UUID sampleTenantId;
    private String sampleUsername;
    private String sampleEmail;
    private List<String> sampleRoles;
    private List<String> samplePermissions;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties();
        jwtProperties.setSecret("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        jwtProperties.setExpirationMs(3600_000L); // 1 hour
        jwtProperties.setRefreshExpirationMs(86400_000L); // 24 hours

        tokenProvider = new JwtTokenProvider(jwtProperties);

        sampleUserId = UUID.randomUUID();
        sampleTenantId = UUID.randomUUID();
        sampleUsername = "tanvir.architect";
        sampleEmail = "tanvir@textech.com";
        sampleRoles = List.of("ROLE_ADMIN", "ROLE_MERCHANDISER");
        samplePermissions = List.of("ORDER:READ", "ORDER:CREATE");
    }

    /**
     * [EN] Tests access token generation, cryptographic validation, and claims extraction
     * [BN] এক্সেস টোকেন তৈরি, ক্রিপ্টোগ্রাফিক যাচাই এবং ক্লেইমস উদ্ধার পরীক্ষা
     */
    @Test
    @DisplayName("Should successfully issue and validate HMAC-SHA256 signed access token")
    void testGenerateAndValidateAccessToken() {
        String token = tokenProvider.generateAccessToken(
                sampleUserId, sampleTenantId, sampleUsername, sampleEmail,
                sampleRoles, samplePermissions
        );

        assertNotNull(token, "Token string must not be null");
        assertTrue(tokenProvider.validateToken(token), "Token must pass cryptographic validation");

        assertEquals(sampleUsername, tokenProvider.getUsernameFromToken(token), "Username subject must match");
        assertEquals(sampleTenantId, tokenProvider.getTenantIdFromToken(token), "Tenant ID claim must match");
        assertEquals(sampleUserId, tokenProvider.getUserIdFromToken(token), "User ID claim must match");

        List<String> roles = tokenProvider.getRolesFromToken(token);
        assertEquals(2, roles.size(), "Roles list size must be 2");
        assertTrue(roles.contains("ROLE_ADMIN"), "Roles must contain ROLE_ADMIN");

        List<String> permissions = tokenProvider.getPermissionsFromToken(token);
        assertEquals(2, permissions.size(), "Permissions list size must be 2");
        assertTrue(permissions.contains("ORDER:READ"), "Permissions must contain ORDER:READ");
    }

    /**
     * [EN] Tests refresh token generation and basic validation
     * [BN] রিফ্রেশ টোকেন তৈরি ও মৌলিক ভ্যালিডেশন পরীক্ষা
     */
    @Test
    @DisplayName("Should successfully issue and validate refresh token")
    void testGenerateRefreshToken() {
        String refreshToken = tokenProvider.generateRefreshToken(sampleUserId, sampleUsername);

        assertNotNull(refreshToken, "Refresh token must not be null");
        assertTrue(tokenProvider.validateToken(refreshToken), "Refresh token must be valid");
        assertEquals(sampleUsername, tokenProvider.getUsernameFromToken(refreshToken), "Username must match");
        assertEquals(sampleUserId, tokenProvider.getUserIdFromToken(refreshToken), "User ID must match");
    }

    /**
     * [EN] Tests that tampered tokens fail signature verification
     * [BN] বিকৃত বা পরিবর্তিত টোকেনের স্বাক্ষর বাতিল হওয়া যাচাই
     */
    @Test
    @DisplayName("Should reject tampered token with invalid signature")
    void testRejectTamperedToken() {
        String token = tokenProvider.generateAccessToken(
                sampleUserId, sampleTenantId, sampleUsername, sampleEmail,
                sampleRoles, samplePermissions
        );

        // Tamper by altering the last signature character
        String tampered = token.substring(0, token.length() - 2) + "xx";

        assertFalse(tokenProvider.validateToken(tampered), "Tampered token must fail validation");
    }

    /**
     * [EN] Tests that expired tokens fail verification
     * [BN] মেয়াদোত্তীর্ণ টোকেন স্বয়ংক্রিয়ভাবে বাতিল হওয়া যাচাই
     */
    @Test
    @DisplayName("Should reject expired token")
    void testRejectExpiredToken() {
        JwtProperties expiredProperties = new JwtProperties();
        expiredProperties.setSecret(jwtProperties.getSecret());
        expiredProperties.setExpirationMs(-5000L); // Negative expiration (already expired)

        JwtTokenProvider expiredProvider = new JwtTokenProvider(expiredProperties);
        String expiredToken = expiredProvider.generateAccessToken(
                sampleUserId, sampleTenantId, sampleUsername, sampleEmail,
                sampleRoles, samplePermissions
        );

        assertFalse(expiredProvider.validateToken(expiredToken), "Expired token must be rejected");
    }
}
