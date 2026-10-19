package com.garments.erp.user.service;

import com.garments.erp.auth.entity.Role;
import com.garments.erp.auth.repository.RoleRepository;
import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.user.dto.CreateUserRequest;
import com.garments.erp.user.dto.UpdateUserRequest;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
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
 * [EN] Encapsulates business logic for provisioning users, managing role sets,
 *      enforcing unique credential boundaries per tenant, and soft deletion.
 * [BN] টেন্যান্ট বাউন্ডারির মধ্যে ব্যবহারকারী নিবন্ধন, সিকিউরিটি রোল পরিচালনা,
 *      ইউনিক ক্রেডেনশিয়াল নিশ্চিতকরণ এবং নিরাপদ সফট-ডিলিটের ব্যবসায়িক যুক্তি সম্পাদন করে।
 */
@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param userRepository  [EN] User data repository / [BN] ইউজার ডেটা রিপোজিটরি
     * @param roleRepository  [EN] Role data repository / [BN] রোল ডেটা রিপোজিটরি
     * @param passwordEncoder [EN] Cryptographic password hasher / [BN] পাসওয়ার্ড হ্যাশার
     */
    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * [EN] Retrieves all active users scoped under current tenant organization
     * [BN] বর্তমান টেন্যান্টের অধীনে বিদ্যমান সকল সক্রিয় ব্যবহারকারীর তালিকা ফেরত দেয়
     */
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        UUID tenantId = resolveTenantId();
        List<User> users = userRepository.findAllByTenantIdAndIsDeletedFalseOrderByFullNameAsc(tenantId);

        return users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * [EN] Retrieves a specific user by identifier strictly within tenant boundary
     * [BN] টেন্যান্ট বাউন্ডারির মধ্যে আইডি দ্বারা নির্দিষ্ট ইউজারের তথ্য ফেরত দেয়
     */
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        UUID tenantId = resolveTenantId();
        User user = findUserByIdAndTenant(id, tenantId);
        return mapToDto(user);
    }

    /**
     * [EN] Provisions a new user account with hashed password and role assignments
     * [BN] পাসওয়ার্ড হ্যাশ ও রোল নির্ধারণ করে নতুন ইউজার অ্যাকাউন্ট তৈরি করে
     */
    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        UUID tenantId = resolveTenantId();
        log.info("Creating new user '{}' for tenant {}", request.getUsername(), tenantId);

        // [EN] Enforce credential uniqueness within tenant
        // [BN] টেন্যান্টে ইউজারনেম ও ইমেইলের অনন্যতা যাচাই করা
        if (userRepository.existsByTenantIdAndUsernameAndIsDeletedFalse(tenantId, request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken in this tenant");
        }
        if (userRepository.existsByTenantIdAndEmailAndIsDeletedFalse(tenantId, request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered in this tenant");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User(tenantId, request.getUsername(), request.getEmail(), passwordHash, request.getFullName());
        user.setDepartment(request.getDepartment());
        user.setDesignation(request.getDesignation());
        user.setPhone(request.getPhone());
        user.setStatus(UserStatus.ACTIVE);

        // [EN] Assign roles if specified in request
        // [BN] রিকোয়েস্টে উল্লিখিত রোলসমূহ ব্যবহারকারীতে সংযুক্ত করা
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleCode : request.getRoles()) {
                roleRepository.findByTenantIdAndRoleCodeAndIsDeletedFalse(tenantId, roleCode)
                        .ifPresent(user::addRole);
            }
        }

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    /**
     * [EN] Modifies an existing user profile and updates role assignments
     * [BN] বিদ্যমান ব্যবহারকারীর প্রোফাইল তথ্য এবং রোল বরাদ্দ হালনাগাদ করে
     */
    @Transactional
    public UserDto updateUser(UUID id, UpdateUserRequest request) {
        UUID tenantId = resolveTenantId();
        User user = findUserByIdAndTenant(id, tenantId);

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getDesignation() != null) {
            user.setDesignation(request.getDesignation());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        // [EN] Update roles if specified in request
        // [BN] রিকোয়েস্টে নতুন রোল সেট দেওয়া থাকলে তা হালনাগাদ করা
        if (request.getRoles() != null) {
            user.getRoles().clear();
            for (String roleCode : request.getRoles()) {
                roleRepository.findByTenantIdAndRoleCodeAndIsDeletedFalse(tenantId, roleCode)
                        .ifPresent(user::addRole);
            }
        }

        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    /**
     * [EN] Performs safe soft-delete of a user account preserving audit history
     * [BN] অডিট হিস্ট্রি সংরক্ষণ করে ইউজারের নিরাপদ সফট-ডিলিট সম্পন্ন করে
     */
    @Transactional
    public void deleteUser(UUID id) {
        UUID tenantId = resolveTenantId();
        User user = findUserByIdAndTenant(id, tenantId);

        user.setDeleted(true);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        log.info("Soft-deleted user ID {} from tenant {}", id, tenantId);
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
     * [EN] Finds user by ID verifying strict multi-tenant boundary
     * [BN] কঠোর টেন্যান্ট বাউন্ডারি যাচাই করে ইউজার খুঁজে বের করে
     */
    private User findUserByIdAndTenant(UUID id, UUID tenantId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + id));

        if (!tenantId.equals(user.getTenantId()) || user.isDeleted()) {
            throw new NoSuchElementException("User not found or access denied for ID: " + id);
        }
        return user;
    }

    /**
     * [EN] Helper method mapping User domain entity to secure UserDto
     * [BN] ডোমেন ইউজার এন্টিটিকে নিরাপদ UserDto-তে রূপান্তরকারী হেল্পার মেথড
     */
    private UserDto mapToDto(User user) {
        Set<String> roleCodes = (user.getRoles() != null)
                ? user.getRoles().stream().map(Role::getRoleCode).collect(Collectors.toSet())
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
        dto.setRoles(roleCodes);
        return dto;
    }
}
