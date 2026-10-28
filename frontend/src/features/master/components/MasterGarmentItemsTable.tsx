/**
 * =============================================================================
 * [EN] Master Garment Items & Categories Data Grid (MasterGarmentItemsTable.tsx)
 * [BN] মাস্টার পোশাক আইটেম ও ক্যাটাগরি গ্রিড টেবিল (MasterGarmentItemsTable.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21
 */

import React, { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Shirt, RefreshCw } from 'lucide-react';
import type { MasterLibraryEntry } from '@/types';
import { DataTable, Button, Badge } from '@/components/ui';

export interface MasterGarmentItemsTableProps {
  readonly items: readonly MasterLibraryEntry[];
  readonly isLoading: boolean;
  readonly onRefresh?: () => void;
}

interface ItemAttributes {
  gender?: string;
  fabricType?: string;
  hscode?: string;
}

const parseAttributes = (raw?: string | Record<string, unknown>): ItemAttributes => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw as ItemAttributes;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const MasterGarmentItemsTable: React.FC<MasterGarmentItemsTableProps> = ({ items, isLoading, onRefresh }) => {
  const columns = useMemo<ColumnDef<MasterLibraryEntry>[]>(
    () => [
      {
        accessorKey: 'entryCode',
        header: 'Item Code',
        cell: ({ row }) => (
          <span className="font-semibold text-text-primary font-mono text-xs">
            {row.original.entryCode}
          </span>
        ),
      },
      {
        accessorKey: 'entryName',
        header: 'Garment Item Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Shirt size={14} className="text-brand-accent shrink-0" />
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
        id: 'gender',
        header: 'Target Segment',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          return (
            <Badge variant="neutral">{attrs.gender || 'UNISEX'}</Badge>
          );
        },
      },
      {
        id: 'fabricType',
        header: 'Fabric Category',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          const isDenim = attrs.fabricType === 'DENIM';
          return (
            <Badge variant={isDenim ? 'info' : 'success'}>
              {attrs.fabricType || 'WOVEN'}
            </Badge>
          );
        },
      },
      {
        id: 'hscode',
        header: 'HS Code',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          return (
            <span className="font-mono text-[11px] text-text-muted">
              {attrs.hscode || '—'}
            </span>
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
      title="Garment Items Directory"
      icon={<Shirt size={16} className="text-brand-accent" />}
      headerExtra={
        <span className="text-xs text-text-muted font-medium">
          Total: <span className="font-semibold text-text-primary">{items.length}</span> Items
        </span>
      }
      columns={columns}
      data={items as MasterLibraryEntry[]}
      isLoading={isLoading}
      searchPlaceholder="Search garment item name, code, fabric..."
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

export default MasterGarmentItemsTable;
