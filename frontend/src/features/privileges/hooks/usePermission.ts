/**
 * =============================================================================
 * [EN] Enterprise User RBAC Permission Hook (usePermission.ts)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী পারমিশন যাচাইকারী হুক (usePermission.ts)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 16 (Zero AI Vibe)
 * [BN] ইউজার রোল, পারমিশন ও সাইডবার মেনু ভিজিবিলিটি মূল্যায়নকারী হুক।
 */

import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store';
import type { MatrixActionKey } from '../constants/accessMatrixConstants';

export interface UsePermissionReturn {
  /** [EN] Root super admin flag / [BN] প্ল্যাটফর্ম সুপার অ্যাডমিন কি না */
  readonly isSuperAdmin: boolean;
  /** [EN] All granted permission codes / [BN] মঞ্জুরীকৃত সমস্ত পারমিশন কোড */
  readonly permissions: ReadonlySet<string>;
  /** [EN] Checks if user holds a single permission / [BN] নির্দিষ্ট পারমিশন আছে কি না */
  readonly hasPermission: (permissionCode: string) => boolean;
  /** [EN] Checks if user holds at least one permission / [BN] যেকোনো একটি পারমিশন আছে কি না */
  readonly hasAnyPermission: (permissionCodes: readonly string[]) => boolean;
  /** [EN] Checks if user holds all specified permissions / [BN] সবগুলো পারমিশন আছে কি না */
  readonly hasAllPermissions: (permissionCodes: readonly string[]) => boolean;
  /** [EN] Checks permission by module and action / [BN] মডিউল ও অ্যাকশন দ্বারা যাচাই */
  readonly can: (moduleName: string, action: MatrixActionKey) => boolean;
  /** [EN] Checks if a module is allowed in sidebar navigation / [BN] সাইডবার মেনু দৃশ্যমান কি না */
  readonly isMenuVisible: (moduleCodeOrPerm: string) => boolean;
}

/**
 * [EN] Reactive hook resolving active user authorities and permission gates.
 * [BN] সক্রিয় ব্যবহারকারীর আরবিএসি অধিকার ও গেট যাচাইকারী রিঅ্যাক্টিভ হুক (ম্যাট্রিক্সের সাথে লাইভ সিঙ্ক)।
 */
export const usePermission = (): UsePermissionReturn => {
  const { user } = useAuthStore();
  const [updateTick, setUpdateTick] = useState<number>(0);

  // [EN] Subscribe to dynamic matrix updates across the application
  // [BN] অ্যাপ্লিকেশন জুড়ে ডাইনামিক ম্যাট্রিক্স পরিবর্তনের সাথে সাথে স্টেট রিফ্রেশ
  useEffect(() => {
    const handlePermissionsUpdated = () => {
      useAuthStore.getState().fetchProfile().finally(() => setUpdateTick((t) => t + 1));
    };
    window.addEventListener('garments_erp_permissions_updated', handlePermissionsUpdated);
    window.addEventListener('storage', handlePermissionsUpdated);
    return () => {
      window.removeEventListener('garments_erp_permissions_updated', handlePermissionsUpdated);
      window.removeEventListener('storage', handlePermissionsUpdated);
    };
  }, []);

  const isSuperAdmin = useMemo(() => {
    if (!user) return false;
    return (
      user.username?.toLowerCase() === 'superadmin' ||
      user.roles?.includes('ROLE_SUPER_ADMIN') ||
      user.roles?.includes('SUPER_ADMIN')
    );
  }, [user]);

  const permissions = useMemo(() => {
    if (!user) return new Set<string>();
    if (isSuperAdmin) {
      return new Set<string>(['*']);
    }

    const granted = new Set<string>();

    // [EN] Authoritative permissions provided dynamically by the server from PostgreSQL
    // [BN] পোস্টগ্রেসকিউএল ডাটাবেজ থেকে সার্ভার প্রদত্ত পারমিশনই একমাত্র একক সত্য
    if (Array.isArray(user.permissions)) {
      user.permissions.forEach((p) => granted.add(p));
    }

    return granted;
  }, [user, isSuperAdmin, updateTick]);

  const hasPermission = (code: string): boolean => {
    if (!user) return false;
    if (isSuperAdmin || permissions.has('*')) return true;
    return permissions.has(code);
  };

  const hasAnyPermission = (codes: readonly string[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin || permissions.has('*')) return true;
    return codes.some((code) => permissions.has(code));
  };

  const hasAllPermissions = (codes: readonly string[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin || permissions.has('*')) return true;
    return codes.every((code) => permissions.has(code));
  };

  const can = (moduleName: string, action: MatrixActionKey): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    const targetCode = `${moduleName.toUpperCase()}:${action.toUpperCase()}`;
    return hasPermission(targetCode);
  };

  const isMenuVisible = (moduleCodeOrPerm: string): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    const clean = moduleCodeOrPerm.toUpperCase();
    const perm = clean.includes(':') ? clean : `${clean}:MENU`;
    return hasPermission(perm);
  };

  return {
    isSuperAdmin,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    isMenuVisible,
  };
};
