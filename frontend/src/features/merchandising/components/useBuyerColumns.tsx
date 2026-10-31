/**
 * =============================================================================
 * [EN] TanStack Table Column Definitions for Buyers (useBuyerColumns.tsx)
 * [BN] বায়ার টেবিলের জন্য ট্যানস্ট্যাক কলাম ডেফিনিশন (useBuyerColumns.tsx)
 * =============================================================================
 * [EN] Reference: Rule 28 (Single-word buttons), Rule 29 (Minimal text)
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Tag, Edit2, Trash2 } from 'lucide-react';
import type { Buyer } from '@/types';
import { Badge, Button, type BadgeVariant } from '@/components/ui';

interface UseBuyerColumnsProps {
  onOpenBrands: (buyer: Buyer) => void;
  onEditBuyer: (buyer: Buyer) => void;
  onDeleteBuyer: (buyer: Buyer) => void;
}

export const useBuyerColumns = ({
  onOpenBrands,
  onEditBuyer,
  onDeleteBuyer,
}: UseBuyerColumnsProps): ColumnDef<Buyer>[] => {
  return useMemo<ColumnDef<Buyer>[]>(
    () => [
      {
        accessorKey: 'buyerCode',
        header: 'Code',
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-text-primary">
            {row.original.buyerCode}
          </span>
        ),
      },
      {
        accessorKey: 'buyerName',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-text-primary text-xs">
              {row.original.buyerName}
            </span>
            {row.original.shortName && (
              <span className="text-[10px] text-text-muted">
                {row.original.shortName}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'buyerType',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.original.buyerType;
          const variant: BadgeVariant = type === 'DIRECT' ? 'accent' : 'neutral';
          return <Badge variant={variant}>{type}</Badge>;
        },
      },
      {
        accessorKey: 'countryOfOrigin',
        header: 'Country',
        cell: ({ row }) => (
          <span className="text-xs text-text-secondary">
            {row.original.countryOfOrigin}
          </span>
        ),
      },
      {
        accessorKey: 'commissionPercentage',
        header: 'Commission',
        cell: ({ row }) => {
          const comm = row.original.commissionPercentage;
          return (
            <span className="text-xs font-mono text-text-secondary">
              {comm > 0 ? `${Number(comm).toFixed(2)}%` : '—'}
            </span>
          );
        },
      },
      {
        accessorKey: 'paymentTerms',
        header: 'Terms',
        cell: ({ row }) => (
          <span className="text-xs text-text-secondary font-mono">
            {row.original.defaultCurrency} / {row.original.paymentTerms}
          </span>
        ),
      },
      {
        accessorKey: 'complianceStatus',
        header: 'Compliance',
        cell: ({ row }) => {
          const status = row.original.complianceStatus;
          const variant: BadgeVariant =
            status === 'COMPLIANT'
              ? 'success'
              : status === 'CONDITIONAL'
              ? 'warning'
              : 'info';
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          const variant: BadgeVariant = status === 'ACTIVE' ? 'success' : 'neutral';
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        id: 'brands',
        header: 'Brands',
        cell: ({ row }) => (
          <Button
            size="xs"
            variant="outline"
            onClick={() => onOpenBrands(row.original)}
            className="flex items-center gap-1 text-[11px]"
          >
            <Tag size={12} />
            <span>Brands</span>
            <span className="font-mono font-semibold">
              ({row.original.brandCount || 0})
            </span>
          </Button>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              size="xs"
              variant="outline"
              onClick={() => onEditBuyer(row.original)}
              className="text-[11px]"
            >
              <Edit2 size={12} className="mr-1" />
              Edit
            </Button>
            <Button
              size="xs"
              variant="danger"
              onClick={() => onDeleteBuyer(row.original)}
              className="text-[11px]"
            >
              <Trash2 size={12} className="mr-1" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [onOpenBrands, onEditBuyer, onDeleteBuyer]
  );
};
