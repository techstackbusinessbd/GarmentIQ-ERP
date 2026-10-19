package com.garments.erp.sequence.repository;

import com.garments.erp.sequence.entity.CodeSequenceTracker;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Atomic Concurrency Code Sequence Tracker Repository (Rule 24)
 * [BN] অ্যাটমিক কনকারেন্সি কোড সিকোয়েন্স ট্র্যাকার রিপোজিটরি (রুল ২৪)
 * =============================================================================
 * [EN] Manages thread-safe sequence incrementation using PostgreSQL row-level
 *      pessimistic write locking (SELECT ... FOR UPDATE) to ensure zero duplicate
 *      codes across high-concurrency cutting, sewing, and carton barcode generation.
 * [BN] পোস্টগ্রিসকিউএল রো-লেভেল পেসিমিস্টিক রাইট লকিংয়ের মাধ্যমে থ্রেড-সেফ ক্রমিক সংখ্যা
 *      বৃদ্ধি নিয়ন্ত্রণ করে, যাতে একযোগে একাধিক রিকোয়েস্টে কোনো ডুপ্লিকেট কোড তৈরি না হয়।
 */
@Repository
public interface CodeSequenceTrackerRepository extends JpaRepository<CodeSequenceTracker, UUID> {

    /**
     * [EN] Finds tracker row applying database pessimistic write lock (SELECT FOR UPDATE)
     * [BN] পেসিমিস্টিক রাইট লক প্রয়োগ করে ট্র্যাকার রো অনুসন্ধান করে (কনকারেন্সি দ্বন্দ্ব মুক্ত)
     *
     * @param tenantId     [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType   [EN] Target entity type / [BN] এনটিটির ধরন
     * @param currentYear  [EN] Year slice / [BN] বছর
     * @param currentMonth [EN] Month slice / [BN] মাস
     * @return [EN] Optional locked tracker / [BN] লককৃত ট্র্যাকার রেকর্ড
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM CodeSequenceTracker t WHERE t.tenantId = :tenantId " +
           "AND t.entityType = :entityType AND t.currentYear = :currentYear " +
           "AND t.currentMonth = :currentMonth")
    Optional<CodeSequenceTracker> findWithPessimisticLock(
            @Param("tenantId") UUID tenantId,
            @Param("entityType") String entityType,
            @Param("currentYear") int currentYear,
            @Param("currentMonth") int currentMonth
    );

    /**
     * [EN] Non-locking query for sequence state inspection and reporting
     * [BN] রিপোর্টিং এবং পর্যবেক্ষণের জন্য নন-লকিং কুয়েরি
     *
     * @param tenantId     [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType   [EN] Target entity type / [BN] এনটিটির ধরন
     * @param currentYear  [EN] Year slice / [BN] বছর
     * @param currentMonth [EN] Month slice / [BN] মাস
     * @return [EN] Optional tracker / [BN] ট্র্যাকার রেকর্ড
     */
    Optional<CodeSequenceTracker> findByTenantIdAndEntityTypeAndCurrentYearAndCurrentMonth(
            UUID tenantId, String entityType, int currentYear, int currentMonth
    );
}
