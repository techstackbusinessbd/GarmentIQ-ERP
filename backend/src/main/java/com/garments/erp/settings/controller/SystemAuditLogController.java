package com.garments.erp.settings.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.settings.dto.SystemAuditLogDto;
import com.garments.erp.settings.service.SystemAuditLogService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * =============================================================================
 * [EN] System Audit Log REST Controller (SystemAuditLogController.java)
 * [BN] সিস্টেম অডিট লগ রেস্ট কন্ট্রোলার
 * =============================================================================
 */
@RestController
@RequestMapping("/api/v1/settings/audit-logs")
@RequiredArgsConstructor
public class SystemAuditLogController {

    private final SystemAuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAuthority('AUDIT_LOG:VIEW') or hasAuthority('SETTINGS:VIEW') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<SystemAuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) UUID tenantId,
            @RequestParam(required = false) String actor,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                auditLogService.getAuditLogs(tenantId, actor, page, size),
                "Audit logs retrieved successfully."
        ));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SystemAuditLogDto>> recordLog(@Valid @RequestBody SystemAuditLogDto dto) {
        SystemAuditLogDto created = auditLogService.recordLog(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Audit log recorded successfully."));
    }
}
