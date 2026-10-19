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
export const DEFAULT_THEME = 'sapphire';

/**
 * [EN] Metadata for 4 Eye-Comfort Enterprise Themes.
 * [BN] ৪টি চোখের স্বাচ্ছন্দ্যপূর্ণ এন্টারপ্রাইজ থিমের সম্পূর্ণ মেটাডাটা ও প্রিভিউ স্পেক্স।
 */
export const AVAILABLE_THEMES = [
  {
    id: 'sapphire',
    name: 'Sapphire Corporate',
    subtitle: 'Executive & Merchandising Standard',
    accentColor: '#2563eb',
    sidebarColor: '#0f172a',
    isDark: false,
  },
  {
    id: 'nordic',
    name: 'Nordic Mist & Steel',
    subtitle: 'Cool Scandinavian High-Clarity',
    accentColor: '#0284c7',
    sidebarColor: '#0a192f',
    isDark: false,
  },
  {
    id: 'cashmere',
    name: 'Cashmere Alabaster',
    subtitle: 'Warm Paper Finish, Zero Eye Fatigue',
    accentColor: '#2563eb',
    sidebarColor: '#1c1917',
    isDark: false,
  },
  {
    id: 'charcoal',
    name: 'Charcoal Dimmed',
    subtitle: 'Velvety Soft Dark Workspace',
    accentColor: '#58a6ff',
    sidebarColor: '#0d1117',
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

  if (themeId === 'charcoal') {
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
