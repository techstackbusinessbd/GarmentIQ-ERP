/**
 * =============================================================================
 * [EN] Premium Role Matrix Command Bar Toolbar (RoleMatrixToolbar.tsx)
 * [BN] প্রিমিয়াম রোল ম্যাট্রিক্স কমান্ড বার টুলবার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise UI), Rule 20 (Tokens)
 * [BN] টার্গেট রোল সিলেক্টর, কুইক প্রিভিলেজ ক্লাস্টার এবং প্রাইমারি সেভ অ্যাকশন।
 */

import React from 'react';
import { Shield, Eye, ShieldCheck, Ban, RotateCcw, Save, ChevronDown } from 'lucide-react';
import type { BackendRoleDto } from '../services/roleService';

export interface RoleMatrixToolbarProps {
  readonly roles: readonly BackendRoleDto[];
  readonly selectedRoleCode: string;
  readonly onSelectRoleCode: (code: string) => void;
  readonly isSuperAdminRole: boolean;
  readonly isSaving: boolean;
  readonly onReadOnly: () => void;
  readonly onFullAccess: () => void;
  readonly onClearAll: () => void;
  readonly onResetDefaults: () => void;
  readonly onSaveMatrix: () => void;
}

export const RoleMatrixToolbar: React.FC<RoleMatrixToolbarProps> = ({
  roles,
  selectedRoleCode,
  onSelectRoleCode,
  isSuperAdminRole,
  isSaving,
  onReadOnly,
  onFullAccess,
  onClearAll,
  onResetDefaults,
  onSaveMatrix,
}) => {
  const activeRole = roles.find((r) => r.roleCode === selectedRoleCode);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Target Role Selector Block */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-muted/60 border border-border-subtle rounded-md shadow-2xs">
          <div className="w-6 h-6 rounded bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
            <Shield size={13} />
          </div>
          <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">
            Target Role:
          </span>

          <div className="relative">
            <select
              value={selectedRoleCode}
              onChange={(e) => onSelectRoleCode(e.target.value)}
              className="appearance-none pl-2 pr-7 py-1 text-xs font-bold text-text-primary bg-surface-card hover:bg-surface-muted border border-border-subtle rounded text-left focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer transition-colors shadow-2xs"
            >
              {roles.map((r) => (
                <option key={r.roleCode} value={r.roleCode} className="text-text-primary bg-surface-card">
                  {r.roleName} ({r.roleCode})
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {activeRole && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
              {activeRole.roleCode}
            </span>
          )}
        </div>
      </div>

      {/* Preset Action Cluster & Save CTA */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
        {/* Preset Button Strip */}
        <div className="inline-flex items-center p-0.5 bg-surface-muted/80 border border-border-subtle rounded-md shadow-2xs">
          <button
            type="button"
            disabled={isSuperAdminRole}
            onClick={onReadOnly}
            className="px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Set all visible modules to View Only"
          >
            <Eye size={12} className="text-sky-600 dark:text-sky-400" />
            <span>View</span>
          </button>

          <span className="h-3.5 w-px bg-border-subtle/80" />

          <button
            type="button"
            disabled={isSuperAdminRole}
            onClick={onFullAccess}
            className="px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Grant full permissions across all modules"
          >
            <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Full</span>
          </button>

          <span className="h-3.5 w-px bg-border-subtle/80" />

          <button
            type="button"
            disabled={isSuperAdminRole}
            onClick={onResetDefaults}
            className="px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-card rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Reload baseline role defaults from PostgreSQL"
          >
            <RotateCcw size={11} className="text-text-muted" />
            <span>Defaults</span>
          </button>

          <span className="h-3.5 w-px bg-border-subtle/80" />

          <button
            type="button"
            disabled={isSuperAdminRole}
            onClick={onClearAll}
            className="px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-status-danger hover:bg-status-danger-bg rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Clear all permissions"
          >
            <Ban size={11} className="text-status-danger" />
            <span>Clear</span>
          </button>
        </div>

        {/* Primary Save Action */}
        <button
          type="button"
          disabled={isSaving || isSuperAdminRole}
          onClick={onSaveMatrix}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover active:scale-[0.98] rounded-md transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 min-w-[105px] justify-center"
        >
          {isSaving ? (
            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={13} />
          )}
          <span>{isSaving ? 'Saving' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};
