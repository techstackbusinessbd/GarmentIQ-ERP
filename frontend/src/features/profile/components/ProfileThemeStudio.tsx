/**
 * =============================================================================
 * [EN] Executive Appearance & Theme Studio Component (ProfileThemeStudio.tsx)
 * [BN] এক্সিকিউটিভ অ্যাপিয়ারেন্স ও থিম স্টুডিও কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
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

/**
 * [EN] Executive Theme & Appearance Customization Studio.
 * Provides interactive visual cards for lighting mode, sidebar contrast, and curated color palettes.
 *
 * [BN] এক্সিকিউটিভ থিম ও অ্যাপিয়ারেন্স স্টুডিও।
 * লাইটিং মোড, সাইডবার স্টাইল এবং ৪টি কিউরেটেড কালার প্যালেটের জন্য ভিজ্যুয়াল কার্ড অফার করে।
 */
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
    toast.success(`Active theme updated to ${theme.name}`);
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    setMode(mode);
    toast.success(`Switched to ${mode === 'dark' ? 'Midnight Dark' : 'Executive Light'} mode`);
  };

  const handleSidebarChange = (style: 'dark' | 'light') => {
    setSidebarTheme(style);
    toast.success(`Sidebar style set to ${style === 'dark' ? 'Industrial Dark' : 'Unified Light'}`);
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[8px] p-5 shadow-xs space-y-6">
      {/* Studio Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-[4px] bg-brand-accent/10 text-brand-accent flex items-center justify-center">
            <Sliders size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Workspace Appearance & Theme Studio
            </h2>
            <p className="text-[11px] text-text-muted">
              Configure your visual ergonomics, navigation contrast, and eye-comfort color accents.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * [EN] Section 1: Interface Lighting Mode (Light vs Dark)
       * [BN] সেকশন ১: ইন্টারফেস লাইটিং মোড (লাইট বনাম ডার্ক)
       * ===================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Sun size={14} className="text-amber-500" />
            <span>Interface Lighting Mode</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted">
            {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Light Mode Visual Card */}
          <button
            type="button"
            onClick={() => handleModeChange('light')}
            className={`group relative p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              !isDark
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-xs'
                : 'border-border-subtle bg-surface-muted/30 hover:border-border-strong hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Sun size={13} />
                </div>
                <span className="text-xs font-bold text-text-primary">Executive Light</span>
              </div>
              {!isDark && <CheckCircle2 size={15} className="text-brand-accent" />}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              High-clarity daytime ergonomics with clean white workspaces and soft slate borders.
            </p>
          </button>

          {/* Dark Mode Visual Card */}
          <button
            type="button"
            onClick={() => handleModeChange('dark')}
            className={`group relative p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              isDark
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-xs'
                : 'border-border-subtle bg-surface-muted/30 hover:border-border-strong hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Moon size={13} />
                </div>
                <span className="text-xs font-bold text-text-primary">Midnight Dark</span>
              </div>
              {isDark && <CheckCircle2 size={15} className="text-brand-accent" />}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Low-glare eye-comfort dark palette tailored for night shifts and floor monitors.
            </p>
          </button>
        </div>
      </div>

      {/* =====================================================================
       * [EN] Section 2: Sidebar Navigation Contrast (Dark vs Light)
       * [BN] সেকশন ২: সাইডবার কন্ট্রাস্ট স্টাইল (ডার্ক বনাম লাইট)
       * ===================================================================== */}
      <div className="space-y-3 pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Layout size={14} className="text-brand-accent" />
            <span>Navigation Sidebar Contrast</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted capitalize">
            {sidebarTheme} Style Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Industrial Dark Sidebar Card */}
          <button
            type="button"
            onClick={() => handleSidebarChange('dark')}
            className={`group relative p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              sidebarTheme === 'dark'
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-xs'
                : 'border-border-subtle bg-surface-muted/30 hover:border-border-strong hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-3 rounded-[2px] bg-slate-900 border border-slate-700 shadow-xs" />
                <span className="text-xs font-bold text-text-primary">Industrial Dark</span>
              </div>
              {sidebarTheme === 'dark' && <CheckCircle2 size={15} className="text-brand-accent" />}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Classic ERP contrast with deep navy navigation bar and high-focus menu separation.
            </p>
          </button>

          {/* Unified Light Sidebar Card */}
          <button
            type="button"
            onClick={() => handleSidebarChange('light')}
            className={`group relative p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
              sidebarTheme === 'light'
                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/50 shadow-xs'
                : 'border-border-subtle bg-surface-muted/30 hover:border-border-strong hover:bg-surface-muted/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-3 rounded-[2px] bg-white dark:bg-slate-800 border border-border-subtle shadow-xs" />
                <span className="text-xs font-bold text-text-primary">Unified Light</span>
              </div>
              {sidebarTheme === 'light' && <CheckCircle2 size={15} className="text-brand-accent" />}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Modern seamless layout where the sidebar matches the surface card brightness.
            </p>
          </button>
        </div>
      </div>

      {/* =====================================================================
       * [EN] Section 3: Curated Enterprise Color Palettes (4 Themes)
       * [BN] সেকশন ৩: কিউরেটেড এন্টারপ্রাইজ কালার প্যালেট (৪টি থিম)
       * ===================================================================== */}
      <div className="space-y-3 pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Palette size={14} className="text-brand-accent" />
            <span>Curated Enterprise Palettes</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted">
            4 Industry Themes
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
                className={`group relative p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent shadow-xs'
                    : 'border-border-subtle bg-surface-muted/30 hover:border-border-strong hover:bg-surface-muted/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Dual Color Swatch Dot Indicator */}
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="h-5 w-5 rounded-full border-2 border-surface-card shadow-xs"
                        style={{ backgroundColor: t.accentColor }}
                      />
                      <span
                        className="h-5 w-5 rounded-full border-2 border-surface-card shadow-xs"
                        style={{ backgroundColor: t.sidebarColor }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text-primary block leading-tight">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-text-muted block mt-0.5 line-clamp-1">
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

      {/* Persistence Note Footnote */}
      <div className="p-3 rounded-[4px] bg-surface-muted/40 border border-border-subtle/70 text-[11px] text-text-muted flex items-center justify-between gap-2">
        <span>Preferences are saved automatically and synchronized across all active browser tabs.</span>
        <span className="font-mono text-[10px] text-brand-accent font-semibold shrink-0">Instant Sync</span>
      </div>
    </div>
  );
};
