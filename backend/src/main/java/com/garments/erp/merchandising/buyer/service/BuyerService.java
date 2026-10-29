package com.garments.erp.merchandising.buyer.service;

import com.garments.erp.core.exception.BusinessException;
import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.core.security.SecurityUtils;
import com.garments.erp.merchandising.buyer.dto.*;
import com.garments.erp.merchandising.buyer.entity.Buyer;
import com.garments.erp.merchandising.buyer.entity.BuyerBrand;
import com.garments.erp.merchandising.buyer.repository.BuyerBrandRepository;
import com.garments.erp.merchandising.buyer.repository.BuyerRepository;
import com.garments.erp.sequence.entity.EntityTypeCode;
import com.garments.erp.sequence.service.DynamicCodeGeneratorService;
import com.garments.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Buyer & Sub-Brand Domain Service (BuyerService.java)
 * [BN] বায়ার ও সাব-ব্র্যান্ড ডোমেন সার্ভিস (BuyerService.java)
 * =============================================================================
 * [EN] Orchestrates commercial buyer registration, brand portfolio management,
 *      auto-code generation (BYR-xxxx, BRD-xxxx), and multi-tenant security isolation.
 * [BN] বায়ার প্রোফাইল তৈরি, সাব-ব্র্যান্ড পোর্টফোলিও, ডাইনামিক কোড জেনারেশন ও
 *      মাল্টি-টেন্যান্ট আইসোলেশন বিজনেস লজিক সমন্বয় করে।
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BuyerService {

    private static final UUID DEFAULT_TENANT_ID = UUID.fromString("019472ba-7000-7000-8000-000000000001");

    private final BuyerRepository buyerRepository;
    private final BuyerBrandRepository brandRepository;
    private final DynamicCodeGeneratorService codeGeneratorService;

    private UUID resolveTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        return (tenantId != null) ? tenantId : DEFAULT_TENANT_ID;
    }

    /**
     * [EN] Paginated and filtered search across buyers
     * [BN] পেজিনেটেড ও ফিল্টারসহ বায়ার অনুসন্ধান
     */
    @Transactional(readOnly = true)
    public Page<BuyerDto> getBuyers(String search, String status, String buyerType, Pageable pageable) {
        UUID tenantId = resolveTenantId();
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanStatus = (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) ? status.trim() : null;
        String cleanType = (buyerType != null && !buyerType.trim().isEmpty() && !"ALL".equalsIgnoreCase(buyerType)) ? buyerType.trim() : null;

        if (cleanSearch != null) {
            return buyerRepository.searchBuyers(tenantId, cleanSearch, cleanStatus, cleanType, pageable)
                    .map(BuyerDto::fromEntity);
        } else {
            return buyerRepository.findByTenantIdAndFilters(tenantId, cleanStatus, cleanType, pageable)
                    .map(BuyerDto::fromEntity);
        }
    }

    /**
     * [EN] Fetch active buyers for fast dropdown selectors
     * [BN] ড্রপডাউন নির্বাচনের জন্য সক্রিয় বায়ারদের দ্রুত তালিকা
     */
    @Transactional(readOnly = true)
    public List<BuyerDto> getActiveBuyers() {
        UUID tenantId = resolveTenantId();
        return buyerRepository.findByTenantIdAndStatusAndDeletedAtIsNullOrderByBuyerNameAsc(tenantId, "ACTIVE")
                .stream()
                .map(BuyerDto::fromEntity)
                .toList();
    }

    /**
     * [EN] Fetch single buyer by ID with its brand portfolio
     * [BN] আইডি দ্বারা একক বায়ার ও তার ব্র্যান্ড পোর্টফোলিও প্রাপ্তি
     */
    @Transactional(readOnly = true)
    public BuyerDto getBuyerById(UUID id) {
        UUID tenantId = resolveTenantId();
        Buyer buyer = buyerRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with ID: " + id));
        return BuyerDto.fromEntity(buyer, true);
    }

    /**
     * [EN] Create a new global buyer with atomic auto-code (Rule 24)
     * [BN] স্বয়ংক্রিয় ইউনিক কোডসহ নতুন বায়ার নিবন্ধন (রুল ২৪)
     */
    @Transactional
    public BuyerDto createBuyer(CreateBuyerRequest request) {
        UUID tenantId = resolveTenantId();
        String actor = SecurityUtils.resolveCurrentUsername();

        if (buyerRepository.existsByTenantIdAndBuyerNameIgnoreCaseAndDeletedAtIsNull(tenantId, request.getBuyerName())) {
            throw new BusinessException("A buyer with the name '" + request.getBuyerName() + "' already exists");
        }

        String code = request.getBuyerCode();
        if (code == null || code.trim().isEmpty()) {
            code = codeGeneratorService.generateNextCode(tenantId, EntityTypeCode.BUYER);
        } else {
            code = code.trim().toUpperCase();
            if (buyerRepository.existsByTenantIdAndBuyerCodeAndDeletedAtIsNull(tenantId, code)) {
                throw new BusinessException("Buyer code '" + code + "' is already assigned");
            }
        }

        Buyer buyer = new Buyer();
        buyer.setTenantId(tenantId);
        buyer.setBuyerCode(code);
        buyer.setBuyerName(request.getBuyerName().trim());
        buyer.setShortName(request.getShortName());
        buyer.setBuyerType(request.getBuyerType());
        buyer.setCommissionPercentage(request.getCommissionPercentage() != null ? request.getCommissionPercentage() : BigDecimal.ZERO);
        buyer.setCountryOfOrigin(request.getCountryOfOrigin().trim());
        buyer.setHeadquartersAddress(request.getHeadquartersAddress());
        buyer.setContactPersonName(request.getContactPersonName());
        buyer.setContactEmail(request.getContactEmail());
        buyer.setContactPhone(request.getContactPhone());
        buyer.setDefaultCurrency(request.getDefaultCurrency().toUpperCase());
        buyer.setPaymentTerms(request.getPaymentTerms());
        buyer.setCreditPeriodDays(request.getCreditPeriodDays());
        buyer.setComplianceStatus(request.getComplianceStatus());
        buyer.setStatus(request.getStatus());
        buyer.setNotes(request.getNotes());
        buyer.setCreatedBy(actor);
        buyer.setUpdatedBy(actor);

        Buyer saved = buyerRepository.save(buyer);
        log.info("[Domain-01] Created Buyer: {} ({}) for Tenant: {}", saved.getBuyerName(), saved.getBuyerCode(), tenantId);
        return BuyerDto.fromEntity(saved, false);
    }

    /**
     * [EN] Update existing buyer commercial profile
     * [BN] বিদ্যমান বায়ারের বাণিজ্যিক প্রোফাইল হালনাগাদ
     */
    @Transactional
    public BuyerDto updateBuyer(UUID id, UpdateBuyerRequest request) {
        UUID tenantId = resolveTenantId();
        String actor = SecurityUtils.resolveCurrentUsername();

        Buyer buyer = buyerRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with ID: " + id));

        if (buyerRepository.existsByTenantIdAndBuyerNameIgnoreCaseAndIdNotAndDeletedAtIsNull(tenantId, request.getBuyerName(), id)) {
            throw new BusinessException("Another buyer with the name '" + request.getBuyerName() + "' already exists");
        }

        buyer.setBuyerName(request.getBuyerName().trim());
        buyer.setShortName(request.getShortName());
        buyer.setBuyerType(request.getBuyerType());
        if (request.getCommissionPercentage() != null) {
            buyer.setCommissionPercentage(request.getCommissionPercentage());
        }
        buyer.setCountryOfOrigin(request.getCountryOfOrigin().trim());
        buyer.setHeadquartersAddress(request.getHeadquartersAddress());
        buyer.setContactPersonName(request.getContactPersonName());
        buyer.setContactEmail(request.getContactEmail());
        buyer.setContactPhone(request.getContactPhone());
        buyer.setDefaultCurrency(request.getDefaultCurrency().toUpperCase());
        buyer.setPaymentTerms(request.getPaymentTerms());
        buyer.setCreditPeriodDays(request.getCreditPeriodDays());
        buyer.setComplianceStatus(request.getComplianceStatus());
        buyer.setStatus(request.getStatus());
        buyer.setNotes(request.getNotes());
        buyer.setUpdatedBy(actor);

        Buyer updated = buyerRepository.save(buyer);
        log.info("[Domain-01] Updated Buyer: {} ({}) by {}", updated.getBuyerName(), updated.getBuyerCode(), actor);
        return BuyerDto.fromEntity(updated, false);
    }

    /**
     * [EN] Soft-delete buyer record
     * [BN] বায়ার রেকর্ড সফট ডিলিট
     */
    @Transactional
    public void deleteBuyer(UUID id) {
        UUID tenantId = resolveTenantId();
        String actor = SecurityUtils.resolveCurrentUsername();

        Buyer buyer = buyerRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with ID: " + id));

        buyer.markDeleted(actor);
        buyerRepository.save(buyer);
        log.info("[Domain-01] Soft-deleted Buyer: {} ({}) by {}", buyer.getBuyerName(), buyer.getBuyerCode(), actor);
    }

    /**
     * [EN] List brands under a parent buyer
     * [BN] নির্দিষ্ট বায়ারের অধীনস্থ ব্র্যান্ডসমূহের তালিকা
     */
    @Transactional(readOnly = true)
    public List<BuyerBrandDto> getBrandsByBuyerId(UUID buyerId) {
        UUID tenantId = resolveTenantId();
        return brandRepository.findByTenantIdAndBuyerIdAndDeletedAtIsNull(tenantId, buyerId)
                .stream()
                .map(BuyerBrandDto::fromEntity)
                .toList();
    }

    /**
     * [EN] Add new sub-brand under parent buyer
     * [BN] প্যারেন্ট বায়ারের অধীনে নতুন সাব-ব্র্যান্ড সংযোজন
     */
    @Transactional
    public BuyerBrandDto createBrand(UUID buyerId, CreateBuyerBrandRequest request) {
        UUID tenantId = resolveTenantId();
        String actor = SecurityUtils.resolveCurrentUsername();

        Buyer buyer = buyerRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with ID: " + buyerId));

        if (brandRepository.existsByTenantIdAndBuyerIdAndBrandNameIgnoreCaseAndDeletedAtIsNull(tenantId, buyerId, request.getBrandName())) {
            throw new BusinessException("Brand '" + request.getBrandName() + "' already exists under buyer " + buyer.getBuyerName());
        }

        String brandCode = request.getBrandCode();
        if (brandCode == null || brandCode.trim().isEmpty()) {
            brandCode = codeGeneratorService.generateNextCode(tenantId, EntityTypeCode.BRAND);
        } else {
            brandCode = brandCode.trim().toUpperCase();
            if (brandRepository.existsByTenantIdAndBuyerIdAndBrandCodeAndDeletedAtIsNull(tenantId, buyerId, brandCode)) {
                throw new BusinessException("Brand code '" + brandCode + "' is already assigned under this buyer");
            }
        }

        BuyerBrand brand = new BuyerBrand();
        brand.setTenantId(tenantId);
        brand.setBuyer(buyer);
        brand.setBrandCode(brandCode);
        brand.setBrandName(request.getBrandName().trim());
        brand.setTargetMarket(request.getTargetMarket());
        brand.setSeasonPattern(request.getSeasonPattern());
        brand.setContactPerson(request.getContactPerson());
        brand.setContactEmail(request.getContactEmail());
        brand.setContactPhone(request.getContactPhone());
        brand.setStatus(request.getStatus());
        brand.setNotes(request.getNotes());
        brand.setCreatedBy(actor);
        brand.setUpdatedBy(actor);

        BuyerBrand saved = brandRepository.save(brand);
        log.info("[Domain-01] Created Sub-Brand: {} under Buyer: {}", saved.getBrandName(), buyer.getBuyerName());
        return BuyerBrandDto.fromEntity(saved);
    }

    /**
     * [EN] Update sub-brand details
     * [BN] সাব-ব্র্যান্ড বিবরণ হালনাগাদ
     */
    @Transactional
    public BuyerBrandDto updateBrand(UUID buyerId, UUID brandId, UpdateBuyerBrandRequest request) {
        UUID tenantId = resolveTenantId();
        String actor = SecurityUtils.resolveCurrentUsername();

        BuyerBrand brand = brandRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + brandId));

        if (!brand.getBuyer().getId().equals(buyerId)) {
            throw new BusinessException("Brand does not belong to the specified buyer");
        }

        if (brandRepository.existsByTenantIdAndBuyerIdAndBrandNameIgnoreCaseAndIdNotAndDeletedAtIsNull(
                tenantId, buyerId, request.getBrandName(), brandId)) {
            throw new BusinessException("Another brand with the name '" + request.getBrandName() + "' already exists under this buyer");
        }

        brand.setBrandName(request.getBrandName().trim());
        brand.setTargetMarket(request.getTargetMarket());
        brand.setSeasonPattern(request.getSeasonPattern());
        brand.setContactPerson(request.getContactPerson());
        brand.setContactEmail(request.getContactEmail());
        brand.setContactPhone(request.getContactPhone());
        brand.setStatus(request.getStatus());
        brand.setNotes(request.getNotes());
        brand.setUpdatedBy(actor);

        BuyerBrand updated = brandRepository.save(brand);
        log.info("[Domain-01] Updated Sub-Brand: {} by {}", updated.getBrandName(), actor);
        return BuyerBrandDto.fromEntity(updated);
    }

    /**
     * [EN] Soft-delete sub-brand
     * [BN] সাব-ব্র্যান্ড সফট ডিলিট
     */
    @Transactional
    public void deleteBrand(UUID buyerId, UUID brandId) {
        UUID tenantId = resolveTenantId();
        String actor = SecurityUtils.resolveCurrentUsername();

        BuyerBrand brand = brandRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + brandId));

        if (!brand.getBuyer().getId().equals(buyerId)) {
            throw new BusinessException("Brand does not belong to the specified buyer");
        }

        brand.markDeleted(actor);
        brandRepository.save(brand);
        log.info("[Domain-01] Soft-deleted Sub-Brand: {} by {}", brand.getBrandName(), actor);
    }
}
