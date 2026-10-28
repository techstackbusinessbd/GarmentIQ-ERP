/**
 * =============================================================================
 * [EN] Factory Shift Client Service (shiftService.ts)
 * [BN] কারখানা শিফট ক্লায়েন্ট সার্ভিস (shiftService.ts)
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] সরাসরি ব্যাকএন্ড স্প্রিং বুট এপিআই (/settings/shifts) থেকে ডেটা ফেচ ও সেভ করে।
 */

import { apiClient } from '@/services/apiClient';

export interface FactoryShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  isActive: boolean;
  type: 'REGULAR' | 'OVERTIME' | 'NIGHT';
}

export const shiftService = {
  getShifts: async (): Promise<FactoryShift[]> => {
    const response = await apiClient.get<FactoryShift[]>('/settings/shifts');
    return response.data || [];
  },

  createShift: async (shift: Omit<FactoryShift, 'id'>): Promise<FactoryShift> => {
    const response = await apiClient.post<FactoryShift>('/settings/shifts', shift);
    if (!response.data) throw new Error('Failed to create shift');
    return response.data;
  },

  deleteShift: async (id: string): Promise<void> => {
    await apiClient.delete(`/settings/shifts/${id}`);
  },
};
