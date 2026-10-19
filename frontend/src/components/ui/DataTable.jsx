import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '../../constants/uiConstants';

/**
 * [EN] Master Enterprise DataTable Component based on TanStack Table v8.
 * Implements ADR-006 & Rule 21: 100% Unified Table Design driven by centralized tokens.
 *
 * [BN] মাস্টার এন্টারপ্রাইজ ডেটা টেবিল কম্পোনেন্ট।
 * সমস্ত মডিউলে হুবহু একই হেডার, রো প্যাডিং, সার্চবার এবং পেজিনেশন নিশ্চিত করে।
 */
export const DataTable = ({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  filterSlot = null,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-surface-card border border-border-subtle rounded-card shadow-xs overflow-hidden transition-colors duration-200">
      {/* 1. Table Top Controls Bar (Search + Custom Filter Slot) */}
      <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface-muted/50">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors"
          />
        </div>

        {filterSlot && <div className="flex items-center gap-2">{filterSlot}</div>}
      </div>

      {/* 2. Master Table Surface */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-surface-muted/60 border-b border-border-subtle">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1.5 ${
                          header.column.getCanSort() ? 'cursor-pointer hover:text-text-primary' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <ArrowUpDown size={12} className="text-text-muted shrink-0" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-surface-hover/80 transition-colors text-xs text-text-primary font-normal"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-xs text-text-muted">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Master Pagination Bar */}
      <div className="p-3.5 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-text-muted bg-surface-muted/30">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-border-subtle rounded-xs px-2 py-1 bg-surface-card text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-brand-accent cursor-pointer"
          >
            {DEFAULT_PAGE_SIZE_OPTIONS.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="tabular-nums">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())} (
            {table.getFilteredRowModel().rows.length} total)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-xs border border-border-subtle hover:bg-surface-muted text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-xs border border-border-subtle hover:bg-surface-muted text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-xs border border-border-subtle hover:bg-surface-muted text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-xs border border-border-subtle hover:bg-surface-muted text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
