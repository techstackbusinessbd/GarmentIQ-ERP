package com.garments.erp.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * =============================================================================
 * [EN] Inbound Bulk Update User Custom Permissions Request DTO
 * [BN] ব্যবহারকারীর কাস্টম পারমিশন বাল্ক আপডেট রিকোয়েস্ট ডিটিও
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Getter
@Setter
public class UpdateUserCustomPermissionsRequest implements Serializable {

    @NotNull(message = "Custom permissions list must not be null")
    private List<UserCustomPermissionDto> permissions = new ArrayList<>();

    public UpdateUserCustomPermissionsRequest() {
    }

    public UpdateUserCustomPermissionsRequest(List<UserCustomPermissionDto> permissions) {
        this.permissions = permissions;
    }
}
