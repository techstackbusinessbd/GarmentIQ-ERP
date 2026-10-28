/**
 * =============================================================================
 * [EN] Enterprise Role Directory Data Grid Table Component (RoleTable)
 * [BN] এন্টারপ্রাইজ রোল ডিরেক্টরি ডেটা গ্রিড টেবিল কম্পোনেন্ট (RoleTable)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21, Rule 27, Rule 28
 * [BN] ট্যানস্ট্যাক টেবিল চালিত রোল ডিরেক্টরি, অ্যাক্টিভ বনাম ট্র্যাশ ভিউ ও অ্যাকশনস।
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, SlidersHorizontal, RefreshCw, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { RoleDefinition } from '@/features/users';
import { DataTable, Button } from '@/components/ui';
import { usePermissionCatalog } from '../hooks/usePermissionCatalog';
import { usePermission } from '../hooks/usePermission';
import { extractCatalogPermissionCodes } from '../constants/accessMatrixConstants';
import { clientService } from '@/features/clients/services/clientService';
import { roleService } from '../services/roleService';
import type { Tenant } from '@/types/tenant.types';
import { useRoleColumns } from './useRoleColumns';
import { DeleteRoleModal } from './DeleteRoleModal';
import { RoleRestoreModal } from './RoleRestoreModal';
import { RolePurgeModal } from './RolePurgeModal';

export interface RoleTableProps {
  readonly roles: readonly RoleDefinition[];
  readonly isLoading?: boolean;
  readonly onRefresh?: () => void;
  readonly onCreateRole?: () => void;
  readonly onViewPermissions: (role: RoleDefinition) => void;
  readonly onDeleteRole?: (role: RoleDefinition) => void;
  readonly onViewMatrix: () => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  isLoading = false,
  onRefresh,
  onCreateRole,
  onViewPermissions,
  onViewMatrix,
}) => {
  const { isSuperAdmin } = usePermission();
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'TRASH'>('ACTIVE');
  const [selectedClient, setSelectedClient] = useState<string>('ALL');
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [roleToDelete, setRoleToDelete] = useState<RoleDefinition | null>(null);
  const [roleToRestore, setRoleToRestore] = useState<RoleDefinition | null>(null);
  const [roleToPurge, setRoleToPurge] = useState<RoleDefinition | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  useEffect(() => {
    if (isSuperAdmin) {
      clientService
        .getAllTenants()
        .then((data) => {
          if (Array.isArray(data)) setAvailableTenants(data);
        })
        .catch(() => {});
    }
  }, [isSuperAdmin]);

  const { data: catalogDomains = [] } = usePermissionCatalog('admin');
  const totalClearancesCount = useMemo(
    () => extractCatalogPermissionCodes(catalogDomains).length || 23,
    [catalogDomains]
  );

  const activeCount = useMemo(() => roles.filter((r) => !r.isDeleted && !r.deleted).length, [roles]);
  const trashCount = useMemo(() => roles.filter((r) => r.isDeleted || r.deleted).length, [roles]);

  const modeFilteredRoles = useMemo(() => {
    return (roles as RoleDefinition[]).filter((r) => {
      const isDel = Boolean(r.isDeleted || r.deleted);
      return viewMode === 'TRASH' ? isDel : !isDel;
    });
  }, [roles, viewMode]);

  const clientOptions = useMemo(() => {
    const map = new Map<string, { code: string; name: string; count: number }>();
    availableTenants.forEach((t) => {
      if (t.tenantCode && t.tenantCode !== 'SYSTEM') {
        map.set(t.tenantCode, {
          code: t.tenantCode,
          name: t.tenantName || t.companyName || t.tenantCode,
          count: 0,
        });
      }
    });

    let systemCount = 0;
    modeFilteredRoles.forEach((r) => {
      const isSuper = r.code === 'ROLE_SUPER_ADMIN';
      const isBuiltIn = r.isSystemRole ?? (isSuper || r.code === 'ROLE_ADMIN' || r.code === 'ROLE_USER');
      if (isBuiltIn || !r.tenantCode) {
        systemCount += 1;
      } else {
        const key = r.tenantCode;
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(key, { code: key, name: r.tenantName || key, count: 1 });
        }
      }
    });

    const list: Array<{ code: string; name: string; count: number }> = [];
    if (systemCount > 0) list.push({ code: 'SYSTEM', name: 'System Built-in', count: systemCount });
    const clientList = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    return [...list, ...clientList];
  }, [modeFilteredRoles, availableTenants]);

  const filteredRoles = useMemo(() => {
    if (selectedClient === 'ALL') return modeFilteredRoles;
    return modeFilteredRoles.filter((r) => {
      const isSuper = r.code === 'ROLE_SUPER_ADMIN';
      const isBuiltIn = r.isSystemRole ?? (isSuper || r.code === 'ROLE_ADMIN' || r.code === 'ROLE_USER');
      if (selectedClient === 'SYSTEM') return isBuiltIn || !r.tenantCode;
      return r.tenantCode === selectedClient || r.tenantId === selectedClient;
    });
  }, [modeFilteredRoles, selectedClient]);

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    try {
      await roleService.deleteRole(roleToDelete.code);
      toast.success(`Role '${roleToDelete.name}' moved to trash.`);
      setRoleToDelete(null);
      onRefresh?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete role.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmRestore = async () => {
    if (!roleToRestore) return;
    setIsRestoring(true);
    try {
      await roleService.restoreRole(roleToRestore.code);
      toast.success(`Role '${roleToRestore.name}' restored successfully.`);
      setRoleToRestore(null);
      onRefresh?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to restore role.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleConfirmPurge = async () => {
    if (!roleToPurge) return;
    setIsPurging(true);
    try {
      await roleService.purgeRole(roleToPurge.code);
      toast.success(`Role '${roleToPurge.name}' permanently purged.`);
      setRoleToPurge(null);
      onRefresh?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to purge role.');
    } finally {
      setIsPurging(false);
    }
  };

  const columns = useRoleColumns({
    isSuperAdmin,
    totalClearancesCount,
    onViewPermissions,
    onDeleteRole: setRoleToDelete,
    onRestore: setRoleToRestore,
    onPurge: setRoleToPurge,
  });

  return (
    <>
      <DataTable
        title="Role Directory"
        icon={<Shield size={16} className="text-brand-accent" />}
        headerExtra={
          <span className="text-xs text-text-muted font-medium">
            Total: <span className="font-semibold text-text-primary">{filteredRoles.length}</span>{' '}
            {filteredRoles.length === 1 ? 'Role' : 'Roles'}
          </span>
        }
        headerActions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-0.5 bg-surface-muted rounded border border-border-subtle">
              <button
                type="button"
                onClick={() => setViewMode('ACTIVE')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  viewMode === 'ACTIVE' ? 'bg-surface-card text-brand-accent shadow-2xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('TRASH')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  viewMode === 'TRASH' ? 'bg-surface-card text-status-danger shadow-2xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Trash ({trashCount})
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-text-muted" />
              <select
                id="role-client-filter"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="max-w-[210px] truncate px-2 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
              >
                <option value="ALL">All Clients ({modeFilteredRoles.length})</option>
                {clientOptions.map((c) => (
                  <option key={c.code} value={c.code}>{c.name} ({c.count})</option>
                ))}
              </select>
            </div>

            {onRefresh && (
              <Button size="xs" variant="secondary" onClick={onRefresh} disabled={isLoading} icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}>
                Refresh
              </Button>
            )}
            <Button size="xs" variant="secondary" onClick={onViewMatrix} icon={<SlidersHorizontal size={13} className="text-brand-accent" />}>
              Matrix
            </Button>
            {onCreateRole && viewMode === 'ACTIVE' && (
              <Button size="xs" variant="primary" onClick={onCreateRole} icon={<Plus size={13} />}>
                Create
              </Button>
            )}
          </div>
        }
        columns={columns}
        data={filteredRoles}
        isLoading={isLoading}
        searchPlaceholder="Search roles..."
        initialPageSize={10}
      />

      <DeleteRoleModal
        role={roleToDelete}
        isOpen={Boolean(roleToDelete)}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setRoleToDelete(null)}
      />

      <RoleRestoreModal
        role={roleToRestore}
        isOpen={Boolean(roleToRestore)}
        isRestoring={isRestoring}
        onConfirm={handleConfirmRestore}
        onClose={() => setRoleToRestore(null)}
      />

      <RolePurgeModal
        role={roleToPurge}
        isOpen={Boolean(roleToPurge)}
        isPurging={isPurging}
        onConfirm={handleConfirmPurge}
        onClose={() => setRoleToPurge(null)}
      />
    </>
  );
};

export default RoleTable;
