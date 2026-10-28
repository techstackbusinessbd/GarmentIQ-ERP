package com.garments.erp.auth.controller;

import com.garments.erp.auth.dto.PermissionDto;
import com.garments.erp.auth.service.PermissionService;
import com.garments.erp.core.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * =============================================================================
 * [EN] Functional Permissions Catalog REST Controller
 * [BN] ফাংশনাল পারমিশন ক্যাটালগ রেস্ট কন্ট্রোলার
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ফ্রন্টএন্ড প্রিভিলেজ ম্যাট্রিক্সের জন্য ডাটাবেজ থেকে সরাসরি পারমিশন লিস্ট প্রদান করে।
 */
@RestController
@RequestMapping("/api/v1/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    /**
     * [EN] Retrieves all system permissions dynamically from PostgreSQL
     * [BN] ডাটাবেজ থেকে সমস্ত সিস্টেম পারমিশন ডায়নামিকালি রিটার্ন করে
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionDto>>> getAllPermissions() {
        List<PermissionDto> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success(permissions, "Permissions retrieved successfully"));
    }

    /**
     * [EN] Retrieves dynamic hierarchical permission matrix catalog grouped by domain and module
     * [BN] ডোমেন ও মডিউল অনুযায়ী গ্রুপ করা হায়ারার্কিক্যাল প্রিভিলেজ ক্যাটালগ রিটার্ন করে
     */
    @GetMapping("/catalog")
    public ResponseEntity<ApiResponse<List<com.garments.erp.auth.dto.MatrixDomainDto>>> getPermissionCatalog(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String domain
    ) {
        List<com.garments.erp.auth.dto.MatrixDomainDto> catalog = permissionService.getPermissionCatalog(domain);
        return ResponseEntity.ok(ApiResponse.success(catalog, "Permission catalog retrieved successfully"));
    }
}

