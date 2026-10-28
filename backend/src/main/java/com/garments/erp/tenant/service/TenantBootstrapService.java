package com.garments.erp.tenant.service;

import com.garments.erp.core.utils.UuidV7Generator;
import com.garments.erp.sequence.entity.CodeSequenceTemplate;
import com.garments.erp.sequence.entity.ResetFrequency;
import com.garments.erp.sequence.repository.CodeSequenceTemplateRepository;
import com.garments.erp.settings.entity.CurrencyExchangeRate;
import com.garments.erp.settings.entity.FactoryShift;
import com.garments.erp.settings.repository.CurrencyExchangeRateRepository;
import com.garments.erp.settings.repository.FactoryShiftRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Automated Onboarding Bootstrap Service (TenantBootstrapService)
 * [BN] মাল্টি-টেন্যান্ট স্বয়ংক্রিয় অনবোর্ডিং বুটস্ট্র্যাপ সার্ভিস (TenantBootstrapService)
 * =============================================================================
 * [EN] Reference: B2B Enterprise SaaS Architecture, Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] নতুন ক্লায়েন্ট কারখানা নিবন্ধনের সাথে সাথে প্রাথমিক ব্যবসায়িক কোড সিকোয়েন্স,
 *      ডিফল্ট কর্মশিফট ও বাণিজ্যিক মুদ্রা বিনিময় হার স্বয়ংক্রিয়ভাবে ডাটাবেজে প্রস্তুত করে।
 */
@Slf4j
@Service
public class TenantBootstrapService {

    private final CodeSequenceTemplateRepository sequenceTemplateRepository;
    private final FactoryShiftRepository factoryShiftRepository;
    private final CurrencyExchangeRateRepository currencyRepository;

    public TenantBootstrapService(
            CodeSequenceTemplateRepository sequenceTemplateRepository,
            FactoryShiftRepository factoryShiftRepository,
            CurrencyExchangeRateRepository currencyRepository) {
        this.sequenceTemplateRepository = sequenceTemplateRepository;
        this.factoryShiftRepository = factoryShiftRepository;
        this.currencyRepository = currencyRepository;
    }

    /**
     * [EN] Bootstraps all essential baseline configurations for a newly provisioned tenant factory
     * [BN] নতুন নিবন্ধিত ক্লায়েন্ট কারখানার জন্য সমস্ত প্রাথমিক কনফিগারেশন স্বয়ংক্রিয়ভাবে তৈরি করে
     */
    @Transactional
    public void bootstrapNewTenant(UUID tenantId) {
        if (tenantId == null) {
            return;
        }
        log.info("Bootstrapping baseline configuration records for tenant: {}", tenantId);

        bootstrapCodeSequences(tenantId);
        bootstrapFactoryShifts(tenantId);
        bootstrapCurrencies(tenantId);

        log.info("Successfully completed SaaS bootstrapping for tenant: {}", tenantId);
    }

    /**
     * [EN] Seeds default RMG business code sequence templates conforming to Rule 24
     * [BN] রুল ২৪ অনুবর্তী আরএমজি কোড সিকোয়েন্স টেমপ্লেটসমূহ স্বয়ংক্রিয়ভাবে সিড করা
     */
    private void bootstrapCodeSequences(UUID tenantId) {
        List<CodeSpec> specs = List.of(
                new CodeSpec("BUYER_PO", "PO-{YYMM}-{SEQ:4}", "PO", 4, ResetFrequency.MONTHLY),
                new CodeSpec("STYLE", "STY-{SEQ:4}", "STY", 4, ResetFrequency.NEVER),
                new CodeSpec("CUTTING_JOB", "CUT-{YYMM}-{SEQ:4}", "CUT", 4, ResetFrequency.MONTHLY),
                new CodeSpec("BUNDLE", "BDL-{YYMM}-{SEQ:5}", "BDL", 5, ResetFrequency.MONTHLY),
                new CodeSpec("INVOICE", "INV-{YYMM}-{SEQ:4}", "INV", 4, ResetFrequency.YEARLY)
        );

        for (CodeSpec spec : specs) {
            if (sequenceTemplateRepository.existsByTenantIdAndEntityType(tenantId, spec.entityType)) {
                continue;
            }
            CodeSequenceTemplate t = new CodeSequenceTemplate();
            t.setId(UuidV7Generator.generate());
            t.setTenantId(tenantId);
            t.setEntityType(spec.entityType);
            t.setPattern(spec.pattern);
            t.setPrefix(spec.prefix);
            t.setPaddingLength(spec.padding);
            t.setResetFrequency(spec.resetFrequency);
            t.setActive(true);
            t.setCreatedAt(Instant.now());
            t.setUpdatedAt(Instant.now());
            sequenceTemplateRepository.save(t);
        }
    }

    /**
     * [EN] Seeds standard factory production shifts
     * [BN] স্ট্যান্ডার্ড কারখানা প্রোডাকশন শিফটসমূহ সিড করা
     */
    private void bootstrapFactoryShifts(UUID tenantId) {
        List<FactoryShift> existing = factoryShiftRepository.findAllByTenantIdOrderByStartTimeAsc(tenantId);
        if (!existing.isEmpty()) {
            return;
        }

        FactoryShift dayShift = FactoryShift.builder()
                .tenantId(tenantId)
                .name("General Day Shift")
                .startTime("08:00")
                .endTime("16:30")
                .breakMinutes(60)
                .isActive(true)
                .build();

        FactoryShift eveningShift = FactoryShift.builder()
                .tenantId(tenantId)
                .name("Evening Overtime Shift")
                .startTime("16:30")
                .endTime("21:00")
                .breakMinutes(30)
                .isActive(true)
                .build();

        factoryShiftRepository.saveAll(List.of(dayShift, eveningShift));
    }

    /**
     * [EN] Seeds baseline operational currencies and exchange rates
     * [BN] বেসলাইন বাণিজ্যিক কারেন্সি ও বিনিময় হার সিড করা
     */
    private void bootstrapCurrencies(UUID tenantId) {
        List<CurrencyExchangeRate> existing = currencyRepository.findAllByTenantIdOrderByCurrencyCodeAsc(tenantId);
        if (!existing.isEmpty()) {
            return;
        }

        CurrencyExchangeRate usd = CurrencyExchangeRate.builder()
                .tenantId(tenantId)
                .currencyCode("USD")
                .currencyName("US Dollar")
                .currencySymbol("$")
                .rateToUsd(BigDecimal.ONE)
                .rateToBdt(new BigDecimal("121.5000"))
                .build();

        CurrencyExchangeRate bdt = CurrencyExchangeRate.builder()
                .tenantId(tenantId)
                .currencyCode("BDT")
                .currencyName("Bangladeshi Taka")
                .currencySymbol("৳")
                .rateToUsd(new BigDecimal("0.008230"))
                .rateToBdt(BigDecimal.ONE)
                .build();

        CurrencyExchangeRate eur = CurrencyExchangeRate.builder()
                .tenantId(tenantId)
                .currencyCode("EUR")
                .currencyName("Euro")
                .currencySymbol("€")
                .rateToUsd(new BigDecimal("1.080000"))
                .rateToBdt(new BigDecimal("131.2200"))
                .build();

        currencyRepository.saveAll(List.of(usd, bdt, eur));
    }

    private record CodeSpec(String entityType, String pattern, String prefix, int padding, ResetFrequency resetFrequency) {}
}
