package com.garments.erp.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * =============================================================================
 * [EN] Create Master Library Entry Request DTO (Rule 25 Server Validation)
 * [BN] নতুন মাস্টার লাইব্রেরি এন্ট্রি তৈরির রিকোয়েস্ট ডিটিও
 * =============================================================================
 */
@Getter
@Setter
public class CreateMasterLibraryEntryRequest {

    @NotBlank(message = "Domain code is required")
    @Size(max = 30, message = "Domain code must not exceed 30 characters")
    private String domainCode;

    @NotBlank(message = "Entity type is required")
    @Size(max = 50, message = "Entity type must not exceed 50 characters")
    private String entityType;

    @NotBlank(message = "Entry code is required")
    @Size(max = 50, message = "Entry code must not exceed 50 characters")
    private String entryCode;

    @NotBlank(message = "Entry name is required")
    @Size(max = 150, message = "Entry name must not exceed 150 characters")
    private String entryName;

    private Integer displayOrder = 0;

    private String description;

    private String attributes; // JSON string
}
