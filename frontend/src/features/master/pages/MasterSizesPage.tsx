/**
 * =============================================================================
 * [EN] Master Garment Sizes Page (MasterSizesPage.tsx)
 * [BN] মাস্টার পোশাক সাইজ গ্রিড পেজ (MasterSizesPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ইউজার ডিরেক্টরির সাথে একীভূত নিট সিঙ্গেল-কার্ড লেআউট (জিরো ডুপ্লিকেট হেডার)।
 */

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSizes } from '../hooks/useMasterData';
import { MasterSizesTable } from '../components/MasterSizesTable';

export const MasterSizesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: sizes = [], isLoading } = useSizes();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['master', 'sizes'] });
  };

  return (
    <div className="w-full">
      <MasterSizesTable sizes={sizes} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
};

export default MasterSizesPage;
