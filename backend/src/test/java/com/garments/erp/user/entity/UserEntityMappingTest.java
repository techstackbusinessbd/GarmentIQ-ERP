package com.garments.erp.user.entity;

import com.garments.erp.auth.entity.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for User Entity Mappings and Password Security
 * [BN] ব্যবহারকারী এন্টিটি ম্যাপিং এবং পাসওয়ার্ড সিকিউরিটির ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Tests entity lifecycle hooks, UUIDv7 generation, role collection association,
 *      multi-tenant user equality, and BCrypt password hash verification.
 * [BN] এন্টিটি লাইফসাইকেল হুক, UUIDv7 জেনারেশন, রোল কালেকশন অ্যাসোসিয়েশন,
 *      মাল্টি-টেন্যান্ট ইউজার সমতা এবং বিসিআরওয়াইপিটি পাসওয়ার্ড হ্যাশ যাচাই করে।
 */
class UserEntityMappingTest {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * [EN] Tests creating user entity and assigning roles
     * [BN] ইউজার এন্টিটি তৈরি ও এতে সিকিউরিটি রোল অ্যাসাইন করা যাচাই
     */
    @Test
    @DisplayName("Should successfully associate security roles with User entity")
    void testUserRoleAssociation() {
        UUID tenantId = UUID.randomUUID();
        User user = new User(tenantId, "tanvir.pm", "tanvir@textech.com",
                passwordEncoder.encode("SecurePass123!"), "Tanvir Ahmed");

        Role role = new Role(tenantId, "ROLE_ADMIN", "System Administrator");

        user.addRole(role);

        assertEquals(1, user.getRoles().size(), "User should hold exactly 1 role");
        assertTrue(user.getRoles().contains(role), "User must contain ROLE_ADMIN");

        user.removeRole(role);
        assertEquals(0, user.getRoles().size(), "User roles must be empty after removal");
    }

    /**
     * [EN] Tests JPA @PrePersist hooks for UUIDv7 generation and timestamp initialization
     * [BN] JPA @PrePersist হুকে UUIDv7 আইডি এবং অডিট টাইমস্ট্যাম্প সেট হওয়া যাচাই
     */
    @Test
    @DisplayName("Should generate valid RFC 9562 UUIDv7 on user pre-persist lifecycle")
    void testPrePersistGeneratesUuidV7() {
        UUID tenantId = UUID.randomUUID();
        User user = new User(tenantId, "ariful.dev", "ariful@textech.com",
                "dummyHash", "Ariful Islam");

        assertNull(user.getId(), "User ID must be null before persist hook");

        user.onCreate();

        assertNotNull(user.getId(), "User ID must be initialized by pre-persist hook");
        assertEquals(7, user.getId().version(), "User ID must strictly be RFC 9562 UUIDv7");
        assertNotNull(user.getCreatedAt(), "User createdAt must not be null");
        assertNotNull(user.getUpdatedAt(), "User updatedAt must not be null");
        assertEquals(UserStatus.ACTIVE, user.getStatus(), "Default user status must be ACTIVE");
    }

    /**
     * [EN] Tests multi-tenant user equality by tenantId and username
     * [BN] tenantId এবং username-এর ভিত্তিতে ইউজারের নির্ভুল সমতা যাচাই
     */
    @Test
    @DisplayName("Should correctly evaluate user equality strictly within tenant boundary")
    void testUserEquality() {
        UUID tenantA = UUID.randomUUID();
        UUID tenantB = UUID.randomUUID();

        User user1 = new User(tenantA, "farhana.qa", "qa@textech.com", "hash", "Farhana");
        User user2 = new User(tenantA, "farhana.qa", "qa2@textech.com", "hash", "Farhana Dup");
        User user3 = new User(tenantB, "farhana.qa", "qa@other.com", "hash", "Farhana Tenant B");

        assertEquals(user1, user2, "Users with same tenantId and username must be equal");
        assertEquals(user1.hashCode(), user2.hashCode(), "HashCodes must match for equal users");
        assertNotEquals(user1, user3, "Users across different tenants must NOT be equal");
    }

    /**
     * [EN] Tests BCrypt password hash generation and verification
     * [BN] BCrypt পাসওয়ার্ড হ্যাশিং ও সঠিক পাসওয়ার্ড মেলানো যাচাই
     */
    @Test
    @DisplayName("Should verify BCrypt password hashing and matching correctly")
    void testPasswordHashingAndMatching() {
        String rawPassword = "EnterprisePassword2026!";
        String encodedHash = passwordEncoder.encode(rawPassword);

        assertNotNull(encodedHash, "Encoded password hash must not be null");
        assertNotEquals(rawPassword, encodedHash, "Hash must not equal raw plain text password");
        assertTrue(passwordEncoder.matches(rawPassword, encodedHash), "Raw password must match valid BCrypt hash");
        assertFalse(passwordEncoder.matches("WrongPassword", encodedHash), "Incorrect password must fail verification");
    }
}
