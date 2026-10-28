package com.garments.erp.auth.controller;

import com.garments.erp.auth.dto.CreateRoleRequest;
import com.garments.erp.auth.dto.RoleDto;
import com.garments.erp.auth.dto.UpdateRoleRequest;
import com.garments.erp.auth.service.RoleService;
import com.garments.erp.core.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * =============================================================================
 * [EN] Multi-Tenant Role & Privilege Management REST Controller
 * [BN] মাল্টি-টেন্যান্ট রোল ও প্রিভিলেজ ব্যবস্থাপনা রেস্ট কন্ট্রোলার
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Validation)
 * [BN] ডাটাবেজ থেকে রোল ও পারমিশন কোড রিটার্ন, সৃষ্টি, আপডেট ও অপসারণের এপিআই সরবরাহ করে।
 */
@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * [EN] Retrieves all active system and tenant roles (or all including deleted)
     * [BN] সক্রিয় সমস্ত সিস্টেম ও টেন্যান্ট রোলের তালিকা (বা ডিলিটকৃতসহ) প্রদান করে
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleDto>>> getRoles(
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeleted) {
        List<RoleDto> roles = roleService.getRoles(includeDeleted);
        return ResponseEntity.ok(ApiResponse.success(roles, "Roles retrieved successfully"));
    }

    /**
     * [EN] Retrieves specific role by standard role code
     * [BN] স্ট্যান্ডার্ড রোল কোড দিয়ে নির্দিষ্ট রোলের তথ্য প্রদান করে
     */
    @GetMapping("/{roleCode}")
    public ResponseEntity<ApiResponse<RoleDto>> getRoleByCode(@PathVariable String roleCode) {
        RoleDto role = roleService.getRoleByCode(roleCode);
        return ResponseEntity.ok(ApiResponse.success(role, "Role retrieved successfully"));
    }

    /**
     * [EN] Creates a new custom enterprise role
     * [BN] কারখানার জন্য নতুন কাস্টম এন্টারপ্রাইজ রোল তৈরি করে (রুল ২৫)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RoleDto>> createRole(@Valid @RequestBody CreateRoleRequest request) {
        RoleDto created = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Enterprise role created successfully"));
    }

    /**
     * [EN] Updates an existing custom role title, description, and permissions
     * [BN] বিদ্যমান রোলের নাম, বিবরণ ও পারমিশন হালনাগাদ করে
     */
    @PutMapping("/{roleCode}")
    public ResponseEntity<ApiResponse<RoleDto>> updateRole(
            @PathVariable String roleCode,
            @Valid @RequestBody UpdateRoleRequest request) {
        RoleDto updated = roleService.updateRole(roleCode, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Enterprise role updated successfully"));
    }

    /**
     * [EN] Soft-deletes a custom role (protected from system roles and assigned users)
     * [BN] কাস্টম এন্টারপ্রাইজ রোল সফট-ডিলিট করে
     */
    @DeleteMapping("/{roleCode}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable String roleCode) {
        roleService.deleteRole(roleCode);
        return ResponseEntity.ok(ApiResponse.success(null, "Enterprise role moved to trash successfully"));
    }

    /**
     * [EN] Restores a soft-deleted custom role
     * [BN] সফট-ডিলিটকৃত কাস্টম রোল পুনরায় সক্রিয় করে
     */
    @PostMapping("/{roleCode}/restore")
    @PreAuthorize("hasAuthority('ROLE:RESTORE') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RoleDto>> restoreRole(@PathVariable String roleCode) {
        RoleDto restored = roleService.restoreRole(roleCode);
        return ResponseEntity.ok(ApiResponse.success(restored, "Enterprise role restored successfully"));
    }

    /**
     * [EN] Permanently purges a soft-deleted custom role from database
     * [BN] ট্র্যাশ থেকে কাস্টম রোল চিরতরে মুছে ফেলে
     */
    @DeleteMapping("/{roleCode}/purge")
    @PreAuthorize("hasAuthority('ROLE:PURGE') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> purgeRole(@PathVariable String roleCode) {
        roleService.purgeRole(roleCode);
        return ResponseEntity.ok(ApiResponse.success(null, "Enterprise role permanently purged successfully"));
    }

    /**
     * [EN] Retrieves assigned permission codes for a role directly from PostgreSQL
     * [BN] ডাটাবেজ থেকে সরাসরি নির্দিষ্ট রোলের পারমিশন কোড রিটার্ন করে
     */
    @GetMapping("/{roleCode}/permissions")
    public ResponseEntity<ApiResponse<Set<String>>> getRolePermissions(@PathVariable String roleCode) {
        Set<String> permissions = roleService.getRolePermissions(roleCode);
        return ResponseEntity.ok(ApiResponse.success(permissions, "Role permissions retrieved successfully"));
    }

    /**
     * [EN] Updates assigned permissions for a role in PostgreSQL role_permissions table
     * [BN] ডাটাবেজের role_permissions টেবিলে রোলের পারমিশন ডায়নামিকালি সেভ করে
     */
    @PutMapping("/{roleCode}/permissions")
    public ResponseEntity<ApiResponse<Set<String>>> updateRolePermissions(
            @PathVariable String roleCode,
            @RequestBody Set<String> permissionCodes) {
        Set<String> updated = roleService.updateRolePermissions(roleCode, permissionCodes);
        return ResponseEntity.ok(ApiResponse.success(updated, "Role permissions updated successfully"));
    }
}
