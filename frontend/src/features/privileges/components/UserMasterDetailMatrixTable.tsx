/**
 * =============================================================================
 * [EN] User Master-Detail Matrix Table (UserMasterDetailMatrixTable.tsx)
 * [BN] ব্যবহারকারী মাস্টার-ডিটেল ম্যাট্রিক্স টেবিল কম্পোনেন্ট (UserMasterDetailMatrixTable.tsx)
 * =============================================================================
 * [EN] Reference: Option 1 High-Density Multi-Column Matrix Table
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] মাল্টি-কলাম গ্রিড টেবিল: মডিউল গ্রুপ ব্যানার এবং সাব-ফিচার ভিত্তিক পৃথক রো লেআউট।
 */

import React, { useState } from 'react';
import { Lock, Check, ChevronsDown, ChevronsUp } from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { UserMasterDetailModuleHeader } from './UserMasterDetailModuleHeader';
import { UserMasterDetailFeatureRow } from './UserMasterDetailFeatureRow';

export interface UserMasterDetailMatrixTableProps {
  readonly modules: readonly MatrixModuleDef[];
  readonly roleBasePermissions: ReadonlySet<string>;
  readonly customGrants: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onResetModule: (allCodes: readonly string[]) => void;
}

export const UserMasterDetailMatrixTable: React.FC<UserMasterDetailMatrixTableProps> = ({
  modules,
  roleBasePermissions,
  customGrants,
  isSuperAdmin,
  onToggleAction,
  onToggleMenu,
  onResetModule,
}) => {
  const [collapsedModuleIds, setCollapsedModuleIds] = useState<Set<string>>(new Set());

  const isAllExpanded = collapsedModuleIds.size === 0;

  const toggleAllCollapse = () => {
    if (isAllExpanded) {
      setCollapsedModuleIds(new Set(modules.map((m) => m.id)));
    } else {
      setCollapsedModuleIds(new Set());
    }
  };

  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted/60 border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <th className="p-2.5 font-bold min-w-[200px]">
                <div className="flex items-center justify-between gap-2">
                  <span>Feature</span>
                  <button
                    type="button"
                    onClick={toggleAllCollapse}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded text-text-secondary hover:text-text-primary hover:bg-surface-card border border-border-subtle cursor-pointer transition-all"
                    title={isAllExpanded ? 'Collapse all modules' : 'Expand all modules'}
                  >
                    {isAllExpanded ? <ChevronsUp size={11} /> : <ChevronsDown size={11} />}
                    <span>{isAllExpanded ? 'Collapse' : 'Expand'}</span>
                  </button>
                </div>
              </th>
              <th className="p-2.5 font-bold text-center min-w-[100px]">
                Menu
              </th>
              <th className="p-2.5 font-bold min-w-[220px]">
                Actions
              </th>
              <th className="p-2.5 font-bold min-w-[180px]">
                Special
              </th>
              <th className="p-2.5 font-bold min-w-[120px]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-xs">
            {modules.map((module) => {
              const isCollapsed = collapsedModuleIds.has(module.id);
              return (
                <React.Fragment key={module.id}>
                  {/* 1. Module Grouping Header */}
                  <UserMasterDetailModuleHeader
                    module={module}
                    customGrants={customGrants}
                    isSuperAdmin={isSuperAdmin}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={toggleModuleCollapse}
                    onResetModule={onResetModule}
                  />

                  {/* 2. Subsystem / Feature Rows */}
                  {!isCollapsed &&
                    module.features.map((feature) => (
                      <UserMasterDetailFeatureRow
                        key={feature.id}
                        feature={feature}
                        moduleId={module.id}
                        roleBasePermissions={roleBasePermissions}
                        customGrants={customGrants}
                        isSuperAdmin={isSuperAdmin}
                        onToggleAction={onToggleAction}
                        onToggleMenu={onToggleMenu}
                        onResetFeature={onResetModule}
                      />
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {modules.length === 0 && (
        <div className="p-10 text-center text-xs text-text-muted">
          No modules found.
        </div>
      )}

      {/* Minimal Legend Strip */}
      <div className="px-3 py-2 bg-surface-muted/30 border-t border-border-subtle/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium bg-surface-muted text-text-secondary border border-border-subtle">
              <Lock size={9} className="text-text-muted" /> Lock
            </span>
            <span className="text-[11px] text-text-muted">Role baseline</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              <Check size={9} strokeWidth={2.5} /> Active
            </span>
            <span className="text-[11px] text-text-muted">Override</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-[3px] text-[10px] text-text-muted border border-dashed border-border-subtle">
              + Action
            </span>
            <span className="text-[11px] text-text-muted">Unassigned</span>
          </div>
        </div>

        {/* Action color indicators */}
        <div className="flex items-center gap-2.5 text-[10px] font-mono text-text-muted flex-wrap">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> View</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Create</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Edit</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Delete</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Special</span>
        </div>
      </div>
    </div>
  );
};
