/**
 * =============================================================================
 * [EN] Platform Governance & Settings Client Service (settingsService.ts)
 * [BN] প্ল্যাটফর্ম গভর্নেন্স ও সেটিংস ক্লায়েন্ট সার্ভিস (settingsService.ts)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Validation)
 * [BN] সিকিউরিটি পলিসি, লকআউট ডিউরেশন ও প্ল্যাটফর্ম সেটিংস এপিআই সার্ভিস।
 */

import { apiClient } from '@/services/apiClient';

export interface SecuritySettings {
  maxFailedAttempts: number;
  lockoutMinutes: number;
  sessionTimeoutMinutes: number;
}

export const settingsService = {
  /**
   * [EN] Get active platform security policy parameters.
   * [BN] সক্রিয় সিকিউরিটি পলিসি প্যারামিটার সংগ্রহ।
   */
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const response = await apiClient.get<SecuritySettings>('/settings/security');
    return (
      response.data || {
        maxFailedAttempts: 5,
        lockoutMinutes: 30,
        sessionTimeoutMinutes: 60,
      }
    );
  },

  /**
   * [EN] Update platform security policy parameters.
   * [BN] প্ল্যাটফর্ম সিকিউরিটি পলিসি প্যারামিটার হালনাগাদ।
   */
  updateSecuritySettings: async (settings: SecuritySettings): Promise<SecuritySettings> => {
    const response = await apiClient.put<SecuritySettings>('/settings/security', settings);
    if (!response.data) {
      throw new Error('Failed to update platform security settings.');
    }
    return response.data;
  },
};

export default settingsService;
