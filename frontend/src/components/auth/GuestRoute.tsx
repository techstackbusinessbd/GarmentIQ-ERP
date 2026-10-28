/**
 * =============================================================================
 * [EN] Enterprise Guest Route Security Guard (GuestRoute)
 * [BN] এন্টারপ্রাইজ গেস্ট রুট সিকিউরিটি গার্ড (GuestRoute)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 * [BN] অথেনটিকেটেড ইউজারদের লগইন পেজে প্রবেশ সম্পূর্ণ অবরুদ্ধকরণ ও স্বয়ংক্রিয় রিডাইরেক্ট গার্ড।
 * =============================================================================
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { getDefaultDashboardPath } from '@/routes';

/**
 * [EN] Properties contract for the GuestRoute component.
 * [BN] GuestRoute কম্পোনেন্টের প্রপার্টিজ ইন্টারফেস।
 */
export interface GuestRouteProps {
  /** [EN] Child components to render when unauthenticated / [BN] অননুমোদিত অবস্থায় প্রদর্শিত চিলড্রেন */
  readonly children: React.ReactNode;
}

/**
 * [EN] Guest-Only Route Guard Component.
 * Ensures that already authenticated users CANNOT access public guest pages like /login.
 * If authenticated, immediately redirects the user to the operational dashboard (/app/overview/dashboard).
 *
 * [BN] শুধুমাত্র গেস্ট ব্যবহারকারীদের জন্য রুট গার্ড কম্পোনেন্ট।
 * পূর্বে লগইনকৃত অথেনটিকেটেড ইউজারদের /login পেজে প্রবেশ সম্পূর্ণ অবরুদ্ধ করে এবং সরাসরি
 * তাদের নির্দিষ্ট ড্যাশবোর্ডে রিডাইরেক্ট করে।
 *
 * @param props [EN] Guard properties / [BN] গার্ড প্রপার্টিজ
 * @returns [EN] Children if guest, or Navigate redirect if authenticated / [BN] রেন্ডারকৃত এলিমেন্ট
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  // [EN] If already authenticated, block login screen and redirect to destination
  // [BN] ইউজার ইতিমধ্যে অথেনটিকেটেড থাকলে লগইন স্ক্রিন অবরুদ্ধ করে গন্তব্যে রিডাইরেক্ট
  if (isAuthenticated && user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetPath = (location.state as any)?.from?.pathname;
    const destination =
      targetPath && targetPath !== '/' && targetPath !== '/login'
        ? targetPath
        : getDefaultDashboardPath(user);

    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
