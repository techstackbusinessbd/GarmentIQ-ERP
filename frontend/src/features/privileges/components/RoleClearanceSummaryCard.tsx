/**
 * =============================================================================
 * [EN] Role Clearance Summary & Presets Card (RoleClearanceSummaryCard.tsx)
 * [BN] রোল ক্লিয়ারেন্স সামারি ও প্রিসেট কার্ড কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] নির্বাচিত রোলের বিবরণ, পারমিশন কভারেজ প্রগ্রেস বার এবং কুইক প্রিসেট বাটন স্ট্রিপ।
 */

import React from 'react';
import { ShieldCheck, Eye, RotateCcw, Ban, Sparkles, Lock, ShieldAlert } from 'lucide-react';
import type { BackendRoleDto } from '../services/roleService';

export interface RoleClearanceSummaryCardProps {
  readonly role?: BackendRoleDto;
  readonly grantedCount: number;
  readonly totalCatalogCount: number;
  readonly isSuperAdmin: boolean;
  readonly onReadOnly: () => void;
  readonly onFullAccess: () => void;
  readonly onResetDefaults: () => void;
  readonly onClearAll: () => void;
}

export const RoleClearanceSummaryCard: React.FC<RoleClearanceSummaryCardProps> = ({
  role,
  grantedCount,
  totalCatalogCount,
  isSuperAdmin,
  onReadOnly,
  onFullAccess,
  onResetDefaults,
  onClearAll,
}) => {
  if (!role) return null;

  const percentage = totalCatalogCount > 0
    ? Math.round((grantedCount / totalCatalogCount) * 100)
    : 0;

  return (
    <div className="p-4 bg-surface-card border border-border-subtle rounded-lg shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Role Identity & Context */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
            {isSuperAdmin ? <Lock size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-text-primary">
                {role.roleName}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                {role.roleCode}
              </span>
              {isSuperAdmin && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1">
                  <ShieldAlert size={10} />
                  <span>Immutable System Root</span>
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {role.description || 'Configured operational role for factory departments and workstations.'}
            </p>
          </div>
        </div>

        {/* Quick Presets Cluster */}
        <div className="flex items-center gap-1.5 flex-wrap self-start lg:self-center">
          <span className="text-[10px] font-mono text-text-muted uppercase font-bold mr-1 hidden sm:inline">
            Presets:
          </span>
          <button
            type="button"
            disabled={isSuperAdmin}
            onClick={onReadOnly}
            className="px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface-muted/80 hover:bg-surface-muted border border-border-subtle rounded-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Grant View Only permissions with sidebar menus"
          >
            <Eye size={12} className="text-sky-600 dark:text-sky-400" />
            <span>View</span>
          </button>

          <button
            type="button"
            disabled={isSuperAdmin}
            onClick={onFullAccess}
            className="px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface-muted/80 hover:bg-surface-muted border border-border-subtle rounded-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Grant all permissions across all factory domains"
          >
            <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Full</span>
          </button>

          <button
            type="button"
            disabled={isSuperAdmin}
            onClick={onResetDefaults}
            className="px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface-muted/80 hover:bg-surface-muted border border-border-subtle rounded-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Reload baseline defaults from database"
          >
            <RotateCcw size={11} className="text-text-muted" />
            <span>Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSuperAdmin}
            onClick={onClearAll}
            className="px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-rose-600 bg-surface-muted/80 hover:bg-rose-500/10 border border-border-subtle rounded-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Clear all permissions for this role"
          >
            <Ban size={11} className="text-rose-500" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Clearance Progress Meter */}
      <div className="pt-2 border-t border-border-subtle/70">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[11px] font-medium text-text-muted flex items-center gap-1.5">
            <span>Overall Clearance Coverage:</span>
            <span className="font-bold text-text-primary font-mono">
              {grantedCount} of {totalCatalogCount} Actions Enabled
            </span>
          </span>
          <span className="text-xs font-bold font-mono text-brand-accent">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              percentage === 100
                ? 'bg-emerald-500'
                : percentage > 40
                ? 'bg-brand-accent'
                : 'bg-amber-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Super Admin Notice */}
      {isSuperAdmin && (
        <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <Lock size={14} className="shrink-0" />
          <span>
            <strong>Super Admin Root Protection:</strong> Super Administrator permissions are managed by system security policy and automatically bypass all access gates.
          </span>
        </div>
      )}
    </div>
  );
};
