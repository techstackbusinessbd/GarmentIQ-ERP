/**
 * =============================================================================
 * [EN] Master Library Domain REST Service (libraryService.ts)
 * [BN] মাস্টার লাইব্রেরি ডোমেন রেস্ট সার্ভিস (libraryService.ts)
 * =============================================================================
 * [EN] Reference: docs/specifications/TECH_STACK.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Constants)
 * [BN] ডোমেন-ভিত্তিক মাস্টার রেফারেন্স ডেটা সংক্রান্ত ব্যাকএন্ড এপিআই ক্লায়েন্ট।
 */

import { apiClient } from '@/services/apiClient';
import type {
  MasterLibraryEntry,
  CreateMasterLibraryEntryPayload,
  UpdateMasterLibraryEntryPayload,
} from '../types';

/**
 * [EN] Service object executing REST operations against /api/v1/library
 * [BN] /api/v1/library এন্ডপয়েন্টে মাস্টার ডেটা সংক্রান্ত অপারেশন পরিচালনাকারী সার্ভিস
 */
export const libraryService = {
  /**
   * [EN] Fetch all active master entries for a specified bounded domain
   * [BN] নির্দিষ্ট ডোমেনের সমস্ত সক্রিয় মাস্টার ডেটা এন্ট্রি নিয়ে আসে
   */
  getDomainEntries: async (domainCode: string): Promise<MasterLibraryEntry[]> => {
    const response = await apiClient.get<MasterLibraryEntry[]>(`/library/domains/${domainCode}`);
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response as unknown as MasterLibraryEntry[];
    return [];
  },

  /**
   * [EN] Fetch entries filtered by domain and entity category
   * [BN] ডোমেন এবং সুনির্দিষ্ট এনটিটি টাইপ অনুসারে ফিল্টারকৃত এন্ট্রি নিয়ে আসে
   */
  getEntityEntries: async (
    domainCode: string,
    entityType: string
  ): Promise<MasterLibraryEntry[]> => {
    const response = await apiClient.get<MasterLibraryEntry[]>(
      `/library/domains/${domainCode}/entities/${entityType}`
    );
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response as unknown as MasterLibraryEntry[];
    return [];
  },

  /**
   * [EN] Create a new master library entry
   * [BN] নতুন মাস্টার লাইব্রেরি রেকর্ড তৈরি করে
   */
  createEntry: async (
    payload: CreateMasterLibraryEntryPayload
  ): Promise<MasterLibraryEntry> => {
    const response = await apiClient.post<MasterLibraryEntry>('/library', payload);
    const data = response?.data || (response as unknown as MasterLibraryEntry);
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to create master library entry.');
    }
    return data;
  },

  /**
   * [EN] Update an existing master library entry
   * [BN] বিদ্যমান মাস্টার লাইব্রেরি রেকর্ড আপডেট করে
   */
  updateEntry: async (
    id: string,
    payload: UpdateMasterLibraryEntryPayload
  ): Promise<MasterLibraryEntry> => {
    const response = await apiClient.put<MasterLibraryEntry>(`/library/${id}`, payload);
    const data = response?.data || (response as unknown as MasterLibraryEntry);
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to update master library entry.');
    }
    return data;
  },

  /**
   * [EN] Toggle active / inactive status for an entry
   * [BN] এন্ট্রির অ্যাক্টিভ/ইনঅ্যাক্টিভ স্ট্যাটাস পরিবর্তন করে
   */
  toggleStatus: async (id: string): Promise<MasterLibraryEntry> => {
    const response = await apiClient.patch<MasterLibraryEntry>(`/library/${id}/toggle-status`);
    const data = response?.data || (response as unknown as MasterLibraryEntry);
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to toggle master library entry status.');
    }
    return data;
  },

  /**
   * [EN] Delete a custom master library entry (Rule: system-seeded cannot be deleted)
   * [BN] কাস্টম মাস্টার রেকর্ড ডিলিট করে (সিস্টেম সিডেড রেকর্ড সুরক্ষিত থাকে)
   */
  deleteEntry: async (id: string): Promise<void> => {
    await apiClient.delete(`/library/${id}`);
  },
};
