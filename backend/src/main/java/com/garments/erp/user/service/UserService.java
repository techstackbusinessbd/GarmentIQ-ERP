package com.garments.erp.user.service;

import com.garments.erp.auth.entity.Role;
import com.garments.erp.auth.repository.RoleRepository;
import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.user.dto.CreateUserRequest;
import com.garments.erp.user.dto.UpdateUserRequest;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
import com.garments.erp.core.security.SecurityUtils;
import com.garments.erp.settings.service.SystemAuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] Multi-Tenant Enterprise User Management Service (Rule 23)
 * [BN] মাল্টি-টেন্যান্ট এন্টারপ্রাইজ ব্যবহারকারী ব্যবস্থাপনা সার্ভিস (রুল ২৩)
 * =============================================================================
 * [EN] Encapsulates business logic for user provisioning, tenant scoping,
 *      role sets, credential uniqueness, and cross-tenant Super Admin oversight.
 * [BN] টেন্যান্ট বাউন্ডারির মধ্যে ব্যবহারকারী নিবন্ধন, সিকিউরিটি রোল পরিচালনা,
 *      অনন্য ক্রেডেনশিয়াল যাচাই এবং সুপার অ্যাডমিনের ক্রস-টেন্যান্ট তত্ত্বাবধান পরিচালনা করে।
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemAuditLogService auditLogService;

    /**
     * [EN] Retrieves users; super admin views all, factory admin views tenant only
     * [BN] ব্যবহারকারী তালিকা আনে; সুপার অ্যাডমিন সবাইকে দেখে, ফ্যাক্টরি অ্যাডমিন নিজ টেন্যান্টের
     */
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return getAllUsers(false);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(Boolean includeDeleted) {
        boolean withDeleted = Boolean.TRUE.equals(includeDeleted);
        List<User> users = isSuperAdmin()
                ? (withDeleted ? userRepository.findAllByOrderByFullNameAsc() : userRepository.findAllByIsDeletedFalseOrderByFullNameAsc())
                : (withDeleted ? userRepository.findAllByTenantIdOrderByFullNameAsc(resolveTenantId()) : userRepository.findAllByTenantIdAndIsDeletedFalseOrderByFullNameAsc(resolveTenantId()));

        return users.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /**
     * [EN] Retrieves user by ID with super admin privilege or tenant scoping
     * [BN] সুপার অ্যাডমিন সুবিধা বা টেন্যান্ট বাউন্ডারির মধ্যে আইডি দ্বারা ইউজার আনে
     */
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        User user = findUserWithAuthorization(id);
        return mapToDto(user);
    }

    /**
     * [EN] Provisions user under specified tenant (if super admin) or current tenant
     * [BN] কাঙ্ক্ষিত টেন্যান্টে (সুপার অ্যাডমিন) বা বর্তমান টেন্যান্টে নতুন ইউজার তৈরি করে
     */
    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        UUID tenantId = (request.getTenantId() != null && isSuperAdmin())
                ? request.getTenantId()
                : resolveTenantId();

        log.info("Creating new user '{}' for tenant {}", request.getUsername(), tenantId);

        if (!tenantRepository.existsById(tenantId)) {
            throw new IllegalArgumentException("Target tenant does not exist with ID: " + tenantId);
        }
        if (userRepository.existsByTenantIdAndUsernameAndIsDeletedFalse(tenantId, request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken in this tenant");
        }
        if (userRepository.existsByTenantIdAndEmailAndIsDeletedFalse(tenantId, request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered in this tenant");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(tenantId, request.getUsername(), request.getEmail(), passwordHash, request.getFullName());
        Optional.ofNullable(request.getDepartment()).ifPresent(v -> user.setDepartment(v.trim()));
        Optional.ofNullable(request.getDesignation()).ifPresent(v -> user.setDesignation(v.trim()));
        Optional.ofNullable(request.getPhone()).ifPresent(v -> user.setPhone(v.trim()));
        Optional.ofNullable(request.getEmployeeCardNo()).ifPresent(v -> user.setEmployeeCardNo(v.trim()));
        user.setStatus(request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE);

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleCode : request.getRoles()) {
                roleRepository.findByTenantIdAndRoleCodeAndIsDeletedFalse(tenantId, roleCode)
                        .or(() -> roleRepository.findFirstByRoleCodeAndIsDeletedFalse(roleCode))
                        .ifPresent(user::addRole);
            }
        }
        User saved = userRepository.save(user);
        auditLogService.record(saved.getTenantId(), "USER_MANAGEMENT", "USER_CREATED", "User: " + saved.getUsername(), "Created user: " + saved.getUsername() + " (" + saved.getEmail() + ")", "INFO");
        return mapToDto(saved);
    }

    /**
     * [EN] Modifies an existing user profile and updates role assignments
     * [BN] বিদ্যমান ব্যবহারকারীর প্রোফাইল তথ্য এবং রোল বরাদ্দ হালনাগাদ করে
     */
    @Transactional
    public UserDto updateUser(UUID id, UpdateUserRequest request) {
        User user = findUserWithAuthorization(id);
        UUID currentTenantId = user.getTenantId();

        if (request.getTenantId() != null && isSuperAdmin() && !request.getTenantId().equals(currentTenantId)) {
            if (!tenantRepository.existsById(request.getTenantId())) {
                throw new IllegalArgumentException("Target tenant does not exist with ID: " + request.getTenantId());
            }
            user.setTenantId(request.getTenantId());
            currentTenantId = request.getTenantId();
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                userRepository.findByTenantIdAndEmailAndIsDeletedFalse(currentTenantId, newEmail).ifPresent(existing -> {
                    if (!existing.getId().equals(user.getId())) {
                        throw new IllegalArgumentException("Email '" + newEmail + "' is already registered in this tenant");
                    }
                });
                user.setEmail(newEmail);
            }
        }
        Optional.ofNullable(request.getFullName()).ifPresent(user::setFullName);
        Optional.ofNullable(request.getPassword()).filter(p -> !p.trim().isEmpty()).ifPresent(p -> user.setPasswordHash(passwordEncoder.encode(p.trim())));
        Optional.ofNullable(request.getDepartment()).ifPresent(user::setDepartment);
        Optional.ofNullable(request.getDesignation()).ifPresent(user::setDesignation);
        Optional.ofNullable(request.getPhone()).ifPresent(user::setPhone);
        Optional.ofNullable(request.getEmployeeCardNo()).ifPresent(user::setEmployeeCardNo);
        if (request.getStatus() != null) {
            if (user.isSuperAdmin() && request.getStatus() != UserStatus.ACTIVE) {
                user.setStatus(UserStatus.ACTIVE);
            } else {
                user.setStatus(request.getStatus());
            }
            if (user.getStatus() == UserStatus.ACTIVE) {
                user.resetFailedAttempts();
                user.setLockedUntil(null);
            }
        }

        if (request.getRoles() != null) {
            user.getRoles().clear();
            UUID roleTenantId = user.getTenantId();
            for (String roleCode : request.getRoles()) {
                roleRepository.findByTenantIdAndRoleCodeAndIsDeletedFalse(roleTenantId, roleCode)
                        .or(() -> roleRepository.findFirstByRoleCodeAndIsDeletedFalse(roleCode))
                        .ifPresent(user::addRole);
            }
        }
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);
        auditLogService.record(saved.getTenantId(), "USER_MANAGEMENT", "USER_UPDATED", "User: " + saved.getUsername(), "Updated user account profile: " + saved.getUsername(), "INFO");
        return mapToDto(saved);
    }

    /**
     * [EN] Performs safe soft-delete of a user account preserving audit history
     * [BN] অডিট হিস্ট্রি সংরক্ষণ করে ইউজারের নিরাপদ সফট-ডিলিট সম্পন্ন করে
     */
    @Transactional
    public void deleteUser(UUID id) {
        User user = findUserWithAuthorization(id, false);
        if (user.isSuperAdmin()) {
            throw new IllegalStateException("Platform owner / Super Admin account cannot be deleted or deactivated.");
        }
        user.setDeleted(true);
        user.setStatus(UserStatus.INACTIVE);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        auditLogService.record(user.getTenantId(), "USER_MANAGEMENT", "USER_DELETED", "User: " + user.getUsername(), "Soft-deleted user account: " + user.getUsername(), "WARNING");
        log.info("Soft-deleted user ID {} from tenant {}", id, user.getTenantId());
    }

    @Transactional
    public UserDto restoreUser(UUID id) {
        User user = findUserWithAuthorization(id, true);
        if (!user.isDeleted()) {
            throw new IllegalArgumentException("User account is already active and cannot be restored.");
        }
        user.setDeleted(false);
        user.setStatus(UserStatus.ACTIVE);
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);
        auditLogService.record(saved.getTenantId(), "USER_MANAGEMENT", "USER_RESTORED", "User: " + saved.getUsername(), "Restored soft-deleted user account: " + saved.getUsername(), "INFO");
        log.info("Restored user ID {} for tenant {}", id, saved.getTenantId());
        return mapToDto(saved);
    }

    @Transactional
    public void purgeUser(UUID id) {
        User user = findUserWithAuthorization(id, true);
        if (user.isSuperAdmin()) {
            throw new IllegalStateException("Platform owner / Super Admin account is protected and cannot be purged.");
        }
        if (!user.isDeleted()) {
            throw new IllegalArgumentException("Only soft-deleted accounts in Trash can be permanently purged.");
        }
        userRepository.delete(user);
        auditLogService.record(user.getTenantId(), "USER_MANAGEMENT", "USER_PURGED", "User: " + user.getUsername(), "Permanently purged user account: " + user.getUsername(), "CRITICAL");
        log.info("Permanently purged user ID {} from tenant {}", id, user.getTenantId());
    }

    /**
     * [EN] Unlocks a locked user account and clears failed attempt history
     * [BN] লক হওয়া অ্যাকাউন্ট আনলক করে এবং ব্যর্থ লগইন প্রচেষ্টা রিসেট করে
     */
    @Transactional
    public UserDto unlockUser(UUID id) {
        User user = findUserWithAuthorization(id);
        user.unlockAccount();
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);
        auditLogService.record(saved.getTenantId(), "USER_MANAGEMENT", "USER_UNLOCKED", "User: " + saved.getUsername(), "Unlocked user account: " + saved.getUsername(), "SUCCESS");
        log.info("Unlocked user account '{}' (ID: {}) by admin", user.getUsername(), user.getId());
        return mapToDto(saved);
    }

    private boolean isSuperAdmin() { return SecurityUtils.isSuperAdmin(); }
    private User findUserWithAuthorization(UUID id) { return findUserWithAuthorization(id, false); }

    private User findUserWithAuthorization(UUID id, boolean allowDeleted) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + id));

        if (!allowDeleted && user.isDeleted()) {
            throw new NoSuchElementException("User not found or deleted for ID: " + id);
        }
        if (!isSuperAdmin()) {
            UUID tenantId = resolveTenantId();
            if (!tenantId.equals(user.getTenantId())) {
                throw new NoSuchElementException("User not found or access denied for ID: " + id);
            }
        }
        return user;
    }

    /**
     * [EN] Resolves active tenant UUID from context with fail-fast validation
     * [BN] ফেইল-ফাস্ট ভ্যালিডেশনসহ কনটেক্সট থেকে টেন্যান্ট আইডি নিশ্চিত করে
     */
    private UUID resolveTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Active tenant context is missing. Cannot perform user operations.");
        }
        return tenantId;
    }

    /**
     * [EN] Maps User entity to UserDto with enriched tenant code & name
     * [BN] টেন্যান্ট কোড ও নামসহ User এন্টিটিকে UserDto-তে রূপান্তর করে
     */
    private UserDto mapToDto(User user) {
        Set<String> roleCodes = user.getRoles() == null ? Set.of() :
                user.getRoles().stream().map(Role::getRoleCode).collect(Collectors.toSet());
        Set<String> permissionCodes = user.getRoles() == null ? Set.of() :
                user.getRoles().stream().filter(r -> r.getPermissions() != null)
                        .flatMap(r -> r.getPermissions().stream()).map(p -> p.getPermissionCode()).collect(Collectors.toSet());
        UserDto dto = new UserDto(user.getId(), user.getTenantId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getDepartment(), user.getDesignation(), user.getPhone(), user.getStatus());
        dto.setEmployeeCardNo(user.getEmployeeCardNo());
        dto.setRoles(roleCodes);
        dto.setPermissions(permissionCodes);
        dto.setDeleted(user.isDeleted());
        if (user.getTenantId() != null) {
            tenantRepository.findById(user.getTenantId()).ifPresent(t -> {
                dto.setTenantCode(t.getTenantCode());
                dto.setTenantName(t.getTenantName());
            });
        }
        return dto;
    }
}
