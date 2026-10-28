/**
 * =============================================================================
 * [EN] Master-Detail Matrix Table Row Component (MasterDetailMatrixRow.tsx)
 * [BN] মাস্টার-ডিটেল ম্যাট্রিক্স টেবিল রো কম্পোনেন্ট (MasterDetailMatrixRow.tsx)
 * =============================================================================
 * [EN] Reference: Option 1 High-Density Multi-Column Matrix Table
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] প্রতিটি মডিউলের জন্য আলাদা রো: নেভিগেশন মেনু, স্ট্যান্ডার্ড সিআরইউডি ও স্পেশাল অ্যাকশনের স্পষ্ট বিভাজন।
 */

import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  Settings,
  BookOpen,
  Layers,
  Check,
  Ban,
  Eye,
  Sparkles,
} from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { aggregateModulePermissions, type ModuleActionItem } from '../utils/moduleAggregationUtils';
import { Badge } from '@/components/ui/Badge';

export interface MasterDetailMatrixRowProps {
  readonly module: MatrixModuleDef;
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleModuleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onSetModulePermissions: (allCodes: readonly string[], grantCodes: readonly string[]) => void;
}

const getModuleIcon = (moduleId: string) => {
  switch (moduleId) {
    case 'user_mgmt':
      return <Users size={15} />;
    case 'client_mgmt':
      return <Building2 size={15} />;
    case 'role_mgmt':
      return <ShieldCheck size={15} />;
    case 'settings_mgmt':
      return <Settings size={15} />;
    case 'library_mgmt':
      return <BookOpen size={15} />;
    default:
      return <Layers size={15} />;
  }
};

const CRUD_SPECS: readonly { key: 'view' | 'create' | 'edit' | 'delete'; label: string; isDanger?: boolean }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete', isDanger: true },
];

