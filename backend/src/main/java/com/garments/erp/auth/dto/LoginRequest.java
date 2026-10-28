package com.garments.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] User Authentication Inbound Login Request Data Transfer Object
 * [BN] ব্যবহারকারী লগইন রিকোয়েস্ট ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Captures enterprise username credentials and plaintext password from the
 *      login dialog for cryptographic validation and JWT issuance.
 * [BN] লগইন ডায়ালগ থেকে ইউজারনেম এবং পাসওয়ার্ড গ্রহণ করে যা ক্রিপ্টোগ্রাফিক
 *      যাচাই এবং জেডব্লিউটি টোকেন ইস্যু করার জন্য ব্যবহৃত হয়।
 */
@Getter
@Setter
public class LoginRequest implements Serializable {

    /**
     * [EN] Unique enterprise username handle
     * [BN] প্রাতিষ্ঠানিক লগইন ইউজারনেম
     */
    @NotBlank(message = "Username must not be blank")
    private String username;

    /**
     * [EN] Plaintext authentication password string
     * [BN] লগইন পাসওয়ার্ড স্ট্রিং
     */
    @NotBlank(message = "Password must not be blank")
    private String password;

    /**
     * [EN] Optional tenant organization code or subdomain
     * [BN] ঐচ্ছিক কারখানা কোড বা সাবডোমেন
     */
    private String tenantCode;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public LoginRequest() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public LoginRequest(String username, String password, String tenantCode) {
        this.username = username;
        this.password = password;
        this.tenantCode = tenantCode;
    }
}
