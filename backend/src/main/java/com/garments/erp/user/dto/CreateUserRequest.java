package com.garments.erp.user.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.garments.erp.user.entity.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] User Account Provisioning Request Data Transfer Object
 * [BN] নতুন ব্যবহারকারী অ্যাকাউন্ট নিবন্ধন রিকোয়েস্ট ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Captures new user registration attributes including credentials,
 *      departmental placement, contact information, and initial role assignments.
 * [BN] নতুন কর্মীর ইউজারনেম, ইমেইল, পাসওয়ার্ড, ডিপার্টমেন্ট, পদবী এবং
 *      প্রারম্ভিক সিকিউরিটি রোল নির্ধারণ সংক্রান্ত তথ্য ধারণ করে।
 */
@Getter
@Setter
public class CreateUserRequest implements Serializable {

    /**
     * [EN] Target client factory tenant identifier (optional; specified by platform super admin)
     * [BN] কাঙ্ক্ষিত ফ্যাক্টরি বা ক্লায়েন্ট টেন্যান্ট আইডি (সুপার অ্যাডমিনের জন্য প্রযোজ্য)
     */
    private UUID tenantId;

    /**
     * [EN] Unique enterprise login username handle (3 to 50 characters)
     * [BN] অনন্য প্রাতিষ্ঠানিক লগইন ইউজারনেম (৩ থেকে ৫০ বর্ণ)
     */
    @NotBlank(message = "Username must not be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    /**
     * [EN] Valid official corporate email address
     * [BN] বৈধ প্রাতিষ্ঠানিক করপোরেট ইমেইল ঠিকানা
     */
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be a valid email address")
    private String email;

    /**
     * [EN] Secure plaintext password (minimum 8 characters)
     * [BN] নিরাপদ পাসওয়ার্ড স্ট্রিং (নূন্যতম ৮ বর্ণ)
     */
    @NotBlank(message = "Password must not be blank")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters long")
    private String password;

    /**
     * [EN] Employee full legal name
     * [BN] কর্মীর পূর্ণ প্রাতিষ্ঠানিক নাম
     */
    @NotBlank(message = "Full name must not be blank")
    private String fullName;

    /**
     * [EN] Factory functional department (e.g. MERCHANDISING, CUTTING)
     * [BN] কর্মস্থল বা কারখানার বিভাগ
     */
    private String department;

    /**
     * [EN] Professional job designation title
     * [BN] প্রাতিষ্ঠানিক পদবী
     */
    private String designation;

    /**
     * [EN] Official cellular telephone contact number
     * [BN] প্রাতিষ্ঠানিক মোবাইল নম্বর
     */
    private String phone;

    /**
     * [EN] Factory employee punch/RFID card identifier (e.g. 255776)
     * [BN] কারখানা বা প্রতিষ্ঠানের এমপ্লয়ি পাঞ্চ বা আরএফআইডি কার্ড নম্বর
     */
    private String employeeCardNo;

    /**
     * [EN] Account operational lifecycle status (default: ACTIVE)
     * [BN] অ্যাকাউন্টের প্রারম্ভিক সক্রিয়তা স্ট্যাটাস
     */
    private UserStatus status = UserStatus.ACTIVE;

    /**
     * [EN] Set of role codes to assign (e.g. ROLE_MERCHANDISER)
     * [BN] ব্যবহারকারীকে নির্ধারিত রোল কোডসমূহের সেট
     */
    @JsonAlias({"roles", "roleCodes"})
    private Set<String> roles = new HashSet<>();

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public CreateUserRequest() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public CreateUserRequest(String username, String email, String password, String fullName,
                             String department, String designation, String phone) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.department = department;
        this.designation = designation;
        this.phone = phone;
    }
}
