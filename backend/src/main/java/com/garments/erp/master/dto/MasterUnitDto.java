package com.garments.erp.master.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Data Transfer Object for Measurement Units
 * [BN] পরিমাপের একক ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Transports unit code, descriptive name, and material application category
 *      to the frontend BOM, fabric requisition, and inventory forms.
 * [BN] ফ্রন্টএন্ড BOM, ফেব্রিক রিকুইজিশন এবং ইনভেন্টরি ফর্মে ব্যবহারের জন্য
 *      পরিমাপের এককের প্রতীক, নাম ও ক্যাটাগরি আদান-প্রদান করে।
 */
@Getter
@Setter
public class MasterUnitDto implements Serializable {

    /**
     * [EN] Unique unit identifier
     * [BN] এককের ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Standard unit symbol (e.g. PCS, YDS, KG)
     * [BN] এককের প্রতীক কোড
     */
    private String unitCode;

    /**
     * [EN] Full descriptive unit title (e.g. Pieces, Yards)
     * [BN] এককের পূর্ণ সহজপাঠ্য নাম
     */
    private String unitName;

    /**
     * [EN] Functional application category (e.g. FABRIC, GARMENT, TRIMS)
     * [BN] ব্যবহারিক ক্যাটাগরি
     */
    private String unitCategory;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterUnitDto() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public MasterUnitDto(UUID id, String unitCode, String unitName, String unitCategory) {
        this.id = id;
        this.unitCode = unitCode;
        this.unitName = unitName;
        this.unitCategory = unitCategory;
    }
}
