package com.garments.erp.user.entity;

/**
 * =============================================================================
 * [EN] User Account Operational Lifecycle Status Enumeration
 * [BN] ব্যবহারকারী অ্যাকাউন্টের কার্যকারিতা স্ট্যাটাস এনাম
 * =============================================================================
 * [EN] Dictates the current access eligibility of a user account:
 *      - ACTIVE: Full access according to granted roles and permissions.
 *      - INACTIVE: Temporarily deactivated (e.g. employee on long leave).
 *      - SUSPENDED: Administrative restriction due to policy breach.
 *      - LOCKED: Account locked after consecutive failed password attempts.
 * [BN] ব্যবহারকারীর অ্যাকাউন্ট সক্রিয়তা এবং লগইন যোগ্যতা নির্ধারণ করে:
 *      - ACTIVE: অনুমোদিত রোল ও পারমিশন অনুযায়ী সম্পূর্ণ প্রবেশাধিকার।
 *      - INACTIVE: সাময়িক নিষ্ক্রিয় (যেমন: দীর্ঘ ছুটিতে থাকা কর্মী)।
 *      - SUSPENDED: নীতিমালা লঙ্ঘনের কারণে সাময়িক স্থগিত।
 *      - LOCKED: ভুল পাসওয়ার্ড চেষ্টার কারণে লককৃত অ্যাকাউন্ট।
 */
public enum UserStatus {

    /**
     * [EN] Account is fully operational and permitted to authenticate
     * [BN] অ্যাকাউন্টটি সম্পূর্ণ সক্রিয় এবং লগইনের জন্য অনুমোদিত
     */
    ACTIVE,

    /**
     * [EN] Account is disabled or deactivated by organization
     * [BN] প্রতিষ্ঠান কর্তৃক সাময়িকভাবে নিষ্ক্রিয় করা অ্যাকাউন্ট
     */
    INACTIVE,

    /**
     * [EN] Account suspended pending administrative or security review
     * [BN] প্রশাসনিক বা সিকিউরিটি পর্যালোচনার জন্য স্থগিতকৃত অ্যাকাউন্ট
     */
    SUSPENDED,

    /**
     * [EN] Account locked due to repeated authentication failures
     * [BN] একাধিকবার ভুল পাসওয়ার্ড প্রদানের কারণে লক হওয়া অ্যাকাউন্ট
     */
    LOCKED
}
