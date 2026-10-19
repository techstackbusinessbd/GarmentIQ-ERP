package com.garments.erp.auth.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Data Transfer Object for Multi-Tenant Security Roles (RBAC)
 * [BN] মাল্টি-টেন্যান্ট সিকিউরিটি রোল ডেটা ট্রান্সফার অবজেক্ট (আরবিএসি)
 * =============================================================================
 * [EN] Transports role definition and assigned permission codes to the frontend
 *      user management grid and access control administration views.
 * [BN] ফ্রন্টএন্ড ইউজার ম্যানেজমেন্ট গ্রিড ও অ্যাক্সেস কন্ট্রোল ভিউতে রোল সংজ্ঞা
 *      এবং সংশ্লিষ্ট পারমিশন কোড আদান-প্রদান করে।
 */
@Getter
@Setter
public class RoleDto implements Serializable {

    /**
     * [EN] Unique role identifier
     * [BN] রোলের ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Standard role code identifier (e.g. ROLE_MERCHANDISER)
     * [BN] স্ট্যান্ডার্ড রোল কোড
     */
    private String roleCode;

    /**
     * [EN] Display title of the role
     * [BN] রোলের সহজপাঠ্য নাম
     */
    private String roleName;

    /**
     * [EN] Description of responsibilities
     * [BN] দায়িত্বের বিবরণ
     */
    private String description;

    /**
     * [EN] Protected system role flag
     * [BN] সিস্টেম রোল কি না
     */
    private boolean isSystemRole;

    /**
     * [EN] Set of permission codes assigned to this role
     * [BN] এই রোলে নির্ধারিত পারমিশন কোডসমূহের সেট
     */
    private Set<String> permissions = new HashSet<>();

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public RoleDto() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public RoleDto(UUID id, String roleCode, String roleName, String description, boolean isSystemRole) {
        this.id = id;
        this.roleCode = roleCode;
        this.roleName = roleName;
        this.description = description;
        this.isSystemRole = isSystemRole;
    }
}
