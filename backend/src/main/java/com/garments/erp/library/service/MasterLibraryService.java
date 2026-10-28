package com.garments.erp.library.service;

import com.garments.erp.library.dto.CreateMasterLibraryEntryRequest;
import com.garments.erp.library.dto.MasterLibraryEntryDto;
import com.garments.erp.library.dto.UpdateMasterLibraryEntryRequest;
import com.garments.erp.library.entity.MasterLibraryEntry;
import com.garments.erp.library.repository.MasterLibraryEntryRepository;
import com.garments.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] Master Library Domain Business Service (Rule 12 & ADR-015)
 * [BN] মাস্টার লাইব্রেরি ডোমেন বিজনেস সার্ভিস
 * =============================================================================
 * [EN] Provides business operations for querying and managing master reference entries
 *      across all 9 business domains with multi-tenant isolation.
 * [BN] মাল্টি-টেন্যান্ট আইসোলেশন বজায় রেখে ৯টি বিজনেস ডোমেনের মাস্টার রেফারেন্স ডেটা
 *      কোয়েরি ও পরিচালনার ব্যবসায়িক যুক্তি পরিচালনা করে।
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MasterLibraryService {

    private static final UUID DEFAULT_TENANT_ID = UUID.fromString("019472ba-7000-7000-8000-000000000001");

    private final MasterLibraryEntryRepository repository;

    private UUID resolveTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        return (tenantId != null) ? tenantId : DEFAULT_TENANT_ID;
    }

    /**
     * [EN] Fetch all entries for a specific domain
     * [BN] নির্দিষ্ট ডোমেনের সকল এন্ট্রি ফেচ করা
     */
    @Transactional(readOnly = true)
    public List<MasterLibraryEntryDto> getDomainEntries(String domainCode, boolean activeOnly) {
        UUID tenantId = resolveTenantId();
        String domain = domainCode.toUpperCase().trim();

        List<MasterLibraryEntry> entries = activeOnly
                ? repository.findByTenantIdAndDomainCodeAndIsActiveTrueOrderByDisplayOrderAscEntryNameAsc(tenantId, domain)
                : repository.findByTenantIdAndDomainCodeOrderByDisplayOrderAscEntryNameAsc(tenantId, domain);

        return entries.stream().map(MasterLibraryEntryDto::fromEntity).collect(Collectors.toList());
    }

    /**
     * [EN] Fetch entries for a specific entity type within a domain
     * [BN] ডোমেনের নির্দিষ্ট এনটিটি টাইপের এন্ট্রি তালিকা
     */
    @Transactional(readOnly = true)
    public List<MasterLibraryEntryDto> getEntityEntries(String domainCode, String entityType, boolean activeOnly) {
        UUID tenantId = resolveTenantId();
        String domain = domainCode.toUpperCase().trim();
        String entity = entityType.toUpperCase().trim();

        List<MasterLibraryEntry> entries = activeOnly
                ? repository.findByTenantIdAndDomainCodeAndEntityTypeAndIsActiveTrueOrderByDisplayOrderAscEntryNameAsc(tenantId, domain, entity)
                : repository.findByTenantIdAndDomainCodeAndEntityTypeOrderByDisplayOrderAscEntryNameAsc(tenantId, domain, entity);

        return entries.stream().map(MasterLibraryEntryDto::fromEntity).collect(Collectors.toList());
    }

    /**
     * [EN] Get entry by ID
     * [BN] আইডি দ্বারা নির্দিষ্ট এন্ট্রি সংগ্রহ
     */
    @Transactional(readOnly = true)
    public MasterLibraryEntryDto getEntryById(UUID id) {
        MasterLibraryEntry entry = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Master library entry not found with id: " + id));
        return MasterLibraryEntryDto.fromEntity(entry);
    }

    /**
     * [EN] Create a new master library entry
     * [BN] নতুন মাস্টার লাইব্রেরি এন্ট্রি তৈরি করা
     */
    @Transactional
    public MasterLibraryEntryDto createEntry(CreateMasterLibraryEntryRequest request) {
        UUID tenantId = resolveTenantId();
        String domain = request.getDomainCode().toUpperCase().trim();
        String entity = request.getEntityType().toUpperCase().trim();
        String code = request.getEntryCode().toUpperCase().trim();

        if (repository.existsByTenantIdAndDomainCodeAndEntityTypeAndEntryCode(tenantId, domain, entity, code)) {
            throw new IllegalArgumentException("Master entry with code '" + code + "' already exists for entity " + entity);
        }

        MasterLibraryEntry entry = new MasterLibraryEntry();
        entry.setTenantId(tenantId);
        entry.setDomainCode(domain);
        entry.setEntityType(entity);
        entry.setEntryCode(code);
        entry.setEntryName(request.getEntryName().trim());
        entry.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        entry.setDescription(request.getDescription());
        entry.setAttributes(request.getAttributes());
        entry.setIsActive(true);
        entry.setIsSystemSeeded(false);

        MasterLibraryEntry saved = repository.save(entry);
        log.info("Created master library entry: [{}:{}] id={}", domain, code, saved.getId());
        return MasterLibraryEntryDto.fromEntity(saved);
    }

    /**
     * [EN] Update existing master library entry
     * [BN] বিদ্যমান মাস্টার লাইব্রেরি এন্ট্রি আপডেট করা
     */
    @Transactional
    public MasterLibraryEntryDto updateEntry(UUID id, UpdateMasterLibraryEntryRequest request) {
        MasterLibraryEntry entry = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Master library entry not found with id: " + id));

        entry.setEntryName(request.getEntryName().trim());
        if (request.getDisplayOrder() != null) {
            entry.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getDescription() != null) {
            entry.setDescription(request.getDescription());
        }
        if (request.getAttributes() != null) {
            entry.setAttributes(request.getAttributes());
        }
        if (request.getIsActive() != null) {
            entry.setIsActive(request.getIsActive());
        }

        MasterLibraryEntry updated = repository.save(entry);
        log.info("Updated master library entry id={}", id);
        return MasterLibraryEntryDto.fromEntity(updated);
    }

    /**
     * [EN] Toggle active status of master library entry
     * [BN] মাস্টার এন্ট্রির স্ট্যাটাস সক্রিয়/নিষ্ক্রিয় টগল করা
     */
    @Transactional
    public MasterLibraryEntryDto toggleStatus(UUID id) {
        MasterLibraryEntry entry = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Master library entry not found with id: " + id));

        entry.setIsActive(!entry.getIsActive());
        MasterLibraryEntry updated = repository.save(entry);
        log.info("Toggled active status for entry id={} to {}", id, updated.getIsActive());
        return MasterLibraryEntryDto.fromEntity(updated);
    }

    /**
     * [EN] Soft-delete entry
     * [BN] মাস্টার এন্ট্রি সফট ডিলিট
     */
    @Transactional
    public void deleteEntry(UUID id) {
        MasterLibraryEntry entry = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Master library entry not found with id: " + id));

        if (Boolean.TRUE.equals(entry.getIsSystemSeeded())) {
            throw new IllegalStateException("System seeded baseline master entries cannot be deleted.");
        }

        repository.delete(entry);
        log.info("Deleted master library entry id={}", id);
    }
}
