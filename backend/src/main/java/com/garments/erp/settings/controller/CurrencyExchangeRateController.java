package com.garments.erp.settings.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.settings.dto.CurrencyExchangeRateDto;
import com.garments.erp.settings.service.CurrencyExchangeRateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * =============================================================================
 * [EN] Currency Exchange Rate REST Controller (CurrencyExchangeRateController.java)
 * [BN] মুদ্রা বিনিময় হার রেস্ট কন্ট্রোলার
 * =============================================================================
 */
@RestController
@RequestMapping("/api/v1/settings/currencies")
@RequiredArgsConstructor
public class CurrencyExchangeRateController {

    private final CurrencyExchangeRateService currencyService;

    @GetMapping
    @PreAuthorize("hasAuthority('CURRENCY:VIEW') or hasAuthority('SETTINGS:VIEW') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CurrencyExchangeRateDto>>> getAllCurrencies() {
        return ResponseEntity.ok(ApiResponse.success(currencyService.getAllCurrencies(), "Currencies retrieved successfully."));
    }

    @PutMapping("/{code}")
    @PreAuthorize("hasAuthority('CURRENCY:EDIT') or hasAuthority('SETTINGS:EDIT') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<CurrencyExchangeRateDto>> updateRate(
            @PathVariable String code,
            @RequestBody Map<String, BigDecimal> payload
    ) {
        BigDecimal newRate = payload.get("rateToBdt");
        CurrencyExchangeRateDto updated = currencyService.updateCurrency(code, newRate);
        return ResponseEntity.ok(ApiResponse.success(updated, "Currency rate updated successfully."));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CURRENCY:EDIT') or hasAuthority('SETTINGS:EDIT') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<CurrencyExchangeRateDto>> upsertCurrency(@Valid @RequestBody CurrencyExchangeRateDto dto) {
        CurrencyExchangeRateDto saved = currencyService.upsertCurrency(dto);
        return ResponseEntity.ok(ApiResponse.success(saved, "Currency saved successfully."));
    }
}
