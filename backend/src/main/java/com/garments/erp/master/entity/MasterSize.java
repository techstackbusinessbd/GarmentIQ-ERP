package com.garments.erp.master.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Master Garment Size Grid Entity
 * [BN] গ্লোবাল মাস্টার পোশাকের সাইজ গ্রিড এন্টিটি
 * =============================================================================
 * [EN] Represents global standard garment size definitions (XS, S, M, L, XL, XXL)
 *      with strict integer display ordering for matrix presentation on cutting tables.
 * [BN] তৈরি পোশাকের আন্তর্জাতিক সাইজ নির্দেশ করে যা কাটিং টেবিল ও প্যাকিং তালিকায়
 *      সঠিক ক্রমিক অনুযায়ী প্রদর্শনের জন্য display_order সংরক্ষণ করে।
 */
@Getter
@Setter
@Entity
@Table(name = "master_sizes")
public class MasterSize implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Alphanumeric garment size label (e.g. XS, S, M, L, XL, XXL, 3XL)
     * [BN] পোশাকের সাইজ কোড (যেমন: XS, S, M, L, XL)
     */
    @Column(name = "size_code", nullable = false, unique = true, length = 20)
    private String sizeCode;

    /**
     * [EN] Integer sorting weight ensuring correct tabular left-to-right presentation
     * [BN] বাম থেকে ডানে টেবিল গ্রিডে সাইজ সঠিকভাবে সাজানোর ক্রমিক মান
     */
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterSize() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public MasterSize(String sizeCode, int displayOrder) {
        this.sizeCode = sizeCode;
        this.displayOrder = displayOrder;
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
