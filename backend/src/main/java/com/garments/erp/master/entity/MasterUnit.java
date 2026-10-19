package com.garments.erp.master.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Master Measurement Unit Entity
 * [BN] গ্লোবাল মাস্টার পরিমাপের একক এন্টিটি
 * =============================================================================
 * [EN] Represents global standard units of measurement used across RMG manufacturing
 *      (e.g. PCS, DZN for garments; YDS, MTR, KG for fabrics; CONE, GRS for trims).
 * [BN] পোশাক তৈরিতে ব্যবহৃত আন্তর্জাতিক পরিমাপের একক নির্দেশ করে (যেমন: পোশাকের
 *      জন্য PCS, DZN; ফেব্রিকের জন্য YDS, MTR, KG; ট্রিমসের জন্য CONE, GRS)।
 */
@Getter
@Setter
@Entity
@Table(name = "master_units")
public class MasterUnit implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Standard unit symbol code (e.g. PCS, YDS, KG, CONE)
     * [BN] স্ট্যান্ডার্ড পরিমাপের একক প্রতীক কোড
     */
    @Column(name = "unit_code", nullable = false, unique = true, length = 20)
    private String unitCode;

    /**
     * [EN] Full descriptive unit title (e.g. Pieces, Yards, Kilograms)
     * [BN] এককের পূর্ণ সহজপাঠ্য নাম
     */
    @Column(name = "unit_name", nullable = false, length = 100)
    private String unitName;

    /**
     * [EN] Functional application category (e.g. GARMENT, FABRIC, YARN, TRIMS)
     * [BN] এককের ব্যবহারিক ক্যাটাগরি (যেমন: GARMENT, FABRIC, YARN, TRIMS)
     */
    @Column(name = "unit_category", nullable = false, length = 50)
    private String unitCategory;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterUnit() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public MasterUnit(String unitCode, String unitName, String unitCategory) {
        this.unitCode = unitCode;
        this.unitName = unitName;
        this.unitCategory = unitCategory;
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
