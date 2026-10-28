/**
 * =============================================================================
 * [EN] Role Direct Action Clearances Table (RoleDirectActionTable.tsx)
 * [BN] রোল সরাসরি অ্যাকশন ক্লিয়ারেন্স টেবিল কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] লুকোচুরি পরিহার করে সরাসরি দৃশ্যমান অ্যাকশন চিপস, মেনু ভিজিবিলিটি ও ইনস্ট্যান্ট সার্চ টেবিল।
 */

import React, { useState, useMemo } from 'react';
import { Search, Check, Compass, LayoutGrid, RotateCcw, Eye, Plus, Pencil, Trash2, KeyRound, ShieldAlert, Lock, User, CheckCircle2 } from 'lucide-react';
import type { MatrixDomainDef, MatrixFeatureDef } from '../constants/accessMatrixTypes';

export interface RoleDirectActionTableProps {
  readonly domains: readonly MatrixDomainDef[];
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (feature: MatrixFeatureDef, code: string) => void;
  readonly onToggleMenu: (feature: MatrixFeatureDef) => void;
  readonly onToggleAllFeature: (feature: MatrixFeatureDef) => void;
  readonly onClearFeature: (feature: MatrixFeatureDef) => void;
}

const ACTION_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  view: Eye, profile: User, create: Plus, edit: Pencil, lock: Lock, resetPassword: KeyRound, specialPermission: ShieldAlert, delete: Trash2, approve: CheckCircle2,
};

