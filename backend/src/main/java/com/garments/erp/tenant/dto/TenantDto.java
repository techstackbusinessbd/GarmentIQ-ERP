package com.garments.erp.tenant.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Organization Data Transfer Object (TenantDto)
 * [BN] মাল্টি-টেন্যান্ট প্রতিষ্ঠান ডেটা ট্রান্সফার অবজেক্ট (TenantDto)
 * =============================================================================
 */
@Getter
@Setter
public class TenantDto implements Serializable {

    private UUID id;
    private String tenantCode;
    private String tenantName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String subscriptionTier;
    private String businessType;
    private String factoryZone;
    private Integer sewingLines;
    private Integer dailyCapacity;
    private Boolean hasWashingPlant;
    private String tradeLicenseNo;
    private String bgmeaRegNo;
    private String companyType;
    private String hostingType;
    private String subdomain;
    private String customDomain;
    private boolean active;
    private boolean isDeleted;
    private Instant createdAt;

    public TenantDto() {
    }

    public TenantDto(UUID id, String tenantCode, String tenantName, String contactEmail,
                     String contactPhone, String address, String subscriptionTier,
                     boolean active, Instant createdAt) {
        this.id = id;
        this.tenantCode = tenantCode;
        this.tenantName = tenantName;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.address = address;
        this.subscriptionTier = subscriptionTier;
        this.active = active;
        this.createdAt = createdAt;
    }
}
