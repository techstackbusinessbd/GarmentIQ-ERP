package com.garments.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] Inbound Refresh Token Request Data Transfer Object
 * [BN] রিফ্রেশ টোকেন রিকোয়েস্ট ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Encapsulates a valid long-lived refresh token for silent renewal of an
 *      expired short-lived access token without forcing manual user re-login.
 * [BN] দীর্ঘস্থায়ী রিফ্রেশ টোকেন গ্রহণ করে যা মেয়াদোত্তীর্ণ এক্সেস টোকেনকে
 *      ব্যবহারকারীকে পুনরায় লগইন না করিয়ে স্বয়ংক্রিয়ভাবে নবায়ন করে।
 */
@Getter
@Setter
public class RefreshTokenRequest implements Serializable {

    /**
     * [EN] Cryptographically signed refresh JWT string
     * [BN] ক্রিপ্টোগ্রাফিক্যালি সাইনড রিফ্রেশ জেডব্লিউটি স্ট্রিং
     */
    @NotBlank(message = "Refresh token must not be blank")
    private String refreshToken;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public RefreshTokenRequest() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
