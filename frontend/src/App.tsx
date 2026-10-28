/**
 * =============================================================================
 * [EN] Master App Component with Page-Driven React Router Configuration
 * [BN] পেজ-ড্রিভেন রিঅ্যাক্ট রাউটার কনফিগারেশন সহ মূল অ্যাপ কম্পোনেন্ট (রুল ০৭ ও ১৫ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Design Tokens)
 * [BN] রুল ০৭ ও রুল ১৫ মেনে সম্পূর্ণ দ্বিভাষিক কমেন্ট সমৃদ্ধ মূল রাউটার কনফিগারেশন।
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, GuestRoute } from '@/components/auth';
import { LoginPage } from '@/pages';
import { renderDomainRoutes, getDefaultDashboardPath } from '@/routes';
import { useAuthStore } from '@/store';
import { subscribeToSessionEvents } from '@/utils';

/**
 * [EN] Root landing component that conditionally redirects authenticated users to the
 * unified dashboard (/app/overview/dashboard), or unauthenticated guests to /login.
 *
 * [BN] মূল রুট রিডাইরেক্ট কম্পোনেন্ট: অথেনটিকেটেড ইউজারদের ইউনিফায়েড ড্যাশবোর্ডে পাঠায়।
 */
const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to={getDefaultDashboardPath(user)} replace />;
  }
  return <Navigate to="/login" replace />;
};

/**
 * [EN] Root Application Component.
 * Sets up the browser routing hierarchy, global Sonner toast manager, and default page shells.
 *
 * [BN] মূল অ্যাপ্লিকেশন কম্পোনেন্ট।
 * ব্রাউজার রাউটিং হায়ারার্কি, গ্লোবাল টোস্ট নোটিফিকেশন ম্যানেজার এবং সুরক্ষিত এন্টারপ্রাইজ শেল পরিচালনা করে।
 *
 * @returns [EN] Rendered root React tree / [BN] রেন্ডারকৃত রিঅ্যাক্ট অ্যাপ্লিকেশন
 */
export const App: React.FC = () => {
  React.useEffect(() => {
    const unsubscribe = subscribeToSessionEvents(
      () => {
        // [EN] Another tab logged out; synchronize current tab without echoing broadcast
        // [BN] অন্য ট্যাব লগআউট করেছে; পুনরায় ব্রডকাস্ট প্রতিধ্বনি না করে বর্তমান ট্যাব সিঙ্ক করা
        useAuthStore.getState().logout(false);
      },
      () => {
        // [EN] Another tab logged in; sync auth state
        // [BN] অন্য ট্যাব লগইন করেছে; অথ স্টেট সিঙ্ক করা
        if (!useAuthStore.getState().isAuthenticated) {
          useAuthStore.getState().fetchProfile();
        }
      }
    );

    // [EN] Synchronize live permissions on window focus or tab visibility
    // [BN] ব্যবহারকারী উইন্ডো বা ট্যাবে ফিরে আসলে ব্যাকএন্ড থেকে সর্বশেষ পারমিশন সিঙ্ক করা
    const handleFocusSync = () => {
      if (useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().fetchProfile();
      }
    };
    window.addEventListener('focus', handleFocusSync);
    const handleVisibilitySync = () => {
      if (document.visibilityState === 'visible' && useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().fetchProfile();
      }
    };
    // [EN] Listen for immediate force-logout events (e.g. administrative account lock)
    // [BN] তাৎক্ষণিক ফোর্স-লগআউট ইভেন্ট লিসেনার (অ্যাডমিন কর্তৃক অ্যাকাউন্ট লক হলে কার্যকর)
    const handleForceLogout = () => {
      useAuthStore.getState().logout(false);
    };
    window.addEventListener('garments_erp_force_logout', handleForceLogout);

    // [EN] Periodic background privilege and lockout sync (every 15s) for active sessions
    // [BN] সক্রিয় সেশনের জন্য প্রতি ১৫ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে স্বয়ংক্রিয় পারমিশন ও লক স্থিতি যাচাই
    const interval = setInterval(() => {
      if (useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().fetchProfile();
      }
    }, 15000);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocusSync);
      window.removeEventListener('visibilitychange', handleVisibilitySync);
      window.removeEventListener('garments_erp_force_logout', handleForceLogout);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* =====================================================================
       * [EN] Global Toast Notification Center (Sonner)
       * [BN] গ্লোবাল টোস্ট নোটিফিকেশন সেন্টার (Sonner)
       * ===================================================================== */}
      <Toaster position="top-right" richColors closeButton />

      {/* =====================================================================
       * [EN] Master Route Hierarchy: Public & Authenticated Protected Views
       * [BN] মাস্টার রুট হায়ারার্কি: পাবলিক ও অথেনটিকেটেড প্রটেক্টেড ভিউসমূহ
       * ===================================================================== */}
      <Routes>
        {/* [EN] Root Landing Route: Smart Role-Based Redirect / [BN] স্মার্ট রোলভিত্তিক রিডাইরেক্ট */}
        <Route path="/" element={<RootRedirect />} />

        {/* [EN] Guest-Only Corporate Login Route / [BN] শুধুমাত্র গেস্টদের জন্য কর্পোরেট লগইন রুট */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        {/* [EN] Authenticated Protected Enterprise Shell / [BN] সুরক্ষিত এন্টারপ্রাইজ শেল */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {renderDomainRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
