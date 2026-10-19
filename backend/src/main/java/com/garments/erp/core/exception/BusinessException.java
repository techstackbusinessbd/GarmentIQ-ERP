package com.garments.erp.core.exception;

/**
 * [EN] Exception thrown when a core RMG business rule is violated
 * (e.g., attempting to cut fabric exceeding roll balance, negative shrinkage).
 *
 * [BN] তৈরি পোশাক খাতের কোনো ব্যবসায়িক নিয়ম বা শর্ত লঙ্ঘন হলে এই এক্সেপশনটি নিক্ষেপ করা হয়।
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * [EN] Constructor with a clear, humane explanation of the business violation.
     * [BN] ব্যবসায়িক রুল লঙ্ঘনের স্পষ্ট মানবিক ব্যাখ্যা সহ কনস্ট্রাক্টর।
     *
     * @param message Actionable error message for the factory operator
     */
    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
