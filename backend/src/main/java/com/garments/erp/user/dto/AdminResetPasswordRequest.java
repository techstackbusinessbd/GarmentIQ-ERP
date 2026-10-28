package com.garments.erp.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * [EN] Admin password reset request payload.
 * [BN] অ্যাডমিন কর্তৃক ইউজারের পাসওয়ার্ড রিসেট করার রিকোয়েস্ট পেলোড।
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminResetPasswordRequest {

    @NotBlank(message = "New password must not be blank")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters long")
    private String newPassword;

    @Builder.Default
    private Boolean unlockAccount = true;
}
