package com.garments.erp.tenant.context;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for Multi-Tenant Request Execution Context
 * [BN] মাল্টি-টেন্যান্ট রিকোয়েস্ট এক্সিকিউশন কনটেক্সটের ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Validates ThreadLocal thread-isolation, tenant ID storage, retrieval,
 *      and proper cleanup to guarantee zero cross-tenant memory leakage.
 * [BN] ThreadLocal থ্রেড আইসোলেশন, টেন্যান্ট আইডি সংরক্ষণ, পুনরুদ্ধার এবং উপযুক্ত
 *      মেমরি পরিচ্ছন্নকরণ যাচাই করে যাতে কোনো ক্রস-টেন্যান্ট ডেটা ফাঁস না হয়।
 */
class TenantContextTest {

    private UUID sampleTenantId;

    @BeforeEach
    void setUp() {
        sampleTenantId = UUID.randomUUID();
        TenantContext.clear();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    /**
     * [EN] Tests that tenant ID can be set and retrieved in the same thread
     * [BN] যাচাই করে যে একই থ্রেডে টেন্যান্ট আইডি সেট এবং রিট্রিভ করা যায়
     */
    @Test
    @DisplayName("Should successfully set and retrieve tenant ID in current thread")
    void testSetAndGetTenantId() {
        TenantContext.setTenantId(sampleTenantId);
        assertEquals(sampleTenantId, TenantContext.getTenantId(),
                "Tenant ID retrieved from context must match the set UUID");
    }

    /**
     * [EN] Tests that clear() removes tenant ID from ThreadLocal context
     * [BN] যাচাই করে যে clear() মেথড ThreadLocal কনটেক্সট থেকে আইডি মুছে ফেলে
     */
    @Test
    @DisplayName("Should clear tenant context and return null after clear()")
    void testClearTenantContext() {
        TenantContext.setTenantId(sampleTenantId);
        assertNotNull(TenantContext.getTenantId(), "Tenant ID should be present before clear");

        TenantContext.clear();
        assertNull(TenantContext.getTenantId(), "Tenant ID must be null after clear()");
    }

    /**
     * [EN] Tests thread isolation to ensure different threads do not share tenant contexts
     * [BN] ভিন্ন থ্রেডের মধ্যে টেন্যান্ট কনটেক্সট পৃথক থাকা (আইসোলেশন) নিশ্চিত করে
     */
    @Test
    @DisplayName("Should guarantee strict thread isolation between concurrent threads")
    void testThreadIsolation() throws InterruptedException {
        UUID mainThreadTenantId = UUID.randomUUID();
        UUID workerThreadTenantId = UUID.randomUUID();

        TenantContext.setTenantId(mainThreadTenantId);

        AtomicReference<UUID> capturedWorkerTenant = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);

        Thread worker = new Thread(() -> {
            try {
                TenantContext.setTenantId(workerThreadTenantId);
                capturedWorkerTenant.set(TenantContext.getTenantId());
            } finally {
                TenantContext.clear();
                latch.countDown();
            }
        });

        worker.start();
        latch.await();

        // [EN] Worker thread must see its own tenant ID
        // [BN] ওয়ার্কার থ্রেড তার নিজস্ব টেন্যান্ট আইডি দেখতে পাবে
        assertEquals(workerThreadTenantId, capturedWorkerTenant.get(),
                "Worker thread must observe its own isolated tenant ID");

        // [EN] Main thread must still retain its own tenant ID unaltered
        // [BN] মেইন থ্রেড এখনও তার নিজস্ব টেন্যান্ট আইডি অপরিবর্তিত রাখবে
        assertEquals(mainThreadTenantId, TenantContext.getTenantId(),
                "Main thread tenant ID must remain completely unaffected by worker thread");
    }
}
