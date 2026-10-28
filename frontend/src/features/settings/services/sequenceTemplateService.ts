/**
 * =============================================================================
 * [EN] Configurable Auto-Code Sequence Template Service (sequenceTemplateService.ts)
 * [BN] কনফিগারেবল অটো-কোড সিকোয়েন্স টেমপ্লেট ক্লায়েন্ট সার্ভিস (রুল ২৪)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 24 (Auto-Code)
 * [BN] অটো-কোড প্যাটার্ন সংগ্রহ, রিয়েল-টাইম প্রিভিউ ও টেমপ্লেট কনফিগারেশন সার্ভিস।
 */

import { apiClient } from '@/services/apiClient';

export interface CodeSequenceTemplate {
  id: string;
  entityType: string;
  pattern: string;
  prefix: string;
  paddingLength: number;
  resetFrequency: 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY';
  samplePreview?: string;
  active: boolean;
}

export interface UpdateSequenceTemplatePayload {
  pattern: string;
  prefix: string;
  paddingLength: number;
  resetFrequency: 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY';
  active?: boolean;
}

export const sequenceTemplateService = {
  /**
   * [EN] Fetch all sequence templates for the current tenant.
   * [BN] বর্তমান টেন্যান্টের সকল অটো-কোড টেমপ্লেট সংগ্রহ।
   */
  getAllTemplates: async (): Promise<CodeSequenceTemplate[]> => {
    const response = await apiClient.get<CodeSequenceTemplate[]>('/sequence-templates');
    return response.data || [];
  },

  /**
   * [EN] Generate live real-time pattern preview string.
   * [BN] প্যাটার্নের লাইভ রিয়েল-টাইম প্রিভিউ জেনারেট করা।
   */
  previewPattern: async (
    pattern: string,
    prefix: string,
    paddingLength: number
  ): Promise<string> => {
    const response = await apiClient.post<string>('/sequence-templates/preview', {
      pattern,
      prefix,
      paddingLength,
    });
    return response.data || '';
  },

  /**
   * [EN] Update template configuration.
   * [BN] অটো-কোড টেমপ্লেট কনফিগারেশন হালনাগাদ করা।
   */
  updateTemplate: async (
    id: string,
    payload: UpdateSequenceTemplatePayload
  ): Promise<CodeSequenceTemplate> => {
    const response = await apiClient.put<CodeSequenceTemplate>(
      `/sequence-templates/${id}`,
      payload
    );
    if (!response.data) {
      throw new Error('Failed to update sequence template.');
    }
    return response.data;
  },
};

export default sequenceTemplateService;
