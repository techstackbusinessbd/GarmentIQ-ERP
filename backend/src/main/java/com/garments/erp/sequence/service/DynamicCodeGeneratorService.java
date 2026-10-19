package com.garments.erp.sequence.service;

import com.garments.erp.sequence.entity.CodeSequenceTemplate;
import com.garments.erp.sequence.entity.CodeSequenceTracker;
import com.garments.erp.sequence.entity.EntityTypeCode;
import com.garments.erp.sequence.entity.ResetFrequency;
import com.garments.erp.sequence.repository.CodeSequenceTemplateRepository;
import com.garments.erp.sequence.repository.CodeSequenceTrackerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * =============================================================================
 * [EN] Dynamic Auto-Code Generation and Token Resolution Engine (Rule 24)
 * [BN] ডাইনামিক অটো-কোড জেনারেশন ও টোকেন রেজোলিউশন ইঞ্জিন (রুল ২৪)
 * =============================================================================
 * [EN] Generates 100% system auto-generated identifiers across all business entities.
 *      Supports configurable admin formatting templates, zero race conditions via
 *      pessimistic row locking, and dynamic token replacements ({PREFIX}, {YYYY}, {SEQ:N}).
 * [BN] সকল ব্যবসায়িক এনটিটির জন্য ১০০% সিস্টেম স্বয়ংক্রিয় ইউনিক কোড তৈরি করে।
 *      অ্যাডমিন প্যানেল কনফিগারেবল ফরম্যাট, পেসিমিস্টিক রো লকের মাধ্যমে জিরো রেস-কন্ডিশন
 *      এবং ডাইনামিক টোকেন রিপ্লেসমেন্ট ({PREFIX}, {YYYY}, {SEQ:N}) সমর্থন করে।
 */
@Slf4j
@Service
public class DynamicCodeGeneratorService {

    private static final Pattern SEQ_TOKEN_PATTERN = Pattern.compile("\\{SEQ(?::(\\d+))?\\}");

    private final CodeSequenceTemplateRepository templateRepository;
    private final CodeSequenceTrackerRepository trackerRepository;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param templateRepository [EN] Code sequence template repository / [BN] সিকোয়েন্স টেমপ্লেট রিপোজিটরি
     * @param trackerRepository  [EN] Atomic sequence tracker repository / [BN] এটমিক ট্র্যাকার রিপোজিটরি
     */
    public DynamicCodeGeneratorService(
            CodeSequenceTemplateRepository templateRepository,
            CodeSequenceTrackerRepository trackerRepository) {
        this.templateRepository = templateRepository;
        this.trackerRepository = trackerRepository;
    }

