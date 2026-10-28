/**
 * =============================================================================
 * [EN] Configurable Auto-Code Settings Page (AutoCodeSettingsPage.tsx)
 * [BN] কনফিগারেবল অটো-কোড সেটিংস পেজ (AutoCodeSettingsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 24 (Auto-Code)
 * [BN] ব্যাকএন্ড এপিআই কানেক্টেড ডাইনামিক অটো-কোড টেমপ্লেট কনফিগারেশন পেজ।
 */

import React from 'react';
import { AutoCodeSettingsTab } from '../components/AutoCodeSettingsTab';

export const AutoCodeSettingsPage: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <AutoCodeSettingsTab />
    </div>
  );
};

export default AutoCodeSettingsPage;
