package com.garments.erp.auth.repository;

import com.garments.erp.auth.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Granular Permission Data Access Repository
 * [BN] গ্র্যানুলার পারমিশন ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Provides queries for loading system permissions by unique code, module
 *      grouping, and batch retrieval during role assignment operations.
 * [BN] ইউনিক পারমিশন কোড, মডিউলভিত্তিক গ্রুপিং এবং রোল নির্ধারণের সময় ব্যাচ
 *      পারমিশন অনুসন্ধানের ডেটাবেজ অপারেশন পরিচালনা করে।
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    /**
     * [EN] Finds permission by its unique authorization code (e.g. ORDER:READ)
     * [BN] ইউনিক পারমিশন কোড দ্বারা পারমিশন রেকর্ড অনুসন্ধান করে
     *
     * @param permissionCode [EN] Standard permission code / [BN] পারমিশন কোড
     * @return [EN] Optional matching permission / [BN] প্রাপ্ত পারমিশন রেকর্ড
     */
    Optional<Permission> findByPermissionCode(String permissionCode);

    /**
     * [EN] Retrieves all permissions belonging to a specific functional module
     * [BN] নির্দিষ্ট ফাংশনাল মডিউলের সকল পারমিশন তালিকা ফেরত দেয়
     *
     * @param moduleName [EN] Module grouping name / [BN] মডিউলের নাম
     * @return [EN] List of permissions / [BN] পারমিশনের তালিকা
     */
    List<Permission> findAllByModuleNameOrderByPermissionCodeAsc(String moduleName);

    /**
     * [EN] Batch fetches permissions matching a collection of permission codes
     * [BN] একাধিক পারমিশন কোডের তালিকা মিলিয়ে ব্যাচে পারমিশন রেকর্ড সংগ্রহ করে
     *
     * @param codes [EN] Collection of permission codes / [BN] কোডের কালেকশন
     * @return [EN] Set of matching permissions / [BN] প্রাপ্ত পারমিশন সেট
     */
    Set<Permission> findByPermissionCodeIn(Collection<String> codes);

    /**
     * [EN] Checks whether a permission code is already registered in the system
     * [BN] কোনো পারমিশন কোড ইতিমধ্যে সিস্টেমে বিদ্যমান কি না তা যাচাই করে
     *
     * @param permissionCode [EN] Code to verify / [BN] যাচাইযোগ্য কোড
     * @return [EN] true if exists, false otherwise / [BN] বিদ্যমান থাকলে true
     */
    boolean existsByPermissionCode(String permissionCode);

    /**
     * [EN] Retrieves all permissions configured with domain metadata ordered by sortOrder
     * [BN] ডোমেন মেটাডাটা সহ সকল পারমিশন সাজানো ক্রমানুসারে রিটার্ন করে
     */
    List<Permission> findAllByDomainIdIsNotNullOrderBySortOrderAsc();

    /**
     * [EN] Retrieves permissions for a specific domain ordered by sortOrder
     * [BN] নির্দিষ্ট ডোমেনের পারমিশনসমূহ সাজানো ক্রমানুসারে রিটার্ন করে
     */
    List<Permission> findAllByDomainIdOrderBySortOrderAsc(String domainId);
}

