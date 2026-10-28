package com.garments.erp.library.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.library.dto.CreateMasterLibraryEntryRequest;
import com.garments.erp.library.dto.MasterLibraryEntryDto;
import com.garments.erp.library.dto.UpdateMasterLibraryEntryRequest;
import com.garments.erp.library.service.MasterLibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Master Library Domain REST API Controller (Rule 12 & ADR-015)
 * [BN] মাস্টার লাইব্রেরি ডোমেন রেস্ট এপিআই কন্ট্রোলার
 * =============================================================================
 * [EN] Exposes RESTful endpoints for 9 business domains master catalog data.
 * [BN] পোশাক শিল্পের ৯টি ডোমেনের মাস্টার রেফারেন্স ডেটা পরিচালনার জন্য এপিআই সরবরাহ করে।
 */
@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
public class MasterLibraryController {

    private final MasterLibraryService service;

    /**
     * [EN] Get all entries for a specific domain
     * [BN] নির্দিষ্ট ডোমেনের সকল এন্ট্রি প্রদান করে
     */
    @GetMapping("/domains/{domainCode}")
    public ResponseEntity<ApiResponse<List<MasterLibraryEntryDto>>> getDomainEntries(
            @PathVariable String domainCode,
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<MasterLibraryEntryDto> entries = service.getDomainEntries(domainCode, activeOnly);
        return ResponseEntity.ok(ApiResponse.success(entries, "Domain entries retrieved successfully"));
    }

    /**
     * [EN] Get entries for a specific entity type within a domain
     * [BN] ডোমেনের নির্দিষ্ট এনটিটি টাইপের এন্ট্রি তালিকা
     */
    @GetMapping("/domains/{domainCode}/entities/{entityType}")
    public ResponseEntity<ApiResponse<List<MasterLibraryEntryDto>>> getEntityEntries(
            @PathVariable String domainCode,
            @PathVariable String entityType,
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<MasterLibraryEntryDto> entries = service.getEntityEntries(domainCode, entityType, activeOnly);
        return ResponseEntity.ok(ApiResponse.success(entries, "Entity entries retrieved successfully"));
    }

    /**
     * [EN] Get entry by ID
     * [BN] আইডি দ্বারা নির্দিষ্ট এন্ট্রি সংগ্রহ
     */
    @GetMapping("/entries/{id}")
    public ResponseEntity<ApiResponse<MasterLibraryEntryDto>> getEntryById(@PathVariable UUID id) {
        MasterLibraryEntryDto entry = service.getEntryById(id);
        return ResponseEntity.ok(ApiResponse.success(entry, "Entry retrieved successfully"));
    }

    /**
     * [EN] Create new master library entry
     * [BN] নতুন মাস্টার লাইব্রেরি এন্ট্রি তৈরি
     */
    @PostMapping("/entries")
    public ResponseEntity<ApiResponse<MasterLibraryEntryDto>> createEntry(
            @Valid @RequestBody CreateMasterLibraryEntryRequest request) {
        MasterLibraryEntryDto created = service.createEntry(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Master library entry created successfully"));
    }

    /**
     * [EN] Update existing master library entry
     * [BN] বিদ্যমান মাস্টার লাইব্রেরি এন্ট্রি আপডেট
     */
    @PutMapping("/entries/{id}")
    public ResponseEntity<ApiResponse<MasterLibraryEntryDto>> updateEntry(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMasterLibraryEntryRequest request) {
        MasterLibraryEntryDto updated = service.updateEntry(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Master library entry updated successfully"));
    }

    /**
     * [EN] Toggle active status of entry
     * [BN] এন্ট্রির স্ট্যাটাস টগল
     */
    @PatchMapping("/entries/{id}/toggle-status")
    public ResponseEntity<ApiResponse<MasterLibraryEntryDto>> toggleStatus(@PathVariable UUID id) {
        MasterLibraryEntryDto updated = service.toggleStatus(id);
        return ResponseEntity.ok(ApiResponse.success(updated, "Status updated successfully"));
    }

    /**
     * [EN] Delete master library entry
     * [BN] মাস্টার লাইব্রেরি এন্ট্রি অপসারণ
     */
    @DeleteMapping("/entries/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEntry(@PathVariable UUID id) {
        service.deleteEntry(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Master library entry deleted successfully"));
    }
}
