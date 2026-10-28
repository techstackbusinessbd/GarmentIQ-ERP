package com.garments.erp.core.security;

import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.tenant.entity.Tenant;
import com.garments.erp.tenant.repository.TenantRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant SaaS Gateway & JWT Authentication Filter
 * [BN] মাল্টি-টেন্যান্ট সাশ গেটওয়ে ও জেডব্লিউটি অথেনটিকেশন ফিল্টার (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Intercepts requests for subdomain resolution, JWT validation, tenant license
 *      enforcement, and request-lifetime thread-local TenantContext lifecycle.
 * [BN] সাবডোমেন হেডার যাচাই, টেন্যান্ট লাইসেন্স সক্রিয়তা পরীক্ষা ও থ্রেড-লোকাল কনটেক্সট পরিচালনা করে।
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final TenantRepository tenantRepository;

    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            CustomUserDetailsService userDetailsService,
            TenantRepository tenantRepository) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.tenantRepository = tenantRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // [EN] Resolve tenant from subdomain or X-Tenant-ID header for inbound/public routes
            // [BN] সাবডোমেন অথবা X-Tenant-ID হেডার থেকে টেন্যান্ট কনটেক্সট নির্ধারণ
            String subdomain = request.getHeader("X-Tenant-Subdomain");
            if (StringUtils.hasText(subdomain)) {
                tenantRepository.findBySubdomainIgnoreCaseAndIsDeletedFalse(subdomain.trim())
                        .ifPresent(t -> TenantContext.setTenantId(t.getId()));
            } else {
                String tenantIdHeader = request.getHeader("X-Tenant-ID");
                if (StringUtils.hasText(tenantIdHeader)) {
                    try {
                        TenantContext.setTenantId(UUID.fromString(tenantIdHeader.trim()));
                    } catch (IllegalArgumentException ignored) {}
                }
            }

            String jwt = resolveToken(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);
                UUID tenantId = tokenProvider.getTenantIdFromToken(jwt);

                // [EN] Set verified tenant identifier from cryptographic JWT claim
                // [BN] ক্রিপ্টোগ্রাফিক টোকেনের ক্লেইম থেকে যাচাইকৃত টেন্যান্ট আইডি কনটেক্সটে সেট করা
                if (tenantId != null) {
                    TenantContext.setTenantId(tenantId);

                    // [EN] SaaS License Enforcer: Verify tenant active subscription status
                    // [BN] সাশ লাইসেন্স প্রয়োগ: কারখানার সক্রিয় সাবস্ক্রিপশন স্ট্যাটাস নিশ্চিতকরণ
                    Tenant tenant = tenantRepository.findById(tenantId).orElse(null);
                    if (tenant != null && (!tenant.isActive() || tenant.isDeleted())) {
                        log.warn("Access rejected: Factory tenant '{}' is suspended or deactivated.", tenant.getTenantCode());
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.setCharacterEncoding("UTF-8");
                        response.getWriter().write("{\"success\":false,\"message\":\"Your factory organization subscription has been suspended or deactivated. Please contact platform administration.\",\"error\":\"TENANT_SUSPENDED\"}");
                        response.getWriter().flush();
                        return;
                    }
                }

                UserDetails userDetails = (tenantId != null)
                        ? userDetailsService.loadUserByTenantIdAndUsername(tenantId, username)
                        : userDetailsService.loadUserByUsername(username);

                // [EN] Real-time lockout verification: reject immediately if account is locked, disabled, or soft-deleted
                // [BN] রিয়েল-টাইম অ্যাকাউন্ট স্থিতি যাচাই: অ্যাকাউন্ট লক বা নিষ্ক্রিয় হলে তাৎক্ষণিক রিজেক্ট
                if (!userDetails.isAccountNonLocked() || !userDetails.isEnabled()) {
                    log.warn("Access rejected: Authenticated user '{}' is locked or disabled.", username);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write("{\"success\":false,\"message\":\"Your account has been locked. You have been logged out.\",\"error\":\"ACCOUNT_LOCKED\"}");
                    response.getWriter().flush();
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } finally {
            // [EN] Crucial: Clear ThreadLocal storage to prevent virtual thread-pool memory leaks
            // [BN] অত্যন্ত গুরুত্বপূর্ণ: থ্রেড-পুল মেমরি লিক রোধ করতে ThreadLocal পরিষ্কার করা
            TenantContext.clear();
        }
    }

    /**
     * [EN] Extracts Bearer token string from HTTP Authorization header
     * [BN] HTTP Authorization হেডার থেকে Bearer টোকেন স্ট্রিং আলাদা করে
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
