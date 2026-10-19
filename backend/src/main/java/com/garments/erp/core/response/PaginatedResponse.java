package com.garments.erp.core.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * =============================================================================
 * [EN] Standardized Paginated Data Wrapper for High-Density Grids
 * [BN] এন্টারপ্রাইজ গ্রিড টেবিলের জন্য পেজিনেটেড রেসপন্স এনভেলপ
 * =============================================================================
 * [EN] Wraps Spring Data Page objects into a frontend-friendly JSON structure
 *      powering TanStack Table v8 server-side pagination and infinite scrolling.
 * [BN] স্প্রিং ডেটা Page অবজেক্টকে একটি ফ্রন্টএন্ড-উপযোগী JSON স্ট্রাকচারে মুড়ে দেয়,
 *      যা TanStack Table v8-এর সার্ভার-সাইড পেজিনেশন ও স্ক্রোলিংকে চালিত করে।
 *
 * @param <T> [EN] Item element type / [BN] আইটেম উপাদানের ধরন
 */
@Getter
@Setter
public class PaginatedResponse<T> {

    /**
     * [EN] List of records for the requested page slice
     * [BN] বর্তমান পেজের জন্য রেকর্ড বা ডেটার তালিকা
     */
    private List<T> content;

    /**
     * [EN] Zero-indexed current page number
     * [BN] বর্তমান পেজ নম্বর (শূন্য থেকে গণনা শুরু)
     */
    private int pageNumber;

    /**
     * [EN] Number of records requested per page
     * [BN] প্রতি পেজে প্রদর্শনের জন্য নির্ধারিত রেকর্ড সংখ্যা
     */
    private int pageSize;

    /**
     * [EN] Total number of matching elements across entire database
     * [BN] সম্পূর্ণ ডেটাবেজে সংশ্লিষ্ট কুয়েরির সর্বমোট রেকর্ড সংখ্যা
     */
    private long totalElements;

    /**
     * [EN] Total number of pages calculated from totalElements and pageSize
     * [BN] মোট রেকর্ড ও পেজ সাইজের ভিত্তিতে সর্বমোট পেজ সংখ্যা
     */
    private int totalPages;

    /**
     * [EN] Indicates if this is the first page
     * [BN] এটি প্রথম পেজ কি না নির্দেশক ফ্ল্যাগ
     */
    private boolean isFirst;

    /**
     * [EN] Indicates if this is the last page
     * [BN] এটি সর্বশেষ পেজ কি না নির্দেশক ফ্ল্যাগ
     */
    private boolean isLast;

    /**
     * [EN] Indicates if further pages exist for next slice
     * [BN] পরবর্তী পেজের অস্তিত্ব রয়েছে কি না নির্দেশক ফ্ল্যাগ
     */
    private boolean hasNext;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট প্যারামিটারবিহীন কনস্ট্রাক্টর
     */
    public PaginatedResponse() {
    }

