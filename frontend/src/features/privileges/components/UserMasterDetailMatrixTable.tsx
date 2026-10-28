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
import { Lock, Check } from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { UserMasterDetailModuleHeader } from './UserMasterDetailModuleHeader';
import { UserMasterDetailFeatureRow } from './UserMasterDetailFeatureRow';

export interface UserMasterDetailMatrixTableProps {
  readonly modules: readonly MatrixModuleDef[];
  readonly roleBasePermissions: ReadonlySet<string>;
  readonly customGrants: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly collapsedModuleIds?: ReadonlySet<string>;
  readonly onToggleModuleCollapse?: (moduleId: string) => void;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onResetModule: (allCodes: readonly string[]) => void;
}

export const UserMasterDetailMatrixTable: React.FC<UserMasterDetailMatrixTableProps> = ({
  modules,
  roleBasePermissions,
  customGrants,
  isSuperAdmin,
  collapsedModuleIds: externalCollapsedIds,
  onToggleModuleCollapse: externalToggleCollapse,
  onToggleAction,
  onToggleMenu,
  onResetModule,
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
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              <Lock size={9} className="text-primary/70" /> Baseline
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
              <Check size={9} strokeWidth={2.5} /> Override
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-[3px] text-[10px] text-text-muted border border-dashed border-border-subtle">
              + Unassigned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMasterDetailMatrixTable;
