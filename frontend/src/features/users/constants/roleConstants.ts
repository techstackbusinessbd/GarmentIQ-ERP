/**
 * =============================================================================
 * [EN] Enterprise Role Definitions and Metadata Constants
 * [BN] এন্টারপ্রাইজ সিস্টেম রোল ও মেটাডেটা কনস্ট্যান্টস (রুল ১৯ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Author: Sadia Jahan (UI Lead) & Ariful Islam (Tech Lead)
 * [BN] বুটস্ট্র্যাপে শুধুমাত্র ৩টি ডিফল্ট সিস্টেম রোল; বাকি সমস্ত কাস্টম রোল অ্যাডমিন প্রয়োজনমতো তৈরি করবেন।
 */

/**
 * [EN] Metadata contract for enterprise security roles.
 * [BN] এন্টারপ্রাইজ সিকিউরিটি রোলের মেটাডেটা ইন্টারফেস।
 */
export interface RoleDefinition {
  /** [EN] Unique system role code / [BN] সিস্টেম রোল কোড */
  readonly code: string;

  /** [EN] Human-readable role title / [BN] মানবিকভাবে পাঠযোগ্য পদবী */
  readonly name: string;

  /** [EN] Functional operational scope description / [BN] দায়িত্ব ও কাজের পরিধি */
  readonly description: string;

  /** [EN] Visual badge accent variant / [BN] ব্যাজ অ্যাকসেন্ট ভ্যারিয়েন্ট */
  readonly badgeVariant: 'primary' | 'success' | 'warning' | 'info' | 'danger';

  /** [EN] Set of permissions assigned to this role / [BN] এই রোলে নির্ধারিত পারমিশন কোডস */
  readonly permissions?: readonly string[];

  /** [EN] System built-in role flag (cannot be deleted) / [BN] সিস্টেম বিল্ট-ইন রোল ফ্ল্যাগ */
  readonly isSystemRole?: boolean;

  /** [EN] Scoped tenant ID / [BN] সংশ্লিষ্ট কারখানার টেন্যান্ট আইডি */
  readonly tenantId?: string;

  /** [EN] Scoped tenant code / [BN] সংশ্লিষ্ট কারখানার কোড */
  readonly tenantCode?: string;

  /** [EN] Scoped tenant business name / [BN] সংশ্লিষ্ট কারখানার নাম */
  readonly tenantName?: string;

  /** [EN] Soft deletion flag / [BN] সফট ডিলিট ফ্ল্যাগ */
  readonly isDeleted?: boolean;
  readonly deleted?: boolean;
}

/**
 * [EN] 3 Standard Bootstrap System Roles for RMG & Denim ERP.
 * [BN] গার্মেন্টস ইআরপির ৩টি প্রমিত বুটস্ট্র্যাপ সিস্টেম রোল।
 */
export const ENTERPRISE_ROLES: readonly RoleDefinition[] = [
  {
    code: 'ROLE_SUPER_ADMIN',
    name: 'System Super Admin',
    description: 'Full multi-tenant system governance, security audits, and global tenant management.',
    badgeVariant: 'danger',
    isSystemRole: true,
  },
  {
    code: 'ROLE_ADMIN',
    name: 'Factory Admin',
    description: 'Factory-level user administration, custom role management, auto-code configuration, and audit logs.',
    badgeVariant: 'primary',
    isSystemRole: true,
  },
  {
    code: 'ROLE_USER',
    name: 'General User',
    description: 'Base platform access for standard factory employees with operational profile view.',
    badgeVariant: 'info',
    isSystemRole: true,
  },
];

/**
 * [EN] Helper map to quickly lookup default bootstrap role definition by code.
 * [BN] কোড দিয়ে দ্রুত রোল মেটাডেটা খোঁজার ম্যাপ।
 */
export const ROLE_MAP: Record<string, RoleDefinition> = ENTERPRISE_ROLES.reduce(
  (acc, role) => {
    acc[role.code] = role;
    return acc;
  },
  {} as Record<string, RoleDefinition>
);
