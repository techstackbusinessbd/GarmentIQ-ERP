/**
 * =============================================================================
 * [EN] Enterprise Access Matrix Types & Role Presets (accessMatrixTypes.ts)
 * [BN] এন্টারপ্রাইজ অ্যাক্সেস ম্যাট্রিক্স টাইপস ও রোল প্রিসেটস (accessMatrixTypes.ts)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Centralized Constants)
 */

export type MatrixActionKey =
  | 'menu'
  | 'view'
  | 'profile'
  | 'create'
  | 'edit'
  | 'lock'
  | 'resetPassword'
  | 'specialPermission'
  | 'delete'
  | 'restore'
  | 'purge'
  | 'approve';

export interface MatrixActionDef {
  readonly code: string;
  readonly label: string;
}

/**
 * [EN] Level 3: Granular Feature Group / Actionable Screen Item
 * [BN] লেভেল ৩: গ্র্যানুলার ফিচার গ্রুপ ও স্ক্রিন আইটেম
 */
export interface MatrixFeatureDef {
  readonly id: string;
  readonly name: string;
  readonly path?: string;
  readonly actions: Record<MatrixActionKey, MatrixActionDef | null>;
}

/**
 * [EN] Level 2: Functional Subsystem Module Group within a Domain
 * [BN] লেভেল ২: ডোমেনের অন্তর্গত ফাংশনাল মডিউল গ্রুপ
 */
export interface MatrixModuleDef {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly features: readonly MatrixFeatureDef[];
}

/**
 * [EN] Level 1: Enterprise Business Bounded Context Domain
 * [BN] লেভেল ১: এন্টারপ্রাইজ বাউন্ডেড কনটেক্সট ডোমেন
 */
export interface MatrixDomainDef {
  readonly id: string;
  readonly title: string;
  readonly modules: readonly MatrixModuleDef[];
}

/**
 * [EN] Role permissions are now 100% database-driven and retrieved from PostgreSQL via roleService.
 * [BN] রোলের পারমিশন এখন ১০০% ডাটাবেজ নির্ভর এবং PostgreSQL থেকে roleService-এর মাধ্যমে আনীত হয়।
 */

