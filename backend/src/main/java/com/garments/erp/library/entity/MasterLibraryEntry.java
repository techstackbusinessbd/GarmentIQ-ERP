package com.garments.erp.library.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Domain-Driven Master Library Entry Entity (Rule 12 & ADR-015)
 * [BN] ডোমেন-ড্রিভেন মাস্টার লাইব্রেরি এন্ট্রি এন্টিটি (রুল ১২ ও ADR-015)
 * =============================================================================
 * [EN] Represents a configurable master reference entry across any ERP business domain
 *      (e.g., Merchandising Garment Items, Colors, Seasons, Samples, Wash Recipes).
 * [BN] পোশাক শিল্পের যে কোনো বিজনেস ডোমেনের মাস্টার রেফারেন্স রেকর্ড সংরক্ষণ করে
 *      (যেমন: মার্চেন্ডাইজিং গার্মেন্টস আইটেম, কালার, সিজন, স্যাম্পল ও ওয়াশ রেসিপি)।
 */
@Getter
@Setter
@Entity
@Table(name = "master_library_entries", uniqueConstraints = {
        @UniqueConstraint(name = "uq_master_entry", columnNames = {"tenant_id", "domain_code", "entity_type", "entry_code"})
})
public class MasterLibraryEntry implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Scoped tenant factory organization identifier
     * [BN] সংশ্লিষ্ট ক্লায়েন্ট কারখানা প্রতিষ্ঠানের ইউনিক আইডি
     */
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    /**
     * [EN] High-level ERP domain code (e.g. MERCHANDISING, FABRIC, CUTTING, SEWING, WASHING, QUALITY)
     * [BN] ইআরপি বিজনেস ডোমেন কোড
     */
    @Column(name = "domain_code", nullable = false, length = 30)
    private String domainCode;

    /**
     * [EN] Entity classification type (e.g. GARMENT_ITEM, COLOR, SEASON, SAMPLE_STAGE)
     * [BN] মাস্টার এনটিটি ক্লাসিফিকেশন টাইপ
     */
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    /**
     * [EN] Unique machine-readable code identifier within the entity type (e.g. JEANS_5PKT, INDIGO_DARK)
     * [BN] এনটিটির অভ্যন্তরীণ মেশিন-রিডেবল ইউনিক কোড
     */
    @Column(name = "entry_code", nullable = false, length = 50)
    private String entryCode;

    /**
     * [EN] Human-readable descriptive name (e.g. 5-Pocket Denim Jeans, Deep Indigo Blue)
     * [BN] মানুষের জন্য সহজপাঠ্য পূর্ণ নাম
     */
    @Column(name = "entry_name", nullable = false, length = 150)
    private String entryName;

    /**
     * [EN] Relative sorting order for UI dropdowns and grids
     * [BN] ইউআই গ্রিড ও ড্রপডাউনে প্রদর্শনের ক্রম
     */
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    /**
     * [EN] Optional technical specification description
     * [BN] ঐচ্ছিক বিবরণ ও স্পেসিফিকেশন
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * [EN] Flexible dynamic attributes JSON (e.g. pantone, hexCode, SMV, GSM, gender)
     * [BN] ডাইনামিক বৈশিষ্ট্য সম্বলিত JSONB ডেটা
     */
    @Column(name = "attributes", columnDefinition = "jsonb")
    private String attributes;

    /**
     * [EN] Soft-deletion and operational activation toggle
     * [BN] রেকর্ডটি সক্রিয় কি না তা নির্ধারণকারী ফ্ল্যাগ
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * [EN] Identifies system factory baseline seed records
     * [BN] সিস্টেম সিডেড কোর রেকর্ড নির্দেশক ফ্ল্যাগ
     */
    @Column(name = "is_system_seeded", nullable = false)
    private Boolean isSystemSeeded = false;

    /**
     * [EN] Creation timestamp
     * [BN] রেকর্ড তৈরির সময়
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] Last modification timestamp
     * [BN] সর্বশেষ আপডেটের সময়
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Username of the personnel authorizing this record
     * [BN] রেকর্ড এন্ট্রিকারী ব্যবহারকারীর নাম
     */
    @Column(name = "created_by", length = 50)
    private String createdBy;

    /**
     * [EN] Optimistic concurrency control version number
     * [BN] অপটিমিস্টিক লকিং ভার্সন
     */
    @Version
    @Column(name = "version")
    private Long version = 0L;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public MasterLibraryEntry() {
        this.id = UuidV7Generator.generate();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidV7Generator.generate();
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = Instant.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