    /**
     * [EN] Generates next atomic unique business code for an entity within tenant
     * [BN] টেন্যান্টের অধীনে নির্দিষ্ট এনটিটির জন্য পরবর্তী ইউনিক কোড তৈরি করে
     *
     * @param tenantId   [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType [EN] Target entity type enum / [BN] এনটিটির ধরন এনাম
     * @return [EN] Fully resolved formatted code string / [BN] চূড়ান্ত ফরম্যাটকৃত কোড স্ট্রিং
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized String generateNextCode(UUID tenantId, EntityTypeCode entityType) {
        return generateNextCode(tenantId, entityType, "GARMENT");
    }

    /**
     * [EN] Generates next atomic code incorporating explicit tenant business code
     * [BN] সুনির্দিষ্ট টেন্যান্ট কোড অন্তর্ভুক্ত করে পরবর্তী ইউনিক কোড তৈরি করে
     *
     * @param tenantId   [EN] Scoped tenant UUID / [BN] টেন্যান্ট আইডি
     * @param entityType [EN] Target entity type enum / [BN] এনটিটির ধরন এনাম
     * @param tenantCode [EN] Business tenant code / [BN] টেন্যান্টের ইউনিক কোড
     * @return [EN] Formatted business code / [BN] ফরম্যাটকৃত কোড
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized String generateNextCode(UUID tenantId, EntityTypeCode entityType, String tenantCode) {
        LocalDate now = LocalDate.now();
        CodeSequenceTemplate template = resolveTemplate(tenantId, entityType);

        int yearSlice = resolveYearSlice(template.getResetFrequency(), now);
        int monthSlice = resolveMonthSlice(template.getResetFrequency(), now);

        long nextSequence = getNextSequenceValue(tenantId, entityType.getCode(), yearSlice, monthSlice);

        return formatCode(template.getPattern(), template.getPrefix(), template.getPaddingLength(),
                tenantCode, nextSequence, now);
    }

    /**
     * [EN] Renders a live preview of a code pattern for Admin Panel configuration
     * [BN] অ্যাডমিন প্যানেল কনফিগারেশনের জন্য প্যাটার্নের লাইভ প্রিভিউ প্রদর্শন করে
     *
     * @param pattern       [EN] Pattern to evaluate / [BN] মূল্যায়নযোগ্য প্যাটার্ন
     * @param prefix        [EN] Module prefix / [BN] মডিউল প্রিফিক্স
     * @param paddingLength [EN] Sequence padding digits / [BN] সিকোয়েন্স প্যাডিং ডিজিট
     * @param tenantCode    [EN] Sample tenant code / [BN] নমুনা টেন্যান্ট কোড
     * @return [EN] Rendered sample code string / [BN] রেন্ডারকৃত নমুনা কোড
     */
    public String previewPattern(String pattern, String prefix, int paddingLength, String tenantCode) {
        LocalDate now = LocalDate.now();
        return formatCode(pattern, prefix, paddingLength, tenantCode, 1L, now);
    }

    /**
     * [EN] Resolves active template or instantiates sensible default template
     * [BN] সক্রিয় টেমপ্লেট খুঁজে বের করে বা ডিফল্ট টেমপ্লেট প্রস্তুত করে
     */
    private CodeSequenceTemplate resolveTemplate(UUID tenantId, EntityTypeCode entityType) {
        return templateRepository.findByTenantIdAndEntityTypeAndIsActiveTrue(tenantId, entityType.getCode())
                .orElseGet(() -> createDefaultTemplate(tenantId, entityType));
    }

    /**
     * [EN] Creates default sequence template based on entity type guidelines (Rule 24)
     * [BN] রুল ২৪ অনুযায়ী এনটিটি টাইপের ডিফল্ট সিকোয়েন্স টেমপ্লেট তৈরি করে
     */
    private CodeSequenceTemplate createDefaultTemplate(UUID tenantId, EntityTypeCode entityType) {
        return switch (entityType) {
            case BUYER -> new CodeSequenceTemplate(tenantId, "BUYER", "BYR-{SEQ:4}", "BYR", 4, ResetFrequency.NEVER);
            case STYLE -> new CodeSequenceTemplate(tenantId, "STYLE", "STY-{YYYY}-{SEQ:5}", "STY", 5, ResetFrequency.YEARLY);
            case PO -> new CodeSequenceTemplate(tenantId, "PO", "PO-{YYYY}{MM}-{SEQ:4}", "PO", 4, ResetFrequency.MONTHLY);
            case CUTTING_ORDER -> new CodeSequenceTemplate(tenantId, "CUTTING_ORDER", "CUT-{YYYY}{MM}-{SEQ:4}", "CUT", 4, ResetFrequency.MONTHLY);
            case BUNDLE -> new CodeSequenceTemplate(tenantId, "BUNDLE", "BDL-{YYYY}-{SEQ:7}", "BDL", 7, ResetFrequency.YEARLY);
            case WASH_CHALLAN -> new CodeSequenceTemplate(tenantId, "WASH_CHALLAN", "WSH-{YYYY}-{SEQ:4}", "WSH", 4, ResetFrequency.YEARLY);
            case FINISHING_CARTON -> new CodeSequenceTemplate(tenantId, "FINISHING_CARTON", "CTN-{YYYY}-{SEQ:6}", "CTN", 6, ResetFrequency.YEARLY);
            case COMMERCIAL_INVOICE -> new CodeSequenceTemplate(tenantId, "COMMERCIAL_INVOICE", "EXP-INV-{YYYY}-{SEQ:4}", "EXP-INV", 4, ResetFrequency.YEARLY);
            default -> new CodeSequenceTemplate(tenantId, entityType.getCode(), entityType.getCode() + "-{YYYY}-{SEQ:5}", entityType.getCode(), 5, ResetFrequency.YEARLY);
        };
    }

