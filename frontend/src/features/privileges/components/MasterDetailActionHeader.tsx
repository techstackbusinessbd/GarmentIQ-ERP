/**
 * =============================================================================
 * [EN] Master-Detail Header & Save Toolbar (MasterDetailActionHeader.tsx)
 * [BN] মাস্টার-ডিটেল হেডার ও সেভ টুলবার কম্পোনেন্ট (MasterDetailActionHeader.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] সার্চেবল কম্বোবক্স ড্রপডাউন, ক্লিয়ারেন্স ও প্রিসেটস একীভূত হেডার (মিনিমাল মাইক্রোকপি)।
 */

import React from 'react';
import { RotateCcw, Save, Sparkles, Eye, Ban } from 'lucide-react';
import type { BackendRoleDto } from '../services/roleService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchableRoleSelect } from './SearchableRoleSelect';

export interface MasterDetailActionHeaderProps {
  readonly roles: readonly BackendRoleDto[];
  readonly selectedRoleCode: string;
  readonly onSelectRoleCode: (roleCode: string) => void;
  readonly role?: BackendRoleDto;
  readonly grantedCount: number;
  readonly totalCatalogCount: number;
  readonly isSuperAdmin: boolean;
  readonly isDirty: boolean;
  readonly dirtyRoleCodes?: ReadonlySet<string>;
  readonly modifiedCount: number;
  readonly isSaving: boolean;
  readonly onReadOnly: () => void;
  readonly onFullAccess: () => void;
  readonly onResetDefaults: () => void;
  readonly onClearAll: () => void;
  readonly onDiscard: () => void;
  readonly onSave: () => void;
}

export const MasterDetailActionHeader: React.FC<MasterDetailActionHeaderProps> = ({
  roles,
  selectedRoleCode,
  onSelectRoleCode,
  role,
  grantedCount,
  totalCatalogCount,
  isSuperAdmin,
  isDirty,
  dirtyRoleCodes,
  modifiedCount,
  isSaving,
  onReadOnly,
  onFullAccess,
  onResetDefaults,
  onClearAll,
  onDiscard,
  onSave,
}) => {
  if (!role) return null;

  return (
    <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs space-y-2.5">
      {/* Top Row: Searchable Role Combobox Dropdown & Action CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase text-text-muted">
            Role:
          </span>

          <SearchableRoleSelect
            roles={roles}
            selectedRoleCode={selectedRoleCode}
            onSelectRoleCode={onSelectRoleCode}
            dirtyRoleCodes={dirtyRoleCodes}
          />

          <Badge variant="accent">
            {role.roleCode}
          </Badge>

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
            onClick={onSave}
          >
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Bottom Row: Quick Presets & Coverage Bar (Ultra-Minimal) */}
      <div className="pt-2 border-t border-border-subtle/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
          <span>Clearance:</span>
          <span className="font-bold text-text-primary">
            {grantedCount}/{totalCatalogCount}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-text-muted uppercase font-bold mr-0.5">
            Presets:
          </span>
          <Button
            variant="outline"
            size="xs"
            icon={<Eye size={11} className="text-sky-600" />}
            onClick={onReadOnly}
            disabled={isSuperAdmin}
          >
            View
          </Button>

          <Button
            variant="outline"
            size="xs"
            icon={<Sparkles size={11} className="text-emerald-600" />}
            onClick={onFullAccess}
            disabled={isSuperAdmin}
          >
            Full
          </Button>

          <Button
            variant="outline"
            size="xs"
            icon={<RotateCcw size={10} className="text-text-muted" />}
            onClick={onResetDefaults}
            disabled={isSuperAdmin}
          >
            Defaults
          </Button>

          <Button
            variant="outline"
            size="xs"
            icon={<Ban size={10} className="text-rose-500" />}
            onClick={onClearAll}
            disabled={isSuperAdmin}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
