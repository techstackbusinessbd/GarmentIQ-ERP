/**
 * =============================================================================
 * [EN] User Master-Detail Matrix Row Component (UserMasterDetailMatrixRow.tsx)
 * [BN] ব্যবহারকারী মাস্টার-ডিটেল ম্যাট্রিক্স রো কম্পোনেন্ট (UserMasterDetailMatrixRow.tsx)
 * =============================================================================
 * [EN] Reference: Option 1 High-Density Multi-Column Matrix Table
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] প্রতিটি মডিউলের জন্য আলাদা রো: নেভিগেশন মেনু, সিআরইউডি ও বিশেষ অ্যাকশনের পরিচ্ছন্ন ৩-স্টেট ওভাররাইড ডিসপ্লে।
 */

import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  Settings,
  BookOpen,
  Layers,
  Lock,
  Check,
  Ban,
  RotateCcw,
} from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { aggregateModulePermissions, type ModuleActionItem } from '../utils/moduleAggregationUtils';

export interface UserMasterDetailMatrixRowProps {
  readonly module: MatrixModuleDef;
  readonly roleBasePermissions: ReadonlySet<string>;
  readonly customGrants: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onResetModule: (allCodes: readonly string[]) => void;
}

const getModuleIcon = (moduleId: string) => {
  switch (moduleId) {
    case 'user_mgmt': return <Users size={14} />;
    case 'client_mgmt': return <Building2 size={14} />;
    case 'role_mgmt': return <ShieldCheck size={14} />;
    case 'settings_mgmt': return <Settings size={14} />;
    case 'library_mgmt': return <BookOpen size={14} />;
    default: return <Layers size={14} />;
  }
};

