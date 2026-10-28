package com.garments.erp.settings.repository;

import com.garments.erp.settings.entity.FactoryShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Factory Shift Spring Data JPA Repository (FactoryShiftRepository.java)
 * [BN] ফ্যাক্টরি শিফট ডেটাবেজ রিপোজিটরি (FactoryShiftRepository.java)
 * =============================================================================
 */
@Repository
public interface FactoryShiftRepository extends JpaRepository<FactoryShift, UUID> {
    List<FactoryShift> findAllByTenantIdOrderByStartTimeAsc(UUID tenantId);
    Optional<FactoryShift> findByIdAndTenantId(UUID id, UUID tenantId);
}
