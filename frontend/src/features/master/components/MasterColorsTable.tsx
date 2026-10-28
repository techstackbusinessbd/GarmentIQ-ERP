/**
 * =============================================================================
 * [EN] Master Apparel Colors & Pantone Palette Grid (MasterColorsTable.tsx)
 * [BN] মাস্টার পোশাক কালার ও প্যান্টোন প্যালেট গ্রিড (MasterColorsTable.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21
 */

import React, { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Palette, RefreshCw } from 'lucide-react';
import type { MasterLibraryEntry } from '@/types';
import { DataTable, Button, Badge } from '@/components/ui';

export interface MasterColorsTableProps {
  readonly colors: readonly MasterLibraryEntry[];
  readonly isLoading: boolean;
  readonly onRefresh?: () => void;
}

interface ColorAttributes {
  hexCode?: string;
  pantone?: string;
}

const parseAttributes = (raw?: string | Record<string, unknown>): ColorAttributes => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw as ColorAttributes;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const MasterColorsTable: React.FC<MasterColorsTableProps> = ({ colors, isLoading, onRefresh }) => {
  const columns = useMemo<ColumnDef<MasterLibraryEntry>[]>(
    () => [
      {
        accessorKey: 'entryCode',
        header: 'Color Code',
        cell: ({ row }) => (
          <span className="font-semibold text-text-primary font-mono text-xs">
            {row.original.entryCode}
          </span>
        ),
      },
      {
        accessorKey: 'entryName',
        header: 'Color Shade Name',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          const hex = attrs.hexCode || '#64748b';
          return (
            <div className="flex items-center gap-2.5">
              <span
                className="w-4 h-4 rounded-full border border-border-subtle shrink-0 shadow-2xs"
                style={{ backgroundColor: hex }}
              />
              <div>
                <span className="font-medium text-text-primary block text-xs">{row.original.entryName}</span>
                {row.original.description && (
                  <span className="text-[11px] text-text-muted truncate max-w-xs block">{row.original.description}</span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: 'hexCode',
        header: 'HEX Value',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          return (
            <span className="font-mono text-[11px] font-semibold text-text-secondary">
              {attrs.hexCode || '—'}
            </span>
          );
        },
      },
      {
        id: 'pantone',
        header: 'Pantone TCX Standard',
        cell: ({ row }) => {
          const attrs = parseAttributes(row.original.attributes);
          return (
            <Badge variant="neutral">{attrs.pantone || 'Custom Shade'}</Badge>
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
      title="Colors & Pantone Palette"
      icon={<Palette size={16} className="text-brand-accent" />}
      headerExtra={
        <span className="text-xs text-text-muted font-medium">
          Total: <span className="font-semibold text-text-primary">{colors.length}</span> Shades
        </span>
      }
      columns={columns}
      data={colors as MasterLibraryEntry[]}
      isLoading={isLoading}
      searchPlaceholder="Search color shade, hex code, pantone..."
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

export default MasterColorsTable;
