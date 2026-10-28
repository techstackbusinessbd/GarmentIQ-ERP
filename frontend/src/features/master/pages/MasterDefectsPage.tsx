/**
 * =============================================================================
 * [EN] Master Quality Defect Codes Page (MasterDefectsPage.tsx)
 * [BN] মাস্টার কোয়ালিটি ডিফেক্ট কোড পেজ (MasterDefectsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ইউজার ডিরেক্টরির সাথে একীভূত নিট সিঙ্গেল-কার্ড লেআউট (জিরো ডুপ্লিকেট হেডার)।
 */

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDefectCodes } from '../hooks/useMasterData';
import { MasterDefectCodesTable } from '../components/MasterDefectCodesTable';

export const MasterDefectsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: defectCodes = [], isLoading } = useDefectCodes();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['master', 'defects'] });
  };

  return (
    <div className="w-full">
      <MasterDefectCodesTable defectCodes={defectCodes} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
};

export default MasterDefectsPage;
