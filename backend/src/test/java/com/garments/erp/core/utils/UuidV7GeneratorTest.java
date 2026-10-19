package com.garments.erp.core.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for UuidV7Generator
 * [BN] UUIDv7 জেনারেটরের ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Validates RFC 9562 compliance, verifying version 7 nibbles, variant 2
 *      (IETF), and time-ordered monotonic monotonicity for clustered B-Tree indexes.
 * [BN] RFC 9562 স্পেসিফিকেশন অনুযায়ী জেনারেটকৃত আইডির ভার্সন ৭, ভ্যারিয়েন্ট ২ এবং
 *      টাইম-অর্ডারড মনোটোনিক ধারাবাহিকতা নিখুঁতভাবে যাচাই করে।
 */
class UuidV7GeneratorTest {

    /**
     * [EN] Tests that generated UUID is non-null, version is 7, and variant is 2
     * [BN] যাচাই করে যে জেনারেট হওয়া UUID নাল নয়, এর ভার্সন ৭ এবং ভ্যারিয়েন্ট ২
     */
    @Test
    @DisplayName("Should generate valid non-null RFC 9562 UUIDv7")
    void testGenerateValidUuidV7() {
        // [EN] Act: Generate new identifier / [BN] নতুন আইডি তৈরি করা হলো
        UUID uuid = UuidV7Generator.generate();

        // [EN] Assert: Verify structural RFC 9562 compliance
        // [BN] স্পেসিফিকেশন কাঠামো যাচাই করা হলো
        assertNotNull(uuid, "UUID must not be null");
        assertEquals(7, uuid.version(), "UUID version must strictly be 7");
        assertEquals(2, uuid.variant(), "UUID variant must strictly be 2 (IETF)");
    }

    /**
     * [EN] Tests that sequentially generated UUIDs have monotonically increasing timestamps
     * [BN] যাচাই করে যে পরপর তৈরি হওয়া UUID গুলোর টাইমস্ট্যাম্প ক্রমান্বয়ে বৃদ্ধি পায়
     */
    @Test
    @DisplayName("Should generate monotonically increasing timestamps in sequential generation")
    void testMonotonicTimestampOrder() throws InterruptedException {
        // [EN] Generate first UUID / [BN] প্রথম আইডি জেনারেট করা
        UUID first = UuidV7Generator.generate();
        Thread.sleep(2);
        // [EN] Generate second UUID / [BN] দ্বিতীয় আইডি জেনারেট করা
        UUID second = UuidV7Generator.generate();

        assertNotEquals(first, second, "Generated UUIDs must be distinct");
        // [EN] Time ordering verification: MSB bits of later UUID must be >= earlier UUID
        // [BN] সময়ক্রমিক যাচাই: পরবর্তী UUID-এর মোস্ট সিগনিফিকেন্ট বিটস পূর্ববর্তী থেকে বড় বা সমান হবে
        assertTrue(second.getMostSignificantBits() >= first.getMostSignificantBits(),
                "Later UUIDv7 must have greater or equal timestamp bits");
    }
}

