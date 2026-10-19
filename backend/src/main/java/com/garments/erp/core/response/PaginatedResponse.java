package com.garments.erp.core.response;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * [EN] Standardized Paginated REST API Response for high-density virtualized data grids.
 * Works seamlessly with TanStack Table v8 on the frontend.
 *
 * [BN] পেজিনেশন রেসপন্স এনভেলপ যা ফ্রন্টএন্ডে TanStack Table v8-এর ভার্চুয়ালাইজড গ্রিডে
 * দ্রুতগতিতে হাজার হাজার অর্ডারের ডেটা লোড করতে ব্যবহৃত হয়।
 *
 * @param <T> Content list element type
 */
@Getter
@Builder
public class PaginatedResponse<T> {

    /**
     * [EN] List of items in the current page slice.
     * [BN] বর্তমান পেজে প্রদর্শিত ডেটার তালিকা।
     */
    private final List<T> content;

    /**
     * [EN] Current zero-indexed page number.
     * [BN] বর্তমান পেজ নম্বর।
     */
    private final int page;

    /**
     * [EN] Number of items per page.
     * [BN] প্রতি পেজে আইটেম সংখ্যা।
     */
    private final int size;

    /**
     * [EN] Total number of matching elements across all pages.
     * [BN] ডেটাবেজে মোট মোট আইটেম সংখ্যা।
     */
    private final long totalElements;

    /**
     * [EN] Total number of pages available.
     * [BN] মোট পেজ সংখ্যা।
     */
    private final int totalPages;

    /**
     * [EN] Flag indicating if this is the last page.
     * [BN] এটি সর্বশেষ পেজ কিনা তার ফ্ল্যাগ।
     */
    private final boolean last;

    /**
     * [EN] Converts a Spring Data Page object into a standardized PaginatedResponse.
     * [BN] স্প্রিং ডেটা পেজ অবজেক্টকে স্ট্যান্ডার্ড PaginatedResponse-এ রূপান্তরের হেল্পার।
     */
    public static <T> PaginatedResponse<T> fromPage(Page<T> springPage) {
        return PaginatedResponse.<T>builder()
                .content(springPage.getContent())
                .page(springPage.getNumber())
                .size(springPage.getSize())
                .totalElements(springPage.getTotalElements())
                .totalPages(springPage.getTotalPages())
                .last(springPage.isLast())
                .build();
    }
}
