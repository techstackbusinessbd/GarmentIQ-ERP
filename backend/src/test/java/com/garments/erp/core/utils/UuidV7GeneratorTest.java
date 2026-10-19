package com.garments.erp.core.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * [EN] Unit tests for RFC 9562 UUIDv7 Generator.
 * Validates version (7), variant (2), and strict monotonic ordering.
 *
 * [BN] RFC 9562 UUIDv7 জেনারেটরের ইউনিট টেস্ট।
 * এটি ভার্সন ৭, ভ্যারিয়েন্ট ২ এবং টাইম-অর্ডারড মনোমোনিক বৈশিষ্ট্য যাচাই করে।
 */
class UuidV7GeneratorTest {

    @Test
    @DisplayName("[EN] Should generate valid RFC 9562 UUID with version 7 and variant 2 / [BN] সঠিক ভার্সন ৭ ও ভ্যারিয়েন্ট ২ ইউইউআইডি তৈরি হওয়া উচিত")
    void shouldGenerateValidUuidV7() {
        UUID uuid = UuidV7Generator.generate();

        assertNotNull(uuid, "Generated UUID must not be null");
        assertEquals(7, uuid.version(), "UUID version must strictly be 7 (RFC 9562)");
        assertEquals(2, uuid.variant(), "UUID variant must strictly be 2 (Leach-Salz)");
    }

    @Test
    @DisplayName("[EN] Should generate strictly ordered monotonic UUIDv7 sequence / [BN] ক্রমানুসারে টাইম-অর্ডারড ইউইউআইডি তৈরি হওয়া উচিত")
    void shouldGenerateMonotonicSequence() {
        int count = 1000;
        List<UUID> uuids = new ArrayList<>(count);

        for (int i = 0; i < count; i++) {
            uuids.add(UuidV7Generator.generate());
        }

        for (int i = 1; i < count; i++) {
            UUID prev = uuids.get(i - 1);
            UUID current = uuids.get(i);

            assertTrue(current.compareTo(prev) >= 0,
                    "UUIDv7 sequence must be monotonic: " + current + " must be >= " + prev);
        }
    }
}
