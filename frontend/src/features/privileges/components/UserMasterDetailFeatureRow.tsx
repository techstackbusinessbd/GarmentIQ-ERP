/**
 * =============================================================================
 * [EN] User Master-Detail Feature Matrix Row Component (UserMasterDetailFeatureRow.tsx)
 * [BN] ব্যবহারকারী মাস্টার-ডিটেল ফিচার ম্যাট্রিক্স রো কম্পোনেন্ট (UserMasterDetailFeatureRow.tsx)
 * =============================================================================
 * [EN] Reference: Subsystem screen row with dedicated 3-state overrides for users
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28/29 (Microcopy)
 * [BN] প্রতিটি সাব-সিস্টেমের জন্য রো: রোলের বেসলাইন, কাস্টম গ্রান্ট ও আনঅ্যাসাইন্ড স্ট্যাটাস।
 */

import React, { useMemo } from 'react';
import {
  Binary, Clock, Coins, ShieldAlert, History, Users, User,
  KeyRound, ShieldCheck, Building2, BookOpen, Layers, Lock, Check, Ban, RotateCcw,
} from 'lucide-react';
import type { MatrixFeatureDef } from '../constants/accessMatrixTypes';

export interface UserMasterDetailFeatureRowProps {
  readonly feature: MatrixFeatureDef;
  readonly moduleId: string;
  readonly roleBasePermissions: ReadonlySet<string>;
  readonly customGrants: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
  readonly onResetFeature: (allCodes: readonly string[]) => void;
}

const getFeatureIcon = (featureId: string) => {
  switch (featureId) {
    case 'settings_autocode': return <Binary size={14} />;
    case 'settings_shifts': return <Clock size={14} />;
    case 'settings_currencies': return <Coins size={14} />;
    case 'settings_security': return <ShieldAlert size={14} />;
    case 'settings_audit_logs': return <History size={14} />;
    case 'user_mgmt': return <Users size={14} />;
    case 'user_profile': return <User size={14} />;
    case 'user_password_reset': return <KeyRound size={14} />;
    case 'user_special_permissions': return <ShieldAlert size={14} />;
    case 'role_mgmt': return <ShieldCheck size={14} />;
    case 'client_mgmt': return <Building2 size={14} />;
    case 'library_mgmt': return <BookOpen size={14} />;
    default: return <Layers size={14} />;
  }
};

const sanitizeSpecialLabel = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes('lock')) return 'Lock';
  if (lower.includes('reset')) return 'Reset';
  if (lower.includes('special')) return 'Special';
  if (lower.includes('profile')) return 'Profile';
  return label.split(' ')[0] || label;
};