export const RoleDirectActionTable: React.FC<RoleDirectActionTableProps> = ({
  domains,
  activePermissions,
  isSuperAdmin,
  onToggleAction,
  onToggleMenu,
  onToggleAllFeature,
  onClearFeature,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'granted' | 'revoked'>('all');

  // Filter features dynamically based on search query and status mode
  const filteredDomains = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return domains
      .map((domain) => {
        const modules = domain.modules
          .map((module) => {
            const features = module.features.filter((f) => {
              // Status filter
              const allCodes = Object.values(f.actions).filter((a): a is { code: string; label: string } => Boolean(a)).map((a) => a.code);
              const granted = allCodes.filter((c) => activePermissions.has(c));
              const isFeatureGranted = granted.length > 0;

              if (filterMode === 'granted' && !isFeatureGranted) return false;
              if (filterMode === 'revoked' && isFeatureGranted && granted.length === allCodes.length) return false;

              // Search query
              if (!q) return true;
              const matchesName = f.name.toLowerCase().includes(q);
              const matchesPath = f.path ? f.path.toLowerCase().includes(q) : false;
              const matchesModule = module.name.toLowerCase().includes(q);
              const matchesAction = Object.values(f.actions).some((a) => a && (a.label.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)));
              return matchesName || matchesPath || matchesModule || matchesAction;
            });
            return { ...module, features };
          })
          .filter((m) => m.features.length > 0);
        return { ...domain, modules };
      })
      .filter((d) => d.modules.length > 0);
  }, [domains, searchQuery, filterMode, activePermissions]);

  const totalFilteredFeatures = filteredDomains.reduce(
    (acc, d) => acc + d.modules.reduce((mAcc, m) => mAcc + m.features.length, 0),
    0
  );

  return (
    <div className="space-y-3">
      {/* High-Performance Filter Ribbon */}
      <div className="p-3 bg-surface-card border border-border-subtle rounded-lg shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search screen, route path, or action..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-xs text-text-muted hover:text-text-primary rounded border border-border-subtle cursor-pointer"
              title="Clear search"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="inline-flex items-center p-0.5 bg-surface-muted/70 rounded-md border border-border-subtle text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-surface-card text-brand-accent font-bold shadow-2xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('granted')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'granted' ? 'bg-surface-card text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Granted
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('revoked')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'revoked' ? 'bg-surface-card text-rose-700 dark:text-rose-400 font-bold shadow-2xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Restricted
          </button>
        </div>
      </div>

      {/* Main Direct Clearances Table */}
      <div className="border border-border-subtle rounded-lg bg-surface-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-muted/90 border-b border-border-subtle text-text-secondary font-bold sticky top-0 z-10 backdrop-blur-xs">
              <tr>
                <th className="p-3 w-56">Screen / Feature</th>
                <th className="p-3 w-40">Route URL</th>
                <th className="p-3 w-28 text-center bg-brand-accent/5">Sidebar Menu</th>
                <th className="p-3">Direct Action Clearances</th>
                <th className="p-3 w-24 text-center">Row Bulk</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle/80">
              {filteredDomains.map((domain) => (
                <React.Fragment key={domain.id}>
                  {/* Domain Sub-Header Strip */}
                  <tr className="bg-surface-muted/40 border-y border-border-subtle font-bold">
                    <td colSpan={5} className="px-3.5 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-brand-accent uppercase text-[10px] bg-brand-accent/10 px-1.5 py-0.2 rounded">
                          {domain.id.toUpperCase()}
                        </span>
                        <span className="text-xs text-text-primary">{domain.title}</span>
                        <span className="text-[10px] font-mono text-text-muted font-normal">
                          ({domain.modules.reduce((a, m) => a + m.features.length, 0)} Screens)
                        </span>
                      </div>
                    </td>
                  </tr>

                  {domain.modules.map((module) => (
                    <React.Fragment key={module.id}>
                      {module.features.map((feature) => {
                        const menuDef = feature.actions.menu;
                        const isMenuGranted = isSuperAdmin || (menuDef && activePermissions.has(menuDef.code));
                        const nonMenuActions = Object.entries(feature.actions).filter(
                          ([k, a]) => k !== 'menu' && a !== null
                        );
                        const isRowFullyGranted = nonMenuActions.every(
                          ([_, a]) => a && (isSuperAdmin || activePermissions.has(a.code))
                        ) && isMenuGranted;

                        return (
                          <tr key={feature.id} className="hover:bg-brand-accent/5 transition-colors">
                            <td className="p-3 border-r border-border-subtle/60 align-middle">
                              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">{module.name}</span>
                              <span className="font-bold text-text-primary text-xs">{feature.name}</span>
                            </td>
                            <td className="p-3 border-r border-border-subtle/60 align-middle">
                              {feature.path ? (
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-text-muted bg-surface-muted px-2 py-0.5 rounded border border-border-subtle">
                                  <Compass size={10} className="text-text-muted/70" />
                                  <span>{feature.path}</span>
                                </span>
                              ) : <span className="text-text-muted/40 font-mono text-[10px]">—</span>}
                            </td>
                            <td className="p-2.5 text-center border-r border-border-subtle/60 bg-brand-accent/5 align-middle">
                              {menuDef ? (
                                <button
                                  type="button" disabled={isSuperAdmin} onClick={() => onToggleMenu(feature)}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                                    isMenuGranted ? 'bg-brand-accent text-white border-brand-accent shadow-2xs hover:bg-brand-accent-hover' : 'bg-surface-card text-text-muted border-border-subtle hover:text-text-primary'
                                  } ${isSuperAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
                                  title={isSuperAdmin ? 'Super Admin root bypass' : `Toggle sidebar visibility (${menuDef.code})`}
                                >
                                  <LayoutGrid size={11} />
                                  <span>Menu</span>
                                  {isMenuGranted && <Check size={11} strokeWidth={3} />}
                                </button>
                              ) : <span className="text-text-muted/40 font-mono text-[10px]">—</span>}
                            </td>

                            {/* Direct Action Clearances Chips */}
                            <td className="p-2.5 border-r border-border-subtle/60 align-middle">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {nonMenuActions.map(([key, action]) => {
                                  if (!action) return null;
                                  const isGranted = isSuperAdmin || activePermissions.has(action.code);
                                  const ActionIcon = ACTION_ICONS[key] || Eye;

                                  return (
                                    <button
                                      key={key}
                                      type="button"
                                      disabled={isSuperAdmin}
                                      onClick={() => onToggleAction(feature, action.code)}
                                      className={`px-2 py-1 rounded text-[11px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                                        isGranted
                                          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-semibold shadow-2xs hover:bg-emerald-500/15'
                                          : 'bg-surface-card/60 text-text-muted border-border-subtle hover:border-border-muted hover:text-text-primary'
                                      } ${isSuperAdmin ? 'cursor-not-allowed opacity-75' : ''}`}
                                      title={isSuperAdmin ? 'Super Admin root bypass' : `${action.label} (${action.code})`}
                                    >
                                      <ActionIcon size={11} className={isGranted ? 'text-emerald-600' : 'text-text-muted/60'} />
                                      <span>{action.label}</span>
                                      {isGranted && <Check size={10} strokeWidth={3} className="text-emerald-600" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>

                            {/* Row Bulk Controls */}
                            <td className="p-2.5 text-center align-middle">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button" disabled={isSuperAdmin} onClick={() => onToggleAllFeature(feature)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border cursor-pointer transition-colors ${
                                    isRowFullyGranted ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' : 'bg-surface-muted text-text-secondary hover:text-text-primary border-border-subtle'
                                  }`}
                                  title="Grant all actions for this feature"
                                >
                                    All
                                  </button>
                                  <button
                                    type="button" disabled={isSuperAdmin} onClick={() => onClearFeature(feature)}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface-muted hover:bg-rose-500/10 text-text-secondary hover:text-rose-600 border border-border-subtle cursor-pointer transition-colors"
                                    title="Clear all actions for this feature"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}

              {totalFilteredFeatures === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-text-muted">
                    No matching screens or actions found for &quot;{searchQuery}&quot;.
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
