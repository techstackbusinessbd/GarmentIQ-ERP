/**
 * =============================================================================
 * [EN] User Role Matrix Selection Grid Component (UserRoleMatrixSelect)
 * [BN] ব্যবহারকারী রোল অ্যাসাইনমেন্ট ম্যাট্রিক্স গ্রিড কম্পোনেন্ট (UserRoleMatrixSelect)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] ডোমেন আইকন, কুইক প্রিসেট বাটন ও কাস্টম সিলেক্টর সহ ৯টি এন্টারপ্রাইজ সিস্টেম রোল গ্রিড।
 */

import React from 'react';
import {
  ShieldAlert,
  Building2,
  CheckCircle2,
  Check,
  Sparkles,
} from 'lucide-react';
import { ENTERPRISE_ROLES, type RoleDefinition } from '../constants/roleConstants';

/**
 * [EN] Properties contract for UserRoleMatrixSelect.
 * [BN] UserRoleMatrixSelect কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface UserRoleMatrixSelectProps {
  /** [EN] Array of selected role codes / [BN] নির্বাচিত রোলের কোডসমূহ */
  readonly selectedRoles: readonly string[];

  /** [EN] Role toggle callback / [BN] একক রোল নির্বাচন পরিবর্তন কলব্যাক */
  readonly onToggleRole: (roleCode: string) => void;

  /** [EN] Batch role replace callback for quick presets / [BN] প্রিসেট রোল প্রতিস্থাপন কলব্যাক */
  readonly onSelectRoles?: (roleCodes: string[]) => void;
}

/**
 * [EN] Domain icon map for 9 standard enterprise roles.
 * [BN] ৯টি স্ট্যান্ডার্ড এন্টারপ্রাইজ রোলের ডোমেন আইকন ম্যাপিং।
 */
const ROLE_ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  ROLE_SUPER_ADMIN: ShieldAlert,
  ROLE_ADMIN: Building2,
  ROLE_USER: CheckCircle2,
};

/**
 * [EN] Quick preset templates for rapid operational role assignment.
 * [BN] দ্রুত রোল নির্বাচনের জন্য স্ট্যান্ডার্ড প্রিসেট টেমপ্লেট।
 */
const PRESETS = [
  {
    label: 'Factory Admin',
    icon: Building2,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'General User',
    icon: CheckCircle2,
    roles: ['ROLE_USER'],
  },
];

/**
 * [EN] 9-Role Selection Matrix Grid with Domain Icons & Presets.
 * [BN] ডোমেন আইকন ও কুইক প্রিসেট সহ ৯টি সিস্টেম রোলের সিলেকশন গ্রিড।
 */
export const UserRoleMatrixSelect: React.FC<UserRoleMatrixSelectProps> = ({
  selectedRoles,
  onToggleRole,
  onSelectRoles,
}) => {
  return (
    <div className="space-y-3.5">
      {/* Quick Presets Toolbar */}
      {onSelectRoles && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-surface-muted/30 border border-border-subtle rounded-[4px]">
          <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1 shrink-0">
            <Sparkles size={12} className="text-brand-accent" />
            <span>Quick Presets:</span>
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onSelectRoles(p.roles)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-primary bg-surface-card hover:bg-surface-hover border border-border-subtle rounded-[3px] shadow-2xs transition-colors cursor-pointer"
            >
              <p.icon size={11} className="text-brand-accent" />
              <span>{p.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onSelectRoles([])}
            className="ml-auto text-[10px] text-text-muted hover:text-status-danger transition-colors cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* 9-Role Interactive Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {ENTERPRISE_ROLES.map((role: RoleDefinition) => {
          const isChecked = selectedRoles.includes(role.code);
          const IconComponent = ROLE_ICON_MAP[role.code] || Building2;

          return (
            <div
              key={role.code}
              onClick={() => onToggleRole(role.code)}
              className={`p-3 rounded-[4px] border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                isChecked
                  ? 'bg-brand-accent-light/40 border-brand-accent/50 shadow-xs ring-1 ring-brand-accent/30'
                  : 'bg-surface-card border-border-subtle hover:bg-surface-muted/50 hover:border-border-default'
              }`}
            >
              {/* Domain Icon Box */}
              <div
                className={`w-7 h-7 rounded-[3px] flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-brand-accent text-white shadow-2xs'
                    : 'bg-surface-muted text-text-muted'
                }`}
              >
                <IconComponent size={14} />
              </div>

              {/* Role Info & Description */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-text-primary truncate">
                    {role.name}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-[2px] flex items-center justify-center border transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-brand-accent border-brand-accent text-white'
                        : 'border-border-subtle bg-surface-base'
                    }`}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted leading-tight mt-1 line-clamp-2">
                  {role.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserRoleMatrixSelect;
