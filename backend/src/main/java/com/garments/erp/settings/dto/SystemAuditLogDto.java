package com.garments.erp.settings.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] System Audit Log DTO (SystemAuditLogDto.java)
 * [BN] সিস্টেম অডিট লগ ডেটা ট্রান্সফার অবজেক্ট
 * =============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAuditLogDto implements Serializable {
    private UUID id;
    private OffsetDateTime timestamp;

    @NotBlank(message = "Actor handle is required")
    private String actor;

    @NotBlank(message = "Actor role is required")
    private String actorRole;

    private String actorFullName;
    private String actorEmail;
    private String actorDesignation;
    private String actorDepartment;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Action description is required")
    private String action;

    private String targetResource;
    private String details;

    @Builder.Default
    private String severity = "INFO";

    private String ipAddress;

    private UUID tenantId;
    private String tenantCode;
    private String tenantName;
}
