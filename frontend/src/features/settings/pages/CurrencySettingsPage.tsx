/**
 * =============================================================================
 * [EN] Commercial Currencies & Exchange Rates Page (CurrencySettingsPage.tsx)
 * [BN] বাণিজ্যিক কারেন্সি ও বৈদেশিক মুদ্রা বিনিময় হার কনফিগারেশন পেজ (CurrencySettingsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] গার্মেন্ট রপ্তানি বিলিং, মার্চেন্ডাইজিং কস্টিং ও লোকাল অপারেশনের বিনিময় হার ব্যবস্থাপনা পেজ।
 */

import React from 'react';
import { CurrencySettingsTab } from '../components/CurrencySettingsTab';

export const CurrencySettingsPage: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <CurrencySettingsTab />
    </div>
  );
};

export default CurrencySettingsPage;
