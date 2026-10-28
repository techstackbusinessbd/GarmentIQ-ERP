/**
 * =============================================================================
 * [EN] Enterprise Access Level Utilities (accessLevelUtils.ts)
 * [BN] এন্টারপ্রাইজ অ্যাক্সেস লেভেল ও মডিউল/ফিচার পারমিশন ইউটিলিটি
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Constants)
 * [BN] ৩-লেভেল হায়ারার্কিতে (Domain ➔ Module ➔ Feature) ৪-লেভেল অ্যাক্সেস কন্ট্রোল ও অটো-মেনু সিঙ্ক।
 */

import type {
  MatrixDomainDef,
  MatrixModuleDef,
  MatrixFeatureDef,
} from '../constants/accessMatrixTypes';

export type ModuleAccessLevel = 'NONE' | 'VIEW' | 'EDIT' | 'FULL' | 'CUSTOM';

export interface LevelOptionDef {
  readonly level: ModuleAccessLevel;
  readonly label: string;
  readonly shortDesc: string;
  readonly activeColor: string;
  readonly activeBorder: string;
  readonly badgeBg: string;
}

export const ACCESS_LEVEL_OPTIONS: readonly LevelOptionDef[] = [
  {
    level: 'NONE',
    label: 'No Access',
    shortDesc: 'Cannot view or access',
    activeColor: 'text-text-muted bg-surface-muted',
    activeBorder: 'border-border-subtle',
    badgeBg: 'bg-surface-muted text-text-muted',
  },
  {
    level: 'VIEW',
    label: 'View Only',
    shortDesc: 'Sidebar menu & read-only access',
    activeColor: 'text-status-info bg-status-info-bg',
    activeBorder: 'border-status-info-border',
    badgeBg: 'bg-status-info-bg text-status-info border border-status-info-border',
  },
  {
    level: 'EDIT',
    label: 'Can Edit',
    shortDesc: 'Read, create, and modify data',
    activeColor: 'text-status-success bg-status-success-bg',
    activeBorder: 'border-status-success-border',
    badgeBg: 'bg-status-success-bg text-status-success border border-status-success-border',
  },
  {
    level: 'FULL',
    label: 'Full Admin',
    shortDesc: 'Unrestricted create, edit, delete & approve',
    activeColor: 'text-brand-accent bg-brand-accent/10',
    activeBorder: 'border-brand-accent/30',
    badgeBg: 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20',
  },
] as const;

export const LEVEL_RANKS: Record<ModuleAccessLevel, number> = {
  NONE: 0,
  CUSTOM: 0,
  VIEW: 1,
  EDIT: 2,
  FULL: 3,
};

/**
 * [EN] Extracts all valid permission codes defined on a given feature.
 * [BN] নির্দিষ্ট ফিচারে বিদ্যমান সকল বৈধ পারমিশন কোডের তালিকা প্রদান করে।
 */
export const getFeatureAllCodes = (feature: MatrixFeatureDef): string[] => {
  return Object.values(feature.actions)
    .filter((a): a is { code: string; label: string } => a !== null)
    .map((a) => a.code);
};

/**
 * [EN] Resolves the effective 4-level tier of a feature given active permissions.
 * [BN] পারমিশন সেটের ভিত্তিতে একটি ফিচারের কার্যকর অ্যাক্সেস লেভেল নির্ধারণ করে।
 */
export const resolveFeatureLevel = (
  feature: MatrixFeatureDef,
  activePermissions: ReadonlySet<string>
): ModuleAccessLevel => {
  const allCodes = getFeatureAllCodes(feature);
  if (allCodes.length === 0) return 'NONE';

  const granted = allCodes.filter((c) => activePermissions.has(c));
  if (granted.length === 0) return 'NONE';

  // Check FULL clearance
  if (allCodes.every((c) => activePermissions.has(c))) {
    return 'FULL';
  }

  const hasView = feature.actions.view ? activePermissions.has(feature.actions.view.code) : false;
  const hasProfile = feature.actions.profile ? activePermissions.has(feature.actions.profile.code) : false;
  const hasCreate = feature.actions.create ? activePermissions.has(feature.actions.create.code) : false;
  const hasEdit = feature.actions.edit ? activePermissions.has(feature.actions.edit.code) : false;
  const hasLock = feature.actions.lock ? activePermissions.has(feature.actions.lock.code) : false;
  const hasResetPassword = feature.actions.resetPassword ? activePermissions.has(feature.actions.resetPassword.code) : false;
  const hasDelete = feature.actions.delete ? activePermissions.has(feature.actions.delete.code) : false;
  const hasSpecialPermission = feature.actions.specialPermission ? activePermissions.has(feature.actions.specialPermission.code) : false;
  const hasApprove = feature.actions.approve ? activePermissions.has(feature.actions.approve.code) : false;

  // Check VIEW ONLY: has view (and optional menu/profile), but NO mutating actions
  const hasMutating = hasCreate || hasEdit || hasLock || hasResetPassword || hasDelete || hasSpecialPermission || hasApprove;
  if ((hasView || hasProfile) && !hasMutating) {
    return 'VIEW';
  }

  // Check EDIT: has view, has create/edit/lock/resetPassword, but NO admin governance/destructive actions
  const hasHighGovernance = hasDelete || hasSpecialPermission || hasApprove;
  if (hasView && (hasCreate || hasEdit || hasLock || hasResetPassword) && !hasHighGovernance) {
    return 'EDIT';
  }

  return 'CUSTOM';
};

