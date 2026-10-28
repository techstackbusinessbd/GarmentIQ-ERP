package com.garments.erp.user.service;

import com.garments.erp.core.exception.BusinessException;
import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.core.security.SecurityUtils;
import com.garments.erp.user.dto.UserCustomPermissionDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserCustomPermission;
import com.garments.erp.user.repository.UserCustomPermissionRepository;
import com.garments.erp.user.repository.UserRepository;
import com.garments.erp.settings.service.SystemAuditLogService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] User-Level Custom Permission Management Service
 * [BN] ব্যবহারকারীভিত্তিক কাস্টম ওভাররাইড পারমিশন ব্যবস্থাপনা সার্ভিস
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 16 (Zero AI Vibe)
 * [BN] রোলের বাইরে নির্দিষ্ট কর্মীকে বিশেষ ক্ষমতা প্রদান (Grant) বা খর্ব (Deny) করার সার্ভিস।
 */
@Service
public class UserCustomPermissionService {

    private final UserCustomPermissionRepository customPermissionRepository;
    private final UserRepository userRepository;
    private final SystemAuditLogService auditLogService;

    public UserCustomPermissionService(UserCustomPermissionRepository customPermissionRepository,
                                       UserRepository userRepository,
                                       SystemAuditLogService auditLogService) {
        this.customPermissionRepository = customPermissionRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    /**
     * [EN] Retrieves all direct custom permission overrides assigned to a user
     * [BN] ব্যবহারকারীর সমস্ত কাস্টম পারমিশন ওভাররাইড রিটার্ন করে
     */
    @Transactional(readOnly = true)
    public List<UserCustomPermissionDto> getCustomPermissions(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return customPermissionRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * [EN] Updates direct custom permissions for a target user
     * [BN] ব্যবহারকারীর কাস্টম পারমিশন তালিকা বাল্ক আপডেট করে
     */
    @Transactional
    public List<UserCustomPermissionDto> updateCustomPermissions(UUID userId, List<UserCustomPermissionDto> newPermissions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.isSuperAdmin() || "superadmin".equalsIgnoreCase(user.getUsername())) {
            throw new BusinessException("Platform Super Admin possesses permanent root access; custom overrides are prohibited.");
        }

        // [EN] Privilege Escalation Guard: Non-superadmins cannot grant platform-root permissions
        // [BN] প্রিভিলেজ এসকেলেশন গার্ড: নন-সুপারঅ্যাডমিন কোনো প্ল্যাটফর্ম রুট কাস্টম ওভাররাইড প্রদান করতে পারবে না
        if (newPermissions != null && !SecurityUtils.isSuperAdmin()) {
            boolean hasPlatformRoot = newPermissions.stream()
                    .anyMatch(p -> p.getPermissionCode() != null && SecurityUtils.isPlatformRootPermission(p.getPermissionCode()));
            if (hasPlatformRoot) {
                throw new BusinessException(
                        "Access Denied: Only Platform Super Admin can grant Client Management custom overrides.",
                        HttpStatus.FORBIDDEN
                );
            }
        }

        String operator = resolveCurrentOperator();

        // [EN] Purge existing custom overrides and replace with validated new set
        // [BN] পূর্ববর্তী কাস্টম পারমিশন মুছে ফেলে নতুন অনুমোদিত সেটটি সংরক্ষণ করা
        customPermissionRepository.deleteByUserId(user.getId());

        if (newPermissions == null || newPermissions.isEmpty()) {
            return List.of();
        }

        List<UserCustomPermission> entities = new ArrayList<>();
        for (UserCustomPermissionDto dto : newPermissions) {
            if (dto.getPermissionCode() == null || dto.getPermissionCode().trim().isEmpty()) {
                continue;
            }
            UserCustomPermission entity = new UserCustomPermission(
                    UUID.randomUUID(),
                    user.getId(),
                    dto.getPermissionCode().trim().toUpperCase(),
                    dto.isGranted(),
                    operator
            );
            entities.add(entity);
        }

        List<UserCustomPermission> saved = customPermissionRepository.saveAll(entities);
        auditLogService.record("USER_MANAGEMENT", "CUSTOM_PERMISSIONS_UPDATED",
                "Updated custom permissions for user: " + user.getUsername() + " (" + entities.size() + " overrides)",
                user.getId().toString(), user.getUsername());
        return saved.stream().map(this::toDto).collect(Collectors.toList());
    }

    private UserCustomPermissionDto toDto(UserCustomPermission entity) {
        return new UserCustomPermissionDto(
                entity.getId(),
                entity.getUserId(),
                entity.getPermissionCode(),
                entity.isGranted(),
                entity.getCreatedAt(),
                entity.getCreatedBy()
        );
    }

    private String resolveCurrentOperator() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "SYSTEM";
    }
}
