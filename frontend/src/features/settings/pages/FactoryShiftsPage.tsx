/**
 * =============================================================================
 * [EN] Factory Line Shifts & Working Hours Page (FactoryShiftsPage.tsx)
 * [BN] কারখানা প্রোডাকশন লাইন শিফট ও কর্মঘণ্টা কনফিগারেশন পেজ (FactoryShiftsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] কাটিং ও সুইং লাইনের শিফট সময়সূচি, লাঞ্চ ব্রেক ও কার্যকরী কর্মঘণ্টা ব্যবস্থাপনা পেজ।
 */

import React from 'react';
import { FactoryShiftsTab } from '../components/FactoryShiftsTab';

export const FactoryShiftsPage: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <FactoryShiftsTab />
    </div>
  );
};

export default FactoryShiftsPage;
