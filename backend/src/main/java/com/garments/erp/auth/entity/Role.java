package com.garments.erp.auth.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Security Authorization Role Entity (RBAC)
 * [BN] মাল্টি-টেন্যান্ট সিকিউরিটি ও অথোরাইজেশন রোল এন্টিটি (আরবিএসি)
 * =============================================================================
 * [EN] Represents a tenant-scoped security role (e.g. ROLE_MERCHANDISER,
 *      ROLE_CUTTING_MANAGER, ROLE_ADMIN). Holds a collection of granular permissions
 *      granting functional access across the garments ERP ecosystem.
 * [BN] টেন্যান্টভিত্তিক সিকিউরিটি রোল নির্দেশ করে (যেমন: ROLE_MERCHANDISER,
 *      ROLE_CUTTING_MANAGER)। পোশাক কারখানার বিভিন্ন ফাংশনাল মডিউল ব্যবহারের অনুমতি
 *      দিতে এতে একাধিক গ্র্যানুলার পারমিশনের সেট সংযুক্ত থাকে।
 */
@Getter
@Setter
@Entity
@Table(name = "roles", uniqueConstraints = {
        @UniqueConstraint(name = "uq_tenant_role_code", columnNames = {"tenant_id", "role_code"})
})
public class Role implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Scoped tenant organization identifier
     * [BN] সংশ্লিষ্ট টেন্যান্ট বা কারখানা প্রতিষ্ঠানের ইউনিক আইডি
     */
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    /**
     * [EN] Standard uppercase role code identifier (e.g. ROLE_ADMIN, ROLE_MERCHANDISER)
     * [BN] স্ট্যান্ডার্ড বড় হাতের রোল কোড (যেমন: ROLE_ADMIN, ROLE_MERCHANDISER)
     */
    @Column(name = "role_code", nullable = false, length = 50)
    private String roleCode;

    /**
     * [EN] Readable display name of the role (e.g. Chief Merchandiser)
     * [BN] রোলের সহজপাঠ্য প্রদর্শনী নাম (যেমন: Chief Merchandiser)
     */
    @Column(name = "role_name", nullable = false, length = 100)
    private String roleName;

    /**
     * [EN] Functional description of the role's responsibilities
     * [BN] এই রোলের দায়িত্ব ও পরিধির কার্যকরী বিবরণ
     */
    @Column(name = "description", length = 255)
    private String description;

    /**
     * [EN] System protected flag (true = built-in role protected from deletion)
     * [BN] সিস্টেম সুরক্ষিত কি না (true হলে এটি ডিফল্ট সিস্টেম রোল যা মুছে ফেলা যায় না)
     */
    @Column(name = "is_system_role", nullable = false)
    private boolean isSystemRole;

    /**
     * [EN] Soft deletion flag (false = active, true = soft-deleted)
     * [BN] সফট ডিলিট নির্দেশক ফ্ল্যাগ
     */
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    /**
     * [EN] UTC timestamp marking creation moment
     * [BN] রোল তৈরির UTC টাইমস্ট্যাম্প
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] UTC timestamp marking last modification
     * [BN] রোল সর্বশেষ পরিমার্জনের UTC টাইমস্ট্যাম্প
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Username or process that registered this role
     * [BN] যে অ্যাডমিনিস্ট্রেটর বা প্রসেস এই রোল তৈরি করেছে
     */
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    /**
     * [EN] Username or process that performed latest update
     * [BN] যে কর্মকর্তা সর্বশেষ আপডেট সম্পন্ন করেছে
     */
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * [EN] Optimistic concurrency control version number
     * [BN] অপটিমিস্টিক কনকারেন্সি কন্ট্রোল ভার্সন নম্বর
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    /**
     * [EN] Set of granular authorization permissions bound to this role
     * [BN] এই রোলের সাথে যুক্ত গ্র্যানুলার পারমিশনসমূহের সেট
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    /**
     * [EN] Default no-args constructor initializing active status
     * [BN] ডিফল্ট কনস্ট্রাক্টর—প্রাথমিক সক্রিয় মান সেট করে
     */
    public Role() {
        this.isSystemRole = false;
        this.isDeleted = false;
        this.version = 0L;
        this.createdBy = "SYSTEM";
        this.updatedBy = "SYSTEM";
    }

    /**
     * [EN] Parameterized constructor for role provisioning
     * [BN] নতুন রোল তৈরির জন্য প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param tenantId [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param roleCode [EN] Role code / [BN] রোল কোড
     * @param roleName [EN] Display title / [BN] রোলের নাম
     */
    public Role(UUID tenantId, String roleCode, String roleName) {
        this();
        this.tenantId = tenantId;
        this.roleCode = roleCode;
        this.roleName = roleName;
    }

    /**
     * [EN] Helper method to add a permission to this role
     * [BN] এই রোলে একটি পারমিশন যুক্ত করার সহায়ক মেথড
     *
     * @param permission [EN] Permission entity / [BN] পারমিশন এন্টিটি
     */
    public void addPermission(Permission permission) {
        this.permissions.add(permission);
    }

    /**
     * [EN] Helper method to remove a permission from this role
     * [BN] এই রোল থেকে একটি পারমিশন অপসারণের সহায়ক মেথড
     *
     * @param permission [EN] Permission entity / [BN] পারমিশন এন্টিটি
     */
    public void removePermission(Permission permission) {
        this.permissions.remove(permission);
    }

    /**
     * [EN] JPA pre-persist lifecycle hook: Generates UUIDv7 and initializes audit timestamps
     * [BN] ডেটাবেজে সংরক্ষণের পূর্বে UUIDv7 আইডি ও অডিট টাইমস্ট্যাম্প সেট করার লাইফসাইকেল হুক
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidV7Generator.generate();
        }
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.createdBy == null) {
            this.createdBy = "SYSTEM";
        }
        if (this.updatedBy == null) {
            this.updatedBy = "SYSTEM";
        }
    }

    /**
     * [EN] JPA pre-update lifecycle hook: Refreshes updatedAt timestamp
     * [BN] প্রতিবার ডেটাবেজে আপডেটের পূর্বে updatedAt টাইমস্ট্যাম্প রিফ্রেশ করার লাইফসাইকেল হুক
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role role)) return false;
        return Objects.equals(tenantId, role.tenantId) && Objects.equals(roleCode, role.roleCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, roleCode);
    }
}
