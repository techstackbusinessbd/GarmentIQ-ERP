/**
 * =============================================================================
 * [EN] Master-Detail Matrix High-Density Table (MasterDetailMatrixTable.tsx)
 * [BN] মাস্টার-ডিটেল ম্যাট্রিক্স হাই-ডেনসিটি টেবিল কম্পোনেন্ট (MasterDetailMatrixTable.tsx)
 * =============================================================================
 * [EN] Reference: Option 1 High-Density Multi-Column Matrix Table
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] মাল্টি-কলাম গ্রিড টেবিল: মডিউল গ্রুপ ব্যানার এবং সাব-ফিচার ভিত্তিক পৃথক রো লেআউট।
 */

import React, { useState } from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { MasterDetailModuleHeader } from './MasterDetailModuleHeader';
import { MasterDetailFeatureRow } from './MasterDetailFeatureRow';

export interface MasterDetailMatrixTableProps {
  readonly modules: readonly MatrixModuleDef[];
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleModuleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onSetModulePermissions: (allCodes: readonly string[], grantCodes: readonly string[]) => void;
}

export const MasterDetailMatrixTable: React.FC<MasterDetailMatrixTableProps> = ({
  modules,
  activePermissions,
  isSuperAdmin,
  onToggleAction,
  onToggleModuleMenu,
  onSetModulePermissions,
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
            <tr className="bg-surface-muted/80 border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <th className="p-3 font-bold min-w-[220px]">
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
              <th className="p-3 font-bold text-center min-w-[120px]">
                Menu
              </th>
              <th className="p-3 font-bold min-w-[240px]">
                Actions
              </th>
              <th className="p-3 font-bold min-w-[210px]">
                Special
              </th>
              <th className="p-3 font-bold text-right min-w-[130px]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50 text-xs">
            {modules.map((module) => {
              const isCollapsed = collapsedModuleIds.has(module.id);
              return (
                <React.Fragment key={module.id}>
                  {/* 1. Parent Module Grouping Header */}
                  <MasterDetailModuleHeader
                    module={module}
                    activePermissions={activePermissions}
                    isSuperAdmin={isSuperAdmin}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={toggleModuleCollapse}
                    onSetModulePermissions={onSetModulePermissions}
                  />

                  {/* 2. Distinct Subsystem / Feature Rows */}
                  {!isCollapsed &&
                    module.features.map((feature) => (
                      <MasterDetailFeatureRow
                        key={feature.id}
                        feature={feature}
                        moduleId={module.id}
                        activePermissions={activePermissions}
                        isSuperAdmin={isSuperAdmin}
                        onToggleAction={onToggleAction}
                        onToggleMenu={onToggleModuleMenu}
                      />
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {modules.length === 0 && (
        <div className="p-12 text-center text-xs text-text-muted">
          No modules found matching current search or domain filter.
        </div>
      )}
    </div>
  );
};
