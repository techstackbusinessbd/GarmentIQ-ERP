package com.garments.erp.settings.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.settings.dto.FactoryShiftDto;
import com.garments.erp.settings.service.FactoryShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Factory Shift REST Controller (FactoryShiftController.java)
 * [BN] কারখানা শিফট রেস্ট কন্ট্রোলার
 * =============================================================================
 */
@RestController
@RequestMapping("/api/v1/settings/shifts")
@RequiredArgsConstructor
public class FactoryShiftController {

    private final FactoryShiftService shiftService;

    @GetMapping
    @PreAuthorize("hasAuthority('SHIFT:VIEW') or hasAuthority('SETTINGS:VIEW') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<FactoryShiftDto>>> getAllShifts() {
        return ResponseEntity.ok(ApiResponse.success(shiftService.getAllShifts(), "Factory shifts retrieved successfully."));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SHIFT:CREATE') or hasAuthority('SETTINGS:EDIT') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<FactoryShiftDto>> createShift(@Valid @RequestBody FactoryShiftDto dto) {
        FactoryShiftDto created = shiftService.createShift(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Factory shift created successfully."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SHIFT:DELETE') or hasAuthority('SETTINGS:EDIT') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable UUID id) {
        shiftService.deleteShift(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Factory shift deleted successfully."));
    }
}
