package com.garments.erp.auth.service;

import com.garments.erp.auth.dto.LoginRequest;
import com.garments.erp.auth.dto.LoginResponse;
import com.garments.erp.auth.dto.RefreshTokenRequest;
import com.garments.erp.core.security.CustomUserPrincipal;
import com.garments.erp.core.security.CustomUserDetailsService;
import com.garments.erp.core.security.JwtProperties;
import com.garments.erp.core.security.JwtTokenProvider;
import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.tenant.entity.Tenant;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
import com.garments.erp.settings.service.SystemAuditLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * =============================================================================
 * [EN] Multi-Tenant SaaS Authentication & Token Service (AuthService)
 * [BN] মাল্টি-টেন্যান্ট সাশ অথেনটিকেশন ও টোকেন সার্ভিস (AuthService) (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Supports work email, subdomain workspace routing, lockout & credential disambiguation.
 * [BN] প্রাতিষ্ঠানিক ইমেইল লগইন, সাবডোমেন রাউটিং ও একাধিক কারখানার ইউজারনেম বিরোধ নিরসন করে।
 */
@Slf4j
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final JwtProperties jwtProperties;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final SecuritySettingsService securitySettingsService;
    private final SystemAuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                       JwtProperties jwtProperties, CustomUserDetailsService userDetailsService,
                       UserRepository userRepository, TenantRepository tenantRepository,
                       SecuritySettingsService securitySettingsService, SystemAuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.jwtProperties = jwtProperties;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.securitySettingsService = securitySettingsService;
        this.auditLogService = auditLogService;
    }

    /**
     * [EN] Backward-compatible single-argument login entry point
     * [BN] একক আর্গুমেন্ট বিশিষ্ট ব্যাকওয়ার্ড-কম্প্যাটিবল লগইন এন্ট্রি পয়েন্ট
     */
    public LoginResponse login(LoginRequest request) {
        return login(request, null);
    }

    /**
     * [EN] Authenticates credentials with multi-tenant SaaS resolution and brute-force protection
     * [BN] মাল্টি-টেন্যান্ট সাশ ডোমেন আইসোলেশন ও ব্রুট-ফোর্স লকিং সুবিধাসহ লগইন সম্পাদন
     */
    @Transactional(noRollbackFor = {AuthenticationException.class, BadCredentialsException.class, LockedException.class})
    public LoginResponse login(LoginRequest request, String subdomainHeader) {
        String identifier = request.getUsername() != null ? request.getUsername().trim() : "";
        log.info("Processing SaaS authentication request for: {}", identifier);

        Optional<User> userOpt = resolveUserForLogin(identifier, request.getTenantCode(), subdomainHeader);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getLockedUntil() != null && user.getLockedUntil().isBefore(java.time.Instant.now())) {
                log.info("Lockout expired for user '{}'. Restoring active access.", user.getUsername());
                user.unlockAccount();
                userRepository.save(user);
            } else if (user.isAccountLocked()) {
                log.warn("Login rejected: Account '{}' is currently LOCKED.", user.getUsername());
                throw new LockedException(
                        "Your account has been locked after 5 consecutive failed login attempts. Please contact your factory administrator or try again later."
                );
            }
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            handleFailedAttempt(userOpt, identifier);
            throw ex;
        }

        if (userOpt.isPresent() && userOpt.get().getFailedLoginAttempts() > 0) {
            User user = userOpt.get();
            user.resetFailedAttempts();
            userRepository.save(user);
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        String primaryRole = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .findFirst()
                .orElse("USER");
        auditLogService.record(principal.getTenantId(), principal.getUsername(), primaryRole, "AUTH_EVENT", "LOGIN_SUCCESS", "User: " + principal.getUsername(), "Signed in to workspace", "SUCCESS");
        return createLoginResponse(principal);
    }

    /**
     * [EN] Resolves target user with SaaS corporate email, subdomain or collision check
     * [BN] কর্পোরেট ইমেইল, সাবডোমেন বা বিরোধ যাচাইয়ের মাধ্যমে নির্দিষ্ট ব্যবহারকারী শনাক্তকরণ
     */
    private Optional<User> resolveUserForLogin(String identifier, String tenantCode, String subdomainHeader) {
        String tenantKey = (subdomainHeader != null && !subdomainHeader.isBlank()) ? subdomainHeader.trim() : tenantCode;
        if (tenantKey != null && !tenantKey.isBlank()) {
            Tenant tenant = tenantRepository.findBySubdomainIgnoreCaseAndIsDeletedFalse(tenantKey)
                    .or(() -> tenantRepository.findByTenantCode(tenantKey))
                    .orElseThrow(() -> new BadCredentialsException("Workspace or tenant code '" + tenantKey + "' not found."));
            if (!tenant.isActive()) {
                throw new LockedException("Your factory subscription has been suspended or deactivated. Please contact platform administration.");
            }
            TenantContext.setTenantId(tenant.getId());
            return userRepository.findByTenantIdAndUsernameAndIsDeletedFalse(tenant.getId(), identifier);
        }

        if (identifier.contains("@")) {
            Optional<User> userOpt = userRepository.findByEmailAndIsDeletedFalse(identifier.toLowerCase());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getTenantId() != null) {
                    Tenant tenant = tenantRepository.findById(user.getTenantId()).orElse(null);
                    if (tenant != null && (!tenant.isActive() || tenant.isDeleted())) {
                        throw new LockedException("Your factory organization subscription has been suspended or deactivated.");
                    }
                    TenantContext.setTenantId(user.getTenantId());
                }
            }
            return userOpt;
        }

        if ("superadmin".equalsIgnoreCase(identifier)) {
            return userRepository.findByUsernameAndIsDeletedFalse(identifier);
        }

        long count = userRepository.countByUsernameAndIsDeletedFalse(identifier);
        if (count > 1) {
            throw new BadCredentialsException("Multiple factory accounts found with username '" + identifier + "'. Please sign in with your corporate email address or access via your company subdomain.");
        }
        return userRepository.findByUsernameAndIsDeletedFalse(identifier);
    }

    /**
     * [EN] Handles failed login attempts incrementing counters and enforcing lockout
     * [BN] ভুল পাসওয়ার্ড প্রচেষ্টার হিসাব রাখা এবং ৫ বার ভুলের পর অ্যাকাউন্ট লক করা
     */
    private void handleFailedAttempt(Optional<User> userOpt, String identifier) {
        if (userOpt.isEmpty()) {
            auditLogService.record(null, identifier, "UNKNOWN", "AUTH_EVENT", "LOGIN_FAILED", "User: " + identifier, "User not found", "WARNING");
            return;
        }
        User user = userOpt.get();
        if (user.isSuperAdmin()) {
            auditLogService.record(user.getTenantId(), user.getUsername(), "ROLE_SUPER_ADMIN", "AUTH_EVENT", "LOGIN_FAILED", "User: " + user.getUsername(), "Super Admin invalid password", "WARNING");
            log.warn("Super Admin '{}' failed password check. Lockout bypassed.", user.getUsername());
            throw new BadCredentialsException("Invalid username or password.");
        }
        int maxAttempts = securitySettingsService.getMaxFailedAttempts();
        int lockoutMinutes = securitySettingsService.getLockoutMinutes();
        user.incrementFailedAttempts();
        if (user.getFailedLoginAttempts() >= maxAttempts) {
            user.lockAccount(java.time.Instant.now().plus(java.time.Duration.ofMinutes(lockoutMinutes)));
            userRepository.saveAndFlush(user);
            auditLogService.record(user.getTenantId(), user.getUsername(), "USER", "AUTH_EVENT", "ACCOUNT_LOCKED", "User: " + user.getUsername(), "Account locked after " + maxAttempts + " failed attempts", "CRITICAL");
            log.warn("Account '{}' locked after reaching {} failed attempts.", user.getUsername(), maxAttempts);
            throw new LockedException("Account locked! You entered an incorrect password " + maxAttempts + " times. Your account has been locked for " + lockoutMinutes + " minutes. Please contact your factory administrator.");
        }
        userRepository.saveAndFlush(user);
        int remaining = maxAttempts - user.getFailedLoginAttempts();
        auditLogService.record(user.getTenantId(), user.getUsername(), "USER", "AUTH_EVENT", "LOGIN_FAILED", "User: " + user.getUsername(), "Invalid password (" + user.getFailedLoginAttempts() + "/" + maxAttempts + ")", "WARNING");
        log.warn("Failed login attempt for user '{}' ({}/{}). Remaining: {}", user.getUsername(), user.getFailedLoginAttempts(), maxAttempts, remaining);
        throw new BadCredentialsException("Invalid username or password. " + remaining + " attempts remaining before account lock.");
    }

    private LoginResponse createLoginResponse(CustomUserPrincipal principal) {
        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();
        for (GrantedAuthority authority : principal.getAuthorities()) {
            String authStr = authority.getAuthority();
            if (authStr.startsWith("ROLE_")) roles.add(authStr);
            else permissions.add(authStr);
        }
        String accessToken = tokenProvider.generateAccessToken(principal.getId(), principal.getTenantId(), principal.getUsername(), principal.getEmail(), roles, permissions);
        String refreshToken = tokenProvider.generateRefreshToken(principal.getId(), principal.getUsername());
        return new LoginResponse(accessToken, refreshToken, jwtProperties.getExpirationMs(), buildUserDto(principal, roles, permissions));
    }

    public LoginResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!tokenProvider.validateToken(token)) throw new BadCredentialsException("Invalid or expired refresh token");
        String username = tokenProvider.getUsernameFromToken(token);
        CustomUserPrincipal principal = (CustomUserPrincipal) userDetailsService.loadUserByUsername(username);
        if (!principal.isAccountNonLocked() || !principal.isEnabled()) {
            throw new LockedException("Your account has been locked. You have been logged out.");
        }
        return createLoginResponse(principal);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadCredentialsException("No authenticated user found in current request context");
        }
        User user = userRepository.findWithRolesAndPermissionsByUsername(auth.getName())
                .orElseThrow(() -> new BadCredentialsException("Authenticated user not found in database: " + auth.getName()));
        if (user.isAccountLocked() || user.getStatus() != UserStatus.ACTIVE || user.isDeleted()) {
            throw new LockedException("Your account has been locked. You have been logged out.");
        }
        Set<String> roles = new HashSet<>();
        Set<String> perms = new HashSet<>();
        if (auth.getPrincipal() instanceof CustomUserPrincipal p) {
            for (GrantedAuthority a : p.getAuthorities()) {
                if (a.getAuthority().startsWith("ROLE_")) roles.add(a.getAuthority());
                else perms.add(a.getAuthority());
            }
        }
        UserDto dto = new UserDto(user.getId(), user.getTenantId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getDepartment(), user.getDesignation(), user.getPhone(), user.getStatus());
        dto.setEmployeeCardNo(user.getEmployeeCardNo());

        dto.setRoles(roles);
        dto.setPermissions(perms);

        if (user.getTenantId() != null) {
            tenantRepository.findById(user.getTenantId()).ifPresent(t -> {
                dto.setTenantCode(t.getTenantCode());
                dto.setTenantName(t.getTenantName());
            });
        }
        return dto;
    }

    private UserDto buildUserDto(CustomUserPrincipal p, Set<String> roles, Set<String> perms) {
        User u = userRepository.findById(p.getId()).orElse(null);
        UserDto dto = new UserDto(p.getId(), p.getTenantId(), p.getUsername(), p.getEmail(), p.getFullName(), u != null ? u.getDepartment() : null, u != null ? u.getDesignation() : null, u != null ? u.getPhone() : null, UserStatus.ACTIVE);
        if (u != null) {
            dto.setEmployeeCardNo(u.getEmployeeCardNo());
        }

        dto.setRoles(roles);
        dto.setPermissions(perms);

        if (p.getTenantId() != null) {
            tenantRepository.findById(p.getTenantId()).ifPresent(t -> {
                dto.setTenantCode(t.getTenantCode());
                dto.setTenantName(t.getTenantName());
            });
        }
        return dto;
    }
}
