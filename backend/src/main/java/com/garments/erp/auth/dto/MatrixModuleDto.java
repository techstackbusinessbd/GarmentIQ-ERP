package com.garments.erp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

/**
 * =============================================================================
 * [EN] Matrix Module Definition DTO (MatrixModuleDto.java)
 * [BN] প্রিভিলেজ ম্যাট্রিক্স মডিউল ডেফিনিশন ডিটিও (MatrixModuleDto.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatrixModuleDto implements Serializable {
    private String id;
    private String name;
    private String description;
    private List<MatrixFeatureDto> features;
}
