package com.garments.erp.settings.service;

import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.settings.dto.CurrencyExchangeRateDto;
import com.garments.erp.settings.entity.CurrencyExchangeRate;
import com.garments.erp.settings.repository.CurrencyExchangeRateRepository;
import com.garments.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Currency Exchange Rate Business Service (CurrencyExchangeRateService.java)
 * [BN] মুদ্রা বিনিময় হার সার্ভিস
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), OWASP A09 (Audit Logging)
 */
@Service
@RequiredArgsConstructor
public class CurrencyExchangeRateService {

    private final CurrencyExchangeRateRepository currencyRepository;
    private final SystemAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<CurrencyExchangeRateDto> getAllCurrencies() {
        UUID tenantId = TenantContext.getTenantId();
        return currencyRepository.findAllByTenantIdOrderByCurrencyCodeAsc(tenantId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public CurrencyExchangeRateDto updateCurrency(String code, BigDecimal newRateToBdt) {
        UUID tenantId = TenantContext.getTenantId();
        CurrencyExchangeRate rate = currencyRepository.findByTenantIdAndCurrencyCode(tenantId, code.toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Currency not found: " + code));

        rate.setRateToBdt(newRateToBdt);
        CurrencyExchangeRate saved = currencyRepository.save(rate);

        auditLogService.record(
                tenantId,
                "CURRENCY_RATE",
                "CURRENCY_UPDATED",
                "Currency: " + saved.getCurrencyCode(),
                "Updated exchange rate for " + saved.getCurrencyCode() + " to " + newRateToBdt + " BDT",
                "INFO"
        );

        return toDto(saved);
    }

    @Transactional
    public CurrencyExchangeRateDto upsertCurrency(CurrencyExchangeRateDto dto) {
        UUID tenantId = TenantContext.getTenantId();
        String code = dto.getCode().toUpperCase().trim();
        CurrencyExchangeRate rate = currencyRepository.findByTenantIdAndCurrencyCode(tenantId, code)
                .orElseGet(() -> CurrencyExchangeRate.builder()
                        .tenantId(tenantId)
                        .currencyCode(code)
                        .currencyName(dto.getName().trim())
                        .currencySymbol(dto.getSymbol().trim())
                        .build());

        rate.setCurrencyName(dto.getName().trim());
        rate.setCurrencySymbol(dto.getSymbol().trim());
        rate.setRateToUsd(dto.getRateToUsd());
        rate.setRateToBdt(dto.getRateToBdt());
        rate.setIsMaster(dto.getIsMaster() != null ? dto.getIsMaster() : false);
        rate.setIsOperating(dto.getIsOperating() != null ? dto.getIsOperating() : false);

        CurrencyExchangeRate saved = currencyRepository.save(rate);

        auditLogService.record(
                tenantId,
                "CURRENCY_RATE",
                "CURRENCY_UPSERTED",
                "Currency: " + saved.getCurrencyCode(),
                "Configured exchange rate for " + saved.getCurrencyCode() + " (USD: " + saved.getRateToUsd() + ", BDT: " + saved.getRateToBdt() + ")",
                "INFO"
        );

        return toDto(saved);
    }

    private CurrencyExchangeRateDto toDto(CurrencyExchangeRate c) {
        return CurrencyExchangeRateDto.builder()
                .id(c.getId())
                .code(c.getCurrencyCode())
                .name(c.getCurrencyName())
                .symbol(c.getCurrencySymbol())
                .rateToUsd(c.getRateToUsd())
                .rateToBdt(c.getRateToBdt())
                .isMaster(c.getIsMaster())
                .isOperating(c.getIsOperating())
                .build();
    }
}
