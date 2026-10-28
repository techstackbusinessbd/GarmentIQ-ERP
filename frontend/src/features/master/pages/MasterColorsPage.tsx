/**
 * =============================================================================
 * [EN] Master Colors & Pantone Palette Page (MasterColorsPage.tsx)
 * [BN] মাস্টার কালার ও প্যান্টোন প্যালেট পেজ (MasterColorsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ইউজার ডিরেক্টরির সাথে একীভূত নিট সিঙ্গেল-কার্ড লেআউট (জিরো ডুপ্লিকেট হেডার)।
 */

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLibraryEntries } from '../hooks/useMasterData';
import { MasterColorsTable } from '../components/MasterColorsTable';

export const MasterColorsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: colors = [], isLoading } = useLibraryEntries('MERCHANDISING', 'COLOR');

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['master', 'library', 'MERCHANDISING', 'COLOR'] });
  };

  return (
    <div className="w-full">
      <MasterColorsTable colors={colors} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
};

export default MasterColorsPage;
