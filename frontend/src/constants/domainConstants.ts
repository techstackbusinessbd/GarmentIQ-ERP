/**
 * =============================================================================
 * [EN] Domain Registry & 2-Level Navigation Hierarchy (domainConstants.ts)
 * [BN] ডোমেন রেজিস্ট্রি ও ২-লেভেল নেভিগেশন হায়ারার্কি কনস্ট্যান্টস (রুল ০৭, ১৫, ১৯ অনুবর্তী)
 * =============================================================================
 */

import type { NavGroup } from './navigationConstants';

/**
 * [EN] Contract for top-level operational domain item in the secondary topbar.
 * [BN] ২য় টপবারে প্রদর্শিত শীর্ষস্থানীয় অপারেশনাল ডোমেন ডেফিনেশন ইন্টারফেস।
 */
export interface DomainItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly iconName: string;
  readonly rootPrefix: string;
  readonly badge?: string | null;
  readonly groups: readonly NavGroup[];
}

/**
 * [EN] Core Factory Operational Domains (1-word concise names).
 * [BN] গার্মেন্টস ফ্যাক্টরি অপারেশনের মূল ডোমেনসমূহ (১-শব্দের সংক্ষিপ্ত নাম)।
 */
export const ERP_DOMAINS: readonly DomainItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/app/overview/dashboard',
    iconName: 'LayoutDashboard',
    rootPrefix: '/app/overview',
    groups: [
      {
        id: 'overview-main',
        title: 'Executive Insights',
        items: [{ id: 'dashboard-kpi', label: 'Overview & Analytics', path: '/app/overview/dashboard', iconName: 'LayoutDashboard' }],
      },
    ],
  },
  {
    id: 'merchandising',
    label: 'Merchandising',
    path: '/app/merchandising/buyers',
    iconName: 'Shirt',
    rootPrefix: '/app/merchandising',
    groups: [
      {
        id: 'merch-buyer-group',
        title: 'Buyer & Brand',
        items: [
          {
            id: 'merch-buyers-list',
            label: 'Buyer Directory',
            path: '/app/merchandising/buyers',
            iconName: 'Building2',
            permission: 'BUYER:MENU',
          },
        ],
      },
      {
        id: 'merch-orders-group',
        title: 'Orders & Costing',
        items: [
          {
            id: 'merch-orders-list',
            label: 'Buyer Orders (PO)',
            path: '/app/merchandising/orders',
            iconName: 'Layers',
          },
          {
            id: 'merch-styles-list',
            label: 'Styles & Tech-Packs',
            path: '/app/merchandising/styles',
            iconName: 'Shirt',
          },
          {
            id: 'merch-costing-list',
            label: 'BOM & Costing',
            path: '/app/merchandising/costing',
            iconName: 'DollarSign',
          },
        ],
      },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    path: '/app/admin/users',
    iconName: 'Shield',
    rootPrefix: '/app/admin',
    groups: [
      {
        id: 'admin-clients-group',
        title: 'Client Management',
        items: [
          { id: 'admin-clients-list', label: 'Client Directory', path: '/app/admin/clients', iconName: 'Building2', permission: 'TENANT:MENU' },
          { id: 'admin-clients-new', label: 'New Client', path: '/app/admin/clients/new', iconName: 'Plus', permission: 'TENANT:CREATE' },
        ],
      },
      {
        id: 'admin-users-group',
        title: 'User Management',
        items: [
          { id: 'admin-users-list', label: 'User Directory', path: '/app/admin/users', iconName: 'Users', permission: 'USER:MENU' },
          { id: 'admin-users-special-permissions', label: 'Special Permissions', path: '/app/admin/users/special-permissions', iconName: 'ShieldAlert', permission: 'SPECIAL_PERM:MENU' },
          { id: 'admin-users-new', label: 'New User', path: '/app/admin/users/new', iconName: 'UserPlus', permission: 'USER:CREATE' },
          { id: 'admin-password-reset', label: 'Password Reset', path: '/app/admin/users/reset-password', iconName: 'KeyRound', permission: 'PASSWORD_RESET:MENU' },
          { id: 'admin-profile', label: 'User Profile', path: '/app/admin/profile', iconName: 'User', permission: 'PROFILE:MENU' },
        ],
      },
      {
        id: 'admin-privilege-group',
        title: 'Privilege Management',
        items: [
          { id: 'admin-roles', label: 'Role Management', path: '/app/admin/roles', iconName: 'ShieldCheck', permission: 'ROLE:MENU' },
          { id: 'admin-matrix', label: 'Role Access Matrix', path: '/app/admin/roles/matrix', iconName: 'SlidersHorizontal', permission: 'ROLE:MENU' },
        ],
      },
      {
        id: 'admin-settings-group',
        title: 'Global Settings',
        items: [
          { id: 'admin-settings-autocode', label: 'Auto-Code Formats', path: '/app/admin/settings/auto-code', iconName: 'Binary', permission: 'SETTINGS:MENU' },
          { id: 'admin-settings-shifts', label: 'Factory Shifts', path: '/app/admin/settings/shifts', iconName: 'Clock', permission: 'SETTINGS:MENU' },
          { id: 'admin-settings-currencies', label: 'Currencies & Rates', path: '/app/admin/settings/currencies', iconName: 'DollarSign', permission: 'SETTINGS:MENU' },
          { id: 'admin-settings-security', label: 'Platform Security', path: '/app/admin/settings/security', iconName: 'Shield', permission: 'SETTINGS:MENU' },
          { id: 'admin-audit-logs', label: 'Audit Logs', path: '/app/admin/audit-logs', iconName: 'History', permission: 'SETTINGS:MENU' },
        ],
      },
      {
        id: 'admin-library-group',
        title: 'Global Library',
        items: [
          { id: 'admin-library-units', label: 'Measurement Units', path: '/app/admin/library/units', iconName: 'Ruler', permission: 'UNIT:MENU' },
          { id: 'admin-library-sizes', label: 'Garment Sizes', path: '/app/admin/library/sizes', iconName: 'Tag', permission: 'SIZE:MENU' },
          { id: 'admin-library-items', label: 'Garment Items', path: '/app/admin/library/items', iconName: 'Shirt', permission: 'ITEM:MENU' },
          { id: 'admin-library-colors', label: 'Colors & Pantones', path: '/app/admin/library/colors', iconName: 'Palette', permission: 'COLOR:MENU' },
          { id: 'admin-library-seasons', label: 'Export Seasons', path: '/app/admin/library/seasons', iconName: 'Calendar', permission: 'SEASON:MENU' },
          { id: 'admin-library-defects', label: 'Quality Defects', path: '/app/admin/library/defects', iconName: 'AlertTriangle', permission: 'DEFECT:MENU' },
        ],
      },
    ],
  },
];
