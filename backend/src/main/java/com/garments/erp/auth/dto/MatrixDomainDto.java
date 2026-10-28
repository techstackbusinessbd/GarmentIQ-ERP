package com.garments.erp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

/**
 * =============================================================================
 * [EN] Matrix Domain Definition DTO (MatrixDomainDto.java)
 * [BN] প্রিভিলেজ ম্যাট্রিক্স ডোমেন ডেফিনিশন ডিটিও (MatrixDomainDto.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatrixDomainDto implements Serializable {
    private String id;
    private String title;
    private List<MatrixModuleDto> modules;
}
