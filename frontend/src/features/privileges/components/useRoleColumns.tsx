/**
 * =============================================================================
 * [EN] TanStack Table Columns Definition for Role Directory (useRoleColumns.tsx)
 * [BN] রোল ডিরেক্টরির ট্যানস্ট্যাক টেবিল কলাম ডেফিনিশন হুক
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (High Perf), Rule 15 (Bilingual), Rule 17 (Enterprise UI)
 * [BN] রোল ডিরেক্টরি টেবিলের জন্য কলাম, ব্যাজ ও অ্যাকশন বাটন মেপিং।
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Shield, KeyRound, Lock, Trash2, CheckCircle2, Building2, RotateCcw, AlertOctagon } from 'lucide-react';
import type { RoleDefinition } from '@/features/users';
import { usePermission } from '../hooks/usePermission';

export interface UseRoleColumnsProps {
  readonly isSuperAdmin: boolean;
  readonly totalClearancesCount: number;
  readonly onViewPermissions: (role: RoleDefinition) => void;
  readonly onDeleteRole?: (role: RoleDefinition) => void;
  readonly onRestore?: (role: RoleDefinition) => void;
  readonly onPurge?: (role: RoleDefinition) => void;
}

export const useRoleColumns = ({
  isSuperAdmin,
  totalClearancesCount,
  onViewPermissions,
  onDeleteRole,
  onRestore,
  onPurge,
}: UseRoleColumnsProps): ColumnDef<RoleDefinition>[] => {
  const { hasPermission } = usePermission();
  const canRestore = isSuperAdmin || hasPermission('ROLE:RESTORE');
  const canPurge = isSuperAdmin || hasPermission('ROLE:PURGE');

  return useMemo<ColumnDef<RoleDefinition>[]>(
    () => [
      {
        id: 'roleDetails',
        header: 'Role Title & Code',
        accessorFn: (row) => `${row.name} ${row.code}`,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 py-0.5">
            <div className="w-8 h-8 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <div className="font-semibold text-text-primary text-xs leading-snug">
                {row.original.name}
              </div>
              <div className="font-mono text-[10px] text-text-muted mt-0.5 tracking-wide">
                {row.original.code}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Operational Scope',
        cell: ({ row }) => (
          <p className="text-xs text-text-secondary leading-snug line-clamp-2 max-w-md">
            {row.original.description || 'No operational description provided.'}
          </p>
        ),
      },
      {
        id: 'classification',
        header: 'Classification',
        accessorKey: 'code',
        cell: ({ row }) => {
          const isDel = Boolean(row.original.isDeleted || (row.original as unknown as { deleted?: boolean }).deleted);
          if (isDel) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold tracking-wide border bg-status-danger-bg text-status-danger border-status-danger-border">
                <AlertOctagon size={10} />
                <span>Trash</span>
              </span>
            );
          }

          const isSuper = row.original.code === 'ROLE_SUPER_ADMIN';
          const isBuiltIn = row.original.isSystemRole ?? (isSuper || row.original.code === 'ROLE_ADMIN' || row.original.code === 'ROLE_USER');

          if (isSuper) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold tracking-wide border bg-status-danger-bg text-status-danger border-status-danger-border">
                <Lock size={10} />
                <span>System Super Admin</span>
              </span>
            );
          }

          if (isBuiltIn) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold tracking-wide border bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                <Lock size={10} />
                <span>System Built-in</span>
              </span>
            );
          }

          // [EN] For platform super admin, show tenant badge with client name only
          // [BN] প্ল্যাটফর্ম সুপার অ্যাডমিনের জন্য কেবল ক্লায়েন্টের নাম প্রদর্শন
          if (isSuperAdmin && (row.original.tenantCode || row.original.tenantName)) {
            const clientName = row.original.tenantName || row.original.tenantCode || 'Custom';
            return (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold tracking-wide border bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                title={row.original.tenantCode ? `Factory Code: ${row.original.tenantCode}` : undefined}
              >
                <Building2 size={10} />
                <span>{clientName}</span>
              </span>
            );
          }

          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold tracking-wide border bg-status-success-bg text-status-success border-status-success-border">
              <CheckCircle2 size={10} />
              <span>Custom Role</span>
            </span>
          );
        },
      },
      {
        id: 'permissionsCount',
        header: 'Granted Permissions',
        accessorFn: (row) =>
          row.code === 'ROLE_SUPER_ADMIN' ? totalClearancesCount : (row.permissions?.length || 0),
        cell: ({ row }) => {
          const isSuper = row.original.code === 'ROLE_SUPER_ADMIN';
          const count = isSuper ? totalClearancesCount : (row.original.permissions?.length || 0);
          return (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-text-primary text-xs">{count}</span>
              <span className="text-[11px] text-text-muted">of {totalClearancesCount} Clearances</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => {
          const isDel = Boolean(row.original.isDeleted || (row.original as unknown as { deleted?: boolean }).deleted);

          if (isDel) {
            return (
              <div className="flex items-center gap-1">
                {canRestore && onRestore && (
                  <button
                    type="button"
                    onClick={() => onRestore(row.original)}
                    title="Restore Role"
                    className="p-1.5 text-brand-accent hover:bg-brand-accent/10 rounded-[3px] transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                {canPurge && onPurge && (
                  <button
                    type="button"
                    onClick={() => onPurge(row.original)}
                    title="Permanently Purge Role"
                    className="p-1.5 text-status-danger hover:bg-status-danger-bg rounded-[3px] transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          }

          const isBuiltIn = row.original.isSystemRole ?? (
            row.original.code === 'ROLE_SUPER_ADMIN' ||
            row.original.code === 'ROLE_ADMIN' ||
            row.original.code === 'ROLE_USER'
          );

          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onViewPermissions(row.original)}
                className="px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-brand-accent bg-surface-card border border-border-subtle rounded-[4px] hover:bg-surface-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="View Granted Permissions"
              >
                <KeyRound size={12} />
                <span>Permissions</span>
              </button>
              {!isBuiltIn && onDeleteRole && (
                <button
                  type="button"
                  onClick={() => onDeleteRole(row.original)}
                  className="p-1 text-xs font-medium text-status-danger hover:bg-status-danger-bg border border-transparent hover:border-status-danger-border rounded-[4px] transition-colors cursor-pointer"
                  title="Delete Custom Role"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [onViewPermissions, onDeleteRole, onRestore, onPurge, totalClearancesCount, isSuperAdmin]
  );
};

export default useRoleColumns;
