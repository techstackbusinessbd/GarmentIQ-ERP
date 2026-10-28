package com.garments.erp.auth.service;

import com.garments.erp.auth.dto.PermissionDto;
import com.garments.erp.auth.entity.Permission;
import com.garments.erp.auth.repository.PermissionRepository;
import com.garments.erp.core.config.RedisCacheConfig;
import com.garments.erp.core.security.SecurityUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] System Functional Permissions Management Service (PermissionService.java)
 * [BN] সিস্টেম ফাংশনাল পারমিশন ক্যাটালগ সার্ভিস (PermissionService.java)
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ডাটাবেজের permissions টেবিল থেকে ডায়নামিক পারমিশন ডেটা লোড করে।
 *      সুপার অ্যাডমিন ছাড়া অন্য কাউকে প্ল্যাটফর্ম রুট মডিউল (যেমন: Client Management) প্রদর্শন করা নিষিদ্ধ।
 */
@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    /**
     * [EN] Retrieves all registered system permissions filtered by authority scope
     * [BN] ডাটাবেজে সংরক্ষিত পারমিশন রেকর্ড কলারের ভূমিকা অনুযায়ী ফিল্টার করে রিটার্ন করে
     */
    @Cacheable(value = RedisCacheConfig.CACHE_PERMISSIONS, key = "'all_' + (T(com.garments.erp.core.security.SecurityUtils).isSuperAdmin() ? 'super' : 'tenant')")
    @Transactional(readOnly = true)
    public List<PermissionDto> getAllPermissions() {
        Sort sort = Sort.by(Sort.Direction.ASC, "moduleName").and(Sort.by(Sort.Direction.ASC, "permissionCode"));
        List<Permission> list = permissionRepository.findAll(sort);
        boolean isSuper = SecurityUtils.isSuperAdmin();

        return list.stream()
                .filter(p -> isSuper || (!SecurityUtils.isPlatformRootPermission(p.getPermissionCode()) && !SecurityUtils.isPlatformRootModule(p.getModuleId())))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * [EN] Builds dynamic hierarchical permission catalog scoped to caller authority
     * [BN] ডাটাবেজ থেকে কলারের অধিকার অনুযায়ী নিরাপদ ডায়নামিক প্রিভিলেজ ক্যাটালগ তৈরি করে
     */
    @Cacheable(value = RedisCacheConfig.CACHE_PERMISSIONS, key = "'catalog_' + (T(com.garments.erp.core.security.SecurityUtils).isSuperAdmin() ? 'super_' : 'tenant_') + (#domainFilter != null ? #domainFilter : 'all')")
    @Transactional(readOnly = true)
    public List<com.garments.erp.auth.dto.MatrixDomainDto> getPermissionCatalog(String domainFilter) {
        List<Permission> list = (domainFilter != null && !domainFilter.isBlank())
                ? permissionRepository.findAllByDomainIdOrderBySortOrderAsc(domainFilter.trim())
                : permissionRepository.findAllByDomainIdIsNotNullOrderBySortOrderAsc();

        boolean isSuper = SecurityUtils.isSuperAdmin();
        java.util.Map<String, com.garments.erp.auth.dto.MatrixDomainDto> domainMap = new java.util.LinkedHashMap<>();
        java.util.Map<String, java.util.Map<String, com.garments.erp.auth.dto.MatrixModuleDto>> moduleMap = new java.util.LinkedHashMap<>();
        java.util.Map<String, java.util.Map<String, com.garments.erp.auth.dto.MatrixFeatureDto>> featureMap = new java.util.LinkedHashMap<>();

        for (Permission p : list) {
            // [EN] Strictly block platform-root modules (e.g. client_mgmt) from tenant operators
            // [BN] নন-সুপারঅ্যাডমিন অপারেটরদের জন্য প্ল্যাটফর্ম রুট মডিউল সম্পূর্ণ নিষিদ্ধ
            if (!isSuper && (SecurityUtils.isPlatformRootModule(p.getModuleId()) || SecurityUtils.isPlatformRootPermission(p.getPermissionCode()))) {
                continue;
            }
            String domainId = p.getDomainId();
            if (domainId == null || domainId.isBlank()) continue;

            String domainTitle = p.getDomainTitle() != null ? p.getDomainTitle() : domainId;
            domainMap.computeIfAbsent(domainId, dId -> new com.garments.erp.auth.dto.MatrixDomainDto(dId, domainTitle, new java.util.ArrayList<>()));

            String moduleId = p.getModuleId() != null ? p.getModuleId() : p.getModuleName();
            String moduleTitle = p.getModuleTitle() != null ? p.getModuleTitle() : moduleId;
            String moduleDesc = p.getModuleDescription();

            java.util.Map<String, com.garments.erp.auth.dto.MatrixModuleDto> dModules = moduleMap.computeIfAbsent(domainId, k -> new java.util.LinkedHashMap<>());
            com.garments.erp.auth.dto.MatrixModuleDto modDto = dModules.computeIfAbsent(moduleId, mId -> {
                com.garments.erp.auth.dto.MatrixModuleDto m = new com.garments.erp.auth.dto.MatrixModuleDto(mId, moduleTitle, moduleDesc, new java.util.ArrayList<>());
                domainMap.get(domainId).getModules().add(m);
                return m;
            });

            String featureId = p.getFeatureId() != null ? p.getFeatureId() : moduleId;
            String featureName = p.getFeatureName() != null ? p.getFeatureName() : moduleTitle;
            String targetPath = p.getTargetPath();

            java.util.Map<String, com.garments.erp.auth.dto.MatrixFeatureDto> mFeatures = featureMap.computeIfAbsent(domainId + ":" + moduleId, k -> new java.util.LinkedHashMap<>());
            com.garments.erp.auth.dto.MatrixFeatureDto featDto = mFeatures.computeIfAbsent(featureId, fId -> {
                java.util.Map<String, com.garments.erp.auth.dto.MatrixActionDto> initialActions = new java.util.LinkedHashMap<>();
                initialActions.put("menu", null);
                initialActions.put("view", null);
                initialActions.put("profile", null);
                initialActions.put("create", null);
                initialActions.put("edit", null);
                initialActions.put("lock", null);
                initialActions.put("resetPassword", null);
                initialActions.put("specialPermission", null);
                initialActions.put("delete", null);
                initialActions.put("restore", null);
                initialActions.put("purge", null);
                initialActions.put("approve", null);

                com.garments.erp.auth.dto.MatrixFeatureDto f = new com.garments.erp.auth.dto.MatrixFeatureDto(fId, featureName, targetPath, initialActions);
                modDto.getFeatures().add(f);
                return f;
            });

            if (p.getActionKey() != null && !p.getActionKey().isBlank()) {
                String actionKey = p.getActionKey();
                String actionLabel = p.getActionLabel() != null ? p.getActionLabel() : actionKey;
                featDto.getActions().put(actionKey, new com.garments.erp.auth.dto.MatrixActionDto(p.getPermissionCode(), actionLabel));
            }
        }

        return new java.util.ArrayList<>(domainMap.values());
    }

    private PermissionDto toDto(Permission p) {
        return new PermissionDto(
                p.getId(),
                p.getPermissionCode(),
                p.getModuleName(),
                p.getDescription()
        );
    }
}

