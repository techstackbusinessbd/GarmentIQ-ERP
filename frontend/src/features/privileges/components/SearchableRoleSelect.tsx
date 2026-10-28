/**
 * =============================================================================
 * [EN] Searchable Role Select Combobox Dropdown (SearchableRoleSelect.tsx)
 * [BN] সার্চেবল রোল সিলেক্ট কম্বোবক্স ড্রপডাউন (SearchableRoleSelect.tsx)
 * =============================================================================
 * [EN] Fast live searchable role combobox for enterprise RBAC administration
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] কিওয়ার্ড দিয়ে রিয়েল-টাইমে যেকোনো ফ্যাক্টরি রোল খোঁজা ও সিলেক্ট করার ইন্টারেক্টিভ কম্বোবক্স।
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Shield, Lock } from 'lucide-react';
import type { BackendRoleDto } from '../services/roleService';

export interface SearchableRoleSelectProps {
  readonly roles: readonly BackendRoleDto[];
  readonly selectedRoleCode: string;
  readonly onSelectRoleCode: (roleCode: string) => void;
  readonly dirtyRoleCodes?: ReadonlySet<string>;
}

export const SearchableRoleSelect: React.FC<SearchableRoleSelectProps> = ({
  roles,
  selectedRoleCode,
  onSelectRoleCode,
  dirtyRoleCodes,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedRole = useMemo(
    () => roles.find((r) => r.roleCode === selectedRoleCode),
    [roles, selectedRoleCode]
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

  // Live filtered roles
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

  const handleSelect = (roleCode: string) => {
    onSelectRoleCode(roleCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const isCurrentSuper = selectedRoleCode === 'ROLE_SUPER_ADMIN';

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8 px-2.5 text-xs font-semibold bg-surface-base hover:bg-surface-muted border border-border-subtle hover:border-accent/50 rounded-[4px] text-text-primary inline-flex items-center justify-between gap-2 transition-all shadow-2xs cursor-pointer min-w-[200px] max-w-[320px] focus:outline-none focus:border-accent"
        title="Search and select factory role"
      >
        <div className="flex items-center gap-1.5 truncate">
          <div className="text-accent shrink-0">
            {isCurrentSuper ? <Lock size={13} /> : <Shield size={13} />}
          </div>
          <span className="font-bold text-text-primary truncate">
            {selectedRole ? selectedRole.roleName : selectedRoleCode}
          </span>
          {selectedRole && (
            <span className="text-[10px] font-mono text-text-muted truncate">
              ({selectedRole.roleCode.replace('ROLE_', '')})
            </span>
          )}
        </div>
        <ChevronDown
          size={13}
          className={`text-text-muted shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-accent' : ''
          }`}
        />
      </button>

      {/* Popover Combobox Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-surface-card border border-border-subtle rounded-[6px] shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Live Search Input */}
          <div className="p-2 bg-surface-muted/60 border-b border-border-subtle flex items-center gap-2">
            <Search size={13} className="text-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles by title, code, or description..."
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

          {/* Results Summary Strip */}
          <div className="px-2.5 py-1 bg-surface-muted/30 border-b border-border-subtle/50 text-[10px] text-text-muted flex items-center justify-between font-mono">
            <span>
              {filteredRoles.length} of {roles.length} Roles
            </span>
            {searchQuery && (
              <span className="text-accent font-semibold">Filtering</span>
            )}
          </div>

          {/* Filtered Roles List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle/40 scrollbar-thin">
            {filteredRoles.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-muted">
                No roles found matching &ldquo;<span className="text-text-primary font-semibold">{searchQuery}</span>&rdquo;
              </div>
            ) : (
              filteredRoles.map((r) => {
                const isSelected = r.roleCode === selectedRoleCode;
                const isSuper = r.roleCode === 'ROLE_SUPER_ADMIN';
                const isDirty = dirtyRoleCodes ? dirtyRoleCodes.has(r.roleCode) : false;

                return (
                  <button
                    key={r.roleCode}
                    type="button"
                    onClick={() => handleSelect(r.roleCode)}
                    className={`w-full p-2.5 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-accent/10 text-text-primary'
                        : 'hover:bg-surface-muted/70 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-accent text-white shadow-2xs'
                            : 'bg-surface-muted text-accent border border-border-subtle'
                        }`}
                      >
                        {isSuper ? <Lock size={12} /> : <Shield size={12} />}
                      </div>

                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-xs text-text-primary truncate">
                            {r.roleName}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            ({r.roleCode.replace('ROLE_', '')})
                          </span>
                          {isDirty && (
                            <span
                              className="w-2 h-2 rounded-full bg-warning animate-pulse shrink-0"
                              title="Unsaved changes"
                            />
                          )}
                        </div>
                        {r.description && (
                          <p className="text-[11px] text-text-muted truncate mt-0.5">
                            {r.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 text-accent">
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
