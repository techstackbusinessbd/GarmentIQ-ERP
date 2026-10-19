package com.garments.erp.user.dto;

import com.garments.erp.user.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

/**
 * =============================================================================
 * [EN] User Account Profile Update Request Data Transfer Object
 * [BN] ব্যবহারকারী অ্যাকাউন্ট তথ্য হালনাগাদ রিকোয়েস্ট ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Transports modified user profile fields, status changes, and updated
 *      role sets from the user management screen for persistence.
 * [BN] ব্যবহারকারীর নাম, বিভাগ, পদবী, ফোন নম্বর, সক্রিয়তা স্ট্যাটাস এবং
 *      পরিবর্তিত সিকিউরিটি রোলের তালিকা সংরক্ষণের জন্য ধারণ করে।
 */
@Getter
@Setter
public class UpdateUserRequest implements Serializable {

    /**
     * [EN] Modified employee full legal name
     * [BN] পরিমার্জিত পূর্ণ নাম
     */
    private String fullName;

    /**
     * [EN] Modified functional department
     * [BN] পরিমার্জিত বিভাগ
     */
    private String department;

    /**
     * [EN] Modified job designation title
     * [BN] পরিমার্জিত প্রাতিষ্ঠানিক পদবী
     */
    private String designation;

    /**
     * [EN] Modified telephone contact number
     * [BN] পরিমার্জিত মোবাইল নম্বর
     */
    private String phone;

    /**
     * [EN] Updated account operational status (ACTIVE, INACTIVE, etc.)
     * [BN] হালনাগাদকৃত সক্রিয়তা স্ট্যাটাস
     */
    private UserStatus status;

    /**
     * [EN] Updated set of assigned role codes
     * [BN] হালনাগাদকৃত সিকিউরিটি রোল কোডের সেট
     */
    private Set<String> roles;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public UpdateUserRequest() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public UpdateUserRequest(String fullName, String department, String designation,
                             String phone, UserStatus status) {
        this.fullName = fullName;
        this.department = department;
        this.designation = designation;
        this.phone = phone;
        this.status = status;
    }
}
