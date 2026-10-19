package com.garments.erp.auth.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Data Transfer Object for Functional Permissions
 * [BN] ফাংশনাল পারমিশন ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Transports permission metadata between backend security filters, role
 *      configuration screens, and frontend role-assignment modal dialogs.
 * [BN] ব্যাকএন্ড সিকিউরিটি ফিল্টার, রোল কনফিগারেশন স্ক্রিন এবং ফ্রন্টএন্ড রোল
 *      অ্যাসাইনমেন্ট মডালের মধ্যে পারমিশন সংক্রান্ত তথ্য আদান-প্রদান করে।
 */
@Getter
@Setter
public class PermissionDto implements Serializable {

    /**
     * [EN] Unique permission identifier
     * [BN] পারমিশনের ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Standard authorization permission code (e.g. ORDER:READ)
     * [BN] স্ট্যান্ডার্ড অথোরাইজেশন পারমিশন কোড
     */
    private String permissionCode;

    /**
     * [EN] Functional module grouping name (e.g. MERCHANDISING)
     * [BN] মডিউল গ্রুপিং নাম
     */
    private String moduleName;

    /**
     * [EN] Action description
     * [BN] পারমিশনের বিবরণ
     */
    private String description;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public PermissionDto() {
    }

    /**
     * [EN] All-args constructor
     * [BN] সকল প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public PermissionDto(UUID id, String permissionCode, String moduleName, String description) {
        this.id = id;
        this.permissionCode = permissionCode;
        this.moduleName = moduleName;
        this.description = description;
    }
}
