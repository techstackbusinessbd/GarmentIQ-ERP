/**
 * ==============================================================================
 * [EN] Enterprise Theme State Management Store (Zustand)
 * [BN] এন্টারপ্রাইজ থিম স্টেট ম্যানেজমেন্ট স্টোর (জুস্ট্যান্ড)
 *
 * Rules Compliant:
 * - Rule 19: Centralized constants
 * - Rule 20: Centralized design tokens
 * - Rule 21: Component-based UI/UX
 * ==============================================================================
 */

import { create } from 'zustand';

/**
 * [EN] LocalStorage key for persisting user theme preference.
 * [BN] ব্রাউজারের লোকালস্টোরেজে ব্যবহারকারীর থিম সংরক্ষণের কি।
 */
export const THEME_STORAGE_KEY = 'garments_erp_theme';

/**
 * [EN] Default theme identifier for Garments ERP.
 * [BN] সিস্টেমের ডিফল্ট থিম আইডেন্টিফায়ার।
 */
export const DEFAULT_THEME = 'indigo';

/**
 * [EN] Metadata for 4 Enterprise Themes.
 * [BN] ৪টি এন্টারপ্রাইজ থিমের সম্পূর্ণ মেটাডাটা ও প্রিভিউ স্পেক্স।
 */
export const AVAILABLE_THEMES = [
  {
    id: 'indigo',
    name: 'Royal Indigo & Denim',
    subtitle: 'Merchandising & Core Denim O2S',
    accentColor: '#4f46e5',
    sidebarColor: '#0f172a',
    isDark: false,
  },
  {
    id: 'sapphire',
    name: 'Sapphire Corporate',
    subtitle: 'Commercial, Finance & Executive',
    accentColor: '#2563eb',
    sidebarColor: '#111827',
    isDark: false,
  },
  {
    id: 'emerald',
    name: 'Emerald Sustainable',
    subtitle: 'Eco-Audit, GOTS & Green Factory',
    accentColor: '#059669',
    sidebarColor: '#064e3b',
    isDark: false,
  },
  {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    subtitle: 'Floor Touchscreens & Night Shift',
    accentColor: '#6366f1',
    sidebarColor: '#090d16',
    isDark: true,
  },
];

/**
 * [EN] Synchronizes the DOM root attributes to activate the target theme.
 * Sets `data-theme` and manages the `dark` class for full system synergy.
 *
 * [BN] DOM রুটের এট্রিবিউট আপডেট করে কাঙ্ক্ষিত থিম সক্রিয় করার নিরাপদ মেথড।
 */
export const applyThemeToDom = (themeId) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', themeId);

  if (themeId === 'obsidian') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * [EN] Read persisted theme safely from localStorage.
 * [BN] লোকালস্টোরেজ থেকে নিরাপদে প্রারম্ভিক থিম রিড করা।
 */
const getInitialTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const isValid = AVAILABLE_THEMES.some((t) => t.id === saved);
    return isValid ? saved : DEFAULT_THEME;
  } catch (e) {
    return DEFAULT_THEME;
  }
};

/**
 * [EN] Master Zustand store hook for active theme state and persistence.
 * [BN] সক্রিয় থিম এবং লোকালস্টোরেজ সিঙ্ক পরিচালনার মাস্টার হুক।
 */
export const useThemeStore = create((set, get) => ({
  activeTheme: getInitialTheme(),

  /**
   * [EN] Switch theme, write to DOM, and persist in localStorage.
   * [BN] থিম পরিবর্তন, DOM-এ রূপান্তর এবং ব্রাউজারে সংরক্ষণ।
   */
  setTheme: (themeId) => {
    const valid = AVAILABLE_THEMES.some((t) => t.id === themeId);
    if (!valid) return;

    applyThemeToDom(themeId);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (e) {
      // Graceful fallback if localStorage is disabled
    }
    set({ activeTheme: themeId });
  },

  /**
   * [EN] Initializer invoked during app mount.
   * [BN] অ্যাপ্লিকেশন মাউন্টের সময় থিম ইনিশিয়ালাইজার।
   */
  initTheme: () => {
    const current = get().activeTheme;
    applyThemeToDom(current);
  },
}));
