/**
 * =============================================================================
 * [EN] User Special Permissions Detail Action Header (UserDetailActionHeader.tsx)
 * [BN] ব্যবহারকারী বিশেষ অনুমতি ডিটেল অ্যাকশন হেডার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28 (1-word), Rule 29 (Minimal Text)
 * [BN] সার্চেবল ইউজার কম্বোবক্স, ক্লিয়ারেন্স চিপ ও সেভ টুলবার একীভূত হেডার (মিনিমাল মাইক্রোকপি)।
 */

import React from 'react';
import { RotateCcw, Save, Ban } from 'lucide-react';
import type { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchableUserSelect } from './SearchableUserSelect';

export interface UserDetailActionHeaderProps {
  readonly users: readonly User[];
  readonly selectedUserId: string;
  readonly onSelectUserId: (userId: string) => void;
  readonly selectedUser?: User;
  readonly isSuperAdmin: boolean;
  readonly roleBaseCount: number;
  readonly customGrantsCount: number;
  readonly totalCatalogCount: number;
  readonly isDirty: boolean;
  readonly dirtyUserIds?: ReadonlySet<string>;
  readonly modifiedCount: number;
  readonly isSaving: boolean;
  readonly userGrantsMap?: Record<string, number>;
  readonly onResetToDefaults: () => void;
  readonly onClearOverrides: () => void;
  readonly onDiscard: () => void;
  readonly onSaveOverrides: () => void;
}

export const UserDetailActionHeader: React.FC<UserDetailActionHeaderProps> = ({
  users,
  selectedUserId,
  onSelectUserId,
  selectedUser,
  isSuperAdmin,
  roleBaseCount,
  customGrantsCount,
  totalCatalogCount,
  isDirty,
  dirtyUserIds,
  modifiedCount,
  isSaving,
  userGrantsMap,
  onResetToDefaults,
  onClearOverrides,
  onDiscard,
  onSaveOverrides,
}) => {
  if (!selectedUser) return null;

  const effectiveCount = isSuperAdmin ? totalCatalogCount : roleBaseCount + customGrantsCount;
  const primaryRole = selectedUser.roles && selectedUser.roles.length > 0
    ? selectedUser.roles[0]?.replace('ROLE_', '')
    : 'USER';

  return (
    <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs space-y-2.5">
      {/* Top Row: Searchable User Combobox Dropdown & Action CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase text-text-muted">
            User:
          </span>

          <SearchableUserSelect
            users={users}
            selectedUserId={selectedUserId}
            onSelectUserId={onSelectUserId}
            dirtyUserIds={dirtyUserIds}
            userGrantsMap={userGrantsMap}
          />

          <Badge variant="accent">
            {primaryRole}
          </Badge>

          {customGrantsCount > 0 && (
            <Badge variant="info">
              +{customGrantsCount} Custom
            </Badge>
          )}

          {isDirty && (
            <Badge variant="warning" dot>
              {modifiedCount} Modified
            </Badge>
          )}
        </div>

        {/* Action CTAs using standard Button component */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {isDirty && (
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw size={13} />}
              onClick={onDiscard}
              disabled={isSaving}
            >
              Discard
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Save size={13} />}
            isLoading={isSaving}
            disabled={!isDirty || isSaving || isSuperAdmin}
            onClick={onSaveOverrides}
          >
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Bottom Row: Quick Presets & Coverage Bar (Ultra-Minimal) */}
      <div className="pt-2 border-t border-border-subtle/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="text-[11px] font-medium text-text-muted">Clearance:</span>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-accent/10 border border-accent/20">
            <span className="font-bold text-accent font-sans tabular-nums text-xs">
              {effectiveCount}
            </span>
            <span className="text-[10px] text-text-muted font-sans px-0.5">of</span>
            <span className="font-medium text-text-secondary font-sans tabular-nums text-xs">
              {totalCatalogCount}
            </span>
            <span className="text-[10px] text-text-muted font-mono ml-0.5">
              ({Math.round((effectiveCount / (totalCatalogCount || 1)) * 100)}%)
            </span>
          </div>

          <span className="text-[10px] font-mono text-text-muted ml-1">
            ({roleBaseCount} Base • {customGrantsCount} Custom)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-text-muted uppercase font-bold mr-0.5">
            Presets:
          </span>

          <Button
            variant="outline"
            size="xs"
            icon={<RotateCcw size={10} className="text-text-muted" />}
            onClick={onResetToDefaults}
            disabled={isSuperAdmin || customGrantsCount === 0}
          >
            Defaults
          </Button>

          <Button
            variant="outline"
            size="xs"
            icon={<Ban size={10} className="text-danger" />}
            onClick={onClearOverrides}
            disabled={isSuperAdmin || customGrantsCount === 0}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailActionHeader;