/**
 * [EN] Applies a target access level to a feature with automatic menu linking.
 * [BN] অটো-মেনু সিঙ্ক সহ ফিচারে নির্দিষ্ট অ্যাক্সেস লেভেল প্রয়োগ করে নতুন সেট প্রদান করে।
 */
export const applyFeatureLevel = (
  feature: MatrixFeatureDef,
  level: ModuleAccessLevel,
  currentPermissions: ReadonlySet<string>
): Set<string> => {
  const next = new Set<string>(currentPermissions);
  const allCodes = getFeatureAllCodes(feature);

  // 1. Purge current feature permissions
  allCodes.forEach((c) => next.delete(c));

  if (level === 'NONE') {
    return next;
  }

  // 2. Automatically grant sidebar menu for any non-none level
  if (feature.actions.menu) next.add(feature.actions.menu.code);

  if (level === 'VIEW') {
    if (feature.actions.view) next.add(feature.actions.view.code);
    if (feature.actions.profile) next.add(feature.actions.profile.code);
    return next;
  }

  if (level === 'EDIT') {
    if (feature.actions.view) next.add(feature.actions.view.code);
    if (feature.actions.profile) next.add(feature.actions.profile.code);
    if (feature.actions.create) next.add(feature.actions.create.code);
    if (feature.actions.edit) next.add(feature.actions.edit.code);
    if (feature.actions.lock) next.add(feature.actions.lock.code);
    if (feature.actions.resetPassword) next.add(feature.actions.resetPassword.code);
    return next;
  }

  if (level === 'FULL') {
    allCodes.forEach((c) => next.add(c));
    return next;
  }

  return next;
};

/**
 * [EN] Toggles individual permission with guaranteed auto-menu synchronization.
 * [BN] গ্যারান্টেড অটো-মেনু সিঙ্কসহ একক পারমিশন টগল করার সহায়ক ফাংশন।
 */
export const toggleFeatureActionWithAutoMenu = (
  feature: MatrixFeatureDef,
  targetCode: string,
  currentPermissions: ReadonlySet<string>
): Set<string> => {
  const next = new Set<string>(currentPermissions);
  const isCurrentlyGranted = next.has(targetCode);

  if (isCurrentlyGranted) {
    next.delete(targetCode);
    // If no operational action remains in feature, remove menu code too
    const remainingNonMenu = Object.entries(feature.actions)
      .filter(([key, a]) => key !== 'menu' && a !== null)
      .some(([_, a]) => next.has(a!.code));
    if (!remainingNonMenu && feature.actions.menu) {
      next.delete(feature.actions.menu.code);
    }
  } else {
    next.add(targetCode);
    // Auto-grant sidebar menu whenever any operational action is added
    if (feature.actions.menu) {
      next.add(feature.actions.menu.code);
    }
  }

  return next;
};

/**
 * [EN] Applies bulk access level across all features of a module group.
 * [BN] একটি মডিউলের সকল ফিচারে এক ক্লিকে বাল্ক অ্যাক্সেস লেভেল প্রয়োগ করে।
 */
export const applyModuleLevel = (
  module: MatrixModuleDef,
  level: ModuleAccessLevel,
  currentPermissions: ReadonlySet<string>
): Set<string> => {
  let next = new Set<string>(currentPermissions);
  module.features.forEach((feat) => {
    next = applyFeatureLevel(feat, level, next);
  });
  return next;
};

/**
 * [EN] Applies bulk access level across all modules & features of a domain.
 * [BN] একটি ডোমেনের সকল মডিউল ও ফিচারে এক ক্লিকে বাল্ক অ্যাক্সেস লেভেল প্রয়োগ করে।
 */
export const applyDomainLevel = (
  domain: MatrixDomainDef,
  level: ModuleAccessLevel,
  currentPermissions: ReadonlySet<string>
): Set<string> => {
  let next = new Set<string>(currentPermissions);
  domain.modules.forEach((mod) => {
    mod.features.forEach((feat) => {
      next = applyFeatureLevel(feat, level, next);
    });
  });
  return next;
};

// Module group helpers & backwards compatibility aliases
export const getModuleAllCodes = (module: MatrixModuleDef): string[] => {
  return module.features.flatMap((feat) => getFeatureAllCodes(feat));
};

export const resolveModuleGroupLevel = (
  module: MatrixModuleDef,
  activePermissions: ReadonlySet<string>
): ModuleAccessLevel => {
  if (module.features.length === 0) return 'NONE';
  const levels = module.features.map((f) => resolveFeatureLevel(f, activePermissions));
  if (levels.every((l) => l === levels[0])) return levels[0]!;
  return 'CUSTOM';
};

export const resolveModuleLevel = resolveFeatureLevel;
export const toggleActionWithAutoMenu = toggleFeatureActionWithAutoMenu;

