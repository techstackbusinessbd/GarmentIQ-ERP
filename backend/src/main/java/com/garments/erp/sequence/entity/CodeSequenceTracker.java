package com.garments.erp.sequence.entity;

import com.garments.erp.core.utils.UuidV7Generator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Atomic Concurrency Code Sequence Tracker Entity (Rule 24)
 * [BN] অ্যাটমিক কনকারেন্সি কোড সিকোয়েন্স ট্র্যাকার এন্টিটি (রুল ২৪)
 * =============================================================================
 * [EN] Tracks the latest issued incremental numeric value for a given tenant,
 *      entity type, year, and month. Protected with database row-level locking
 *      to ensure strictly zero race conditions in high-throughput environments.
 * [BN] নির্দিষ্ট টেন্যান্ট, এনটিটি টাইপ, বছর ও মাসের সর্বশেষ ইস্যুকৃত ক্রমিক মান
 *      সংরক্ষণ করে। কনকারেন্ট পরিবেশে কোনো ডুপ্লিকেট কোড যেন তৈরি না হয়, সেজন্য
 *      এটি ডেটাবেজ রো-লেভেল লকিং দ্বারা সুরক্ষিত থাকে।
 */
@Getter
@Setter
@Entity
@Table(name = "code_sequence_trackers", uniqueConstraints = {
        @UniqueConstraint(name = "uq_tracker_period",
                columnNames = {"tenant_id", "entity_type", "current_year", "current_month"})
})
public class CodeSequenceTracker implements Serializable {

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
     * [EN] Target business entity type (e.g. BUYER, STYLE, PO, CUTTING_ORDER)
     * [BN] যে ব্যবসায়িক এনটিটির জন্য কাউন্টার ট্র্যাকিং হচ্ছে
     */
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    /**
     * [EN] Current calendar year slice (0 if reset frequency is NEVER)
     * [BN] বর্তমান ক্যালেন্ডার বছর (রিসেট ফ্রিকোয়েন্সি NEVER হলে ০)
     */
    @Column(name = "current_year", nullable = false)
    private int currentYear;

    /**
     * [EN] Current calendar month slice (0 if reset frequency is YEARLY or NEVER)
     * [BN] বর্তমান ক্যালেন্ডার মাস (রিসেট ফ্রিকোয়েন্সি YEARLY বা NEVER হলে ০)
     */
    @Column(name = "current_month", nullable = false)
    private int currentMonth;

    /**
     * [EN] Last sequentially issued numeric counter value
     * [BN] সর্বশেষ সফলভাবে ইস্যুকৃত ক্রমিক সংখ্যার মান
     */
    @Column(name = "last_sequence_value", nullable = false)
    private long lastSequenceValue;

    /**
     * [EN] UTC timestamp marking the latest sequence increment
     * [BN] সর্বশেষ ক্রমিক সংখ্যা বৃদ্ধির UTC টাইমস্ট্যাম্প
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * [EN] Default constructor initializing initial sequence at zero
     * [BN] ডিফল্ট কনস্ট্রাক্টর—প্রাথমিক ক্রমিক মান শূন্য সেট করে
     */
    public CodeSequenceTracker() {
        this.lastSequenceValue = 0L;
    }

    /**
     * [EN] Parameterized constructor for period tracker initialization
     * [BN] নির্দিষ্ট সময়সীমার ট্র্যাকার তৈরির জন্য প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param tenantId     [EN] Tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType   [EN] Entity type / [BN] এনটিটির ধরন
     * @param currentYear  [EN] Year slice / [BN] বছর
     * @param currentMonth [EN] Month slice / [BN] মাস
     */
    public CodeSequenceTracker(UUID tenantId, String entityType, int currentYear, int currentMonth) {
        this();
        this.tenantId = tenantId;
        this.entityType = entityType;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.lastSequenceValue = 0L;
    }

    /**
     * [EN] Atomically increments the sequence counter by 1 and updates timestamp
     * [BN] অ্যাটমিকালি ক্রমিক সংখ্যা ১ বৃদ্ধি করে এবং টাইমস্ট্যাম্প রিফ্রেশ করে
     *
     * @return [EN] The newly issued incremental value / [BN] নতুন ক্রমিক সংখ্যার মান
     */
    public long incrementAndGet() {
        this.lastSequenceValue++;
        this.updatedAt = Instant.now();
        return this.lastSequenceValue;
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
        this.updatedAt = Instant.now();
    }

    /**
     * [EN] JPA pre-update lifecycle hook: Refreshes updatedAt timestamp
     * [BN] প্রতিবার ডেটাবেজে আপডেটের পূর্বে updatedAt টাইমস্ট্যাম্প রিফ্রেশ করার লাইফসাইকেল হুক
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
