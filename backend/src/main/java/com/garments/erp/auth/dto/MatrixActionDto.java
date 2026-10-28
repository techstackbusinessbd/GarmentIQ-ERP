package com.garments.erp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * =============================================================================
 * [EN] Matrix Action Definition DTO (MatrixActionDto.java)
 * [BN] প্রিভিলেজ ম্যাট্রিক্স অ্যাকশন ডেফিনিশন ডিটিও (MatrixActionDto.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatrixActionDto implements Serializable {
    private String code;
    private String label;
}
