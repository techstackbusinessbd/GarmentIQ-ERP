/**
 * =============================================================================
 * [EN] Master Apparel Size Matrix Data Grid Component (MasterSizesTable)
 * [BN] মাস্টার পোশাক সাইজ গ্রিড ডেটা টেবিল কম্পোনেন্ট (MasterSizesTable)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21
 * [BN] আলফা সাইজ ও ডেনিম ডাইমেনশন সাইজ প্রদর্শনের জন্য ট্যানস্ট্যাক টেবিল গ্রিড।
 */

import React, { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Tag, RefreshCw } from 'lucide-react';
import type { MasterSize } from '@/types';
import { DataTable, Badge, Button } from '@/components/ui';

/**
 * [EN] Properties contract for MasterSizesTable.
 * [BN] MasterSizesTable কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface MasterSizesTableProps {
  readonly sizes: readonly MasterSize[];
  readonly isLoading: boolean;
  readonly onRefresh?: () => void;
}

/**
 * [EN] High-density apparel sizes table powered by TanStack Table v8.
 * [BN] ট্যানস্ট্যাক টেবিল ভি৮ চালিত হাই-ডেনসিটি পোশাকের সাইজ টেবিল কম্পোনেন্ট।
 */
export const MasterSizesTable: React.FC<MasterSizesTableProps> = ({ sizes, isLoading, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredSizes = useMemo(() => {
    if (selectedCategory === 'ALL') return [...sizes];
    return sizes.filter((s) => s.sizeCategory === selectedCategory);
  }, [sizes, selectedCategory]);

  const columns = useMemo<ColumnDef<MasterSize>[]>(
    () => [
      {
        accessorKey: 'displayOrder',
        header: 'Display Order',
        cell: ({ row }) => (
          <span className="text-text-muted font-mono">{row.original.displayOrder}</span>
        ),
      },
      {
        accessorKey: 'sizeCode',
        header: 'Size Code',
        cell: ({ row }) => (
          <span className="font-semibold text-text-primary font-mono">{row.original.sizeCode}</span>
        ),
      },
      {
        accessorKey: 'sizeCategory',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant="neutral">{row.original.sizeCategory}</Badge>
        ),
      },
      {
        accessorKey: 'active',
        header: () => <span className="block text-right">Status</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Badge variant={row.original.active ? 'success' : 'neutral'} dot>
              {row.original.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      title="Garment Sizes Directory"
      icon={<Tag size={16} className="text-brand-accent" />}
      headerExtra={
        <span className="text-xs text-text-muted font-medium">
          Total: <span className="font-semibold text-text-primary">{sizes.length}</span> Sizes
        </span>
      }
      columns={columns}
      data={filteredSizes}
      isLoading={isLoading}
      searchPlaceholder="Search sizes (e.g. XL, 32/34)..."
      initialPageSize={10}
      headerActions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[3px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="ALPHA">Alpha (S, M, L, XL)</option>
            <option value="WAIST_INSEAM">Waist / Inseam (Denim)</option>
            <option value="NUMERIC">Numeric</option>
          </select>
          {onRefresh && (
            <Button
              size="xs"
              variant="secondary"
              onClick={onRefresh}
              disabled={isLoading}
              icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
          )}
        </div>
      }
    />
  );
};

export default MasterSizesTable;
