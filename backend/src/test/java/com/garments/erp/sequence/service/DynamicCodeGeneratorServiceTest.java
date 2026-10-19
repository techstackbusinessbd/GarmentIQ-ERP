package com.garments.erp.sequence.service;

import com.garments.erp.sequence.entity.CodeSequenceTemplate;
import com.garments.erp.sequence.entity.CodeSequenceTracker;
import com.garments.erp.sequence.entity.EntityTypeCode;
import com.garments.erp.sequence.entity.ResetFrequency;
import com.garments.erp.sequence.repository.CodeSequenceTemplateRepository;
import com.garments.erp.sequence.repository.CodeSequenceTrackerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for Dynamic Code Generator Service (Rule 24)
 * [BN] ডাইনামিক কোড জেনারেটর সার্ভিসের ইউনিট টেস্ট স্যুট (রুল ২৪)
 * =============================================================================
 * [EN] Validates pattern token resolution, atomic incrementation, period slicing,
 *      and real-time preview rendering for the Admin Panel code configuration.
 * [BN] প্যাটার্ন টোকেন রেজোলিউশন, অ্যাটমিক ইনক্রিমেন্ট, পিরিয়ড স্লাইসিং এবং
 *      অ্যাডমিন প্যানেল কোড কনফিগারেশনের রিয়েল-টাইম প্রিভিউ রেন্ডারিং যাচাই করে।
 */
@ExtendWith(MockitoExtension.class)
class DynamicCodeGeneratorServiceTest {

    @Mock
    private CodeSequenceTemplateRepository templateRepository;

    @Mock
    private CodeSequenceTrackerRepository trackerRepository;

    @InjectMocks
    private DynamicCodeGeneratorService codeGeneratorService;

    private UUID tenantId;
    private int currentYear;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        currentYear = LocalDate.now().getYear();
    }

    /**
     * [EN] Tests pattern preview rendering with dynamic {YYYY} and {SEQ:5} tokens
     * [BN] ডাইনামিক {YYYY} ও {SEQ:5} টোকেন দিয়ে প্রিভিউ রেন্ডারিং যাচাই
     */
    @Test
    @DisplayName("Should accurately render live preview for Style code template")
    void testPreviewPatternStyle() {
        String pattern = "STY-{YYYY}-{SEQ:5}";
        String preview = codeGeneratorService.previewPattern(pattern, "STY", 5, "TEXTECH");

        String expected = String.format("STY-%04d-00001", currentYear);
        assertEquals(expected, preview, "Preview should match expected formatted style code");
    }

    /**
     * [EN] Tests pattern preview with custom tenant prefix and 2-digit year {YY}
     * [BN] কাস্টম টেন্যান্ট প্রিফিক্স এবং ২-ডিজিটের বছর {YY} দিয়ে প্রিভিউ যাচাই
     */
    @Test
    @DisplayName("Should accurately resolve {TENANT} and {YY} in custom pattern")
    void testPreviewPatternCustomTenant() {
        String pattern = "{TENANT}/{YY}/CUT-{SEQ:3}";
        String preview = codeGeneratorService.previewPattern(pattern, "CUT", 3, "TEXTECH");

        int yy = currentYear % 100;
        String expected = String.format("TEXTECH/%02d/CUT-001", yy);
        assertEquals(expected, preview, "Preview should resolve {TENANT} and {YY} correctly");
    }

    /**
     * [EN] Tests code generation when a template and existing tracker row exist
     * [BN] ডেটাবেজে টেমপ্লেট ও ট্র্যাকার থাকলে কোড জেনারেশন যাচাই (যেমন: STY-2026-00042)
     */
    @Test
    @DisplayName("Should increment existing tracker and produce formatted code")
    void testGenerateNextCodeWithExistingTracker() {
        // [EN] Arrange: Mock template for STYLE
        // [BN] স্টাইল টেমপ্লেট মক করা হলো
        CodeSequenceTemplate template = new CodeSequenceTemplate(
                tenantId, "STYLE", "STY-{YYYY}-{SEQ:5}", "STY", 5, ResetFrequency.YEARLY);
        when(templateRepository.findByTenantIdAndEntityTypeAndIsActiveTrue(eq(tenantId), eq("STYLE")))
                .thenReturn(Optional.of(template));

        // [EN] Arrange: Mock existing tracker with last sequence value 41
        // [BN] পূর্বের ক্রমিক মান ৪১ সহ ট্র্যাকার মক করা হলো
        CodeSequenceTracker tracker = new CodeSequenceTracker(tenantId, "STYLE", currentYear, 0);
        tracker.setLastSequenceValue(41L);
        when(trackerRepository.findWithPessimisticLock(eq(tenantId), eq("STYLE"), eq(currentYear), eq(0)))
                .thenReturn(Optional.of(tracker));
        when(trackerRepository.saveAndFlush(any(CodeSequenceTracker.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // [EN] Act: Generate code / [BN] কোড তৈরি করা হলো
        String generatedCode = codeGeneratorService.generateNextCode(tenantId, EntityTypeCode.STYLE);

        // [EN] Assert: Must be STY-2026-00042
        // [BN] ফলাফল হবে STY-২০২৬-০০০৪২
        String expected = String.format("STY-%04d-00042", currentYear);
        assertEquals(expected, generatedCode, "Generated code must increment sequence to 42");
        verify(trackerRepository, times(1)).saveAndFlush(tracker);
    }

    /**
     * [EN] Tests code generation when no tracker exists (initialization at 1)
     * [BN] পূর্বে কোনো ট্র্যাকার না থাকলে নতুন কাউন্টার ১ থেকে শুরু হওয়া যাচাই
     */
    @Test
    @DisplayName("Should initialize new tracker at 1 when no previous sequence exists")
    void testGenerateNextCodeInitialSequence() {
        when(templateRepository.findByTenantIdAndEntityTypeAndIsActiveTrue(eq(tenantId), eq("PO")))
                .thenReturn(Optional.empty()); // Triggers default PO template

        when(trackerRepository.findWithPessimisticLock(eq(tenantId), eq("PO"), anyInt(), anyInt()))
                .thenReturn(Optional.empty());
        when(trackerRepository.saveAndFlush(any(CodeSequenceTracker.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        String generatedCode = codeGeneratorService.generateNextCode(tenantId, EntityTypeCode.PO);

        int currentMonth = LocalDate.now().getMonthValue();
        String expected = String.format("PO-%04d%02d-0001", currentYear, currentMonth);
        assertEquals(expected, generatedCode, "First PO code must start with sequence 0001");
        verify(trackerRepository, times(1)).saveAndFlush(any(CodeSequenceTracker.class));
    }
}
