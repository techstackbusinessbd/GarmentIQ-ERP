/**
 * =============================================================================
 * [EN] Role Matrix Mode Tabs Switcher (RoleMatrixModeTabs.tsx)
 * [BN] রোল ম্যাট্রিক্স মোড নির্বাচন ট্যাব কম্পোনেন্ট (RoleMatrixModeTabs.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] সিঙ্গেল রোল ক্লিয়ারেন্স এডিটর এবং ক্রস-রোল কম্প্যারিসন ম্যাট্রিক্সের মধ্যে স্যুইচ করার প্রিমিয়াম ট্যাব।
 */

import React from 'react';
import { SlidersHorizontal, TableProperties, ShieldCheck, Layers } from 'lucide-react';

export type MatrixViewMode = 'editor' | 'matrix';

export interface RoleMatrixModeTabsProps {
  readonly viewMode: MatrixViewMode;
  readonly onChangeViewMode: (mode: MatrixViewMode) => void;
  readonly totalRolesCount: number;
  readonly totalPermissionsCount: number;
}

export const RoleMatrixModeTabs: React.FC<RoleMatrixModeTabsProps> = ({
  viewMode,
  onChangeViewMode,
  totalRolesCount,
  totalPermissionsCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-surface-card border border-border-subtle rounded-lg shadow-2xs">
      {/* Primary Mode Tabs */}
      <div className="inline-flex items-center p-1 bg-surface-muted/70 rounded-md border border-border-subtle/80 gap-1">
        <button
          type="button"
          onClick={() => onChangeViewMode('editor')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'editor'
              ? 'bg-surface-card text-brand-accent shadow-xs border border-border-subtle font-bold'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-card/50 border border-transparent'
          }`}
        >
          <SlidersHorizontal size={13} className={viewMode === 'editor' ? 'text-brand-accent' : 'text-text-muted'} />
          <span>Role Clearances Editor</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-accent/10 text-brand-accent font-bold">
            Interactive
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangeViewMode('matrix')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'matrix'
              ? 'bg-surface-card text-brand-accent shadow-xs border border-border-subtle font-bold'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-card/50 border border-transparent'
          }`}
        >
          <TableProperties size={13} className={viewMode === 'matrix' ? 'text-brand-accent' : 'text-text-muted'} />
          <span>Cross-Role Comparison Matrix</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-muted text-text-muted font-bold">
            Grid View
          </span>
        </button>
      </div>

      {/* Global Meta Stats Badge */}
      <div className="flex items-center gap-2.5 px-3 py-1 text-xs text-text-muted self-end sm:self-center">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Layers size={13} className="text-brand-accent" />
          <span className="font-semibold text-text-primary">{totalRolesCount}</span>
          <span>Roles Active</span>
        </div>
        <span className="text-border-subtle">•</span>
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-text-primary">{totalPermissionsCount}</span>
          <span>Total Privileges</span>
        </div>
      </div>
    </div>
  );
};
