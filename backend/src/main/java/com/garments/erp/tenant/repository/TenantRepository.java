package com.garments.erp.tenant.repository;

import com.garments.erp.tenant.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Organization Data Access Repository
 * [BN] মাল্টি-টেন্যান্ট মূল প্রতিষ্ঠান ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Provides database operations for tenant provisioning, lookup by code,
 *      and active status verification during tenant-scaffolded API requests.
 * [BN] টেন্যান্ট নিবন্ধন, ইউনিক কোড দ্বারা অনুসন্ধান এবং মাল্টি-টেন্যান্ট রিকোয়েস্টের
 *      সময় টেন্যান্টের সক্রিয় অবস্থা যাচাইয়ের ডেটাবেজ অপারেশন পরিচালনা করে।
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {

    /**
     * [EN] Finds tenant record by its unique corporate business code (e.g. TEXTECH)
     * [BN] ইউনিক ব্যবসায়িক কোড দ্বারা টেন্যান্ট রেকর্ড অনুসন্ধান করে
     *
     * @param tenantCode [EN] Unique business code / [BN] ইউনিক কোড
     * @return [EN] Optional matching tenant / [BN] প্রাপ্ত টেন্যান্ট অবজেক্ট
     */
    Optional<Tenant> findByTenantCode(String tenantCode);

    /**
     * [EN] Finds tenant by unique code ensuring it is currently active and not deleted
     * [BN] সক্রিয় এবং অবিলুপ্ত টেন্যান্ট কোড দিয়ে অনুসন্ধান করে
     *
     * @param tenantCode [EN] Unique business code / [BN] ইউনিক কোড
     * @return [EN] Optional active tenant / [BN] প্রাপ্ত সক্রিয় টেন্যান্ট
     */
    Optional<Tenant> findByTenantCodeAndIsActiveTrueAndIsDeletedFalse(String tenantCode);

    /**
     * [EN] Verifies whether a tenant business code is already registered in the system
     * [BN] কোনো টেন্যান্ট কোড ইতিমধ্যে সিস্টেমে নিবন্ধিত কি না তা যাচাই করে
     *
     * @param tenantCode [EN] Business code to check / [BN] যাচাইযোগ্য কোড
     * @return [EN] true if exists, false otherwise / [BN] অস্তিত্ব থাকলে true
     */
    boolean existsByTenantCode(String tenantCode);

    /**
     * [EN] Verifies whether a contact email is already registered by another tenant
     * [BN] কোনো ইমেইল অন্য কোনো টেন্যান্ট ব্যবহার করছে কি না তা যাচাই করে
     *
     * @param contactEmail [EN] Email address to verify / [BN] যাচাইযোগ্য ইমেইল
     * @return [EN] true if exists, false otherwise / [BN] অস্তিত্ব থাকলে true
     */
    boolean existsByContactEmail(String contactEmail);

    /**
     * [EN] Verifies whether a subdomain is already in use by another tenant
     * [BN] কোনো সাবডোমেন ইতিমধ্যে অন্য কোনো টেন্যান্ট ব্যবহার করছে কি না যাচাই করে
     */
    boolean existsBySubdomainIgnoreCaseAndIsDeletedFalse(String subdomain);

    /**
     * [EN] Finds tenant by subdomain slug ensuring active status
     * [BN] সক্রিয় সাবডোমেন দিয়ে টেন্যান্ট খুঁজে বের করে
     */
    Optional<Tenant> findBySubdomainIgnoreCaseAndIsActiveTrueAndIsDeletedFalse(String subdomain);

    /**
     * [EN] Finds tenant by subdomain slug regardless of active status (for suspension diagnosis)
     * [BN] সাবডোমেন দিয়ে টেন্যান্ট খুঁজে বের করে (সাসপেন্ডেড অবস্থা নির্ণয়ের জন্য)
     */
    Optional<Tenant> findBySubdomainIgnoreCaseAndIsDeletedFalse(String subdomain);

    /**
     * [EN] Finds tenant by on-premise custom domain FQDN or IP
     * [BN] অন-প্রেমিসেস কাস্টম ডোমেন বা আইপি দিয়ে টেন্যান্ট খুঁজে বের করে
     */
    Optional<Tenant> findByCustomDomainIgnoreCaseAndIsActiveTrueAndIsDeletedFalse(String customDomain);

    /**
     * [EN] Retrieves all non-deleted client tenants ordered by company name
     * [BN] মুছে ফেলা হয়নি এমন সকল ক্লায়েন্ট টেন্যান্টের তালিকা কোম্পানির নামানুসারে আনে
     */
    java.util.List<Tenant> findAllByIsDeletedFalseOrderByTenantNameAsc();

    /**
     * [EN] Retrieves all client tenants including deleted ordered by company name
     * [BN] মুছে ফেলাসহ সকল ক্লায়েন্ট টেন্যান্টের তালিকা কোম্পানির নামানুসারে আনে
     */
    java.util.List<Tenant> findAllByOrderByTenantNameAsc();
}
