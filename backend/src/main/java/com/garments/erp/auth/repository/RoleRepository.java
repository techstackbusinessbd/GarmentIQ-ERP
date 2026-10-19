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
}
