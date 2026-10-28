package com.garments.erp.user.dto;

import com.garments.erp.user.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Secure Data Transfer Object for Enterprise User Profiles
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী প্রোফাইল সিকিউর ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Transports public user details, department, designation, and assigned roles
 *      to the frontend without exposing confidential password hashes or credentials.
 * [BN] পাসওয়ার্ড হ্যাশ বা সংবেদনশীল তথ্য গোপন রেখে ফ্রন্টএন্ডে ব্যবহারকারীর তথ্য,
 *      বিভাগ, পদবী এবং নির্ধারিত রোলের তালিকা নিরাপদে সরবরাহ করে।
 */
@Getter
@Setter
public class UserDto implements Serializable {

    /**
     * [EN] Unique user identifier
     * [BN] ইউজারের ইউনিক আইডি
     */
    private UUID id;

    /**
     * [EN] Scoped tenant organization identifier
     * [BN] সংশ্লিষ্ট টেন্যান্ট আইডি
     */
    private UUID tenantId;

    /**
     * [EN] Unique business code of the parent tenant (e.g. TEXTECH)
     * [BN] প্যারেন্ট টেন্যান্টের অনন্য ব্যবসায়িক কোড
     */
    private String tenantCode;

    /**
     * [EN] Registered company name of the parent tenant
     * [BN] প্যারেন্ট টেন্যান্টের নিবন্ধিত কোম্পানির নাম
     */
    private String tenantName;

    /**
     * [EN] Login username handle
     * [BN] লগইন ইউজারনেম
     */
    private String username;

    /**
     * [EN] Official email address
     * [BN] প্রাতিষ্ঠানিক ইমেইল
     */
    private String email;

    /**
     * [EN] Employee full legal name
     * [BN] ইউজারের পূর্ণ নাম
     */
    private String fullName;

    /**
     * [EN] Factory functional department (e.g. MERCHANDISING)
     * [BN] কর্মস্থলের বিভাগ
     */
    private String department;

    /**
     * [EN] Official professional job title
     * [BN] প্রাতিষ্ঠানিক পদবী
     */
    private String designation;

    /**
     * [EN] Cellular contact number
     * [BN] যোগাযোগের ফোন নম্বর
     */
    private String phone;

    /**
     * [EN] Factory employee punch/RFID card identifier (e.g. 255776)
     * [BN] কারখানা বা প্রতিষ্ঠানের এমপ্লয়ি পাঞ্চ বা আরএফআইডি কার্ড নম্বর
     */
    private String employeeCardNo;

    /**
     * [EN] Current operational status (ACTIVE, INACTIVE, etc.)
     * [BN] বর্তমান সক্রিয়তা স্ট্যাটাস
     */
    private UserStatus status;

    /**
     * [EN] Soft deletion flag
     * [BN] সফট ডিলিট ফ্ল্যাগ
     */
    private boolean isDeleted;

    /**
     * [EN] Assigned security role codes (e.g. ROLE_MERCHANDISER, ROLE_ADMIN)
     * [BN] ব্যবহারকারীকে নির্ধারিত সিকিউরিটি রোল কোডের সেট
     */
    private Set<String> roles = new HashSet<>();

    /**
     * [EN] Effective granular functional permissions (Role Base + Custom Grants - Denials)
     * [BN] ব্যবহারকারীর কার্যকর সুনির্দিষ্ট অনুমতি কোডের সেট (রোল বেস + কাস্টম গ্রান্ট - ডিনাই)
     */
    private Set<String> permissions = new HashSet<>();

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public UserDto() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public UserDto(UUID id, UUID tenantId, String username, String email, String fullName,
                   String department, String designation, String phone, UserStatus status) {
        this.id = id;
        this.tenantId = tenantId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.department = department;
        this.designation = designation;
        this.phone = phone;
        this.status = status;
    }

    /**
     * [EN] Full parameterized constructor including employee card number
     * [BN] এমপ্লয়ি কার্ড নম্বর সহ সম্পূর্ণ প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public UserDto(UUID id, UUID tenantId, String username, String email, String fullName,
                   String department, String designation, String phone, String employeeCardNo, UserStatus status) {
        this(id, tenantId, username, email, fullName, department, designation, phone, status);
        this.employeeCardNo = employeeCardNo;
    }
}
