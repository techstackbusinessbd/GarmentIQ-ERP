package com.garments.erp.settings.service;

import com.garments.erp.core.exception.ResourceNotFoundException;
import com.garments.erp.settings.dto.FactoryShiftDto;
import com.garments.erp.settings.entity.FactoryShift;
import com.garments.erp.settings.repository.FactoryShiftRepository;
import com.garments.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Factory Shift Business Service (FactoryShiftService.java)
 * [BN] কারখানা শিফট ম্যানেজমেন্ট সার্ভিস
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), OWASP A09 (Audit Logging)
 */
@Service
@RequiredArgsConstructor
public class FactoryShiftService {

    private final FactoryShiftRepository shiftRepository;
    private final SystemAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<FactoryShiftDto> getAllShifts() {
        UUID tenantId = TenantContext.getTenantId();
        return shiftRepository.findAllByTenantIdOrderByStartTimeAsc(tenantId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public FactoryShiftDto createShift(FactoryShiftDto dto) {
        UUID tenantId = TenantContext.getTenantId();
        FactoryShift entity = FactoryShift.builder()
                .tenantId(tenantId)
                .name(dto.getName().trim())
                .startTime(dto.getStartTime().trim())
                .endTime(dto.getEndTime().trim())
                .breakMinutes(dto.getBreakMinutes() != null ? dto.getBreakMinutes() : 0)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .shiftType(dto.getType() != null ? dto.getType().trim() : "REGULAR")
                .build();
        FactoryShift saved = shiftRepository.save(entity);

        auditLogService.record(
                tenantId,
                "FACTORY_SHIFTS",
                "SHIFT_CREATED",
                "Shift: " + saved.getName(),
                "Created factory shift: " + saved.getName() + " (" + saved.getStartTime() + " - " + saved.getEndTime() + ")",
                "INFO"
        );

        return toDto(saved);
    }

    @Transactional
    public void deleteShift(UUID id) {
        UUID tenantId = TenantContext.getTenantId();
        FactoryShift shift = shiftRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));
        shiftRepository.delete(shift);

        auditLogService.record(
                tenantId,
                "FACTORY_SHIFTS",
                "SHIFT_DELETED",
                "Shift: " + shift.getName(),
                "Deleted factory shift: " + shift.getName(),
                "WARNING"
        );
    }

    private FactoryShiftDto toDto(FactoryShift s) {
        return FactoryShiftDto.builder()
                .id(s.getId())
                .name(s.getName())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .breakMinutes(s.getBreakMinutes())
                .isActive(s.getIsActive())
                .type(s.getShiftType())
                .build();
    }
}
