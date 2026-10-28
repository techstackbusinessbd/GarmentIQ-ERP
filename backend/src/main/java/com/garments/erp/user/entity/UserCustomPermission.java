package com.garments.erp.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] User Custom Permission Override Entity (UserCustomPermission)
 * [BN] ব্যবহারকারীভিত্তিক কাস্টম ওভাররাইড পারমিশন এন্টিটি (UserCustomPermission)
 * =============================================================================
 * [EN] Reference: Rule 12 Approval Gate, docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 12 (Approved Schema), Rule 15 (Bilingual)
 * [BN] রোলের বাইরে নির্দিষ্ট কর্মীকে বিশেষ ক্ষমতা প্রদান (Grant) বা খর্ব (Deny) করার এন্টিটি।
 */
@Entity
@Table(name = "user_custom_permissions", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_custom_permission", columnNames = {"user_id", "permission_code"})
})
@Getter
@Setter
public class UserCustomPermission implements Serializable {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "permission_code", nullable = false, length = 60)
    private String permissionCode;

    @Column(name = "is_granted", nullable = false)
    private boolean isGranted = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    public UserCustomPermission() {
    }

    public UserCustomPermission(UUID id, UUID userId, String permissionCode, boolean isGranted, String createdBy) {
        this.id = id;
        this.userId = userId;
        this.permissionCode = permissionCode;
        this.isGranted = isGranted;
        this.createdBy = createdBy;
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserCustomPermission that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(permissionCode, that.permissionCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, permissionCode);
    }
}
