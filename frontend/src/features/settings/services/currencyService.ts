/**
 * =============================================================================
 * [EN] Currency Exchange Rate Client Service (currencyService.ts)
 * [BN] বাণিজ্যিক কারেন্সি ক্লায়েন্ট সার্ভিস (currencyService.ts)
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] সরাসরি ব্যাকএন্ড স্প্রিং বুট এপিআই (/settings/currencies) থেকে ডেটা ফেচ ও আপডেট করে।
 */

import { apiClient } from '@/services/apiClient';

export interface CurrencyRate {
  id?: string;
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number;
  rateToBdt: number;
  isMaster: boolean;
  isOperating: boolean;
  lastUpdated?: string;
}

export const currencyService = {
  getCurrencies: async (): Promise<CurrencyRate[]> => {
    const response = await apiClient.get<CurrencyRate[]>('/settings/currencies');
    return response.data || [];
  },

  updateRate: async (code: string, rateToBdt: number): Promise<CurrencyRate> => {
    const response = await apiClient.put<CurrencyRate>(`/settings/currencies/${code}`, { rateToBdt });
    if (!response.data) throw new Error('Failed to update currency rate');
    return response.data;
  },

  upsertCurrency: async (currency: CurrencyRate): Promise<CurrencyRate> => {
    const response = await apiClient.post<CurrencyRate>('/settings/currencies', currency);
    if (!response.data) throw new Error('Failed to save currency');
    return response.data;
  },
};
