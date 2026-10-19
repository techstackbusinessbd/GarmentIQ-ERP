package com.garments.erp.core.exception;

import com.garments.erp.core.response.ApiResponse;
import jakarta.persistence.OptimisticLockException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * [EN] Central Global Exception Handler intercepting all runtime errors across the ERP.
 * Translates technical exceptions into human-readable, respectful error responses without stacktraces.
 *
 * [BN] সেন্ট্রাল গ্লোবাল এক্সেপশন হ্যান্ডলার যা সিস্টেমের সকল টেকনিক্যাল এরর ইন্টারসেপ্ট করে
 * ইউজারকে কোনো রোবোটিক স্ট্যাকট্রেস না দেখিয়ে সহজ, মানবিক ইংরেজি বার্তা প্রদান করে।
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * [EN] Handles ResourceNotFoundException returning HTTP 404.
     * [BN] রেকর্ড খুঁজে না পাওয়ার এক্সেপশন হ্যান্ডলার (HTTP 404)।
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("[RESOURCE_NOT_FOUND] {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(ex.getMessage()));
    }

    /**
     * [EN] Handles domain-level BusinessException returning HTTP 400.
     * [BN] ডোমেন বিজনেস রুল লঙ্ঘনের হ্যান্ডলার (HTTP 400)।
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("[BUSINESS_RULE_VIOLATION] {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(ex.getMessage()));
    }

    /**
     * [EN] Handles Jakarta DTO validation errors returning user-friendly field descriptions.
     * [BN] ইনপুট ডেটা ভ্যালিডেশন এরর হ্যান্ডলার।
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        log.warn("[VALIDATION_FAILED] Total invalid fields: {}", fieldErrors.size());

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Some required fields are missing or invalid. Please check the form errors.")
                .data(fieldErrors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * [EN] Handles Optimistic Locking conflicts when two users edit the same record concurrently.
     * [BN] একাধিক ইউজারের কনকারেন্ট আপডেটের কারণে অপটিমিস্টিক লকিং কনফ্লিক্ট হ্যান্ডলার (HTTP 409)।
     */
    @ExceptionHandler({OptimisticLockException.class, ObjectOptimisticLockingFailureException.class})
    public ResponseEntity<ApiResponse<Void>> handleOptimisticLockConflict(Exception ex) {
        log.warn("[OPTIMISTIC_LOCK_CONFLICT] Simultaneous edit collision: {}", ex.getMessage());
        String friendlyMessage = "This record was recently modified by another user. Please refresh and try again.";
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(friendlyMessage));
    }

    /**
     * [EN] Handles unauthorized access attempts returning HTTP 403.
     * [BN] অনুমোদনহীন অ্যাক্সেস চেষ্টা হ্যান্ডলার (HTTP 403)।
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("[ACCESS_DENIED] Security permission rejected: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.failure("You do not have sufficient permissions to perform this action."));
    }

    /**
     * [EN] Catch-all handler for unexpected system exceptions. Logs full stacktrace internally
     * but returns a polite, helpful message to the user without exposing internal details.
     *
     * [BN] অনাকাঙ্ক্ষিত সকল সিস্টেম এক্সেপশনের জন্য ক্যাচ-অল হ্যান্ডলার। ইন্টারনাল স্ট্যাকট্রেস
     * গোপনে লগে সংরক্ষণ করে কিন্তু ইউজারকে মার্জিত ও মানবিক বার্তা পাঠায়।
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("[UNEXPECTED_SYSTEM_ERROR] Internal fault: ", ex);
        String politeMessage = "An unexpected error occurred while processing your request. Please try again or contact system support.";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure(politeMessage));
    }
}
