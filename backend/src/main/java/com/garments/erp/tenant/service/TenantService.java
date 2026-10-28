package com.garments.erp.tenant.service;

import com.garments.erp.auth.repository.RoleRepository;
import com.garments.erp.tenant.dto.CreateTenantRequest;
import com.garments.erp.tenant.dto.TenantDto;
import com.garments.erp.tenant.dto.UpdateTenantRequest;
import com.garments.erp.tenant.entity.Tenant;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.entity.UserStatus;
import com.garments.erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.garments.erp.core.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.garments.erp.settings.service.SystemAuditLogService;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] Multi-Tenant Client Organization Service (TenantService)
 * [BN] মাল্টি-টেন্যান্ট ক্লায়েন্ট প্রতিষ্ঠান সার্ভিস (TenantService) (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Manages root apparel factory client onboarding, lifecycle, and soft deletion.
 * [BN] তৈরি পোশাক কারখানা ক্লায়েন্ট অনবোর্ডিং, লাইফসাইকেল ও সফট-ডিলিট পরিচালনা করে।
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final TenantBootstrapService tenantBootstrapService;
    private final SystemAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<TenantDto> getAllTenants() { return getAllTenants(false); }

    @Transactional(readOnly = true)
    public List<TenantDto> getAllTenants(Boolean includeDeleted) {
        List<Tenant> tenants = Boolean.TRUE.equals(includeDeleted)
                ? tenantRepository.findAllByOrderByTenantNameAsc()
                : tenantRepository.findAllByIsDeletedFalseOrderByTenantNameAsc();
        return tenants.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /**
     * [EN] Retrieves a specific client tenant by identifier
     * [BN] আইডি দ্বারা নির্দিষ্ট ক্লায়েন্ট টেন্যান্টের তথ্য সংগ্রহ করে
     */
    @Transactional(readOnly = true)
    public TenantDto getTenantById(UUID id) {
        Tenant tenant = tenantRepository.findById(id).filter(t -> !t.isDeleted())
                .orElseThrow(() -> new NoSuchElementException("Tenant not found with ID: " + id));
        return mapToDto(tenant);
    }

    /**
     * [EN] Generates next atomic unique Client code conforming to CLT-{SEQ:4} (Rule 24)
     * [BN] রুল ২৪ অনুবর্তী CLT-{SEQ:4} ফরম্যাটে পরবর্তী শতভাগ ইউনিক কোম্পানি কোড তৈরি করে
     *
     * @return [EN] Standard unique client code (e.g. CLT-0001) / [BN] স্ট্যান্ডার্ড ইউনিক কোড
     */
    public synchronized String generateUniqueTenantCode() {
        for (int seq = 1; seq <= 9999; seq++) {
            String candidate = String.format("CLT-%04d", seq);
            if (!tenantRepository.existsByTenantCode(candidate)) return candidate;
        }
        return String.format("CLT-%d", System.currentTimeMillis() % 1000000);
    }

    /**
     * [EN] Provisions a new client factory tenant organization with system auto-code (Rule 24)
     * [BN] রুল ২৪ অনুযায়ী সিস্টেম স্বয়ংক্রিয় কোডসহ নতুন ক্লায়েন্ট প্রতিষ্ঠান নিবন্ধন করে
     */
    @Transactional
    public TenantDto createTenant(CreateTenantRequest request) {
        String rawCode = request.getTenantCode();
        String code = (rawCode == null || rawCode.isBlank() || "SYSTEM_AUTO_GENERATED".equalsIgnoreCase(rawCode.trim()) || rawCode.startsWith("AUTO_"))
                ? generateUniqueTenantCode() : rawCode.trim().toUpperCase();

        if (tenantRepository.existsByTenantCode(code)) code = generateUniqueTenantCode();
        log.info("Provisioning client tenant '{}' with system code '{}'", request.getTenantName(), code);

        if ("SYSTEM".equalsIgnoreCase(code)) {
            throw new IllegalArgumentException("Tenant code 'SYSTEM' is reserved for platform root administration.");
        }
        if (tenantRepository.existsByTenantCode(code)) {
            throw new IllegalArgumentException("Tenant code '" + code + "' is already registered in the system");
        }

        String subdomain = null;
        if (request.getSubdomain() != null && !request.getSubdomain().trim().isEmpty()) {
            subdomain = request.getSubdomain().trim().toLowerCase();
            if (tenantRepository.existsBySubdomainIgnoreCaseAndIsDeletedFalse(subdomain)) {
                throw new BusinessException("Subdomain '" + subdomain + "' is already registered. Please choose a different subdomain.", HttpStatus.CONFLICT);
            }
        }

        Tenant tenant = new Tenant(code, request.getTenantName().trim(), request.getContactEmail().trim());
        Optional.ofNullable(request.getContactPhone()).ifPresent(v -> tenant.setContactPhone(v.trim()));
        Optional.ofNullable(request.getAddress()).ifPresent(v -> tenant.setAddress(v.trim()));
        tenant.setSubscriptionTier(request.getSubscriptionTier() != null ? request.getSubscriptionTier().trim().toUpperCase() : "ENTERPRISE");
        tenant.setCompanyType(request.getCompanyType() != null ? request.getCompanyType().trim().toUpperCase() : "GROUP_OF_COMPANIES");
        tenant.setHostingType(request.getHostingType() != null ? request.getHostingType().trim().toUpperCase() : "CLOUD_SAAS");
        tenant.setSubdomain(subdomain);
        Optional.ofNullable(request.getCustomDomain()).ifPresent(v -> tenant.setCustomDomain(v.trim().toLowerCase()));
        tenant.setBusinessType(request.getBusinessType()); tenant.setFactoryZone(request.getFactoryZone());
        tenant.setSewingLines(request.getSewingLines()); tenant.setDailyCapacity(request.getDailyCapacity());
        tenant.setHasWashingPlant(request.getHasWashingPlant()); tenant.setTradeLicenseNo(request.getTradeLicenseNo());
        tenant.setBgmeaRegNo(request.getBgmeaRegNo()); tenant.setActive(true);

        Tenant saved = tenantRepository.save(tenant);

        if (request.getAdminUsername() != null && !request.getAdminUsername().trim().isEmpty()
                && request.getAdminPassword() != null && !request.getAdminPassword().trim().isEmpty()) {
            String adminUsername = request.getAdminUsername().trim().toLowerCase();
            if (userRepository.findByUsernameAndIsDeletedFalse(adminUsername).isPresent()) {
                throw new BusinessException("Username '" + adminUsername + "' is already registered in the system.", HttpStatus.CONFLICT);
            }
            String adminEmail = (request.getAdminEmail() != null && !request.getAdminEmail().trim().isEmpty())
                    ? request.getAdminEmail().trim() : request.getContactEmail().trim();

            User adminUser = new User(saved.getId(), adminUsername, adminEmail, passwordEncoder.encode(request.getAdminPassword()),
                    request.getAdminFullName() != null ? request.getAdminFullName().trim() : request.getTenantName().trim() + " Admin");
            adminUser.setDepartment("MANAGEMENT");
            adminUser.setDesignation("Client Administrator");
            adminUser.setPhone(request.getAdminPhone() != null ? request.getAdminPhone().trim() : request.getContactPhone());
            adminUser.setStatus(UserStatus.ACTIVE);
            adminUser.setEmployeeCardNo("255776");
            roleRepository.findFirstByRoleCodeAndIsDeletedFalse("ROLE_ADMIN").ifPresent(r -> adminUser.setRoles(Set.of(r)));
            userRepository.save(adminUser);
            log.info("Provisioned initial Client Admin '{}' for tenant '{}'", adminUsername, saved.getTenantCode());
        }

        if (saved.getId() != null) {
            tenantBootstrapService.bootstrapNewTenant(saved.getId());
        }

        auditLogService.record("TENANT_MANAGEMENT", "TENANT_CREATED",
                "Created client tenant: " + saved.getTenantName() + " (" + saved.getTenantCode() + ")",
                saved.getId() != null ? saved.getId().toString() : saved.getTenantCode(), saved.getTenantCode());

        return mapToDto(saved);
    }

    /**
     * [EN] Updates existing client factory tenant profile details
     * [BN] বিদ্যমান ক্লায়েন্ট কারখানা টেন্যান্টের তথ্য ও স্ট্যাটাস হালনাগাদ করে
     */
    @Transactional
    public TenantDto updateTenant(UUID id, UpdateTenantRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new NoSuchElementException("Tenant not found with ID: " + id));

        Optional.ofNullable(request.getTenantName()).filter(v -> !v.trim().isEmpty()).ifPresent(v -> tenant.setTenantName(v.trim()));
        Optional.ofNullable(request.getContactEmail()).filter(v -> !v.trim().isEmpty()).ifPresent(v -> tenant.setContactEmail(v.trim()));
        Optional.ofNullable(request.getContactPhone()).ifPresent(v -> tenant.setContactPhone(v.trim()));
        Optional.ofNullable(request.getAddress()).ifPresent(v -> tenant.setAddress(v.trim()));
        Optional.ofNullable(request.getSubscriptionTier()).filter(v -> !v.trim().isEmpty()).ifPresent(v -> tenant.setSubscriptionTier(v.trim().toUpperCase()));
        Optional.ofNullable(request.getCompanyType()).filter(v -> !v.trim().isEmpty()).ifPresent(v -> tenant.setCompanyType(v.trim().toUpperCase()));
        Optional.ofNullable(request.getHostingType()).filter(v -> !v.trim().isEmpty()).ifPresent(v -> tenant.setHostingType(v.trim().toUpperCase()));

        // [EN] Subdomain is immutable once provisioned for a cloud tenant (Rule 24)
        // [BN] ক্লাউড টেন্যান্টের সাবডোমেন একবার তৈরি হওয়ার পর আর হালনাগাদ করা যাবে না
        if (request.getSubdomain() != null && !request.getSubdomain().trim().isEmpty()) {
            String incomingSub = request.getSubdomain().trim().toLowerCase();
            if (tenant.getSubdomain() != null && !tenant.getSubdomain().equalsIgnoreCase(incomingSub)) {
                throw new BusinessException("Cloud tenant subdomain is immutable and cannot be updated once provisioned.", HttpStatus.BAD_REQUEST);
            }
            if (tenant.getSubdomain() == null) tenant.setSubdomain(incomingSub);
        }
        Optional.ofNullable(request.getCustomDomain()).ifPresent(v -> tenant.setCustomDomain(v.trim().toLowerCase()));
        Optional.ofNullable(request.getBusinessType()).ifPresent(v -> tenant.setBusinessType(v.trim()));
        Optional.ofNullable(request.getFactoryZone()).ifPresent(v -> tenant.setFactoryZone(v.trim()));
        Optional.ofNullable(request.getSewingLines()).ifPresent(tenant::setSewingLines);
        Optional.ofNullable(request.getDailyCapacity()).ifPresent(tenant::setDailyCapacity);
        Optional.ofNullable(request.getHasWashingPlant()).ifPresent(tenant::setHasWashingPlant);
        Optional.ofNullable(request.getTradeLicenseNo()).ifPresent(v -> tenant.setTradeLicenseNo(v.trim()));
        Optional.ofNullable(request.getBgmeaRegNo()).ifPresent(v -> tenant.setBgmeaRegNo(v.trim()));
        Optional.ofNullable(request.getActive()).ifPresent(tenant::setActive);

        tenant.setUpdatedAt(Instant.now());
        Tenant saved = tenantRepository.save(tenant);
        auditLogService.record("TENANT_MANAGEMENT", "TENANT_UPDATED",
                "Updated client tenant: " + saved.getTenantName() + " (" + saved.getTenantCode() + ")",
                saved.getId().toString(), saved.getTenantCode());
        return mapToDto(saved);
    }

    /**
     * [EN] Soft-deletes a client factory tenant preserving audit integrity
     * [BN] অডিট হিস্ট্রি বজায় রেখে ক্লায়েন্ট টেন্যান্টের নিরাপদ সফট-ডিলিট সম্পন্ন করে
     */
    @Transactional
    public void deleteTenant(UUID id) {
        Tenant tenant = tenantRepository.findById(id)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new NoSuchElementException("Tenant not found with ID: " + id));

        if ("SYSTEM".equalsIgnoreCase(tenant.getTenantCode()) || "PLATFORM_ROOT".equalsIgnoreCase(tenant.getSubscriptionTier())) {
            throw new IllegalArgumentException("System Root Tenant is protected and cannot be deactivated or deleted.");
        }

        tenant.setDeleted(true);
        tenant.setActive(false);
        tenant.setUpdatedAt(Instant.now());
        tenantRepository.save(tenant);
        auditLogService.record("TENANT_MANAGEMENT", "TENANT_DELETED",
                "Soft-deleted client tenant: " + tenant.getTenantName() + " (" + tenant.getTenantCode() + ")",
                tenant.getId().toString(), tenant.getTenantCode());
        log.info("Soft-deleted client tenant ID {}", id);
    }

    /**
     * [EN] Restores a soft-deleted client factory tenant back to active state
     * [BN] সফট-ডিলিটকৃত ক্লায়েন্ট টেন্যান্ট পুনরায় সক্রিয় অবস্থায় ফিরিয়ে আনে
     */
    @Transactional
    public TenantDto restoreTenant(UUID id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Tenant not found with ID: " + id));
        if (!tenant.isDeleted()) {
            throw new IllegalArgumentException("Client tenant is already active and cannot be restored.");
        }
        tenant.setDeleted(false);
        tenant.setActive(true);
        tenant.setUpdatedAt(Instant.now());
        Tenant saved = tenantRepository.save(tenant);
        auditLogService.record("TENANT_MANAGEMENT", "TENANT_RESTORED",
                "Restored soft-deleted client tenant: " + saved.getTenantName() + " (" + saved.getTenantCode() + ")",
                saved.getId().toString(), saved.getTenantCode());
        log.info("Restored client tenant ID {}", id);
        return mapToDto(saved);
    }

    /**
     * [EN] Permanently purges a client factory tenant and associated users
     * [BN] ট্র্যাশ থেকে ক্লায়েন্ট টেন্যান্ট ও তার ইউজারদের চিরতরে ডেটাবেজ থেকে মুছে ফেলে
     */
    @Transactional
    public void purgeTenant(UUID id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Tenant not found with ID: " + id));
        if ("SYSTEM".equalsIgnoreCase(tenant.getTenantCode()) || "PLATFORM_ROOT".equalsIgnoreCase(tenant.getSubscriptionTier())) {
            throw new IllegalStateException("System Root Tenant is protected and cannot be purged.");
        }
        if (!tenant.isDeleted()) {
            throw new IllegalArgumentException("Only soft-deleted tenants in Trash can be permanently purged.");
        }
        userRepository.deleteAllByTenantId(id);
        tenantRepository.delete(tenant);
        auditLogService.record("TENANT_MANAGEMENT", "TENANT_PURGED",
                "Permanently purged client tenant: " + tenant.getTenantName() + " (" + tenant.getTenantCode() + ")",
                tenant.getId().toString(), tenant.getTenantCode());
        log.info("Permanently purged client tenant ID {}", id);
    }

    /**
     * [EN] Checks whether a subdomain is available for registration
     * [BN] সাবডোমেনটি খালি আছে কি না তা যাচাই করে
     */
    @Transactional(readOnly = true)
    public boolean isSubdomainAvailable(String subdomain) {
        if (subdomain == null || subdomain.trim().isEmpty()) return false;
        return !tenantRepository.existsBySubdomainIgnoreCaseAndIsDeletedFalse(subdomain.trim().toLowerCase());
    }

    /**
     * [EN] Maps domain Tenant entity to secure TenantDto
     * [BN] ডোমেন টেন্যান্ট এন্টিটিকে নিরাপদ TenantDto-তে রূপান্তর করে
     */
    public TenantDto mapToDto(Tenant t) {
        TenantDto dto = new TenantDto(t.getId(), t.getTenantCode(), t.getTenantName(), t.getContactEmail(),
                t.getContactPhone(), t.getAddress(), t.getSubscriptionTier(), t.isActive(), t.getCreatedAt());
        dto.setBusinessType(t.getBusinessType()); dto.setFactoryZone(t.getFactoryZone());
        dto.setSewingLines(t.getSewingLines()); dto.setDailyCapacity(t.getDailyCapacity());
        dto.setHasWashingPlant(t.getHasWashingPlant()); dto.setTradeLicenseNo(t.getTradeLicenseNo());
        dto.setBgmeaRegNo(t.getBgmeaRegNo()); dto.setCompanyType(t.getCompanyType());
        dto.setHostingType(t.getHostingType()); dto.setSubdomain(t.getSubdomain());
        dto.setCustomDomain(t.getCustomDomain()); dto.setDeleted(t.isDeleted());
        return dto;
    }
}
