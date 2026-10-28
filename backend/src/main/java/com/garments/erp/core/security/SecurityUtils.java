package com.garments.erp.core.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


/**
 * =============================================================================
 * [EN] Centralized Security & Authority Verification Utilities (SecurityUtils)
 * [BN] কেন্দ্রীভূত নিরাপত্তা ও ভূমিকা যাচাই ইউটিলিটি ক্লাস (SecurityUtils)
 * =============================================================================
 * [EN] Reference: OWASP A01 (Broken Access Control), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] স্প্রিং সিকিউরিটি অথেনটিকেশন কনটেক্সট থেকে সুপার অ্যাডমিন স্ট্যাটাস ও প্ল্যাটফর্ম-রুট প্রিভিলেজ যাচাই করে।
 */
public final class SecurityUtils {

    public static final String ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
    public static final String MODULE_CLIENT_MGMT = "client_mgmt";
    public static final String PERM_PREFIX_TENANT = "TENANT:";

    private SecurityUtils() {
    }

    /**
     * [EN] Verifies whether the authenticated principal holds permanent platform Super Admin authority
     * [BN] অথেনটিকেটেড ইউজার প্ল্যাটফর্ম সুপার অ্যাডমিন (ROLE_SUPER_ADMIN) অধিকারধারী কি না যাচাই করে
     */
    public static boolean isSuperAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities() == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .anyMatch(a -> ROLE_SUPER_ADMIN.equalsIgnoreCase(a.getAuthority())
                        || "SUPER_ADMIN".equalsIgnoreCase(a.getAuthority()));
    }

    /**
     * [EN] Checks whether a permission code belongs exclusively to platform-root administration
     * [BN] নির্দিষ্ট পারমিশন কোডটি প্ল্যাটফর্ম রুট অ্যাডমিনের জন্য সংরক্ষিত কি না তা যাচাই করে
     */
    public static boolean isPlatformRootPermission(String permissionCode) {
        if (permissionCode == null) {
            return false;
        }
        String clean = permissionCode.trim().toUpperCase();
        if (clean.startsWith(PERM_PREFIX_TENANT)) return true;
        if (clean.startsWith("CLIENT:")) return true;
        return clean.endsWith(":PURGE");
    }

    /**
     * [EN] Checks whether a module identifier belongs exclusively to platform root
     * [BN] নির্দিষ্ট মডিউলটি প্ল্যাটফর্ম রুট অ্যাডমিনের জন্য সংরক্ষিত কি না যাচাই করে
     */
    public static boolean isPlatformRootModule(String moduleId) {
        if (moduleId == null) {
            return false;
        }
        return MODULE_CLIENT_MGMT.equalsIgnoreCase(moduleId.trim());
    }

    /**
     * [EN] Resolves the username of the current authenticated operator or defaults to SYSTEM
     * [BN] বর্তমান সক্রিয় ইউজারের নাম রিটার্ন করে, না থাকলে SYSTEM রিটার্ন করে
     */
    public static String resolveCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "SYSTEM";
    }

    /**
     * [EN] Resolves the primary role authority of the current operator or defaults to SYSTEM
     * [BN] বর্তমান সক্রিয় অপারেটরের প্রাথমিক রোল সংগ্রহ করে, না থাকলে SYSTEM রিটার্ন করে
     */
    public static String resolveCurrentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities() != null && !auth.getAuthorities().isEmpty()) {
            return auth.getAuthorities().stream()
                    .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                    .filter(a -> a.startsWith("ROLE_"))
                    .findFirst()
                    .orElseGet(() -> auth.getAuthorities().iterator().next().getAuthority());
        }
        return "SYSTEM";
    }

    /**
     * [EN] Safely extracts the real client IP address from HTTP request attributes
     * [BN] এইচটিটিপি রিকোয়েস্ট অ্যাট্রিবিউট থেকে সুরক্ষিতভাবে ক্লায়েন্ট আইপি সংগ্রহ করে
     */
    public static String resolveClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest req = attrs.getRequest();
                String xForwarded = req.getHeader("X-Forwarded-For");
                if (xForwarded != null && !xForwarded.isBlank()) {
                    return xForwarded.split(",")[0].trim();
                }
                String xReal = req.getHeader("X-Real-IP");
                if (xReal != null && !xReal.isBlank()) {
                    return xReal.trim();
                }
                return req.getRemoteAddr() != null ? req.getRemoteAddr() : "127.0.0.1";
            }
        } catch (Exception ignored) {
            // Non-web or asynchronous fallback
        }
        return "127.0.0.1";
    }
}
