package com.garments.erp.master.repository;

import com.garments.erp.master.entity.MasterUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Master Measurement Unit Data Access Repository
 * [BN] মাস্টার পরিমাপের একক ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Manages retrieval of standardized garment, fabric, yarn, and trims measurement
 *      units for BOM consumption calculations and inventory roll management.
 * [BN] তৈরি পোশাক, ফেব্রিক, সুতা ও ট্রিমসের পরিমাপের একক অনুসন্ধান ও BOM কনজাম্পশন
 *      হিসাবের ডেটাবেজ অপারেশন পরিচালনা করে।
 */
@Repository
public interface MasterUnitRepository extends JpaRepository<MasterUnit, UUID> {

    /**
     * [EN] Retrieves all measurement units alphabetically sorted by code
     * [BN] কোড অনুযায়ী বর্ণানুক্রমে সকল পরিমাপের একক ফেরত দেয়
     *
     * @return [EN] Sorted list of units / [BN] এককের তালিকা
     */
    List<MasterUnit> findAllByOrderByUnitCodeAsc();

    /**
     * [EN] Retrieves measurement units belonging to a specific functional category
     * [BN] নির্দিষ্ট ক্যাটাগরির (যেমন: FABRIC, GARMENT) সকল পরিমাপের একক ফেরত দেয়
     *
     * @param unitCategory [EN] Category string / [BN] ক্যাটাগরি
     * @return [EN] Category units list / [BN] ক্যাটাগরি অনুযায়ী এককের তালিকা
     */
    List<MasterUnit> findAllByUnitCategoryOrderByUnitCodeAsc(String unitCategory);

    /**
     * [EN] Finds measurement unit by its standard symbol code (e.g. PCS, YDS)
     * [BN] স্ট্যান্ডার্ড প্রতীক কোড দিয়ে একক অনুসন্ধান করে
     *
     * @param unitCode [EN] Unit symbol / [BN] প্রতীক কোড
     * @return [EN] Optional matching unit / [BN] প্রাপ্ত একক
     */
    Optional<MasterUnit> findByUnitCode(String unitCode);
}
