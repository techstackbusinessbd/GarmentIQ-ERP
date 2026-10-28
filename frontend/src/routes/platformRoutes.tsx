/**
 * =============================================================================
 * [EN] SaaS Platform Administration Routes (platformRoutes.tsx)
 * [BN] ক্লাউড সাশ প্ল্যাটফর্ম অ্যাডমিনিস্ট্রেশন রাউটস (platformRoutes.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] সাশ প্রোভাইডার অ্যাডমিন পোর্টাল রাউটসমূহ (/platform/* প্রিফিক্স)।
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

/**
 * [EN] Permanent backwards-compatibility redirects for eliminated /platform/* paths.
 * [BN] অপসারিত /platform/* পাথের জন্য ইউনিফায়েড /app/* পাথে স্বয়ংক্রিয় স্থায়ী রিডাইরেক্ট রেন্ডারার।
 */
export const renderPlatformRoutes = (): React.ReactNode => (
  <>
    {/* Permanent Redirects from legacy /platform to unified /app */}
    <Route path="/platform" element={<Navigate to="/app/overview/dashboard" replace />} />
    <Route path="/platform/dashboard" element={<Navigate to="/app/overview/dashboard" replace />} />
    <Route path="/platform/tenants" element={<Navigate to="/app/admin/clients" replace />} />
    <Route path="/platform/clients" element={<Navigate to="/app/admin/clients" replace />} />
    <Route path="/platform/users" element={<Navigate to="/app/admin/users" replace />} />
    <Route path="/platform/settings" element={<Navigate to="/app/admin/settings" replace />} />
  </>
);

