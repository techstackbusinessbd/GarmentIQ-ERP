package com.garments.erp.user.entity;

import com.garments.erp.auth.entity.Role;
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
 * [EN] Multi-Tenant Enterprise User Entity (Rule 23)
 * [BN] মাল্টি-টেন্যান্ট এন্টারপ্রাইজ ব্যবহারকারী এন্টিটি (রুল ২৩)
 * =============================================================================
 * [EN] Represents a registered enterprise user strictly scoped under a specific
 *      tenant organization. Holds authentication credentials, profile data,
 *      and assigned security roles governing system-wide access.
 * [BN] একটি নির্দিষ্ট টেন্যান্টের অধীনে নিবন্ধিত সিস্টেম ব্যবহারকারীকে নির্দেশ করে।
 *      এতে লগইন তথ্য, প্রাতিষ্ঠানিক পরিচয় এবং অনুমতি নিয়ন্ত্রণকারী সিকিউরিটি রোল সংরক্ষিত থাকে।
 */
@Getter
@Setter
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uq_tenant_username", columnNames = {"tenant_id", "username"}),
        @UniqueConstraint(name = "uq_tenant_email", columnNames = {"tenant_id", "email"})
})
public class User implements Serializable {

    /**
     * [EN] Unique primary key generated via RFC 9562 UUIDv7
     * [BN] RFC 9562 UUIDv7 দ্বারা জেনারেটকৃত অনন্য প্রাইমারি কি
     */
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * [EN] Parent tenant organization UUID (Tenant Isolation Boundary)
     * [BN] মূল প্যারেন্ট টেন্যান্ট আইডি (টেন্যান্ট আইসোলেশন বাউন্ডারি)
     */
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    /**
     * [EN] Unique login handle within the tenant (e.g. superadmin, tanvir.pm)
     * [BN] টেন্যান্টের মধ্যে অনন্য লগইন ইউজারনেম
     */
    @Column(name = "username", nullable = false, length = 50)
    private String username;

    /**
     * [EN] Registered official corporate email address
     * [BN] নিবন্ধিত অফিশিয়াল করপোরেট ইমেইল ঠিকানা
     */
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    /**
     * [EN] BCrypt cryptographically hashed password credential
     * [BN] ক্রিপ্টোগ্রাফিক্যালি হ্যাশড বিসিআরওয়াইপিটি পাসওয়ার্ড
     */
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    /**
     * [EN] Full legal or professional name of the employee
     * [BN] কর্মকর্তা বা কর্মচারীর পূর্ণ প্রাতিষ্ঠানিক নাম
     */
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    /**
     * [EN] Factory functional department (e.g. MERCHANDISING, CUTTING, SEWING, IT)
     * [BN] কারখানা বা করপোরেট বিভাগ (যেমন: মার্চেন্ডাইজিং, কাটিং, আইটি)
     */
    @Column(name = "department", length = 50)
    private String department;

    /**
     * [EN] Professional job designation title (e.g. Chief Merchandiser, Cutting Master)
     * [BN] পেশাগত পদবী (যেমন: চিফ মার্চেন্ডাইজার, কাটিং মাস্টার)
     */
    @Column(name = "designation", length = 50)
    private String designation;

    /**
     * [EN] Official cellular or office extension telephone number
     * [BN] অফিশিয়াল মোবাইল বা টেলিফোন নম্বর
     */
    @Column(name = "phone", length = 30)
    private String phone;

    /**
     * [EN] Account operational lifecycle status (ACTIVE, INACTIVE, SUSPENDED, LOCKED)
     * [BN] অ্যাকাউন্টের সক্রিয়তা ও কার্যকারিতা স্ট্যাটাস
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status;

    /**
     * [EN] Soft deletion flag (false = active, true = soft-deleted)
     * [BN] সফট ডিলিট নির্দেশক ফ্ল্যাগ
     */
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    /**
     * [EN] UTC timestamp marking creation moment
     * [BN] ইউজার তৈরির UTC টাইমস্ট্যাম্প
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * [EN] UTC timestamp marking last modification
     * [BN] ইউজার সর্বশেষ পরিমার্জনের UTC টাইমস্ট্যাম্প
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Username or process that created this user account
     * [BN] যে অ্যাডমিনিস্ট্রেটর এই ইউজার অ্যাকাউন্ট তৈরি করেছেন
     */
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    /**
     * [EN] Username or process that performed latest profile update
     * [BN] যে কর্মকর্তা সর্বশেষ তথ্য হালনাগাদ করেছেন
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
     * [EN] Security roles assigned to this user
     * [BN] এই ব্যবহারকারীকে বরাদ্দকৃত সিকিউরিটি রোলসমূহের সেট
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    /**
     * [EN] Default no-args constructor initializing active status
     * [BN] ডিফল্ট কনস্ট্রাক্টর—প্রাথমিক সক্রিয় স্ট্যাটাস সেট করে
     */
    public User() {
        this.status = UserStatus.ACTIVE;
        this.isDeleted = false;
        this.version = 0L;
        this.createdBy = "SYSTEM";
        this.updatedBy = "SYSTEM";
    }

    /**
     * [EN] Parameterized constructor for user provisioning
     * [BN] নতুন ইউজার তৈরির জন্য প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param tenantId     [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param username     [EN] Login username / [BN] ইউজারনেম
     * @param email        [EN] Official email / [BN] ইমেইল
     * @param passwordHash [EN] BCrypt hash / [BN] পাসওয়ার্ড হ্যাশ
     * @param fullName     [EN] Employee full name / [BN] পূর্ণ নাম
     */
    public User(UUID tenantId, String username, String email, String passwordHash, String fullName) {
        this();
        this.tenantId = tenantId;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
    }

    /**
     * [EN] Helper method to assign a role to this user
     * [BN] ব্যবহারকারীকে একটি নতুন রোল বরাদ্দ করার সহায়ক মেথড
     *
     * @param role [EN] Role entity / [BN] রোল অবজেক্ট
     */
    public void addRole(Role role) {
        this.roles.add(role);
    }

    /**
     * [EN] Helper method to revoke a role from this user
     * [BN] ব্যবহারকারী থেকে একটি রোল প্রত্যাহার করার সহায়ক মেথড
     *
     * @param role [EN] Role entity / [BN] রোল অবজেক্ট
     */
    public void removeRole(Role role) {
        this.roles.remove(role);
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
        if (!(o instanceof User user)) return false;
        return Objects.equals(tenantId, user.tenantId) && Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, username);
    }
}
