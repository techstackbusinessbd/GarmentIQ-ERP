package com.garments.erp.merchandising.buyer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] Create Sub-Brand Request DTO (CreateBuyerBrandRequest.java)
 * [BN] সাব-ব্র্যান্ড তৈরির রিকোয়েস্ট ডিটিও (CreateBuyerBrandRequest.java)
 * =============================================================================
 */
@Getter
@Setter
public class CreateBuyerBrandRequest implements Serializable {

    @Size(max = 50, message = "Brand code must not exceed 50 characters")
    private String brandCode;

    @NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 150, message = "Brand name must be between 2 and 150 characters")
    private String brandName;

    @Size(max = 100, message = "Target market must not exceed 100 characters")
    private String targetMarket;

    @NotBlank(message = "Season pattern is required")
    @Size(max = 50, message = "Season pattern must not exceed 50 characters")
    private String seasonPattern = "FOUR_SEASONS";

    @Size(max = 100, message = "Contact person must not exceed 100 characters")
    private String contactPerson;

    @Email(message = "Invalid contact email address format")
    @Size(max = 120, message = "Contact email must not exceed 120 characters")
    private String contactEmail;

    @Size(max = 50, message = "Contact phone must not exceed 50 characters")
    private String contactPhone;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";

    private String notes;
}