    /**
     * [EN] Fully parameterized constructor initializing all pagination fields
     * [BN] সকল পেজিনেশন মেটাডেটা সেট করার জন্য পূর্ণাঙ্গ কনস্ট্রাক্টর
     *
     * @param content       [EN] Record slice / [BN] রেকর্ডের তালিকা
     * @param pageNumber    [EN] Page index / [BN] পেজ নম্বর
     * @param pageSize      [EN] Page size / [BN] পেজ সাইজ
     * @param totalElements [EN] Total records / [BN] মোট রেকর্ড
     * @param totalPages    [EN] Total pages / [BN] মোট পেজ
     * @param isFirst       [EN] First page flag / [BN] প্রথম পেজ ফ্ল্যাগ
     * @param isLast        [EN] Last page flag / [BN] শেষ পেজ ফ্ল্যাগ
     * @param hasNext       [EN] Has next flag / [BN] পরবর্তী পেজ ফ্ল্যাগ
     */
    public PaginatedResponse(List<T> content, int pageNumber, int pageSize, long totalElements,
                             int totalPages, boolean isFirst, boolean isLast, boolean hasNext) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.isFirst = isFirst;
        this.isLast = isLast;
        this.hasNext = hasNext;
    }

    /**
     * [EN] Factory method converting a Spring Data Page directly into PaginatedResponse
     * [BN] স্প্রিং ডেটার Page অবজেক্ট থেকে সরাসরি PaginatedResponse তৈরির ফ্যাক্টরি মেথড
     *
     * @param page [EN] Spring Data Page instance / [BN] স্প্রিং ডেটা পেজ ইনস্ট্যান্স
     * @param <T>  [EN] Item type / [BN] আইটেম টাইপ
     * @return [EN] Standardized PaginatedResponse / [BN] স্ট্যান্ডার্ড পেজিনেটেড রেসপন্স
     */
    public static <T> PaginatedResponse<T> from(Page<T> page) {
        return new PaginatedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.hasNext()
        );
    }

    /**
     * [EN] Initiates fluent builder chain for paginated response
     * [BN] পেজিনেটেড রেসপন্সের জন্য ফ্লুয়েন্ট বিল্ডার চেইন শুরু করে
     */
    public static <T> PaginatedResponseBuilder<T> builder() {
        return new PaginatedResponseBuilder<>();
    }

    /**
     * =========================================================================
     * [EN] Fluent Builder Class for PaginatedResponse
     * [BN] PaginatedResponse তৈরির ফ্লুয়েন্ট বিল্ডার ক্লাস
     * =========================================================================
     */
    public static class PaginatedResponseBuilder<T> {
        private List<T> content;
        private int pageNumber;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean isFirst;
        private boolean isLast;
        private boolean hasNext;

        /**
         * [EN] Sets list of page items / [BN] পেজের আইটেম তালিকা সেট করে
         */
        public PaginatedResponseBuilder<T> content(List<T> content) {
            this.content = content;
            return this;
        }

        /**
         * [EN] Sets page number / [BN] পেজ নম্বর সেট করে
         */
        public PaginatedResponseBuilder<T> pageNumber(int pageNumber) {
            this.pageNumber = pageNumber;
            return this;
        }

        /**
         * [EN] Sets page size / [BN] পেজ সাইজ সেট করে
         */
        public PaginatedResponseBuilder<T> pageSize(int pageSize) {
            this.pageSize = pageSize;
            return this;
        }

        /**
         * [EN] Sets total elements count / [BN] মোট এলিমেন্ট সংখ্যা সেট করে
         */
        public PaginatedResponseBuilder<T> totalElements(long totalElements) {
            this.totalElements = totalElements;
            return this;
        }

        /**
         * [EN] Sets total pages count / [BN] মোট পেজ সংখ্যা সেট করে
         */
        public PaginatedResponseBuilder<T> totalPages(int totalPages) {
            this.totalPages = totalPages;
            return this;
        }

        /**
         * [EN] Sets is-first-page flag / [BN] প্রথম পেজ কি না সেট করে
         */
        public PaginatedResponseBuilder<T> isFirst(boolean isFirst) {
            this.isFirst = isFirst;
            return this;
        }

        /**
         * [EN] Sets is-last-page flag / [BN] শেষ পেজ কি না সেট করে
         */
        public PaginatedResponseBuilder<T> isLast(boolean isLast) {
            this.isLast = isLast;
            return this;
        }

        /**
         * [EN] Sets has-next-page flag / [BN] পরবর্তী পেজ আছে কি না সেট করে
         */
        public PaginatedResponseBuilder<T> hasNext(boolean hasNext) {
            this.hasNext = hasNext;
            return this;
        }

        /**
         * [EN] Builds and returns configured PaginatedResponse
         * [BN] চূড়ান্ত PaginatedResponse অবজেক্ট তৈরি করে রিটার্ন করে
         */
        public PaginatedResponse<T> build() {
            return new PaginatedResponse<>(
                    this.content, this.pageNumber, this.pageSize,
                    this.totalElements, this.totalPages,
                    this.isFirst, this.isLast, this.hasNext
            );
        }
    }
}