export const MasterDetailMatrixRow: React.FC<MasterDetailMatrixRowProps> = ({
  module,
  activePermissions,
  isSuperAdmin,
  onToggleAction,
  onToggleModuleMenu,
  onSetModulePermissions,
}) => {
  const aggregated = useMemo(() => aggregateModulePermissions(module), [module]);

  const menuCodes = useMemo(
    () => aggregated.menuActions.map((m) => m.code),
    [aggregated.menuActions]
  );

  const isMenuGranted =
    isSuperAdmin ||
    (aggregated.primaryMenuCode ? activePermissions.has(aggregated.primaryMenuCode) : false);

  const grantedInModule = useMemo(() => {
    if (isSuperAdmin) return aggregated.allCodes.length;
    return aggregated.allCodes.filter((code) => activePermissions.has(code)).length;
  }, [isSuperAdmin, aggregated.allCodes, activePermissions]);

  const totalInModule = aggregated.allCodes.length;

  const handleApplyFull = () => {
    if (isSuperAdmin) return;
    onSetModulePermissions(aggregated.allCodes, aggregated.allCodes);
  };

  const handleApplyReadOnly = () => {
    if (isSuperAdmin) return;
    const readOnlyCodes = [
      ...menuCodes,
      aggregated.crudActions.view?.code,
    ].filter((c): c is string => Boolean(c));
    onSetModulePermissions(aggregated.allCodes, readOnlyCodes);
  };

  const handleApplyNone = () => {
    if (isSuperAdmin) return;
    onSetModulePermissions(aggregated.allCodes, []);
  };

  return (
    <tr className="border-b border-border-subtle/70 hover:bg-surface-muted/30 transition-colors">
      {/* 1. Module Info & Scope */}
      <td className="p-3 align-top min-w-[220px] max-w-[260px]">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
            {getModuleIcon(aggregated.moduleId)}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-text-primary tracking-tight block truncate">
              {aggregated.moduleName}
            </span>
            <span className="text-[10px] text-text-muted font-mono block truncate mt-0.5">
              {aggregated.targetPath}
            </span>
            <p className="text-[11px] text-text-muted line-clamp-2 mt-1 leading-relaxed">
              {aggregated.moduleDescription}
            </p>
          </div>
        </div>
      </td>

      {/* 2. 🧭 Sidebar Menu Navigation Access */}
      <td className="p-3 align-middle text-center min-w-[130px]">
        <button
          type="button"
          disabled={isSuperAdmin}
          onClick={() => onToggleModuleMenu(menuCodes, !isMenuGranted)}
          className={`w-full py-1.5 px-2 rounded-[4px] text-xs font-semibold border transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer ${
            isMenuGranted
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shadow-2xs'
              : 'bg-surface-muted text-text-muted border-border-subtle hover:text-text-primary hover:bg-surface-muted/80'
          } ${isSuperAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
          title={isMenuGranted ? 'Visible in Navigation Sidebar' : 'Hidden from Navigation Sidebar'}
        >
          {isMenuGranted ? (
            <>
              <Check size={12} strokeWidth={2.5} className="text-emerald-600 dark:text-emerald-400" />
              <span>Visible</span>
            </>
          ) : (
            <>
              <Ban size={12} className="text-text-muted" />
              <span>Hidden</span>
            </>
          )}
        </button>
        <span className="text-[9px] font-mono text-text-muted block mt-1">
          {aggregated.primaryMenuCode || 'MENU:NONE'}
        </span>
      </td>

      {/* 3. ⚡ Standard CRUD Actions */}
      <td className="p-3 align-middle min-w-[240px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {CRUD_SPECS.map(({ key, label, isDanger }) => {
            const action: ModuleActionItem | undefined = aggregated.crudActions[key];
            if (!action) {
              return (
                <span key={key} className="text-[10px] text-text-muted/40 font-mono px-2 py-1">
                  —
                </span>
              );
            }
            const isGranted = isSuperAdmin || activePermissions.has(action.code);

            return (
              <button
                key={action.code}
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onToggleAction(action.code)}
                className={`px-2 py-1 rounded-[4px] text-[11px] font-semibold border transition-all inline-flex items-center gap-1 cursor-pointer ${
                  isGranted
                    ? isDanger
                      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                      : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30'
                    : 'bg-surface-card text-text-muted border-border-subtle hover:text-text-primary'
                }`}
              >
                {isGranted && (
                  <Check
                    size={10}
                    strokeWidth={3}
                    className={isDanger ? 'text-rose-600' : 'text-sky-600'}
                  />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </td>

      {/* 4. 🔐 Special Operations / Advanced Actions */}
      <td className="p-3 align-middle min-w-[230px]">
        {aggregated.specialActions.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {aggregated.specialActions.map((special) => {
              const isGranted = isSuperAdmin || activePermissions.has(special.code);
              return (
                <button
                  key={special.code}
                  type="button"
                  disabled={isSuperAdmin}
                  onClick={() => onToggleAction(special.code)}
                  className={`px-2 py-1 rounded-[4px] text-[10px] font-semibold border transition-all inline-flex items-center gap-1 cursor-pointer ${
                    isGranted
                      ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 shadow-2xs font-bold'
                      : 'bg-surface-card text-text-muted border-border-subtle hover:text-text-primary'
                  }`}
                  title={special.code}
                >
                  {isGranted && <Check size={10} strokeWidth={3} className="text-purple-600" />}
                  <span>{special.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <span className="text-[11px] text-text-muted/50 italic">
            Standard CRUD only
          </span>
        )}
      </td>

      {/* 5. 🎯 Presets & Coverage */}
      <td className="p-3 align-middle min-w-[170px]">
        <div className="flex flex-col gap-2">
          {/* Preset Buttons Strip */}
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={handleApplyFull}
              className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-text-secondary hover:text-text-primary bg-surface-muted border border-border-subtle transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-0.5"
            >
              <Sparkles size={9} className="text-emerald-600" />
              <span>Full</span>
            </button>

            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={handleApplyReadOnly}
              className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-text-secondary hover:text-text-primary bg-surface-muted border border-border-subtle transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-0.5"
            >
              <Eye size={9} className="text-sky-600" />
              <span>Read</span>
            </button>

            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={handleApplyNone}
              className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-text-secondary hover:text-rose-600 bg-surface-muted border border-border-subtle transition-all cursor-pointer disabled:opacity-50"
            >
              None
            </button>
          </div>

          {/* Coverage Badge */}
          <div>
            <Badge
              variant={
                grantedInModule === totalInModule
                  ? 'success'
                  : grantedInModule === 0
                  ? 'neutral'
                  : 'warning'
              }
              dot
            >
              {grantedInModule === totalInModule
                ? `Full (${grantedInModule}/${totalInModule})`
                : grantedInModule === 0
                ? `None (0/${totalInModule})`
                : `Partial (${grantedInModule}/${totalInModule})`}
            </Badge>
          </div>
        </div>
      </td>
    </tr>
  );
};
