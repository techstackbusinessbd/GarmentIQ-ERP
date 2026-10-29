package com.garments.erp.merchandising.buyer.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.core.response.PaginatedResponse;
import com.garments.erp.merchandising.buyer.dto.*;
import com.garments.erp.merchandising.buyer.service.BuyerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Global Buyer & Sub-Brand REST API Controller (BuyerController.java)
 * [BN] বায়ার ও সাব-ব্র্যান্ড রেস্ট এপিআই কন্ট্রোলার (BuyerController.java)
 * =============================================================================
 * [EN] Reference: Domain 01 Merchandising, Rule 08 (Sub-200ms), Rule 25 (Validation)
 * [BN] বায়ার প্রোফাইল ডিরেক্টরি ও সাব-ব্র্যান্ড পোর্টফোলিওর জন্য এন্টারপ্রাইজ এন্ডপয়েন্ট।
 */
@RestController
@RequestMapping("/api/v1/merchandising/buyers")
@RequiredArgsConstructor
public class BuyerController {

    private final BuyerService buyerService;

    /**
     * [EN] Paginated buyer directory with filtering
     * [BN] পেজিনেটেড বায়ার ডিরেক্টরি ও ফিল্টারিং
     */
    @GetMapping
    @PreAuthorize("hasAuthority('BUYER:VIEW') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<BuyerDto>>> getBuyers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String buyerType,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        PaginatedResponse<BuyerDto> result = PaginatedResponse.from(
                buyerService.getBuyers(search, status, buyerType, pageable));
        return ResponseEntity.ok(ApiResponse.success(result, "Buyers fetched successfully"));
    }

    /**
     * [EN] Autocomplete list of active buyers
     * [BN] ড্রপডাউনের জন্য সক্রিয় বায়ারদের তালিকা
     */
    @GetMapping("/active")
    @PreAuthorize("hasAuthority('BUYER:VIEW') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<BuyerDto>>> getActiveBuyers() {
        List<BuyerDto> buyers = buyerService.getActiveBuyers();
        return ResponseEntity.ok(ApiResponse.success(buyers, "Active buyers fetched successfully"));
    }

    /**
     * [EN] Fetch single buyer by ID
     * [BN] একক বায়ার ও ব্র্যান্ড পোর্টফোলিও প্রাপ্তি
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('BUYER:VIEW') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BuyerDto>> getBuyerById(@PathVariable UUID id) {
        BuyerDto buyer = buyerService.getBuyerById(id);
        return ResponseEntity.ok(ApiResponse.success(buyer, "Buyer details fetched successfully"));
    }

    /**
     * [EN] Register a new buyer
     * [BN] নতুন বায়ার তৈরি
     */
    @PostMapping
    @PreAuthorize("hasAuthority('BUYER:CREATE') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BuyerDto>> createBuyer(@Valid @RequestBody CreateBuyerRequest request) {
        BuyerDto created = buyerService.createBuyer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Buyer created successfully"));
    }

    /**
     * [EN] Update existing buyer
     * [BN] বিদ্যমান বায়ার হালনাগাদ
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('BUYER:EDIT') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BuyerDto>> updateBuyer(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBuyerRequest request) {
        BuyerDto updated = buyerService.updateBuyer(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Buyer updated successfully"));
    }

    /**
     * [EN] Soft-delete buyer
     * [BN] বায়ার সফট ডিলিট
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('BUYER:DELETE') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBuyer(@PathVariable UUID id) {
        buyerService.deleteBuyer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Buyer deleted successfully"));
    }

    /**
     * [EN] List sub-brands under parent buyer
     * [BN] প্যারেন্ট বায়ারের অধীনস্থ সাব-ব্র্যান্ড তালিকা
     */
    @GetMapping("/{id}/brands")
    @PreAuthorize("hasAuthority('BRAND:VIEW') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<BuyerBrandDto>>> getBrandsByBuyer(@PathVariable UUID id) {
        List<BuyerBrandDto> brands = buyerService.getBrandsByBuyerId(id);
        return ResponseEntity.ok(ApiResponse.success(brands, "Sub-brands fetched successfully"));
    }

    /**
     * [EN] Add sub-brand to buyer
     * [BN] বায়ারের অধীনস্থ নতুন সাব-ব্র্যান্ড সংযোজন
     */
    @PostMapping("/{id}/brands")
    @PreAuthorize("hasAuthority('BRAND:CREATE') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BuyerBrandDto>> createBrand(
            @PathVariable UUID id,
            @Valid @RequestBody CreateBuyerBrandRequest request) {
        BuyerBrandDto created = buyerService.createBrand(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Brand created successfully"));
    }

    /**
     * [EN] Update sub-brand under buyer
     * [BN] বায়ারের অধীনস্থ সাব-ব্র্যান্ড হালনাগাদ
     */
    @PutMapping("/{id}/brands/{brandId}")
    @PreAuthorize("hasAuthority('BRAND:EDIT') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BuyerBrandDto>> updateBrand(
            @PathVariable UUID id,
            @PathVariable UUID brandId,
            @Valid @RequestBody UpdateBuyerBrandRequest request) {
        BuyerBrandDto updated = buyerService.updateBrand(id, brandId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Brand updated successfully"));
    }

    /**
     * [EN] Delete sub-brand
     * [BN] সাব-ব্র্যান্ড সফট ডিলিট
     */
    @DeleteMapping("/{id}/brands/{brandId}")
    @PreAuthorize("hasAuthority('BRAND:DELETE') or hasRole('ROLE_SUPER_ADMIN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(
            @PathVariable UUID id,
            @PathVariable UUID brandId) {
        buyerService.deleteBrand(id, brandId);
        return ResponseEntity.ok(ApiResponse.success(null, "Brand deleted successfully"));
    }
}
