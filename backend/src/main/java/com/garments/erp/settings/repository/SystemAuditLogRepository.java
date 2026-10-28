package com.garments.erp.settings.repository;

import com.garments.erp.settings.entity.SystemAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * =============================================================================
 * [EN] System Audit Log JPA Repository (SystemAuditLogRepository.java)
 * [BN] সিস্টেম অডিট লগ ডেটাবেজ রিপোজিটরি (SystemAuditLogRepository.java)
 * =============================================================================
 */
@Repository
public interface SystemAuditLogRepository extends JpaRepository<SystemAuditLog, UUID> {
    Page<SystemAuditLog> findAllByTenantIdOrderByTimestampDesc(UUID tenantId, Pageable pageable);

    Page<SystemAuditLog> findAllByTenantIdAndActorOrderByTimestampDesc(UUID tenantId, String actor, Pageable pageable);

    Page<SystemAuditLog> findAllByOrderByTimestampDesc(Pageable pageable);

    Page<SystemAuditLog> findAllByActorOrderByTimestampDesc(String actor, Pageable pageable);
}
