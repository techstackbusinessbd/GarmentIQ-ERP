/**
 * =============================================================================
 * [EN] Enterprise Access Matrix Data Grid (AccessMatrixGrid.tsx)
 * [BN] এন্টারপ্রাইজ অ্যাক্সেস ম্যাট্রিক্স ডেটা গ্রিড টেবিল (AccessMatrixGrid.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] ডোমেন ➔ মডিউল ➔ মেনু ভিজিবিলিটি ➔ অ্যাকশন (View, Create, Edit, Delete, Approve) গ্রিড।
 */

import React from 'react';
import { Check, Minus, LayoutGrid, Info } from 'lucide-react';
import type { MatrixDomainDef, MatrixFeatureDef, MatrixActionKey } from '../constants/accessMatrixTypes';

export interface AccessMatrixGridProps {
  readonly domains: readonly MatrixDomainDef[];
  readonly activeRoleCode: string;
  readonly isSuperAdminRole: boolean;
  readonly rolePermissions: ReadonlySet<string>;
  readonly onTogglePermission: (permissionCode: string) => void;
  readonly onToggleModuleAll: (feature: MatrixFeatureDef) => void;
}

const ACTION_COLUMNS: { key: MatrixActionKey; label: string; width: string; dot: string }[] = [
  { key: 'view', label: 'View', width: 'w-20', dot: 'bg-sky-500' },
  { key: 'create', label: 'Create', width: 'w-20', dot: 'bg-emerald-500' },
  { key: 'edit', label: 'Edit', width: 'w-20', dot: 'bg-amber-500' },
  { key: 'delete', label: 'Delete', width: 'w-20', dot: 'bg-rose-500' },
  { key: 'restore', label: 'Restore', width: 'w-20', dot: 'bg-teal-500' },
  { key: 'purge', label: 'Purge', width: 'w-20', dot: 'bg-red-700' },
  { key: 'approve', label: 'Approve', width: 'w-24', dot: 'bg-purple-500' },
];

