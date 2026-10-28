package com.garments.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * =============================================================================
 * [EN] Request DTO for creating a new custom enterprise role
 * [BN] নতুন কাস্টম এন্টারপ্রাইজ রোল তৈরির রিকোয়েস্ট ডিটিও (রুল ২৫ অনুবর্তী)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Server-Side Validation)
 */
@Getter
@Setter
public class CreateRoleRequest implements Serializable {

    @NotBlank(message = "Role code is mandatory")
    @Size(min = 3, max = 50, message = "Role code must be between 3 and 50 characters")
    @Pattern(regexp = "^(ROLE_)?[A-Z0-9_]+$", message = "Role code must consist of uppercase alphanumeric characters and underscores")
    private String roleCode;

    @NotBlank(message = "Role name is mandatory")
    @Size(min = 2, max = 100, message = "Role name must be between 2 and 100 characters")
    private String roleName;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private Set<String> permissionCodes = new HashSet<>();
}
