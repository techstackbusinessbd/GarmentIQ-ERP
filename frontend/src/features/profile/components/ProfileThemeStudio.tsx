/**
 * =============================================================================
 * [EN] Executive Appearance & Theme Studio Component (ProfileThemeStudio.tsx)
 * [BN] এক্সিকিউটিভ অ্যাপিয়ারেন্স ও থিম স্টুডিও কম্পোনেন্ট (ProfileThemeStudio.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] ইন্টারফেস লাইটিং মোড, সাইডবার কন্ট্রাস্ট ও ৪টি কিউরেটেড এন্টারপ্রাইজ কালার প্যালেট স্টুডিও।
 */

import React from 'react';
import {
  Sun,
  Moon,
  Palette,
  Check,
  Layout,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store';
import type { ThemeMetadata } from '@/constants';

export const ProfileThemeStudio: React.FC = () => {
  const {
    theme: activeThemeId,
    availableThemes,
    isDark,
    setMode,
    setTheme,
    sidebarTheme,
    setSidebarTheme,
  } = useThemeStore();

  const handlePaletteSelect = (theme: ThemeMetadata) => {
    setTheme(theme.id);
    toast.success(`${theme.name} applied`);
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    setMode(mode);
    toast.success(`${mode === 'dark' ? 'Dark' : 'Light'} mode applied`);
  };

  const handleSidebarChange = (style: 'dark' | 'light') => {
    setSidebarTheme(style);
    toast.success(`${style === 'dark' ? 'Dark' : 'Light'} sidebar applied`);
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs space-y-5">
      {/* Studio Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Sliders size={15} className="text-brand-accent" />
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Workspace Appearance
          </h2>
        </div>
      </div>

      {/* Section 1: Lighting Mode */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Sun size={13} className="text-amber-500" />
            <span>Lighting Mode</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleModeChange('light')}
            className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              !isDark
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-2xs'
                : 'border-border-subtle bg-surface-base hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-text-primary">Executive Light</span>
              </div>
              {!isDark && <CheckCircle2 size={14} className="text-brand-accent" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('dark')}
            className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              isDark
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-2xs'
                : 'border-border-subtle bg-surface-base hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-text-primary">Midnight Dark</span>
              </div>
              {isDark && <CheckCircle2 size={14} className="text-brand-accent" />}
            </div>
          </button>
        </div>
      </div>

      {/* Section 2: Sidebar Contrast */}
      <div className="space-y-2.5 pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Layout size={13} className="text-brand-accent" />
            <span>Navigation Sidebar Contrast</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted capitalize">
            {sidebarTheme} Style
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSidebarChange('dark')}
            className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              sidebarTheme === 'dark'
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-2xs'
                : 'border-border-subtle bg-surface-base hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-2.5 rounded-[2px] bg-slate-900 border border-slate-700 shadow-2xs" />
                <span className="text-xs font-bold text-text-primary">Industrial Dark</span>
              </div>
              {sidebarTheme === 'dark' && <CheckCircle2 size={14} className="text-brand-accent" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSidebarChange('light')}
            className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              sidebarTheme === 'light'
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-2xs'
                : 'border-border-subtle bg-surface-base hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-2.5 rounded-[2px] bg-white dark:bg-slate-800 border border-border-subtle shadow-2xs" />
                <span className="text-xs font-bold text-text-primary">Unified Light</span>
              </div>
              {sidebarTheme === 'light' && <CheckCircle2 size={14} className="text-brand-accent" />}
            </div>
          </button>
        </div>
      </div>

      {/* Section 3: 4 Enterprise Color Themes */}
      <div className="space-y-2.5 pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Palette size={13} className="text-brand-accent" />
            <span>Color Palettes</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted">
            4 Themes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableThemes.map((t) => {
            const isSelected = activeThemeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handlePaletteSelect(t)}
                className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent shadow-2xs'
                    : 'border-border-subtle bg-surface-base hover:bg-surface-muted/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="h-4 w-4 rounded-full border border-surface-card shadow-2xs"
                        style={{ backgroundColor: t.accentColor }}
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-surface-card shadow-2xs"
                        style={{ backgroundColor: t.sidebarColor }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text-primary block truncate">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-text-muted block truncate">
                        {t.subtitle}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="h-4 w-4 rounded-full bg-brand-accent text-white flex items-center justify-center shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileThemeStudio;
