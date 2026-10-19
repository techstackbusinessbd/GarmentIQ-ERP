package com.garments.erp.sequence.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Configurable Dynamic Code Generation Template Entity (Rule 24)
 * [BN] কনফিগারেবল ডাইনামিক কোড জেনারেশন টেমপ্লেট এন্টিটি (রুল ২৪)
 * =============================================================================
 * [EN] Stores tenant-specific pattern templates for auto-generating business
 *      identifiers across RMG modules. Admins can customize patterns using tokens
 *      such as {PREFIX}, {YYYY}, {YY}, {MM}, {DD}, {TENANT}, and {SEQ:N}.
 * [BN] আরএমজি মডিউলে ব্যবসায়িক কোড স্বয়ংক্রিয়ভাবে তৈরির জন্য টেন্যান্টভিত্তিক
 *      প্যাটার্ন টেমপ্লেট সংরক্ষণ করে। অ্যাডমিন প্যানেল থেকে {PREFIX}, {YYYY},
 *      {YY}, {MM}, {DD}, {TENANT}, ও {SEQ:N} টোকেন দিয়ে প্যাটার্ন সাজানো যায়।
 */
@Getter
@Setter
@Entity
@Table(name = "code_sequence_templates", uniqueConstraints = {
        @UniqueConstraint(name = "uq_tenant_entity_template", columnNames = {"tenant_id", "entity_type"})
})
public class CodeSequenceTemplate implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Scoped tenant organization identifier
     * [BN] সংশ্লিষ্ট টেন্যান্ট বা কারখানা প্রতিষ্ঠানের ইউনিক আইডি
     */
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    /**
     * [EN] Target business entity type (e.g. BUYER, STYLE, PO, CUTTING_ORDER)
     * [BN] যে ব্যবসায়িক এনটিটির জন্য প্যাটার্ন প্রযোজ্য (যেমন: STYLE, PO)
     */
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    /**
     * [EN] Configurable code formatting pattern (e.g. STY-{YYYY}-{SEQ:5})
     * [BN] কনফিগারেবল কোড ফরম্যাট প্যাটার্ন (যেমন: STY-{YYYY}-{SEQ:5})
     */
    @Column(name = "pattern", nullable = false, length = 100)
    private String pattern;

    /**
     * [EN] Configurable module prefix (e.g. STY, BYR, PO, CUT)
     * [BN] কনফিগারেবল মডিউল প্রিফিক্স বা উপসর্গ
     */
    @Column(name = "prefix", nullable = false, length = 20)
    private String prefix;

    /**
     * [EN] Zero-padding width for the numeric counter (e.g. 4 for 0001, 5 for 00001)
     * [BN] ক্রমিক সংখ্যার শূন্য-প্যাডিংয়ের দৈর্ঘ্য (যেমন: ৪ দিলে ০০০১)
     */
    @Column(name = "padding_length", nullable = false)
    private int paddingLength;

    /**
     * [EN] Counter reset cycle policy (NEVER, YEARLY, MONTHLY, DAILY)
     * [BN] কাউন্টার রিসেট হওয়ার সময়সীমা নীতি
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "reset_frequency", nullable = false, length = 20)
    private ResetFrequency resetFrequency;

    /**
     * [EN] Operational status flag (true = active template, false = inactive)
     * [BN] টেমপ্লেটের সক্রিয় অবস্থা নির্দেশক বুলিয়ান ফ্ল্যাগ
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    /**
     * [EN] UTC timestamp marking creation moment
     * [BN] টেমপ্লেটটি তৈরি হওয়ার UTC টাইমস্ট্যাম্প
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] UTC timestamp marking last modification
     * [BN] টেমপ্লেটটি সর্বশেষ পরিমার্জনের UTC টাইমস্ট্যাম্প
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Optimistic concurrency control version number
     * [BN] অপটিমিস্টিক কনকারেন্সি কন্ট্রোল ভার্সন নম্বর
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    /**
     * [EN] Default constructor initializing default values
     * [BN] ডিফল্ট কনস্ট্রাক্টর—প্রাথমিক মান সেট করে
     */
    public CodeSequenceTemplate() {
        this.paddingLength = 5;
        this.resetFrequency = ResetFrequency.YEARLY;
        this.isActive = true;
        this.version = 0L;
    }

    /**
     * [EN] Parameterized constructor for template provisioning
     * [BN] নতুন কোড টেমপ্লেট তৈরির জন্য প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param tenantId       [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType     [EN] Entity type / [BN] এনটিটির ধরন
     * @param pattern        [EN] Pattern string / [BN] প্যাটার্ন
     * @param prefix         [EN] Prefix string / [BN] প্রিফিক্স
     * @param paddingLength  [EN] Padding length / [BN] প্যাডিং দৈর্ঘ্য
     * @param resetFrequency [EN] Reset cycle / [BN] রিসেট সাইকেল
     */
    public CodeSequenceTemplate(UUID tenantId, String entityType, String pattern,
                                String prefix, int paddingLength, ResetFrequency resetFrequency) {
        this();
        this.tenantId = tenantId;
        this.entityType = entityType;
        this.pattern = pattern;
        this.prefix = prefix;
        this.paddingLength = paddingLength;
        this.resetFrequency = resetFrequency;
    }

    /**
     * [EN] JPA pre-persist lifecycle hook: Generates UUIDv7 and initializes audit timestamps
     * [BN] ডেটাবেজে সংরক্ষণের পূর্বে UUIDv7 আইডি ও অডিট টাইমস্ট্যাম্প সেট করার লাইফসাইকেল হুক
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidV7Generator.generate();
        }
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    /**
     * [EN] JPA pre-update lifecycle hook: Refreshes updatedAt timestamp
     * [BN] প্রতিবার ডেটাবেজে আপডেটের পূর্বে updatedAt টাইমস্ট্যাম্প রিফ্রেশ করার লাইফসাইকেল হুক
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
