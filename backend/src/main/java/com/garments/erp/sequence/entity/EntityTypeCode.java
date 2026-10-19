package com.garments.erp.sequence.entity;

/**
 * =============================================================================
 * [EN] Enumeration of Business Entities Requiring Auto-Generated Identifiers
 * [BN] সিস্টেম স্বয়ংক্রিয় কোড জেনারেশন আবশ্যক এমন ব্যবসায়িক এনটিটিসমূহের এনাম
 * =============================================================================
 * [EN] Represents all domain entities across merchandising, cutting, sewing,
 *      washing, finishing, and commercial shipping that use configurable codes.
 * [BN] মার্চেন্ডাইজিং, কাটিং, সুইং, ওয়াশিং, ফিনিশিং ও কমার্শিয়াল শিপমেন্ট ডোমেনের
 *      সকল ব্যবসায়িক এনটিটি নির্দেশ করে যাদের কোড স্বয়ংক্রিয়ভাবে জেনারেট হয়।
 */
public enum EntityTypeCode {

    /**
     * [EN] Buyer profile business code (e.g. BYR-0001)
     * [BN] বায়ার প্রোফাইল ব্যবসায়িক কোড
     */
    BUYER("BUYER", "Buyer Organization Code"),

    /**
     * [EN] Garment style development code (e.g. STY-2026-00042)
     * [BN] তৈরি পোশাকের স্টাইল ডেভেলপমেন্ট কোড
     */
    STYLE("STYLE", "Style Master Code"),

    /**
     * [EN] Purchase order business code (e.g. PO-202610-0018)
     * [BN] বায়ার পারচেজ অর্ডার (PO) কোড
     */
    PO("PO", "Purchase Order Code"),

    /**
     * [EN] Raw material fabric roll barcode identifier (e.g. ROL-26-004512)
     * [BN] টেক্সটাইল কাঁচামাল ফেব্রিক রোল বারকোড ট্র্যাকার
     */
    FABRIC_ROLL("FABRIC_ROLL", "Fabric Roll Barcode"),

    /**
     * [EN] Cutting table marker plan identifier (e.g. MKR-2026-0105)
     * [BN] কাটিং ফ্লোরের মার্কার প্ল্যান ট্র্যাকিং কোড
     */
    MARKER_PLAN("MARKER_PLAN", "Marker Plan Code"),

    /**
     * [EN] Production cutting room order number (e.g. CUT-202610-0007)
     * [BN] প্রোডাকশন কাটিং রুম জব অর্ডার কোড
     */
    CUTTING_ORDER("CUTTING_ORDER", "Cutting Order Code"),

    /**
     * [EN] Sewing shop floor bundle RFID/QR identifier (e.g. BDL-2026-0009841)
     * [BN] সুইং ফ্লোর বান্ডিল ট্র্যাকিং আরএফআইডি বা কিউআর কোড
     */
    BUNDLE("BUNDLE", "Sewing Bundle RFID/QR Code"),

    /**
     * [EN] Industrial laundry and denim washing dispatch challan (e.g. WSH-2026-0089)
     * [BN] ওয়াশিং ও ডায়িং প্ল্যান্ট ডিসপ্যাচ চালান কোড
     */
    WASH_CHALLAN("WASH_CHALLAN", "Washing Plant Challan Code"),

    /**
     * [EN] Final export finishing carton barcode (e.g. CTN-2026-003412)
     * [BN] চূড়ান্ত এক্সপোর্ট ফিনিশিং কার্টনিং বারকোড
     */
    FINISHING_CARTON("FINISHING_CARTON", "Finishing Carton Barcode"),

    /**
     * [EN] Commercial export invoice code (e.g. EXP-INV-2026-0015)
     * [BN] কমার্শিয়াল এক্সপোর্ট ইনভয়েস কোড
     */
    COMMERCIAL_INVOICE("COMMERCIAL_INVOICE", "Commercial Export Invoice Code"),

    /**
     * [EN] Supplier and accessories vendor profile code (e.g. SUP-0001)
     * [BN] সাপ্লায়ার ও এক্সেসরিজ ভেন্ডর প্রাতিষ্ঠানিক কোড
     */
    SUPPLIER("SUPPLIER", "Vendor Supplier Code");

    private final String code;
    private final String description;

    EntityTypeCode(String code, String description) {
        this.code = code;
        this.description = description;
    }

    /**
     * [EN] Retrieves standard string representation of the entity type
     * [BN] এনটিটি টাইপের আদর্শ স্ট্রিং মান ফেরত দেয়
     *
     * @return [EN] Code string / [BN] কোড স্ট্রিং
     */
    public String getCode() {
        return code;
    }

    /**
     * [EN] Retrieves human-readable English description of the entity type
     * [BN] এনটিটি টাইপের মানবিক বিবরণ ফেরত দেয়
     *
     * @return [EN] Description string / [BN] বিবরণ
     */
    public String getDescription() {
        return description;
    }
}
