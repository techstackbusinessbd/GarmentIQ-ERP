/**
 * =============================================================================
 * [EN] User Special Permissions Detail Action Header (UserDetailActionHeader.tsx)
 * [BN] ব্যবহারকারী বিশেষ অনুমতি ডিটেল অ্যাকশন হেডার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] নির্বাচিত কর্মীর প্রোফাইল কার্ড, অ্যাসাইন করা রোলস, পারমিশন ওভাররাইড মেট্রিক্স এবং অ্যাকশন বাটনসমূহ।
 */

import React from 'react';
import {
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type { User } from '@/types';
import { Button } from '@/components/ui/Button';

export interface UserDetailActionHeaderProps {
  readonly selectedUser?: User;
  readonly isSuperAdmin: boolean;
  readonly roleBaseCount: number;
  readonly customGrantsCount: number;
  readonly totalCatalogCount: number;
  readonly isDirty: boolean;
  readonly isSaving: boolean;
  readonly onResetToDefaults: () => void;
  readonly onSaveOverrides: () => void;
}

export const UserDetailActionHeader: React.FC<UserDetailActionHeaderProps> = ({
  selectedUser,
  isSuperAdmin,
  roleBaseCount,
  customGrantsCount,
  totalCatalogCount,
  isDirty,
  isSaving,
  onResetToDefaults,
  onSaveOverrides,
}) => {
  if (!selectedUser) {
    return (
      <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs text-xs text-text-muted">
        Select a user from the directory to inspect clearances.
      </div>
    );
  }

  const effectiveCount = isSuperAdmin ? totalCatalogCount : roleBaseCount + customGrantsCount;
  const initial = selectedUser.fullName?.trim() ? selectedUser.fullName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs p-3 space-y-2">
      {/* Sleek Integrated Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[4px] bg-accent/15 text-accent border border-accent/25 flex items-center justify-center font-bold text-xs shrink-0">
            {isSuperAdmin ? <Shield size={14} /> : initial}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs font-bold text-text-primary tracking-tight truncate">
                {selectedUser.fullName || selectedUser.username}
              </h2>
              <span className="text-[11px] font-mono text-text-muted">
                (@{selectedUser.username})
              </span>
              {selectedUser.roles?.map((role) => (
                <span
                  key={role}
                  className="px-1.5 py-0.2 rounded-[3px] text-[9px] font-mono font-semibold bg-surface-muted text-text-muted border border-border-subtle uppercase"
                >
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>

            {/* Inline subtle metrics */}
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted flex-wrap font-mono">
              <span>{roleBaseCount} base</span>
              <span>•</span>
              {customGrantsCount > 0 ? (
                <span className="text-accent font-medium inline-flex items-center gap-1">
                  <Sparkles size={10} />
                  <span>+{customGrantsCount} custom</span>
                </span>
              ) : (
                <span>0 custom</span>
              )}
              <span>•</span>
              <span><strong className="text-accent font-sans">{effectiveCount}/{totalCatalogCount}</strong> total</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<RotateCcw size={11} className="text-text-muted" />}
            disabled={isSuperAdmin || customGrantsCount === 0 || isSaving}
            onClick={onResetToDefaults}
            title="Clear all overrides and restore baseline"
          >
            Revert
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={!isSaving ? <Save size={12} /> : undefined}
            isLoading={isSaving}
            disabled={isSuperAdmin || !isDirty || isSaving}
            onClick={onSaveOverrides}
            title="Save pending clearance overrides"
          >
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Super Admin Notice (Only when superadmin) */}
      {isSuperAdmin && (
        <div className="p-2 rounded-[3px] bg-accent/10 border border-accent/20 flex items-center gap-2 text-[11px] text-accent">
          <ShieldAlert size={13} className="shrink-0" />
          <span>Super Admin has permanent full clearances.</span>
        </div>
      )}
    </div>
  );
};
