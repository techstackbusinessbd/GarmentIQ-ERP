package com.garments.erp.user.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.user.dto.CreateUserRequest;
import com.garments.erp.user.dto.UpdateUserRequest;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant User Management REST API Controller
 * [BN] মাল্টি-টেন্যান্ট ব্যবহারকারী ব্যবস্থাপনা রেস্ট এপিআই কন্ট্রোলার
 * =============================================================================
 * [EN] Exposes RESTful CRUD endpoints for enterprise user accounts, profile
 *      updates, role assignments, and soft deletion within tenant boundaries.
 * [BN] টেন্যান্ট বাউন্ডারির মধ্যে এন্টারপ্রাইজ ব্যবহারকারী অ্যাকাউন্ট তৈরি, প্রোফাইল
 *      হালনাগাদ, রোল বরাদ্দ এবং সফট-ডিলিটের জন্য রেস্টফুল এপিআই এন্ডপয়েন্ট সরবরাহ করে।
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param userService [EN] User management business service / [BN] ইউজার ম্যানেজমেন্ট বিজনেস সার্ভিস
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * [EN] Retrieves all active users belonging to the current tenant organization
     * [BN] বর্তমান টেন্যান্টের আওতাধীন সকল সক্রিয় ব্যবহারকারীর তালিকা ফেরত দেয়
     *
     * @return [EN] API response with user list / [BN] ব্যবহারকারী তালিকার এপিআই রেসপন্স
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
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
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}
