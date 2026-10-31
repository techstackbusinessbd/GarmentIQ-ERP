/**
 * =============================================================================
 * [EN] User Special Permissions Master-Detail Workspace (UserMatrixView.tsx)
 * [BN] ব্যবহারকারী বিশেষ অনুমতি মাস্টার-ডিটেল ওয়ার্কস্পেস (UserMatrixView.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise UI), Rule 20 (Tokens), Rule 28 (1-word)
 * [BN] একক সমন্বিত হেডার কার্ড (ইউজার ড্রপডাউনসহ), ৩-টিয়ার ফিল্টার বার এবং ফুল-উইডথ ডোমেন ব্যানার ম্যাট্রিক্স টেবিল।
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { userService } from '@/features/users';
import { extractCatalogPermissionCodes } from '../constants/accessMatrixConstants';
import { usePermissionCatalog } from '../hooks/usePermissionCatalog';
import { usePermission } from '../hooks/usePermission';
import { roleService, type BackendRoleDto } from '../services/roleService';
import { useAuthStore } from '@/store';
import { MasterDetailFilterBar } from './MasterDetailFilterBar';
import { UserDetailActionHeader } from './UserDetailActionHeader';
import { UserMasterDetailMatrixTable } from './UserMasterDetailMatrixTable';
import { UnsavedChangesFloatingBar } from './UnsavedChangesFloatingBar';

export interface UserMatrixViewProps {
  readonly initialUserId?: string;
  readonly onUserChange?: (userId: string) => void;
}

export const UserMatrixView: React.FC<UserMatrixViewProps> = ({ initialUserId, onUserChange }) => {
  const { isSuperAdmin: isCallerSuperAdmin } = usePermission();
  const { data: rawCatalog = [], isLoading: isCatalogLoading } = usePermissionCatalog();

  // Filter out platform root modules (client_mgmt) and root purge permissions for tenant operators
  const catalogDomains = useMemo(() => isCallerSuperAdmin
    ? rawCatalog
    : rawCatalog
      .map((d) => ({
        ...d,
        modules: d.modules
          .filter((m) => m.id !== 'client_mgmt')
          .map((m) => ({
            ...m,
            features: m.features.map((f) => ({
              ...f,
              actions: { ...f.actions, purge: null },
            })),
          })),
      }))
      .filter((d) => d.modules.length > 0),
    [rawCatalog, isCallerSuperAdmin]
  );
  const allCatalogCodes = useMemo(() => extractCatalogPermissionCodes(catalogDomains), [catalogDomains]);

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<BackendRoleDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [pristineGrants, setPristineGrants] = useState<Set<string>>(new Set());
  const [customGrants, setCustomGrants] = useState<Set<string>>(new Set());
  const [userGrantsMap, setUserGrantsMap] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState({ domain: 'all', module: 'all', feature: 'all', query: '' });
  const [collapsedModuleIds, setCollapsedModuleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsLoadingUsers(true);
    Promise.all([userService.getUsers(), roleService.getRoles()]).then(([userData, roleData]) => {
      setUsers(userData);
      setRoles(roleData);
      const avail = isCallerSuperAdmin ? userData : userData.filter((u) => u.username !== 'superadmin' && !u.roles?.includes('ROLE_SUPER_ADMIN'));
      if (!selectedUserId && avail.length > 0) setSelectedUserId(initialUserId || avail[0]!.id);
    }).catch(() => toast.error('Failed to load user and role directory.')).finally(() => setIsLoadingUsers(false));
  }, [initialUserId, isCallerSuperAdmin]);

  const visibleUsers = useMemo(() => isCallerSuperAdmin
    ? users
    : users.filter((u) => u.username !== 'superadmin' && !u.roles?.includes('ROLE_SUPER_ADMIN')),
    [users, isCallerSuperAdmin]
  );
  const selectedUser = useMemo(() => visibleUsers.find((u) => u.id === selectedUserId), [visibleUsers, selectedUserId]);
  const isSuperAdminUser = selectedUser?.username === 'superadmin' || selectedUser?.roles?.includes('ROLE_SUPER_ADMIN');

  const roleBasePermissions = useMemo(() => {
    if (!selectedUser?.roles || roles.length === 0) return new Set<string>();
    const set = new Set<string>();
    selectedUser.roles.forEach((code) => {
      const normalized = code.startsWith('ROLE_') ? code : `ROLE_${code}`;
      const matched = roles.find((r) => r.roleCode === code || r.roleCode === normalized || `ROLE_${r.roleCode}` === normalized);
      matched?.permissions?.forEach((p) => set.add(p));
    });
    return set;
  }, [selectedUser, roles]);

  const loadUserCustomPermissions = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const records = await userService.getCustomPermissions(userId);
      const grants = new Set<string>();
      records.forEach((r) => { if (r.isGranted) grants.add(r.permissionCode); });
      setPristineGrants(grants);
      setCustomGrants(new Set(grants));
      setUserGrantsMap((prev) => ({ ...prev, [userId]: grants.size }));
    } catch {
      toast.error('Failed to load user special permissions.');
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadUserCustomPermissions(selectedUserId);
      onUserChange?.(selectedUserId);
    }
  }, [selectedUserId, loadUserCustomPermissions, onUserChange]);

  const isCurrentDirty = useMemo(() => {
    if (customGrants.size !== pristineGrants.size) return true;
    for (const code of customGrants) { if (!pristineGrants.has(code)) return true; }
    return false;
  }, [customGrants, pristineGrants]);

  const dirtyDiffCount = useMemo(() => {
    let diff = 0;
    customGrants.forEach((c) => { if (!pristineGrants.has(c)) diff++; });
    pristineGrants.forEach((c) => { if (!customGrants.has(c)) diff++; });
    return diff;
  }, [customGrants, pristineGrants]);

  const dirtyUserIds = useMemo(() => selectedUserId && isCurrentDirty ? new Set([selectedUserId]) : new Set<string>(), [selectedUserId, isCurrentDirty]);

  const handleSelectUser = (userId: string) => {
    if (isCurrentDirty && selectedUserId !== userId) {
      toast.warning('Please save or discard changes before switching users.');
      return;
    }
    setSelectedUserId(userId);
  };

  const handleToggleAction = useCallback((code: string) => {
    if (isSuperAdminUser) return;
    setCustomGrants((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else {
        next.add(code);
        const prefix = code.split(':')[0];
        if (prefix && !next.has(`${prefix}:MENU`)) next.add(`${prefix}:MENU`);
      }
      return next;
    });
  }, [isSuperAdminUser]);

  const handleToggleMenu = useCallback((menuCodes: readonly string[], shouldEnable: boolean) => {
    if (isSuperAdminUser) return;
    setCustomGrants((prev) => {
      const next = new Set(prev);
      menuCodes.forEach((c) => (shouldEnable ? next.add(c) : next.delete(c)));
      return next;
    });
  }, [isSuperAdminUser]);

  const handleResetModule = useCallback((allCodes: readonly string[]) => {
    if (isSuperAdminUser) return;
    setCustomGrants((prev) => new Set([...prev].filter((c) => !allCodes.includes(c))));
    toast.info('Module special permissions reset to role defaults.');
  }, [isSuperAdminUser]);

  const handleClearOverrides = () => {
    if (isSuperAdminUser) return;
    setCustomGrants(new Set());
    toast.warning(`Cleared all special permissions for @${selectedUser?.username}.`);
  };

  const handleDiscard = () => {
    setCustomGrants(new Set(pristineGrants));
    toast.info('Discarded unsaved custom permission changes.');
  };

  const handleSaveOverrides = async () => {
    if (!selectedUserId || isSuperAdminUser) return;
    setIsSaving(true);
    try {
      const payload = Array.from(customGrants).map((code) => ({ permissionCode: code, isGranted: true }));
      await userService.updateCustomPermissions(selectedUserId, payload);
      setPristineGrants(new Set(customGrants));
      setUserGrantsMap((prev) => ({ ...prev, [selectedUserId]: customGrants.size }));
      await useAuthStore.getState().fetchProfile();
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('garments_erp_permissions_updated'));
      toast.success(`Clearances saved for @${selectedUser?.username}.`);
    } catch {
      toast.error('Failed to update special permissions in database.');
    } finally { setIsSaving(false); }
  };

  // 3-Tier Filter Pipeline: Domain ➔ Module ➔ Submodule ➔ Keyword
  const displayedDomains = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return catalogDomains
      .filter((d) => filters.domain === 'all' || d.id === filters.domain)
      .map((d) => ({
        ...d,
        modules: d.modules
          .filter((m) => filters.module === 'all' || m.id === filters.module)
          .map((m) => ({
            ...m,
            features: m.features.filter((f) => (filters.feature === 'all' || f.id === filters.feature) &&
              (!q || f.name.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) ||
                Object.values(f.actions).some((a) => a && (a.code.toLowerCase().includes(q) || a.label.toLowerCase().includes(q))))),
          })).filter((m) => m.features.length > 0),
      })).filter((d) => d.modules.length > 0);
  }, [catalogDomains, filters]);

  const allDisplayedModuleIds = useMemo(() => displayedDomains.flatMap((d) => d.modules.map((m) => m.id)), [displayedDomains]);
  const isAllExpanded = collapsedModuleIds.size === 0;

  const handleToggleAllCollapse = useCallback(() => {
    setCollapsedModuleIds(isAllExpanded ? new Set(allDisplayedModuleIds) : new Set());
  }, [isAllExpanded, allDisplayedModuleIds]);

  const handleToggleModuleCollapse = useCallback((moduleId: string) => {
    setCollapsedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId); else next.add(moduleId);
      return next;
    });
  }, []);

  if (isLoadingUsers || isCatalogLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-text-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-accent" />
        <span>Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 pb-12">
      <UserDetailActionHeader
        users={visibleUsers} selectedUserId={selectedUserId} onSelectUserId={handleSelectUser}
        selectedUser={selectedUser} isSuperAdmin={Boolean(isSuperAdminUser)}
        roleBaseCount={roleBasePermissions.size} customGrantsCount={customGrants.size} totalCatalogCount={allCatalogCodes.length}
        isDirty={isCurrentDirty} dirtyUserIds={dirtyUserIds} modifiedCount={dirtyDiffCount} isSaving={isSaving}
        userGrantsMap={userGrantsMap}
        onResetToDefaults={handleClearOverrides} onClearOverrides={handleClearOverrides}
        onDiscard={handleDiscard} onSaveOverrides={handleSaveOverrides}
      />

      <MasterDetailFilterBar
        domains={catalogDomains}
        selectedDomainId={filters.domain} onSelectDomainId={(domain) => setFilters((p) => ({ ...p, domain, module: 'all', feature: 'all' }))}
        selectedModuleId={filters.module} onSelectModuleId={(module) => setFilters((p) => ({ ...p, module, feature: 'all' }))}
        selectedFeatureId={filters.feature} onSelectFeatureId={(feature) => setFilters((p) => ({ ...p, feature }))}
        searchQuery={filters.query} onSearchChange={(query) => setFilters((p) => ({ ...p, query }))}
        onResetFilters={() => setFilters({ domain: 'all', module: 'all', feature: 'all', query: '' })}
        isAllExpanded={isAllExpanded} onToggleAllCollapse={handleToggleAllCollapse}
      />

      <div className="space-y-4">
        {displayedDomains.map((domain) => (
          <div key={domain.id} className="space-y-2">
            <div className="flex items-center gap-2 px-1 pt-1">
              <span className="font-mono text-accent uppercase tracking-wider text-[10px] bg-accent/10 px-2 py-0.5 rounded font-bold border border-accent/20">
                {domain.id.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-text-primary">{domain.title}</span>
              <span className="text-[10px] font-mono text-text-muted">
                ({domain.modules.reduce((acc, m) => acc + m.features.length, 0)})
              </span>
            </div>
            <UserMasterDetailMatrixTable
              modules={domain.modules}
              roleBasePermissions={roleBasePermissions} customGrants={customGrants} isSuperAdmin={Boolean(isSuperAdminUser)}
              collapsedModuleIds={collapsedModuleIds} onToggleModuleCollapse={handleToggleModuleCollapse}
              onToggleAction={handleToggleAction} onToggleMenu={handleToggleMenu} onResetModule={handleResetModule}
            />
          </div>
        ))}

        {displayedDomains.length === 0 && (
          <div className="p-12 text-center text-xs text-text-muted bg-surface-card border border-border-subtle rounded-[4px]">
            No matching modules or actions found.
          </div>
        )}
      </div>

      <UnsavedChangesFloatingBar
        title={`Unsaved Changes for @${selectedUser?.username}`} saveLabel="Save"
        modifiedCount={dirtyDiffCount} isSaving={isSaving} onDiscard={handleDiscard} onSave={handleSaveOverrides}
      />
    </div>
  );
};

export default UserMatrixView;
