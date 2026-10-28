package com.garments.erp.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Currency Exchange Rate DTO (CurrencyExchangeRateDto.java)
 * [BN] মুদ্রা বিনিময় হার ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrencyExchangeRateDto implements Serializable {
    private UUID id;

    @NotBlank(message = "Currency code is required")
    private String code;

    @NotBlank(message = "Currency name is required")
    private String name;

    @NotBlank(message = "Currency symbol is required")
    private String symbol;

    @NotNull(message = "Rate to USD is required")
    private BigDecimal rateToUsd;

    @NotNull(message = "Rate to BDT is required")
    private BigDecimal rateToBdt;

    @Builder.Default
    private Boolean isMaster = false;

    @Builder.Default
    private Boolean isOperating = false;

    private OffsetDateTime lastUpdated;
}
