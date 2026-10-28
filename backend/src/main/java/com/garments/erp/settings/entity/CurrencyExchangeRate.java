package com.garments.erp.settings.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Commercial Currency Exchange Rate Entity (CurrencyExchangeRate.java)
 * [BN] বাণিজ্যিক মুদ্রা বিনিময় হার এনটিটি (CurrencyExchangeRate.java)
 * =============================================================================
 * [EN] Reference: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] মার্চেন্ডাইজিং ও বিলিংয়ের জন্য বিডিটি ও ইউএসডি বিনিময় হার সংরক্ষণ।
 */
@Entity
@Table(name = "currency_exchange_rates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrencyExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "currency_code", nullable = false, length = 10)
    private String currencyCode;

    @Column(name = "currency_name", nullable = false, length = 50)
    private String currencyName;

    @Column(name = "currency_symbol", nullable = false, length = 10)
    private String currencySymbol;

    @Column(name = "rate_to_usd", nullable = false, precision = 15, scale = 6)
    @Builder.Default
    private BigDecimal rateToUsd = BigDecimal.ONE;

    @Column(name = "rate_to_bdt", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal rateToBdt = BigDecimal.ONE;

    @Column(name = "is_master", nullable = false)
    @Builder.Default
    private Boolean isMaster = false;

    @Column(name = "is_operating", nullable = false)
    @Builder.Default
    private Boolean isOperating = false;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
