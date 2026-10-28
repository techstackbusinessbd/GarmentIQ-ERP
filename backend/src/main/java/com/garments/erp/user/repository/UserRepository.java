package com.garments.erp.user.repository;

import com.garments.erp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Enterprise User Data Access Repository
 * [BN] মাল্টি-টেন্যান্ট এন্টারপ্রাইজ ব্যবহারকারী ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Provides database operations for user authentication, tenant-scoped lookup,
 *      duplicate credential checks, and eager role/permission fetching for JWT security.
 * [BN] ব্যবহারকারী অথেন্টিকেশন, টেন্যান্টভিত্তিক তথ্য অনুসন্ধান, ডুপ্লিকেট ইউজারনেম/ইমেইল
 *      যাচাই এবং স্প্রিং সিকিউরিটি ও জেডব্লিউটি-এর জন্য অপ্টিমাইজড ডেটাবেজ কুয়েরি পরিচালনা করে।
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * [EN] Finds active non-deleted user by tenant UUID and unique username
     * [BN] টেন্যান্ট আইডি এবং ইউজারনেম দিয়ে সক্রিয় অবিলুপ্ত ইউজার অনুসন্ধান করে
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param username [EN] Unique username / [BN] ইউজারনেম
     * @return [EN] Optional matching user / [BN] প্রাপ্ত ইউজার রেকর্ড
     */
    Optional<User> findByTenantIdAndUsernameAndIsDeletedFalse(UUID tenantId, String username);

    /**
     * [EN] Finds active non-deleted user by primary UUID
     * [BN] প্রাইমারি আইডি দ্বারা সক্রিয় অবিলুপ্ত ইউজার অনুসন্ধান করে
     */
    Optional<User> findByIdAndIsDeletedFalse(UUID id);

    /**
     * [EN] Finds active user by username across system (e.g. root superadmin login)
     * [BN] পুরো সিস্টেমে ইউজারনেম দিয়ে সক্রিয় ইউজার অনুসন্ধান করে (যেমন: সুপারএডমিন)
     *
     * @param username [EN] Login username / [BN] ইউজারনেম
     * @return [EN] Optional user / [BN] প্রাপ্ত ইউজার
     */
    Optional<User> findByUsernameAndIsDeletedFalse(String username);

    /**
     * [EN] Finds active user by email within a tenant
     * [BN] নির্দিষ্ট টেন্যান্টে ইমেইল দ্বারা সক্রিয় ইউজার অনুসন্ধান করে
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param email    [EN] Official email / [BN] প্রাতিষ্ঠানিক ইমেইল
     * @return [EN] Optional user / [BN] প্রাপ্ত ইউজার
     */
    Optional<User> findByTenantIdAndEmailAndIsDeletedFalse(UUID tenantId, String email);

    /**
     * [EN] Finds active user by email across the entire system for global corporate email login
     * [BN] পুরো সিস্টেমে প্রাতিষ্ঠানিক ইমেইল দ্বারা সক্রিয় ব্যবহারকারী অনুসন্ধান করে
     */
    Optional<User> findByEmailAndIsDeletedFalse(String email);

    /**
     * [EN] Counts active users sharing the same username across all tenants for collision detection
     * [BN] বিভিন্ন টেন্যান্টে একই ইউজারনেম একাধিক আছে কিনা তা যাচাইয়ের জন্য গণনা করে
     */
    long countByUsernameAndIsDeletedFalse(String username);

    /**
     * [EN] Eagerly loads user with roles and permissions by corporate email for single query auth
     * [BN] প্রাতিষ্ঠানিক ইমেইল দিয়ে একক কুয়েরিতে রোল ও পারমিশনসহ ইউজার লোড করে
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.roles r " +
           "LEFT JOIN FETCH r.permissions p " +
           "WHERE LOWER(u.email) = LOWER(:email) AND u.isDeleted = false")
    Optional<User> findWithRolesAndPermissionsByEmail(@Param("email") String email);

    /**
     * [EN] Retrieves all active non-deleted users scoped under a tenant (User Grid)
     * [BN] টেন্যান্টের অধীনে বিদ্যমান সকল সক্রিয় ইউজারের তালিকা ফেরত দেয়
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @return [EN] List of users / [BN] ইউজারের তালিকা
     */
    List<User> findAllByTenantIdAndIsDeletedFalseOrderByFullNameAsc(UUID tenantId);
    List<User> findAllByTenantIdOrderByFullNameAsc(UUID tenantId);

    /**
     * [EN] Retrieves all active non-deleted users across all tenants (for platform admin)
     * [BN] প্ল্যাটফর্ম অ্যাডমিনের জন্য সকল টেন্যান্টের সক্রিয় ইউজারদের তালিকা ফেরত দেয়
     */
    List<User> findAllByIsDeletedFalseOrderByFullNameAsc();
    List<User> findAllByOrderByFullNameAsc();

    /**
     * [EN] Batch lookup users by collection of usernames (for audit logs and actor resolution)
     * [BN] অডিট লগ ও অ্যাক্টর তথ্য প্রদর্শনের জন্য ইউজারনেম তালিকা দিয়ে ব্যাচ ইউজার ফেচ
     */
    List<User> findByUsernameIn(Collection<String> usernames);

    /**
     * [EN] Eagerly loads user with roles and permissions in a single optimized query
     * [BN] একক অপ্টিমাইজড কুয়েরিতে রোল ও পারমিশনসহ সম্পূর্ণ ইউজার রেকর্ড লোড করে
     *
     * @param username [EN] Login username / [BN] ইউজারনেম
     * @return [EN] Optional user with fully initialized security authorities / [BN] পারমিশনসহ ইউজার
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.roles r " +
           "LEFT JOIN FETCH r.permissions p " +
           "WHERE u.username = :username AND u.isDeleted = false")
    Optional<User> findWithRolesAndPermissionsByUsername(@Param("username") String username);

    /**
     * [EN] Eagerly loads tenant-scoped user with roles and permissions for strict isolation
     * [BN] কঠোর টেন্যান্ট আইসোলেশন বজায় রেখে রোল ও পারমিশনসহ ইউজার রেকর্ড লোড করে
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param username [EN] Login username / [BN] ইউজারনেম
     * @return [EN] Optional populated user / [BN] পারমিশনসহ প্রাপ্ত ইউজার
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.roles r " +
           "LEFT JOIN FETCH r.permissions p " +
           "WHERE u.tenantId = :tenantId AND u.username = :username AND u.isDeleted = false")
    Optional<User> findWithRolesAndPermissionsByTenantIdAndUsername(
            @Param("tenantId") UUID tenantId,
            @Param("username") String username
    );

    /**
     * [EN] Verifies if username is already registered within the tenant
     * [BN] নির্দিষ্ট টেন্যান্টে কোনো ইউজারনেম ইতিমধ্যে ব্যবহৃত কি না তা যাচাই করে
     *
     * @param tenantId [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param username [EN] Candidate username / [BN] যাচাইযোগ্য ইউজারনেম
     * @return [EN] true if taken, false otherwise / [BN] বিদ্যমান থাকলে true
     */
    boolean existsByTenantIdAndUsernameAndIsDeletedFalse(UUID tenantId, String username);

    /**
     * [EN] Verifies if email is already registered within the tenant
     * [BN] নির্দিষ্ট টেন্যান্টে কোনো ইমেইল ইতিমধ্যে ব্যবহৃত কি না তা যাচাই করে
     *
     * @param tenantId [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param email    [EN] Candidate email / [BN] যাচাইযোগ্য ইমেইল
     * @return [EN] true if taken, false otherwise / [BN] বিদ্যমান থাকলে true
     */
    boolean existsByTenantIdAndEmailAndIsDeletedFalse(UUID tenantId, String email);

    /**
     * [EN] Deletes all users belonging to tenant on permanent purge
     * [BN] ক্লায়েন্ট টেন্যান্ট চিরতরে মুছে ফেলার সময় সংশ্লিষ্ট সকল ইউজার ডিলিট করে
     */
    void deleteAllByTenantId(UUID tenantId);
}
