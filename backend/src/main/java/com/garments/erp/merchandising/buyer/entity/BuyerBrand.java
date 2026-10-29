package com.garments.erp.merchandising.buyer.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Buyer Sub-Brand Portfolio Entity (BuyerBrand.java) - Domain 01 Merchandising
 * [BN] বায়ার সাব-ব্র্যান্ড পোর্টফোলিও এনটিটি (BuyerBrand.java) - ডোমেন ০১ মার্চেন্ডাইজিং
 * =============================================================================
 * [EN] Represents a specialized child brand under an umbrella global buyer.
 *      Tracks market destination, seasonal patterns, and dedicated brand contacts.
 * [BN] একটি প্যারেন্ট বায়ারের অধীনস্থ বিশেষায়িত সাব-ব্র্যান্ডকে নির্দেশ করে (যেমন: H&M-এর COS)।
 *      এতে ব্র্যান্ডের টার্গেট মার্কেট, সিজনাল প্যাটার্ন ও যোগাযোগ তথ্য সংরক্ষিত থাকে।
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "buyer_brands", uniqueConstraints = {
        @UniqueConstraint(name = "uk_brands_tenant_buyer_code", columnNames = {"tenant_id", "buyer_id", "brand_code"}),
        @UniqueConstraint(name = "uk_brands_tenant_buyer_name", columnNames = {"tenant_id", "buyer_id", "brand_name"})
})
public class BuyerBrand implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Tenant organization boundary identifier
     * [BN] টেন্যান্ট ক্লায়েন্ট প্রতিষ্ঠানের ইউনিক আইসোলেশন আইডি
     */
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    /**
     * [EN] Parent buyer entity association
     * [BN] প্যারেন্ট বায়ার এনটিটির সাথে সম্পর্ক
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    /**
     * [EN] Unique brand sequence code (e.g., BRD-0001)
     * [BN] অটো-সিকোয়েন্সিং দ্বারা প্রস্তুতকৃত অনন্য ব্র্যান্ড কোড (যেমন: BRD-0001)
     */
    @Column(name = "brand_code", nullable = false, length = 50)
    private String brandCode;

    /**
     * [EN] Sub-brand title (e.g. COS, Monki, Zara Man)
     * [BN] সাব-ব্র্যান্ডের নাম (যেমন: COS, Bershka)
     */
    @Column(name = "brand_name", nullable = false, length = 150)
    private String brandName;

    /**
     * [EN] Primary retail demographic / geographical market
     * [BN] ব্র্যান্ডের মূল বিক্রয় বাজার (যেমন: EU, North America, Global)
     */
    @Column(name = "target_market", length = 100)
    private String targetMarket;

    /**
     * [EN] Seasonal buying pattern (e.g. FOUR_SEASONS, TWO_SEASONS, YEAR_ROUND)
     * [BN] সিজনাল বাইং প্যাটার্ন (FOUR_SEASONS, TWO_SEASONS)
     */
    @Column(name = "season_pattern", nullable = false, length = 50)
    private String seasonPattern = "FOUR_SEASONS";

    /**
     * [EN] Dedicated brand merchandiser / liaison contact
     * [BN] ব্র্যান্ডের দায়িত্বপ্রাপ্ত মার্চেন্ডাইজার বা যোগাযোগকারী
     */
    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    /**
     * [EN] Brand focal communication email
     * [BN] ব্র্যান্ডের অফিশিয়াল ইমেইল
     */
    @Column(name = "contact_email", length = 120)
    private String contactEmail;

    /**
     * [EN] Direct contact phone number
     * [BN] যোগাযোগের ফোন নম্বর
     */
    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    /**
     * [EN] Operational status: ACTIVE, INACTIVE
     * [BN] ব্র্যান্ডের বর্তমান সক্রিয় অবস্থা
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    /**
     * [EN] Special brand remarks or compliance instructions
     * [BN] ব্র্যান্ড সম্পর্কিত বিশেষ মন্তব্য বা নির্দেশনা
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "deleted_at")
    private Instant deletedAt;

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

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public void markDeleted(String actor) {
        this.deletedAt = Instant.now();
        this.updatedBy = actor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BuyerBrand that)) return false;
        return Objects.equals(tenantId, that.tenantId) && Objects.equals(brandCode, that.brandCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, brandCode);
    }
}

