package com.garments.erp.auth.controller;

import com.garments.erp.auth.dto.LoginRequest;
import com.garments.erp.auth.dto.LoginResponse;
import com.garments.erp.auth.dto.RefreshTokenRequest;
import com.garments.erp.auth.service.AuthService;
import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.user.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * =============================================================================
 * [EN] User Authentication and Token Management REST API Controller
 * [BN] ব্যবহারকারী অথেনটিকেশন ও টোকেন ব্যবস্থাপনা রেস্ট এপিআই কন্ট্রোলার
 * =============================================================================
 * [EN] Provides public endpoints for corporate user login (/api/v1/auth/login),
 *      silent token refreshing (/api/v1/auth/refresh), and active user profile
 *      retrieval (/api/v1/auth/me) for the frontend authentication stores.
 * [BN] করপোরেট ইউজার লগইন (/api/v1/auth/login), সাইলেন্ট টোকেন নবায়ন (/api/v1/auth/refresh)
 *      এবং বর্তমান ইউজারের প্রোফাইল তথ্য (/api/v1/auth/me) পাওয়ার জন্য এপিআই সরবরাহ করে।
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param authService [EN] Authentication business service / [BN] অথেনটিকেশন বিজনেস সার্ভিস
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * [EN] Public login endpoint authenticating username/password credentials
     * [BN] পাবলিক লগইন এন্ডপয়েন্ট—ইউজারনেম ও পাসওয়ার্ড যাচাই করে জেডব্লিউটি প্রদান করে
     *
     * @param request [EN] Validated login request / [BN] যাচাইকৃত লগইন রিকোয়েস্ট
     * @return [EN] API response with JWT and user profile / [BN] টোকেন ও প্রোফাইলসহ রেসপন্স
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "X-Tenant-Subdomain", required = false) String subdomainHeader
    ) {
        LoginResponse response = authService.login(request, subdomainHeader);
        return ResponseEntity.ok(ApiResponse.success(response, "Login authenticated successfully"));
    }

    /**
     * [EN] Silent token refresh endpoint extending user session without re-login
     * [BN] সাইলেন্ট টোকেন রিফ্রেশ এন্ডপয়েন্ট—পুনরায় লগইন ছাড়াই সেশন নবায়ন করে
     *
     * @param request [EN] Validated refresh token payload / [BN] রিফ্রেশ টোকেন রিকোয়েস্ট
     * @return [EN] API response with fresh JWT pair / [BN] নতুন টোকেনসহ রেসপন্স
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
    }

    /**
     * [EN] Authenticated endpoint retrieving currently logged-in user profile
     * [BN] অথেনটিকেটেড এন্ডপয়েন্ট—বর্তমানে লগইনকৃত ব্যবহারকারীর প্রোফাইল তথ্য প্রদান করে
     *
     * @return [EN] API response containing user profile / [BN] ইউজার প্রোফাইল রেসপন্স
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(currentUser, "User profile retrieved successfully"));
    }
}
