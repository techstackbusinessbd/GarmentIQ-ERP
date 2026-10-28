/**
 * =============================================================================
 * [EN] Enterprise Generic High-Density DataTable Component (DataTable)
 * [BN] এন্টারপ্রাইজ জেনেরিক হাই-ডেনসিটি ডেটা টেবিল কম্পোনেন্ট (DataTable)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/05_SCREEN_COLOR_RATIO_AND_COMPONENT_MAPPING.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] ট্যানস্ট্যাক টেবিল ভি৮ চালিত হাই-ডেনসিটি ডেটাগ্রিড, সর্টিং, গ্লোবাল সার্চ ও পেজিনেশন।
 */

import React, { useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, type ColumnDef, type SortingState, flexRender,
} from '@tanstack/react-table';
import {
  ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search, X, Database,
} from 'lucide-react';

/**
 * [EN] Properties contract for the generic DataTable component.
 * [BN] জেনেরিক ডেটা টেবিল কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট (রুল ০৭, ০৮ ও ১৫)।
 */
export interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[];
  readonly data: TData[];
  readonly isLoading?: boolean;
  readonly searchPlaceholder?: string;
  readonly initialPageSize?: number;
  readonly headerActions?: React.ReactNode;
  readonly title?: string;
  readonly icon?: React.ReactNode;
  readonly subtitle?: string;
  readonly headerExtra?: React.ReactNode;
}

/**
 * [EN] High-Density Enterprise TanStack Table Component.
 * [BN] এন্টারপ্রাইজ হাই-ডেনসিটি ট্যানস্ট্যাক টেবিল কম্পোনেন্ট।
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  initialPageSize = 10,
  headerActions,
  title,
  icon,
  subtitle,
  headerExtra,
}: DataTableProps<TData, TValue>): React.ReactElement {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _colId, filterVal) => {
      if (!filterVal) return true;
      const q = String(filterVal).toLowerCase().trim();
      if (!q) return true;
      for (const cell of row.getAllCells()) {
        const v = cell.getValue();
        if (v != null && String(v).toLowerCase().includes(q)) return true;
      }
      const raw = row.original as Record<string, unknown>;
      if (raw && typeof raw === 'object') {
        for (const k of Object.keys(raw)) {
          const v = raw[k];
          if (v != null && (typeof v === 'string' || typeof v === 'number')) {
            if (String(v).toLowerCase().includes(q)) return true;
          }
        }
      }
      return false;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: initialPageSize } },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] shadow-xs overflow-hidden flex flex-col">
      {/* [EN] Optional Integrated Card Header / [BN] ঐচ্ছিক সমন্বিত কার্ড হেডার */}
      {title && (
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-surface-card shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <div className="shrink-0 text-brand-accent">{icon}</div>}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary tracking-tight truncate">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-text-muted truncate mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerExtra && <div className="flex items-center gap-2 shrink-0">{headerExtra}</div>}
        </div>
      )}

      {/* [EN] Table Toolbar (Search + Extra Actions) / [BN] টেবিল টুলবার */}
      <div className="px-4 py-2.5 border-b border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-muted/20">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-all shadow-2xs"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {headerActions && (
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {headerActions}
          </div>
        )}
      </div>

      {/* [EN] Data Grid Viewport / [BN] ডেটা গ্রিড ভিউপোর্ট */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-surface-muted/60 text-text-secondary font-semibold border-b border-border-subtle text-xs"
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="py-2.5 px-3 select-none text-xs font-semibold text-text-secondary"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder ? null : isSortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors focus:outline-none text-xs font-semibold text-text-secondary"
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-brand-accent" />
                          ) : sortDirection === 'desc' ? (
                            <ArrowDown size={12} className="text-brand-accent" />
                          ) : (
                            <ArrowUpDown size={11} className="text-text-muted opacity-60" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border-subtle/80">
            {isLoading ? (
              /* [EN] Loading Skeletons / [BN] লোডিং স্কেলিটন রো */
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-3 px-3">
                      <div className="h-4 bg-surface-muted rounded-[2px] w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              /* [EN] Empty State / [BN] খালি অবস্থা */
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-text-muted bg-surface-card"
                >
                  <div className="inline-flex flex-col items-center justify-center gap-1.5">
                    <Database size={24} className="text-text-muted/60" />
                    <p className="text-xs font-semibold text-text-primary">No records found</p>
                    <p className="text-[11px] text-text-muted">
                      No matching records found for your current filter query.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              /* [EN] Data Rows / [BN] ডেটা রো */
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-brand-accent-light/25 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2.5 px-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* [EN] High-Density Pagination Bar / [BN] হাই-ডেনসিটি পেজিনেশন বার */}
      <div className="p-2.5 border-t border-border-subtle bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* [EN] Rows counter indicator / [BN] রো কাউন্টার */}
        <div className="text-[11px] text-text-muted font-mono tabular-nums">
          Showing <span className="font-semibold text-text-primary">{startRow}</span> to{' '}
          <span className="font-semibold text-text-primary">{endRow}</span> of{' '}
          <span className="font-semibold text-text-primary">{totalRows}</span> entries
        </div>

        {/* [EN] Controls (Page Size + Buttons) / [BN] পেজ সাইজ ও বাটন কন্ট্রোলস */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <span>Per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 text-xs bg-surface-card border border-border-subtle rounded-[3px] text-text-primary focus:border-brand-accent focus:outline-none"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-text-muted px-2 font-mono tabular-nums">
              Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
            </span>

            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous Page"
              className="p-1 rounded-[3px] border border-border-subtle text-text-primary hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next Page"
              className="p-1 rounded-[3px] border border-border-subtle text-text-primary hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
