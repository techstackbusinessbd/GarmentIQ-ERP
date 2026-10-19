/**
 * =============================================================================
 * [EN] Enterprise Theme Switcher Popover Component
 * [BN] এন্টারপ্রাইজ থিম সুইচার পপওভার কম্পোনেন্ট
 * =============================================================================
 * [EN] Conforms to design specs: 4 Eye-Comfort themes, sharp micro-radius ramp.
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Design Tokens)
 * [BN] ৪টি চোখের স্বাচ্ছন্দ্যপূর্ণ থিম এবং শার্প মাইক্রো-রেডিয়াস কনফিগারেশন।
 */

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import type { ThemeMetadata } from '@/constants';

/**
 * [EN] Interactive Theme Switcher Popover Component.
 * Allows users to preview and switch between the 4 Eye-Comfort palettes with instant persistence.
 *
 * [BN] ইন্টারঅ্যাক্টিভ থিম সুইচার পপওভার কম্পোনেন্ট।
 * ব্যবহারকারীকে ৪টি চোখের স্বাচ্ছন্দ্যপূর্ণ থিম প্রিভিউ করতে এবং এক ক্লিকে পরিবর্তন করতে সহায়তা করে।
 */
export const ThemeSwitcher: React.FC = () => {
  // [EN] Popover open/closed dropdown state
  // [BN] পপওভার খোলা বা বন্ধের ড্রপডাউন স্টেট
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // [EN] Theme state and setter actions from centralized Zustand store
  // [BN] সেন্ট্রালাইজড Zustand স্টোর থেকে থিম স্টেট এবং সেটার অ্যাকশন
  const { theme: activeThemeId, availableThemes, activeThemeMeta, setTheme } = useThemeStore();

  // [EN] DOM reference to container for outside-click detection
  // [BN] বাইরে ক্লিক ডিটেক্ট করার জন্য কন্টেইনার ডম রেফারেন্স
  const popoverRef = useRef<HTMLDivElement>(null);

  // [EN] Close popover automatically on outside click
  // [BN] পপওভারের বাইরে ক্লিক করলে ড্রপডাউন স্বয়ংক্রিয়ভাবে বন্ধ করার লিসেনার
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* [EN] Popover Trigger Button with Active Theme Swatch / [BN] সক্রিয় থিমের সোয়াচ সহ পপওভার ট্রিগার বাটন */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Active Theme: ${activeThemeMeta.name}`}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-medium border border-border-subtle bg-surface-muted hover:bg-surface-hover text-text-primary transition-all duration-200 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20"
      >
        <Palette size={15} className="text-brand-accent shrink-0" />
        <span className="hidden sm:inline-block font-medium truncate max-w-[120px]">
          {activeThemeMeta.name.split(' ')[0]}
        </span>
        <span
          className="h-2.5 w-2.5 rounded-xs shrink-0 ring-1 ring-border-subtle"
          style={{ backgroundColor: activeThemeMeta.accentColor }}
        />
      </button>

      {/* [EN] Floating Dropdown Card (Sharp rounded-card with z-50) / [BN] ফ্লোটিং ড্রপডাউন কার্ড (z-50) */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 rounded-card bg-surface-card border border-border-subtle shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* [EN] Popover Header with Enterprise Badge / [BN] এন্টারপ্রাইজ ব্যাজ সহ পপওভার হেডার */}
          <div className="px-3.5 py-2 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <Sparkles size={14} className="text-brand-accent" />
              <span>Enterprise Themes</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-surface-muted text-text-muted">
              4 Palettes
            </span>
          </div>

          {/* [EN] Theme Selection List Options / [BN] থিম সিলেকশন অপশন তালিকা */}
          <div className="p-1.5 space-y-1">
            {availableThemes.map((themeOption: ThemeMetadata) => {
              const isActive = activeThemeId === themeOption.id;
              return (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-accent-light/40 border border-brand-accent/30 text-text-primary font-medium'
                      : 'hover:bg-surface-muted text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* [EN] Dual-Tone Preview Swatch (Sidebar + Accent) / [BN] ডুয়েল-টোন প্রিভিউ সোয়াচ */}
                    <div
                      className="h-7 w-7 rounded-xs flex items-center justify-center shrink-0 shadow-xs ring-1 ring-border-subtle relative overflow-hidden"
                      style={{ backgroundColor: themeOption.sidebarColor }}
                    >
                      <div
                        className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-tl-xs shadow-inner"
                        style={{ backgroundColor: themeOption.accentColor }}
                      />
                    </div>

                    <div className="flex flex-col truncate">
                      <span className="text-xs font-semibold truncate leading-tight">
                        {themeOption.name}
                      </span>
                      <span className="text-[10px] text-text-muted truncate leading-tight">
                        {themeOption.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* [EN] Active Theme Checkmark Indicator / [BN] সক্রিয় থিমের চেক আইকন */}
                  {isActive && (
                    <div className="h-4.5 w-4.5 rounded-xs bg-brand-accent text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
