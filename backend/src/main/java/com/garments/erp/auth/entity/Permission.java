package com.garments.erp.auth.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Granular Functional Authorization Permission Entity
 * [BN] গ্র্যানুলার ফাংশনাল অথোরাইজেশন পারমিশন এন্টিটি
 * =============================================================================
 * [EN] Represents a discrete, atomic action permission (e.g. ORDER:READ,
 *      ORDER:CREATE, CUTTING:EXECUTE) scoped by functional enterprise modules.
 * [BN] সিস্টেমের একটি নির্দিষ্ট কাজের অনুমতি নির্দেশ করে (যেমন: ORDER:READ,
 *      ORDER:CREATE, CUTTING:EXECUTE), যা সংশ্লিষ্ট মডিউল অনুযায়ী শ্রেণীবদ্ধ থাকে।
 */
@Getter
@Setter
@Entity
@Table(name = "permissions")
public class Permission implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Standard permission code identifier (e.g. ORDER:READ, ORDER:APPROVE)
     * [BN] স্ট্যান্ডার্ড পারমিশন কোড (যেমন: ORDER:READ, ORDER:APPROVE)
     */
    @Column(name = "permission_code", nullable = false, unique = true, length = 60)
    private String permissionCode;

    /**
     * [EN] Functional module grouping name (e.g. MERCHANDISING, CUTTING, SEWING)
     * [BN] ফাংশনাল মডিউল গ্রুপিং নাম (যেমন: MERCHANDISING, CUTTING)
     */
    @Column(name = "module_name", nullable = false, length = 50)
    private String moduleName;

    /**
     * [EN] Human-readable description of what this permission authorizes
     * [BN] এই পারমিশন কী ধরনের অ্যাকশন অনুমোদন করে তার মানবিক বিবরণ
     */
    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "domain_id", length = 50)
    private String domainId;

    @Column(name = "domain_title", length = 100)
    private String domainTitle;

    @Column(name = "module_id", length = 50)
    private String moduleId;

    @Column(name = "module_title", length = 100)
    private String moduleTitle;

    @Column(name = "module_description", length = 255)
    private String moduleDescription;

    @Column(name = "feature_id", length = 50)
    private String featureId;

    @Column(name = "feature_name", length = 100)
    private String featureName;

    @Column(name = "action_key", length = 30)
    private String actionKey;

    @Column(name = "action_label", length = 50)
    private String actionLabel;

    @Column(name = "target_path", length = 100)
    private String targetPath;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    /**
     * [EN] UTC timestamp marking creation moment
     * [BN] পারমিশন তৈরির UTC টাইমস্ট্যাম্প
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public Permission() {
    }

    /**
     * [EN] Parameterized constructor for permission registration
     * [BN] নতুন পারমিশন তৈরির জন্য প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param permissionCode [EN] Unique permission code / [BN] পারমিশন কোড
     * @param moduleName     [EN] Functional module / [BN] মডিউলের নাম
     * @param description    [EN] Action description / [BN] বিবরণ
     */
    public Permission(String permissionCode, String moduleName, String description) {
        this();
        this.permissionCode = permissionCode;
        this.moduleName = moduleName;
        this.description = description;
    }

    /**
     * [EN] JPA pre-persist lifecycle hook: Generates UUIDv7 and initializes timestamp
     * [BN] ডেটাবেজে সংরক্ষণের পূর্বে UUIDv7 আইডি ও টাইমস্ট্যাম্প সেট করার লাইফসাইকেল হুক
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidV7Generator.generate();
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Permission that)) return false;
        return Objects.equals(permissionCode, that.permissionCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(permissionCode);
    }
}
