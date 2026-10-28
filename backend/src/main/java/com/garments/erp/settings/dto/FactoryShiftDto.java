package com.garments.erp.settings.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Factory Shift Data Transfer Object (FactoryShiftDto.java)
 * [BN] ফ্যাক্টরি শিফট ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactoryShiftDto implements Serializable {
    private UUID id;

    @NotBlank(message = "Shift name is required")
    private String name;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    @Builder.Default
    private Integer breakMinutes = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private String type = "REGULAR";
}
