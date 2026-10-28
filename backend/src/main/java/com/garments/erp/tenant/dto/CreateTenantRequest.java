package com.garments.erp.tenant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] Client Organization / Factory Tenant Provisioning Request (Rule 24 & 25)
 * [BN] ক্লায়েন্ট ফ্যাক্টরি বা গার্মেন্টস গ্রুপ নিবন্ধন রিকোয়েস্ট ডিটিও
 * =============================================================================
 */
@Getter
@Setter
public class CreateTenantRequest implements Serializable {

    /**
     * [EN] Optional business code. If omitted, system generates unique code automatically per Rule 24.
     * [BN] ঐচ্ছিক ব্যবসায়িক কোড। প্রদান না করলে রুল ২৪ অনুযায়ী সিস্টেম স্বয়ংক্রিয়ভাবে কোড তৈরি করবে।
     */
    @Size(max = 30, message = "Tenant code must not exceed 30 characters")
    @Pattern(regexp = "^$|^[A-Za-z0-9_-]+$", message = "Tenant code must contain only letters, numbers, hyphens, and underscores")
    private String tenantCode;

    /**
     * [EN] Official registered corporate name of factory or apparel group
     * [BN] কারখানা বা তৈরি পোশাক গ্রুপের নিবন্ধিত পূর্ণ প্রাতিষ্ঠানিক নাম
     */
    @NotBlank(message = "Tenant name must not be blank")
    @Size(min = 2, max = 150, message = "Tenant name must be between 2 and 150 characters")
    private String tenantName;

    /**
     * [EN] Primary contact and administrative notification email
     * [BN] প্রধান যোগাযোগের অফিশিয়াল ইমেইল
     */
    @NotBlank(message = "Contact email must not be blank")
    @Email(message = "Contact email must be a valid email address")
    private String contactEmail;

    /**
     * [EN] Primary contact telephone number
     * [BN] প্রধান যোগাযোগের ফোন নম্বর
     */
    private String contactPhone;

    /**
     * [EN] Physical address of corporate headquarters or central plant
     * [BN] প্রধান করপোরেট হেড অফিস বা সেন্ট্রাল ফ্যাক্টরির ঠিকানা
     */
    private String address;

    /**
     * [EN] ERP software subscription tier (default: ENTERPRISE)
     * [BN] ইআরপি সফটওয়্যার সাবস্ক্রিপশন প্ল্যান
     */
    private String subscriptionTier = "ENTERPRISE";

    /** [EN] Core manufacturing domain / [BN] মূল পোশাক উৎপাদন ক্ষেত্র */
    private String businessType;

    /** [EN] Factory cluster / [BN] শিল্প অঞ্চল বা ইপিজেড */
    private String factoryZone;

    /** [EN] Operational sewing line count / [BN] মোট সক্রিয় সুইং লাইনের সংখ্যা */
    private Integer sewingLines;

    /** [EN] Daily garment output capacity / [BN] দৈনিক উৎপাদন সক্ষমতা (পিস) */
    private Integer dailyCapacity;

    /** [EN] In-house washing plant flag / [BN] নিজস্ব ওয়াশিং ও ডায়িং প্ল্যান্ট ফ্ল্যাগ */
    private Boolean hasWashingPlant;

    /** [EN] Government trade license / [BN] ট্রেড লাইসেন্স নম্বর */
    private String tradeLicenseNo;

    /** [EN] BGMEA / BKMEA export reg no / [BN] বিজিএমইএ রেজিস্ট্রেশন নম্বর */
    private String bgmeaRegNo;

    /** [EN] Corporate company structure / [BN] প্রাতিষ্ঠানিক কাঠামো */
    private String companyType = "GROUP_OF_COMPANIES";

    /** [EN] Hosting infrastructure type / [BN] হোস্টিং মডেল */
    private String hostingType = "CLOUD_SAAS";

    /** [EN] Subdomain slug (e.g. hameem) / [BN] সাবডোমেন স্লাগ */
    private String subdomain;

    /** [EN] Custom domain for on-premise / [BN] সেলফ-হোস্টেড কাস্টম ডোমেন */
    private String customDomain;

    /** [EN] Initial Client Admin Full Name / [BN] ক্লায়েন্ট অ্যাডমিনের পূর্ণ নাম */
    private String adminFullName;

    /** [EN] Initial Client Admin Email / [BN] ক্লায়েন্ট অ্যাডমিনের অফিশিয়াল ইমেইল */
    private String adminEmail;

    /** [EN] Initial Client Admin Login Username / [BN] ক্লায়েন্ট অ্যাডমিনের ইউজারনেম */
    private String adminUsername;

    /** [EN] Initial Client Admin Phone / [BN] ক্লায়েন্ট অ্যাডমিনের ফোন */
    private String adminPhone;

    /** [EN] Initial Client Admin Password / [BN] ক্লায়েন্ট অ্যাডমিনের পাসওয়ার্ড */
    private String adminPassword;

    public CreateTenantRequest() {
    }

    public CreateTenantRequest(String tenantCode, String tenantName, String contactEmail) {
        this.tenantCode = tenantCode;
        this.tenantName = tenantName;
        this.contactEmail = contactEmail;
    }
}
