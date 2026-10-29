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
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly iconName: string;
  readonly badge?: string | null;
  readonly permission?: string;
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
  readonly id: string;
  readonly title: string;
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
    id: 'merchandising',
    title: 'Merchandising',
    items: [
      {
        id: 'buyers',
        label: 'Buyers & Brands',
        path: '/app/merchandising/buyers',
        iconName: 'Building2',
        permission: 'BUYER:MENU',
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

export interface FactoryUnit {
  readonly id: string;
  readonly code: string;
  readonly name: string;
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

export const GLOBAL_SEARCH_HOTKEY = 'Ctrl+K';
