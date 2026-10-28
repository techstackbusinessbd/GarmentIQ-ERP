/**
 * =============================================================================
 * [EN] Master Measurement Units Data Grid Component (MasterUnitsTable)
 * [BN] মাস্টার পরিমাপের একক ডেটা গ্রিড টেবিল কম্পোনেন্ট (MasterUnitsTable)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21
 * [BN] টেক্সটাইল ও পোশাক পরিমাপের একক (UOM) প্রদর্শনের জন্য ট্যানস্ট্যাক টেবিল গ্রিড।
 */

import React, { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Ruler, CheckCircle2, RefreshCw } from 'lucide-react';
import type { MasterUnit } from '@/types';
import { DataTable, Badge, Button } from '@/components/ui';

/**
 * [EN] Properties contract for MasterUnitsTable.
 * [BN] MasterUnitsTable কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface MasterUnitsTableProps {
  readonly units: readonly MasterUnit[];
  readonly isLoading: boolean;
  readonly onRefresh?: () => void;
}

/**
 * [EN] High-density measurement units table powered by TanStack Table v8.
 * [BN] ট্যানস্ট্যাক টেবিল ভি৮ চালিত হাই-ডেনসিটি পরিমাপের একক টেবিল কম্পোনেন্ট।
 */
export const MasterUnitsTable: React.FC<MasterUnitsTableProps> = ({ units, isLoading, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredUnits = useMemo(() => {
    if (selectedCategory === 'ALL') return [...units];
    return units.filter((u) => u.unitCategory === selectedCategory);
  }, [units, selectedCategory]);

  const columns = useMemo<ColumnDef<MasterUnit>[]>(
    () => [
      {
        accessorKey: 'unitCode',
        header: 'Unit Code',
        cell: ({ row }) => (
          <span className="font-semibold text-text-primary font-mono">
            {row.original.unitCode}
          </span>
        ),
      },
      {
        accessorKey: 'unitName',
        header: 'Unit Title',
        cell: ({ row }) => <span className="text-text-secondary">{row.original.unitName}</span>,
      },
      {
        accessorKey: 'unitCategory',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant="neutral">{row.original.unitCategory}</Badge>
        ),
      },
      {
        accessorKey: 'isDefault',
        header: 'Default Fallback',
        cell: ({ row }) =>
          row.original.isDefault ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-accent font-medium">
              <CheckCircle2 size={12} /> Yes
            </span>
          ) : (
            <span className="text-text-muted text-[11px]">No</span>
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
      title="Measurement Units Directory"
      icon={<Ruler size={16} className="text-brand-accent" />}
      headerExtra={
        <span className="text-xs text-text-muted font-medium">
          Total: <span className="font-semibold text-text-primary">{units.length}</span> Units
        </span>
      }
      columns={columns}
      data={filteredUnits}
      isLoading={isLoading}
      searchPlaceholder="Search units (e.g. YDS, PCS)..."
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
            <option value="GENERAL">General</option>
            <option value="FABRIC">Fabric</option>
            <option value="TRIM">Trims & Accessories</option>
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

export default MasterUnitsTable;
