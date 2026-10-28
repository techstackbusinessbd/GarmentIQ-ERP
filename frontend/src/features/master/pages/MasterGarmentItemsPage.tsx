/**
 * =============================================================================
 * [EN] Master Garment Items & Types Page (MasterGarmentItemsPage.tsx)
 * [BN] মাস্টার পোশাক আইটেম ও ধরন পেজ (MasterGarmentItemsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ইউজার ডিরেক্টরির সাথে একীভূত নিট সিঙ্গেল-কার্ড লেআউট (জিরো ডুপ্লিকেট হেডার)।
 */

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLibraryEntries } from '../hooks/useMasterData';
import { MasterGarmentItemsTable } from '../components/MasterGarmentItemsTable';

export const MasterGarmentItemsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useLibraryEntries('MERCHANDISING', 'GARMENT_ITEM');

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['master', 'library', 'MERCHANDISING', 'GARMENT_ITEM'] });
  };

  return (
    <div className="w-full">
      <MasterGarmentItemsTable items={items} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
};

export default MasterGarmentItemsPage;
