/**
 * =============================================================================
 * [EN] Cross-Role Comparison Matrix Component (CrossRoleComparisonMatrix.tsx)
 * [BN] ক্রস-রোল কম্প্যারিসন ম্যাট্রিক্স গ্রিড কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] পুরো ফ্যাক্টরির সমস্ত রোলের প্রিভিলেজ ক্লিয়ারেন্স পাশাপাশি রেখে তুলনা করার ২D ম্যাট্রিক্স।
 */

import React, { useState, useMemo } from 'react';
import { Search, Compass, Shield, CheckCircle2, RotateCcw } from 'lucide-react';
import type { MatrixDomainDef, MatrixFeatureDef } from '../constants/accessMatrixTypes';
import type { BackendRoleDto } from '../services/roleService';

export interface CrossRoleComparisonMatrixProps {
  readonly domains: readonly MatrixDomainDef[];
  readonly roles: readonly BackendRoleDto[];
  readonly rolePermissionsMap: Record<string, string[]>;
  readonly onSelectRoleForEdit: (roleCode: string) => void;
}

export const CrossRoleComparisonMatrix: React.FC<CrossRoleComparisonMatrixProps> = ({
  domains,
  roles,
  rolePermissionsMap,
  onSelectRoleForEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flatten features for fast matrix rendering
  const matrixFeatures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const rows: { domain: MatrixDomainDef; moduleName: string; feature: MatrixFeatureDef }[] = [];

    domains.forEach((d) => {
      d.modules.forEach((m) => {
        m.features.forEach((f) => {
          if (!q) {
            rows.push({ domain: d, moduleName: m.name, feature: f });
            return;
          }
          const matches =
            f.name.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q) ||
            d.title.toLowerCase().includes(q) ||
            (f.path && f.path.toLowerCase().includes(q));
          if (matches) {
            rows.push({ domain: d, moduleName: m.name, feature: f });
          }
        });
      });
    });

    return rows;
  }, [domains, searchQuery]);

  return (
    <div className="space-y-3">
      {/* Search Header Strip */}
      <div className="p-3 bg-surface-card border border-border-subtle rounded-lg shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across matrix features and routes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-xs text-text-muted hover:text-text-primary rounded border border-border-subtle cursor-pointer"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>

        <div className="text-xs text-text-muted">
          Showing <span className="font-bold text-text-primary font-mono">{matrixFeatures.length}</span> Screens across <span className="font-bold text-text-primary font-mono">{roles.length}</span> Roles
        </div>
      </div>

      {/* 2D Multi-Role Matrix Table */}
      <div className="border border-border-subtle rounded-lg bg-surface-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-muted/95 border-b border-border-subtle sticky top-0 z-20 backdrop-blur-xs">
              <tr>
                <th className="p-3 w-64 min-w-[220px] border-r border-border-subtle bg-surface-muted/95 sticky left-0 z-30 font-bold text-text-primary shadow-xs">
                  Screen / Feature
                </th>
                {roles.map((role) => {
                  const isSuperAdmin = role.roleCode === 'ROLE_SUPER_ADMIN';
                  return (
                    <th
                      key={role.roleCode}
                      className="p-2.5 text-center border-r border-border-subtle/80 min-w-[120px] font-bold text-text-primary"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectRoleForEdit(role.roleCode)}
                        className="w-full hover:bg-brand-accent/10 p-1 rounded transition-colors group cursor-pointer text-center"
                        title={`Click to edit clearances for ${role.roleName}`}
                      >
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-text-primary group-hover:text-brand-accent">
                          <Shield size={11} className={isSuperAdmin ? 'text-rose-500' : 'text-brand-accent'} />
                          <span className="truncate">{role.roleName}</span>
                        </div>
                        <span className="text-[9px] font-mono text-text-muted font-normal block mt-0.5">
                          {role.roleCode.replace('ROLE_', '')}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {matrixFeatures.map(({ moduleName, feature }) => {
                const featureCodes = Object.values(feature.actions)
                  .filter((a): a is { code: string; label: string } => Boolean(a))
                  .map((a) => a.code);
                const totalActions = featureCodes.length;

                return (
                  <tr key={feature.id} className="hover:bg-surface-muted/40 transition-colors">
                    {/* Left Sticky Column: Screen Name & Subsystem */}
                    <td className="p-3 border-r border-border-subtle bg-surface-card sticky left-0 z-10 shadow-2xs">
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                        {moduleName}
                      </span>
                      <span className="font-bold text-text-primary text-xs block">
                        {feature.name}
                      </span>
                      {feature.path && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-text-muted mt-0.5">
                          <Compass size={9} />
                          <span>{feature.path}</span>
                        </span>
                      )}
                    </td>

                    {/* Role Status Cells */}
                    {roles.map((role) => {
                      const isSuperAdmin = role.roleCode === 'ROLE_SUPER_ADMIN';
                      const rolePerms = isSuperAdmin
                        ? new Set(featureCodes)
                        : new Set(rolePermissionsMap[role.roleCode] || []);
                      const grantedCount = featureCodes.filter((c) => rolePerms.has(c)).length;

                      const isFull = totalActions > 0 && grantedCount >= totalActions;
                      const isPartial = grantedCount > 0 && grantedCount < totalActions;
                      const isNone = grantedCount === 0;

                      return (
                        <td
                          key={role.roleCode}
                          className="p-2 text-center border-r border-border-subtle/60 align-middle"
                        >
                          <button
                            type="button"
                            onClick={() => onSelectRoleForEdit(role.roleCode)}
                            className="w-full py-1 px-1.5 rounded transition-all flex items-center justify-center gap-1 cursor-pointer hover:ring-1 hover:ring-brand-accent/30"
                            title={`${role.roleName}: ${grantedCount}/${totalActions} actions granted. Click to edit.`}
                          >
                            {isFull && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                                <CheckCircle2 size={10} />
                                <span>FULL</span>
                              </span>
                            )}
                            {isPartial && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                                <span>{grantedCount}/{totalActions}</span>
                              </span>
                            )}
                            {isNone && (
                              <span className="text-text-muted/40 font-mono text-xs select-none">
                                —
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {matrixFeatures.length === 0 && (
                <tr>
                  <td colSpan={roles.length + 1} className="p-8 text-center text-xs text-text-muted">
                    No features matching &quot;{searchQuery}&quot; found in comparison matrix.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
