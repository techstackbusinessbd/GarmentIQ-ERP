package com.garments.erp.merchandising.buyer.service;

import com.garments.erp.core.exception.BusinessException;
import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.core.security.SecurityUtils;
import com.garments.erp.merchandising.buyer.dto.BuyerBrandDto;
import com.garments.erp.merchandising.buyer.dto.CreateBuyerBrandRequest;
import com.garments.erp.merchandising.buyer.dto.UpdateBuyerBrandRequest;
import com.garments.erp.merchandising.buyer.entity.Buyer;
import com.garments.erp.merchandising.buyer.entity.BuyerBrand;
import com.garments.erp.merchandising.buyer.repository.BuyerBrandRepository;
import com.garments.erp.merchandising.buyer.repository.BuyerRepository;
import com.garments.erp.sequence.entity.EntityTypeCode;
import com.garments.erp.sequence.service.DynamicCodeGeneratorService;
import com.garments.erp.settings.service.SystemAuditLogService;
import com.garments.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Buyer Sub-Brand Portfolio Domain Service (BuyerBrandService.java)
 * [BN] বায়ার সাব-ব্র্যান্ড পোর্টফোলিও ডোমেন সার্ভিস (BuyerBrandService.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), OWASP A09 (Audit Logging)
 * [BN] বায়ারের অধীনস্থ সাব-ব্র্যান্ড তৈরি, আপডেট ও অডিট ট্রেইল সংরক্ষণ করে।
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BuyerBrandService {

    private static final UUID DEFAULT_TENANT_ID = UUID.fromString("019472ba-7000-7000-8000-000000000001");

    private final BuyerBrandRepository brandRepository;
    private final BuyerRepository buyerRepository;
    private final DynamicCodeGeneratorService codeGeneratorService;
    private final SystemAuditLogService auditLogService;

    private UUID resolveTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        return (tenantId != null) ? tenantId : DEFAULT_TENANT_ID;
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
     * [EN] Add new sub-brand under parent buyer with audit trail
     * [BN] প্যারেন্ট বায়ারের অধীনে নতুন সাব-ব্র্যান্ড সংযোজন ও অডিট লগ সংরক্ষণ
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

        auditLogService.record(
                tenantId,
                "MERCHANDISING",
                "BRAND_CREATED",
                "Brand: " + saved.getBrandCode(),
                "Created sub-brand: " + saved.getBrandName() + " (" + saved.getBrandCode() + ") under buyer: " + buyer.getBuyerName(),
                "INFO"
        );

        return BuyerBrandDto.fromEntity(saved);
    }

    /**
     * [EN] Update sub-brand details with audit trail
     * [BN] সাব-ব্র্যান্ড বিবরণ হালনাগাদ ও অডিট লগ সংরক্ষণ
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

        auditLogService.record(
                tenantId,
                "MERCHANDISING",
                "BRAND_UPDATED",
                "Brand: " + updated.getBrandCode(),
                "Updated sub-brand profile: " + updated.getBrandName() + " (" + updated.getBrandCode() + ")",
                "INFO"
        );

        return BuyerBrandDto.fromEntity(updated);
    }

    /**
     * [EN] Soft-delete sub-brand with audit trail
     * [BN] সাব-ব্র্যান্ড সফট ডিলিট ও অডিট লগ সংরক্ষণ
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

        auditLogService.record(
                tenantId,
                "MERCHANDISING",
                "BRAND_DELETED",
                "Brand: " + brand.getBrandCode(),
                "Soft-deleted sub-brand: " + brand.getBrandName() + " (" + brand.getBrandCode() + ") under buyer: " + brand.getBuyer().getBuyerName(),
                "WARNING"
        );
    }
}
