package com.garments.erp.merchandising.buyer.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * =============================================================================
 * [EN] Create Buyer Request DTO (CreateBuyerRequest.java)
 * [BN] নতুন বায়ার তৈরির রিকোয়েস্ট ডিটিও (CreateBuyerRequest.java)
 * =============================================================================
 * [EN] Reference: Rule 25 (Server-side validation)
 */
@Getter
@Setter
public class CreateBuyerRequest implements Serializable {

    @Size(max = 50, message = "Buyer code must not exceed 50 characters")
    private String buyerCode;

    @NotBlank(message = "Buyer name is required")
    @Size(min = 2, max = 150, message = "Buyer name must be between 2 and 150 characters")
    private String buyerName;

    @Size(max = 50, message = "Short name must not exceed 50 characters")
    private String shortName;

    @NotBlank(message = "Buyer type is required")
    @Pattern(regexp = "^(DIRECT|BUYING_HOUSE|AGENT|IMPORTER|DOMESTIC)$", message = "Invalid buyer type")
    private String buyerType = "DIRECT";

    @DecimalMin(value = "0.00", message = "Commission percentage cannot be negative")
    @DecimalMax(value = "100.00", message = "Commission percentage cannot exceed 100%")
    private BigDecimal commissionPercentage = BigDecimal.ZERO;

    @NotBlank(message = "Country of origin is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String countryOfOrigin;

    private String headquartersAddress;

    @Size(max = 100, message = "Contact person name must not exceed 100 characters")
    private String contactPersonName;

    @Email(message = "Invalid contact email address format")
    @Size(max = 120, message = "Contact email must not exceed 120 characters")
    private String contactEmail;

    @Size(max = 50, message = "Contact phone must not exceed 50 characters")
    private String contactPhone;

    @NotBlank(message = "Default currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
    private String defaultCurrency = "USD";

    @NotBlank(message = "Payment terms are required")
    @Size(max = 50, message = "Payment terms must not exceed 50 characters")
    private String paymentTerms = "LC_AT_SIGHT";

    @NotNull(message = "Credit period days is required")
    @Min(value = 0, message = "Credit period days cannot be negative")
    private Integer creditPeriodDays = 30;

    @NotBlank(message = "Compliance status is required")
    @Size(max = 30, message = "Compliance status must not exceed 30 characters")
    private String complianceStatus = "COMPLIANT";

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";

    private String notes;
}
