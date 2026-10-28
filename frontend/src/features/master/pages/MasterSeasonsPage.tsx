/**
 * =============================================================================
 * [EN] Master Export Seasons & Programs Page (MasterSeasonsPage.tsx)
 * [BN] মাস্টার রপ্তানি সিজন ও কালেকশন পেজ (MasterSeasonsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ইউজার ডিরেক্টরির সাথে একীভূত নিট সিঙ্গেল-কার্ড লেআউট (জিরো ডুপ্লিকেট হেডার)।
 */

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLibraryEntries } from '../hooks/useMasterData';
import { MasterSeasonsTable } from '../components/MasterSeasonsTable';

export const MasterSeasonsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: seasons = [], isLoading } = useLibraryEntries('MERCHANDISING', 'SEASON');

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['master', 'library', 'MERCHANDISING', 'SEASON'] });
  };

  return (
    <div className="w-full">
      <MasterSeasonsTable seasons={seasons} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
};

export default MasterSeasonsPage;
