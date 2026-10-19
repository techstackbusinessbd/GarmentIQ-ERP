package com.garments.erp.master.repository;

import com.garments.erp.master.entity.MasterSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Master Garment Size Grid Data Access Repository
 * [BN] মাস্টার পোশাকের সাইজ গ্রিড ডেটা এক্সেস রিপোজিটরি
 * =============================================================================
 * [EN] Manages retrieval of standardized garment sizes ordered by display weight
 *      (e.g. XS -> S -> M -> L -> XL -> XXL) for cutting order and packing grids.
 * [BN] কাটিং অর্ডার ও প্যাকিং তালিকায় বাম থেকে ডানে সঠিক ক্রমানুসারে সাইজ সাজাতে
 *      ডিসপ্লে অর্ডার ভিত্তিক সাইজ অনুসন্ধানের কুয়েরি পরিচালনা করে।
 */
@Repository
public interface MasterSizeRepository extends JpaRepository<MasterSize, UUID> {

    /**
     * [EN] Retrieves all garment sizes strictly ordered by integer display weight
     * [BN] ডিসপ্লে অর্ডারের ক্রমিক মান অনুযায়ী সকল সাইজ ফেরত দেয়
     *
     * @return [EN] Ordered size list / [BN] ক্রমানুসারে সাজানো সাইজের তালিকা
     */
    List<MasterSize> findAllByOrderByDisplayOrderAsc();

    /**
     * [EN] Finds size record by unique label code (e.g. XL)
     * [BN] সাইজ কোড দ্বারা নির্দিষ্ট সাইজ রেকর্ড অনুসন্ধান করে
     *
     * @param sizeCode [EN] Size code string / [BN] সাইজ কোড
     * @return [EN] Optional matching size / [BN] প্রাপ্ত সাইজ অবজেক্ট
     */
    Optional<MasterSize> findBySizeCode(String sizeCode);
}
