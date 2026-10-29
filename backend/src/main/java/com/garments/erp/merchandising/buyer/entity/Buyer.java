package com.garments.erp.merchandising.buyer.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Buyer Master Entity (Buyer.java) - Domain 01 Merchandising
 * [BN] গ্লোবাল বায়ার মাস্টার এনটিটি (Buyer.java) - ডোমেন ০১ মার্চেন্ডাইজিং
 * =============================================================================
 * [EN] Represents a global apparel buyer, retailer, or buying house in the ERP.
 *      Maintains commercial trade terms, payment conditions, and social compliance status.
 * [BN] ইআরপি-তে বৈশ্বিক পোশাক ক্রেতা, রিটেইলার বা বাইং হাউসের মাস্টার প্রোফাইল সংরক্ষণ করে।
 *      এতে বায়ারের বাণিজ্যিক শর্তাবলী, পেমেন্ট টার্মস এবং সোশ্যাল কমপ্লায়েন্স অডিট অবস্থা অন্তর্ভুক্ত।
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "buyers", uniqueConstraints = {
        @UniqueConstraint(name = "uk_buyers_tenant_code", columnNames = {"tenant_id", "buyer_code"}),
        @UniqueConstraint(name = "uk_buyers_tenant_name", columnNames = {"tenant_id", "buyer_name"})
})
public class Buyer implements Serializable {

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
     * [EN] Unique business code formatted via auto-sequencing (e.g., BYR-0001)
     * [BN] অটো-সিকোয়েন্সিং দ্বারা প্রস্তুতকৃত অনন্য বায়ার কোড (যেমন: BYR-0001)
     */
    @Column(name = "buyer_code", nullable = false, length = 50)
    private String buyerCode;

    /**
     * [EN] Official commercial registered legal entity name (e.g. H&M, Inditex)
     * [BN] বায়ারের নিবন্ধিত অফিসিয়াল বাণিজ্যিক নাম (যেমন: H&M, Zara)
     */
    @Column(name = "buyer_name", nullable = false, length = 150)
    private String buyerName;

    /**
     * [EN] Short business display abbreviation
     * [BN] রিপোর্ট ও সংক্ষিপ্ত ডিসপ্লেতে ব্যবহারের সংক্ষিপ্ত নাম
     */
    @Column(name = "short_name", length = 50)
    private String shortName;

    /**
     * [EN] Buyer classification: DIRECT, BUYING_HOUSE, AGENT, IMPORTER, DOMESTIC
     * [BN] বায়ারের ধরন: সরাসরি বায়ার নাকি বাইং হাউস/এজেন্ট
     */
    @Column(name = "buyer_type", nullable = false, length = 30)
    private String buyerType = "DIRECT";

    /**
     * [EN] Buying agent or intermediary commission percentage
     * [BN] বাইং হাউস বা লিয়াজোঁ এজেন্টের কমিশন হার (%)
     */
    @Column(name = "commission_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionPercentage = BigDecimal.ZERO;

    /**
     * [EN] Country of domicile / corporate headquarters
     * [BN] বায়ারের প্রধান দেশ (যেমন: Sweden, Spain, USA)
     */
    @Column(name = "country_of_origin", nullable = false, length = 100)
    private String countryOfOrigin;

    /**
     * [EN] Principal registered headquarters address
     * [BN] বায়ারের হেড অফিসের ঠিকানা
     */
    @Column(name = "headquarters_address", columnDefinition = "TEXT")
    private String headquartersAddress;

    /**
     * [EN] Primary merchandiser or account contact person
     * [BN] বায়ারের প্রধান মার্চেন্ডাইজার বা ফোকাল পারসনের নাম
     */
    @Column(name = "contact_person_name", length = 100)
    private String contactPersonName;

    /**
     * [EN] Official commercial communication email
     * [BN] বাণিজ্যিক যোগাযোগের প্রধান ইমেইল
     */
    @Column(name = "contact_email", length = 120)
    private String contactEmail;

    /**
     * [EN] Official telephone / mobile communication number
     * [BN] যোগাযোগের অফিসিয়াল ফোন নম্বর
     */
    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    /**
     * [EN] Default billing currency ISO-4217 code (e.g. USD, EUR, GBP)
     * [BN] ডিফল্ট ইনভয়েসিং মুদ্রা কোড (যেমন: USD, EUR)
     */
    @Column(name = "default_currency", nullable = false, length = 3)
    private String defaultCurrency = "USD";

    /**
     * [EN] Agreed international commercial payment method (e.g. LC_AT_SIGHT, TT, DA, DP)
     * [BN] আন্তর্জাতিক পেমেন্ট মেথড (যেমন: LC_AT_SIGHT, TT)
     */
    @Column(name = "payment_terms", nullable = false, length = 50)
    private String paymentTerms = "LC_AT_SIGHT";

    /**
     * [EN] Credit tenure days for export LC maturity
     * [BN] রপ্তানি এলসির মেয়াদকাল বা ক্রেডিট দিন সংখ্যা
     */
    @Column(name = "credit_period_days", nullable = false)
    private Integer creditPeriodDays = 30;

    /**
     * [EN] Factory social & technical audit rating (COMPLIANT, CONDITIONAL, AUDIT_PENDING)
     * [BN] বায়ার সোশ্যাল ও টেকনিক্যাল কমপ্লায়েন্স অডিট স্ট্যাটাস
     */
    @Column(name = "compliance_status", nullable = false, length = 30)
    private String complianceStatus = "COMPLIANT";

    /**
     * [EN] Operational status: ACTIVE, INACTIVE
     * [BN] বায়ারের বর্তমান সক্রিয় অবস্থা
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    /**
     * [EN] Special commercial remarks or buyer instructions
     * [BN] বিশেষ বাণিজ্যিক মন্তব্য বা মার্চেন্ডাইজিং নির্দেশনা
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * [EN] Sub-brand portfolio belonging to this buyer
     * [BN] এই বায়ারের অধীনস্থ সাব-ব্র্যান্ড পোর্টফোলিও
     */
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BuyerBrand> brands = new ArrayList<>();

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
        if (this.commissionPercentage == null) {
            this.commissionPercentage = BigDecimal.ZERO;
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
        if (!(o instanceof Buyer buyer)) return false;
        return Objects.equals(tenantId, buyer.tenantId) && Objects.equals(buyerCode, buyer.buyerCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, buyerCode);
    }
}
