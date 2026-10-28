/**
 * =============================================================================
 * [EN] Searchable User Select Dropdown Combobox (SearchableUserSelect.tsx)
 * [BN] সার্চেবল ইউজার সিলেক্ট কম্বোবক্স ড্রপডাউন (SearchableUserSelect.tsx)
 * =============================================================================
 * [EN] Fast fuzzy/prefix live search by name, @username, card ID, or email.
 * [BN] নাম, ইউজারনেম, পাঞ্চ কার্ড আইডি বা ইমেইল দিয়ে তাৎক্ষণিক কর্মী খোঁজার ফিল্টার।
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Shield, RefreshCw } from 'lucide-react';
import type { User } from '@/types';

export interface SearchableUserSelectProps {
  users: readonly User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  isLoading?: boolean;
}

export const SearchableUserSelect: React.FC<SearchableUserSelectProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId), [users, selectedUserId]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto focus search input when opened
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const matchName = u.fullName?.toLowerCase().includes(q);
      const matchUsername = u.username?.toLowerCase().includes(q);
      const matchCard = u.employeeCardNo?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchRoles = u.roles?.some((r) => r.toLowerCase().includes(q));
      return matchName || matchUsername || matchCard || matchEmail || matchRoles;
    });
  }, [users, searchQuery]);

  const handleSelect = (user: User) => {
    onSelectUser(user.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={isLoading || users.length === 0}
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 text-xs font-medium bg-surface-base hover:bg-surface-muted/60 border border-border-subtle hover:border-brand-accent/50 rounded-[4px] text-text-primary flex items-center justify-between gap-2.5 transition-all shadow-2xs cursor-pointer min-w-[260px] max-w-[340px] focus:outline-none focus:border-brand-accent"
        title="Click to search and select target user"
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5 text-text-muted">
            <RefreshCw size={12} className="animate-spin text-brand-accent" />
            <span>Loading user directory...</span>
          </div>
        ) : selectedUser ? (
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded-full bg-brand-accent/15 text-brand-accent font-bold text-[10px] flex items-center justify-center shrink-0">
              {selectedUser.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate text-left leading-tight">
              <span className="font-semibold text-text-primary mr-1.5">{selectedUser.fullName}</span>
              <span className="font-mono text-[10px] text-text-muted">(@{selectedUser.username})</span>
              {selectedUser.employeeCardNo && (
                <span className="ml-1.5 px-1 py-0.2 bg-brand-accent/10 text-brand-accent font-mono text-[9px] rounded font-bold">
                  {selectedUser.employeeCardNo}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-text-muted">Select user...</span>
        )}
        <ChevronDown size={13} className={`text-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-surface-card border border-border-subtle rounded-[6px] shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2.5 bg-surface-muted/50 border-b border-border-subtle flex items-center gap-2">
            <Search size={13} className="text-brand-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, @username, card ID..."
              className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Results Count & Quick Help */}
          <div className="px-3 py-1 bg-surface-muted/30 border-b border-border-subtle/50 text-[10px] text-text-muted flex items-center justify-between">
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
            {searchQuery && (
              <span className="font-medium text-brand-accent">Filtering active</span>
            )}
          </div>

          {/* User Results List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle/50">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-muted">
                No users found matching &ldquo;<span className="text-text-primary font-semibold">{searchQuery}</span>&rdquo;
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                const isSuper = user.username === 'superadmin' || user.roles?.includes('ROLE_SUPER_ADMIN');

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className={`w-full p-2.5 text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-brand-accent/10 text-text-primary'
                        : 'hover:bg-surface-hover/80 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-brand-accent text-white shadow-2xs'
                            : 'bg-surface-muted text-brand-accent border border-border-subtle'
                        }`}
                      >
                        {user.fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-xs text-text-primary truncate">{user.fullName}</span>
                          <span className="font-mono text-[10px] text-text-muted truncate">@{user.username}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                          {user.employeeCardNo && (
                            <span className="px-1.5 py-0.2 rounded bg-surface-muted text-brand-accent font-mono font-bold border border-border-subtle/60">
                              ID: {user.employeeCardNo}
                            </span>
                          )}
                          {isSuper ? (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 font-semibold border border-amber-300/40 flex items-center gap-0.5">
                              <Shield size={9} /> Super Admin
                            </span>
                          ) : (
                            <span className="text-text-muted truncate">
                              {user.roles?.map((r) => r.replace('ROLE_', '')).join(', ') || 'No Role'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 text-brand-accent">
                        <Check size={14} strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
