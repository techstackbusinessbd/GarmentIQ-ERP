package com.garments.erp.core.security;

import com.garments.erp.auth.entity.Role;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.entity.UserCustomPermission;
import com.garments.erp.user.repository.UserCustomPermissionRepository;
import com.garments.erp.user.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserCustomPermissionRepository customPermissionRepository;

    public CustomUserDetailsService(UserRepository userRepository,
                                    UserCustomPermissionRepository customPermissionRepository) {
        this.userRepository = userRepository;
        this.customPermissionRepository = customPermissionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        if (identifier != null && identifier.contains("@")) {
            return userRepository.findWithRolesAndPermissionsByEmail(identifier.trim().toLowerCase())
                    .map(this::buildPrincipal)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + identifier));
        }

        UUID tenantId = com.garments.erp.tenant.context.TenantContext.getTenantId();
        if (tenantId != null) {
            return userRepository.findWithRolesAndPermissionsByTenantIdAndUsername(tenantId, identifier)
                    .map(this::buildPrincipal)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found in factory tenant " + tenantId + " with username: " + identifier));
        }

        User user = userRepository.findWithRolesAndPermissionsByUsername(identifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + identifier));

        return buildPrincipal(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserByTenantIdAndUsername(UUID tenantId, String username) {
        User user = userRepository.findWithRolesAndPermissionsByTenantIdAndUsername(tenantId, username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found in factory tenant " + tenantId + " with username: " + username));

        return buildPrincipal(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserByEmail(String email) {
        User user = userRepository.findWithRolesAndPermissionsByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return buildPrincipal(user);
    }

    public CustomUserPrincipal buildPrincipal(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                String roleCode = role.getRoleCode();
                if (!roleCode.startsWith("ROLE_")) {
                    roleCode = "ROLE_" + roleCode;
                }
                authorities.add(new SimpleGrantedAuthority(roleCode));

                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(p ->
                            authorities.add(new SimpleGrantedAuthority(p.getPermissionCode()))
                    );
                }
            }
        }

        // [EN] Merge user custom direct permissions: Union Grants, Remove Explicit Denials
        // [BN] ব্যবহারকারীর কাস্টম পারমিশন মার্জ করা: অতিরিক্ত অনুমতি যোগ এবং এক্সপ্লিসিট ডিনাই অপসারণ
        if (customPermissionRepository != null) {
            List<UserCustomPermission> customPerms = customPermissionRepository.findByUserId(user.getId());
            if (customPerms != null) {
                for (UserCustomPermission cp : customPerms) {
                    SimpleGrantedAuthority auth = new SimpleGrantedAuthority(cp.getPermissionCode());
                    if (cp.isGranted()) {
                        authorities.add(auth);
                    } else {
                        authorities.remove(auth);
                    }
                }
            }
        }

        boolean isEnabled = (user.getStatus() == UserStatus.ACTIVE || user.getStatus() == UserStatus.LOCKED) && !user.isDeleted();
        boolean isAccountNonLocked = !user.isAccountLocked();

        return new CustomUserPrincipal(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getEmail(),
                user.getFullName(),
                authorities,
                isEnabled,
                isAccountNonLocked
        );
    }
}
