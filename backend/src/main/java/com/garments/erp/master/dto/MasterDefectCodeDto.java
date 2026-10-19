package com.garments.erp.master.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Data Transfer Object for Quality Defect Codes
 * [BN] কোয়ালিটি ডিফেক্ট কোড ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Transports defect code, defect name, and process category to tablet-based
 *      QC stations for live inline/endline defect tapping on the factory floor.
 * [BN] কারখানার ফ্লোরে ট্যাবলেট ডিভাইসে দ্রুত টাচ করে ত্রুটি লিপিবদ্ধ করতে
 *      ডিফেক্ট কোড, নাম ও প্রসেস ক্যাটাগরি আদান-প্রদান করে।
 */
@Getter
@Setter
public class MasterDefectCodeDto implements Serializable {

    /**
     * [EN] Unique defect identifier
     * [BN] ত্রুটির ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Standard defect symbol (e.g. DEF-SEW-01)
     * [BN] ডিফেক্ট কোড
     */
    private String defectCode;

    /**
     * [EN] Descriptive defect title (e.g. Broken Stitch)
     * [BN] ত্রুটির নাম
     */
    private String defectName;

    /**
     * [EN] Process category (FABRIC, SEWING, FINISHING)
     * [BN] প্রসেস ক্যাটাগরি
     */
    private String defectCategory;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterDefectCodeDto() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public MasterDefectCodeDto(UUID id, String defectCode, String defectName, String defectCategory) {
        this.id = id;
        this.defectCode = defectCode;
        this.defectName = defectName;
        this.defectCategory = defectCategory;
    }
}
