/**
 * =============================================================================
 * [EN] Master Quality Defect Codes Data Grid Component (MasterDefectCodesTable)
 * [BN] মাস্টার কোয়ালিটি ডিফেক্ট কোড ডেটা টেবিল কম্পোনেন্ট (MasterDefectCodesTable)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 21
 * [BN] আরএমজি কোয়ালিটি কন্ট্রোল ডিফেক্ট কোড এবং সিভিয়ারিটি লেভেল ট্যানস্ট্যাক টেবিল।
 */

import React, { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { MasterDefectCode } from '@/types';
import { DataTable, Badge, Button } from '@/components/ui';

/**
 * [EN] Properties contract for MasterDefectCodesTable.
 * [BN] MasterDefectCodesTable কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface MasterDefectCodesTableProps {
  readonly defectCodes: readonly MasterDefectCode[];
  readonly isLoading: boolean;
  readonly onRefresh?: () => void;
}

/**
 * [EN] High-density inspection defect codes table powered by TanStack Table v8.
 * [BN] ট্যানস্ট্যাক টেবিল ভি৮ চালিত হাই-ডেনসিটি কোয়ালিটি ডিফেক্ট কোড টেবিল কম্পোনেন্ট।
 */
export const MasterDefectCodesTable: React.FC<MasterDefectCodesTableProps> = ({
  defectCodes,
  isLoading,
  onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredDefects = useMemo(() => {
    return defectCodes.filter((d) => {
      const matchesCategory = selectedCategory === 'ALL' || d.defectCategory === selectedCategory;
      const matchesSeverity = selectedSeverity === 'ALL' || d.severityLevel === selectedSeverity;
      return matchesCategory && matchesSeverity;
    });
  }, [defectCodes, selectedCategory, selectedSeverity]);

  const columns = useMemo<ColumnDef<MasterDefectCode>[]>(
    () => [
      {
        accessorKey: 'defectCode',
        header: 'Defect Code',
        cell: ({ row }) => (
          <span className="font-semibold text-text-primary font-mono">
            {row.original.defectCode}
          </span>
        ),
      },
      {
        accessorKey: 'defectName',
        header: 'Defect Description',
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.defectName}</span>
        ),
      },
      {
        accessorKey: 'defectCategory',
        header: 'Process Category',
        cell: ({ row }) => (
          <Badge variant="neutral">{row.original.defectCategory}</Badge>
        ),
      },
      {
        accessorKey: 'severityLevel',
        header: 'Severity',
        cell: ({ row }) => {
          const sev = row.original.severityLevel?.toUpperCase();
          const variant = sev === 'CRITICAL' ? 'danger' : sev === 'MAJOR' ? 'warning' : 'info';
          return (
            <Badge variant={variant} dot>
              {row.original.severityLevel}
            </Badge>
          );
        },
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
      title="Quality Defects Directory"
      icon={<AlertTriangle size={16} className="text-brand-accent" />}
      headerExtra={
        <span className="text-xs text-text-muted font-medium">
          Total: <span className="font-semibold text-text-primary">{defectCodes.length}</span> Defect Codes
        </span>
      }
      columns={columns}
      data={filteredDefects}
      isLoading={isLoading}
      searchPlaceholder="Search defects (e.g. Broken Stitch)..."
      initialPageSize={10}
      headerActions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted shrink-0">Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[3px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="SEWING">Sewing</option>
            <option value="CUTTING">Cutting</option>
            <option value="WASHING">Washing</option>
            <option value="FABRIC">Fabric</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[3px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="MAJOR">Major</option>
            <option value="MINOR">Minor</option>
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

export default MasterDefectCodesTable;
