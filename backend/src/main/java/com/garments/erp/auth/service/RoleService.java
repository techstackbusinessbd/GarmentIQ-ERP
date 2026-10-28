package com.garments.erp.auth.service;

import com.garments.erp.auth.dto.CreateRoleRequest;
import com.garments.erp.auth.dto.RoleDto;
import com.garments.erp.auth.dto.UpdateRoleRequest;
import com.garments.erp.auth.entity.Permission;
import com.garments.erp.auth.entity.Role;
import com.garments.erp.auth.repository.PermissionRepository;
import com.garments.erp.auth.repository.RoleRepository;
import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.core.config.RedisCacheConfig;
import com.garments.erp.core.exception.BusinessException;
import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.core.security.SecurityUtils;
import com.garments.erp.settings.service.SystemAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] Multi-Tenant Role & Dynamic RBAC Service (RoleService.java)
 * [BN] মাল্টি-টেন্যান্ট রোল ও ডায়নামিক আরবিএসি ব্যবস্থাপনা সার্ভিস
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ডাটাবেজ থেকে সরাসরি রোল ও পারমিশন লোড ও আপডেট নিশ্চিত করে।
 */
@Service
@RequiredArgsConstructor
public class RoleService {

    private static final UUID SYSTEM_TENANT_ID = UUID.fromString("019472ba-0000-7000-8000-000000000000");

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final TenantRepository tenantRepository;
    private final SystemAuditLogService auditLogService;

