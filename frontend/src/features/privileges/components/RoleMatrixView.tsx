/**
 * =============================================================================
 * [EN] Master-Detail Role & Access Matrix Workspace (RoleMatrixView.tsx)
 * [BN] মাস্টার-ডিটেল রোল ও অ্যাক্সেস ম্যাট্রিক্স ওয়ার্কস্পেস (RoleMatrixView.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise UI), Rule 20 (Tokens)
 * [BN] একক সমন্বিত হেডার কার্ড (রোল ড্রপডাউনসহ) এবং নিচে ফুল-উইডথ স্মার্ট গ্রুপ ব্যানার ম্যাট্রিক্স টেবিল।
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { extractCatalogPermissionCodes } from '../constants/accessMatrixConstants';
import { usePermissionCatalog } from '../hooks/usePermissionCatalog';
import { usePermission } from '../hooks/usePermission';
import { roleService, type BackendRoleDto } from '../services/roleService';
import { useAuthStore } from '@/store';
import { MasterDetailFilterBar } from './MasterDetailFilterBar';
import { MasterDetailActionHeader } from './MasterDetailActionHeader';
import { MasterDetailMatrixTable } from './MasterDetailMatrixTable';

export interface RoleMatrixViewProps {
  readonly initialRoleCode?: string;
}

export const RoleMatrixView: React.FC<RoleMatrixViewProps> = ({ initialRoleCode }) => {
  const { isSuperAdmin: isCallerSuperAdmin } = usePermission();
  const { data: rawCatalog = [], isLoading: isCatalogLoading } = usePermissionCatalog('admin');

  // Filter out platform root modules (client_mgmt) for tenant administrators
  const catalogDomains = useMemo(() => {
    if (isCallerSuperAdmin) return rawCatalog;
    return rawCatalog.map((d) => ({ ...d, modules: d.modules.filter((m) => m.id !== 'client_mgmt') }));
  }, [rawCatalog, isCallerSuperAdmin]);

  const allCatalogCodes = useMemo(() => extractCatalogPermissionCodes(catalogDomains), [catalogDomains]);

  const [roles, setRoles] = useState<BackendRoleDto[]>([]);
  const [selectedRoleCode, setSelectedRoleCode] = useState<string>(
    initialRoleCode && (isCallerSuperAdmin || initialRoleCode !== 'ROLE_SUPER_ADMIN') ? initialRoleCode : 'ROLE_ADMIN'
  );
  const [pristinePermissions, setPristinePermissions] = useState<Record<string, string[]>>({});
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 3-Tier Cascading Filter States
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    roleService.getRoles()
      .then((data) => {
        setRoles(data);
        const map: Record<string, string[]> = {};
        data.forEach((r) => { map[r.roleCode] = Array.from(r.permissions || []); });
        setPristinePermissions(map);
        setRolePermissions(JSON.parse(JSON.stringify(map)));
        const availableRoles = isCallerSuperAdmin ? data : data.filter((r) => r.roleCode !== 'ROLE_SUPER_ADMIN');
        if (!selectedRoleCode && availableRoles.length > 0) setSelectedRoleCode(availableRoles[0]!.roleCode);
      })
      .catch(() => toast.error('Failed to load roles from database.'))
      .finally(() => setIsLoading(false));
  }, [isCallerSuperAdmin]);

  const visibleRoles = useMemo(() => {
    if (isCallerSuperAdmin) return roles;
    return roles.filter((r) => r.roleCode !== 'ROLE_SUPER_ADMIN');
  }, [roles, isCallerSuperAdmin]);

  const isSuperAdmin = selectedRoleCode === 'ROLE_SUPER_ADMIN';
  const activeRole = roles.find((r) => r.roleCode === selectedRoleCode);
  const roleName = activeRole ? activeRole.roleName : selectedRoleCode;
  const activePermsSet = useMemo(() => new Set(rolePermissions[selectedRoleCode] || []), [rolePermissions, selectedRoleCode]);

  // Dirty State Calculation
  const dirtyRoleCodes = useMemo(() => {
    const dirty = new Set<string>();
    Object.keys(rolePermissions).forEach((code) => {
      const curr = rolePermissions[code] || [];
      const prist = pristinePermissions[code] || [];
      if (curr.length !== prist.length || curr.some((c) => !prist.includes(c))) dirty.add(code);
    });
    return dirty;
  }, [rolePermissions, pristinePermissions]);

  const activeRoleModifiedCount = useMemo(() => {
    const current = new Set(rolePermissions[selectedRoleCode] || []);
    const pristine = new Set(pristinePermissions[selectedRoleCode] || []);
    let diff = 0;
    current.forEach((c) => { if (!pristine.has(c)) diff++; });
    pristine.forEach((c) => { if (!current.has(c)) diff++; });
    return diff;
  }, [rolePermissions, pristinePermissions, selectedRoleCode]);

  // Handlers
  const handleToggleAction = useCallback((code: string) => {
    if (isSuperAdmin) return;
    setRolePermissions((prev) => {
      const current = new Set(prev[selectedRoleCode] || []);
      if (current.has(code)) {
        current.delete(code);
      } else {
        current.add(code);
        const prefix = code.split(':')[0];
        if (prefix && !current.has(`${prefix}:MENU`)) current.add(`${prefix}:MENU`);
      }
      return { ...prev, [selectedRoleCode]: Array.from(current) };
    });
  }, [isSuperAdmin, selectedRoleCode]);

  const handleToggleModuleMenu = useCallback((menuCodes: readonly string[], shouldEnable: boolean) => {
    if (isSuperAdmin) return;
    setRolePermissions((prev) => {
      const current = new Set(prev[selectedRoleCode] || []);
      menuCodes.forEach((c) => (shouldEnable ? current.add(c) : current.delete(c)));
      return { ...prev, [selectedRoleCode]: Array.from(current) };
    });
  }, [isSuperAdmin, selectedRoleCode]);

  const handleSetModulePermissions = useCallback((allCodes: readonly string[], grantCodes: readonly string[]) => {
    if (isSuperAdmin) return;
    const allSet = new Set(allCodes);
    setRolePermissions((prev) => {
      const current = prev[selectedRoleCode] || [];
      const remaining = current.filter((c) => !allSet.has(c));
      return { ...prev, [selectedRoleCode]: Array.from(new Set([...remaining, ...grantCodes])) };
    });
  }, [isSuperAdmin, selectedRoleCode]);

  const handleResetFilters = useCallback(() => {
    setSelectedDomainId('all');
    setSelectedModuleId('all');
    setSelectedFeatureId('all');
    setSearchQuery('');
  }, []);

  const handleReadOnly = () => {
    if (isSuperAdmin) return;
    const viewCodes = catalogDomains.flatMap((d) =>
      d.modules.flatMap((m) =>
        m.features.flatMap((f) => [f.actions.view?.code, f.actions.profile?.code, f.actions.menu?.code]).filter((c): c is string => Boolean(c))
      )
    );
    setRolePermissions((prev) => ({ ...prev, [selectedRoleCode]: viewCodes }));
    toast.info(`Set ${roleName} to View Only clearance.`);
  };

  const handleFullAccess = () => {
    if (isSuperAdmin) return;
    setRolePermissions((prev) => ({ ...prev, [selectedRoleCode]: [...allCatalogCodes] }));
    toast.info(`Granted full clearance across all modules to ${roleName}.`);
  };

  const handleResetDefaults = () => {
    if (isSuperAdmin) return;
    setRolePermissions((prev) => ({ ...prev, [selectedRoleCode]: [...(pristinePermissions[selectedRoleCode] || [])] }));
    toast.info(`Reloaded baseline defaults for ${roleName}.`);
  };

  const handleClearAll = () => {
    if (isSuperAdmin) return;
    setRolePermissions((prev) => ({ ...prev, [selectedRoleCode]: [] }));
    toast.warning(`Cleared all permissions for ${roleName}.`);
  };

  const handleDiscard = () => {
    setRolePermissions((prev) => ({ ...prev, [selectedRoleCode]: [...(pristinePermissions[selectedRoleCode] || [])] }));
    toast.info(`Discarded unsaved changes for ${roleName}.`);
  };

  const handleSave = async () => {
    if (isSuperAdmin) return;
    setIsSaving(true);
    try {
      const perms = rolePermissions[selectedRoleCode] || [];
      const updated = await roleService.updateRolePermissions(selectedRoleCode, perms);
      setPristinePermissions((prev) => ({ ...prev, [selectedRoleCode]: updated }));
      setRolePermissions((prev) => ({ ...prev, [selectedRoleCode]: updated }));
      await useAuthStore.getState().fetchProfile();
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('garments_erp_permissions_updated'));
      toast.success(`Access clearances saved successfully for ${roleName}.`);
    } catch {
      toast.error('Failed to save role permissions in database.');
    } finally {
      setIsSaving(false);
    }
  };

  // 3-Tier Filter Pipeline: Domain ➔ Module ➔ Submodule ➔ Keyword
  const displayedDomains = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogDomains
      .filter((d) => selectedDomainId === 'all' || d.id === selectedDomainId)
      .map((d) => {
        const modules = d.modules
          .filter((m) => selectedModuleId === 'all' || m.id === selectedModuleId)
          .map((m) => {
            const features = m.features.filter((f) => {
              const matches = selectedFeatureId === 'all' || f.id === selectedFeatureId;
              if (!matches) return false;
              if (!q) return true;
              return f.name.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) ||
                Object.values(f.actions).some((a) => a && (a.code.toLowerCase().includes(q) || a.label.toLowerCase().includes(q)));
            });
            return { ...m, features };
          })
          .filter((m) => m.features.length > 0);
        return { ...d, modules };
      })
      .filter((d) => d.modules.length > 0);
  }, [catalogDomains, selectedDomainId, selectedModuleId, selectedFeatureId, searchQuery]);

  if (isLoading || isCatalogLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-text-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-accent" />
        <span>Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 pb-12">
      {/* 1. Unified Single Active Role Header & Dropdown Card */}
      <MasterDetailActionHeader
        roles={visibleRoles}
        selectedRoleCode={selectedRoleCode}
        onSelectRoleCode={setSelectedRoleCode}
        role={activeRole}
        grantedCount={isSuperAdmin ? allCatalogCodes.length : activePermsSet.size}
        totalCatalogCount={allCatalogCodes.length}
        isSuperAdmin={isSuperAdmin}
        isDirty={dirtyRoleCodes.has(selectedRoleCode)}
        dirtyRoleCodes={dirtyRoleCodes}
        modifiedCount={activeRoleModifiedCount}
        isSaving={isSaving}
        onReadOnly={handleReadOnly}
        onFullAccess={handleFullAccess}
        onResetDefaults={handleResetDefaults}
        onClearAll={handleClearAll}
        onDiscard={handleDiscard}
        onSave={handleSave}
      />

      {/* 2. 3-Tier Cascading Clearance Filters Bar */}
      <MasterDetailFilterBar
        domains={catalogDomains}
        selectedDomainId={selectedDomainId}
        onSelectDomainId={setSelectedDomainId}
        selectedModuleId={selectedModuleId}
        onSelectModuleId={setSelectedModuleId}
        selectedFeatureId={selectedFeatureId}
        onSelectFeatureId={setSelectedFeatureId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Full-Width Smart Group Banner Matrix Table */}
      <div className="space-y-4">
        {displayedDomains.map((domain) => (
          <div key={domain.id} className="space-y-2">
            <div className="flex items-center gap-2 px-1 pt-1">
              <span className="font-mono text-brand-accent uppercase tracking-wider text-[10px] bg-brand-accent/10 px-2 py-0.5 rounded font-bold border border-brand-accent/20">
                {domain.id.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-text-primary">
                {domain.title}
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                ({domain.modules.reduce((acc, m) => acc + m.features.length, 0)})
              </span>
            </div>
            <MasterDetailMatrixTable
              modules={domain.modules}
              activePermissions={activePermsSet}
              isSuperAdmin={isSuperAdmin}
              onToggleAction={handleToggleAction}
              onToggleModuleMenu={handleToggleModuleMenu}
              onSetModulePermissions={handleSetModulePermissions}
            />
          </div>
        ))}

        {displayedDomains.length === 0 && (
          <div className="p-12 text-center text-xs text-text-muted bg-surface-card border border-border-subtle rounded-[4px]">
            No matching modules or actions found.
          </div>
        )}
      </div>
    </div>
  );
};
