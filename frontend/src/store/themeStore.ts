/**
 * =============================================================================
 * [EN] Centralized Theme State Management Store (Zustand)
 * [BN] সেন্ট্রালাইজড থিম স্টেট ম্যানেজমেন্ট স্টোর (Zustand)
 * =============================================================================
 * [EN] Manages active enterprise eye-comfort theme, DOM injection, and persistence.
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Design Tokens)
 * [BN] সক্রিয় এন্টারপ্রাইজ থিম, ডিওএম অ্যাট্রিবিউট ইনজেকশন ও লোকাল স্টোরেজ নিয়ন্ত্রণ করে।
 */

import { create } from 'zustand';
import {
  AVAILABLE_THEMES,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ThemeMetadata,
} from '@/constants';

/**
 * [EN] Apply the specified theme ID to the HTML root element.
 * Updates data-theme attribute and toggles the dark class for obsidian mode.
 *
 * [BN] এইচটিএমএল রুট এলিমেন্টে নির্দিষ্ট থিম আইডি এবং ডার্ক ক্লাস প্রয়োগ করে।
 * data-theme অ্যাট্রিবিউট আপডেট করে এবং অবসিডিয়ান মোডের জন্য dark ক্লাস টগল করে।
 *
 * @param themeId [EN] The unique theme identifier / [BN] অনন্য থিম আইডেন্টিফায়ার
 */
export const applyThemeToDom = (themeId: ThemeMetadata['id']): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', themeId);

  const matchedTheme = AVAILABLE_THEMES.find((t) => t.id === themeId);
  if (matchedTheme?.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * [EN] Safely retrieve the initial theme from localStorage or fallback to default.
 * [BN] লোকাল স্টোরেজ থেকে সংরক্ষিত থিম উদ্ধার করে অথবা ডিফল্ট থিমে ফিরে যায়।
 *
 * @returns [EN] Validated theme identifier / [BN] ভ্যালিডেটেড থিম আইডি
 */
const getInitialTheme = (): ThemeMetadata['id'] => {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMetadata['id'] | null;
    if (saved && AVAILABLE_THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch {
    // [EN] Ignore storage access issues / [BN] স্টোরেজ এক্সেস ইস্যু অগ্রাহ্য করা
  }

  return DEFAULT_THEME;
};

/**
 * [EN] State interface for the Theme Store.
 * [BN] থিম স্টোরের স্টেট ও অ্যাকশন ইন্টারফেস।
 */
export interface ThemeState {
  /** [EN] Currently selected theme identifier / [BN] বর্তমানে নির্বাচিত থিম আইডি */
  theme: ThemeMetadata['id'];

  /** [EN] Immutable list of all available themes / [BN] উপলব্ধ সকল থিমের তালিকা */
  availableThemes: readonly ThemeMetadata[];

  /** [EN] Full metadata of currently active theme / [BN] সক্রিয় থিমের বিস্তারিত মেটাডেটা */
  activeThemeMeta: ThemeMetadata;

  /** [EN] Switch active theme, update DOM, and save to storage / [BN] থিম পরিবর্তন অ্যাকশন */
  setTheme: (themeId: ThemeMetadata['id']) => void;
}

// [EN] Resolve initial theme and apply to document root immediately
// [BN] প্রারম্ভিক থিম নির্ধারণ এবং অবিলম্বে ডকুমেন্ট রুটে প্রয়োগ করা
const initialThemeId = getInitialTheme();
applyThemeToDom(initialThemeId);

// [EN] Strict non-undefined fallback theme metadata object
// [BN] টাইপ-সেফ নন-আনডিফাইন্ড ফলব্যাক থিম মেটাডেটা অবজেক্ট
const defaultThemeMeta: ThemeMetadata = AVAILABLE_THEMES[0] as ThemeMetadata;

/**
 * [EN] Zustand Hook for Global Theme State.
 * Provides active theme state and actions to components throughout the platform.
 *
 * [BN] গ্লোবাল থিম স্টেট ম্যানেজমেন্টের জন্য Zustand হুক।
 * প্ল্যাটফর্মের সমস্ত কম্পোনেন্টে সক্রিয় থিম স্টেট ও পরিবর্তন অ্যাকশন সরবরাহ করে।
 */
export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialThemeId,
  availableThemes: AVAILABLE_THEMES,
  activeThemeMeta:
    AVAILABLE_THEMES.find((t) => t.id === initialThemeId) ?? defaultThemeMeta,

  setTheme: (themeId: ThemeMetadata['id']) => {
    // [EN] Update HTML DOM root attribute
    // [BN] এইচটিএমএল ডম রুট অ্যাট্রিবিউট আপডেট করা
    applyThemeToDom(themeId);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // [EN] Storage quota or access limitation handled silently
      // [BN] স্টোরেজ কোটা বা এক্সেস সীমাবদ্ধতা নিরাপদভাবে হ্যান্ডলিং
    }

    const matched =
      AVAILABLE_THEMES.find((t) => t.id === themeId) ?? defaultThemeMeta;

    set({
      theme: themeId,
      activeThemeMeta: matched,
    });
  },
}));
