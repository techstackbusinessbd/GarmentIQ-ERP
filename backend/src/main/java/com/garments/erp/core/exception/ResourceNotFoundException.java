package com.garments.erp.core.exception;

import org.springframework.http.HttpStatus;

/**
 * =============================================================================
 * [EN] Entity / Resource Not Found Exception (404 Not Found)
 * [BN] ডেটাবেজে কোনো রেকর্ড না পাওয়া গেলে নট ফাউন্ড এক্সেপশন (৪০৪)
 * =============================================================================
 * [EN] Thrown when a queried entity (e.g. style, PO, marker, fabric roll) cannot
 *      be located in the database for the given tenant ID.
 * [BN] ডেটাবেজে সংশ্লিষ্ট টেন্যান্টের অধীনে কাঙ্ক্ষিত রেকর্ড (যেমন: স্টাইল, অর্ডার,
 *      মার্কার বা ফেব্রিক রোল) খুঁজে পাওয়া না গেলে এই এক্সেপশন থ্রো করা হয়।
 */
public class ResourceNotFoundException extends BusinessException {

    /**
     * [EN] Formats structured not-found message using entity name and lookup identifier
     * [BN] রিসোর্সের নাম ও আইডি ব্যবহার করে সুনির্দিষ্ট নট-ফাউন্ড মেসেজ তৈরি করে
     *
     * @param resourceName [EN] Name of the entity / [BN] রিসোর্সের নাম (যেমন: Style, Buyer)
     * @param identifier   [EN] ID or lookup key / [BN] আইডি বা সার্চ কি
     */
    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(String.format("%s with identifier '%s' was not found", resourceName, identifier), HttpStatus.NOT_FOUND);
    }

    /**
     * [EN] Constructor with explicit customized not-found message
     * [BN] স্পষ্ট কাস্টম বার্তাসহ নট-ফাউন্ড এক্সেপশন তৈরির কনস্ট্রাক্টর
     *
     * @param message [EN] Explicit error message / [BN] সুনির্দিষ্ট এরর বার্তা
     */
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