const CRUD_SPECS: readonly { key: 'view' | 'create' | 'edit' | 'delete'; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

interface PillTheme {
  readonly baseline: string;
  readonly unassigned: string;
  readonly granted: string;
}

const THEMES: Record<string, PillTheme> = {
  view: {
    baseline: 'bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-400/30',
    unassigned: 'text-sky-700 dark:text-sky-400 border-sky-400/35 hover:bg-sky-500/10',
    granted: 'bg-sky-500/20 text-sky-900 dark:text-sky-200 border-sky-500/40 hover:bg-sky-500/30',
  },
  create: {
    baseline: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-400/30',
    unassigned: 'text-emerald-700 dark:text-emerald-400 border-emerald-400/35 hover:bg-emerald-500/10',
    granted: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/30',
  },
  edit: {
    baseline: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-400/30',
    unassigned: 'text-amber-700 dark:text-amber-400 border-amber-400/35 hover:bg-amber-500/10',
    granted: 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40 hover:bg-amber-500/30',
  },
  delete: {
    baseline: 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-400/30',
    unassigned: 'text-rose-700 dark:text-rose-400 border-rose-400/35 hover:bg-rose-500/10',
    granted: 'bg-rose-500/20 text-rose-900 dark:text-rose-200 border-rose-500/40 hover:bg-rose-500/30',
  },
  special: {
    baseline: 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-400/30',
    unassigned: 'text-indigo-700 dark:text-indigo-400 border-indigo-400/35 hover:bg-indigo-500/10',
    granted: 'bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-indigo-500/40 hover:bg-indigo-500/30',
  },
};

export const UserMasterDetailFeatureRow: React.FC<UserMasterDetailFeatureRowProps> = ({
  feature,
  roleBasePermissions,
  customGrants,
  isSuperAdmin,
  onToggleAction,
  onToggleMenu,
  onResetFeature,
}) => {
  const menuAction = feature.actions.menu;
  const menuCode = menuAction?.code;
  const isMenuRoleInherited = menuCode ? roleBasePermissions.has(menuCode) : false;
  const isMenuCustomGranted = menuCode ? customGrants.has(menuCode) : false;

  const { allCodes, specialActions, hasCrudActions } = useMemo(() => {
    const codes: string[] = [];
    const specials: { code: string; label: string }[] = [];
    let hasCrud = false;

    Object.entries(feature.actions).forEach(([key, act]) => {
      if (!act) return;
      if (!codes.includes(act.code)) codes.push(act.code);

      if (key === 'view' || key === 'create' || key === 'edit' || key === 'delete') {
        hasCrud = true;
      } else if (key !== 'menu') {
        specials.push({ code: act.code, label: sanitizeSpecialLabel(act.label) });
      }
    });

    return { allCodes: codes, specialActions: specials, hasCrudActions: hasCrud };
  }, [feature.actions]);

  const featureCustomGrantsCount = useMemo(() => {
    return allCodes.filter((c) => customGrants.has(c)).length;
  }, [allCodes, customGrants]);

  const renderPill = (code: string, label: string, theme: PillTheme) => {
    const isFromRole = isSuperAdmin || roleBasePermissions.has(code);
    const isSpecialGrant = customGrants.has(code);

    if (isFromRole) {
      return (
        <span
          key={code}
          className={`px-2 py-0.8 rounded-[3px] text-[11px] font-medium border inline-flex items-center gap-1 shadow-2xs cursor-default select-none ${theme.baseline}`}
          title={code}
        >
          <Lock size={9} className="opacity-70" />
          <span>{label}</span>
        </span>
      );
    }

    if (isSpecialGrant) {
      return (
        <button
          key={code}
          type="button"
          onClick={() => onToggleAction(code)}
          className={`px-2 py-0.8 rounded-[3px] text-[11px] font-semibold border inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-all ${theme.granted}`}
          title={code}
        >
          <Check size={10} strokeWidth={2.5} />
          <span>{label}</span>
        </button>
      );
    }

    return (
      <button
        key={code}
        type="button"
        onClick={() => onToggleAction(code)}
        className={`px-2 py-0.8 rounded-[3px] text-[11px] font-medium bg-transparent border border-dashed inline-flex items-center gap-0.5 cursor-pointer transition-all ${theme.unassigned}`}
        title={code}
      >
        <span>+ {label}</span>
      </button>
    );
  };

  return (
    <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20 transition-colors">
      {/* 1. Feature Info */}
      <td className="p-2.5 align-middle min-w-[200px] max-w-[240px]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
            {getFeatureIcon(feature.id)}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-text-primary tracking-tight block truncate">
              {feature.name}
            </span>
            <span className="text-[10px] text-text-muted font-mono block truncate">
              {feature.path || feature.id}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Menu Navigation */}
      <td className="p-2.5 align-middle text-center min-w-[100px]">
        {menuCode ? (
          isSuperAdmin || isMenuRoleInherited ? (
            <div
              className="w-full py-1 px-2 rounded-[4px] text-[11px] font-medium bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/25 inline-flex items-center justify-center gap-1 shadow-2xs"
              title="Role baseline"
            >
              <Lock size={10} className="text-teal-600 dark:text-teal-400" />
              <span>Visible</span>
            </div>
          ) : isMenuCustomGranted ? (
            <button
              type="button"
              onClick={() => onToggleMenu([menuCode], false)}
              className="w-full py-1 px-2 rounded-[4px] text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 inline-flex items-center justify-center gap-1 hover:bg-emerald-500/20 cursor-pointer shadow-2xs transition-all"
              title="Override active"
            >
              <Check size={11} strokeWidth={2.5} className="text-emerald-600 dark:text-emerald-400" />
              <span>Visible</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleMenu([menuCode], true)}
              className="w-full py-1 px-2 rounded-[4px] text-[11px] font-medium bg-surface-muted/60 text-text-muted border border-border-subtle hover:text-text-primary hover:border-brand-accent/40 inline-flex items-center justify-center gap-1 cursor-pointer transition-all"
              title="Hidden"
            >
              <Ban size={10} className="text-text-muted" />
              <span>Hidden</span>
            </button>
          )
        ) : (
          <span className="text-[10px] text-text-muted/30 font-mono px-1.5">—</span>
        )}
      </td>

      {/* 3. Standard CRUD Actions */}
      <td className="p-2.5 align-middle min-w-[220px]">
        {!hasCrudActions ? (
          <span className="text-[10px] text-text-muted/30 font-mono px-1.5">—</span>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {CRUD_SPECS.map(({ key, label }) => {
              const act = feature.actions[key];
              if (!act) return null;
              return renderPill(act.code, label, THEMES[key] || THEMES.special!);
            })}
          </div>
        )}
      </td>

      {/* 4. Special Operations */}
      <td className="p-2.5 align-middle min-w-[180px]">
        {specialActions.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {specialActions.map((special) => renderPill(special.code, special.label, THEMES.special!))}
          </div>
        ) : (
          <span className="text-[10px] text-text-muted/30 font-mono px-1.5">—</span>
        )}
      </td>

      {/* 5. Clearance Status & Reset */}
      <td className="p-2.5 align-middle text-right min-w-[120px]">
        {featureCustomGrantsCount > 0 ? (
          <div className="inline-flex items-center justify-end gap-1.5">
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              +{featureCustomGrantsCount}
            </span>
            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={() => onResetFeature(allCodes)}
              className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer disabled:opacity-40"
              title="Reset"
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
