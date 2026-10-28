/**
 * =============================================================================
 * [EN] Master-Detail Feature Matrix Row Component (MasterDetailFeatureRow.tsx)
 * [BN] মাস্টার-ডিটেল ফিচার ম্যাট্রিক্স রো কম্পোনেন্ট (MasterDetailFeatureRow.tsx)
 * =============================================================================
 * [EN] Reference: Subsystem screen row with dedicated CRUD and Menu controls
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28/29 (Minimal Text)
 * [BN] প্রতিটি সাব-সিস্টেম/স্ক্রিনের জন্য আলাদা রো: নেভিগেশন মেনু, সিআরইউডি ও স্পেশাল অ্যাকশনের রূপ।
 */

import React, { useMemo } from 'react';
import {
  Binary,
  Clock,
  Coins,
  ShieldAlert,
  History,
  Users,
  User,
  KeyRound,
  ShieldCheck,
  Building2,
  BookOpen,
  Layers,
  Check,
  Ban,
} from 'lucide-react';
import type { MatrixFeatureDef } from '../constants/accessMatrixTypes';
import { Badge } from '@/components/ui/Badge';

export interface MasterDetailFeatureRowProps {
  readonly feature: MatrixFeatureDef;
  readonly moduleId: string;
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onToggleAction: (code: string) => void;
  readonly onToggleMenu: (menuCodes: readonly string[], shouldEnable: boolean) => void;
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

const CRUD_SPECS: readonly { key: 'view' | 'create' | 'edit' | 'delete'; label: string; isDanger?: boolean }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete', isDanger: true },
];

export const MasterDetailFeatureRow: React.FC<MasterDetailFeatureRowProps> = ({
  feature,
  activePermissions,
  isSuperAdmin,
  onToggleAction,
  onToggleMenu,
}) => {
  const menuAction = feature.actions.menu;
  const menuCode = menuAction?.code;
  const isMenuGranted = isSuperAdmin || (menuCode ? activePermissions.has(menuCode) : false);

  // Extract all valid codes and separate CRUD vs Special actions
  const { allCodes, specialActions, hasCrudActions } = useMemo(() => {
    const codes: string[] = [];
    const specials: { code: string; label: string; key: string }[] = [];
    let hasCrud = false;

    Object.entries(feature.actions).forEach(([key, act]) => {
      if (!act) return;
      if (!codes.includes(act.code)) codes.push(act.code);

      if (key === 'view' || key === 'create' || key === 'edit' || key === 'delete') {
        hasCrud = true;
      } else if (key !== 'menu') {
        specials.push({ code: act.code, label: sanitizeSpecialLabel(act.label), key });
      }
    });

    return { allCodes: codes, specialActions: specials, hasCrudActions: hasCrud };
  }, [feature.actions]);

  const grantedCount = useMemo(() => {
    if (isSuperAdmin) return allCodes.length;
    return allCodes.filter((code) => activePermissions.has(code)).length;
  }, [isSuperAdmin, allCodes, activePermissions]);

  const totalCount = allCodes.length;

  return (
    <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20 transition-colors">
      {/* 1. Feature / Screen Info */}
      <td className="p-3 align-middle min-w-[220px] max-w-[260px]">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
            {getFeatureIcon(feature.id)}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-text-primary tracking-tight block truncate">
              {feature.name}
            </span>
            <span className="text-[10px] text-text-muted font-mono block truncate mt-0.5">
              {feature.path || feature.id}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Sidebar Menu Navigation */}
      <td className="p-3 align-middle text-center min-w-[120px]">
        {menuAction ? (
          <button
            type="button"
            disabled={isSuperAdmin}
            onClick={() => onToggleMenu([menuAction.code], !isMenuGranted)}
            className={`w-full py-1 px-2 rounded-[4px] text-xs font-semibold border transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer ${
              isMenuGranted
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shadow-2xs'
                : 'bg-surface-muted text-text-muted border-border-subtle hover:text-text-primary hover:bg-surface-muted/80'
            } ${isSuperAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
            title={menuAction.code}
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
        ) : (
          <span className="text-[10px] text-text-muted/40 font-mono px-2 py-1">—</span>
        )}
      </td>

      {/* 3. Standard CRUD Actions */}
      <td className="p-3 align-middle min-w-[240px]">
        {!hasCrudActions ? (
          <span className="text-[10px] text-text-muted/40 font-mono px-2 py-1">—</span>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {CRUD_SPECS.map(({ key, label, isDanger }) => {
              const act = feature.actions[key];
              if (!act) return null;
              const isGranted = isSuperAdmin || activePermissions.has(act.code);

              return (
                <button
                  key={act.code}
                  type="button"
                  disabled={isSuperAdmin}
                  onClick={() => onToggleAction(act.code)}
                  className={`px-2 py-1 rounded-[4px] text-[11px] font-semibold border transition-all inline-flex items-center gap-1 cursor-pointer ${
                    isGranted
                      ? isDanger
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                        : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30'
                      : 'bg-surface-card text-text-muted border-border-subtle hover:text-text-primary'
                  }`}
                  title={act.code}
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
        )}
      </td>

      {/* 4. Special Operations / Advanced Actions */}
      <td className="p-3 align-middle min-w-[210px]">
        {specialActions.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {specialActions.map((special) => {
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
          <span className="text-[10px] text-text-muted/40 font-mono px-2 py-1">—</span>
        )}
      </td>

      {/* 5. Minimal Status Badge */}
      <td className="p-3 align-middle text-right min-w-[130px]">
        <Badge
          variant={
            grantedCount === totalCount
              ? 'success'
              : grantedCount === 0
              ? 'neutral'
              : 'warning'
          }
          dot
        >
          {grantedCount === totalCount
            ? `Full (${grantedCount}/${totalCount})`
            : grantedCount === 0
            ? `None (0/${totalCount})`
            : `Partial (${grantedCount}/${totalCount})`}
        </Badge>
      </td>
    </tr>
  );
};
