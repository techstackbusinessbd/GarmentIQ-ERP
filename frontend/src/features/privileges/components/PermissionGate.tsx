/**
 * =============================================================================
 * [EN] Enterprise UI Permission Gate Component (PermissionGate.tsx)
 * [BN] এন্টারপ্রাইজ ইউআই পারমিশন গেট কম্পোনেন্ট (PermissionGate.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] পারমিশনের ভিত্তিতে পেজের ভেতরের বাটন ও এলিমেন্ট স্বয়ংক্রিয়ভাবে প্রদর্শন বা নিষ্ক্রিয় করে।
 */

import React from 'react';
import { usePermission } from '../hooks/usePermission';

export interface PermissionGateProps {
  /** [EN] Single required permission code / [BN] একক আবশ্যিক পারমিশন কোড */
  readonly permission?: string;
  /** [EN] Array of permissions where at least one must match / [BN] যেকোনো একটি মেলা আবশ্যিক */
  readonly anyPermissions?: readonly string[];
  /** [EN] Action when unauthorized: 'hide' (default) or 'disable' / [BN] অননুমোদিত আচরণ */
  readonly mode?: 'hide' | 'disable';
  /** [EN] Explanatory tooltip shown on disabled element / [BN] ডিসেবল অবস্থায় টুলটিপ */
  readonly tooltip?: string;
  /** [EN] Target UI elements / [BN] নিয়ন্ত্রিত ইউআই এলিমেন্টস */
  readonly children: React.ReactNode;
}

/**
 * [EN] Declarative wrapper controlling action element authorization.
 * [BN] অ্যাকশন বাটন ও উপাদানের প্রবেশাধিকার নিয়ন্ত্রণকারী ডিক্লারেটিভ কম্পোনেন্ট।
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  anyPermissions,
  mode = 'hide',
  tooltip = 'You do not have permission to execute this action.',
  children,
}) => {
  const { hasPermission, hasAnyPermission, isSuperAdmin } = usePermission();

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  let isAuthorized = true;

  if (permission) {
    isAuthorized = hasPermission(permission);
  } else if (anyPermissions && anyPermissions.length > 0) {
    isAuthorized = hasAnyPermission(anyPermissions);
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  if (mode === 'hide') {
    return null;
  }

  return (
    <div
      className="inline-block opacity-45 cursor-not-allowed select-none pointer-events-none transition-opacity"
      title={tooltip}
      aria-disabled="true"
    >
      {children}
    </div>
  );
};
