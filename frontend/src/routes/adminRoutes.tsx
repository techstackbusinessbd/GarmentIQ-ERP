/**
 * =============================================================================
 * [EN] Factory System Administration Routes (adminRoutes.tsx)
 * [BN] ফ্যাক্টরি সিস্টেম প্রশাসন রাউটস (adminRoutes.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] ক্লায়েন্ট অ্যাপ (/app/admin/*) এর আওতাধীন ৪টি কোর অ্যাডমিন মডিউল:
 *      ১. User Management (/app/admin/users)
 *      ২. Privilege & Roles (/app/admin/privileges)
 *      ৩. System Settings (/app/admin/settings)
 *      ৪. Master Library (/app/admin/library)
 */

import React from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth';
import { UserManagementPage, UserCreatePage, UserEditPage, UserPasswordResetPage } from '@/features/users';

import { PrivilegeManagementPage, AccessMatrixPage, UserSpecialPermissionsPage, RoleCreatePage } from '@/features/privileges';
import {
  AuditLogPage,
  AutoCodeSettingsPage,
  FactoryShiftsPage,
  CurrencySettingsPage,
  SecuritySettingsPage,
} from '@/features/settings';
import {
  MasterUnitsPage,
  MasterSizesPage,
  MasterGarmentItemsPage,
  MasterColorsPage,
  MasterSeasonsPage,
  MasterDefectsPage,
} from '@/features/master';
import { ClientsPage, ClientCreatePage, ClientEditPage } from '@/features/clients';
import { ProfilePage } from '@/pages';

/**
 * [EN] Helper redirect preserving user ID parameter.
 * [BN] ইউজার আইডি প্যারামিটার অক্ষুণ্ণ রেখে সঠিক রুটে পাঠানোর সহায়ক কম্পোনেন্ট।
 */
const UserEditParamRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/app/admin/users/${id}/edit`} replace />;
};

/**
 * [EN] Helper redirect preserving client ID parameter.
 * [BN] ক্লায়েন্ট আইডি প্যারামিটার অক্ষুণ্ণ রেখে সঠিক রুটে পাঠানোর সহায়ক কম্পোনেন্ট।
 */
const ClientEditParamRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/app/admin/clients/${id}/edit`} replace />;
};

/**
 * [EN] Renders factory system administration routes with strict RBAC security gates.
 * [BN] ফ্যাক্টরি সিস্টেম প্রশাসন রাউটসমূহ এবং আরবিএসি সিকিউরিটি গেট রেন্ডারার।
 */
