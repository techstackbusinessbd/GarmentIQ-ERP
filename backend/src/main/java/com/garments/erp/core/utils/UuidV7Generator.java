package com.garments.erp.core.utils;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

/**
 * [EN] RFC 9562 Compliant UUIDv7 Generator with monotonic sub-millisecond sequence.
 * Tailored for PostgreSQL B-Tree insertion performance and distributed entity creation.
 *
 * [BN] আরএফসি ৯৫৬২ মানসম্পন্ন ইউইউআইডি ভার্সন ৭ (UUIDv7) জেনারেটর।
 * এটি টাইমস্ট্যাম্প এবং সিকোয়েন্সের সমন্বয়ে পোস্টগ্রেসকিউএল বি-ট্রি ইনডেক্সে সর্বোচ্চ পারফরম্যান্স নিশ্চিত করে।
 */
public final class UuidV7Generator {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final AtomicLong LAST_TIMESTAMP = new AtomicLong(-1);
    private static final AtomicLong SEQUENCE = new AtomicLong(0);

    private UuidV7Generator() {
        // [EN] Private constructor to prevent instantiation / [BN] ইউটিলিটি ক্লাসের অবজেক্ট তৈরি রোধ করতে প্রাইভেট কনস্ট্রাক্টর
    }

    /**
     * [EN] Generate a new RFC 9562 UUIDv7 instance.
     * [BN] নতুন টাইম-অর্ডারড UUIDv7 তৈরি করে।
     *
     * @return time-ordered UUIDv7 instance
     */
    public static UUID generate() {
        long currentTimestamp = Instant.now().toEpochMilli();
        long lastTimestamp = LAST_TIMESTAMP.get();

        if (currentTimestamp <= lastTimestamp) {
            currentTimestamp = lastTimestamp;
            SEQUENCE.incrementAndGet();
        } else {
            LAST_TIMESTAMP.set(currentTimestamp);
            SEQUENCE.set(SECURE_RANDOM.nextLong() & 0x0FFFL);
        }

        long sequenceVal = SEQUENCE.get() & 0x0FFFL;

        // [EN] Most Significant Bits: 48-bit timestamp | 4-bit version (7) | 12-bit sequence
        // [BN] মোস্ট সিগনিফিক্যান্ট বিটস: ৪৮ বিট টাইমস্ট্যাম্প | ৪ বিট ভার্সন (৭) | ১২ বিট সিকোয়েন্স
        long msb = (currentTimestamp & 0xFFFFFFFFFFFFL) << 16;
        msb |= 0x7000L;
        msb |= sequenceVal;

        // [EN] Least Significant Bits: 2-bit variant (0b10) | 62-bit secure random
        // [BN] লিস্ট সিগনিফিক্যান্ট বিটস: ২ বিট ভ্যারিয়েন্ট (১০) | ৬২ বিট সিকিউর র‍্যান্ডম
        long lsb = SECURE_RANDOM.nextLong();
        lsb &= 0x3FFFFFFFFFFFFFFFL;
        lsb |= 0x8000000000000000L;

        return new UUID(msb, lsb);
    }
}
