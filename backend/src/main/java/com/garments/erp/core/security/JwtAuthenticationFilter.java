package com.garments.erp.core.security;

import com.garments.erp.tenant.context.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
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
 * [EN] Once-Per-Request Stateless JWT Authentication & Tenant Context Filter
 * [BN] প্রতি রিকোয়েস্টে স্টেটলেস জেডব্লিউটি অথেনটিকেশন ও টেন্যান্ট কনটেক্সট ফিল্টার
 * =============================================================================
 * [EN] Intercepts every inbound HTTP request to extract the Bearer token, validate
 *      cryptographic signatures, bind the authenticated principal into SecurityContext,
 *      and populate the TenantContext with tenant_id claims for seamless data isolation.
 * [BN] প্রতিটি ইনকামিং HTTP রিকোয়েস্ট ইন্টারসেপ্ট করে Bearer টোকেন এক্সট্র্যাক্ট করে,
 *      স্বাক্ষর যাচাই করে, SecurityContext-এ অথেনটিকেশন সেট করে এবং ডেটা আইসোলেশনের জন্য
 *      TenantContext-এ সক্রিয় টেন্যান্টের UUID সংরক্ষণ করে।
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param tokenProvider      [EN] JWT validation and parsing provider / [BN] জেডব্লিউটি প্রোভাইডার
     * @param userDetailsService [EN] User principal loader service / [BN] ইউজার লোডার সার্ভিস
     */
    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String jwt = resolveToken(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);
                UUID tenantId = tokenProvider.getTenantIdFromToken(jwt);

                // [EN] Populate ThreadLocal TenantContext for request lifetime
                // [BN] রিকোয়েস্ট লাইফটাইমের জন্য ThreadLocal TenantContext সেট করা
                if (tenantId != null) {
                    TenantContext.setTenantId(tenantId);
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

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
