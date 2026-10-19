package com.garments.erp.core.security;

import com.garments.erp.auth.entity.Role;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant User Details Service Implementation
 * [BN] মাল্টি-টেন্যান্ট ইউজার ডিটেইলস সার্ভিস বাস্তবায়ন
 * =============================================================================
 * [EN] Loads user credentials, roles, and granular permissions from the database
 *      to construct Spring Security authenticated principals during JWT verification.
 * [BN] ডেটাবেজ থেকে ইউজারের তথ্য, রোল এবং পারমিশন সংগ্রহ করে স্প্রিং সিকিউরিটির
 *      অথেনটিকেটেড প্রিন্সিপাল অবজেক্ট তৈরি করার সার্ভিস পরিচালনা করে।
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param userRepository [EN] User data repository / [BN] ইউজার ডেটা রিপোজিটরি
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findWithRolesAndPermissionsByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return buildPrincipal(user);
    }

    /**
     * [EN] Loads user strictly scoped within a specific tenant organization
     * [BN] নির্দিষ্ট টেন্যান্টের অধীনে সুরক্ষিতভাবে ইউজার রেকর্ড লোড করে
     *
     * @param tenantId [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param username [EN] Unique username / [BN] ইউজারনেম
     * @return [EN] Populated UserDetails principal / [BN] তৈরি হওয়া প্রিন্সিপাল
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserByTenantIdAndUsername(UUID tenantId, String username) {
        User user = userRepository.findWithRolesAndPermissionsByTenantIdAndUsername(tenantId, username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found in tenant " + tenantId + " with username: " + username));

        return buildPrincipal(user);
    }

    /**
     * [EN] Converts domain User entity into authenticated CustomUserPrincipal
     * [BN] ডোমেন ইউজার এন্টিটিকে CustomUserPrincipal অবজেক্টে রূপান্তর করে
     */
    private CustomUserPrincipal buildPrincipal(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                // [EN] Add Role authority prefixed with ROLE_ / [BN] ROLE_ প্রিফিক্সসহ রোল যোগ করা
                String roleCode = role.getRoleCode();
                if (!roleCode.startsWith("ROLE_")) {
                    roleCode = "ROLE_" + roleCode;
                }
                authorities.add(new SimpleGrantedAuthority(roleCode));

                // [EN] Add granular permissions bound to this role
                // [BN] এই রোলের অধীনে থাকা গ্র্যানুলার পারমিশন যোগ করা
                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(p ->
                            authorities.add(new SimpleGrantedAuthority(p.getPermissionCode()))
                    );
                }
            }
        }

        boolean isEnabled = (user.getStatus() == UserStatus.ACTIVE) && !user.isDeleted();

        return new CustomUserPrincipal(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getEmail(),
                user.getFullName(),
                authorities,
                isEnabled
        );
    }
}
