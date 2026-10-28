package com.garments.erp.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * =============================================================================
 * [EN] Update Master Library Entry Request DTO (Rule 25 Server Validation)
 * [BN] বিদ্যমান মাস্টার লাইব্রেরি এন্ট্রি আপডেট করার রিকোয়েস্ট ডিটিও
 * =============================================================================
 */
@Getter
@Setter
public class UpdateMasterLibraryEntryRequest {

    @NotBlank(message = "Entry name is required")
    @Size(max = 150, message = "Entry name must not exceed 150 characters")
    private String entryName;

    private Integer displayOrder;

    private String description;

    private String attributes; // JSON string

    private Boolean isActive;
}
