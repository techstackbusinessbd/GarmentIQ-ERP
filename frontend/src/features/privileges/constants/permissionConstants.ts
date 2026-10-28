/**
 * =============================================================================
 * [EN] Core Functional Permission Constants & Matrix Rules (permissionConstants.ts)
 * [BN] কোর ফাংশনাল পারমিশন কনস্ট্যান্টস ও ম্যাট্রিক্স নীতিমালা (permissionConstants.ts)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Centralized Constants)
 * [BN] আরএমজি ও ডেনিম প্ল্যাটফর্মের ১০টি কোর ফাংশনাল পারমিশনের কেন্দ্রীয় সংজ্ঞা ও রোল ম্যাপিং।
 */

/**
 * [EN] Core Functional Permission Interface.
 * [BN] কোর ফাংশনাল পারমিশন ইন্টারফেস।
 */
export interface PermissionItem {
  /** [EN] Unique permission action key / [BN] অনন্য পারমিশন অ্যাকশন কোড */
  readonly code: string;
  /** [EN] Human-readable English title / [BN] সহজবোধ্য ইংরেজি শিরোনাম */
  readonly name: string;
  /** [EN] Garments ERP functional module / [BN] সংশ্লিষ্ট আরএমজি মডিউল */
  readonly module: 'ADMIN' | 'MERCHANDISING' | 'CUTTING' | 'SEWING' | 'QA' | 'FINISHING' | 'COMMERCIAL';
  /** [EN] Detailed operational scope / [BN] বিস্তারিত কাজের পরিধি */
  readonly description: string;
  /** [EN] Array of standard role codes granted this permission / [BN] অনুমোদিত রোলসমূহের তালিকা */
  readonly allowedRoles: readonly string[];
}

/**
 * [EN] 10 Core Functional Apparel Permissions.
 * [BN] পোশাক কারখানার ১০টি কোর ফাংশনাল পারমিশন।
 */
export const CORE_PERMISSIONS: readonly PermissionItem[] = [
  {
    code: 'TENANT:MANAGE',
    name: 'Tenant Organization Admin',
    module: 'ADMIN',
    description: 'Create and configure tenant factories, licensing tiers, and units.',
    allowedRoles: ['ROLE_SUPER_ADMIN'],
  },
  {
    code: 'USER:MANAGE',
    name: 'User & Profile Management',
    module: 'ADMIN',
    description: 'Add, edit, assign roles, and deactivate user and operator accounts.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
  },
  {
    code: 'SEQUENCE:CONFIG',
    name: 'Auto-Code Templates',
    module: 'ADMIN',
    description: 'Configure dynamic prefixes, reset periods, and auto-code numbering formats.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
  },
  {
    code: 'ORDER:READ',
    name: 'View Buyer Orders & Tech-Packs',
    module: 'MERCHANDISING',
    description: 'Inspect tech-packs, purchase orders, BOM specs, and sample approvals.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MERCHANDISER', 'ROLE_EXECUTIVE_VIEWER'],
  },
  {
    code: 'ORDER:WRITE',
    name: 'Create & Cost POs (BOM)',
    module: 'MERCHANDISING',
    description: 'Build fabric consumption formulas, CM costing, and fabric bookings.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MERCHANDISER'],
  },
  {
    code: 'CUTTING:EXECUTE',
    name: 'Marker Planning & Cutting Orders',
    module: 'CUTTING',
    description: 'Calculate shrinkage ratio, generate lay orders, and cut bundle QR/RFID tags.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_CUTTING_MANAGER'],
  },
  {
    code: 'SEWING:MONITOR',
    name: 'Line Output & Bundle Tracking',
    module: 'SEWING',
    description: 'Track operator bundle scans, hourly line balancing, and output targets.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SEWING_SUPERVISOR'],
  },
  {
    code: 'QA:AUDIT_PASS',
    name: '4-Point Fabric & AQL Inspection',
    module: 'QA',
    description: 'Conduct inline/endline inspections, issue defect maps and AQL 2.5 certificates.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_QA_INSPECTOR'],
  },
  {
    code: 'WASH:RECIPE',
    name: 'Denim Laundry & Wash Batches',
    module: 'FINISHING',
    description: 'Execute enzyme stone, ozone bleach recipes, and carton RFID packing scans.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_FINISHING_MANAGER'],
  },
  {
    code: 'EXPORT:INVOICE',
    name: 'Commercial Invoices & Gate Pass',
    module: 'COMMERCIAL',
    description: 'Issue container export invoices, BL forwarder tracking, and e-gate passes.',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_COMMERCIAL_OFFICER'],
  },
];

/**
 * [EN] Retrieves all permissions granted to a given role code.
 * [BN] নির্দিষ্ট রোল কোডের অনুকূলে মঞ্জুরীকৃত সমস্ত পারমিশন ফিল্টার করার সহায়ক ফাংশন।
 */
export const getPermissionsForRole = (roleCode: string): PermissionItem[] => {
  return CORE_PERMISSIONS.filter((perm) => perm.allowedRoles.includes(roleCode));
};
