/**
 * =============================================================================
 * [EN] Enterprise Searchable Select Combobox Component (SearchableSelect.tsx)
 * [BN] এন্টারপ্রাইজ সার্চেবল সিলেক্ট কম্বোবক্স কম্পোনেন্ট (SearchableSelect.tsx)
 * =============================================================================
 * [EN] Universal live searchable dropdown replacement for HTML select elements
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] কিওয়ার্ড দিয়ে রিয়েল-টাইমে অপশন ফিল্টারিং, ব্যাজ কাউন্ট ও চেক ইন্ডিকেটরসহ ড্রপডাউন।
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface SearchableSelectOption {
  readonly value: string;
  readonly label: string;
  readonly count?: number;
  readonly icon?: React.ReactNode;
  readonly description?: string;
}

export interface SearchableSelectProps {
  readonly options: readonly SearchableSelectOption[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly icon?: React.ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly popoverWidth?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  icon,
  disabled = false,
  className = '',
  popoverWidth = 'w-full min-w-[220px]',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Click outside and Escape key listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Real-time filtering
  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-8 px-2.5 text-xs bg-surface-base hover:bg-surface-muted border border-border-subtle hover:border-brand-accent/50 rounded-[4px] text-text-primary inline-flex items-center justify-between gap-1.5 transition-all shadow-2xs cursor-pointer focus:outline-none focus:border-brand-accent disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'border-brand-accent ring-1 ring-brand-accent/20' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {icon && <span className="text-brand-accent shrink-0">{icon}</span>}
          {selectedOption?.icon && (
            <span className="text-text-muted shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {typeof selectedOption?.count === 'number' && (
            <span className="text-[10px] font-mono text-text-muted px-1 rounded bg-surface-muted border border-border-subtle shrink-0">
              {selectedOption.count}
            </span>
          )}
        </div>
        <ChevronDown
          size={13}
          className={`text-text-muted shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-brand-accent' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-1 ${popoverWidth} bg-surface-card border border-border-subtle rounded-[6px] shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* Live Search Input */}
          <div className="p-1.5 bg-surface-muted/60 border-b border-border-subtle flex items-center gap-1.5">
            <Search size={12} className="text-brand-accent shrink-0 ml-1" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none py-0.5"
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
          <div className="max-h-56 overflow-y-auto divide-y divide-border-subtle/30 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-text-muted">
                No matching options.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-2.5 py-1.5 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-brand-accent/10 text-brand-accent font-semibold'
                        : 'hover:bg-surface-muted/70 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                      {typeof opt.count === 'number' && (
                        <span className="text-[10px] font-mono text-text-muted px-1 rounded bg-surface-muted border border-border-subtle shrink-0">
                          {opt.count}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={12} strokeWidth={2.5} className="text-brand-accent shrink-0" />
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

export default SearchableSelect;
