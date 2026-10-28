package com.garments.erp.user.service;

import com.garments.erp.core.exception.BusinessException;
import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.settings.service.SystemAuditLogService;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.user.dto.AdminResetPasswordRequest;
import com.garments.erp.user.dto.ChangePasswordRequest;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
import com.garments.erp.core.security.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] User Credential & Password Lifecycle Service (UserPasswordService)
 * [BN] ব্যবহারকারী পাসওয়ার্ড রিসেট ও পরিবর্তন সংক্রান্ত ডেডিকেটেড সার্ভিস
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Zero hardcoding.
 */
@Slf4j
@Service
@Transactional
public class UserPasswordService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemAuditLogService auditLogService;

    public UserPasswordService(UserRepository userRepository,
                               TenantRepository tenantRepository,
                               PasswordEncoder passwordEncoder,
                               SystemAuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    /**
     * [EN] Admin resets target user's password with optional account unlocking
     * [BN] অ্যাডমিন কর্তৃক নির্দিষ্ট ইউজারের পাসওয়ার্ড রিসেট ও স্বয়ংক্রিয় আনলকিং
     */
    public UserDto resetPasswordByAdmin(UUID targetUserId, AdminResetPasswordRequest request) {
        User user = userRepository.findByIdAndIsDeletedFalse(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + targetUserId));

        boolean callerIsSuperAdmin = SecurityUtils.isSuperAdmin();

        if (user.isSuperAdmin() && !callerIsSuperAdmin) {
            log.warn("Unauthorized attempt to reset Super Admin password by: {}", SecurityUtils.resolveCurrentUsername());
            throw new BusinessException("Only a Super Administrator can reset Super Admin credentials.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword().trim()));

        if (Boolean.TRUE.equals(request.getUnlockAccount())) {
            user.resetFailedAttempts();
            user.setLockedUntil(null);
            if (user.getStatus() == UserStatus.LOCKED) {
                user.setStatus(UserStatus.ACTIVE);
            }
        }

        User saved = userRepository.save(user);
        auditLogService.record(user.getTenantId(), "SECURITY_POLICY", "PASSWORD_RESET", "User: " + user.getUsername(), "Admin reset password for user" + (Boolean.TRUE.equals(request.getUnlockAccount()) ? " and unlocked account" : ""), "WARNING");
        log.info("Password successfully reset for user @{} by admin: {}", user.getUsername(), SecurityUtils.resolveCurrentUsername());
        return mapToDto(saved);
    }

    /**
     * [EN] Authenticated employee changes their own password with old password verification
     * [BN] লগইনকৃত কর্মী কর্তৃক পুরাতন পাসওয়ার্ড যাচাইপূর্বক নিজ পাসওয়ার্ড পরিবর্তন
     */
    public void changeOwnPassword(UUID currentUserId, ChangePasswordRequest request) {
        User user = userRepository.findByIdAndIsDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User record not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password does not match our records.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BusinessException("New password cannot be the same as your current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword().trim()));
        userRepository.save(user);
        auditLogService.record(user.getTenantId(), "SECURITY_POLICY", "PASSWORD_CHANGED", "User: " + user.getUsername(), "Employee updated own account password", "SUCCESS");
        log.info("User @{} changed their own password successfully.", user.getUsername());
    }

    private UserDto mapToDto(User user) {
        Set<String> roleCodes = (user.getRoles() != null)
                ? user.getRoles().stream().map(r -> r.getRoleCode()).collect(Collectors.toSet())
                : Collections.emptySet();

        UserDto dto = new UserDto(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getDepartment(),
                user.getDesignation(),
                user.getPhone(),
                user.getStatus()
        );
        dto.setEmployeeCardNo(user.getEmployeeCardNo());
        dto.setRoles(roleCodes);

        if (user.getTenantId() != null) {
            tenantRepository.findById(user.getTenantId()).ifPresent(t -> {
                dto.setTenantCode(t.getTenantCode());
                dto.setTenantName(t.getTenantName());
            });
        }
        return dto;
    }
}
