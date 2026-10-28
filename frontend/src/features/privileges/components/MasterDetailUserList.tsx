/**
 * =============================================================================
 * [EN] Master-Detail User Navigation List (MasterDetailUserList.tsx)
 * [BN] মাস্টার-ডিটেল ইউজার নেভিগেশন তালিকা কম্পোনেন্ট (MasterDetailUserList.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] বামদিকের পরিচ্ছন্ন ইউজার তালিকা, লাইভ সার্চ, রোল ট্যাগ এবং স্পেশাল ওভাররাইড ব্যাজ।
 */

import React, { useState, useMemo } from 'react';
import { Search, Users, Shield } from 'lucide-react';
import type { User } from '@/types';
import { TextInput } from '@/components/ui/TextInput';

export interface MasterDetailUserListProps {
  readonly users: readonly User[];
  readonly selectedUserId: string;
  readonly onSelectUserId: (userId: string) => void;
  readonly userGrantsMap: Record<string, number>;
  readonly dirtyUserIds: ReadonlySet<string>;
  readonly isLoading?: boolean;
}

export const MasterDetailUserList: React.FC<MasterDetailUserListProps> = ({
  users,
  selectedUserId,
  onSelectUserId,
  userGrantsMap,
  dirtyUserIds,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const matchName = u.fullName?.toLowerCase().includes(q);
      const matchUsername = u.username?.toLowerCase().includes(q);
      const matchCard = u.employeeCardNo?.toLowerCase().includes(q);
      const matchRole = u.roles?.some((r) => r.toLowerCase().includes(q));
      return matchName || matchUsername || matchCard || matchRole;
    });
  }, [users, searchQuery]);

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs overflow-hidden flex flex-col h-full min-h-[560px]">
      {/* Header & Search Bar */}
      <div className="p-3 border-b border-border-subtle space-y-2 bg-surface-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-brand-accent" />
            <span className="text-xs font-bold text-text-primary tracking-tight">
              Accounts
            </span>
          </div>
          <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.2 bg-surface-muted rounded border border-border-subtle">
            {users.length}
          </span>
        </div>

        <div>
          <TextInput
            leftIcon={<Search size={13} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* Users Scrollable List */}
      <div className="overflow-y-auto flex-1 p-1 space-y-0.5 scrollbar-thin">
        {isLoading && users.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            Loading...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            No accounts found.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = user.id === selectedUserId;
            const isSuperAdmin = user.username === 'superadmin' || user.roles?.includes('ROLE_SUPER_ADMIN');
            const grantCount = userGrantsMap[user.id] || 0;
            const hasOverrides = grantCount > 0;
            const isDirty = dirtyUserIds.has(user.id);
            const initial = user.fullName?.trim() ? user.fullName.trim().charAt(0).toUpperCase() : 'U';
            const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0]?.replace('ROLE_', '') : null;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => onSelectUserId(user.id)}
                className={`w-full text-left px-2.5 py-2 rounded-[4px] transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-brand-accent/10 border-brand-accent/40 shadow-2xs text-text-primary'
                    : 'bg-transparent hover:bg-surface-muted/60 border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-brand-accent text-white shadow-2xs'
                        : 'bg-surface-muted text-text-secondary border border-border-subtle/60'
                    }`}
                  >
                    {isSuperAdmin ? <Shield size={12} /> : initial}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-text-primary font-bold' : ''}`}>
                        {user.fullName || user.username}
                      </span>
                      {isDirty && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" title="Unsaved changes" />
                      )}
                      {primaryRole && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-surface-muted text-text-muted border border-border-subtle/50 uppercase shrink-0">
                          {primaryRole}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-text-muted font-mono truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="shrink-0">
                  {isSuperAdmin ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      Root
                    </span>
                  ) : hasOverrides ? (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      +{grantCount}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
