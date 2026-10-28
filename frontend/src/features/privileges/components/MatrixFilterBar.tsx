/**
 * =============================================================================
 * [EN] Premium Matrix Filter Ribbon Component (MatrixFilterBar.tsx)
 * [BN] প্রিমিয়াম ম্যাট্রিক্স ফিল্টার রিবন কম্পোনেন্ট (MatrixFilterBar.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise UI), Rule 20 (Tokens)
 * [BN] টু-লেভেল ক্যাসকেডিং ডোমেন-মডিউল ফিল্টার, ইনস্ট্যান্ট সার্চ ও অ্যাক্টিভ ফিল্টার কাউন্টার।
 */

import React, { useMemo } from 'react';
import {
  Search,
  Layers,
  LayoutGrid,
  ChevronDown,
  X,
  RotateCcw,
} from 'lucide-react';
import type { MatrixDomainDef } from '../constants/accessMatrixConstants';

export interface MatrixFilterBarProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly selectedDomainId: string;
  readonly onDomainChange: (domainId: string) => void;
  readonly selectedModuleId: string;
  readonly onModuleChange: (moduleId: string) => void;
  readonly domains: readonly MatrixDomainDef[];
}

export const MatrixFilterBar: React.FC<MatrixFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDomainId,
  onDomainChange,
  selectedModuleId,
  onModuleChange,
  domains,
}) => {
  // Available modules based on selected domain
  const availableModules = useMemo(() => {
    if (selectedDomainId === 'all') {
      return domains.flatMap((d) => d.modules);
    }
    const domain = domains.find((d) => d.id === selectedDomainId);
    return domain ? domain.modules : [];
  }, [domains, selectedDomainId]);

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDomainChange(e.target.value);
    onModuleChange('all');
  };

  const isFiltered = searchQuery !== '' || selectedDomainId !== 'all' || selectedModuleId !== 'all';

  const handleResetFilters = () => {
    onSearchChange('');
    onDomainChange('all');
    onModuleChange('all');
  };

  return (
    <div className="pt-3 border-t border-border-subtle/80 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
      <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
        {/* Keyword Search Input with Clear Action */}
        <div className="relative flex-1 sm:w-64 min-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search modules, features, or paths..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Level 1: Domain Filter Selector */}
        <div className="relative inline-flex items-center">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex items-center gap-1">
            <Layers size={13} className="text-brand-accent" />
          </div>
          <select
            id="domain-filter-select"
            value={selectedDomainId}
            onChange={handleDomainSelect}
            className="appearance-none pl-7 pr-7 py-1.5 text-xs font-medium bg-surface-base hover:bg-surface-muted/50 border border-border-subtle rounded-md text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none shadow-2xs cursor-pointer transition-all min-w-[160px]"
          >
            <option value="all">All Domains ({domains.length})</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>

        {/* Level 2: Subsystem Module Filter Selector */}
        <div className="relative inline-flex items-center">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex items-center gap-1">
            <LayoutGrid size={13} className="text-brand-accent" />
          </div>
          <select
            id="module-filter-select"
            value={selectedModuleId}
            onChange={(e) => onModuleChange(e.target.value)}
            className="appearance-none pl-7 pr-7 py-1.5 text-xs font-medium bg-surface-base hover:bg-surface-muted/50 border border-border-subtle rounded-md text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none shadow-2xs cursor-pointer transition-all min-w-[180px]"
          >
            <option value="all">All Modules ({availableModules.length})</option>
            {availableModules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>

        {/* Clear Filters Button (When Active) */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-2 py-1 text-[11px] font-medium text-text-muted hover:text-text-primary bg-surface-muted hover:bg-surface-card rounded border border-border-subtle transition-all flex items-center gap-1 cursor-pointer"
            title="Reset active filters"
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Live Synchronization Status Badge */}
      <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted shrink-0 self-end xl:self-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Live Menu Sync Active</span>
        </span>
      </div>
    </div>
  );
};