const CRUD_SPECS: readonly { key: 'view' | 'create' | 'edit' | 'delete'; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

interface ActionColorTheme {
  readonly baseline: string;
  readonly unassigned: string;
  readonly granted: string;
}

const CRUD_THEMES: Record<'view' | 'create' | 'edit' | 'delete', ActionColorTheme> = {
  view: {
    baseline: 'bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-400/30',
    unassigned: 'text-sky-700 dark:text-sky-400 border-sky-400/35 hover:bg-sky-500/10 hover:border-sky-500/60',
    granted: 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border-sky-500/40 hover:bg-sky-500/30',
  },
  create: {
    baseline: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-400/30',
    unassigned: 'text-emerald-700 dark:text-emerald-400 border-emerald-400/35 hover:bg-emerald-500/10 hover:border-emerald-500/60',
    granted: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/30',
  },
  edit: {
    baseline: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-400/30',
    unassigned: 'text-amber-700 dark:text-amber-400 border-amber-400/35 hover:bg-amber-500/10 hover:border-amber-500/60',
    granted: 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40 hover:bg-amber-500/30',
  },
  delete: {
    baseline: 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-400/30',
    unassigned: 'text-rose-700 dark:text-rose-400 border-rose-400/35 hover:bg-rose-500/10 hover:border-rose-500/60',
    granted: 'bg-rose-500/20 text-rose-900 dark:text-rose-200 border-rose-500/40 hover:bg-rose-500/30',
  },
};

const SPECIAL_THEME: ActionColorTheme = {
  baseline: 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-400/30',
  unassigned: 'text-indigo-700 dark:text-indigo-400 border-indigo-400/35 hover:bg-indigo-500/10 hover:border-indigo-500/60',
  granted: 'bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-indigo-500/40 hover:bg-indigo-500/30',
};

export const UserMasterDetailMatrixRow: React.FC<UserMasterDetailMatrixRowProps> = ({
  module,
  roleBasePermissions,
  customGrants,
  isSuperAdmin,
  onToggleAction,
  onToggleMenu,
  onResetModule,
}) => {
  const aggregated = useMemo(() => aggregateModulePermissions(module), [module]);
  const menuCodes = useMemo(() => aggregated.menuActions.map((m) => m.code), [aggregated.menuActions]);
  const primaryMenuCode = aggregated.primaryMenuCode;

  const isMenuRoleInherited = primaryMenuCode ? roleBasePermissions.has(primaryMenuCode) : false;
  const isMenuCustomGranted = primaryMenuCode ? customGrants.has(primaryMenuCode) : false;

  const moduleCustomGrantsCount = useMemo(() => {
    return aggregated.allCodes.filter((c) => customGrants.has(c)).length;
  }, [aggregated.allCodes, customGrants]);

  return (
    <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/25 transition-colors">
      {/* 1. Module Info */}
      <td className="p-2.5 align-middle min-w-[200px] max-w-[240px]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
            {getModuleIcon(aggregated.moduleId)}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-text-primary tracking-tight block truncate">
              {aggregated.moduleName}
            </span>
            <span className="text-[10px] text-text-muted font-mono block truncate">
              {aggregated.targetPath}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Menu Navigation */}
      <td className="p-2.5 align-middle text-center min-w-[100px]">
        {isSuperAdmin || isMenuRoleInherited ? (
          <div
            className="w-full py-1 px-2 rounded-[4px] text-[11px] font-medium bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/25 inline-flex items-center justify-center gap-1 shadow-2xs"
            title="Role baseline (Read-only)"
          >
            <Lock size={10} className="text-teal-600 dark:text-teal-400" />
            <span>Visible</span>
          </div>
        ) : isMenuCustomGranted ? (
          <button
            type="button"
            onClick={() => onToggleMenu(menuCodes, false)}
            className="w-full py-1 px-2 rounded-[4px] text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 inline-flex items-center justify-center gap-1 hover:bg-emerald-500/20 cursor-pointer shadow-2xs transition-all"
            title="Override active. Click to revoke."
          >
            <Check size={11} strokeWidth={2.5} className="text-emerald-600 dark:text-emerald-400" />
            <span>Visible</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onToggleMenu(menuCodes, true)}
            className="w-full py-1 px-2 rounded-[4px] text-[11px] font-medium bg-surface-muted/60 text-text-muted border border-border-subtle hover:text-text-primary hover:border-brand-accent/40 inline-flex items-center justify-center gap-1 cursor-pointer transition-all"
            title="Hidden. Click to grant."
          >
            <Ban size={10} className="text-text-muted" />
            <span>Hidden</span>
          </button>
        )}
      </td>

      {/* 3. ⚡ Standard CRUD Actions */}
      <td className="p-2.5 align-middle min-w-[220px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {CRUD_SPECS.map(({ key, label }) => {
            const action: ModuleActionItem | undefined = aggregated.crudActions[key];
            if (!action) {
              return <span key={key} className="text-[10px] text-text-muted/30 font-mono px-1.5">—</span>;
            }

            const isFromRole = isSuperAdmin || roleBasePermissions.has(action.code);
            const isSpecialGrant = customGrants.has(action.code);

            const theme = CRUD_THEMES[key];

            if (isFromRole) {
              return (
                <span
                  key={action.code}
                  className={`px-2 py-0.8 rounded-[3px] text-[11px] font-medium border inline-flex items-center gap-1 shadow-2xs cursor-default select-none ${theme.baseline}`}
                  title={`Role baseline (${action.code})`}
                >
                  <Lock size={9} className="opacity-70" />
                  <span>{label}</span>
                </span>
              );
            }

            if (isSpecialGrant) {
              return (
                <button
                  key={action.code}
                  type="button"
                  onClick={() => onToggleAction(action.code)}
                  className={`px-2 py-0.8 rounded-[3px] text-[11px] font-semibold border inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-all ${theme.granted}`}
                  title={`Override active (${action.code}). Click to revoke.`}
                >
                  <Check size={10} strokeWidth={2.5} />
                  <span>{label}</span>
                </button>
              );
            }

            return (
              <button
                key={action.code}
                type="button"
                onClick={() => onToggleAction(action.code)}
                className={`px-2 py-0.8 rounded-[3px] text-[11px] font-medium bg-transparent border border-dashed inline-flex items-center gap-0.5 cursor-pointer transition-all ${theme.unassigned}`}
                title={`Click to grant ${label}`}
              >
                <span>+ {label}</span>
              </button>
            );
          })}
        </div>
      </td>

      {/* 4. Special Operations */}
      <td className="p-2.5 align-middle min-w-[180px]">
        {aggregated.specialActions.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {aggregated.specialActions.map((special) => {
              const isFromRole = isSuperAdmin || roleBasePermissions.has(special.code);
              const isSpecialGrant = customGrants.has(special.code);

              if (isFromRole) {
                return (
                  <span
                    key={special.code}
                    className={`px-2 py-0.8 rounded-[3px] text-[10px] font-medium border inline-flex items-center gap-1 shadow-2xs cursor-default select-none ${SPECIAL_THEME.baseline}`}
                    title={`Role baseline (${special.code})`}
                  >
                    <Lock size={9} className="opacity-70" />
                    <span>{special.label}</span>
                  </span>
                );
              }

              if (isSpecialGrant) {
                return (
                  <button
                    key={special.code}
                    type="button"
                    onClick={() => onToggleAction(special.code)}
                    className={`px-2 py-0.8 rounded-[3px] text-[10px] font-semibold border inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-all ${SPECIAL_THEME.granted}`}
                    title={`Override active (${special.code}). Click to revoke.`}
                  >
                    <Check size={10} strokeWidth={2.5} />
                    <span>{special.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={special.code}
                  type="button"
                  onClick={() => onToggleAction(special.code)}
                  className={`px-2 py-0.8 rounded-[3px] text-[10px] font-medium bg-transparent border border-dashed inline-flex items-center gap-0.5 cursor-pointer transition-all ${SPECIAL_THEME.unassigned}`}
                  title={`Click to grant ${special.label}`}
                >
                  <span>+ {special.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <span className="text-[10px] text-text-muted/30 font-mono px-1.5">—</span>
        )}
      </td>

      {/* 5. Clearance Status & Reset */}
      <td className="p-2.5 align-middle min-w-[120px]">
        {moduleCustomGrantsCount > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              +{moduleCustomGrantsCount}
            </span>
            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={() => onResetModule(aggregated.allCodes)}
              className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer disabled:opacity-40"
              title="Reset module overrides"
            >
              <RotateCcw size={9} />
              <span>Reset</span>
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-text-muted/50">
            Baseline
          </span>
        )}
      </td>
    </tr>
  );
};
