/**
 * =============================================================================
 * [EN] Centralized UI, Theme, and Grid Configuration Constants
 * [BN] সেন্ট্রালাইজড ইউআই, থিম ও গ্রিড কনফিগারেশন কনস্ট্যান্টস (রুল ১৯ অনুবর্তী)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Zero Inline Data)
 * [BN] কম্পোনেন্ট থেকে সব ধরনের ম্যাজিক স্ট্রিং ও ইনলাইন কনফিগ দূর করে।
 */

/**
 * [EN] Metadata interface for Eye-Comfort Enterprise Themes.
 * [BN] ৪টি চোখের স্বাচ্ছন্দ্যপূর্ণ এন্টারপ্রাইজ থিমের মেটাডেটা ইন্টারফেস।
 */
export interface ThemeMetadata {
  /** [EN] Theme unique identifier / [BN] থিমের অনন্য আইডেন্টিফায়ার */
  readonly id: 'indigo' | 'sapphire' | 'emerald' | 'obsidian';

  /** [EN] Display name of the theme / [BN] থিমের প্রদর্শিত নাম */
  readonly name: string;

  /** [EN] Contextual subtitle describing operational role / [BN] ডোমেন ভূমিকা বর্ণনাকারী সাবটাইটেল */
  readonly subtitle: string;

  /** [EN] Primary accent color hex code / [BN] প্রাইমারি অ্যাকসেন্ট কালার হেক্স কোড */
  readonly accentColor: string;

  /** [EN] Sidebar scaffolding background hex code / [BN] সাইডবার ব্যাকগ্রাউন্ড হেক্স কোড */
  readonly sidebarColor: string;

  /** [EN] Flag indicating if theme operates in dark mode / [BN] ডার্ক মোড ফ্ল্যাগ */
  readonly isDark: boolean;
}

/**
 * [EN] 4 Eye-Comfort Enterprise Themes conforming to design specifications.
 * [BN] ডিজাইন স্পেসিফিকেশন অনুবর্তী ৪টি এন্টারপ্রাইজ থিম কনফিগারেশন।
 */
export const AVAILABLE_THEMES: readonly ThemeMetadata[] = [
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
    sidebarColor: '#0f172a',
    isDark: false,
  },
  {
    id: 'emerald',
    name: 'Emerald Sustainable',
    subtitle: 'Eco-Audit, GOTS & Green Factory',
    accentColor: '#059669',
    sidebarColor: '#022c22',
    isDark: false,
  },
  {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    subtitle: 'Floor Touchscreens & Night Shift',
    accentColor: '#6366f1',
    sidebarColor: '#0b0f19',
    isDark: true,
  },
];

/** [EN] Default theme identifier for new sessions / [BN] নতুন সেশনের জন্য ডিফল্ট থিম আইডেন্টিফায়ার */
export const DEFAULT_THEME: ThemeMetadata['id'] = 'indigo';

/** [EN] Local storage key for theme persistence / [BN] থিম সংরক্ষণের লোকাল স্টোরেজ কি */
export const THEME_STORAGE_KEY = 'garments_erp_theme';

/** [EN] Local storage key for JWT authentication access token / [BN] এক্সেস টোকেন লোকাল স্টোরেজ কি */
export const AUTH_STORAGE_KEY = 'garments_erp_auth_token';

/** [EN] Local storage key for JWT refresh token / [BN] রিফ্রেশ টোকেন লোকাল স্টোরেজ কি */
export const REFRESH_TOKEN_KEY = 'garments_erp_refresh_token';

/** [EN] Standard pagination page size dropdown options / [BN] টেবিল পেজ সাইজ ড্রপডাউন অপশন তালিকা */
export const TABLE_PAGE_SIZES: readonly number[] = [10, 25, 50, 100];

/** [EN] Default page size for virtual data grids / [BN] ভার্চুয়াল গ্রিডের ডিফল্ট পেজ সাইজ */
export const DEFAULT_PAGE_SIZE = 25;

/** [EN] Standard enterprise date and time formatting patterns / [BN] প্রমিত এন্টারপ্রাইজ তারিখ ও সময় ফরম্যাট */
export const DATE_FORMATS = {
  /** [EN] Standard display date / [BN] প্রদর্শিত সাধারণ তারিখ (যেমন: 19 Oct 2026) */
  DISPLAY_DATE: 'DD MMM YYYY',

  /** [EN] Standard display datetime / [BN] প্রদর্শিত তারিখ ও সময় */
  DISPLAY_DATETIME: 'DD MMM YYYY, hh:mm A',

  /** [EN] API payload ISO date / [BN] ব্যাকএন্ড এপিআই রিকোয়েস্টের তারিখ ফরম্যাট */
  API_DATE: 'YYYY-MM-DD',
} as const;

/** [EN] System branding and release SemVer metadata / [BN] সিস্টেম ব্র্যান্ডিং ও রিলিজ মেটাডেটা */
export const APP_METADATA = {
  NAME: 'Garments ERP',
  SHORT_NAME: 'GarmentIQ',
  TAGLINE: 'RMG Enterprise Platform',
  VERSION: 'v1.0.0-PROD',
  COPYRIGHT: '© 2026 Garments ERP. Enterprise Grade RMG Execution Platform.',
} as const;

/** [EN] Global search input debounce delay in milliseconds / [BN] গ্লোবাল সার্চ ডেবউন্স বিলম্ব (মি.সে.) */
export const SEARCH_DEBOUNCE_MS = 300;

/** [EN] Toast notification display duration in milliseconds / [BN] টোস্ট নোটিফিকেশন প্রদর্শন সময় (মি.সে.) */
export const TOAST_DURATION_MS = 4000;
