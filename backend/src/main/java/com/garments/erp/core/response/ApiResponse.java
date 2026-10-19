package com.garments.erp.core.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

/**
 * [EN] Standardized Global REST API Response Envelope.
 * Guarantees consistent response structures across all endpoints.
 *
 * [BN] স্ট্যান্ডার্ডাইজড গ্লোবাল রেস্ট এপিআই রেসপন্স এনভেলপ।
 * সফটওয়্যারের প্রতিটি এপিআই রেসপন্সে অভিন্ন ও পরিষ্কার কাঠামো নিশ্চিত করে।
 *
 * @param <T> Payload data type
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    /**
     * [EN] Boolean indicating request success status.
     * [BN] এপিআই রিকোয়েস্ট সফল হয়েছে কিনা তার সত্যতা নির্দেশক।
     */
    private final boolean success;

    /**
     * [EN] Human-readable, professional message in clean English.
     * [BN] সহজ মানবিক ইংরেজি বার্তা যা সরাসরি ইউজার ইন্টারফেসে প্রদর্শনের উপযোগী।
     */
    private final String message;

    /**
     * [EN] Payload data object or list.
     * [BN] এপিআই থেকে প্রাপ্ত মূল ডেটা বা অবজেক্ট।
     */
    private final T data;

    /**
     * [EN] Timestamp when the response was generated (UTC).
     * [BN] রেসপন্স তৈরির সঠিক সময়কাল (UTC)।
     */
    private final Instant timestamp;

    /**
     * [EN] Explicit constructor with @Builder to prevent IDE false-positive ECJ compiler warnings.
     * [BN] এক্সপ্লিসিট কনস্ট্রাক্টরে @Builder ব্যবহার যা আইডিই কম্পাইলারের সিন্থেটিক কনস্ট্রাক্টর এরর প্রতিরোধ করে।
     */
    @Builder
    public ApiResponse(boolean success, String message, T data, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    /**
     * [EN] Convenience static builder for successful response with data and message.
     * [BN] সফল রেসপন্স তৈরির স্ট্যাটিক হেল্পার মেথড।
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    /**
     * [EN] Convenience static builder for successful response without payload data.
     * [BN] ডেটা ছাড়া শুধুমাত্র সফল বার্তা পাঠানোর হেল্পার মেথড।
     */
    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }

    /**
     * [EN] Convenience static builder for failure response with human-readable error.
     * [BN] ব্যর্থ রেসপন্স পাঠানোর জন্য মানবিক এরর মেসেজ হেল্পার মেথড।
     */
    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .timestamp(Instant.now())
                .build();
    }
}