export const renderAdminRoutes = (): React.ReactNode => (
  <>
    {/* Admin Root Alias Redirect */}
    <Route path="/app/admin" element={<Navigate to="/app/admin/users" replace />} />

    {/* =====================================================================
     * User Profile & Workspace Preferences (/app/admin/profile & /app/admin/users/profile)
     * ===================================================================== */}
    <Route path="/app/admin/profile" element={<ProfilePage />} />
    <Route path="/app/admin/users/profile" element={<ProfilePage />} />
    <Route path="/app/profile" element={<Navigate to="/app/admin/profile" replace />} />
    <Route path="/profile" element={<Navigate to="/app/admin/profile" replace />} />

    {/* =====================================================================
     * Module 0: Client Directory & Multi-Tenant (ক্লায়েন্ট ডিরেক্টরি ও মাল্টি-টেন্যান্ট)
     * ===================================================================== */}
    <Route path="/app/admin/clients" element={<ProtectedRoute requiredPermission="TENANT:MENU"><ClientsPage /></ProtectedRoute>} />
    <Route path="/app/admin/clients/new" element={<ProtectedRoute requiredPermission="TENANT:CREATE"><ClientCreatePage /></ProtectedRoute>} />
    <Route path="/app/admin/clients/:id/edit" element={<ProtectedRoute requiredPermission="TENANT:EDIT"><ClientEditPage /></ProtectedRoute>} />

    {/* =====================================================================
     * Module 1: User Directory & Accounts (ব্যবহারকারী ডিরেক্টরি ও একাউন্টস)
     * ===================================================================== */}
    <Route path="/app/admin/users" element={<ProtectedRoute requiredPermission="USER:MENU"><UserManagementPage /></ProtectedRoute>} />
    <Route path="/app/admin/users/new" element={<ProtectedRoute requiredPermission="USER:CREATE"><UserCreatePage /></ProtectedRoute>} />
    <Route path="/app/admin/users/:id/edit" element={<ProtectedRoute requiredPermission="USER:EDIT"><UserEditPage /></ProtectedRoute>} />
    <Route path="/app/admin/users/reset-password" element={<ProtectedRoute requiredPermission={['PASSWORD_RESET:MENU', 'USER:RESET_PASSWORD']}><UserPasswordResetPage /></ProtectedRoute>} />
    <Route path="/app/admin/users/:id/reset-password" element={<ProtectedRoute requiredPermission={['PASSWORD_RESET:MENU', 'USER:RESET_PASSWORD']}><UserPasswordResetPage /></ProtectedRoute>} />
    <Route path="/app/admin/users/special-permissions" element={<ProtectedRoute requiredPermission={['SPECIAL_PERM:MENU', 'USER:SPECIAL_PERMISSION', 'ROLE:MENU']}><UserSpecialPermissionsPage /></ProtectedRoute>} />
    <Route path="/app/admin/users/:id/special-permissions" element={<ProtectedRoute requiredPermission={['SPECIAL_PERM:MENU', 'USER:SPECIAL_PERMISSION', 'ROLE:MENU']}><UserSpecialPermissionsPage /></ProtectedRoute>} />
    <Route path="/app/admin/users/:id/permissions" element={<ProtectedRoute requiredPermission={['SPECIAL_PERM:MENU', 'USER:SPECIAL_PERMISSION', 'ROLE:MENU']}><UserSpecialPermissionsPage /></ProtectedRoute>} />

    {/* =====================================================================
     * Module 2: Role Directory & Permissions (ভূমিকা ও অনুমতি / RBAC)
     * ===================================================================== */}
    <Route path="/app/admin/roles" element={<ProtectedRoute requiredPermission="ROLE:MENU"><PrivilegeManagementPage /></ProtectedRoute>} />
    <Route path="/app/admin/roles/new" element={<ProtectedRoute requiredPermission="ROLE:CREATE"><RoleCreatePage /></ProtectedRoute>} />
    <Route path="/app/admin/roles/matrix" element={<ProtectedRoute requiredPermission="ROLE:MENU"><AccessMatrixPage /></ProtectedRoute>} />
    <Route path="/app/admin/privileges/matrix" element={<Navigate to="/app/admin/roles/matrix" replace />} />
    <Route path="/app/admin/privileges" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/app/admin/matrix" element={<Navigate to="/app/admin/roles/matrix" replace />} />

    {/* =====================================================================
     * Module 3: Global Settings (গ্লোবাল সিস্টেম কনফিগারেশন পেজসমূহ)
     * ===================================================================== */}
    <Route path="/app/admin/settings/auto-code" element={<ProtectedRoute requiredPermission={['AUTO_CODE:MENU', 'AUTO_CODE:VIEW', 'SETTINGS:MENU']}><AutoCodeSettingsPage /></ProtectedRoute>} />
    <Route path="/app/admin/settings/shifts" element={<ProtectedRoute requiredPermission={['SHIFT:MENU', 'SHIFT:VIEW', 'SETTINGS:MENU']}><FactoryShiftsPage /></ProtectedRoute>} />
    <Route path="/app/admin/settings/currencies" element={<ProtectedRoute requiredPermission={['CURRENCY:MENU', 'CURRENCY:VIEW', 'SETTINGS:MENU']}><CurrencySettingsPage /></ProtectedRoute>} />
    <Route path="/app/admin/settings/security" element={<ProtectedRoute requiredPermission={['SECURITY:MENU', 'SECURITY:VIEW', 'SETTINGS:MENU']}><SecuritySettingsPage /></ProtectedRoute>} />
    <Route path="/app/admin/settings" element={<Navigate to="/app/admin/settings/auto-code" replace />} />
    <Route path="/app/admin/audit-logs" element={<ProtectedRoute requiredPermission={['AUDIT_LOG:MENU', 'AUDIT_LOG:VIEW', 'SETTINGS:MENU']}><AuditLogPage /></ProtectedRoute>} />
    <Route path="/app/admin/audit" element={<Navigate to="/app/admin/audit-logs" replace />} />
    <Route path="/app/admin/logs" element={<Navigate to="/app/admin/audit-logs" replace />} />

    {/* =====================================================================
     * Module 4: Global Library (মাস্টার লাইব্রেরি স্বতন্ত্র পেজসমূহ)
     * ===================================================================== */}
    <Route path="/app/admin/library/units" element={<ProtectedRoute requiredPermission="LIBRARY:MENU"><MasterUnitsPage /></ProtectedRoute>} />
    <Route path="/app/admin/library/sizes" element={<ProtectedRoute requiredPermission="LIBRARY:MENU"><MasterSizesPage /></ProtectedRoute>} />
    <Route path="/app/admin/library/items" element={<ProtectedRoute requiredPermission="LIBRARY:MENU"><MasterGarmentItemsPage /></ProtectedRoute>} />
    <Route path="/app/admin/library/colors" element={<ProtectedRoute requiredPermission="LIBRARY:MENU"><MasterColorsPage /></ProtectedRoute>} />
    <Route path="/app/admin/library/seasons" element={<ProtectedRoute requiredPermission="LIBRARY:MENU"><MasterSeasonsPage /></ProtectedRoute>} />
    <Route path="/app/admin/library/defects" element={<ProtectedRoute requiredPermission="LIBRARY:MENU"><MasterDefectsPage /></ProtectedRoute>} />
    <Route path="/app/admin/library" element={<Navigate to="/app/admin/library/units" replace />} />

    {/* =====================================================================
     * Backward-Compatibility Redirect Aliases (/app/settings/* -> /app/admin/*)
     * ===================================================================== */}
    <Route path="/app/settings/users" element={<Navigate to="/app/admin/users" replace />} />
    <Route path="/app/settings/users/new" element={<Navigate to="/app/admin/users/new" replace />} />
    <Route path="/app/settings/users/:id/edit" element={<UserEditParamRedirect />} />
    <Route path="/app/settings/master" element={<Navigate to="/app/admin/library" replace />} />
    <Route path="/app/settings/library" element={<Navigate to="/app/admin/library" replace />} />
    <Route path="/app/settings/sequences" element={<Navigate to="/app/admin/settings" replace />} />
    <Route path="/app/settings/privileges" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/app/settings/roles" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/app/settings" element={<Navigate to="/app/admin/users" replace />} />

    {/* Short Global Legacy Redirects */}
    <Route path="/settings/users/:id/edit" element={<UserEditParamRedirect />} />
    <Route path="/settings/users" element={<Navigate to="/app/admin/users" replace />} />
    <Route path="/settings/master" element={<Navigate to="/app/admin/library" replace />} />
    <Route path="/settings/sequences" element={<Navigate to="/app/admin/settings" replace />} />
    <Route path="/users/:id/edit" element={<UserEditParamRedirect />} />
    <Route path="/users" element={<Navigate to="/app/admin/users" replace />} />
    <Route path="/clients/new" element={<Navigate to="/app/admin/clients/new" replace />} />
    <Route path="/clients/:id/edit" element={<ClientEditParamRedirect />} />
    <Route path="/clients" element={<Navigate to="/app/admin/clients" replace />} />
    <Route path="/app/clients" element={<Navigate to="/app/admin/clients" replace />} />
    <Route path="/roles" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/privileges" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/settings/roles" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/settings/privileges" element={<Navigate to="/app/admin/roles" replace />} />
    <Route path="/master" element={<Navigate to="/app/admin/library" replace />} />
  </>
);
