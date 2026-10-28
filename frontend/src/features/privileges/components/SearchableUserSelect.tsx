/**
 * =============================================================================
 * [EN] Searchable User Select Combobox Dropdown (SearchableUserSelect.tsx)
 * [BN] সার্চেবল ইউজার সিলেক্ট কম্বোবক্স ড্রপডাউন (SearchableUserSelect.tsx)
 * =============================================================================
 * [EN] Fast live searchable user combobox for enterprise RBAC special permissions
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] নাম বা ইউজারনেম দিয়ে রিয়েল-টাইমে ফ্যাক্টরি ইউজার নির্বাচন করার ইন্টারেক্টিভ কম্বোবক্স।
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, User as UserIcon, Shield, Sparkles, Loader2 } from 'lucide-react';
import type { User } from '@/types';

export interface SearchableUserSelectProps {
  readonly users: readonly User[];
  readonly selectedUserId: string;
  readonly onSelectUserId?: (userId: string) => void;
  readonly onSelectUser?: (userId: string) => void;
  readonly dirtyUserIds?: ReadonlySet<string>;
  readonly userGrantsMap?: Record<string, number>;
  readonly isLoading?: boolean;
}

export const SearchableUserSelect: React.FC<SearchableUserSelectProps> = ({
  users,
  selectedUserId,
  onSelectUserId,
  onSelectUser,
  dirtyUserIds,
  userGrantsMap,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId]
  );

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Live filtered users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        u.username.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.employeeCardNo && u.employeeCardNo.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const handleSelect = (userId: string) => {
    onSelectUserId?.(userId);
    onSelectUser?.(userId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const isCurrentSuper =
    selectedUser?.username === 'superadmin' ||
    selectedUser?.roles?.includes('ROLE_SUPER_ADMIN');

  const customCount = selectedUser ? userGrantsMap?.[selectedUser.id] || 0 : 0;
  const isSelectedDirty = selectedUser ? dirtyUserIds?.has(selectedUser.id) : false;

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8 px-2.5 text-xs font-semibold bg-surface-base hover:bg-surface-muted border border-border-subtle hover:border-accent/50 rounded-[4px] text-text-primary inline-flex items-center justify-between gap-2 transition-all shadow-2xs cursor-pointer min-w-[210px] max-w-[320px] focus:outline-none focus:border-accent disabled:opacity-60"
        title="Search and select system user"
      >
        <div className="flex items-center gap-1.5 truncate">
          <div className="text-accent shrink-0">
            {isLoading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : isCurrentSuper ? (
              <Shield size={13} />
            ) : (
              <UserIcon size={13} />
            )}
          </div>
          <span className="font-bold text-text-primary truncate">
            {selectedUser ? selectedUser.fullName || selectedUser.username : 'Select user...'}
          </span>
          {selectedUser && (
            <span className="text-[10px] font-mono text-text-muted truncate">
              (@{selectedUser.username})
            </span>
          )}
          {customCount > 0 && (
            <span className="px-1 py-0.2 rounded text-[9px] font-mono font-semibold bg-accent/15 text-accent border border-accent/25 shrink-0">
              +{customCount}
            </span>
          )}
          {isSelectedDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Unsaved changes" />
          )}
        </div>
        <ChevronDown
          size={13}
          className={`text-text-muted shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-accent' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-80 bg-surface-card border border-border-subtle rounded-[4px] shadow-lg z-50 overflow-hidden animate-in fade-in duration-150">
          {/* Search Input Box */}
          <div className="p-2 border-b border-border-subtle/80 bg-surface-muted/40 flex items-center gap-1.5">
            <Search size={13} className="text-text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name or username..."
              className="w-full text-xs bg-transparent border-none text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-text-muted hover:text-text-primary cursor-pointer p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* User List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle/30 scrollbar-thin">
            {filteredUsers.map((user) => {
              const isSelected = user.id === selectedUserId;
              const grantsCount = userGrantsMap?.[user.id] || 0;
              const isDirty = dirtyUserIds?.has(user.id);
              const isSuper =
                user.username === 'superadmin' || user.roles?.includes('ROLE_SUPER_ADMIN');

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user.id)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'hover:bg-surface-hover text-text-primary'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-[3px] bg-surface-muted flex items-center justify-center text-text-muted shrink-0">
                      {isSuper ? <Shield size={11} className="text-accent" /> : <UserIcon size={11} />}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium truncate">
                          {user.fullName || user.username}
                        </span>
                        {isDirty && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                        <span>@{user.username}</span>
                        {user.roles && user.roles.length > 0 && (
                          <span className="text-text-secondary">
                            • {user.roles[0]?.replace('ROLE_', '')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {grantsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-accent/15 text-accent border border-accent/25 inline-flex items-center gap-0.5">
                        <Sparkles size={8} />
                        +{grantsCount}
                      </span>
                    )}
                    {isSelected && <Check size={14} className="text-accent" />}
                  </div>
                </button>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="p-4 text-center text-xs text-text-muted">
                No users found matching query.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
