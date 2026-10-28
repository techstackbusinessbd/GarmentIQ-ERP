/**
 * =============================================================================
 * [EN] Simplified Corporate Brand Header (LoginBrandHeader)
 * [BN] সরলীকৃত করপোরেট ব্র্যান্ড হেডার কম্পোনেন্ট
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/01_TYPOGRAPHY_AND_TYPE_SCALE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] স্পষ্ট ও মার্জিত ব্র্যান্ডিং লোগো এবং সাবটাইটেল (অতিরিক্ত জটিলতা বর্জিত)।
 */

import React from 'react';
import { BrandLogo } from '@/components/ui';

/**
 * [EN] Clean corporate brand header for login view using official BrandLogo.
 * [BN] অফিশিয়াল BrandLogo ব্যবহার করে তৈরি পরিচ্ছন্ন করপোরেট ব্র্যান্ড হেডার।
 *
 * @returns [EN] Rendered brand lockup / [BN] রেন্ডারকৃত ব্র্যান্ড লকআপ
 */
export const LoginBrandHeader: React.FC = () => {
  return <BrandLogo size="md" />;
};

