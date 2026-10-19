package com.garments.erp.core.exception;

import org.springframework.http.HttpStatus;

/**
 * =============================================================================
 * [EN] Base Business Domain Exception for Garments ERP Rules
 * [BN] আরএমজি বিজনেস লজিক ভায়োলেশনের জন্য কাস্টম এক্সেপশন
 * =============================================================================
 * [EN] Thrown when a business rule constraint is violated (e.g. invalid fabric
 *      consumption, marker ratio sum mismatch, over-cutting beyond buyer tolerance).
 * [BN] তৈরি পোশাক খাতের কোনো ব্যবসায়িক বা প্রযুক্তিগত নিয়ম ভঙ্গ হলে (যেমন: ভুল ফেব্রিক
 *      কনজাম্পশন, মার্কার রেশিও অসঙ্গতি, কাটিং টলারেন্স অতিরিক্ত হওয়া) এই এক্সেপশন থ্রো হয়।
 */
public class BusinessException extends RuntimeException {

    /**
     * [EN] Associated HTTP response status (Defaults to 400 Bad Request)
     * [BN] সংশ্লিষ্ট HTTP রেসপন্স স্ট্যাটাস (ডিফল্ট: ৪০০ ব্যাড রিকোয়েস্ট)
     */
    private final HttpStatus status;

    /**
     * [EN] Constructor with human-readable error message and default 400 BAD_REQUEST status
     * [BN] মানবিক এরর মেসেজ ও ডিফল্ট ৪০০ স্ট্যাটাসসহ এক্সেপশন তৈরির কনস্ট্রাক্টর
     *
     * @param message [EN] Business violation detail / [BN] নিয়মভঙ্গের বিবরণ
     */
    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    /**
     * [EN] Constructor with error message and custom HTTP status code
     * [BN] নির্দিষ্ট এরর মেসেজ ও কাস্টম HTTP স্ট্যাটাসসহ এক্সেপশন তৈরির কনস্ট্রাক্টর
     *
     * @param message [EN] Error description / [BN] ত্রুটির বিবরণ
     * @param status  [EN] Target HTTP status / [BN] নির্ধারিত HTTP স্ট্যাটাস
     */
    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    /**
     * [EN] Retrieves the HTTP status associated with this business fault
     * [BN] সংশ্লিষ্ট বিজনেস এক্সেপশনের HTTP স্ট্যাটাস ফেরত দেয়
     *
     * @return [EN] HttpStatus enum constant / [BN] HttpStatus অবজেক্ট
     */
    public HttpStatus getStatus() {
        return status;
    }
}

