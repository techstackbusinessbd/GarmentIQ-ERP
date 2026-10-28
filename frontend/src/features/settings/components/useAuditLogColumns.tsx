/**
 * =============================================================================
 * [EN] TanStack Table Columns Definition for System Audit Logs (useAuditLogColumns.tsx)
 * [BN] সিস্টেম অডিট লগের ট্যানস্ট্যাক টেবিল কলাম ডেফিনিশন হুক
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (High Perf), Rule 15 (Bilingual), Rule 17 (Enterprise UI)
 * [BN] সিস্টেম অডিট ট্রেইল ডেটা টেবিলের জন্য কলাম ও ব্যাজ মেপিং।
 */

import React, { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Terminal,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { formatLocalDateTime, formatDateTimeTooltip } from '@/utils';
import { ROLE_MAP } from '@/features/users/constants/roleConstants';
import type { AuditLogEntry, AuditSeverity } from '../services/auditLogService';

const SEVERITY_CONFIG: Record<AuditSeverity, { variant: 'info' | 'warning' | 'danger' | 'success'; icon: React.FC<{ size?: number; className?: string }> }> = {
  INFO: { variant: 'info', icon: Info },
  WARNING: { variant: 'warning', icon: AlertTriangle },
  CRITICAL: { variant: 'danger', icon: ShieldAlert },
  SUCCESS: { variant: 'success', icon: ShieldCheck },
};

export const useAuditLogColumns = (): ColumnDef<AuditLogEntry>[] => {
  return useMemo<ColumnDef<AuditLogEntry>[]>(
    () => [
      {
        id: 'timestamp',
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => {
          const val = row.original.timestamp;
          return (
            <div
              className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted whitespace-nowrap cursor-help"
              title={formatDateTimeTooltip(val)}
            >
              <Clock size={11} className="text-text-muted shrink-0" />
              <span>{formatLocalDateTime(val)}</span>
            </div>
          );
        },
      },
      {
        id: 'severity',
        accessorKey: 'severity',
        header: 'Severity',
        cell: ({ row }) => {
          const sev = (row.original.severity || 'INFO') as AuditSeverity;
          const conf = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.INFO;
          const Icon = conf.icon;
          return (
            <Badge variant={conf.variant} icon={<Icon size={10} />} className="font-semibold uppercase text-[10px]">
              {sev}
            </Badge>
          );
        },
      },
      {
        id: 'tenant',
        accessorFn: (row) => `${row.tenantCode || ''} ${row.tenantName || ''}`,
        header: 'Factory / Tenant',
        cell: ({ row }) => {
          const code = row.original.tenantCode;
          const name = row.original.tenantName;
          if (!code && !name) {
            return <span className="text-[10px] text-text-muted font-mono">System</span>;
          }
          return (
            <div className="min-w-0" title={code ? `${name || ''} (${code})` : name}>
              <span className="font-medium text-xs text-text-primary block truncate max-w-[140px]">
                {name || code}
              </span>
            </div>
          );
        },
      },
      {
        id: 'actor',
        accessorFn: (row) => `${row.actorFullName || ''} ${row.actor} ${row.actorRole} ${row.actorEmail || ''}`,
        header: 'Actor / User Info',
        cell: ({ row }) => {
          const entry = row.original;
          const displayName = entry.actorFullName || entry.actor;
          const initial = (entry.actorFullName || entry.actor).charAt(0).toUpperCase();
          const roleName = ROLE_MAP[entry.actorRole]?.name || entry.actorRole.replace('ROLE_', '').replace(/_/g, ' ');

          const tooltipDetails = [
            displayName,
            `@${entry.actor}`,
            entry.actorEmail,
            entry.actorDesignation,
            entry.actorDepartment ? `Dept: ${entry.actorDepartment}` : null,
            `Role: ${roleName} (${entry.actorRole})`,
          ].filter(Boolean).join('\n');

          return (
            <div className="flex items-center gap-2.5 min-w-0" title={tooltipDetails}>
              <div className="w-7 h-7 rounded-full bg-brand-accent-light text-brand-accent font-bold text-xs flex items-center justify-center shrink-0 border border-brand-accent/20">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-text-primary text-xs truncate max-w-[150px]">
                    {displayName}
                  </span>
                  {entry.actorFullName && (
                    <span className="text-[10px] text-text-muted font-mono truncate">
                      @{entry.actor}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-0.5">
                  <span className="font-medium text-brand-accent truncate">
                    {roleName}
                  </span>
                  {entry.actorEmail && (
                    <>
                      <span className="text-text-muted/60">•</span>
                      <span className="truncate max-w-[130px] text-text-muted">
                        {entry.actorEmail}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: 'action',
        accessorFn: (row) => `${row.action} ${row.targetResource || ''}`,
        header: 'Action & Target',
        cell: ({ row }) => {
          const entry = row.original;
          return (
            <div className="min-w-0">
              <span className="font-mono text-[11px] font-bold text-brand-accent block truncate">
                {entry.action}
              </span>
              {entry.targetResource && (
                <span className="text-[10px] text-text-muted block truncate">
                  {entry.targetResource}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'category',
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          return (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-muted text-text-secondary border border-border-subtle inline-block whitespace-nowrap">
              {row.original.category}
            </span>
          );
        },
      },
      {
        id: 'details',
        accessorKey: 'details',
        header: 'Details / Mutation',
        cell: ({ row }) => {
          return (
            <span className="text-xs text-text-primary line-clamp-2 max-w-sm" title={row.original.details}>
              {row.original.details || '—'}
            </span>
          );
        },
      },
      {
        id: 'ipAddress',
        accessorKey: 'ipAddress',
        header: 'Client IP',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1 font-mono text-[11px] text-text-muted whitespace-nowrap">
              <Terminal size={11} className="text-text-muted shrink-0" />
              <span>{row.original.ipAddress || '127.0.0.1'}</span>
            </div>
          );
        },
      },
    ],
    []
  );
};

export default useAuditLogColumns;
