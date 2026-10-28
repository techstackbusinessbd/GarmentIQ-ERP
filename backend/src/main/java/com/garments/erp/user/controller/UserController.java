package com.garments.erp.user.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.core.security.CustomUserPrincipal;
import com.garments.erp.user.dto.AdminResetPasswordRequest;
import com.garments.erp.user.dto.ChangePasswordRequest;
import com.garments.erp.user.dto.CreateUserRequest;
import com.garments.erp.user.dto.UpdateUserRequest;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.dto.UpdateUserCustomPermissionsRequest;
import com.garments.erp.user.dto.UserCustomPermissionDto;
import com.garments.erp.user.service.UserCustomPermissionService;
import com.garments.erp.user.service.UserPasswordService;
import com.garments.erp.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserCustomPermissionService customPermissionService;
    private final UserPasswordService userPasswordService;

    public UserController(UserService userService,
                          UserCustomPermissionService customPermissionService,
                          UserPasswordService userPasswordService) {
        this.userService = userService;
        this.customPermissionService = customPermissionService;
        this.userPasswordService = userPasswordService;
    }

    /**
     * [EN] Retrieves all active (or optionally all including soft-deleted) users
     * [BN] বর্তমান টেন্যান্টের আওতাধীন সক্রিয় (বা ঐচ্ছিকভাবে ডিলিটসহ) ব্যবহারকারীদের তালিকা ফেরত দেয়
     *
     * @param includeDeleted [EN] Include soft-deleted accounts / [BN] ডিলিটকৃত অ্যাকাউন্ট অন্তর্ভুক্ত করবেন কি না
     * @return [EN] API response with user list / [BN] ব্যবহারকারী তালিকার এপিআই রেসপন্স
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeleted) {
        List<UserDto> users = userService.getAllUsers(includeDeleted);
        return ResponseEntity.ok(ApiResponse.success(users, "Users retrieved successfully"));
    }

    /**
     * [EN] Retrieves specific user profile by UUID strictly within current tenant
     * [BN] বর্তমান টেন্যান্টের অধীনে আইডি দ্বারা নির্দিষ্ট ব্যবহারকারীর প্রোফাইল প্রদান করে
     *
     * @param id [EN] User UUID / [BN] ইউজারের ইউনিক আইডি
     * @return [EN] API response with user profile / [BN] ইউজার প্রোফাইল রেসপন্স
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable UUID id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user, "User profile retrieved successfully"));
    }

    /**
     * [EN] Provisions a new user account with credentials and assigned roles
     * [BN] নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি ও রোল বরাদ্দ করে
     *
     * @param request [EN] Validated user creation payload / [BN] নতুন ইউজারের তথ্য
     * @return [EN] API response with created user profile / [BN] তৈরি হওয়া ইউজার রেসপন্স
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "User created successfully"));
    }

    /**
     * [EN] Modifies an existing user profile and role associations
     * [BN] বিদ্যমান ব্যবহারকারীর প্রোফাইল তথ্য এবং রোল বরাদ্দ হালনাগাদ করে
     *
     * @param id      [EN] User UUID / [BN] ইউজারের ইউনিক আইডি
     * @param request [EN] Validated update payload / [BN] হালনাগাদকৃত তথ্য
     * @return [EN] API response with updated user profile / [BN] পরিবর্তিত ইউজার রেসপন্স
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDto updated = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "User updated successfully"));
    }

    /**
     * [EN] Performs safe soft deletion of a user account preserving audit logs
     * [BN] অডিট লগ বজায় রেখে ব্যবহারকারীর নিরাপদ সফট-ডিলিট সম্পন্ন করে
     *
     * @param id [EN] User UUID / [BN] ইউজারের ইউনিক আইডি
     * @return [EN] Empty success API response / [BN] সফলতার বার্তা রেসপন্স
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User moved to trash successfully"));
    }

    /**
     * [EN] Restores a soft-deleted user account back to active status
     * [BN] সফট-ডিলিটকৃত ব্যবহারকারী অ্যাকাউন্ট পুনরায় সক্রিয় অবস্থায় ফিরিয়ে আনে
     *
     * @param id [EN] User UUID / [BN] ইউজারের ইউনিক আইডি
     * @return [EN] API response with restored user profile / [BN] রিস্টোরকৃত ইউজার প্রোফাইল রেসপন্স
     */
    @PostMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('USER:RESTORE') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> restoreUser(@PathVariable UUID id) {
        UserDto restored = userService.restoreUser(id);
        return ResponseEntity.ok(ApiResponse.success(restored, "User account restored successfully"));
    }

    /**
     * [EN] Permanently purges a soft-deleted user account from database
     * [BN] ট্র্যাশ থেকে ব্যবহারকারী অ্যাকাউন্ট চিরতরে ডেটাবেজ থেকে মুছে ফেলে
     *
     * @param id [EN] User UUID / [BN] ইউজারের ইউনিক আইডি
     * @return [EN] Empty success API response / [BN] সফলতার বার্তা রেসপন্স
     */
    @DeleteMapping("/{id}/purge")
    @PreAuthorize("hasAuthority('USER:PURGE') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> purgeUser(@PathVariable UUID id) {
        userService.purgeUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User permanently purged successfully"));
    }

    /**
     * [EN] Unlocks a locked user account and clears failed attempt history
     * [BN] লক হওয়া অ্যাকাউন্ট আনলক করে এবং ব্যর্থ লগইন প্রচেষ্টা রিসেট করে
     *
     * @param id [EN] User UUID / [BN] ইউজারের ইউনিক আইডি
     * @return [EN] API response with unlocked user / [BN] আনলককৃত ইউজারের রেসপন্স
     */
    @PostMapping("/{id}/unlock")
    public ResponseEntity<ApiResponse<UserDto>> unlockUser(@PathVariable UUID id) {
        UserDto unlocked = userService.unlockUser(id);
        return ResponseEntity.ok(ApiResponse.success(unlocked, "User account unlocked successfully"));
    }

    /**
     * [EN] Retrieves direct custom permission overrides assigned to target user
     * [BN] ব্যবহারকারীকে নির্ধারিত সমস্ত কাস্টম পারমিশন ওভাররাইড প্রদান করে
     */
    @GetMapping("/{id}/custom-permissions")
    public ResponseEntity<ApiResponse<List<UserCustomPermissionDto>>> getCustomPermissions(@PathVariable UUID id) {
        List<UserCustomPermissionDto> perms = customPermissionService.getCustomPermissions(id);
        return ResponseEntity.ok(ApiResponse.success(perms, "User custom permissions retrieved successfully"));
    }

    /**
     * [EN] Updates direct custom permission overrides for target user
     * [BN] ব্যবহারকারীর কাস্টম পারমিশন তালিকা বাল্ক আপডেট করে
     */
    @PutMapping("/{id}/custom-permissions")
    public ResponseEntity<ApiResponse<List<UserCustomPermissionDto>>> updateCustomPermissions(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserCustomPermissionsRequest request) {
        List<UserCustomPermissionDto> updated = customPermissionService.updateCustomPermissions(id, request.getPermissions());
        return ResponseEntity.ok(ApiResponse.success(updated, "User custom permissions updated successfully"));
    }

    /**
     * [EN] Admin resets target user's password with optional account unlock
     * [BN] অ্যাডমিন কর্তৃক নির্দিষ্ট ইউজারের পাসওয়ার্ড রিসেট ও আনলক সম্পন্ন করে
     */
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<UserDto>> resetPassword(
            @PathVariable UUID id,
            @Valid @RequestBody AdminResetPasswordRequest request) {
        UserDto updated = userPasswordService.resetPasswordByAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Password reset successfully"));
    }

    /**
     * [EN] Authenticated employee changes their own password
     * [BN] লগইনকৃত ব্যবহারকারী কর্তৃক নিজ পাসওয়ার্ড পরিবর্তন
     */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userPasswordService.changeOwnPassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }
}
