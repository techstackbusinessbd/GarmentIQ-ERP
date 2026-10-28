package com.garments.erp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Map;

/**
 * =============================================================================
 * [EN] Matrix Feature Definition DTO (MatrixFeatureDto.java)
 * [BN] প্রিভিলেজ ম্যাট্রিক্স ফিচার ডেফিনিশন ডিটিও (MatrixFeatureDto.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatrixFeatureDto implements Serializable {
    private String id;
    private String name;
    private String path;
    private Map<String, MatrixActionDto> actions;
}
