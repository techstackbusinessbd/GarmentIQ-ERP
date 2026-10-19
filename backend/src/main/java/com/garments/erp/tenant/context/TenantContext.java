package com.garments.erp.tenant.context;

import java.util.UUID;

/**
 * =============================================================================
 * [EN] Multi-Tenant Request Execution Context Holder
 * [BN] মাল্টি-টেন্যান্ট রিকোয়েস্ট এক্সিকিউশন কনটেক্সট হোল্ডার
 * =============================================================================
 * [EN] Manages the tenant isolation boundary per HTTP request thread. Stores the
 *      active tenant UUID resolved from JWT claims or X-Tenant-ID headers,
 *      allowing all downstream services and JPA repositories to query tenant-scoped data.
 * [BN] প্রতিটি HTTP রিকোয়েস্ট থ্রেডের জন্য টেন্যান্ট আইসোলেশন নিয়ন্ত্রণ করে।
 *      JWT টোকেন বা X-Tenant-ID হেডার থেকে প্রাপ্ত সক্রিয় টেন্যান্টের UUID সংরক্ষণ
 *      করে, যাতে পরবর্তী সকল সার্ভিস ও ডেটাবেজ কুয়েরি শুধু ওই টেন্যান্টের ডেটা প্রসেস করে।
 */
public final class TenantContext {

    /**
     * [EN] ThreadLocal storage bound to current virtual/platform request thread
     * [BN] বর্তমান রিকোয়েস্ট থ্রেডের সাথে সংযুক্ত ThreadLocal মেমরি স্টোরেজ
     */
    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    /**
     * [EN] Private constructor preventing instantiation of utility context class
     * [BN] ইউটিলিটি ক্লাসের অবজেক্ট তৈরি রোধে প্রাইভেট কনস্ট্রাক্টর
     */
    private TenantContext() {
    }

    /**
     * [EN] Sets the active tenant identifier for the current request execution context
     * [BN] বর্তমান রিকোয়েস্ট কনটেক্সটের জন্য সক্রিয় টেন্যান্ট আইডি সেট করে
     *
     * @param tenantId [EN] Active tenant UUID / [BN] সক্রিয় টেন্যান্টের ইউনিক আইডি
     */
    public static void setTenantId(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    /**
     * [EN] Retrieves the active tenant identifier bound to the current execution thread
     * [BN] বর্তমান এক্সিকিউশন থ্রেডে সংযুক্ত সক্রিয় টেন্যান্ট আইডি ফেরত দেয়
     *
     * @return [EN] Current tenant UUID or null / [BN] সক্রিয় টেন্যান্টের UUID অথবা null
     */
    public static UUID getTenantId() {
        return CURRENT_TENANT.get();
    }

    /**
     * [EN] Clears the ThreadLocal context memory to prevent thread-pool memory leaks
     * [BN] থ্রেড-পুল মেমরি লিক রোধ করতে ThreadLocal কনটেক্সট পরিষ্কার করে
     */
    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
