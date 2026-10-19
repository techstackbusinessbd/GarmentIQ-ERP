package com.garments.erp.core.utils;

import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] RFC 9562 Compliant UUIDv7 Generator Utility
 * [BN] তৈরি পোশাক ইআরপির জন্য টাইম-অর্ডারড RFC 9562 UUIDv7 জেনারেটর
 * =============================================================================
 * [EN] Provides monotonic, timestamp-ordered unique identifiers optimal for
 *      PostgreSQL clustered primary key B-Tree indexing. Eliminates UUIDv4 page-split
 *      fragmentation on multi-million row production tracking tables.
 * [BN] পোস্টগ্রেস এসকিউএল-এর B-Tree ইনডেক্সিংয়ের জন্য টাইম-অর্ডারড ও মনোটোনিক ইউনিক আইডি
 *      জেনারেট করে। এটি লাখ লাখ রো বিশিষ্ট প্রোডাকশন ট্র্যাকিং টেবিলে সাধারণ UUIDv4-এর
 *      কারণে ঘটা পেজ-স্প্লিট ফ্র্যাগমেন্টেশন ও কর্মক্ষমতা হ্রাস সম্পূর্ণ রোধ করে।
 */
public final class UuidV7Generator {

    /**
     * [EN] Cryptographically secure random number generator for 74-bit entropy
     * [BN] ৭৪-বিট এনট্রপির জন্য ক্রিপ্টোগ্রাফিক্যালি নিরাপদ রেন্ডম নাম্বার জেনারেটর
     */
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    /**
     * [EN] Private constructor to prevent instantiation of utility class
     * [BN] ইউটিলিটি ক্লাসের অবজেক্ট তৈরি রোধে প্রাইভেট কনস্ট্রাক্টর
     */
    private UuidV7Generator() {
    }

    /**
     * [EN] Generates a new RFC 9562 UUID Version 7 using 48-bit Unix epoch millisecond prefix
     * [BN] ৪৮-বিট ইউনিক্স মিলিসেকেন্ড প্রিফিক্স ও রেন্ডম এনট্রপি দিয়ে RFC 9562 UUIDv7 তৈরি করে
     *
     * @return [EN] Time-ordered UUIDv7 instance / [BN] টাইম-অর্ডারড UUIDv7 অবজেক্ট
     */
    public static UUID generate() {
        // [EN] Step 1: Extract 48-bit millisecond timestamp since Unix Epoch
        // [BN] ধাপ ১: ইউনিক্স ইপক থেকে বর্তমান সময়ের ৪৮-বিট মিলিসেকেন্ড টাইমস্ট্যাম্প নেওয়া
        long timestampMillis = Instant.now().toEpochMilli();

        // [EN] Step 2: Generate 10 cryptographically strong random bytes (80 bits)
        // [BN] ধাপ ২: ক্রিপ্টোগ্রাফিক্যালি শক্তিশালী ১০ বাইট রেন্ডম ডেটা সংগ্রহ করা
        byte[] randomBytes = new byte[10];
        SECURE_RANDOM.nextBytes(randomBytes);

        ByteBuffer buffer = ByteBuffer.allocate(16);

        // [EN] Step 3: Write 48-bit timestamp into the first 6 bytes
        // [BN] ধাপ ৩: প্রথম ৬ বাইটে টাইমস্ট্যাম্প রাইট করা
        buffer.putShort((short) (timestampMillis >>> 32));
        buffer.putInt((int) timestampMillis);

        // [EN] Step 4: Write Version 7 (0111) into the top 4 bits of octet 6
        // [BN] ধাপ ৪: বাইট ৬-এর ওপরের ৪ বিটে ভার্সন ৭ (০১১১) সেট করা
        byte versionByte = (byte) ((randomBytes[0] & 0x0F) | 0x70);
        buffer.put(versionByte);

        // [EN] Step 5: Write remaining random bits of octet 7
        // [BN] ধাপ ৫: বাইট ৭-এ অবশিষ্ট রেন্ডম বিট রাইট করা
        buffer.put(randomBytes[1]);

        // [EN] Step 6: Write RFC 4122/9562 Variant (10) into top 2 bits of octet 8
        // [BN] ধাপ ৬: বাইট ৮-এর ওপরের ২ বিটে ভ্যারিয়েন্ট (১০) সেট করা
        byte variantByte = (byte) ((randomBytes[2] & 0x3F) | 0x80);
        buffer.put(variantByte);

        // [EN] Step 7: Write remaining 7 random bytes for uniqueness guarantee
        // [BN] ধাপ ৭: ইউনিকনেস নিশ্চিত করতে অবশিষ্ট ৭টি রেন্ডম বাইট রাইট করা
        buffer.put(randomBytes, 3, 7);
        buffer.flip();

        return new UUID(buffer.getLong(), buffer.getLong());
    }
}

