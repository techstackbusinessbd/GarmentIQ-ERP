package com.garments.erp.settings.service;

import com.garments.erp.core.security.SecurityUtils;
import com.garments.erp.settings.dto.SystemAuditLogDto;
import com.garments.erp.settings.entity.SystemAuditLog;
import com.garments.erp.settings.repository.SystemAuditLogRepository;
import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.tenant.entity.Tenant;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] Enterprise System Audit Log & Security Trail Service (SystemAuditLogService)
 * [BN] এন্টারপ্রাইজ সিস্টেম অডিট লগ ও সিকিউরিটি ট্রেইল সার্ভিস (SystemAuditLogService)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), OWASP A09 (Security Logging)
 * [BN] প্ল্যাটফর্ম নিরাপত্তা, ব্যবহারকারী কার্যকলাপ ও সিস্টেম কনফিগারেশন পরিবর্তনের অপরিবর্তনীয় অডিট ট্রেইল।
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SystemAuditLogService {

    private static final UUID SYSTEM_TENANT_ID = UUID.fromString("019472ba-0000-7000-8000-000000000000");

    private final SystemAuditLogRepository auditRepository;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;

    /**
     * [EN] Retrieves paginated audit log entries with optional client tenant and actor user filters
     * [BN] ঐচ্ছিক ক্লায়েন্ট টেন্যান্ট ও অ্যাক্টর ইউজার ফিল্টারসহ পেজিনেটেড অডিট লগ প্রদান
     */
    @Transactional(readOnly = true)
    public Page<SystemAuditLogDto> getAuditLogs(UUID filterTenantId, String actor, int page, int size) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            tenantId = SYSTEM_TENANT_ID;
        }

        String normalizedActor = (actor != null && !actor.isBlank() && !"ALL".equalsIgnoreCase(actor.trim()))
                ? actor.trim()
                : null;

        Page<SystemAuditLog> logPage;
        if (SecurityUtils.isSuperAdmin()) {
            if (filterTenantId != null && normalizedActor != null) {
                logPage = auditRepository.findAllByTenantIdAndActorOrderByTimestampDesc(filterTenantId, normalizedActor, PageRequest.of(page, size));
            } else if (filterTenantId != null) {
                logPage = auditRepository.findAllByTenantIdOrderByTimestampDesc(filterTenantId, PageRequest.of(page, size));
            } else if (normalizedActor != null) {
                logPage = auditRepository.findAllByActorOrderByTimestampDesc(normalizedActor, PageRequest.of(page, size));
            } else {
                logPage = auditRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
            }
        } else {
            if (normalizedActor != null) {
                logPage = auditRepository.findAllByTenantIdAndActorOrderByTimestampDesc(tenantId, normalizedActor, PageRequest.of(page, size));
            } else {
                logPage = auditRepository.findAllByTenantIdOrderByTimestampDesc(tenantId, PageRequest.of(page, size));
            }
        }

        List<SystemAuditLog> logs = logPage.getContent();
        Set<String> actors = logs.stream()
                .map(SystemAuditLog::getActor)
                .filter(a -> a != null && !a.isBlank())
                .collect(Collectors.toSet());

        Map<String, User> userMap = actors.isEmpty()
                ? Map.of()
                : userRepository.findByUsernameIn(actors).stream()
                        .collect(Collectors.toMap(User::getUsername, u -> u, (u1, u2) -> u1));

        Set<UUID> tenantIds = logs.stream()
                .map(SystemAuditLog::getTenantId)
                .filter(t -> t != null && !SYSTEM_TENANT_ID.equals(t))
                .collect(Collectors.toSet());

        Map<UUID, Tenant> tenantMap = tenantIds.isEmpty()
                ? Map.of()
                : tenantRepository.findAllById(tenantIds).stream()
                        .collect(Collectors.toMap(Tenant::getId, t -> t, (t1, t2) -> t1));

        return logPage.map(a -> toDtoWithCache(a, userMap, tenantMap));
    }

    @Transactional(readOnly = true)
    public Page<SystemAuditLogDto> getAuditLogs(UUID filterTenantId, int page, int size) {
        return getAuditLogs(filterTenantId, null, page, size);
    }

    @Transactional(readOnly = true)
    public Page<SystemAuditLogDto> getAuditLogs(int page, int size) {
        return getAuditLogs(null, null, page, size);
    }

    /**
     * [EN] Overloaded helper method for quick recording with auto-resolved tenant and INFO severity
     * [BN] অটো-রিসলভড টেন্যান্ট ও ইনফো সিভিয়ারিটি সহ দ্রুত অডিট লগ সংরক্ষণের মেথড
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String category, String action, String details, String targetResource, String metadata) {
        String fullDetails = (metadata != null && !metadata.isBlank()) ? details + " [" + metadata + "]" : details;
        record(null, category, action, targetResource, fullDetails, "INFO");
    }

    /**
     * [EN] Records an automated server-side audit log entry using current security context
     * [BN] বর্তমান সিকিউরিটি কনটেক্সট ব্যবহার করে সার্ভার-সাইডে স্বয়ংক্রিয় অডিট লগ সংরক্ষণ করে
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(UUID tenantId, String category, String action, String targetResource, String details, String severity) {
        record(tenantId, null, null, category, action, targetResource, details, severity);
    }

    /**
     * [EN] Records an audit entry with explicit or auto-resolved operator credentials and client IP
     * [BN] অপারেটর ক্রেডেনশিয়াল ও ক্লায়েন্ট আইপিসহ অডিট লগ সংরক্ষণ করে (ব্যবসায়িক লজিক সুরক্ষিত রেখে)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(UUID tenantId, String actor, String actorRole, String category, String action, String targetResource, String details, String severity) {
        try {
            UUID resolvedTenantId = tenantId;
            if (resolvedTenantId == null) {
                resolvedTenantId = TenantContext.getTenantId();
                if (resolvedTenantId == null) {
                    resolvedTenantId = SYSTEM_TENANT_ID;
                }
            }

            String resolvedActor = (actor != null && !actor.isBlank()) ? actor.trim() : SecurityUtils.resolveCurrentUsername();
            String resolvedRole = (actorRole != null && !actorRole.isBlank()) ? actorRole.trim() : SecurityUtils.resolveCurrentRole();
            String clientIp = SecurityUtils.resolveClientIp();

            SystemAuditLog entity = SystemAuditLog.builder()
                    .tenantId(resolvedTenantId)
                    .actor(resolvedActor)
                    .actorRole(resolvedRole)
                    .category(category != null ? category.trim() : "SYSTEM")
                    .action(action != null ? action.trim() : "OPERATION")
                    .targetResource(targetResource)
                    .details(details)
                    .severity(severity != null ? severity.trim() : "INFO")
                    .ipAddress(clientIp)
                    .build();

            auditRepository.save(entity);
        } catch (Exception ex) {
            log.error("Failed to persist server-side system audit log for action: {}", action, ex);
        }
    }

    /**
     * [EN] REST endpoint wrapper for manual client-reported events
     * [BN] ক্লায়েন্ট ফ্রন্টএন্ড থেকে প্রেরিত ইভেন্ট রেকর্ড করার রেস্ট মেথড
     */
    @Transactional
    public SystemAuditLogDto recordLog(SystemAuditLogDto dto) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            tenantId = SYSTEM_TENANT_ID;
        }

        String clientIp = (dto.getIpAddress() != null && !dto.getIpAddress().isBlank())
                ? dto.getIpAddress().trim()
                : SecurityUtils.resolveClientIp();

        SystemAuditLog entity = SystemAuditLog.builder()
                .tenantId(tenantId)
                .actor(dto.getActor() != null ? dto.getActor().trim() : SecurityUtils.resolveCurrentUsername())
                .actorRole(dto.getActorRole() != null ? dto.getActorRole().trim() : SecurityUtils.resolveCurrentRole())
                .category(dto.getCategory() != null ? dto.getCategory().trim() : "SECURITY_POLICY")
                .action(dto.getAction() != null ? dto.getAction().trim() : "CONFIGURATION_CHANGE")
                .targetResource(dto.getTargetResource())
                .details(dto.getDetails())
                .severity(dto.getSeverity() != null ? dto.getSeverity().trim() : "INFO")
                .ipAddress(clientIp)
                .build();

        return toDto(auditRepository.save(entity));
    }

    private SystemAuditLogDto toDto(SystemAuditLog a) {
        SystemAuditLogDto dto = SystemAuditLogDto.builder()
                .id(a.getId())
                .timestamp(a.getTimestamp())
                .actor(a.getActor())
                .actorRole(a.getActorRole())
                .category(a.getCategory())
                .action(a.getAction())
                .targetResource(a.getTargetResource())
                .details(a.getDetails())
                .severity(a.getSeverity())
                .ipAddress(a.getIpAddress())
                .tenantId(a.getTenantId())
                .build();

        if (a.getActor() != null && !a.getActor().isBlank()) {
            userRepository.findByUsernameAndIsDeletedFalse(a.getActor()).ifPresent(u -> {
                dto.setActorFullName(u.getFullName());
                dto.setActorEmail(u.getEmail());
                dto.setActorDesignation(u.getDesignation());
                dto.setActorDepartment(u.getDepartment());
            });
        }

        if (a.getTenantId() != null && !SYSTEM_TENANT_ID.equals(a.getTenantId())) {
            tenantRepository.findById(a.getTenantId()).ifPresent(t -> {
                dto.setTenantCode(t.getTenantCode());
                dto.setTenantName(t.getTenantName());
            });
        } else if (SYSTEM_TENANT_ID.equals(a.getTenantId())) {
            dto.setTenantCode("SYSTEM");
            dto.setTenantName("GarmentIQ Platform");
        }

        return dto;
    }

    /**
     * [EN] Optimized DTO mapper utilizing pre-fetched user and tenant batch lookups (Zero N+1 queries)
     * [BN] প্রি-ফেচড ইউজার ও টেন্যান্ট ব্যাচ লুকআপ ব্যবহার করে অপ্টিমাইজড ডিটিও রূপান্তর (জিরো এন+১ কুয়েরি)
     */
    private SystemAuditLogDto toDtoWithCache(SystemAuditLog a, Map<String, User> userMap, Map<UUID, Tenant> tenantMap) {
        SystemAuditLogDto dto = SystemAuditLogDto.builder()
                .id(a.getId())
                .timestamp(a.getTimestamp())
                .actor(a.getActor())
                .actorRole(a.getActorRole())
                .category(a.getCategory())
                .action(a.getAction())
                .targetResource(a.getTargetResource())
                .details(a.getDetails())
                .severity(a.getSeverity())
                .ipAddress(a.getIpAddress())
                .tenantId(a.getTenantId())
                .build();

        if (a.getActor() != null && userMap.containsKey(a.getActor())) {
            User u = userMap.get(a.getActor());
            dto.setActorFullName(u.getFullName());
            dto.setActorEmail(u.getEmail());
            dto.setActorDesignation(u.getDesignation());
            dto.setActorDepartment(u.getDepartment());
        } else if (a.getActor() != null && !a.getActor().isBlank()) {
            userRepository.findByUsernameAndIsDeletedFalse(a.getActor()).ifPresent(u -> {
                dto.setActorFullName(u.getFullName());
                dto.setActorEmail(u.getEmail());
                dto.setActorDesignation(u.getDesignation());
                dto.setActorDepartment(u.getDepartment());
            });
        }

        if (a.getTenantId() != null && !SYSTEM_TENANT_ID.equals(a.getTenantId())) {
            Tenant t = tenantMap.get(a.getTenantId());
            if (t != null) {
                dto.setTenantCode(t.getTenantCode());
                dto.setTenantName(t.getTenantName());
            } else {
                tenantRepository.findById(a.getTenantId()).ifPresent(found -> {
                    dto.setTenantCode(found.getTenantCode());
                    dto.setTenantName(found.getTenantName());
                });
            }
        } else if (SYSTEM_TENANT_ID.equals(a.getTenantId())) {
            dto.setTenantCode("SYSTEM");
            dto.setTenantName("GarmentIQ Platform");
        }

        return dto;
    }
}

