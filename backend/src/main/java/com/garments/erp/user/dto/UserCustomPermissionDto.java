package com.garments.erp.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] User Custom Permission Transfer DTO
 * [BN] ব্যবহারকারীর কাস্টম পারমিশন ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Getter
@Setter
public class UserCustomPermissionDto implements Serializable {

    private UUID id;
    private UUID userId;
    private String permissionCode;

    @JsonProperty("isGranted")
    private boolean isGranted = true;

    private Instant createdAt;
    private String createdBy;

    public UserCustomPermissionDto() {
    }

    public UserCustomPermissionDto(UUID id, UUID userId, String permissionCode, boolean isGranted, Instant createdAt, String createdBy) {
        this.id = id;
        this.userId = userId;
        this.permissionCode = permissionCode;
        this.isGranted = isGranted;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }
}
