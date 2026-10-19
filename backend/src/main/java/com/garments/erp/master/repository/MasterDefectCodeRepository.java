package com.garments.erp.master.repository;

import com.garments.erp.master.entity.MasterDefectCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Master Quality Defect Code Data Access Repository
 * [BN] মাস্টার কোয়ালিটি ডিফেক্ট কোড ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Manages retrieval of standardized defect codes categorized by inspection
 *      stage (FABRIC 4-point, SEWING inline, FINISHING final AQL audit).
 * [BN] কোয়ালিটি ইন্সপেকশন স্টেজ (ফেব্রিক, সুইং, ফিনিশিং) অনুযায়ী স্ট্যান্ডার্ড
 *      ত্রুটির কোড অনুসন্ধানের ডেটাবেজ অপারেশন পরিচালনা করে।
 */
@Repository
public interface MasterDefectCodeRepository extends JpaRepository<MasterDefectCode, UUID> {

    /**
     * [EN] Retrieves all defect codes alphabetically sorted by code
     * [BN] কোড অনুযায়ী বর্ণানুক্রমে সকল ডিফেক্ট কোড ফেরত দেয়
     *
     * @return [EN] Sorted defect codes list / [BN] ডিফেক্ট কোডের তালিকা
     */
    List<MasterDefectCode> findAllByOrderByDefectCodeAsc();

    /**
     * [EN] Retrieves defect codes filtered by inspection category (FABRIC, SEWING, FINISHING)
     * [BN] নির্দিষ্ট ইন্সপেকশন ক্যাটাগরি অনুযায়ী ডিফেক্ট কোড তালিকা ফেরত দেয়
     *
     * @param defectCategory [EN] Category string / [BN] ক্যাটাগরি
     * @return [EN] Filtered defect list / [BN] ফিল্টারকৃত ডিফেক্ট তালিকা
     */
    List<MasterDefectCode> findAllByDefectCategoryOrderByDefectCodeAsc(String defectCategory);

    /**
     * [EN] Finds defect by unique code (e.g. DEF-SEW-01)
     * [BN] ইউনিক কোড দিয়ে ডিফেক্ট অনুসন্ধান করে
     *
     * @param defectCode [EN] Defect code / [BN] ডিফেক্ট কোড
     * @return [EN] Optional matching defect / [BN] প্রাপ্ত ডিফেক্ট অবজেক্ট
     */
    Optional<MasterDefectCode> findByDefectCode(String defectCode);
}
