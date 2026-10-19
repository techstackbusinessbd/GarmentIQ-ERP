package com.garments.erp.core.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * =============================================================================
 * [EN] JWT Security Properties Configuration Holder
 * [BN] জেডব্লিউটি সিকিউরিটি কনফিগারেশন প্রপার্টিজ হোল্ডার
 * =============================================================================
 * [EN] Binds the cryptographic signing secret, access token lifespan, and refresh
 *      token duration from application.yml for stateless authentication.
 * [BN] application.yml থেকে ক্রিপ্টোগ্রাফিক সাইনিং সিক্রেট, এক্সেস টোকেন মেয়াদ
 *      এবং রিফ্রেশ টোকেন স্থায়িত্ব রিড করে স্টেটলেস অথেনটিকেশন নিয়ন্ত্রণ করে।
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * [EN] Cryptographic secret key for signing HMAC-SHA256 tokens (Minimum 256 bits)
     * [BN] HMAC-SHA256 টোকেন সাইন করার ক্রিপ্টোগ্রাফিক সিক্রেট কি (নূন্যতম ২৫৬ বিট)
     */
    private String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    /**
     * [EN] Standard access token lifespan in milliseconds (Default: 8 hours)
     * [BN] স্ট্যান্ডার্ড এক্সেস টোকেনের স্থায়িত্বকাল মিলিসেকেন্ডে (ডিফল্ট: ৮ ঘণ্টা)
     */
    private long expirationMs = 28_800_000L;

    /**
     * [EN] Long-lived refresh token lifespan in milliseconds (Default: 7 days)
     * [BN] দীর্ঘস্থায়ী রিফ্রেশ টোকেনের স্থায়িত্বকাল মিলিসেকেন্ডে (ডিফল্ট: ৭ দিন)
     */
    private long refreshExpirationMs = 604_800_000L;
}
