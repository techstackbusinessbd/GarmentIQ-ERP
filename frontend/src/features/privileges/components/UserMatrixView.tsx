/**
 * =============================================================================
 * [EN] User Special Permissions Master-Detail Workspace (UserMatrixView.tsx)
 * [BN] ব্যবহারকারী বিশেষ অনুমতি মাস্টার-ডিটেল ওয়ার্কস্পেস (UserMatrixView.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise UI), Rule 20 (Tokens), Rule 28 (1-word buttons)
 * [BN] বামপাশে ফ্যাক্টরি ইউজার তালিকা এবং ডানপাশে স্লিম কন্ট্রোল হেডার ও হাই-ডেনসিটি ম্যাট্রিক্স টেবিল।
 *      প্ল্যাটফর্ম রুট মডিউল (Client Management) নন-সুপারঅ্যাডমিনদের জন্য সম্পূর্ণ নিষিদ্ধ।
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, Search, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { userService } from '@/features/users';
import { extractCatalogPermissionCodes } from '../constants/accessMatrixConstants';
import { usePermissionCatalog } from '../hooks/usePermissionCatalog';
import { usePermission } from '../hooks/usePermission';
import { roleService, type BackendRoleDto } from '../services/roleService';
import { useAuthStore } from '@/store';
import { TextInput } from '@/components/ui/TextInput';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { MasterDetailUserList } from './MasterDetailUserList';
import { UserDetailActionHeader } from './UserDetailActionHeader';
import { UserMasterDetailMatrixTable } from './UserMasterDetailMatrixTable';
import { UnsavedChangesFloatingBar } from './UnsavedChangesFloatingBar';

export interface UserMatrixViewProps {
  readonly initialUserId?: string;
  readonly onUserChange?: (userId: string) => void;
}

export const UserMatrixView: React.FC<UserMatrixViewProps> = ({ initialUserId, onUserChange }) => {
  const { isSuperAdmin: isCallerSuperAdmin } = usePermission();
  const { data: rawCatalog = [], isLoading: isCatalogLoading } = usePermissionCatalog('admin');

  // [EN] Filter out platform root modules (client_mgmt) for tenant operators
  // [BN] নন-সুপারঅ্যাডমিন অপারেটরদের জন্য প্ল্যাটফর্ম রুট মডিউল ফিল্টার আউট করা
  const catalogDomains = useMemo(() => {
    if (isCallerSuperAdmin) return rawCatalog;
    return rawCatalog.map((d) => ({ ...d, modules: d.modules.filter((m) => m.id !== 'client_mgmt') }));
  }, [rawCatalog, isCallerSuperAdmin]);

  const allCatalogCodes = useMemo(() => extractCatalogPermissionCodes(catalogDomains), [catalogDomains]);

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<BackendRoleDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [pristineGrants, setPristineGrants] = useState<Set<string>>(new Set());
  const [customGrants, setCustomGrants] = useState<Set<string>>(new Set());
  const [userGrantsMap, setUserGrantsMap] = useState<Record<string, number>>({});
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setIsLoadingUsers(true);
    Promise.all([userService.getUsers(), roleService.getRoles()]).then(([userData, roleData]) => {
      setUsers(userData);
      setRoles(roleData);
      const avail = isCallerSuperAdmin ? userData : userData.filter((u) => u.username !== 'superadmin' && !u.roles?.includes('ROLE_SUPER_ADMIN'));
      if (!selectedUserId && avail.length > 0) setSelectedUserId(initialUserId || avail[0]!.id);
    }).catch(() => toast.error('Failed to load user and role directory.')).finally(() => setIsLoadingUsers(false));
  }, [initialUserId, isCallerSuperAdmin]);

  const visibleUsers = useMemo(() => {
    return isCallerSuperAdmin ? users : users.filter((u) => u.username !== 'superadmin' && !u.roles?.includes('ROLE_SUPER_ADMIN'));
  }, [users, isCallerSuperAdmin]);

  const selectedUser = useMemo(() => visibleUsers.find((u) => u.id === selectedUserId), [visibleUsers, selectedUserId]);
  const isSuperAdminUser = selectedUser?.username === 'superadmin' || selectedUser?.roles?.includes('ROLE_SUPER_ADMIN');

  const roleBasePermissions = useMemo(() => {
    if (!selectedUser?.roles || roles.length === 0) return new Set<string>();
    const set = new Set<string>();
    selectedUser.roles.forEach((roleCode) => {
      const normalized = roleCode.startsWith('ROLE_') ? roleCode : `ROLE_${roleCode}`;
      const matched = roles.find((r) => r.roleCode === roleCode || r.roleCode === normalized || `ROLE_${r.roleCode}` === normalized);
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

  const dirtyUserIds = useMemo(() => {
    return selectedUserId && isCurrentDirty ? new Set([selectedUserId]) : new Set<string>();
  }, [selectedUserId, isCurrentDirty]);

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

  const handleResetToDefaults = () => {
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

  const displayedModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogDomains
      .filter((d) => selectedDomainId === 'all' || d.id === selectedDomainId)
      .flatMap((d) => d.modules)
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.features.some((f) => f.name.toLowerCase().includes(q) || Object.values(f.actions).some((a) => a && a.code.toLowerCase().includes(q))));
  }, [catalogDomains, selectedDomainId, searchQuery]);

  const domainFilterOptions = useMemo(() => [
    { value: 'all', label: 'All Domains', count: catalogDomains.length },
    ...catalogDomains.map((d) => ({ value: d.id, label: d.title, count: d.modules.length })),
  ], [catalogDomains]);

  if (isLoadingUsers || isCatalogLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-text-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-accent" />
        <span>Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column: User Navigation List */}
        <div className="lg:col-span-4 xl:col-span-3">
          <MasterDetailUserList
            users={visibleUsers}
            selectedUserId={selectedUserId}
            onSelectUserId={handleSelectUser}
            userGrantsMap={userGrantsMap}
            dirtyUserIds={dirtyUserIds}
            isLoading={isLoadingUsers}
          />
        </div>

        {/* Right Column: Unified Clearances Workspace */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-2.5">
          <UserDetailActionHeader
            selectedUser={selectedUser}
            isSuperAdmin={Boolean(isSuperAdminUser)}
            roleBaseCount={roleBasePermissions.size}
            customGrantsCount={customGrants.size}
            totalCatalogCount={allCatalogCodes.length}
            isDirty={isCurrentDirty}
            isSaving={isSaving}
            onResetToDefaults={handleResetToDefaults}
            onSaveOverrides={handleSaveOverrides}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs">
            <div className="flex-1 min-w-[200px] max-w-sm">
              <TextInput
                leftIcon={<Search size={13} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules..."
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-52">
                <SearchableSelect
                  options={domainFilterOptions}
                  value={selectedDomainId}
                  onChange={setSelectedDomainId}
                  placeholder="Select domain..."
                  searchPlaceholder="Search domains..."
                />
              </div>

              {(searchQuery || selectedDomainId !== 'all') && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedDomainId('all'); }}
                  className="px-2 py-1 text-xs text-text-muted hover:text-text-primary rounded inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <UserMasterDetailMatrixTable
            modules={displayedModules}
            roleBasePermissions={roleBasePermissions}
            customGrants={customGrants}
            isSuperAdmin={Boolean(isSuperAdminUser)}
            onToggleAction={handleToggleAction}
            onToggleMenu={handleToggleMenu}
            onResetModule={handleResetModule}
          />

          <UnsavedChangesFloatingBar
            title={`Unsaved Changes for @${selectedUser?.username}`}
            saveLabel="Save"
            modifiedCount={dirtyDiffCount}
            isSaving={isSaving}
            onDiscard={handleDiscard}
            onSave={handleSaveOverrides}
          />
        </div>
      </div>
    </div>
  );
};

export default UserMatrixView;
