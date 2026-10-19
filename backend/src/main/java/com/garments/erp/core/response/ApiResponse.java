package com.garments.erp.core.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * =============================================================================
 * [EN] Standardized Enterprise REST API Response Envelope
 * [BN] স্ট্যান্ডার্ড এন্টারপ্রাইজ REST API রেসপন্স এনভেলপ
 * =============================================================================
 * [EN] Encapsulates all REST API output in a unified contract with execution status,
 *      human-readable messages, typed payload, and UTC timestamp.
 * [BN] সকল REST API রেসপন্সকে একটি সুসংহত কাঠামোর মধ্যে আবদ্ধ করে; এতে রিকোয়েস্টের
 *      স্ট্যাটাস, মানবিক বার্তা, পে-লোড ডেটা ও টাইমস্ট্যাম্প অন্তর্ভুক্ত থাকে।
 *
 * @param <T> [EN] Payload data type / [BN] পে-লোড ডেটার ধরন
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    /**
     * [EN] Operation execution outcome flag (true = success, false = failure)
     * [BN] অপারেশন সফল বা ব্যর্থ হয়েছে কি না তা নির্দেশক বুলিয়ান ফ্ল্যাগ
     */
    private boolean success;

    /**
     * [EN] Human-readable notification message for frontend alert or toast
     * [BN] ফ্রন্টএন্ড টোস্ট বা অ্যালার্টে প্রদর্শনের উপযোগী মানবিক বার্তা
     */
    private String message;

    /**
     * [EN] Response payload carrying domain entity, DTO, or list
     * [BN] এপিআই থেকে প্রেরিত মূল ডেটা (এনটিটি, ডিটিও বা লিস্ট)
     */
    private T data;

    /**
     * [EN] ISO-8601 UTC timestamp recording exact response generation moment
     * [BN] রেসপন্স তৈরির সুনির্দিষ্ট সময় নির্দেশক ISO-8601 UTC টাইমস্ট্যাম্প
     */
    private Instant timestamp;

    /**
     * [EN] Default no-args constructor initializing success flag to true and current timestamp
     * [BN] ডিফল্ট কনস্ট্রাক্টর—যা বাই-ডিফল্ট সফল ফ্ল্যাগ এবং বর্তমান সময় সেট করে
     */
    public ApiResponse() {
        this.success = true;
        this.timestamp = Instant.now();
    }

    /**
     * [EN] Fully parameterized constructor for explicit payload assembly
     * [BN] সকল ফিল্ড স্পষ্টভাবে সেট করার জন্য সম্পূর্ণ প্যারামিটারযুক্ত কনস্ট্রাক্টর
     *
     * @param success   [EN] Outcome flag / [BN] ফলাফল ফ্ল্যাগ
     * @param message   [EN] Status description / [BN] স্ট্যাটাস বার্তা
     * @param data      [EN] Response payload / [BN] রেসপন্স ডেটা
     * @param timestamp [EN] Occurrence instant / [BN] সময়
     */
    public ApiResponse(boolean success, String message, T data, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    /**
     * [EN] Factory method creating a successful response with explicit message and data
     * [BN] ডেটা ও বার্তাসহ সফল রেসপন্স অবজেক্ট তৈরির স্ট্যাটিক ফ্যাক্টরি মেথড
     *
     * @param data    [EN] Response payload / [BN] রেসপন্স ডেটা
     * @param message [EN] Human-readable message / [BN] মানবিক বার্তা
     * @return [EN] Initialized ApiResponse / [BN] তৈরি হওয়া রেসপন্স অবজেক্ট
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }

    /**
     * [EN] Convenience factory method creating a successful response with default message
     * [BN] ডিফল্ট বার্তাসহ সফল রেসপন্স তৈরির সংক্ষিপ্ত ফ্যাক্টরি মেথড
     *
     * @param data [EN] Response payload / [BN] রেসপন্স ডেটা
     * @return [EN] Initialized ApiResponse / [BN] তৈরি হওয়া রেসপন্স অবজেক্ট
     */
    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Request processed successfully");
    }

    /**
     * [EN] Factory method creating an error response without payload
     * [BN] কোনো ডেটা ব্যতিরেকে ব্যর্থতার বার্তা দিয়ে এরর রেসপন্স তৈরির ফ্যাক্টরি মেথড
     *
     * @param message [EN] Failure cause description / [BN] ব্যর্থতার কারণ নির্দেশক বার্তা
     * @return [EN] Failed ApiResponse / [BN] এরর রেসপন্স অবজেক্ট
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now());
    }

    /**
     * [EN] Initiates fluent builder chain for custom response assembly
     * [BN] কাস্টম রেসপন্স গঠনের জন্য ফ্লুয়েন্ট বিল্ডার চেইন শুরু করার মেথড
     *
     * @return [EN] Clean builder instance / [BN] বিল্ডার ইনস্ট্যান্স
     */
    public static <T> ApiResponseBuilder<T> builder() {
        return new ApiResponseBuilder<>();
    }

    /**
     * =========================================================================
     * [EN] Fluent Builder Class for ApiResponse Construction
     * [BN] ApiResponse অবজেক্ট নিরাপদে গঠনের জন্য ফ্লুয়েন্ট বিল্ডার ক্লাস
     * =========================================================================
     */
    public static class ApiResponseBuilder<T> {
        private boolean success = true;
        private String message;
        private T data;
        private Instant timestamp = Instant.now();

        /**
         * [EN] Sets success status flag / [BN] সাফল্য স্ট্যাটাস সেট করে
         */
        public ApiResponseBuilder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        /**
         * [EN] Sets response message / [BN] রেসপন্স বার্তা সেট করে
         */
        public ApiResponseBuilder<T> message(String message) {
            this.message = message;
            return this;
        }

        /**
         * [EN] Sets payload data / [BN] পে-লোড ডেটা সেট করে
         */
        public ApiResponseBuilder<T> data(T data) {
            this.data = data;
            return this;
        }

        /**
         * [EN] Sets custom timestamp / [BN] কাস্টম টাইমস্ট্যাম্প সেট করে
         */
        public ApiResponseBuilder<T> timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        /**
         * [EN] Finalizes and creates immutable ApiResponse instance
         * [BN] বিল্ডার থেকে চূড়ান্ত ApiResponse অবজেক্ট তৈরি করে
         */
        public ApiResponse<T> build() {
            return new ApiResponse<>(this.success, this.message, this.data, this.timestamp);
        }
    }
}


