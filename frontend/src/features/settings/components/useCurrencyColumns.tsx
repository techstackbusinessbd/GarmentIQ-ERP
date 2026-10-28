/**
 * =============================================================================
 * [EN] TanStack Table Columns Definition for Currencies (useCurrencyColumns.tsx)
 * [BN] বাণিজ্যিক কারেন্সি টেবিলের ট্যানস্ট্যাক কলাম ডেফিনিশন হুক
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (High Perf), Rule 15 (Bilingual), Rule 17 (Enterprise UI)
 * [BN] বৈদেশিক মুদ্রা ও বিনিময় হারের জন্য ডায়নামিক কলাম ও ইনলাইন রেট ইনপুট।
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui';
import { formatLocalDateTime } from '@/utils';
import type { CurrencyRate } from '../services/currencyService';

export interface UseCurrencyColumnsParams {
  readonly onUpdateBdtRate: (code: string, newRate: number) => void;
}

export const useCurrencyColumns = ({
  onUpdateBdtRate,
}: UseCurrencyColumnsParams): ColumnDef<CurrencyRate>[] => {
  return useMemo<ColumnDef<CurrencyRate>[]>(
    () => [
      {
        id: 'currency',
        accessorFn: (row) => `${row.code} ${row.name}`,
        header: 'Currency',
        cell: ({ row }) => {
          const curr = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-brand-accent/10 text-brand-accent font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                {curr.symbol}
              </span>
              <div className="min-w-0">
                <span className="font-bold text-xs text-text-primary block leading-tight">{curr.code}</span>
                <span className="text-[10px] text-text-muted block truncate">{curr.name}</span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'classification',
        header: 'Role / Classification',
        cell: ({ row }) => {
          const curr = row.original;
          if (curr.isMaster) {
            return <Badge variant="info">Primary Export</Badge>;
          }
          if (curr.isOperating) {
            return <Badge variant="success">Local Operating</Badge>;
          }
          return <Badge variant="neutral">Trading Partner</Badge>;
        },
      },
      {
        id: 'rateToUsd',
        accessorKey: 'rateToUsd',
        header: 'Rate to 1.00 USD',
        cell: ({ row }) => {
          const curr = row.original;
          return (
            <span className="font-mono text-xs font-semibold text-text-primary">
              {curr.code === 'USD' ? '1.0000 USD' : `$ ${Number(curr.rateToUsd || 0).toFixed(4)}`}
            </span>
          );
        },
      },
      {
        id: 'rateToBdt',
        accessorKey: 'rateToBdt',
        header: 'Rate to BDT (৳)',
        cell: ({ row }) => {
          const curr = row.original;
          if (curr.code === 'BDT') {
            return <span className="font-mono font-bold text-xs text-text-muted">1.00 ৳ (Base)</span>;
          }
          return (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-text-muted text-[11px] whitespace-nowrap">1 {curr.code} =</span>
              <input
                type="number"
                step="0.05"
                value={curr.rateToBdt}
                onChange={(e) => onUpdateBdtRate(curr.code, parseFloat(e.target.value) || 0)}
                className="w-24 text-xs px-2 py-1 rounded-[3px] bg-surface-base border border-border-subtle text-text-primary font-mono font-bold focus:border-brand-accent focus:outline-none shadow-2xs"
              />
              <span className="font-mono font-semibold text-xs text-text-primary">BDT</span>
            </div>
          );
        },
      },
      {
        id: 'lastUpdated',
        accessorKey: 'lastUpdated',
        header: 'Last Synchronized',
        cell: ({ row }) => {
          const val = row.original.lastUpdated;
          return (
            <span className="font-mono text-[11px] text-text-muted">
              {val ? formatLocalDateTime(String(val)) : 'Live Base'}
            </span>
          );
        },
      },
    ],
    [onUpdateBdtRate]
  );
};

export default useCurrencyColumns;
