package com.garments.erp.settings.repository;

import com.garments.erp.settings.entity.CurrencyExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Currency Exchange Rate JPA Repository (CurrencyExchangeRateRepository.java)
 * [BN] মুদ্রা বিনিময় হার ডেটাবেজ রিপোজিটরি (CurrencyExchangeRateRepository.java)
 * =============================================================================
 */
@Repository
public interface CurrencyExchangeRateRepository extends JpaRepository<CurrencyExchangeRate, UUID> {
    List<CurrencyExchangeRate> findAllByTenantIdOrderByCurrencyCodeAsc(UUID tenantId);
    Optional<CurrencyExchangeRate> findByTenantIdAndCurrencyCode(UUID tenantId, String currencyCode);
    Optional<CurrencyExchangeRate> findByIdAndTenantId(UUID id, UUID tenantId);
}
