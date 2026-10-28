package com.garments.erp.auth.controller;

import com.garments.erp.auth.dto.SecuritySettingsDto;
import com.garments.erp.auth.service.SecuritySettingsService;
import com.garments.erp.core.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * =============================================================================
 * [EN] Platform Security Governance REST Controller (SecuritySettingsController.java)
 * [BN] প্ল্যাটফর্ম সিকিউরিটি কনফিগারেশন কন্ট্রোলার (SecuritySettingsController.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Validation)
 * [BN] লকআউট মেয়াদ ও পাসওয়ার্ড পলিসি ডায়নামিকালি পরিবর্তন করার সিকিউর এন্ডপয়েন্ট।
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/settings/security")
@RequiredArgsConstructor
@Tag(name = "Security Governance", description = "Dynamic platform security and lockout configuration endpoints")
public class SecuritySettingsController {

    private final SecuritySettingsService securitySettingsService;

    /**
     * [EN] Get current active security policy parameters
     * [BN] সক্রিয় সিকিউরিটি ও লকআউট পলিসি সংগ্রহ করা
     */
    @GetMapping
    @PreAuthorize("hasAuthority('SECURITY:VIEW') or hasAuthority('SETTINGS:VIEW') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get Platform Security Settings", description = "Retrieves active lockout duration and failed attempts threshold")
    public ApiResponse<SecuritySettingsDto> getSecuritySettings() {
        return ApiResponse.success(securitySettingsService.getSecuritySettings(), "Security settings retrieved successfully.");
    }

    /**
     * [EN] Update active platform security policy parameters
     * [BN] প্ল্যাটফর্মের লকআউট মেয়াদ ও পাসওয়ার্ড থ্রেশহোল্ড হালনাগাদ করা
     */
    @PutMapping
    @PreAuthorize("hasAuthority('SECURITY:EDIT') or hasAuthority('SETTINGS:EDIT') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update Platform Security Settings", description = "Modifies lockout duration and failed attempts threshold in real time")
    public ApiResponse<SecuritySettingsDto> updateSecuritySettings(@Valid @RequestBody SecuritySettingsDto request) {
        log.info("Admin updated security policy: lockoutMinutes={}, maxAttempts={}",
                request.getLockoutMinutes(), request.getMaxFailedAttempts());
        SecuritySettingsDto updated = securitySettingsService.updateSecuritySettings(request);
        return ApiResponse.success(updated, "Security settings updated successfully.");
    }
}
