/**
 * =============================================================================
 * [EN] Master-Detail Role Navigation List (MasterDetailRoleList.tsx)
 * [BN] মাস্টার-ডিটেল রোল নেভিগেশন তালিকা কম্পোনেন্ট (MasterDetailRoleList.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] বামদিকের পরিচ্ছন্ন রোল তালিকা, সার্চ ফিল্টার এবং লাইভ পারমিশন কাউন্ট ব্যাজ।
 */

import React, { useState, useMemo } from 'react';
import { Search, Shield, Lock, CheckCircle2 } from 'lucide-react';
import type { BackendRoleDto } from '../services/roleService';
import { TextInput } from '@/components/ui/TextInput';
import { Badge } from '@/components/ui/Badge';

export interface MasterDetailRoleListProps {
  readonly roles: readonly BackendRoleDto[];
  readonly selectedRoleCode: string;
  readonly onSelectRoleCode: (roleCode: string) => void;
  readonly rolePermissionsMap: Record<string, string[]>;
  readonly totalCatalogCount: number;
  readonly dirtyRoleCodes: ReadonlySet<string>;
}

export const MasterDetailRoleList: React.FC<MasterDetailRoleListProps> = ({
  roles,
  selectedRoleCode,
  onSelectRoleCode,
  rolePermissionsMap,
  totalCatalogCount,
  dirtyRoleCodes,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.roleName.toLowerCase().includes(q) ||
        r.roleCode.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs overflow-hidden flex flex-col h-full min-h-[520px]">
      {/* Header & Search Bar */}
      <div className="p-3 border-b border-border-subtle space-y-2.5 bg-surface-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <Shield size={13} />
            </div>
            <span className="text-xs font-bold text-text-primary tracking-tight">
              Factory Roles
            </span>
          </div>
          <Badge variant="neutral">
            {roles.length} Roles
          </Badge>
        </div>

        <div>
          <TextInput
            leftIcon={<Search size={13} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by name..."
          />
        </div>
      </div>

      {/* Roles List */}
      <div className="divide-y divide-border-subtle/60 overflow-y-auto flex-1 p-1.5 space-y-1 scrollbar-thin">
        {filteredRoles.map((role) => {
          const isSelected = role.roleCode === selectedRoleCode;
          const isSuperAdmin = role.roleCode === 'ROLE_SUPER_ADMIN';
          const perms = rolePermissionsMap[role.roleCode] || [];
          const grantedCount = isSuperAdmin ? totalCatalogCount : perms.length;
          const isFull = totalCatalogCount > 0 && grantedCount >= totalCatalogCount;
          const isDirty = dirtyRoleCodes.has(role.roleCode);

          return (
            <button
              key={role.roleCode}
              type="button"
              onClick={() => onSelectRoleCode(role.roleCode)}
              className={`w-full text-left p-2.5 rounded-[4px] transition-all flex items-center justify-between gap-2.5 cursor-pointer border ${
                isSelected
                  ? 'bg-brand-accent/5 border-brand-accent/40 shadow-xs'
                  : 'bg-surface-card hover:bg-surface-muted/50 border-transparent hover:border-border-subtle'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-accent text-white shadow-2xs'
                      : 'bg-surface-muted text-text-muted'
                  }`}
                >
                  {isSuperAdmin ? <Lock size={13} /> : <Shield size={13} />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isSelected ? 'text-brand-accent font-extrabold' : 'text-text-primary'
                      }`}
                    >
                      {role.roleName}
                    </span>
                    {isDirty && (
                      <span
                        className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"
                        title="Unsaved changes"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted block truncate mt-0.5">
                    {role.roleCode.replace('ROLE_', '')}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 text-right">
                {isSuperAdmin ? (
                  <Badge variant="danger">
                    Full Root
                  </Badge>
                ) : (
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 ${
                      isFull
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : grantedCount > 0
                        ? 'bg-surface-muted text-text-secondary border border-border-subtle'
                        : 'bg-surface-muted text-text-muted/60'
                    }`}
                  >
                    {isFull && <CheckCircle2 size={10} className="text-emerald-600" />}
                    <span>{grantedCount}/{totalCatalogCount}</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {filteredRoles.length === 0 && (
          <div className="p-6 text-center text-xs text-text-muted">
            No roles matching &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
};
