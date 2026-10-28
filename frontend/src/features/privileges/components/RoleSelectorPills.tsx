/**
 * =============================================================================
 * [EN] Role Selector Pills Component (RoleSelectorPills.tsx)
 * [BN] রোল নির্বাচন পিল স্ট্রিপ কম্পোনেন্ট (RoleSelectorPills.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ১-ক্লিকে টার্গেট রোল নির্বাচনের জন্য প্রিমিয়াম হরিজন্টাল স্ক্রোলযোগ্য পিল স্ট্রিপ।
 */

import React from 'react';
import { Shield, Lock } from 'lucide-react';
import type { BackendRoleDto } from '../services/roleService';

export interface RoleSelectorPillsProps {
  readonly roles: readonly BackendRoleDto[];
  readonly selectedRoleCode: string;
  readonly onSelectRoleCode: (roleCode: string) => void;
  readonly rolePermissionsMap: Record<string, string[]>;
  readonly totalCatalogCount: number;
  readonly dirtyRoleCodes: ReadonlySet<string>;
}

export const RoleSelectorPills: React.FC<RoleSelectorPillsProps> = ({
  roles,
  selectedRoleCode,
  onSelectRoleCode,
  rolePermissionsMap,
  totalCatalogCount,
  dirtyRoleCodes,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-border-subtle">
        {roles.map((role) => {
          const isSelected = role.roleCode === selectedRoleCode;
          const isSuperAdmin = role.roleCode === 'ROLE_SUPER_ADMIN';
          const perms = rolePermissionsMap[role.roleCode] || [];
          const grantedCount = isSuperAdmin ? totalCatalogCount : perms.length;
          const isDirty = dirtyRoleCodes.has(role.roleCode);
          const isFull = totalCatalogCount > 0 && grantedCount >= totalCatalogCount;

          return (
            <button
              key={role.roleCode}
              type="button"
              onClick={() => onSelectRoleCode(role.roleCode)}
              className={`group shrink-0 px-3 py-2 rounded-lg text-left transition-all flex items-center gap-2.5 cursor-pointer border relative ${
                isSelected
                  ? 'bg-surface-card border-brand-accent shadow-xs ring-1 ring-brand-accent/20'
                  : 'bg-surface-card/60 hover:bg-surface-card border-border-subtle hover:border-border-muted shadow-2xs'
              }`}
            >
              {/* Role Icon Avatar */}
              <div
                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-brand-accent text-white'
                    : 'bg-surface-muted text-text-muted group-hover:text-text-primary'
                }`}
              >
                {isSuperAdmin ? <Lock size={12} /> : <Shield size={12} />}
              </div>

              {/* Role Title & Code */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold truncate max-w-[140px] ${
                      isSelected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  >
                    {role.roleName}
                  </span>
                  {isDirty && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"
                      title="Role has unsaved changes"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono text-text-muted">
                    {role.roleCode.replace('ROLE_', '')}
                  </span>
                  <span className="text-border-subtle text-[9px]">•</span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-1 py-0.2 rounded ${
                      isFull
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : grantedCount > 0
                        ? 'bg-brand-accent/10 text-brand-accent'
                        : 'bg-surface-muted text-text-muted'
                    }`}
                  >
                    {grantedCount}/{totalCatalogCount}
                  </span>
                </div>
              </div>

              {/* Bottom selection accent line */}
              {isSelected && (
                <div className="absolute -bottom-px left-2 right-2 h-0.5 bg-brand-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
