/**
 * =============================================================================
 * [EN] Searchable User Filter Dropdown Combobox (SearchableUserDropdown.tsx)
 * [BN] সার্চেবল ইউজার ফিল্টার ড্রপডাউন কম্বোবক্স (SearchableUserDropdown.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise UI)
 * [BN] অডিট ট্রেইল টেবিলে ইউজার বা অ্যাক্টর অনুযায়ী তাৎক্ষণিক লাইভ সার্চ ও ফিল্টারিং।
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Search, ChevronDown, Check, X, Users } from 'lucide-react';

export interface UserFilterOption {
  username: string;
  fullName?: string;
  label: string;
  initial?: string;
}

export interface SearchableUserDropdownProps {
  options: readonly UserFilterOption[];
  selectedActor: string;
  onSelect: (username: string) => void;
  className?: string;
}

export const SearchableUserDropdown: React.FC<SearchableUserDropdownProps> = ({
  options,
  selectedActor,
  onSelect,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Find currently selected option
  const selectedOption = useMemo(
    () => options.find((o) => o.username === selectedActor),
    [options, selectedActor]
  );

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.username.toLowerCase().includes(q) ||
        (o.fullName && o.fullName.toLowerCase().includes(q)) ||
        o.label.toLowerCase().includes(q)
    );
  }, [options, searchQuery]);

  const handleSelect = (username: string) => {
    onSelect(username);
    setIsOpen(false);
    setSearchQuery('');
  };

  const triggerLabel = useMemo(() => {
    if (selectedActor === 'ALL' || !selectedOption) {
      return `All Users (${options.length})`;
    }
    return selectedOption.fullName
      ? `${selectedOption.fullName} (@${selectedOption.username})`
      : `@${selectedOption.username}`;
  }, [selectedActor, selectedOption, options.length]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-7 max-w-[210px] min-w-[140px] px-2 text-xs font-medium bg-surface-card hover:bg-surface-muted/60 border border-border-subtle hover:border-brand-accent/50 rounded-[4px] text-text-primary flex items-center justify-between gap-1.5 transition-all shadow-2xs cursor-pointer focus:outline-none focus:border-brand-accent"
        title="Filter by User / Actor (Searchable)"
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <User size={12} className="text-text-muted shrink-0" />
          <span className="truncate text-xs">{triggerLabel}</span>
        </div>
        <ChevronDown
          size={12}
          className={`text-text-muted shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-brand-accent' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 sm:w-72 bg-surface-card border border-border-subtle rounded-[6px] shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2 bg-surface-muted/50 border-b border-border-subtle flex items-center gap-1.5">
            <Search size={12} className="text-brand-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or @username..."
              className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-border-subtle/30">
            {/* "All Users" Option */}
            {!searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect('ALL')}
                className={`w-full px-2.5 py-1.5 rounded-[4px] text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  selectedActor === 'ALL'
                    ? 'bg-brand-accent/10 text-brand-accent font-semibold'
                    : 'hover:bg-surface-muted text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-surface-muted text-text-secondary flex items-center justify-center shrink-0">
                    <Users size={11} />
                  </div>
                  <span>All Users ({options.length})</span>
                </div>
                {selectedActor === 'ALL' && <Check size={13} className="text-brand-accent" />}
              </button>
            )}

            {/* Filtered User Items */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedActor === opt.username;
                const initial = opt.initial || (opt.fullName || opt.username).charAt(0).toUpperCase();

                return (
                  <button
                    key={opt.username}
                    type="button"
                    onClick={() => handleSelect(opt.username)}
                    className={`w-full px-2.5 py-1.5 rounded-[4px] text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-brand-accent/10 text-brand-accent font-semibold'
                        : 'hover:bg-surface-muted text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-brand-accent-light text-brand-accent font-bold text-[10px] flex items-center justify-center shrink-0 border border-brand-accent/20">
                        {initial}
                      </div>
                      <div className="min-w-0 truncate">
                        <span className="block truncate font-medium text-xs">
                          {opt.fullName || opt.username}
                        </span>
                        {opt.fullName && (
                          <span className="block text-[10px] font-mono text-text-muted truncate">
                            @{opt.username}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check size={13} className="text-brand-accent shrink-0 ml-1.5" />}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-text-muted">
                No users found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableUserDropdown;
