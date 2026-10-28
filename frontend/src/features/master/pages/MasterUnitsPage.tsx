/**
 * =============================================================================
 * [EN] Master Measurement Units Page (MasterUnitsPage.tsx)
 * [BN] মাস্টার পরিমাপের একক পেজ (MasterUnitsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ইউজার ডিরেক্টরির সাথে একীভূত নিট সিঙ্গেল-কার্ড লেআউট (জিরো ডুপ্লিকেট হেডার)।
 */

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUnits } from '../hooks/useMasterData';
import { MasterUnitsTable } from '../components/MasterUnitsTable';

export const MasterUnitsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: units = [], isLoading } = useUnits();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['master', 'units'] });
  };

  return (
    <div className="w-full">
      <MasterUnitsTable units={units} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
};

export default MasterUnitsPage;
