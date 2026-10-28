package com.garments.erp.core.exception;

import com.garments.erp.core.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * =============================================================================
 * [EN] Global REST API Exception Handler with Human-Readable Responses
 * [BN] সেন্ট্রাল এক্সেপশন ও মানবিক এরর মেসেজ হ্যান্ডলার
 * =============================================================================
 * [EN] Intercepts uncaught runtime exceptions across all REST controllers, masks
 *      internal database/framework stack traces to protect system security, and
 *      converts them into standardized ApiResponse envelopes with user-friendly text.
 * [BN] সিস্টেমের সকল কন্ট্রোলারে ঘটা আনহ্যান্ডল্ড এক্সেপশনগুলোকে ইন্টারসেপ্ট করে,
 *      সিকিউরিটির স্বার্থে ডেটাবেজ ও ফ্রেমওয়ার্কের স্ট্যাকট্রেস গোপন রাখে এবং
 *      ফ্রন্টএন্ডের জন্য স্ট্যান্ডার্ড ApiResponse এনভেলপে মানবিক বার্তা ফেরত পাঠায়।
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * [EN] Handles custom business domain exceptions with explicit HTTP statuses
     * [BN] ব্যবসায়িক যুক্তির ব্যত্যয় ঘটলে নির্দিষ্ট HTTP স্ট্যাটাসসহ এরর রেসপন্স তৈরি করে
     *
     * @param ex [EN] Business domain exception / [BN] বিজনেস এক্সেপশন ইনস্ট্যান্স
     * @return [EN] Response entity with error envelope / [BN] এরর রেসপন্স এনটিটি
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("Business domain exception: {}", ex.getMessage());
        HttpStatus status = ex.getStatus() != null ? ex.getStatus() : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * [EN] Handles Bean Validation failures (e.g. @NotNull, @NotBlank, @Min, @Size)
     * [BN] ইনপুট ডেটা ভ্যালিডেশন ব্যর্থ হলে কোন ফিল্ডে কী ভুল হয়েছে তার ম্যাপসহ রেসপন্স দেয়
     *
     * @param ex [EN] Validation exception / [BN] মেথড আর্গুমেন্ট ভ্যালিডেশন এক্সেপশন
     * @return [EN] 422 Unprocessable Entity with field errors / [BN] ফিল্ড এররসহ রেসপন্স
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        log.warn("Input validation failed on {} fields", errors.size());
        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Validation failed. Please verify the submitted data.")
                .data(errors)
                .build();
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
    }

    /**
     * [EN] Handles JPA optimistic concurrency conflicts when two users update the same record
     * [BN] একই সাথে দুজন ইউজার একটি রেকর্ড আপডেট করতে গেলে ডেটা ওভাররাইট রোধে কনফ্লিক্ট হ্যান্ডল করে
     *
     * @param ex [EN] Concurrency conflict exception / [BN] অপটিমিস্টিক লক এক্সেপশন
     * @return [EN] 409 Conflict with reload instruction / [BN] রিলোড পরামর্শসহ রেসপন্স
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ApiResponse<Void>> handleOptimisticLockException(OptimisticLockingFailureException ex) {
        log.warn("Optimistic concurrency conflict detected: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Record was modified by another user. Please reload and try again."));
    }

    /**
     * [EN] Handles Spring Security authorization rejections (Insufficient privileges)
     * [BN] নির্দিষ্ট রিসোর্সে ইউজারের পর্যাপ্ত রোল বা পারমিশন না থাকলে এক্সেস ডিনাইড হ্যান্ডল করে
     *
     * @param ex [EN] Access denied exception / [BN] এক্সেস ডিনাইড এক্সেপশন
     * @return [EN] 403 Forbidden response / [BN] ৪০৩ ফরবিডেন রেসপন্স
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Security access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("You do not have sufficient permissions to access this resource."));
    }

    /**
     * [EN] Handles account lockout exception when user exceeds failed login attempts
     * [BN] ভুল পাসওয়ার্ড চেষ্টার কারণে অ্যাকাউন্ট লক হলে মানবিক বার্তা প্রদান করে
     */
    @ExceptionHandler(org.springframework.security.authentication.LockedException.class)
    public ResponseEntity<ApiResponse<Void>> handleLockedException(org.springframework.security.authentication.LockedException ex) {
        log.warn("Account locked exception: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * [EN] Handles bad credentials and authentication failures with dynamic message
     * [BN] ভুল ক্রেডেনশিয়াল বা অথেনটিকেশন ব্যর্থতা মানবিক ৪০১ রেসপন্সে রূপান্তর করে
     *
     * @param ex [EN] Authentication exception / [BN] অথেনটিকেশন এক্সেপশন
     * @return [EN] 401 Unauthorized response / [BN] ৪০১ অনঅথোরাইজড রেসপন্স
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        String msg = (ex.getMessage() != null && !ex.getMessage().isBlank())
                ? ex.getMessage()
                : "Invalid username or password. Please verify your credentials.";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(msg));
    }

    /**
     * [EN] Handles illegal state issues such as missing active tenant context due to expired sessions.
     * [BN] মেয়াদোত্তীর্ণ সেশনের কারণে টেন্যান্ট কনটেক্সট অনুপস্থিত থাকলে নিরাপদ ৪০১ অনঅথোরাইজড রেসপন্স দেয়।
     *
     * @param ex [EN] Illegal state exception / [BN] স্টেট এক্সেপশন
     * @return [EN] 401 Unauthorized response / [BN] ৪০১ অনঅথোরাইজড রেসপন্স
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalStateException(IllegalStateException ex) {
        log.warn("Illegal state encountered (likely unauthenticated or missing tenant context): {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Your session has expired or active tenant context is missing. Please sign in again."));
    }


    /**
     * [EN] Handles invalid client arguments or illegal parameter values
     * [BN] ক্লায়েন্ট থেকে পাঠানো অবৈধ আর্গুমেন্ট বা প্যারামিটার ভ্যালুর জন্য ৪০০ ব্যাড রিকোয়েস্ট ফেরত দেয়
     *
     * @param ex [EN] Illegal argument exception / [BN] অবৈধ আর্গুমেন্ট এক্সেপশন
     * @return [EN] 400 Bad Request with readable error message
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid client argument encountered: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * [EN] Catch-all handler for unexpected runtime or infrastructure exceptions
     * [BN] সিস্টেমে ঘটা যেকোনো অপ্রত্যাশিত রানটাইম এরর নিরাপদে হ্যান্ডল করার ক্যাচ-অল মেথড
     *
     * @param ex [EN] Unhandled exception / [BN] আনহ্যান্ডল্ড এক্সেপশন
     * @return [EN] 500 Internal Server Error without leaking internal stack trace
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unhandled server error encountered", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected internal error occurred. Please contact ERP support."));
    }
}

