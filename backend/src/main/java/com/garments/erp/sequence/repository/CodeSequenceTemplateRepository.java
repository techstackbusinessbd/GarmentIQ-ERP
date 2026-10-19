package com.garments.erp.sequence.repository;

import com.garments.erp.sequence.entity.CodeSequenceTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Configurable Code Sequence Template Repository (Rule 24)
 * [BN] কনফিগারেবল কোড সিকোয়েন্স টেমপ্লেট ডেটা এক্সেস রিপোজিটরি (রুল ২৪)
 * =============================================================================
 * [EN] Manages tenant-specific code pattern templates, allowing retrieval by
 *      entity type and enabling admin customization of code formats.
 * [BN] টেন্যান্টভিত্তিক কোড প্যাটার্ন টেমপ্লেট পরিচালনা করে, এনটিটির ধরন অনুযায়ী
 *      টেমপ্লেট অনুসন্ধান এবং অ্যাডমিন প্যানেল থেকে ফরম্যাট সম্পাদনার সুবিধা দেয়।
 */
@Repository
public interface CodeSequenceTemplateRepository extends JpaRepository<CodeSequenceTemplate, UUID> {

    /**
     * [EN] Finds active template for a given tenant and entity type
     * [BN] নির্দিষ্ট টেন্যান্ট ও এনটিটি টাইপের জন্য সক্রিয় টেমপ্লেট অনুসন্ধান করে
     *
     * @param tenantId   [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType [EN] Target entity type / [BN] এনটিটির ধরন
     * @return [EN] Optional active template / [BN] প্রাপ্ত সক্রিয় টেমপ্লেট
     */
    Optional<CodeSequenceTemplate> findByTenantIdAndEntityTypeAndIsActiveTrue(UUID tenantId, String entityType);

    /**
     * [EN] Finds template for a given tenant and entity type regardless of active status
     * [BN] নির্দিষ্ট টেন্যান্ট ও এনটিটি টাইপের টেমপ্লেট অনুসন্ধান করে
     *
     * @param tenantId   [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType [EN] Target entity type / [BN] এনটিটির ধরন
     * @return [EN] Optional template / [BN] প্রাপ্ত টেমপ্লেট
     */
    Optional<CodeSequenceTemplate> findByTenantIdAndEntityType(UUID tenantId, String entityType);

    /**
     * [EN] Retrieves all configured code sequence templates for a tenant (Admin Panel Grid)
     * [BN] একটি টেন্যান্টের সকল কনফিগারকৃত কোড টেমপ্লেট তালিকা ফেরত দেয় (অ্যাডমিন গ্রিড)
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @return [EN] List of templates / [BN] টেমপ্লেটের তালিকা
     */
    List<CodeSequenceTemplate> findAllByTenantIdOrderByEntityTypeAsc(UUID tenantId);

    /**
     * [EN] Checks whether a template already exists for a given tenant and entity type
     * [BN] নির্দিষ্ট টেন্যান্ট ও এনটিটি টাইপে কোনো টেমপ্লেট বিদ্যমান কি না তা যাচাই করে
     *
     * @param tenantId   [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType [EN] Target entity type / [BN] এনটিটির ধরন
     * @return [EN] true if exists, false otherwise / [BN] বিদ্যমান থাকলে true
     */
    boolean existsByTenantIdAndEntityType(UUID tenantId, String entityType);
}
