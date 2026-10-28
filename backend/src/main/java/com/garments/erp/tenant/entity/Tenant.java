package com.garments.erp.tenant.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Root Parent Entity (TexTech Group / Factory Tenant)
 * [BN] মাল্টি-টেন্যান্ট মূল প্যারেন্ট এন্টিটি (গার্মেন্টস গ্রুপ ও কারখানা টেন্যান্ট)
 * =============================================================================
 * [EN] Represents the root administrative organization/tenant in the multi-tenant
 *      architecture. Every business entity (Users, Orders, Cuts, Fabrics) is scoped
 *      under a specific tenant to ensure total data isolation.
 * [BN] মাল্টি-টেন্যান্ট আর্কিটেকচারের সর্বোচ্চ প্যারেন্ট প্রতিষ্ঠান/কারখানাকে নির্দেশ করে।
 *      সিস্টেমের সকল ডোমেন ডেটা (ইউজার, বায়ার অর্ডার, কাটিং ও ফেব্রিক) সম্পূর্ণ
 *      ডেটা আইসোলেশন বজায় রাখতে একটি নির্দিষ্ট টেন্যান্টের অধীনে সংরক্ষিত হয়।
 */
@Getter
@Setter
@Entity
@Table(name = "tenants")
public class Tenant implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Unique business code identifying the tenant organization (e.g. TEXTECH)
     * [BN] টেন্যান্ট বা কারখানা গ্রুপের ইউনিক ব্যবসায়িক কোড (যেমন: TEXTECH)
     */
    @Column(name = "tenant_code", nullable = false, unique = true, length = 30)
    private String tenantCode;

    /**
     * [EN] Official registered corporate name of the factory or apparel group
     * [BN] কারখানা বা তৈরি পোশাক গ্রুপের নিবন্ধিত পূর্ণ প্রাতিষ্ঠানিক নাম
     */
    @Column(name = "tenant_name", nullable = false, length = 150)
    private String tenantName;

    /**
     * [EN] Primary contact and administrative notification email address
     * [BN] টেন্যান্টের প্রধান যোগাযোগের প্রাতিষ্ঠানিক ইমেইল অ্যাড্রেস
     */
    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    /**
     * [EN] Official primary contact telephone number
     * [BN] প্রধান যোগাযোগের অফিশিয়াল টেলিফোন বা মোবাইল নম্বর
     */
    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    /**
     * [EN] Physical address of corporate headquarters or main factory facility
     * [BN] প্রধান করপোরেট হেড অফিস বা সেন্ট্রাল ফ্যাক্টরির ভৌগোলিক ঠিকানা
     */
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    /**
     * [EN] ERP platform subscription tier (e.g. STARTER, PROFESSIONAL, ENTERPRISE)
     * [BN] ইআরপি সফটওয়্যার সাবস্ক্রিপশন প্ল্যান লেভেল (যেমন: ENTERPRISE)
     */
    @Column(name = "subscription_tier", nullable = false, length = 30)
    private String subscriptionTier;

    /**
     * [EN] Corporate organizational structure (e.g. GROUP_OF_COMPANIES, STANDALONE_FACTORY)
     * [BN] প্রাতিষ্ঠানিক কাঠামো (গ্রুপ অফ কোম্পানিজ অথবা একক কারখানা)
     */
    @Column(name = "company_type", nullable = false, length = 50)
    private String companyType = "GROUP_OF_COMPANIES";

    /**
     * [EN] Hosting infrastructure model (e.g. CLOUD_SAAS, SELF_HOSTED)
     * [BN] হোস্টিং মডেল (ক্লাউড সাউস অথবা সেলফ-হোস্টেড অন-প্রেমিসেস)
     */
    @Column(name = "hosting_type", nullable = false, length = 30)
    private String hostingType = "CLOUD_SAAS";

    /**
     * [EN] Cloud tenant subdomain slug (e.g. hameem -> hameem.garmentiq.com)
     * [BN] ক্লাউড টেন্যান্ট সাবডোমেন স্লাগ
     */
    @Column(name = "subdomain", length = 60)
    private String subdomain;

    /**
     * [EN] Self-hosted / on-premise custom domain FQDN or private host IP
     * [BN] অন-প্রেমিসেস ডেডিকেটেড ডোমেন বা হোস্ট আইপি
     */
    @Column(name = "custom_domain", length = 150)
    private String customDomain;

    /**
     * [EN] Core apparel manufacturing domain (e.g. DENIM, WOVEN, COMPOSITE, INTEGRATED)
     * [BN] মূল তৈরি পোশাক ও ডেনিম উৎপাদন ক্ষেত্র
     */
    @Column(name = "business_type", length = 50)
    private String businessType;

    /**
     * [EN] Industrial cluster or manufacturing export processing zone (EPZ)
     * [BN] শিল্প অঞ্চল বা রফতানি প্রক্রিয়াকরণ অঞ্চল (ইপিজেড)
     */
    @Column(name = "factory_zone", length = 100)
    private String factoryZone;

    /**
     * [EN] Operational sewing line count on factory floors
     * [BN] কারখানার ফ্লোরে সক্রিয় সুইং লাইনের সংখ্যা
     */
    @Column(name = "sewing_lines")
    private Integer sewingLines;

    /**
     * [EN] Estimated daily garment production capacity in pieces
     * [BN] দৈনিক প্রাক্কলিত পোশাক উৎপাদন সক্ষমতা (পিস)
     */
    @Column(name = "daily_capacity")
    private Integer dailyCapacity;

    /**
     * [EN] Flag indicating in-house denim/garment washing plant capabilities
     * [BN] কারখানায় নিজস্ব ডেনিম ওয়াশিং ও ডায়িং লন্ড্রি প্ল্যান্ট আছে কি না
     */
    @Column(name = "has_washing_plant")
    private Boolean hasWashingPlant;

    public Boolean getHasWashingPlant() {
        return this.hasWashingPlant;
    }

    public Boolean isHasWashingPlant() {
        return this.hasWashingPlant;
    }

    public void setHasWashingPlant(Boolean hasWashingPlant) {
        this.hasWashingPlant = hasWashingPlant;
    }

    /**
     * [EN] Government trade license or factory incorporation number
     * [BN] সরকারি ট্রেড লাইসেন্স বা ইনকর্পোরেশন নম্বর
     */
    @Column(name = "trade_license_no", length = 100)
    private String tradeLicenseNo;

    /**
     * [EN] BGMEA / BKMEA export association membership registration
     * [BN] বিজিএমইএ বা বিকেএমইএ মেম্বারশিপ রেজিস্ট্রেশন নম্বর
     */
    @Column(name = "bgmea_reg_no", length = 100)
    private String bgmeaRegNo;

    /**
     * [EN] Operational status flag (true = active tenant, false = suspended)
     * [BN] টেন্যান্ট সক্রিয় বা স্থগিত কি না তা নির্দেশক বুলিয়ান ফ্ল্যাগ
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    /**
     * [EN] UTC timestamp recording the exact creation moment of the tenant
     * [BN] টেন্যান্ট রেকর্ডটি সিস্টেমে তৈরি হওয়ার সুনির্দিষ্ট UTC টাইমস্ট্যাম্প
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] UTC timestamp capturing the latest modification moment of this tenant
     * [BN] টেন্যান্ট রেকর্ডটি সর্বশেষ পরিমার্জিত হওয়ার সুনির্দিষ্ট UTC টাইমস্ট্যাম্প
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Username or system process that registered this tenant
     * [BN] যে অ্যাডমিনিস্ট্রেটর বা প্রসেস টেন্যান্টটি নিবন্ধন করেছে
     */
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    /**
     * [EN] Username or system process that performed the latest update
     * [BN] যে কর্মকর্তা বা প্রসেস সর্বশেষ আপডেট সম্পন্ন করেছে
     */
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * [EN] Soft deletion flag (false = active, true = soft-deleted)
     * [BN] সফট ডিলিট নির্দেশক ফ্ল্যাগ (false = সক্রিয়, true = সফট-ডিলিটেড)
     */
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    /**
     * [EN] Concurrency control version number automatically incremented by JPA
     * [BN] অপটিমিস্টিক কনকারেন্সি কন্ট্রোল ভার্সন নম্বর
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    /**
     * [EN] Default no-args constructor initializing active status and default tier
     * [BN] ডিফল্ট কনস্ট্রাক্টর—ডিফল্ট সাবস্ক্রিপশন ও সক্রিয় অবস্থা সেট করে
     */
    public Tenant() {
        this.subscriptionTier = "ENTERPRISE";
        this.isActive = true;
        this.isDeleted = false;
        this.version = 0L;
    }

    /**
     * [EN] Parameterized constructor for direct tenant provisioning
     * [BN] সরাসরি টেন্যান্ট তৈরির জন্য প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param tenantCode [EN] Business code / [BN] ইউনিক কোড
     * @param tenantName [EN] Official name / [BN] প্রাতিষ্ঠানিক নাম
     * @param email      [EN] Contact email / [BN] ইমেইল
     */
    public Tenant(String tenantCode, String tenantName, String email) {
        this();
        this.tenantCode = tenantCode;
        this.tenantName = tenantName;
        this.contactEmail = email;
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
        if (this.createdBy == null) {
            this.createdBy = "SYSTEM";
        }
        if (this.updatedBy == null) {
            this.updatedBy = "SYSTEM";
        }
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
