/**
 * =============================================================================
 * [EN] Role & Privilege Access Matrix Workspace (AccessMatrixPage.tsx)
 * [BN] রোল ও প্রিভিলেজ অ্যাক্সেস ম্যাট্রিক্স পেজ (AccessMatrixPage.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] ভূমিকা-ভিত্তিক (RBAC) অ্যাক্সেস ম্যাট্রিক্স কনফিগারেশন ওয়ার্কস্পেস (জিরো অপ্রয়োজনীয় টেক্সট)।
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { RoleMatrixView } from '../components/RoleMatrixView';

export const AccessMatrixPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="space-y-3.5 w-full">
      {/* Clean Minimal Enterprise PageHeader */}
      <PageHeader
        title="Role Access Matrix"
        subtitle="Role-based operational clearances & permissions"
      />

      {/* High-Density Multi-Column Matrix Workspace */}
      <RoleMatrixView initialRoleCode={searchParams.get('role') || undefined} />
    </div>
  );
};

export default AccessMatrixPage;
