/**
 * =============================================================================
 * [EN] Master Apparel Export Seasons Data Grid (MasterSeasonsTable.tsx)
 * [BN] মাস্টার পোশাক রপ্তানি সিজন ডেটা গ্রিড (MasterSeasonsTable.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21
 */

import React, { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Calendar, RefreshCw } from 'lucide-react';
import type { MasterLibraryEntry } from '@/types';
import { DataTable, Button, Badge } from '@/components/ui';

export interface MasterSeasonsTableProps {
  readonly seasons: readonly MasterLibraryEntry[];
  readonly isLoading: boolean;
  readonly onRefresh?: () => void;
}

interface SeasonAttributes {
  year?: number;
  quarter?: string;
  status?: string;
}

const parseAttributes = (raw?: string | Record<string, unknown>): SeasonAttributes => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw as SeasonAttributes;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const MasterSeasonsTable: React.FC<MasterSeasonsTableProps> = ({ seasons, isLoading, onRefresh }) => {
  const columns = useMemo<ColumnDef<MasterLibraryEntry>[]>(
    () => [
      {
        accessorKey: 'entryCode',
        header: 'Season Code',
        cell: ({ row }) => (
          <span className="font-semibold text-text-primary font-mono text-xs">
            {row.original.entryCode}
          </span>
        ),
      },
      {
        accessorKey: 'entryName',
        header: 'Season Program Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-brand-accent shrink-0" />
            <div>
              <span className="font-medium text-text-primary block text-xs">{row.original.entryName}</span>
              {row.original.description && (
                <span className="text-[11px] text-text-muted truncate max-w-xs block">{row.original.description}</span>
              )}
            </div>
          </div>
        ),
      },
      {
        id: 'year',
        header: 'Calendar Year',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          return (
            <span className="font-mono text-[11px] font-semibold text-text-secondary">
              {attrs.year || '2026'}
            </span>
          );
        },
      },
      {
        id: 'quarter',
        header: 'Order Quarter / Cycle',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          return (
            <Badge variant="neutral">{attrs.quarter || 'ANNUAL'}</Badge>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? 'success' : 'neutral'} dot>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      title="Export Seasons Directory"
      icon={<Calendar size={16} className="text-brand-accent" />}
      headerExtra={
        <span className="text-xs text-text-muted font-medium">
          Total: <span className="font-semibold text-text-primary">{seasons.length}</span> Seasons
        </span>
      }
      columns={columns}
      data={seasons as MasterLibraryEntry[]}
      isLoading={isLoading}
      searchPlaceholder="Search export season name, code, year..."
      headerActions={
        onRefresh ? (
          <Button
            size="xs"
            variant="secondary"
            onClick={onRefresh}
            icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
        ) : undefined
      }
    />
  );
};

export default MasterSeasonsTable;
