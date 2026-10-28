/**
 * =============================================================================
 * [EN] Master Enterprise Domain Routes Aggregator (domainRoutes.tsx)
 * [BN] মাস্টার এন্টারপ্রাইজ ডোমেন রাউটস সমন্বয়কারী (domainRoutes.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] এন্টারপ্রাইজ অ্যাপ্লিকেশনের সকল ডোমেন ও মডিউল রাউটস সমন্বয়কারী (/app/{domain}/{module}/*)।
 */

import React from 'react';
import { renderPlatformRoutes } from './platformRoutes';
import { renderCoreWorkflowRoutes } from './coreWorkflowRoutes';
import { renderShopFloorRoutes } from './shopFloorRoutes';
import { renderLogisticsAndSystemRoutes } from './logisticsRoutes';
import { renderAdminRoutes } from './adminRoutes';

/**
 * [EN] Master aggregated domain routes renderer for enterprise shell.
 * [BN] এন্টারপ্রাইজ শেলের জন্য সমস্ত ডোমেনের একত্রিত রাউট রেন্ডারার।
 */
export const renderDomainRoutes = (): React.ReactNode => (
  <>
    {renderPlatformRoutes()}
    {renderCoreWorkflowRoutes()}
    {renderShopFloorRoutes()}
    {renderLogisticsAndSystemRoutes()}
    {renderAdminRoutes()}
  </>
);
