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
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { MasterDetailModuleHeader } from './MasterDetailModuleHeader';
import { MasterDetailFeatureRow } from './MasterDetailFeatureRow';

export interface MasterDetailMatrixTableProps {
  readonly modules: readonly MatrixModuleDef[];
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly collapsedModuleIds?: ReadonlySet<string>;
  readonly onToggleModuleCollapse?: (moduleId: string) => void;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleModuleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onSetModulePermissions: (allCodes: readonly string[], grantCodes: readonly string[]) => void;
}

export const MasterDetailMatrixTable: React.FC<MasterDetailMatrixTableProps> = ({
  modules,
  activePermissions,
  isSuperAdmin,
  collapsedModuleIds: externalCollapsedIds,
  onToggleModuleCollapse: externalToggleCollapse,
  onToggleAction,
  onToggleModuleMenu,
  onSetModulePermissions,
}) => {
  const [internalCollapsedIds, setInternalCollapsedIds] = useState<Set<string>>(new Set());
  const collapsedIds = externalCollapsedIds || internalCollapsedIds;

  const toggleModuleCollapse = (moduleId: string) => {
    if (externalToggleCollapse) {
      externalToggleCollapse(moduleId);
    } else {
      setInternalCollapsedIds((prev) => {
        const next = new Set(prev);
        if (next.has(moduleId)) next.delete(moduleId);
        else next.add(moduleId);
        return next;
      });
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted/80 border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <th className="p-3 font-bold min-w-[220px]">
                Feature
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
              const isCollapsed = collapsedIds.has(module.id);
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
