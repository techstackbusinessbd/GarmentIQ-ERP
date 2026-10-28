package com.garments.erp.user.repository;

import com.garments.erp.user.entity.UserCustomPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] User Custom Permission Data Access Repository
 * [BN] ব্যবহারকারীর কাস্টম পারমিশন ডেটাবেজ এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Repository
public interface UserCustomPermissionRepository extends JpaRepository<UserCustomPermission, UUID> {

    /**
     * [EN] Retrieves all custom permission overrides assigned to a given user
     * [BN] নির্দিষ্ট ব্যবহারকারীকে নির্ধারিত সমস্ত কাস্টম পারমিশন ওভাররাইড লোড করে
     */
    List<UserCustomPermission> findByUserId(UUID userId);

    /**
     * [EN] Removes all custom permissions for a specific user upon reset
     * [BN] ব্যবহারকারীর সমস্ত কাস্টম পারমিশন রিসেট বা মুছে ফেলা
     */
    void deleteByUserId(UUID userId);
}
