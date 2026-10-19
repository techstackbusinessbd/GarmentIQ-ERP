package com.garments.erp.core.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Auditable Base Entity with Optimistic Concurrency Control
 * [BN] মাল্টি-টেন্যান্ট অডিটেবল বেস এন্টিটি ও অপটিমিস্টিক কনকারেন্সি কন্ট্রোল
 * =============================================================================
 * [EN] Serves as the base mapped superclass for all domain entities across the ERP.
 *      Provides RFC 9562 UUIDv7 primary keys, multi-tenant organization isolation,
 *      factory unit scoping, audit trail timestamps, soft deletion, and JPA @Version
 *      optimistic locking to eliminate lost-update anomalies in fast-paced production.
 * [BN] ইআরপি-র সকল ডোমেন এন্টিটির জন্য বেস সুপারক্লাস হিসেবে কাজ করে। এটি RFC 9562
 *      টাইম-অর্ডারড UUIDv7 প্রাইমারি কি, মাল্টি-টেন্যান্ট অর্গানাইজেশন আইসোলেশন,
 *      ফ্যাক্টরি ইউনিট স্কোপিং, অডিট ট্রেইল টাইমস্ট্যাম্প, সফট ডিলিট এবং একই সাথে
 *      একাধিক ব্যবহারকারীর কনকারেন্ট এডিটিং রোধে JPA @Version অপটিমিস্টিক লকিং প্রদান করে।
 */
@Getter
@Setter
@MappedSuperclass
public abstract class AuditableBaseEntity implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7 (Time-ordered 64-bit millisecond prefix)
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি (টাইম-অর্ডারড ইনডেক্সিং বান্ধব)
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Multi-tenant organization identifier ensuring complete data isolation
     * [BN] মাল্টি-টেন্যান্ট অর্গানাইজেশন আইডি, যা এক কারখানার ডেটা অন্য কারখানা থেকে আলাদা রাখে
     */
    @Column(name = "tenant_id", nullable = false, updatable = false)
    private UUID tenantId;

    /**
     * [EN] Specific factory unit or production compound under the tenant group
     * [BN] সংশ্লিষ্ট গ্রুপের অধীনে নির্দিষ্ট কারখানা ইউনিট বা উৎপাদন শেডের আইডি
     */
    @Column(name = "factory_unit_id")
    private UUID factoryUnitId;

    /**
     * [EN] UTC timestamp recording the exact instant when this record was persisted
     * [BN] রেকর্ডটি ডেটাবেজে প্রথম সংরক্ষিত হওয়ার সুনির্দিষ্ট UTC টাইমস্ট্যাম্প
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] UTC timestamp capturing the latest modification instant of this record
     * [BN] রেকর্ডটি সর্বশেষ পরিমার্জিত হওয়ার সুনির্দিষ্ট UTC টাইমস্ট্যাম্প
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Username, employee code, or system process that created the entity
     * [BN] যে ইউজার, কর্মকর্তা বা সিস্টেম প্রসেস রেকর্ডটি তৈরি করেছে তার নাম/কোড
     */
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    /**
     * [EN] Username, employee code, or system process that performed the last update
     * [BN] সর্বশেষ যে কর্মকর্তা বা সিস্টেম প্রসেস রেকর্ডটি আপডেট করেছে তার নাম/কোড
     */
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * [EN] Soft deletion indicator (false = active, true = soft-deleted in trash bin)
     * [BN] সফট ডিলিট নির্দেশক ফ্ল্যাগ (false = সক্রিয়, true = ট্র্যাশ বিনে স্থানান্তরিত)
     */
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    /**
     * [EN] Concurrency control version number automatically incremented by JPA on every update
     * [BN] কনকারেন্সি কন্ট্রোল ভার্সন নম্বর, যা প্রতি আপডেটে স্বয়ংক্রিয়ভাবে বৃদ্ধি পেয়ে ওভাররাইট রোধ করে
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    /**
     * [EN] JPA pre-persist lifecycle hook: Auto-populates UUIDv7, timestamps, and default actor
     * [BN] ডেটাবেজে ইনসার্ট হওয়ার পূর্ববর্তী লাইফসাইকেল হুক: UUIDv7 ও অডিট মেটাডেটা সেট করে
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidV7Generator.generate();
        }
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.createdBy == null) {
            this.createdBy = "SYSTEM";
        }
        if (this.updatedBy == null) {
            this.updatedBy = "SYSTEM";
        }
    }

    /**
     * [EN] JPA pre-update lifecycle hook: Auto-refreshes updatedAt to current UTC instant
     * [BN] ডেটাবেজে প্রতিবার আপডেট হওয়ার পূর্ববর্তী লাইফসাইকেল হুক: updatedAt টাইমস্ট্যাম্প রিফ্রেশ করে
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}

