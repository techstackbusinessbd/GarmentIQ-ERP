/**
 * =============================================================================
 * [EN] Granular Action Clearances Drawer (GranularActionDrawer.tsx)
 * [BN] গ্র্যানুলার অ্যাকশন ক্লিয়ারেন্স ড্রয়ার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] প্রতিটি ফিচারের স্বতন্ত্র অপারেশনাল অ্যাকশন চিপস ও রোল-ইনহেরিটেড রিড-অনলি ভিউ।
 */

import React from 'react';
import {
  Eye,
  Sliders,
  Compass,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  CheckCircle2,
  Lock,
  User,
  ShieldAlert,
} from 'lucide-react';
import type { MatrixFeatureDef } from '../constants/accessMatrixTypes';

export interface GranularActionDrawerProps {
  readonly feature: MatrixFeatureDef;
  readonly activePermissions: ReadonlySet<string>;
  readonly roleBasePermissions?: ReadonlySet<string>;
  readonly isUserMode?: boolean;
  readonly disabled?: boolean;
  readonly onToggleAction: (code: string) => void;
}

const ACTION_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  view: Eye,
  profile: User,
  create: Plus,
  edit: Pencil,
  lock: Lock,
  resetPassword: KeyRound,
  reset_password: KeyRound,
  execute: KeyRound,
  specialPermission: ShieldAlert,
  delete: Trash2,
  approve: CheckCircle2,
};

export const GranularActionDrawer: React.FC<GranularActionDrawerProps> = ({
  feature,
  activePermissions,
  roleBasePermissions,
  isUserMode = false,
  disabled = false,
  onToggleAction,
}) => {
  const nonMenuActions = Object.entries(feature.actions).filter(
    ([key, action]) => key !== 'menu' && action !== null
  );

  const activeNonMenuCount = nonMenuActions.filter(
    ([_, action]) => action && activePermissions.has(action.code)
  ).length;

  return (
    <div className="mt-3 ml-2 lg:ml-9 p-3 rounded-lg bg-surface-muted/30 border border-border-subtle/80 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary tracking-tight">
          <Sliders size={12} className="text-brand-accent" />
          <span>Granular Action Clearances</span>
        </div>

        <span className="text-[10px] text-text-muted font-medium">
          {activeNonMenuCount} of {nonMenuActions.length} actions enabled
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Sidebar Navigation Anchor */}
        {feature.actions.menu && (() => {
          const menuCode = feature.actions.menu.code;
          const isMenuRoleInherited = isUserMode && Boolean(roleBasePermissions?.has(menuCode));
          const isMenuGranted = activePermissions.has(menuCode);
          return (
            <div
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${
                isMenuGranted
                  ? 'bg-brand-accent/10 border-brand-accent/25 text-brand-accent font-semibold shadow-2xs'
                  : 'bg-surface-card/60 border-border-subtle text-text-muted/60'
              }`}
              title={
                isMenuRoleInherited
                  ? `Sidebar Navigation (${menuCode})\nInherited from assigned role (Read-only).`
                  : `Sidebar Navigation (${menuCode})\nAutomatically granted with active operational rights.`
              }
            >
              {isMenuRoleInherited ? (
                <Lock size={11} className="text-brand-accent" />
              ) : (
                <Compass
                  size={12}
                  className={isMenuGranted ? 'text-brand-accent' : 'text-text-muted/50'}
                />
              )}
              <span>Sidebar Navigation</span>
              {isMenuRoleInherited ? (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-accent/15 text-brand-accent font-bold uppercase">
                  Role
                </span>
              ) : isMenuGranted ? (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              ) : null}
            </div>
          );
        })()}

        {/* Operational Action Chips */}
        {nonMenuActions.map(([key, action]) => {
          if (!action) return null;
          const isGranted = activePermissions.has(action.code);
          const isRoleInherited = isUserMode && Boolean(roleBasePermissions?.has(action.code));
          const ActionIcon = ACTION_ICONS[key] || Eye;
          const isActionDisabled = disabled || isRoleInherited;

          return (
            <button
              key={key}
              type="button"
              disabled={isActionDisabled}
              onClick={() => onToggleAction(action.code)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition-all flex items-center gap-1.5 ${
                isRoleInherited
                  ? 'bg-surface-muted/90 border-border-subtle/80 text-text-secondary cursor-not-allowed shadow-2xs'
                  : isGranted
                  ? 'bg-surface-card border-status-success-border text-text-primary font-semibold shadow-2xs ring-1 ring-emerald-500/15 cursor-pointer active:scale-[0.98]'
                  : 'bg-surface-card/50 border-border-subtle text-text-muted hover:text-text-primary hover:border-border-muted hover:bg-surface-card cursor-pointer active:scale-[0.98]'
              } ${isActionDisabled && !isRoleInherited ? 'cursor-not-allowed opacity-60' : ''}`}
              title={
                isRoleInherited
                  ? `System Permission: ${action.code}\nInherited from assigned role (Read-only). To modify, adjust Role Access Matrix.`
                  : `System Permission: ${action.code}\nClick to toggle ${action.label} permission.`
              }
            >
              {isRoleInherited ? (
                <Lock size={11} className="text-amber-600 dark:text-amber-400" />
              ) : (
                <ActionIcon
                  size={12}
                  className={isGranted ? 'text-status-success' : 'text-text-muted/60'}
                />
              )}
              <span>{action.label}</span>
              {isRoleInherited ? (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold uppercase">
                  Role
                </span>
              ) : (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isGranted ? 'bg-status-success' : 'bg-border-subtle'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
