/**
 * =============================================================================
 * [EN] TanStack Query Master Reference Data Custom Hooks (useMasterData)
 * [BN] TanStack Query মাস্টার রেফারেন্স ডেটা কাস্টম হুকস (useMasterData)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (High Performance), Rule 15 (Bilingual)
 * [BN] ৫ মিনিট ক্যাশ স্টেলটাইম সহ UOM, সাইজ ও ডিফেক্ট কোড ক্যাশিং ও লোডিং হুকস।
 */

import { useQuery } from '@tanstack/react-query';
import type { MasterUnit, MasterSize, MasterDefectCode, MasterLibraryEntry } from '@/types';
import { masterDataService } from '../services/masterDataService';

/**
 * [EN] Custom query hook for measurement units with optional category filtering.
 * [BN] পরিমাপের এককের জন্য ক্যাশড TanStack Query হুক।
 *
 * @param category [EN] Optional category filter / [BN] ঐচ্ছিক ক্যাটাগরি ফিল্টার
 */
export const useUnits = (category?: string) => {
  return useQuery<MasterUnit[], Error>({
    queryKey: ['master', 'units', category || 'ALL'],
    queryFn: () => masterDataService.getUnits(category),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

/**
 * [EN] Custom query hook for garment size matrices ordered by sequence.
 * [BN] তৈরি পোশাকের সাইজ গ্রিডের জন্য ক্যাশড TanStack Query হুক।
 */
export const useSizes = () => {
  return useQuery<MasterSize[], Error>({
    queryKey: ['master', 'sizes'],
    queryFn: () => masterDataService.getSizes(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * [EN] Custom query hook for quality defect codes with optional process category filtering.
 * [BN] কোয়ালিটি কন্ট্রোল ডিফেক্ট কোডের জন্য ক্যাশড TanStack Query হুক।
 *
 * @param category [EN] Optional process category / [BN] ঐচ্ছিক প্রসেস ক্যাটাগরি
 */
export const useDefectCodes = (category?: string) => {
  return useQuery<MasterDefectCode[], Error>({
    queryKey: ['master', 'defect-codes', category || 'ALL'],
    queryFn: () => masterDataService.getDefectCodes(category),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * [EN] Custom query hook for domain-driven master library catalog entries.
 * [BN] ডোমেন-ভিত্তিক মাস্টার লাইব্রেরি ক্যাটালগ এন্ট্রির জন্য ক্যাশড TanStack Query হুক।
 *
 * @param domainCode [EN] Domain identifier (e.g. MERCHANDISING) / [BN] ডোমেন কোড
 * @param entityType [EN] Entity identifier (e.g. GARMENT_ITEM, COLOR, SEASON) / [BN] এনটিটি ধরন
 */
export const useLibraryEntries = (domainCode: string, entityType: string) => {
  return useQuery<MasterLibraryEntry[], Error>({
    queryKey: ['master', 'library', domainCode, entityType],
    queryFn: () => masterDataService.getLibraryEntries(domainCode, entityType),
    staleTime: 10 * 60 * 1000,
  });
};
