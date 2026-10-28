/**
 * =============================================================================
 * [EN] Global Master Reference Data Service (masterDataService)
 * [BN] গ্লোবাল মাস্টার রেফারেন্স ডেটা সার্ভিস (masterDataService) (রুল ০৭ ও ১৫ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Constants)
 * [BN] ব্যাকএন্ড /api/v1/master/** এন্ডপয়েন্ট থেকে UOM, সাইজ ও ডিফেক্ট কোড সংগ্রহকারী সার্ভিস।
 */

import { apiClient } from '@/services/apiClient';
import type { MasterUnit, MasterSize, MasterDefectCode, MasterLibraryEntry } from '@/types';

/**
 * [EN] Typed service methods for global garments master reference data.
 * [BN] পোশাক শিল্পের প্রমিত রেফারেন্স ডেটা সংগ্রহের জন্য সার্ভিস মেথডসমূহ।
 */
export const masterDataService = {
  /**
   * [EN] Fetch measurement units optionally filtered by material category (FABRIC, TRIM, GENERAL).
   * [BN] পরিমাপের একক তালিকা সংগ্রহ (ঐচ্ছিক ক্যাটাগরি ফিল্টার সহ)।
   */
  getUnits: async (category?: string): Promise<MasterUnit[]> => {
    const params = category ? { category } : undefined;
    const response = await apiClient.get<MasterUnit[]>('/master/units', { params });
    return response.data || [];
  },

  /**
   * [EN] Fetch apparel size matrices ordered by display order.
   * [BN] ডিসপ্লে ক্রম অনুযায়ী সাজানো পোশাকের সাইজ গ্রিড সংগ্রহ।
   */
  getSizes: async (): Promise<MasterSize[]> => {
    const response = await apiClient.get<MasterSize[]>('/master/sizes');
    return response.data || [];
  },

  /**
   * [EN] Fetch inspection defect codes optionally filtered by process category (FABRIC, SEWING, WASHING).
   * [BN] কোয়ালিটি ত্রুটি কোড তালিকা সংগ্রহ (ঐচ্ছিক প্রসেস ক্যাটাগরি ফিল্টার সহ)।
   */
  getDefectCodes: async (category?: string): Promise<MasterDefectCode[]> => {
    const params = category ? { category } : undefined;
    const response = await apiClient.get<MasterDefectCode[]>('/master/defect-codes', { params });
    return response.data || [];
  },

  /**
   * [EN] Fetch dynamic domain library entries (Rule 12 & ADR-015).
   * [BN] ডোমেন-ভিত্তিক মাস্টার লাইব্রেরি এন্ট্রি সংগ্রহ।
   */
  getLibraryEntries: async (domainCode: string, entityType: string, activeOnly = false): Promise<MasterLibraryEntry[]> => {
    const response = await apiClient.get<MasterLibraryEntry[]>(`/library/domains/${domainCode}/entities/${entityType}`, {
      params: { activeOnly },
    });
    return response.data || [];
  },

  /**
   * [EN] Create a new master library entry.
   * [BN] নতুন মাস্টার লাইব্রেরি এন্ট্রি তৈরি।
   */
  createLibraryEntry: async (entry: Partial<MasterLibraryEntry>): Promise<MasterLibraryEntry> => {
    const response = await apiClient.post<MasterLibraryEntry>('/library/entries', entry);
    if (!response.data) throw new Error('Failed to create library entry');
    return response.data;
  },

  /**
   * [EN] Toggle active status of a master library entry.
   * [BN] মাস্টার লাইব্রেরি এন্ট্রির স্ট্যাটাস টগল।
   */
  toggleLibraryEntryStatus: async (id: string): Promise<MasterLibraryEntry> => {
    const response = await apiClient.patch<MasterLibraryEntry>(`/library/entries/${id}/toggle-status`);
    if (!response.data) throw new Error('Failed to toggle status');
    return response.data;
  },
};

export default masterDataService;
