package com.garments.erp.core.exception;

/**
 * [EN] Exception thrown when an expected entity or resource is not found in the database.
 * [BN] ডেটাবেজে কোনো রেকর্ড বা রিসোর্স খুঁজে না পাওয়া গেলে এই এক্সেপশনটি নিক্ষেপ করা হয়।
 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * [EN] Constructor with a clean, human-readable error description.
     * [BN] সহজ মানবিক ইংরেজি বার্তা সহ কনস্ট্রাক্টর।
     *
     * @param message User-friendly explanation of what was not found
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s was not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
