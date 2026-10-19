package com.garments.erp.master.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Data Transfer Object for Garment Size Grid
 * [BN] তৈরি পোশাকের সাইজ গ্রিড ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Transports size codes and integer display weights for rendering size-breakdown
 *      matrices across buyer purchase orders, cutting tables, and packing lists.
 * [BN] বায়ার অর্ডার, কাটিং টেবিল ও প্যাকিং তালিকায় সাইজ-রেশিও ম্যাট্রিক্স
 *      প্রদর্শনের জন্য সাইজ কোড ও ডিসপ্লে অর্ডার আদান-প্রদান করে।
 */
@Getter
@Setter
public class MasterSizeDto implements Serializable {

    /**
     * [EN] Unique size identifier
     * [BN] সাইজের ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Standard size label (e.g. XS, S, M, L, XL)
     * [BN] সাইজ কোড
     */
    private String sizeCode;

    /**
     * [EN] Display weight for table left-to-right matrix sorting
     * [BN] টেবিল গ্রিডে বাম থেকে ডানে সাজানোর ক্রমিক মান
     */
    private int displayOrder;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterSizeDto() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public MasterSizeDto(UUID id, String sizeCode, int displayOrder) {
        this.id = id;
        this.sizeCode = sizeCode;
        this.displayOrder = displayOrder;
    }
}
