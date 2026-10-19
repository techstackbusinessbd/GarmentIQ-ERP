package com.garments.erp.auth.dto;

import com.garments.erp.user.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] User Authentication Outbound Login Response Data Transfer Object
 * [BN] ব্যবহারকারী লগইন রেসপন্স ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 * [EN] Returns newly minted signed JWT access token, refresh token, token type,
 *      lifespan, and the authenticated user profile to initialize frontend state.
 * [BN] ফ্রন্টএন্ড স্টেট ইনিশিয়ালাইজ করার জন্য সাইনড জেডব্লিউটি এক্সেস টোকেন,
 *      রিফ্রেশ টোকেন, মেয়াদ এবং ব্যবহারকারীর প্রোফাইল তথ্য ফেরত পাঠায়।
 */
@Getter
@Setter
public class LoginResponse implements Serializable {

    /**
     * [EN] Cryptographically signed stateless JWT access token
     * [BN] ক্রিপ্টোগ্রাফিক্যালি সাইনড স্টেটলেস এক্সেস টোকেন
     */
    private String accessToken;

    /**
     * [EN] Long-lived refresh token for silent session extension
     * [BN] সেশন নবায়নের জন্য দীর্ঘস্থায়ী রিফ্রেশ টোকেন
     */
    private String refreshToken;

    /**
     * [EN] Authorization token scheme prefix (Default: Bearer)
     * [BN] অথোরাইজেশন টোকেন স্কিম প্রিফিক্স (ডিফল্ট: Bearer)
     */
    private String tokenType = "Bearer";

    /**
     * [EN] Access token validity duration in milliseconds
     * [BN] এক্সেস টোকেনের স্থায়িত্বকাল মিলিসেকেন্ডে
     */
    private long expiresIn;

    /**
     * [EN] Authenticated user profile and assigned roles metadata
     * [BN] লগইনকৃত ইউজারের প্রোফাইল ও নির্ধারিত রোলের মেটাডেটা
     */
    private UserDto user;

    /**
     * [EN] Default no-args constructor
     * [BN] ডিফল্ট কনস্ট্রাক্টর
     */
    public LoginResponse() {
    }

    /**
     * [EN] Parameterized constructor
     * [BN] প্যারামিটারযুক্ত কনস্ট্রাক্টর
     */
    public LoginResponse(String accessToken, String refreshToken, long expiresIn, UserDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = "Bearer";
        this.expiresIn = expiresIn;
        this.user = user;
    }
}
