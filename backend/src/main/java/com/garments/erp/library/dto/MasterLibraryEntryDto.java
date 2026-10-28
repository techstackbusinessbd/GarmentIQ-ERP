package com.garments.erp.library.dto;

import com.garments.erp.library.entity.MasterLibraryEntry;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Master Library Entry Data Transfer Object (MasterLibraryEntryDto)
 * [BN] মাস্টার লাইব্রেরি এন্ট্রি ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 */
@Getter
@Builder
public class MasterLibraryEntryDto implements Serializable {

    private UUID id;
    private UUID tenantId;
    private String domainCode;
    private String entityType;
    private String entryCode;
    private String entryName;
    private Integer displayOrder;
    private String description;
    private String attributes;
    private Boolean isActive;
    private Boolean isSystemSeeded;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;

    public static MasterLibraryEntryDto fromEntity(MasterLibraryEntry entity) {
        if (entity == null) return null;
        return MasterLibraryEntryDto.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .domainCode(entity.getDomainCode())
                .entityType(entity.getEntityType())
                .entryCode(entity.getEntryCode())
                .entryName(entity.getEntryName())
                .displayOrder(entity.getDisplayOrder())
                .description(entity.getDescription())
                .attributes(entity.getAttributes())
                .isActive(entity.getIsActive())
                .isSystemSeeded(entity.getIsSystemSeeded())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }
}
