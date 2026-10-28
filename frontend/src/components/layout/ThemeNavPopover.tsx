/**
 * =============================================================================
 * [EN] Enterprise Theme & Appearance Popover (ThemeNavPopover)
 * [BN] এন্টারপ্রাইজ থিম ও অ্যাপিয়ারেন্স পপওভার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] হেডার বারে অবস্থিত থিম মোড, সাইডবার স্টাইল ও আই-কমফোর্ট কালার প্যালেট সুইচার।
 */

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store';

export interface ThemeNavPopoverProps {
  readonly variant?: 'light' | 'dark';
}

/**
 * [EN] Dedicated Theme & Appearance Popover Component for Top Header.
 * [BN] টপ হেডারের জন্য ডেডিকেটেড থিম ও ইন্টারফেস প্রেফারেন্স পপওভার কম্পোনেন্ট।
 */
export const ThemeNavPopover: React.FC<ThemeNavPopoverProps> = ({
  variant = 'dark',
}) => {
  const {
    theme: activeThemeId,
    availableThemes,
    activeThemeMeta,
    setTheme,
    setMode,
    sidebarTheme,
    setSidebarTheme,
  } = useThemeStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // [EN] Close on outside click or Escape key / [BN] বাইরে অথবা Escape চাপলে বন্ধ করা
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={popoverRef}>
      {/* [EN] Header Trigger Button / [BN] হেডার ট্রিগার বাটন */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-1.5 rounded-[4px] transition-colors relative cursor-pointer select-none ${
          isOpen
            ? 'text-brand-accent bg-brand-accent/20'
            : isDark
            ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            : 'text-text-muted hover:text-text-primary hover:bg-surface-muted'
        }`}
        title="Interface & Theme Preferences"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Palette size={18} />
      </button>

      {/* [EN] Popover Panel / [BN] থিম পপওভার প্যানেল */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-[6px] bg-surface-card border border-border-subtle shadow-xl z-50 py-3 px-3 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header Title */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-subtle">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Palette size={14} className="text-brand-accent" />
              Theme & Appearance
            </span>
            <span className="text-[10px] font-mono text-text-muted font-medium">
              {activeThemeMeta.name.split(' ')[0]}
            </span>
          </div>

          {/* Dual Segmented Controls: Theme Mode & Sidebar Style */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Theme Mode Toggle */}
            <div>
              <span className="text-[10px] text-text-muted font-semibold block mb-1">Theme Mode</span>
              <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-surface-muted rounded-[3px] border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`flex items-center justify-center gap-1 py-1 rounded-[2px] text-[11px] font-medium transition-all cursor-pointer ${
                    !activeThemeMeta.isDark
                      ? 'bg-surface-card text-brand-accent font-bold shadow-2xs'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Sun size={11} /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`flex items-center justify-center gap-1 py-1 rounded-[2px] text-[11px] font-medium transition-all cursor-pointer ${
                    activeThemeMeta.isDark
                      ? 'bg-surface-card text-brand-accent font-bold shadow-2xs'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Moon size={11} /> Dark
                </button>
              </div>
            </div>

            {/* Sidebar Style Toggle */}
            <div>
              <span className="text-[10px] text-text-muted font-semibold block mb-1">Sidebar Style</span>
              <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-surface-muted rounded-[3px] border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setSidebarTheme('dark')}
                  className={`flex items-center justify-center gap-1 py-1 rounded-[2px] text-[11px] font-medium transition-all cursor-pointer ${
                    sidebarTheme === 'dark'
                      ? 'bg-surface-card text-brand-accent font-bold shadow-2xs'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Moon size={11} /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTheme('light')}
                  className={`flex items-center justify-center gap-1 py-1 rounded-[2px] text-[11px] font-medium transition-all cursor-pointer ${
                    sidebarTheme === 'light'
                      ? 'bg-surface-card text-brand-accent font-bold shadow-2xs'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Sun size={11} /> Light
                </button>
              </div>
            </div>
          </div>

          {/* Palette Presets */}
          <div>
            <span className="text-[10px] text-text-muted font-semibold block mb-1.5">
              Color Palette Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {availableThemes.map((themeOption) => {
                const isActive = activeThemeId === themeOption.id;
                return (
                  <button
                    key={themeOption.id}
                    type="button"
                    onClick={() => setTheme(themeOption.id)}
                    title={`${themeOption.name} • ${themeOption.subtitle}`}
                    className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-[4px] border transition-all cursor-pointer ${
                      isActive
                        ? 'border-brand-accent bg-brand-accent/10 shadow-2xs text-brand-accent font-bold ring-1 ring-brand-accent/30'
                        : 'border-border-subtle bg-surface-muted/30 hover:bg-surface-hover hover:border-border-strong text-text-muted'
                    }`}
                  >
                    <div
                      className="h-4 w-4 rounded-[3px] ring-1 ring-border-subtle relative overflow-hidden shrink-0 shadow-2xs"
                      style={{ backgroundColor: themeOption.sidebarColor }}
                    >
                      <div
                        className="absolute right-0 bottom-0 h-2 w-2 rounded-tl-[2px]"
                        style={{ backgroundColor: themeOption.accentColor }}
                      />
                    </div>
                    <span className="text-[9px] font-medium leading-none truncate max-w-[65px]">
                      {themeOption.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeNavPopover;
