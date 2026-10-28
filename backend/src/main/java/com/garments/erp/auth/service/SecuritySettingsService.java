package com.garments.erp.auth.service;

import com.garments.erp.auth.dto.SecuritySettingsDto;
import com.garments.erp.core.config.RedisCacheConfig;
import com.garments.erp.settings.service.SystemAuditLogService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

/**
 * =============================================================================
 * [EN] Dynamic Platform Security Settings Service (SecuritySettingsService.java)
 * [BN] ডায়নামিক প্ল্যাটফর্ম সিকিউরিটি কনফিগারেশন সার্ভিস (SecuritySettingsService.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Validation)
 * [BN] রানটাইমে পাসওয়ার্ড ব্যর্থতার থ্রেশহোল্ড ও লকআউট মেয়াদ পরিবর্তন ও সরবরাহকারী সার্ভিস।
 */
@Slf4j
@Service
public class SecuritySettingsService {

    private final SystemAuditLogService auditLogService;

    @Value("${app.security.max-failed-attempts:5}")
    private int defaultMaxFailedAttempts;

    @Value("${app.security.lockout-minutes:30}")
    private int defaultLockoutMinutes;

    @Value("${app.security.session-timeout-minutes:60}")
    private int defaultSessionTimeoutMinutes;

    private final AtomicReference<SecuritySettingsDto> currentSettings = new AtomicReference<>();

    public SecuritySettingsService(SystemAuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @PostConstruct
    public void init() {
        SecuritySettingsDto initial = SecuritySettingsDto.builder()
                .maxFailedAttempts(defaultMaxFailedAttempts)
                .lockoutMinutes(defaultLockoutMinutes)
                .sessionTimeoutMinutes(defaultSessionTimeoutMinutes)
                .build();
        currentSettings.set(initial);
        log.info("Initialized dynamic security settings: maxFailedAttempts={}, lockoutMinutes={}, sessionTimeoutMinutes={}",
                initial.getMaxFailedAttempts(), initial.getLockoutMinutes(), initial.getSessionTimeoutMinutes());
    }

    /**
     * [EN] Retrieves the active security settings configuration
     * [BN] সক্রিয় সিকিউরিটি কনফিগারেশন সংগ্রহ
     */
    @Cacheable(value = RedisCacheConfig.CACHE_SECURITY_SETTINGS, key = "'active'")
    public SecuritySettingsDto getSecuritySettings() {
        return currentSettings.get();
    }

    /**
     * [EN] Dynamically updates platform security configuration
     * [BN] প্ল্যাটফর্ম সিকিউরিটি সেটিংস ডাইনামিকালি হালনাগাদ করা
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_SECURITY_SETTINGS, allEntries = true)
    public SecuritySettingsDto updateSecuritySettings(SecuritySettingsDto updated) {
        SecuritySettingsDto sanitized = SecuritySettingsDto.builder()
                .maxFailedAttempts(Math.clamp(updated.getMaxFailedAttempts(), 3, 10))
                .lockoutMinutes(Math.clamp(updated.getLockoutMinutes(), 5, 1440))
                .sessionTimeoutMinutes(Math.clamp(updated.getSessionTimeoutMinutes(), 15, 480))
                .build();

        currentSettings.set(sanitized);
        log.info("Updated dynamic security settings: maxFailedAttempts={}, lockoutMinutes={}m, sessionTimeoutMinutes={}m",
                sanitized.getMaxFailedAttempts(), sanitized.getLockoutMinutes(), sanitized.getSessionTimeoutMinutes());
        auditLogService.record("SECURITY_POLICY", "SECURITY_POLICY_UPDATED",
                "Updated security policy: maxFailedAttempts=" + sanitized.getMaxFailedAttempts()
                        + ", lockoutMinutes=" + sanitized.getLockoutMinutes()
                        + "m, sessionTimeoutMinutes=" + sanitized.getSessionTimeoutMinutes() + "m",
                "SECURITY_CONFIG", "GLOBAL");
        return sanitized;
    }

    public int getMaxFailedAttempts() {
        return currentSettings.get() != null ? currentSettings.get().getMaxFailedAttempts() : defaultMaxFailedAttempts;
    }

    public int getLockoutMinutes() {
        return currentSettings.get() != null ? currentSettings.get().getLockoutMinutes() : defaultLockoutMinutes;
    }

    public int getSessionTimeoutMinutes() {
        return currentSettings.get() != null ? currentSettings.get().getSessionTimeoutMinutes() : defaultSessionTimeoutMinutes;
    }
}
