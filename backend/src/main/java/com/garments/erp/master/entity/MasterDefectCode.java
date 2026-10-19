package com.garments.erp.master.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Master Quality Defect Code Entity (ASTM 4-Point & RMG Floor)
 * [BN] গ্লোবাল মাস্টার কোয়ালিটি ডিফেক্ট কোড এন্টিটি (ASTM ৪-পয়েন্ট ও সুইং মানদণ্ড)
 * =============================================================================
 * [EN] Defines standardized defect codes across fabric four-point inspection,
 *      sewing inline/endline quality control, and export garment finishing audits.
 * [BN] ফেব্রিক ৪-পয়েন্ট ইন্সপেকশন, সুইং ইনলাইন/এন্ডলাইন কিউসি এবং ফিনিশিং
 *      অডিটে ত্রুটি শনাক্তকরণের জন্য স্ট্যান্ডার্ড ডিফেক্ট কোড নির্দেশ করে।
 */
@Getter
@Setter
@Entity
@Table(name = "master_defect_codes")
public class MasterDefectCode implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Unique quality defect code (e.g. DEF-FAB-01, DEF-SEW-02)
     * [BN] ইউনিক কোয়ালিটি ডিফেক্ট কোড
     */
    @Column(name = "defect_code", nullable = false, unique = true, length = 20)
    private String defectCode;

    /**
     * [EN] Descriptive defect title (e.g. Broken Stitch, Skipped Stitch, Hole / Slub)
     * [BN] ডিফেক্ট বা ত্রুটির সহজপাঠ্য নাম
     */
    @Column(name = "defect_name", nullable = false, length = 100)
    private String defectName;

    /**
     * [EN] Factory QC process category (e.g. FABRIC, SEWING, FINISHING)
     * [BN] ত্রুটির প্রসেস ক্যাটাগরি (যেমন: FABRIC, SEWING, FINISHING)
     */
    @Column(name = "defect_category", nullable = false, length = 50)
    private String defectCategory;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterDefectCode() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public MasterDefectCode(String defectCode, String defectName, String defectCategory) {
        this.defectCode = defectCode;
        this.defectName = defectName;
        this.defectCategory = defectCategory;
    }

    /**
     * [EN] JPA pre-persist hook generating UUIDv7
     * [BN] ডেটাবেজে সংরক্ষণের পূর্বে UUIDv7 তৈরি করার হুক
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidV7Generator.generate();
        }
    }
}
