package com.garments.erp.tenant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] Client Organization / Factory Tenant Modification Request (Rule 24 & 25)
 * [BN] ক্লায়েন্ট ফ্যাক্টরি তথ্য হালনাগাদ রিকোয়েস্ট ডিটিও
 * =============================================================================
 */
@Getter
@Setter
public class UpdateTenantRequest implements Serializable {

    /**
     * [EN] Modified corporate name of factory or apparel group
     * [BN] পরিমার্জিত নিবন্ধিত পূর্ণ প্রাতিষ্ঠানিক নাম
     */
    @Size(min = 2, max = 150, message = "Tenant name must be between 2 and 150 characters")
    private String tenantName;

    /**
     * [EN] Modified contact and notification email
     * [BN] পরিমার্জিত যোগাযোগের ইমেইল
     */
    @Email(message = "Contact email must be a valid email address")
    private String contactEmail;

    /**
     * [EN] Modified telephone number
     * [BN] পরিমার্জিত ফোন নম্বর
     */
    private String contactPhone;

    /**
     * [EN] Modified physical address
     * [BN] পরিমার্জিত কারখানা বা হেড অফিসের ঠিকানা
     */
    private String address;

    /**
     * [EN] Modified subscription tier
     * [BN] পরিমার্জিত সাবস্ক্রিপশন প্ল্যান
     */
    private String subscriptionTier;

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
    private String companyType;

    /** [EN] Hosting infrastructure type / [BN] হোস্টিং মডেল */
    private String hostingType;

    /** [EN] Subdomain slug / [BN] সাবডোমেন স্লাগ */
    private String subdomain;

    /** [EN] Custom domain for on-premise / [BN] সেলফ-হোস্টেড কাস্টম ডোমেন */
    private String customDomain;

    /**
     * [EN] Operational status (true = active, false = suspended)
     * [BN] সক্রিয় বা স্থগিত অবস্থা
     */
    private Boolean active;

    public UpdateTenantRequest() {
    }

    public UpdateTenantRequest(String tenantName, String contactEmail, String subscriptionTier, Boolean active) {
        this.tenantName = tenantName;
        this.contactEmail = contactEmail;
        this.subscriptionTier = subscriptionTier;
        this.active = active;
    }
}
