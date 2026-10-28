/**
 * =============================================================================
 * [EN] Enterprise Application Full-Width Top Header (AppHeader)
 * [BN] এন্টারপ্রাইজ অ্যাপ্লিকেশন ফুল-উইডথ ১ম লাইট টপ হেডার (AppHeader)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] পুরো স্ক্রিনের উপর ফুল-উইডথ লাইট হেডার (bg-white border-slate-200), জিরো কলাপ্স বাটন।
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, Menu, ChevronLeft } from 'lucide-react';
import { GLOBAL_SEARCH_HOTKEY } from '@/constants';
import { UserNavDropdown } from './UserNavDropdown';
import { ThemeNavPopover } from './ThemeNavPopover';
import { HeaderBreadcrumb } from './HeaderBreadcrumb';
export interface AppHeaderProps {
  readonly isSidebarOpen?: boolean;
  readonly onToggleSidebar?: () => void;
  readonly breadcrumbContent?: React.ReactNode;
}

/**
 * [EN] Top Application Header (Fixed 64px, docked right of full-height sidebar).
 * Features sidebar toggle & breadcrumbs on left, and search toggle, alerts, and user dropdown on right.
 *
 * [BN] টপ অ্যাপ্লিকেশন হেডার (৬৪px ফিক্সড, ফুল-হাইট সাইডবারের ডানপাশে ডকড)।
 * বামে সাইডবার টগল ও ব্রেডক্রাম্ব এবং ডানে অন-ক্লিক গ্লোবাল সার্চ, নোটিফিকেশন ও ইউজার প্রোফাইল।
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  isSidebarOpen = true,
  onToggleSidebar,
  breadcrumbContent,
}) => {
  // [EN] Search open state & query string / [BN] সার্চ ইনপুট দৃশ্যমানতা ও সার্চ স্ট্রিং
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // [EN] Global Hotkey Listener: Ctrl+K to open search, Escape to close
  // [BN] গ্লোবাল শর্টকাট: Ctrl+K চাপলে সার্চ ওপেন ও ফোকাস, Escape চাপলে ক্লোজ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // [EN] Click outside listener to collapse search bar if input is empty
  // [BN] সার্চ বক্সের বাইরে ক্লিক করলে এবং ইনপুট খালি থাকলে স্বয়ংক্রিয়ভাবে বন্ধ করা
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node) &&
        !searchQuery.trim()
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, searchQuery]);

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 bg-surface border-b border-border shrink-0 shadow-2xs transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'left-64' : 'left-16'
      }`}
    >
      {/* Left Section: Sidebar Collapse Toggle & Breadcrumb Hierarchy */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
            title={isSidebarOpen ? 'Collapse Navigation Sidebar' : 'Expand Navigation Sidebar'}
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        )}
        {breadcrumbContent ?? <HeaderBreadcrumb />}
      </div>

      {/* Right Section: Global Search (Beside Notification), Alerts & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Omnibox Search Option (Beside Notification) */}
        {isSearchOpen ? (
          <div
            ref={searchContainerRef}
            className="relative flex items-center animate-in fade-in zoom-in-95 duration-200"
          >
            <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search styles, PO, roll barcode..."
              className="pl-8 pr-16 py-1.5 text-xs bg-surface-muted border border-border rounded-[4px] w-64 sm:w-80 md:w-96 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-surface transition-all shadow-xs"
              autoFocus
            />
            <div className="absolute right-2 flex items-center gap-1">
              <span className="text-[10px] font-mono px-1 py-0.5 rounded-[2px] bg-surface border border-border text-muted-foreground pointer-events-none hidden sm:inline-block">
                ESC
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="p-1 text-muted-foreground hover:text-foreground rounded-xs cursor-pointer transition-colors"
                title="Close search (Esc)"
                aria-label="Close search"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer relative"
            title={`Search styles, PO, roll barcode (${GLOBAL_SEARCH_HOTKEY})`}
            aria-label="Open Global Search"
          >
            <Search size={18} />
          </button>
        )}

        {/* Notification Bell with 8px Accent Pulse Dot */}
        <button
          type="button"
          className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors relative cursor-pointer"
          title="System Alerts & QC Notifications"
          aria-label="View notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-surface animate-pulse" />
        </button>

        {/* Dedicated Theme & Appearance Popover */}
        <ThemeNavPopover variant="light" />

        {/* Authenticated User Profile Dropdown */}
        <UserNavDropdown variant="light" />
      </div>
    </header>
  );
};

export default AppHeader;
