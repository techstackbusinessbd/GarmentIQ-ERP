package com.garments.erp.master.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.master.dto.MasterDefectCodeDto;
import com.garments.erp.master.dto.MasterSizeDto;
import com.garments.erp.master.dto.MasterUnitDto;
import com.garments.erp.master.service.MasterDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * =============================================================================
 * [EN] Global Master Reference Data REST API Controller
 * [BN] গ্লোবাল মাস্টার রেফারেন্স ডেটা রেস্ট এপিআই কন্ট্রোলার
 * =============================================================================
 * [EN] Exposes public/protected lookup endpoints for garment measurement units,
 *      size breakdown matrices, and quality inspection defect codes.
 * [BN] তৈরি পোশাকের পরিমাপের একক, সাইজ গ্রিড এবং কোয়ালিটি ইন্সপেকশন ডিফেক্ট
 *      কোডের তালিকা পাওয়ার জন্য এপিআই সরবরাহ করে।
 */
@RestController
@RequestMapping("/api/v1/master")
public class MasterDataController {

    private final MasterDataService masterDataService;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param masterDataService [EN] Master data business service / [BN] মাস্টার ডেটা বিজনেস সার্ভিস
     */
    public MasterDataController(MasterDataService masterDataService) {
        this.masterDataService = masterDataService;
    }

    /**
     * [EN] Retrieves measurement units optionally filtered by category
     * [BN] পরিমাপের একক তালিকা প্রদান করে (ঐচ্ছিক ক্যাটাগরি ফিল্টারসহ)
     *
     * @param category [EN] Optional category filter (e.g. FABRIC, GARMENT) / [BN] ক্যাটাগরি ফিল্টার
     * @return [EN] API response containing unit list / [BN] এককের তালিকার এপিআই রেসপন্স
     */
    @GetMapping("/units")
    public ResponseEntity<ApiResponse<List<MasterUnitDto>>> getUnits(
            @RequestParam(required = false) String category) {
        List<MasterUnitDto> units = masterDataService.getUnits(category);
        return ResponseEntity.ok(ApiResponse.success(units, "Measurement units retrieved successfully"));
    }

    /**
     * [EN] Retrieves all garment sizes strictly ordered by display order
     * [BN] ডিসপ্লে অর্ডার অনুযায়ী সাজানো পোশাকের সাইজ গ্রিড প্রদান করে
     *
     * @return [EN] API response containing sorted sizes / [BN] সাইজ তালিকার এপিআই রেসপন্স
     */
    @GetMapping("/sizes")
    public ResponseEntity<ApiResponse<List<MasterSizeDto>>> getSizes() {
        List<MasterSizeDto> sizes = masterDataService.getSizes();
        return ResponseEntity.ok(ApiResponse.success(sizes, "Sizes retrieved successfully"));
    }

    /**
     * [EN] Retrieves quality defect codes optionally filtered by stage
     * [BN] কোয়ালিটি ত্রুটির কোড তালিকা প্রদান করে (ঐচ্ছিক ক্যাটাগরি ফিল্টারসহ)
     *
     * @param category [EN] Optional category filter (e.g. FABRIC, SEWING) / [BN] ক্যাটাগরি ফিল্টার
     * @return [EN] API response containing defect list / [BN] ত্রুটি তালিকার এপিআই রেসপন্স
     */
    @GetMapping("/defect-codes")
    public ResponseEntity<ApiResponse<List<MasterDefectCodeDto>>> getDefectCodes(
            @RequestParam(required = false) String category) {
        List<MasterDefectCodeDto> defects = masterDataService.getDefectCodes(category);
        return ResponseEntity.ok(ApiResponse.success(defects, "Defect codes retrieved successfully"));
    }
}
