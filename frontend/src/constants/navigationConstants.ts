/**
 * =============================================================================
 * [EN] Centralized Navigation Constants for Garments ERP
 * [BN] গার্মেন্টস ইআরপি সেন্ট্রালাইজড নেভিগেশন কনস্ট্যান্টস (রুল ১৯ অনুবর্তী)
 * =============================================================================
 * [EN] Defines the complete master navigation hierarchy across all Bounded Contexts.
 * [BN] সমস্ত বাউন্ডেড কনটেক্সটের মাস্টার নেভিগেশন হায়ারার্কি ও মেনু কনফিগারেশন।
 */

/**
 * [EN] Structure for an individual navigation route item.
 * [BN] একক নেভিগেশন রুট আইটেমের অবজেক্ট টাইপ।
 */
export interface NavItem {
  /** [EN] Unique route identifier / [BN] অনন্য রুট আইডেন্টিফায়ার */
  readonly id: string;

  /** [EN] Human-readable English label for UI / [BN] ইউআইয়ের জন্য ইংরেজি লেবেল */
  readonly label: string;

  /** [EN] Target browser URL path / [BN] ব্রাউজারের পাথ */
  readonly path: string;

  /** [EN] Lucide React icon component identifier / [BN] Lucide আইকন নেম */
  readonly iconName: string;

  /** [EN] Optional visual indicator badge / [BN] অপশনাল ব্যাজ */
  readonly badge?: string | null;

  /** [EN] Required RBAC permission code / [BN] প্রয়োজনীয় পারমিশন কোড */
  readonly permission?: string;

  /** [EN] Nested sub-navigation links / [BN] সাব-মেনু লিংকসমূহ */
  readonly children?: readonly {
    readonly id: string;
    readonly label: string;
    readonly path: string;
    readonly badge?: string | null;
  }[];
}

/**
 * [EN] Structure for a grouped section in the master sidebar.
 * [BN] মাস্টার সাইডবারের গ্রুপ সেকশন অবজেক্ট টাইপ।
 */
export interface NavGroup {
  /** [EN] Unique domain group identifier / [BN] অনন্য ডোমেন গ্রুপ আইডেন্টিফায়ার */
  readonly id: string;

  /** [EN] English section header title / [BN] সেকশন হেডার শিরোনাম */
  readonly title: string;

  /** [EN] Array of navigation route items within group / [BN] গ্রুপের অন্তর্গত নেভিগেশন রুট তালিকা */
  readonly items: readonly NavItem[];
}

/**
 * [EN] Master sidebar navigation grouped by operational domains.
 * [BN] অপারেশনাল ডোমেন অনুসারে বিন্যস্ত মাস্টার সাইডবার নেভিগেশন গ্রুপসমূহ।
 */
export const NAVIGATION_GROUPS: readonly NavGroup[] = [
  {
    id: 'core',
    title: 'Core Workflows',
    items: [
      {
        id: 'dashboard',
        label: 'Overview & Analytics',
        path: '/app/dashboard',
        iconName: 'LayoutDashboard',
        badge: null,
      },
    ],
  },

  {
    id: 'admin-access',
    title: 'Users & Access Control',
    items: [
      {
        id: 'client-management',
        label: 'Client Management',
        path: '/app/admin/clients',
        iconName: 'Building2',
        permission: 'TENANT:MENU',
      },
      {
        id: 'user-management',
        label: 'User Management',
        path: '/app/admin/users',
        iconName: 'Users',
        permission: 'USER:MENU',
      },
      {
        id: 'privilege-management',
        label: 'Role Management',
        path: '/app/admin/roles',
        iconName: 'ShieldCheck',
        permission: 'ROLE:MENU',
      },
      {
        id: 'access-matrix',
        label: 'Role Access Matrix',
        path: '/app/admin/roles/matrix',
        iconName: 'SlidersHorizontal',
        permission: 'ROLE:MENU',
      },
      {
        id: 'user-special-permissions',
        label: 'User Special Permissions',
        path: '/app/admin/users/special-permissions',
        iconName: 'ShieldAlert',
        permission: 'SPECIAL_PERM:MENU',
      },
      {
        id: 'password-reset',
        label: 'Password Reset',
        path: '/app/admin/users/reset-password',
        iconName: 'KeyRound',
        permission: 'PASSWORD_RESET:MENU',
      },
      {
        id: 'user-profile',
        label: 'User Profile & Preferences',
        path: '/app/admin/profile',
        iconName: 'User',
        permission: 'PROFILE:MENU',
      },
    ],
  },
  {
    id: 'admin-platform',
    title: 'System Config',
    items: [
      {
        id: 'system-settings',
        label: 'System Settings',
        path: '/app/admin/settings',
        iconName: 'Settings',
        permission: 'SETTINGS:MENU',
      },
      {
        id: 'master-library',
        label: 'Master Library',
        path: '/app/admin/library',
        iconName: 'Library',
        permission: 'LIBRARY:MENU',
      },
    ],
  },
];

/**
 * [EN] Multi-factory plant units for header switcher.
 * [BN] টপ হেডারের জন্য মাল্টি-ফ্যাক্টরি প্ল্যান্ট ইউনিট তালিকা।
 */
export interface FactoryUnit {
  /** [EN] Internal unit identifier / [BN] অভ্যন্তরীণ ইউনিট আইডি */
  readonly id: string;

  /** [EN] Short factory unit code / [BN] সংক্ষিপ্ত ফ্যাক্টরি ইউনিট কোড */
  readonly code: string;

  /** [EN] Full plant name / [BN] সম্পূর্ণ প্ল্যান্টের নাম */
  readonly name: string;

  /** [EN] Geographic factory location / [BN] কারখানার ভৌগোলিক অবস্থান */
  readonly location: string;
}

export const FACTORY_UNITS: readonly FactoryUnit[] = [
  {
    id: 'unit-01',
    code: 'PLANT-ASH',
    name: 'Woven & Denim Main Plant',
    location: 'Ashulia, Dhaka',
  },
  {
    id: 'unit-02',
    code: 'PLANT-GAZ',
    name: 'Industrial Laundry & Dyeing Plant',
    location: 'Gazipur, Dhaka',
  },
  {
    id: 'unit-03',
    code: 'PLANT-NKN',
    name: 'High-Density Screen Print & Emb Unit',
    location: 'Narayanganj, Dhaka',
  },
];

/**
 * [EN] Global Hotkey for Omnibox / Instant Search.
 * [BN] গ্লোবাল অমনিবক্স ও ইন্সট্যান্ট সার্চ শর্টকাট।
 */
export const GLOBAL_SEARCH_HOTKEY = 'Ctrl+K';
