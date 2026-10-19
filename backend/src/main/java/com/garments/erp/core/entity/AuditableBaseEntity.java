package com.garments.erp.core.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * [EN] Base Auditable JPA Entity providing RFC 9562 UUIDv7 Primary Key, Tenant Isolation, Audit Trails, and Optimistic Locking.
 * Every domain entity across Merchandising, Cutting, Sewing, Wash, Embellishment must extend this base class.
 *
 * [BN] বেস অডিটেবল জেপিএ এন্টিটি যা প্রতিটি ডোমেন টেবিলে RFC 9562 UUIDv7 প্রাইমারি কি, মাল্টি-টেন্যান্ট আইসোলেশন,
 * অডিট ট্রেইল এবং অপটিমিস্টিক লকিং (@Version) নিশ্চিত করে।
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableBaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * [EN] Time-Ordered Unique Identifier (RFC 9562 UUIDv7) ensuring high-performance B-Tree insertions and distributed uniqueness (ADR-007).
     * [BN] প্রতিটি রেকর্ডের জন্য টাইম-অর্ডারড অনন্য গ্লোবাল আইডেন্টিফায়ার (UUIDv7) যা পোস্টগ্রেসকিউএল বি-ট্রি পারফরম্যান্স সর্বোচ্চ রাখে।
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Tenant ID for Multi-Tenant SaaS isolation (ADR-003).
     * [BN] মাল্টি-টেন্যান্ট SaaS আইসোলেশনের জন্য নির্দিষ্ট কোম্পানি/টেন্যান্ট আইডি।
     */
    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    /**
     * [EN] Factory Unit ID for large group conglomerates (e.g. Wash Unit, Sewing Unit).
     * [BN] বৃহৎ গ্রুপের আওতাধীন নির্দিষ্ট ফ্যাক্টরি ইউনিট আইডি (যেমন: ওয়াশিং ইউনিট, সুইং ইউনিট)।
     */
    @Column(name = "factory_unit_id", length = 64)
    private String factoryUnitId;

    /**
     * [EN] Record creation timestamp.
     * [BN] রেকর্ড তৈরির সঠিক সময়কাল (UTC)।
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    /**
     * [EN] Record last modification timestamp.
     * [BN] রেকর্ড সর্বশেষ পরিবর্তনের সময়কাল (UTC)।
     */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    /**
     * [EN] User username or ID who created the record.
     * [BN] যে ইউজার এই রেকর্ডটি তৈরি করেছেন তাঁর ইউজারনেম বা আইডি।
     */
    @CreatedBy
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    /**
     * [EN] User username or ID who last modified the record.
     * [BN] যে ইউজার এই রেকর্ডটি সর্বশেষ পরিবর্তন করেছেন।
     */
    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * [EN] Optimistic locking version preventing concurrent overwrite anomalies.
     * [BN] অপটিমিস্টিক লকিং ভার্সন যা একসাথে একাধিক ইউজারের কনকারেন্ট ওভাররাইট রোধ করে।
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    /**
     * [EN] Soft deletion flag preserving historical compliance and audit trails.
     * [BN] সফট ডিলিট ফ্ল্যাগ যা হিস্টোরিক্যাল ডেটা মুছে না ফেলে অডিট ট্রেইল সুরক্ষিত রাখে।
     */
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    /**
     * [EN] Lifecycle callback automatically generating time-ordered UUIDv7 and initializing timestamps before insert.
     * [BN] ইনসার্টের পূর্বে স্বয়ংক্রিয়ভাবে টাইম-অর্ডারড UUIDv7 তৈরি ও টাইমস্ট্যাম্প ইনিশিয়ালাইজ করে।
     */
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

    /**
     * [EN] Lifecycle callback updating timestamp before entity update.
     * [BN] রেকর্ড পরিবর্তনের পূর্বে সর্বশেষ আপডেটের সময় স্বয়ংক্রিয়ভাবে হালনাগাদ করে।
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
