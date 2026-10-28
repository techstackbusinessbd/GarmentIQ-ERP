/**
 * =============================================================================
 * [EN] Multi-Tenant Client Factory Table Columns Hook (useClientColumns)
 * [BN] ক্লায়েন্ট ফ্যাক্টরি টেবিল কলাম ডেফিনিশন হুক (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 28
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Building2,
  Edit2,
  Trash2,
  ShieldCheck,
  ExternalLink,
  Award,
  Factory,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  RotateCcw,
} from 'lucide-react';
import type { Tenant } from '@/types';
import { resolveClientPortalUrl } from '@/utils';
import { usePermission } from '@/features/privileges';

export interface UseClientColumnsProps {
  readonly onEditClient: (client: Tenant) => void;
  readonly onDeactivate: (client: Tenant) => void;
  readonly onRestore: (client: Tenant) => void;
  readonly onPurge: (client: Tenant) => void;
}

export const useClientColumns = ({
  onEditClient,
  onDeactivate,
  onRestore,
  onPurge,
}: UseClientColumnsProps): ColumnDef<Tenant>[] => {
  const { hasPermission, isSuperAdmin } = usePermission();
  const canRestore = isSuperAdmin || hasPermission('TENANT:RESTORE');
  const canPurge = isSuperAdmin || hasPermission('TENANT:PURGE');

  return useMemo<ColumnDef<Tenant>[]>(
    () => [
      {
        accessorKey: 'tenantName',
        header: 'Factory / Organization',
        cell: ({ row }) => {
          const t = row.original;
          const portalUrl = resolveClientPortalUrl(t);
          return (
            <div className="flex items-center gap-2.5">
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${t.tenantName || 'Client'} in new tab`}
                className="w-8 h-8 rounded-[4px] bg-brand-accent-light text-brand-accent hover:bg-brand-accent hover:text-white flex items-center justify-center shrink-0 font-bold text-xs transition-colors cursor-pointer"
              >
                <Building2 size={16} />
              </a>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${t.tenantName || 'Client'} in new tab`}
                    className="font-semibold text-xs text-text-primary hover:text-brand-accent transition-colors truncate inline-flex items-center gap-1 group/link cursor-pointer"
                  >
                    <span>{t.tenantName || t.companyName}</span>
                    <ExternalLink size={10} className="text-text-muted opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                  </a>
                  {t.companyType && (
                    <span className="text-[9px] font-mono font-bold px-1 py-0.2 bg-surface-muted border border-border-subtle rounded-[2px] text-text-muted shrink-0">
                      {t.companyType === 'GROUP_OF_COMPANIES' ? 'GROUP' : 'SINGLE'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-brand-accent font-semibold">{t.tenantCode}</span>
                  {t.subdomain && (
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${portalUrl} in new tab`}
                      className="text-[10px] font-mono text-text-muted hover:text-brand-accent hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{t.subdomain}.garmentiq.com</span>
                      <ExternalLink size={9} className="shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'subscriptionTier',
        header: 'Subscription Tier',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-bold font-mono tracking-wider border bg-brand-accent-light text-brand-accent border-brand-accent/20">
            <Award size={11} />
            <span>{row.original.subscriptionTier || 'ENTERPRISE'}</span>
          </span>
        ),
      },
      {
        id: 'factoriesCount',
        header: 'Factories & Units',
        cell: ({ row }) => {
          const t = row.original;
          if (t.tenantCode === 'SYSTEM' || t.subscriptionTier === 'PLATFORM_ROOT') {
            return (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono font-medium text-text-muted bg-surface-muted/60 border border-border-subtle">
                N/A
              </span>
            );
          }
          const count = t.factoryCount || 0;
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-[11px] font-medium border shadow-2xs ${
                count > 0 ? 'bg-surface-card border-border-subtle text-text-primary' : 'bg-surface-muted/60 border-border-subtle text-text-muted'
              }`}
            >
              <Factory size={12} className={count > 0 ? 'text-brand-accent shrink-0' : 'text-text-muted shrink-0'} />
              <span>{count === 0 ? '0 Factories' : `${count} ${count === 1 ? 'Factory Unit' : 'Factory Units'}`}</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'contactEmail',
        header: 'Contact Details',
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Mail size={11} className="shrink-0" />
                <span className="truncate text-text-primary text-[11px]">{t.contactEmail || '—'}</span>
              </div>
              {t.contactPhone && (
                <div className="flex items-center gap-1.5 text-text-muted font-mono text-[10px]">
                  <Phone size={11} className="shrink-0" />
                  <span className="truncate">{t.contactPhone}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'address',
        header: 'Location / Address',
        cell: ({ row }) => {
          const t = row.original;
          const isRoot = t.tenantCode === 'SYSTEM' || t.subscriptionTier === 'PLATFORM_ROOT';
          const loc = isRoot ? 'GarmentIQ Cloud HQ' : t.address || t.factoryZone;
          if (!loc) return <span className="text-[11px] text-text-muted">—</span>;
          return (
            <div className="flex items-center gap-1.5 text-xs max-w-xs text-text-secondary">
              <MapPin size={12} className="text-text-muted shrink-0" />
              <span className="text-[11px] text-text-primary truncate" title={loc}>{loc}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => {
          const t = row.original;
          const isDeleted = Boolean(t.isDeleted || t.deleted);
          if (isDeleted) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border bg-status-danger-bg text-status-danger border-status-danger-border">
                <AlertOctagon size={11} />
                <span>TRASH</span>
              </span>
            );
          }
          const active = t.active;
          return (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${
                active ? 'bg-status-success-bg text-status-success border-status-success-border' : 'bg-status-danger-bg text-status-danger border-status-danger-border'
              }`}
            >
              {active ? <CheckCircle2 size={11} /> : <AlertOctagon size={11} />}
              <span>{active ? 'ACTIVE' : 'SUSPENDED'}</span>
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <span className="block text-right">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => {
          const t = row.original;
          const portalUrl = resolveClientPortalUrl(t);
          const isDeleted = Boolean(t.isDeleted || t.deleted);

          if (isDeleted) {
            return (
              <div className="flex items-center justify-end gap-1">
                {canRestore && onRestore && (
                  <button
                    type="button"
                    onClick={() => onRestore(t)}
                    title="Restore Client"
                    className="p-1.5 text-brand-accent hover:bg-brand-accent/10 rounded-[3px] transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                {canPurge && onPurge && (
                  <button
                    type="button"
                    onClick={() => onPurge(t)}
                    title="Permanently Purge Client"
                    className="p-1.5 text-status-danger hover:bg-status-danger-bg rounded-[3px] transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          }

          return (
            <div className="flex items-center justify-end gap-1">
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${t.tenantName || 'Client'} in new tab (${portalUrl})`}
                className="p-1.5 text-text-muted hover:text-brand-accent hover:bg-surface-muted rounded-[3px] transition-colors cursor-pointer inline-flex items-center justify-center"
              >
                <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => onEditClient(t)}
                title="Edit Client"
                className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] transition-colors cursor-pointer"
              >
                <Edit2 size={13} />
              </button>
              {t.tenantCode !== 'SYSTEM' ? (
                <button
                  type="button"
                  onClick={() => onDeactivate(t)}
                  title="Deactivate Client"
                  className="p-1.5 text-text-muted hover:text-status-danger hover:bg-status-danger-bg rounded-[3px] transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              ) : (
                <span title="System Root (Protected)" className="p-1.5 text-brand-accent">
                  <ShieldCheck size={14} />
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [onEditClient, onDeactivate, onRestore, onPurge]
  );
};
