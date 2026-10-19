package com.garments.erp.sequence.dto;

import com.garments.erp.sequence.entity.ResetFrequency;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Data Transfer Object for Code Sequence Template (Admin Panel UI)
 * [BN] কোড সিকোয়েন্স টেমপ্লেট ডেটা ট্রান্সফার অবজেক্ট (অ্যাডমিন প্যানেল ইউআই)
 * =============================================================================
 * [EN] Transports configurable pattern metadata, preview representations, and
 *      prefix/padding rules between backend services and the frontend admin grid.
 * [BN] ব্যাকএন্ড সার্ভিস এবং ফ্রন্টএন্ড অ্যাডমিন গ্রিডের মধ্যে কোড প্যাটার্ন মেটাডেটা,
 *      লাইভ প্রিভিউ এবং প্রিফিক্স/প্যাডিং কনফিগারেশন আদান-প্রদান করে।
 */
@Getter
@Setter
public class CodeSequenceTemplateDto implements Serializable {

    /**
     * [EN] Unique template identifier
     * [BN] টেমপ্লেটের ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Target business entity type code (e.g. BUYER, STYLE, PO)
     * [BN] লক্ষ্য ব্যবসায়িক এনটিটির কোড
     */
    private String entityType;

    /**
     * [EN] Configurable pattern string (e.g. STY-{YYYY}-{SEQ:5})
     * [BN] কনফিগারেবল প্যাটার্ন স্ট্রিং
     */
    private String pattern;

    /**
     * [EN] Module prefix characters
     * [BN] মডিউল প্রিফিক্স বা উপসর্গ
     */
    private String prefix;

    /**
     * [EN] Numeric counter padding width (digits)
     * [BN] সংখ্যা কাউন্টারের প্যাডিং দৈর্ঘ্য
     */
    private int paddingLength;

    /**
     * [EN] Reset cycle frequency policy
     * [BN] রিসেট সাইকেল ফ্রিকোয়েন্সি পলিসি
     */
    private ResetFrequency resetFrequency;

    /**
     * [EN] Operational active flag
     * [BN] সক্রিয় অবস্থা নির্দেশক ফ্ল্যাগ
     */
    private boolean isActive;

    /**
     * [EN] Real-time sample rendered code preview for admin UI inspection
     * [BN] অ্যাডমিন ইউআইতে প্রদর্শনের জন্য রিয়েল-টাইম নমুনা কোড প্রিভিউ
     */
    private String samplePreview;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public CodeSequenceTemplateDto() {
    }

    /**
     * [EN] All-args constructor
     * [BN] সকল প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public CodeSequenceTemplateDto(UUID id, String entityType, String pattern, String prefix,
                                  int paddingLength, ResetFrequency resetFrequency,
                                  boolean isActive, String samplePreview) {
        this.id = id;
        this.entityType = entityType;
        this.pattern = pattern;
        this.prefix = prefix;
        this.paddingLength = paddingLength;
        this.resetFrequency = resetFrequency;
        this.isActive = isActive;
        this.samplePreview = samplePreview;
    }
}