    /**
     * [EN] Retrieves all active roles (or all including deleted)
     * [BN] সক্রিয় সমস্ত রোল সংগ্রহ (বা ডিলিটকৃতসহ)
     */
    @Cacheable(value = RedisCacheConfig.CACHE_ROLES, key = "'roles_' + (T(com.garments.erp.core.security.SecurityUtils).isSuperAdmin() ? 'super_all' : (T(com.garments.erp.tenant.context.TenantContext).getTenantId() != null ? T(com.garments.erp.tenant.context.TenantContext).getTenantId().toString() : 'system')) + '_' + (#includeDeleted != null && #includeDeleted)")
    @Transactional(readOnly = true)
    public List<RoleDto> getRoles(Boolean includeDeleted) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) tenantId = SYSTEM_TENANT_ID;

        boolean withDeleted = Boolean.TRUE.equals(includeDeleted);
        List<Role> roles;
        if (SecurityUtils.isSuperAdmin()) {
            roles = withDeleted ? roleRepository.findAllWithPermissions() : roleRepository.findAllWithPermissionsByIsDeletedFalse();
        } else {
            roles = withDeleted ? roleRepository.findAllForTenantOrSystemWithDeleted(tenantId, SYSTEM_TENANT_ID) : roleRepository.findAllForTenantOrSystem(tenantId, SYSTEM_TENANT_ID);
        }
        return roles.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<RoleDto> getRoles() { return getRoles(false); }

    /**
     * [EN] Retrieves role definition and bound permission codes by role code
     * [BN] রোল কোড দিয়ে রোল ও সংশ্লিষ্ট পারমিশন কোড রিটার্ন করে
     */
    @Cacheable(value = RedisCacheConfig.CACHE_ROLES, key = "'code_' + #roleCode")
    @Transactional(readOnly = true)
    public RoleDto getRoleByCode(String roleCode) {
        return toDto(roleRepository.findFirstWithPermissionsByRoleCode(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode)));
    }

    /**
     * [EN] Retrieves the exact set of permission codes bound to a role in PostgreSQL
     * [BN] ডাটাবেজে রোলের সাথে যুক্ত পারমিশন কোডের সেট রিটার্ন করে
     */
    @Cacheable(value = RedisCacheConfig.CACHE_ROLES, key = "'perms_' + #roleCode")
    @Transactional(readOnly = true)
    public Set<String> getRolePermissions(String roleCode) {
        Role role = roleRepository.findFirstWithPermissionsByRoleCode(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));
        return role.getPermissions().stream().map(Permission::getPermissionCode).collect(Collectors.toSet());
    }

    /**
     * [EN] Updates the assigned permissions for a role in role_permissions table
     * [BN] role_permissions টেবিলে রোলের পারমিশন ডায়নামিকালি আপডেট করে
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_ROLES, allEntries = true)
    @Transactional
    public Set<String> updateRolePermissions(String roleCode, Set<String> permissionCodes) {
        if ("ROLE_SUPER_ADMIN".equalsIgnoreCase(roleCode)) {
            throw new BusinessException("ROLE_SUPER_ADMIN possesses permanent unrestricted system authority and cannot be modified.");
        }
        validatePermissionScope(permissionCodes);

        Role role = roleRepository.findFirstWithPermissionsByRoleCode(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));

        Set<Permission> targetPermissions = permissionRepository.findByPermissionCodeIn(permissionCodes);
        role.getPermissions().clear();
        role.getPermissions().addAll(targetPermissions);
        role.setUpdatedAt(Instant.now());
        role.setUpdatedBy(resolveCurrentUser());

        roleRepository.save(role);
        auditLogService.record("ROLE_MANAGEMENT", "ROLE_PERMISSIONS_UPDATED",
                "Updated permissions for role: " + role.getRoleCode() + " (" + targetPermissions.size() + " permissions)",
                role.getId().toString(), role.getRoleCode());

        return role.getPermissions().stream().map(Permission::getPermissionCode).collect(Collectors.toSet());
    }

    /**
     * [EN] Creates a new custom enterprise role scoped under current tenant
     * [BN] বর্তমান কারখানার অধীনে নতুন কাস্টম এন্টারপ্রাইজ রোল তৈরি করে (রুল ২৫)
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_ROLES, allEntries = true)
    @Transactional
    public RoleDto createRole(CreateRoleRequest request) {
        UUID tenantId = TenantContext.getTenantId() != null ? TenantContext.getTenantId() : SYSTEM_TENANT_ID;
        String rawCode = request.getRoleCode().trim().toUpperCase();
        String normalizedCode = rawCode.startsWith("ROLE_") ? rawCode : "ROLE_" + rawCode;

        if (roleRepository.existsByTenantIdAndRoleCodeAndIsDeletedFalse(tenantId, normalizedCode)
                || roleRepository.existsByTenantIdAndRoleCodeAndIsDeletedFalse(SYSTEM_TENANT_ID, normalizedCode)) {
            throw new BusinessException("Role code '" + normalizedCode + "' is already registered.", HttpStatus.CONFLICT);
        }
        validatePermissionScope(request.getPermissionCodes());

        Role role = new Role(tenantId, normalizedCode, request.getRoleName().trim());
        role.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        role.setSystemRole(false);
        role.setCreatedBy(resolveCurrentUser());
        role.setUpdatedBy(resolveCurrentUser());

        if (request.getPermissionCodes() != null && !request.getPermissionCodes().isEmpty()) {
            role.getPermissions().addAll(permissionRepository.findByPermissionCodeIn(request.getPermissionCodes()));
        }
        Role saved = roleRepository.save(role);
        auditLogService.record("ROLE_MANAGEMENT", "ROLE_CREATED",
                "Created role: " + saved.getRoleCode() + " (" + saved.getRoleName() + ")",
                saved.getId().toString(), saved.getRoleCode());
        return toDto(saved);
    }

    /**
     * [EN] Updates an existing custom role title, description, and permissions
     * [BN] বিদ্যমান রোলের নাম, বিবরণ ও পারমিশন হালনাগাদ করে
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_ROLES, allEntries = true)
    @Transactional
    public RoleDto updateRole(String roleCode, UpdateRoleRequest request) {
        if ("ROLE_SUPER_ADMIN".equalsIgnoreCase(roleCode)) {
            throw new BusinessException("ROLE_SUPER_ADMIN possesses permanent unrestricted system authority and cannot be modified.");
        }

        // [EN] Privilege Escalation Guard on role modification
        // [BN] বিদ্যমান রোল হালনাগাদের ক্ষেত্রে প্রিভিলেজ এসকেলেশন যাচাই
        validatePermissionScope(request.getPermissionCodes());

        Role role = roleRepository.findFirstWithPermissionsByRoleCode(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));

        role.setRoleName(request.getRoleName().trim());
        role.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        if (request.getPermissionCodes() != null) {
            role.getPermissions().clear();
            role.getPermissions().addAll(permissionRepository.findByPermissionCodeIn(request.getPermissionCodes()));
        }

        role.setUpdatedAt(Instant.now());
        role.setUpdatedBy(resolveCurrentUser());

        Role saved = roleRepository.save(role);
        auditLogService.record("ROLE_MANAGEMENT", "ROLE_UPDATED",
                "Updated role: " + saved.getRoleCode() + " (" + saved.getRoleName() + ")",
                saved.getId().toString(), saved.getRoleCode());
        return toDto(saved);
    }

    /**
     * [EN] Validates that non-superadmin callers cannot grant platform-root permissions
     * [BN] নন-সুপারঅ্যাডমিন অপারেটররা যাতে প্ল্যাটফর্ম রুট পারমিশন অ্যাসাইন করতে না পারে তা নিশ্চিত করে
     */
    private void validatePermissionScope(Collection<String> permissionCodes) {
        if (permissionCodes == null || permissionCodes.isEmpty() || SecurityUtils.isSuperAdmin()) return;
        if (permissionCodes.stream().anyMatch(SecurityUtils::isPlatformRootPermission)) {
            throw new BusinessException("Access Denied: Only Platform Super Admin can grant Client Management permissions.", HttpStatus.FORBIDDEN);
        }
    }

    /**
     * [EN] Deletes a custom enterprise role (guarded against system roles and assigned users)
     * [BN] কাস্টম রোল অপসারিত করে (সিস্টেম রোল ও সক্রিয় অ্যাসাইনমেন্ট সুরক্ষিত)
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_ROLES, allEntries = true)
    @Transactional
    public void deleteRole(String roleCode) {
        Role role = roleRepository.findFirstWithPermissionsByRoleCode(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));

        if (role.isSystemRole()) {
            throw new BusinessException("System built-in roles (" + role.getRoleName() + ") are protected and cannot be deleted.");
        }
        long assignedUsers = roleRepository.countUsersByRoleId(role.getId());
        if (assignedUsers > 0) {
            throw new BusinessException("Cannot delete role '" + role.getRoleName() + "' because " + assignedUsers + " active user(s) are currently assigned to it.", HttpStatus.CONFLICT);
        }

        role.setDeleted(true);
        role.setUpdatedAt(Instant.now());
        role.setUpdatedBy(resolveCurrentUser());
        roleRepository.save(role);
        auditLogService.record("ROLE_MANAGEMENT", "ROLE_DELETED",
                "Deleted role: " + role.getRoleCode() + " (" + role.getRoleName() + ")",
                role.getId().toString(), role.getRoleCode());
    }

    /**
     * [EN] Restores a soft-deleted custom role back to active status
     * [BN] সফট-ডিলিটকৃত কাস্টম রোল পুনরায় সক্রিয় অবস্থায় ফিরিয়ে আনে
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_ROLES, allEntries = true)
    @Transactional
    public RoleDto restoreRole(String roleCode) {
        Role role = roleRepository.findFirstWithPermissionsByRoleCodeAllowDeleted(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));
        if (!role.isDeleted()) {
            throw new BusinessException("Role is already active and cannot be restored.", HttpStatus.BAD_REQUEST);
        }
        role.setDeleted(false);
        role.setUpdatedAt(Instant.now());
        role.setUpdatedBy(resolveCurrentUser());
        Role saved = roleRepository.save(role);
        auditLogService.record("ROLE_MANAGEMENT", "ROLE_RESTORED",
                "Restored role: " + saved.getRoleCode() + " (" + saved.getRoleName() + ")",
                saved.getId().toString(), saved.getRoleCode());
        return toDto(saved);
    }

    /**
     * [EN] Permanently purges a soft-deleted custom role from database
     * [BN] ট্র্যাশ থেকে কাস্টম রোল চিরতরে মুছে ফেলে
     */
    @CacheEvict(value = RedisCacheConfig.CACHE_ROLES, allEntries = true)
    @Transactional
    public void purgeRole(String roleCode) {
        Role role = roleRepository.findFirstWithPermissionsByRoleCodeAllowDeleted(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));
        if (role.isSystemRole()) {
            throw new BusinessException("System built-in roles (" + role.getRoleName() + ") are protected and cannot be purged.");
        }
        if (!role.isDeleted()) {
            throw new BusinessException("Only soft-deleted roles in Trash can be permanently purged.", HttpStatus.BAD_REQUEST);
        }
        long assignedUsers = roleRepository.countUsersByRoleId(role.getId());
        if (assignedUsers > 0) {
            throw new BusinessException("Cannot purge role '" + role.getRoleName() + "' because " + assignedUsers + " active user(s) are assigned to it.", HttpStatus.CONFLICT);
        }
        role.getPermissions().clear();
        roleRepository.delete(role);
        auditLogService.record("ROLE_MANAGEMENT", "ROLE_PURGED",
                "Permanently purged role: " + role.getRoleCode() + " (" + role.getRoleName() + ")",
                role.getId().toString(), role.getRoleCode());
    }

    private RoleDto toDto(Role role) {
        RoleDto dto = new RoleDto();
        dto.setId(role.getId()); dto.setRoleCode(role.getRoleCode());
        dto.setRoleName(role.getRoleName()); dto.setDescription(role.getDescription());
        dto.setSystemRole(role.isSystemRole()); dto.setTenantId(role.getTenantId());
        dto.setDeleted(role.isDeleted());
        if (role.getTenantId() != null && !SYSTEM_TENANT_ID.equals(role.getTenantId())) {
            tenantRepository.findById(role.getTenantId()).ifPresent(t -> {
                dto.setTenantCode(t.getTenantCode()); dto.setTenantName(t.getTenantName());
            });
        }
        dto.setPermissions(role.getPermissions().stream().map(Permission::getPermissionCode).collect(Collectors.toSet()));
        return dto;
    }

    private String resolveCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "SYSTEM";
    }
}
