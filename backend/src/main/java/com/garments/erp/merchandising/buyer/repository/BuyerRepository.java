package com.garments.erp.merchandising.buyer.repository;

import com.garments.erp.merchandising.buyer.entity.Buyer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Spring Data JPA Repository for Global Buyers (BuyerRepository.java)
 * [BN] গ্লোবাল বায়ারদের স্প্রিং ডাটা জেপিএ রিপোজিটরি (BuyerRepository.java)
 * =============================================================================
 * [EN] Reference: Rule 05 (Database Ground Truth), Rule 08 (Sub-200ms Performance)
 * [BN] টেন্যান্ট আইসোলেশন ও সফট-ডিলিট ফিল্টারিং সহ পারফরম্যান্ট বায়ার কুয়েরি মেথডস।
 */
@Repository
public interface BuyerRepository extends JpaRepository<Buyer, UUID> {

    /**
     * [EN] Paginated retrieval of active buyers under a tenant
     * [BN] টেন্যান্টের অধীনে সক্রিয় বায়ারদের পেজিনেটেড তালিকা
     */
    Page<Buyer> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    /**
     * [EN] Fetch single non-deleted buyer by primary key and tenant
     * [BN] টেন্যান্ট এবং বায়ার আইডি দ্বারা একক সক্রিয় বায়ার অনুসন্ধান
     */
    Optional<Buyer> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, UUID id);

    /**
     * [EN] Find buyer by unique buyer code (e.g. BYR-0001)
     * [BN] সিস্টেম কোড দ্বারা বায়ার অনুসন্ধান
     */
    Optional<Buyer> findByTenantIdAndBuyerCodeAndDeletedAtIsNull(UUID tenantId, String buyerCode);

    /**
     * [EN] Duplicate validation checks
     * [BN] ডুপ্লিকেট ভ্যালিডেশন চেক
     */
    boolean existsByTenantIdAndBuyerCodeAndDeletedAtIsNull(UUID tenantId, String buyerCode);

    boolean existsByTenantIdAndBuyerNameIgnoreCaseAndDeletedAtIsNull(UUID tenantId, String buyerName);

    boolean existsByTenantIdAndBuyerNameIgnoreCaseAndIdNotAndDeletedAtIsNull(UUID tenantId, String buyerName, UUID id);

    /**
     * [EN] Fast autocomplete dropdown list of active buyers
     * [BN] ড্রপডাউন ও সিলেকশনের জন্য সক্রিয় বায়ারদের তালিকা
     */
    List<Buyer> findByTenantIdAndStatusAndDeletedAtIsNullOrderByBuyerNameAsc(UUID tenantId, String status);

    /**
     * [EN] Fast retrieval when no free-text search query is provided
     * [BN] সার্চ টেক্সট ছাড়া স্ট্যাটাস ও বায়ার টাইপ ফিল্টার সহ দ্রুত কোয়েরি
     */
    @Query("""
        SELECT b FROM Buyer b
        WHERE b.tenantId = :tenantId
          AND b.deletedAt IS NULL
          AND (:status IS NULL OR b.status = :status)
          AND (:buyerType IS NULL OR b.buyerType = :buyerType)
    """)
    Page<Buyer> findByTenantIdAndFilters(
            @Param("tenantId") UUID tenantId,
            @Param("status") String status,
            @Param("buyerType") String buyerType,
            Pageable pageable
    );

    /**
     * [EN] Multi-predicate search query across code, name, country, and status
     * [BN] কোড, নাম, দেশ ও স্ট্যাটাস অনুযায়ী মাল্টি-সার্চ কুয়েরি
     */
    @Query("""
        SELECT b FROM Buyer b
        WHERE b.tenantId = :tenantId
          AND b.deletedAt IS NULL
          AND (:status IS NULL OR b.status = :status)
          AND (:buyerType IS NULL OR b.buyerType = :buyerType)
          AND (LOWER(b.buyerName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(b.buyerCode) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(b.countryOfOrigin) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(b.contactPersonName) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<Buyer> searchBuyers(
            @Param("tenantId") UUID tenantId,
            @Param("search") String search,
            @Param("status") String status,
            @Param("buyerType") String buyerType,
            Pageable pageable
    );

    /**
     * [EN] Real-time count of active buyers for statistics
     * [BN] সক্রিয় বায়ারদের মোট সংখ্যা গণনা
     */
    long countByTenantIdAndStatusAndDeletedAtIsNull(UUID tenantId, String status);
}

