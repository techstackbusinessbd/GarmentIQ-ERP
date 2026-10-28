/**
 * =============================================================================
 * [EN] TanStack Table Columns Hook for User Directory (useUserColumns)
 * [BN] ব্যবহারকারী ডিরেক্টরির ট্যানস্ট্যাক টেবিল কলাম হুক (useUserColumns)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15 (Bilingual)
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Shield, UserCheck, UserX, Building2, Lock } from 'lucide-react';
import type { User, UserStatus } from '@/types';
import { ROLE_MAP } from '../constants/roleConstants';
import { UserTableActions } from './UserTableActions';

/** [EN] Helper to resolve status pill styles / [BN] স্ট্যাটাস পিল স্টাইল */
const getStatusClasses = (status: UserStatus): string => {
  if (status === 'ACTIVE') return 'bg-status-success-bg text-status-success border-status-success-border';
  if (status === 'LOCKED' || status === 'SUSPENDED') return 'bg-status-danger-bg text-status-danger border-status-danger-border';
  if (status === 'INVITED') return 'bg-status-info-bg text-status-info border-status-info-border';
  return 'bg-surface-muted text-text-muted border-border-subtle';
};

export interface UseUserColumnsParams {
  readonly onToggleLock: (user: User) => void;
  readonly onDeactivate: (user: User) => void;
  readonly onRestore?: (user: User) => void;
  readonly onPurge?: (user: User) => void;
}

/**
 * [EN] Hook generating columns for the enterprise User Table
 * [BN] এন্টারপ্রাইজ ইউজার টেবিলের কলাম প্রস্তুতকারী হুক
 */
export const useUserColumns = ({
  onToggleLock,
  onDeactivate,
  onRestore,
  onPurge,
}: UseUserColumnsParams): ColumnDef<User>[] => {
  return useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'userAndEmail',
        accessorFn: (row) => `${row.fullName} ${row.email}`,
        header: 'User & Email',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-accent-light text-brand-accent font-bold text-xs flex items-center justify-center shrink-0">
                {u.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-text-primary block truncate">{u.fullName}</span>
                <span className="text-[11px] text-text-muted block truncate">{u.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'tenant',
        accessorFn: (row) => `${row.tenantCode || ''} ${row.tenantName || ''}`,
        header: 'Tenant / Factory',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-1.5 min-w-0" title={u.tenantCode ? `${u.tenantName || ''} (${u.tenantCode})` : u.tenantName}>
              <Building2 size={12} className="shrink-0 text-brand-accent" />
              <span className="font-medium text-xs text-text-primary block truncate max-w-[140px]">
                {u.tenantName || u.tenantCode || 'Enterprise Platform'}
              </span>
            </div>
          );
        },
      },
      {
        id: 'username',
        accessorFn: (row) => `${row.username} ${row.employeeCardNo || ''}`,
        header: 'Username',
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span className="font-mono text-[11px] text-text-primary block">@{row.original.username}</span>
            {row.original.employeeCardNo && (
              <span className="font-mono text-[10px] text-brand-accent block" title="Employee Card ID">
                ID: {row.original.employeeCardNo}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        cell: ({ row }) => <span className="text-text-muted">{row.original.designation || '—'}</span>,
      },
      {
        id: 'roles',
        header: 'Assigned Roles',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {row.original.roles?.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold bg-surface-muted text-text-primary border border-border-subtle"
              >
                <Shield size={10} className="text-brand-accent" />
                <span>{ROLE_MAP[r]?.name || r}</span>
              </span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const u = row.original;
          if (u.isDeleted || u.deleted) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border bg-status-danger-bg text-status-danger border-status-danger-border">
                <UserX size={11} />
                <span>TRASH</span>
              </span>
            );
          }
          const status = u.status;
          return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${getStatusClasses(status)}`}>
              {status === 'ACTIVE' ? <UserCheck size={11} /> : status === 'LOCKED' ? <Lock size={11} /> : <UserX size={11} />}
              <span>{status}</span>
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <span className="block text-right">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <UserTableActions
            user={row.original}
            onToggleLock={onToggleLock}
            onDeactivate={onDeactivate}
            onRestore={onRestore}
            onPurge={onPurge}
          />
        ),
      },
    ],
    [onToggleLock, onDeactivate, onRestore, onPurge]
  );
};

export default useUserColumns;
