package com.garments.erp.tenant.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.tenant.dto.CreateTenantRequest;
import com.garments.erp.tenant.dto.TenantDto;
import com.garments.erp.tenant.dto.UpdateTenantRequest;
import com.garments.erp.tenant.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Client Organization REST Controller (TenantController)
 * [BN] মাল্টি-টেন্যান্ট ক্লায়েন্ট প্রতিষ্ঠান রেস্ট কন্ট্রোলার (TenantController) (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Exposes REST endpoints for client tenant onboarding, listing, and updates.
 *      Exclusively restricted to Platform Super Admin authority.
 * [BN] ক্লায়েন্ট গার্মেন্টস কারখানা অনবোর্ডিং, তালিকা এবং প্রোফাইল হালনাগাদের এপিআই।
 *      শুধুমাত্র প্ল্যাটফর্ম সুপার অ্যাডমিনের জন্য সংরক্ষিত।
 */
@RestController
@RequestMapping("/api/v1/tenants")
@PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    /**
     * [EN] Retrieves list of all active client factory tenants (or all including soft-deleted)
     * [BN] সকল সক্রিয় ক্লায়েন্ট ফ্যাক্টরি টেন্যান্টের তালিকা (বা ডিলিটকৃতসহ) প্রদান করে
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TenantDto>>> getAllTenants(
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeleted) {
        return ResponseEntity.ok(ApiResponse.success(tenantService.getAllTenants(includeDeleted), "Client tenants retrieved successfully"));
    }

    /**
     * [EN] Generates next atomic unique Client code conforming to CLT-{SEQ:4} (Rule 24)
     * [BN] রুল ২৪ অনুবর্তী CLT-{SEQ:4} ফরম্যাটে পরবর্তী শতভাগ ইউনিক কোম্পানি কোড তৈরি করে
     */
    @GetMapping("/next-code")
    public ResponseEntity<ApiResponse<String>> getNextClientCode() {
        return ResponseEntity.ok(ApiResponse.success(tenantService.generateUniqueTenantCode(), "Next client code generated"));
    }

    /**
     * [EN] Checks whether a subdomain slug is available for cloud deployment
     * [BN] ক্লাউড ডেপ্লয়মেন্টের জন্য সাবডোমেনটি খালি আছে কি না তা যাচাই করে
     */
    @GetMapping("/check-subdomain")
    public ResponseEntity<ApiResponse<Boolean>> checkSubdomainAvailable(@RequestParam String subdomain) {
        boolean available = tenantService.isSubdomainAvailable(subdomain);
        return ResponseEntity.ok(ApiResponse.success(available, available ? "Subdomain is available" : "Subdomain is already registered"));
    }

    /**
     * [EN] Retrieves specific client tenant by UUID
     * [BN] আইডি দিয়ে নির্দিষ্ট ক্লায়েন্ট টেন্যান্টের বিস্তারিত তথ্য প্রদান করে
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantDto>> getTenantById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(tenantService.getTenantById(id), "Client tenant retrieved successfully"));
    }

    /**
     * [EN] Provisions a new client factory tenant organization
     * [BN] নতুন ক্লায়েন্ট গার্মেন্টস কারখানা নিবন্ধন করে
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TenantDto>> createTenant(@Valid @RequestBody CreateTenantRequest request) {
        TenantDto created = tenantService.createTenant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Client tenant registered successfully"));
    }

    /**
     * [EN] Updates existing client factory tenant profile details
     * [BN] বিদ্যমান ক্লায়েন্ট কারখানা টেন্যান্টের তথ্য হালনাগাদ করে
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantDto>> updateTenant(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTenantRequest request) {
        return ResponseEntity.ok(ApiResponse.success(tenantService.updateTenant(id, request), "Client tenant updated successfully"));
    }

    /**
     * [EN] Soft-deletes a client factory tenant
     * [BN] ক্লায়েন্ট ফ্যাক্টরি টেন্যান্টের নিরাপদ সফট-ডিলিট সম্পন্ন করে
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTenant(@PathVariable UUID id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Client tenant moved to trash successfully"));
    }

    /**
     * [EN] Restores a soft-deleted client factory tenant
     * [BN] সফট-ডিলিটকৃত ক্লায়েন্ট ফ্যাক্টরি টেন্যান্ট পুনরায় সক্রিয় করে
     */
    @PostMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('TENANT:RESTORE') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TenantDto>> restoreTenant(@PathVariable UUID id) {
        TenantDto restored = tenantService.restoreTenant(id);
        return ResponseEntity.ok(ApiResponse.success(restored, "Client tenant restored successfully"));
    }

    /**
     * [EN] Permanently purges a client factory tenant from database
     * [BN] ট্র্যাশ থেকে ক্লায়েন্ট ফ্যাক্টরি টেন্যান্ট চিরতরে ডেটাবেজ থেকে মুছে ফেলে
     */
    @DeleteMapping("/{id}/purge")
    @PreAuthorize("hasAuthority('TENANT:PURGE') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> purgeTenant(@PathVariable UUID id) {
        tenantService.purgeTenant(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Client tenant permanently purged successfully"));
    }
}
