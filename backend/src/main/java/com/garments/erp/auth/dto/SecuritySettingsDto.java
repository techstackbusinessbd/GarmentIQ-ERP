package com.garments.erp.auth.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * =============================================================================
 * [EN] Enterprise Platform Security Governance DTO (SecuritySettingsDto.java)
 * [BN] এন্টারপ্রাইজ প্ল্যাটফর্ম সিকিউরিটি কনফিগারেশন ডিটিও (SecuritySettingsDto.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Server-side validation)
 * [BN] ব্যর্থ পাসওয়ার্ড লকিং থ্রেশহোল্ড, লকের স্থায়িত্বকাল ও সেশন মেয়াদ কনফিগারেশন।
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecuritySettingsDto {

    /**
     * [EN] Maximum consecutive failed login attempts before account lock (3-10)
     * [BN] অ্যাকাউন্ট লক হওয়ার পূর্বে সর্বোচ্চ ধারাবাহিক ভুল চেষ্টার সংখ্যা (৩-১০)
     */
    @Min(value = 3, message = "Max failed attempts must be at least 3")
    @Max(value = 10, message = "Max failed attempts cannot exceed 10")
    @Builder.Default
    private int maxFailedAttempts = 5;

    /**
     * [EN] Account lockout duration in minutes (5-1440)
     * [BN] ভুল পাসওয়ার্ডের কারণে অ্যাকাউন্ট লকের স্থায়িত্বকাল মিনিটে (৫-১৪৪০)
     */
    @Min(value = 5, message = "Lockout duration must be at least 5 minutes")
    @Max(value = 1440, message = "Lockout duration cannot exceed 24 hours (1440 minutes)")
    @Builder.Default
    private int lockoutMinutes = 30;

    /**
     * [EN] JWT user session lifetime in minutes (15-480)
     * [BN] ব্যবহারকারী সেশনের মেয়াদকাল মিনিটে (১৫-৪৮০)
     */
    @Min(value = 15, message = "Session lifetime must be at least 15 minutes")
    @Max(value = 480, message = "Session lifetime cannot exceed 8 hours (480 minutes)")
    @Builder.Default
    private int sessionTimeoutMinutes = 60;
}
