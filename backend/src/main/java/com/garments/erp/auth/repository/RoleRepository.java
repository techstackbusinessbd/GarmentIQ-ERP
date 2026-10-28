package com.garments.erp.auth.repository;

import com.garments.erp.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Security Role Data Access Repository
 * [BN] মাল্টি-টেন্যান্ট সিকিউরিটি রোল ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Manages tenant-scoped roles, role-permission associations, and eager
 *      permission fetching for Spring Security authentication and JWT token generation.
 * [BN] টেন্যান্টভিত্তিক রোল, রোল-পারমিশন অ্যাসোসিয়েশন এবং স্প্রিং সিকিউরিটি অথেন্টিকেশনের
 *      জন্য ইগার পারমিশন লোড করার ডেটাবেজ অপারেশন পরিচালনা করে।
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    /**
     * [EN] Finds active non-deleted role by tenant UUID and role code
     * [BN] টেন্যান্ট আইডি এবং রোল কোড দিয়ে সক্রিয় অবিলুপ্ত রোল অনুসন্ধান করে
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param roleCode [EN] Standard role code / [BN] রোল কোড
     * @return [EN] Optional matching role / [BN] প্রাপ্ত রোল রেকর্ড
     */
    Optional<Role> findByTenantIdAndRoleCodeAndIsDeletedFalse(UUID tenantId, String roleCode);

    /**
     * [EN] Retrieves all active roles scoped under a specific tenant organization
     * [BN] একটি নির্দিষ্ট টেন্যান্টের অধীনে বিদ্যমান সকল সক্রিয় রোলের তালিকা ফেরত দেয়
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @return [EN] List of active roles / [BN] সক্রিয় রোলের তালিকা
     */
    List<Role> findAllByTenantIdAndIsDeletedFalseOrderByRoleNameAsc(UUID tenantId);

    /**
     * [EN] Finds first active role by standard role code (system fallback)
     * [BN] স্ট্যান্ডার্ড রোল কোড দিয়ে প্রথম সক্রিয় রোল রেকর্ড অনুসন্ধান করে (সিস্টেম ফলব্যাক)
     *
     * @param roleCode [EN] Standard role code / [BN] রোল কোড
     * @return [EN] Optional matching role / [BN] প্রাপ্ত রোল রেকর্ড
     */
    Optional<Role> findFirstByRoleCodeAndIsDeletedFalse(String roleCode);

    /**
     * [EN] Eagerly fetches role with bound permissions using LEFT JOIN FETCH
     * [BN] পারমিশনসহ রোল রেকর্ড সরাসরি লোড করার জন্য অপ্টিমাইজড কুয়েরি
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param roleCode [EN] Standard role code / [BN] রোল কোড
     * @return [EN] Optional role populated with permissions / [BN] পারমিশনসহ প্রাপ্ত রোল
     */
    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions " +
           "WHERE r.tenantId = :tenantId AND r.roleCode = :roleCode AND r.isDeleted = false")
    Optional<Role> findWithPermissions(
            @Param("tenantId") UUID tenantId,
            @Param("roleCode") String roleCode
    );

    /**
     * [EN] Batch fetches multiple roles with initialized permissions by role ID set
     * [BN] একাধিক রোল আইডির জন্য পারমিশনসহ রোল অবজেক্ট সংগ্রহ করে (ইউজার অথেনটিকেশন)
     *
     * @param roleIds [EN] Set of role UUIDs / [BN] রোল আইডি কালেকশন
     * @return [EN] Set of populated roles / [BN] পারমিশনসহ রোল সেট
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.permissions " +
           "WHERE r.id IN :roleIds AND r.isDeleted = false")
    Set<Role> findAllWithPermissionsByIds(@Param("roleIds") Collection<UUID> roleIds);

    /**
     * [EN] Verifies whether a role code is already taken within the tenant
     * [BN] নির্দিষ্ট টেন্যান্টে কোনো রোল কোড ইতিমধ্যে ব্যবহৃত কি না তা যাচাই করে
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param roleCode [EN] Candidate role code / [BN] যাচাইযোগ্য রোল কোড
     * @return [EN] true if exists, false otherwise / [BN] বিদ্যমান থাকলে true
     */
    boolean existsByTenantIdAndRoleCodeAndIsDeletedFalse(UUID tenantId, String roleCode);

    /**
     * [EN] Retrieves all active roles for the active tenant and system baseline roles
     * [BN] বর্তমান টেন্যান্ট এবং সিস্টেম রুট রোলের সম্মিলিত তালিকা সংগ্রহ করে
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.permissions " +
           "WHERE (r.tenantId = :tenantId OR r.tenantId = :systemTenantId) AND r.isDeleted = false " +
           "ORDER BY r.roleName ASC")
    List<Role> findAllForTenantOrSystem(@Param("tenantId") UUID tenantId, @Param("systemTenantId") UUID systemTenantId);

    /**
     * [EN] Retrieves all active roles across the entire platform for Super Admin
     * [BN] প্ল্যাটফর্ম সুপারএডমিনের জন্য সমগ্র সিস্টেমের সমস্ত রোলের পূর্ণাঙ্গ তালিকা
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.permissions " +
           "WHERE r.isDeleted = false " +
           "ORDER BY r.roleName ASC")
    List<Role> findAllWithPermissionsByIsDeletedFalse();

    /**
     * [EN] Eagerly fetches role with bound permissions by role code across tenant/system
     * [BN] রোল কোড দিয়ে পারমিশনসহ রোল অবজেক্ট সরাসরি লোড করে
     */
    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions " +
           "WHERE r.roleCode = :roleCode AND r.isDeleted = false")
    Optional<Role> findFirstWithPermissionsByRoleCode(@Param("roleCode") String roleCode);

    /**
     * [EN] Counts active users associated with a specific role
     * [BN] নির্দিষ্ট রোলের সাথে যুক্ত সক্রিয় ব্যবহারকারীর সংখ্যা গণনা করে
     */
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.id = :roleId AND u.isDeleted = false")
    long countUsersByRoleId(@Param("roleId") UUID roleId);

    /**
     * [EN] Retrieves all roles (including deleted) with permissions across platform
     * [BN] প্ল্যাটফর্মের সকল রোল (ডিলিটকৃতসহ) পারমিশনসহ সংগ্রহ করে
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.permissions ORDER BY r.roleName ASC")
    List<Role> findAllWithPermissions();

    /**
     * [EN] Retrieves all roles (including deleted) for tenant or system
     * [BN] টেন্যান্ট বা সিস্টেমের সকল রোল (ডিলিটকৃতসহ) সংগ্রহ করে
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.permissions " +
           "WHERE (r.tenantId = :tenantId OR r.tenantId = :systemTenantId) ORDER BY r.roleName ASC")
    List<Role> findAllForTenantOrSystemWithDeleted(@Param("tenantId") UUID tenantId, @Param("systemTenantId") UUID systemTenantId);

    /**
     * [EN] Fetches role with permissions by role code even if soft-deleted
     * [BN] সফট-ডিলিট হলেও রোল কোড দ্বারা পারমিশনসহ রোল নিয়ে আসে
     */
    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions WHERE r.roleCode = :roleCode")
    Optional<Role> findFirstWithPermissionsByRoleCodeAllowDeleted(@Param("roleCode") String roleCode);
}

