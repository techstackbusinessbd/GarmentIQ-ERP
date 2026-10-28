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
  Ruler, Tag, Shirt, Palette, Calendar, AlertTriangle,
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
    case 'library_units': return <Ruler size={14} />;
    case 'library_sizes': return <Tag size={14} />;
    case 'library_items': return <Shirt size={14} />;
    case 'library_colors': return <Palette size={14} />;
    case 'library_seasons': return <Calendar size={14} />;
    case 'library_defects': return <AlertTriangle size={14} />;
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
    baseline: 'bg-primary/10 text-primary border-primary/20',
    unassigned: 'text-text-muted border-border-subtle hover:text-text-primary hover:bg-surface-muted/50',
    granted: 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25',
  },
  create: {
    baseline: 'bg-primary/10 text-primary border-primary/20',
    unassigned: 'text-text-muted border-border-subtle hover:text-text-primary hover:bg-surface-muted/50',
    granted: 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25',
  },
  edit: {
    baseline: 'bg-primary/10 text-primary border-primary/20',
    unassigned: 'text-text-muted border-border-subtle hover:text-text-primary hover:bg-surface-muted/50',
    granted: 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25',
  },
  delete: {
    baseline: 'bg-danger/10 text-danger border-danger/25',
    unassigned: 'text-text-muted border-border-subtle hover:text-danger hover:bg-danger/5',
    granted: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/25',
  },
  special: {
    baseline: 'bg-primary/10 text-primary border-primary/25',
    unassigned: 'text-text-muted border-border-subtle hover:text-text-primary hover:bg-surface-muted/50',
    granted: 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/25',
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
          <div className="w-7 h-7 rounded-[4px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
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
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 inline-flex items-center justify-center gap-1 shadow-2xs"
              title="Role baseline"
            >
              <Lock size={9} className="text-primary/70" />
              <span>Visible</span>
            </div>
          ) : isMenuCustomGranted ? (
            <button
              type="button"
              onClick={() => onToggleMenu([menuCode], false)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30 inline-flex items-center justify-center gap-1 hover:bg-accent/25 cursor-pointer shadow-2xs transition-all"
              title="Override active"
            >
              <Check size={10} strokeWidth={2.5} className="text-accent" />
              <span>Visible</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleMenu([menuCode], true)}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-card hover:bg-surface-muted text-text-muted hover:text-text-primary border border-border-subtle inline-flex items-center justify-center gap-1 cursor-pointer transition-all"
              title="Grant menu visibility"
            >
              <Ban size={9} className="text-text-muted" />
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
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/25">
              +{featureCustomGrantsCount}
            </span>
            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={() => onResetFeature(allCodes)}
              className="text-[10px] text-warning hover:underline inline-flex items-center gap-0.5 cursor-pointer disabled:opacity-40"
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
