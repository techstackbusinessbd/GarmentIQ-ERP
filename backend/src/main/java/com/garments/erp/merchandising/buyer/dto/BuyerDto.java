package com.garments.erp.merchandising.buyer.dto;

import com.garments.erp.merchandising.buyer.entity.Buyer;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Buyer Data Transfer Object (BuyerDto.java)
 * [BN] গ্লোবাল বায়ার ডেটা ট্রান্সফার অবজেক্ট (BuyerDto.java)
 * =============================================================================
 */
@Getter
@Builder
public class BuyerDto implements Serializable {

    private UUID id;
    private UUID tenantId;
    private String buyerCode;
    private String buyerName;
    private String shortName;
    private String buyerType;
    private BigDecimal commissionPercentage;
    private String countryOfOrigin;
    private String headquartersAddress;
    private String contactPersonName;
    private String contactEmail;
    private String contactPhone;
    private String defaultCurrency;
    private String paymentTerms;
    private Integer creditPeriodDays;
    private String complianceStatus;
    private String status;
    private String notes;
    private Integer brandCount;
    private List<BuyerBrandDto> brands;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    public static BuyerDto fromEntity(Buyer entity) {
        return fromEntity(entity, false);
    }

    public static BuyerDto fromEntity(Buyer entity, boolean includeBrands) {
        if (entity == null) return null;

        List<BuyerBrandDto> brandDtos = null;
        int brandCount = 0;
        if (entity.getBrands() != null) {
            brandCount = (int) entity.getBrands().stream()
                    .filter(b -> b.getDeletedAt() == null)
                    .count();
            if (includeBrands) {
                brandDtos = entity.getBrands().stream()
                        .filter(b -> b.getDeletedAt() == null)
                        .map(BuyerBrandDto::fromEntity)
                        .toList();
            }
        }

        return BuyerDto.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .buyerCode(entity.getBuyerCode())
                .buyerName(entity.getBuyerName())
                .shortName(entity.getShortName())
                .buyerType(entity.getBuyerType())
                .commissionPercentage(entity.getCommissionPercentage())
                .countryOfOrigin(entity.getCountryOfOrigin())
                .headquartersAddress(entity.getHeadquartersAddress())
                .contactPersonName(entity.getContactPersonName())
                .contactEmail(entity.getContactEmail())
                .contactPhone(entity.getContactPhone())
                .defaultCurrency(entity.getDefaultCurrency())
                .paymentTerms(entity.getPaymentTerms())
                .creditPeriodDays(entity.getCreditPeriodDays())
                .complianceStatus(entity.getComplianceStatus())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .brandCount(brandCount)
                .brands(brandDtos)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }
}
