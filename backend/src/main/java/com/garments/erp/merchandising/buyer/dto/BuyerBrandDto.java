package com.garments.erp.merchandising.buyer.dto;

import com.garments.erp.merchandising.buyer.entity.BuyerBrand;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Buyer Sub-Brand Data Transfer Object (BuyerBrandDto.java)
 * [BN] বায়ার সাব-ব্র্যান্ড ডেটা ট্রান্সফার অবজেক্ট (BuyerBrandDto.java)
 * =============================================================================
 */
@Getter
@Builder
public class BuyerBrandDto implements Serializable {

    private UUID id;
    private UUID tenantId;
    private UUID buyerId;
    private String brandCode;
    private String brandName;
    private String targetMarket;
    private String seasonPattern;
    private String contactPerson;
    private String contactEmail;
    private String contactPhone;
    private String status;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    public static BuyerBrandDto fromEntity(BuyerBrand entity) {
        if (entity == null) return null;
        return BuyerBrandDto.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .buyerId(entity.getBuyer() != null ? entity.getBuyer().getId() : null)
                .brandCode(entity.getBrandCode())
                .brandName(entity.getBrandName())
                .targetMarket(entity.getTargetMarket())
                .seasonPattern(entity.getSeasonPattern())
                .contactPerson(entity.getContactPerson())
                .contactEmail(entity.getContactEmail())
                .contactPhone(entity.getContactPhone())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }
}

