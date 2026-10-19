package com.garments.erp.sequence.entity;

/**
 * =============================================================================
 * [EN] Sequence Counter Reset Frequency Enumeration
 * [BN] সিকোয়েন্স কাউন্টার রিসেট ফ্রিকোয়েন্সি এনাম
 * =============================================================================
 * [EN] Dictates when the incremental numeric counter resets back to 1.
 *      - NEVER: Continues monotonically indefinitely (e.g. Buyer code BYR-0001, BYR-0002).
 *      - YEARLY: Resets to 1 at the start of each calendar year (e.g. Style STY-2026-00001).
 *      - MONTHLY: Resets to 1 at the start of each month (e.g. PO-202610-0001).
 *      - DAILY: Resets to 1 at midnight each day (e.g. Cutting CUT-20261019-001).
 * [BN] ক্রমিক সংখ্যা কখন পুনরায় ১ থেকে শুরু হবে তা নির্ধারণ করে:
 *      - NEVER: কখনও রিসেট হয় না, ধারাবাহিকভাবে বাড়তে থাকে।
 *      - YEARLY: প্রতি ক্যালেন্ডার বছরের শুরুতে ১-এ রিসেট হয়।
 *      - MONTHLY: প্রতি নতুন মাসের শুরুতে ১-এ রিসেট হয়।
 *      - DAILY: প্রতিদিন মধ্যরাতে ১-এ রিসেট হয়।
 */
public enum ResetFrequency {

    /**
     * [EN] Counter never resets; increases monotonically forever
     * [BN] কাউন্টার কখনও রিসেট হয় না, নিরবচ্ছিন্নভাবে বৃদ্ধি পায়
     */
    NEVER,

    /**
     * [EN] Counter resets to 1 at the beginning of each calendar year (Jan 1)
     * [BN] প্রতি নতুন বছরের শুরুতে কাউন্টার ১-এ রিসেট হয়
     */
    YEARLY,

    /**
     * [EN] Counter resets to 1 at the beginning of each calendar month (1st day)
     * [BN] প্রতি নতুন মাসের শুরুতে কাউন্টার ১-এ রিসেট হয়
     */
    MONTHLY,

    /**
     * [EN] Counter resets to 1 at 00:00:00 every calendar day
     * [BN] প্রতিদিন মধ্যরাতে কাউন্টার ১-এ রিসেট হয়
     */
    DAILY
}
