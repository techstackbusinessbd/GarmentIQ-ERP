package com.garments.erp.auth.service;

import com.garments.erp.auth.dto.LoginRequest;
import com.garments.erp.auth.dto.LoginResponse;
import com.garments.erp.auth.dto.RefreshTokenRequest;
import com.garments.erp.core.security.CustomUserPrincipal;
import com.garments.erp.core.security.CustomUserDetailsService;
import com.garments.erp.core.security.JwtProperties;
import com.garments.erp.core.security.JwtTokenProvider;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * =============================================================================
 * [EN] User Authentication and Token Management Service
 * [BN] ব্যবহারকারী অথেনটিকেশন ও টোকেন ব্যবস্থাপনা সার্ভিস
 * =============================================================================
 * [EN] Manages user login verification, cryptographic token pair issuance
 *      (access token and refresh token), token renewal, and profile resolution.
 * [BN] ব্যবহারকারীর লগইন যাচাই, ক্রিপ্টোগ্রাফিক টোকেন পেয়ার (এক্সেস ও রিফ্রেশ টোকেন)
 *      ইস্যু করা, টোকেন নবায়ন এবং বর্তমান ইউজারের প্রোফাইল নিশ্চিতকরণ পরিচালনা করে।
 */
@Slf4j
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final JwtProperties jwtProperties;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param authenticationManager [EN] Spring authentication manager / [BN] অথেনটিকেশন ম্যানেজার
     * @param tokenProvider         [EN] JWT token issuance & validation / [BN] জেডব্লিউটি টোকেন প্রোভাইডার
     * @param jwtProperties         [EN] JWT configuration properties / [BN] জেডব্লিউটি কনফিগ প্রোপার্টিজ
     * @param userDetailsService    [EN] User details lookup service / [BN] ইউজার ডিটেইলস সার্ভিস
     * @param userRepository        [EN] User data access repository / [BN] ইউজার ডেটা এক্সেস রিপোজিটরি
     */
    public AuthService(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            JwtProperties jwtProperties,
            CustomUserDetailsService userDetailsService,
            UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.jwtProperties = jwtProperties;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    /**
     * [EN] Authenticates credentials and issues signed access & refresh token pair
     * [BN] ক্রেডেনশিয়াল যাচাই করে এবং সাইন করা এক্সেস ও রিফ্রেশ টোকেন প্রদান করে
     *
     * @param request [EN] Inbound login credentials / [BN] লগইন তথ্য
     * @return [EN] Outbound login response with JWT / [BN] টোকেনসহ লগইন রেসপন্স
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Processing login request for username: {}", request.getUsername());

        // [EN] Authenticate username and password via Spring AuthenticationManager
        // [BN] স্প্রিং AuthenticationManager দিয়ে ইউজারনেম ও পাসওয়ার্ড যাচাই করা
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();

        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        for (GrantedAuthority authority : principal.getAuthorities()) {
            String authStr = authority.getAuthority();
            if (authStr.startsWith("ROLE_")) {
                roles.add(authStr);
            } else {
                permissions.add(authStr);
            }
        }

        // [EN] Mint cryptographically signed access and refresh tokens
        // [BN] ক্রিপ্টোগ্রাফিক এক্সেস এবং রিফ্রেশ টোকেন তৈরি করা হলো
        String accessToken = tokenProvider.generateAccessToken(
                principal.getId(),
                principal.getTenantId(),
                principal.getUsername(),
                principal.getEmail(),
                roles,
                permissions
        );

        String refreshToken = tokenProvider.generateRefreshToken(
                principal.getId(),
                principal.getUsername()
        );

        UserDto userDto = buildUserDto(principal, roles);

        return new LoginResponse(
                accessToken,
                refreshToken,
                jwtProperties.getExpirationMs(),
                userDto
        );
    }

    /**
     * [EN] Renews expired access token using valid cryptographic refresh token
     * [BN] বৈধ রিফ্রেশ টোকেন দিয়ে মেয়াদোত্তীর্ণ এক্সেস টোকেন নবায়ন করে
     *
     * @param request [EN] Refresh token payload / [BN] রিফ্রেশ টোকেন
     * @return [EN] New token response / [BN] নতুন টোকেন রেসপন্স
     */
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        if (!tokenProvider.validateToken(token)) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(token);
        CustomUserPrincipal principal = (CustomUserPrincipal) userDetailsService.loadUserByUsername(username);

        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        for (GrantedAuthority authority : principal.getAuthorities()) {
            String authStr = authority.getAuthority();
            if (authStr.startsWith("ROLE_")) {
                roles.add(authStr);
            } else {
                permissions.add(authStr);
            }
        }

        String newAccessToken = tokenProvider.generateAccessToken(
                principal.getId(),
                principal.getTenantId(),
                principal.getUsername(),
                principal.getEmail(),
                roles,
                permissions
        );

        String newRefreshToken = tokenProvider.generateRefreshToken(
                principal.getId(),
                principal.getUsername()
        );

        UserDto userDto = buildUserDto(principal, roles);

        return new LoginResponse(
                newAccessToken,
                newRefreshToken,
                jwtProperties.getExpirationMs(),
                userDto
        );
    }

    /**
     * [EN] Resolves currently authenticated user profile from SecurityContext
     * [BN] বর্তমান লগইনকৃত ব্যবহারকারীর প্রোফাইল তথ্য উদ্ধার করে
     *
     * @return [EN] UserDto profile / [BN] ব্যবহারকারীর প্রোফাইল
     */
    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadCredentialsException("No authenticated user found in current request context");
        }

        String username = auth.getName();
        User user = userRepository.findWithRolesAndPermissionsByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Authenticated user not found in database: " + username));

        Set<String> roles = new HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(r -> roles.add(r.getRoleCode()));
        }

        UserDto dto = new UserDto(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getDepartment(),
                user.getDesignation(),
                user.getPhone(),
                user.getStatus()
        );
        dto.setRoles(roles);
        return dto;
    }

    /**
     * [EN] Helper method mapping principal to UserDto
     * [BN] প্রিন্সিপাল অবজেক্ট থেকে UserDto তৈরি করার হেল্পার মেথড
     */
    private UserDto buildUserDto(CustomUserPrincipal principal, Set<String> roles) {
        UserDto userDto = new UserDto(
                principal.getId(),
                principal.getTenantId(),
                principal.getUsername(),
                principal.getEmail(),
                principal.getFullName(),
                null,
                null,
                null,
                UserStatus.ACTIVE
        );
        userDto.setRoles(roles);
        return userDto;
    }
}