    /**
     * [EN] Retrieves next atomic sequence counter using row-level locking
     * [BN] রো-লেভেল লকিং প্রয়োগ করে পরবর্তী অ্যাটমিক ক্রমিক মান ইস্যু করে
     */
    private long getNextSequenceValue(UUID tenantId, String entityType, int yearSlice, int monthSlice) {
        Optional<CodeSequenceTracker> trackerOpt = trackerRepository.findWithPessimisticLock(
                tenantId, entityType, yearSlice, monthSlice);

        CodeSequenceTracker tracker;
        if (trackerOpt.isPresent()) {
            tracker = trackerOpt.get();
        } else {
            // [EN] Initialize new period tracker starting at 0
            // [BN] নতুন সময়সীমার ট্র্যাকার শুরু করা হলো
            tracker = new CodeSequenceTracker(tenantId, entityType, yearSlice, monthSlice);
        }

        long issuedValue = tracker.incrementAndGet();
        trackerRepository.saveAndFlush(tracker);
        return issuedValue;
    }

    /**
     * [EN] Computes year slice based on reset frequency
     * [BN] রিসেট ফ্রিকোয়েন্সি অনুযায়ী বছর স্লাইস নির্ধারণ করে
     */
    private int resolveYearSlice(ResetFrequency frequency, LocalDate now) {
        return (frequency == ResetFrequency.NEVER) ? 0 : now.getYear();
    }

    /**
     * [EN] Computes month slice based on reset frequency
     * [BN] রিসেট ফ্রিকোয়েন্সি অনুযায়ী মাস স্লাইস নির্ধারণ করে
     */
    private int resolveMonthSlice(ResetFrequency frequency, LocalDate now) {
        return (frequency == ResetFrequency.MONTHLY) ? now.getMonthValue() : 0;
    }

    /**
     * [EN] Core token replacement engine resolving dynamic tokens into final formatted code
     * [BN] ডায়নামিক টোকেন প্রতিস্থাপন করে চূড়ান্ত কোড তৈরি করার কোর মেথড
     */
    private String formatCode(String pattern, String prefix, int defaultPadding,
                              String tenantCode, long sequenceValue, LocalDate now) {
        if (pattern == null || pattern.isBlank()) {
            pattern = "{PREFIX}-{YYYY}-{SEQ:5}";
        }

        String resolved = pattern;
        resolved = resolved.replace("{PREFIX}", prefix != null ? prefix : "");
        resolved = resolved.replace("{YYYY}", String.format("%04d", now.getYear()));
        resolved = resolved.replace("{YY}", String.format("%02d", now.getYear() % 100));
        resolved = resolved.replace("{MM}", String.format("%02d", now.getMonthValue()));
        resolved = resolved.replace("{DD}", String.format("%02d", now.getDayOfMonth()));
        resolved = resolved.replace("{TENANT}", tenantCode != null ? tenantCode : "");

        Matcher matcher = SEQ_TOKEN_PATTERN.matcher(resolved);
        if (matcher.find()) {
            String padGroup = matcher.group(1);
            int padding = (padGroup != null) ? Integer.parseInt(padGroup) : defaultPadding;
            String formattedSeq = String.format("%0" + padding + "d", sequenceValue);
            resolved = matcher.replaceFirst(formattedSeq);
        }

        return resolved;
    }
}
