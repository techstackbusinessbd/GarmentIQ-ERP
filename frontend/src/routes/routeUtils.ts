/**
 * =============================================================================
 * [EN] Enterprise Route Navigation Utilities (routeUtils.ts)
 * [BN] এন্টারপ্রাইজ রাউট ও ন্যাভিগেশন ইউটিলিটি ফাংশনসমূহ (routeUtils.ts)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] সুপারঅ্যাডমিন (SaaS Platform) বনাম ক্লায়েন্ট ফ্যাক্টরি ইউজারদের রাউটিং নির্ধারণ।
 * =============================================================================
 */

import type { User } from '@/types';

/**
 * [EN] Checks whether the authenticated user has SaaS Platform Superadmin privileges.
 * [BN] ব্যবহারকারী ক্লাউড সাশ প্ল্যাটফর্মের সুপারঅ্যাডমিন কিনা তা যাচাই করে।
 *
 * @param user [EN] Current user profile / [BN] বর্তমান ব্যবহারকারী প্রোফাইল
 * @returns [EN] True if superadmin, false otherwise / [BN] সুপারঅ্যাডমিন হলে true
 */
export const isPlatformSuperAdmin = (user: User | null | undefined): boolean => {
  if (!user || !Array.isArray(user.roles)) return false;
  return user.roles.some((r) => r === 'ROLE_SUPER_ADMIN' || r === 'SUPER_ADMIN');
};

/**
 * [EN] Determines the default operational landing dashboard based on user role.
 * All authenticated users land at the unified Overview Dashboard (`/app/overview/dashboard`).
 *
 * [BN] ইউজারের রোলের ওপর ভিত্তি করে ডিফল্ট ল্যান্ডিং ড্যাশবোর্ড পাথ নির্ধারণ করে।
 * সকল অথেনটিকেটেড ইউজার ইউনিফায়েড ওভারভিউ ড্যাশবোর্ড (`/app/overview/dashboard`)-এ অবতরণ করবেন।
 *
 * @param user [EN] Current user profile / [BN] বর্তমান ব্যবহারকারী প্রোফাইল
 * @returns [EN] Target URL path / [BN] কাঙ্ক্ষিত ইউআরএল পাথ
 */
export const getDefaultDashboardPath = (_user?: User | null | undefined): string => {
  return '/app/overview/dashboard';
};
