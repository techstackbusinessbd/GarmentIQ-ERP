package com.garments.erp.merchandising.buyer.repository;

import com.garments.erp.merchandising.buyer.entity.BuyerBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Spring Data JPA Repository for Buyer Sub-Brands (BuyerBrandRepository.java)
 * [BN] বায়ার সাব-ব্র্যান্ডদের স্প্রিং ডাটা জেপিএ রিপোজিটরি (BuyerBrandRepository.java)
 * =============================================================================
 * [EN] Reference: Rule 05 (Database Ground Truth), Rule 08 (Sub-200ms Performance)
 * [BN] নির্দিষ্ট বায়ারের অধীনস্থ সাব-ব্র্যান্ড তালিকা ও ইউনিক কনস্ট্রেইন্ট ভ্যালিডেশন কুয়েরি।
 */
@Repository
public interface BuyerBrandRepository extends JpaRepository<BuyerBrand, UUID> {

    /**
     * [EN] List all non-deleted brands belonging to a parent buyer
     * [BN] একটি প্যারেন্ট বায়ারের অধীনস্থ সকল সক্রিয় সাব-ব্র্যান্ডের তালিকা
     */
    @Query("SELECT b FROM BuyerBrand b WHERE b.tenantId = :tenantId AND b.buyer.id = :buyerId AND b.deletedAt IS NULL ORDER BY b.brandName ASC")
    List<BuyerBrand> findByTenantIdAndBuyerIdAndDeletedAtIsNull(
            @Param("tenantId") UUID tenantId,
            @Param("buyerId") UUID buyerId
    );

    /**
     * [EN] Fetch single non-deleted sub-brand
     * [BN] একক সক্রিয় সাব-ব্র্যান্ড অনুসন্ধান
     */
    Optional<BuyerBrand> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, UUID id);

    /**
     * [EN] Unique constraint validation checks
     * [BN] ব্র্যান্ড কোড ও নামের ডুপ্লিকেট প্রতিরোধ যাচাই
     */
    @Query("SELECT COUNT(b) > 0 FROM BuyerBrand b WHERE b.tenantId = :tenantId AND b.buyer.id = :buyerId AND b.brandCode = :brandCode AND b.deletedAt IS NULL")
    boolean existsByTenantIdAndBuyerIdAndBrandCodeAndDeletedAtIsNull(
            @Param("tenantId") UUID tenantId,
            @Param("buyerId") UUID buyerId,
            @Param("brandCode") String brandCode
    );

    @Query("SELECT COUNT(b) > 0 FROM BuyerBrand b WHERE b.tenantId = :tenantId AND b.buyer.id = :buyerId AND LOWER(b.brandName) = LOWER(:brandName) AND b.deletedAt IS NULL")
    boolean existsByTenantIdAndBuyerIdAndBrandNameIgnoreCaseAndDeletedAtIsNull(
            @Param("tenantId") UUID tenantId,
            @Param("buyerId") UUID buyerId,
            @Param("brandName") String brandName
    );

    @Query("SELECT COUNT(b) > 0 FROM BuyerBrand b WHERE b.tenantId = :tenantId AND b.buyer.id = :buyerId AND LOWER(b.brandName) = LOWER(:brandName) AND b.id != :id AND b.deletedAt IS NULL")
    boolean existsByTenantIdAndBuyerIdAndBrandNameIgnoreCaseAndIdNotAndDeletedAtIsNull(
            @Param("tenantId") UUID tenantId,
            @Param("buyerId") UUID buyerId,
            @Param("brandName") String brandName,
            @Param("id") UUID id
    );

    /**
     * [EN] Count active sub-brands for a buyer
     * [BN] একটি বায়ারের মোট সক্রিয় সাব-ব্র্যান্ডের সংখ্যা
     */
    @Query("SELECT COUNT(b) FROM BuyerBrand b WHERE b.buyer.id = :buyerId AND b.deletedAt IS NULL")
    long countByBuyerIdAndDeletedAtIsNull(@Param("buyerId") UUID buyerId);
}

