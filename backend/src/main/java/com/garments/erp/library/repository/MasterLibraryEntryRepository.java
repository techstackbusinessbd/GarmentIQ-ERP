package com.garments.erp.library.repository;

import com.garments.erp.library.entity.MasterLibraryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Master Library Entry Spring Data JPA Repository (Rule 12 & ADR-015)
 * [BN] মাস্টার লাইব্রেরি এন্ট্রি স্প্রিং ডেটা জেপিএ রিপোজিটরি
 * =============================================================================
 */
@Repository
public interface MasterLibraryEntryRepository extends JpaRepository<MasterLibraryEntry, UUID> {

    List<MasterLibraryEntry> findByTenantIdAndDomainCodeOrderByDisplayOrderAscEntryNameAsc(
            UUID tenantId, String domainCode);

    List<MasterLibraryEntry> findByTenantIdAndDomainCodeAndIsActiveTrueOrderByDisplayOrderAscEntryNameAsc(
            UUID tenantId, String domainCode);

    List<MasterLibraryEntry> findByTenantIdAndDomainCodeAndEntityTypeOrderByDisplayOrderAscEntryNameAsc(
            UUID tenantId, String domainCode, String entityType);

    List<MasterLibraryEntry> findByTenantIdAndDomainCodeAndEntityTypeAndIsActiveTrueOrderByDisplayOrderAscEntryNameAsc(
            UUID tenantId, String domainCode, String entityType);

    Optional<MasterLibraryEntry> findByTenantIdAndDomainCodeAndEntityTypeAndEntryCode(
            UUID tenantId, String domainCode, String entityType, String entryCode);

    boolean existsByTenantIdAndDomainCodeAndEntityTypeAndEntryCode(
            UUID tenantId, String domainCode, String entityType, String entryCode);

    long countByTenantIdAndDomainCode(UUID tenantId, String domainCode);

    long countByTenantIdAndDomainCodeAndIsActiveTrue(UUID tenantId, String domainCode);
}
