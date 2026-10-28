/**
 * =============================================================================
 * [EN] User Matrix Header & Controls Component (UserMatrixHeader.tsx)
 * [BN] ব্যবহারকারী প্রিভিলেজ কন্ট্রোলস ও অ্যাকশন হেডার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] টার্গেট ইউজার নির্বাচন, রোল মেটাডেটা, সেভ ও রিসেট বাটনসমূহ।
 */

import React from 'react';
import {
  User as UserIcon,
  RotateCcw,
  Save,
  PlusCircle,
  MinusCircle,
  ShieldAlert,
} from 'lucide-react';
import type { User } from '@/types';
import { SearchableUserSelect } from './SearchableUserSelect';

export interface UserMatrixHeaderProps {
  readonly users: readonly User[];
  readonly selectedUserId: string;
  readonly onSelectUser: (userId: string) => void;
  readonly isLoadingUsers: boolean;
  readonly selectedUser?: User;
  readonly isSuperAdminUser?: boolean;
  readonly customGrantsCount: number;
  readonly customDenialsCount: number;
  readonly isSaving: boolean;
  readonly onResetToDefaults: () => void;
  readonly onSaveOverrides: () => void;
}

export const UserMatrixHeader: React.FC<UserMatrixHeaderProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  isLoadingUsers,
  selectedUser,
  isSuperAdminUser,
  customGrantsCount,
  customDenialsCount,
  isSaving,
  onResetToDefaults,
  onSaveOverrides,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Target User Combobox */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-muted/60 border border-border-subtle rounded-md shadow-2xs">
            <div className="w-6 h-6 rounded bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
              <UserIcon size={13} />
            </div>
            <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">
              Target User:
            </span>
            <SearchableUserSelect
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={onSelectUser}
              isLoading={isLoadingUsers}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSuperAdminUser || (customGrantsCount === 0 && customDenialsCount === 0)}
            onClick={onResetToDefaults}
            className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-muted/80 hover:bg-surface-card rounded-md border border-border-subtle transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 shadow-2xs"
            title="Clear all overrides and restore role baseline"
          >
            <RotateCcw size={11} className="text-text-muted" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            disabled={isSaving || isSuperAdminUser}
            onClick={onSaveOverrides}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover active:scale-[0.98] rounded-md transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 min-w-[110px] justify-center"
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

      {/* Selected User Metadata Strip */}
      {selectedUser && (
        <div className="pt-2 border-t border-border-subtle/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Assigned Roles:</span>
            <div className="flex flex-wrap gap-1">
              {selectedUser.roles?.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded-[3px] text-[10px] font-semibold bg-surface-muted text-text-primary border border-border-subtle"
                >
                  {r.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-success bg-status-success-bg px-2 py-0.5 rounded-[3px] border border-status-success-border">
              <PlusCircle size={11} /> +{customGrantsCount} Grants
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-danger bg-status-danger-bg px-2 py-0.5 rounded-[3px] border border-status-danger-border">
              <MinusCircle size={11} /> -{customDenialsCount} Denials
            </span>
          </div>
        </div>
      )}

      {/* Super Admin Notice */}
      {isSuperAdminUser && (
        <div className="p-2.5 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center gap-2 text-xs text-brand-accent">
          <ShieldAlert size={14} className="shrink-0" />
          <span>
            <strong>Super Admin Account:</strong> @{selectedUser?.username} retains permanent unrestricted platform authority.
          </span>
        </div>
      )}
    </div>
  );
};