export const AccessMatrixGrid: React.FC<AccessMatrixGridProps> = ({
  domains,
  isSuperAdminRole,
  rolePermissions,
  onTogglePermission,
  onToggleModuleAll,
}) => {
  return (
    <div className="border border-border-subtle rounded-[6px] bg-surface-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Two-row hierarchical header */}
          <thead className="sticky top-0 z-10 bg-surface-muted/95 backdrop-blur-xs border-b border-border-subtle">
            <tr>
              <th rowSpan={2} className="p-3 font-bold text-text-primary border-r border-border-subtle w-48">
                Domain
              </th>
              <th rowSpan={2} className="p-3 font-bold text-text-primary border-r border-border-subtle min-w-[200px]">
                Application Page / Screen
              </th>
              {/* Dedicated Menu Visibility Column */}
              <th rowSpan={2} className="p-2.5 font-bold text-text-primary text-center border-r border-border-subtle w-22 bg-brand-accent/5">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-brand-accent">
                    <LayoutGrid size={12} />
                    <span>Menu</span>
                  </div>
                  <span className="text-[9px] font-mono text-text-muted font-normal uppercase tracking-wider">Sidebar</span>
                </div>
              </th>
              <th colSpan={7} className="py-2 px-3 font-bold text-text-primary text-center border-r border-border-subtle bg-surface-muted">
                Action Privileges
              </th>
              <th rowSpan={2} className="p-3 font-bold text-text-primary text-center w-16">
                All
              </th>
            </tr>
            <tr className="border-t border-border-subtle/60 text-[11px] text-text-secondary">
              {ACTION_COLUMNS.map((col) => (
                <th key={col.key} className={`py-1.5 px-2 font-semibold text-center border-r border-border-subtle/60 ${col.width}`}>
                  <div className="inline-flex items-center gap-1.5 justify-center">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                    <span>{col.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body grouped cleanly by Domain */}
          <tbody className="divide-y divide-border-subtle">
            {domains.map((domain) => {
              const allFeatures = domain.modules.flatMap((m) =>
                m.features.map((f) => ({ ...f, moduleName: m.name }))
              );

              return (
                <React.Fragment key={domain.id}>
                  {allFeatures.map((feature, featIndex) => {
                    const isFirstRow = featIndex === 0;
                    const rowSpanCount = allFeatures.length;
                    const menuDef = feature.actions.menu;
                    const isMenuGranted = isSuperAdminRole || (menuDef && rolePermissions.has(menuDef.code));

                    return (
                      <tr key={feature.id} className="hover:bg-brand-accent/5 transition-colors">
                        {/* Domain Cell (Merged with rowSpan on first row) */}
                        {isFirstRow && (
                          <td
                            rowSpan={rowSpanCount}
                            className="p-3 font-semibold text-text-primary border-r border-border-subtle bg-surface-muted/20 align-top"
                          >
                            <div className="sticky top-20">
                              <span className="font-mono text-brand-accent uppercase tracking-wider text-[10px] bg-brand-accent/10 px-1.5 py-0.5 rounded font-bold block w-fit mb-1">
                                {domain.id.toUpperCase()}
                              </span>
                              <span className="block text-xs font-bold text-text-primary">{domain.title}</span>
                              <span className="text-[10px] font-mono text-text-muted">{allFeatures.length} Features</span>
                            </div>
                          </td>
                        )}

                        {/* Application Page & Screen Name Cell */}
                        <td className="p-3 border-r border-border-subtle font-medium text-text-primary">
                          <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                            {feature.moduleName}
                          </div>
                          <div className="font-semibold text-text-primary text-xs mt-0.5">{feature.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-brand-accent bg-brand-accent/5 px-1.5 py-0.2 rounded border border-brand-accent/20">
                              {feature.path || feature.id}
                            </span>
                          </div>
                        </td>

                        {/* Dedicated Menu Visibility Checkbox */}
                        <td className="p-2 text-center border-r border-border-subtle bg-brand-accent/5">
                          {menuDef ? (
                            <button
                              type="button"
                              disabled={isSuperAdminRole}
                              onClick={() => onTogglePermission(menuDef.code)}
                              title={
                                isSuperAdminRole
                                  ? 'Super Admin root bypass (Always visible in sidebar)'
                                  : `Toggle sidebar menu visibility for ${feature.name} (${menuDef.code})`
                              }
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border transition-all ${
                                isMenuGranted
                                  ? 'bg-brand-accent text-white border-brand-accent shadow-2xs hover:bg-brand-accent-hover'
                                  : 'bg-surface-base text-transparent border-border-subtle hover:border-text-muted'
                              } ${isSuperAdminRole ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                            >
                              <Check size={12} strokeWidth={3} className={isMenuGranted ? 'opacity-100' : 'opacity-0'} />
                            </button>
                          ) : (
                            <Minus size={11} className="mx-auto text-text-muted/30" />
                          )}
                        </td>

                        {/* 5 Action Checkbox Cells */}
                        {ACTION_COLUMNS.map((col) => {
                          const actionDef = feature.actions[col.key];

                          if (!actionDef) {
                            return (
                              <td key={col.key} className="p-2 text-center border-r border-border-subtle/50 text-text-muted/30">
                                <Minus size={11} className="mx-auto" />
                              </td>
                            );
                          }

                          const isGranted = isSuperAdminRole || rolePermissions.has(actionDef.code);

                          return (
                            <td key={col.key} className="p-2 text-center border-r border-border-subtle/50">
                              <button
                                type="button"
                                disabled={isSuperAdminRole}
                                onClick={() => onTogglePermission(actionDef.code)}
                                title={isSuperAdminRole ? 'Super Admin root bypass' : `${actionDef.label} (${actionDef.code})`}
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border transition-all ${
                                  isGranted
                                    ? 'bg-brand-accent text-white border-brand-accent shadow-2xs hover:bg-brand-accent-hover'
                                    : 'bg-surface-base text-transparent border-border-subtle hover:border-text-muted'
                                } ${isSuperAdminRole ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                              >
                                <Check size={12} strokeWidth={3} className={isGranted ? 'opacity-100' : 'opacity-0'} />
                              </button>
                            </td>
                          );
                        })}

                        {/* Quick Row Toggle */}
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            disabled={isSuperAdminRole}
                            onClick={() => onToggleModuleAll(feature)}
                            title="Toggle all permissions including menu for this feature"
                            className="px-2 py-0.8 text-[10px] font-mono font-semibold rounded-[3px] bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border-subtle cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                          >
                            Row
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend & Policy Footer */}
      <div className="p-3 bg-surface-muted/60 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-[3px] bg-brand-accent text-white">
              <Check size={10} strokeWidth={3} />
            </span>
            <span className="text-[11px] text-text-muted font-medium">Granted Action</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-[3px] bg-brand-accent/10 border border-brand-accent text-brand-accent">
              <LayoutGrid size={10} />
            </span>
            <span className="text-[11px] text-text-muted font-medium">Sidebar Menu Visibility</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-[3px] bg-surface-base border border-border-subtle text-text-muted/40">
              <Minus size={10} />
            </span>
            <span className="text-[11px] text-text-muted font-medium">Revoked / Restricted</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <Info size={12} className="text-brand-accent shrink-0" />
          <span>Permissions are applied instantly across navigation menus, workspace pages, and action buttons.</span>
        </div>
      </div>
    </div>
  );
};
