package com.garments.erp.core.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Authenticated User Principal Details
 * [BN] মাল্টি-টেন্যান্ট অথেনটিকেটেড ইউজার প্রিন্সিপাল ডিটেইলস
 * =============================================================================
 * [EN] Implements Spring Security UserDetails interface, encapsulating tenant UUID,
 *      user UUID, credentials, and granted roles and permissions.
 * [BN] স্প্রিং সিকিউরিটির UserDetails ইন্টারফেস ইমপ্লিমেন্ট করে, যা টেন্যান্ট আইডি,
 *      ইউজার আইডি, ক্রেডেনশিয়াল এবং অনুমোদিত রোল ও পারমিশন সংরক্ষণ করে।
 */
@Getter
public class CustomUserPrincipal implements UserDetails {

    /**
     * [EN] Unique user primary key identifier
     * [BN] ব্যবহারকারীর অনন্য প্রাইমারি কি
     */
    private final UUID id;

    /**
     * [EN] Scoped tenant organization identifier
     * [BN] সংশ্লিষ্ট কারখানা বা টেন্যান্টের ইউনিক আইডি
     */
    private final UUID tenantId;

    /**
     * [EN] User login handle
     * [BN] লগইন ইউজারনেম
     */
    private final String username;

    /**
     * [EN] Cryptographically hashed password
     * [BN] হ্যাশড পাসওয়ার্ড
     */
    private final String password;

    /**
     * [EN] Registered email address
     * [BN] নিবন্ধিত ইমেইল ঠিকানা
     */
    private final String email;

    /**
     * [EN] Employee full name
     * [BN] ব্যবহারকারীর পূর্ণ নাম
     */
    private final String fullName;

    /**
     * [EN] Granted roles and permission authorities
     * [BN] অনুমোদিত রোল ও পারমিশন অথরিটি কালেকশন
     */
    private final Collection<? extends GrantedAuthority> authorities;

    /**
     * [EN] Account operational status flag
     * [BN] অ্যাকাউন্টের সক্রিয়তা ফ্ল্যাগ
     */
    private final boolean enabled;

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public CustomUserPrincipal(UUID id, UUID tenantId, String username, String password,
                               String email, String fullName,
                               Collection<? extends GrantedAuthority> authorities, boolean enabled) {
        this.id = id;
        this.tenantId = tenantId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.authorities = authorities;
        this.enabled = enabled;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
