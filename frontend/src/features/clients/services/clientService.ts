/**
 * =============================================================================
 * [EN] Client Organization & Tenant REST Service (clientService)
 * [BN] ক্লায়েন্ট প্রতিষ্ঠান ও টেন্যান্ট ব্যবস্থাপনা সার্ভিস (clientService) (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Communicates with backend /api/v1/tenants endpoints for multi-tenant factory lifecycle.
 * [BN] মাল্টি-টেন্যান্ট ফ্যাক্টরি অনবোর্ডিং, সিলেকশন ও ব্যবস্থাপনার জন্য ব্যাকএন্ডের সাথে যোগাযোগ করে।
 */

import { apiClient } from '@/services/apiClient';
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/types';

/**
 * [EN] Service object encapsulating client factory tenant REST operations.
 * [BN] ক্লায়েন্ট ফ্যাক্টরি টেন্যান্ট সংক্রান্ত REST অপারেশন পরিচালনাকারী সার্ভিস।
 */
export const clientService = {
  /**
    * [EN] Fetch all active (or optionally all including soft-deleted) client factory tenants.
   * [BN] প্ল্যাটফর্মের সক্রিয় (বা ডিলিটকৃতসহ) ফ্যাক্টরি টেন্যান্টের তালিকা আনে।
   */
  getAllTenants: async (includeDeleted: boolean = false): Promise<Tenant[]> => {
    const response = await apiClient.get<Tenant[]>(`/tenants${includeDeleted ? '?includeDeleted=true' : ''}`);
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response as unknown as Tenant[];
    return [];
  },

  /**
   * [EN] Fetch next system auto-generated client code conforming to CLT-{SEQ:4} (Rule 24).
   * [BN] পরবর্তী সিস্টেম স্বয়ংক্রিয় ক্লায়েন্ট কোড আনে (রুল ২৪)।
   */
  getNextClientCode: async (): Promise<string> => {
    const response = await apiClient.get<string>('/tenants/next-code');
    if (typeof response?.data === 'string') return response.data;
    if (typeof response === 'string') return response as unknown as string;
    return 'CLT-0001';
  },

  /**
   * [EN] Fetch single tenant record by UUID.
   * [BN] আইডি দিয়ে নির্দিষ্ট ক্লায়েন্ট টেন্যান্টের বিবরণ আনে।
   */
  getTenantById: async (id: string): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>(`/tenants/${id}`);
    const data = response?.data || (response as unknown as Tenant);
    if (!data || typeof data !== 'object') {
      throw new Error('Tenant record not found.');
    }
    return data;
  },

  /**
   * [EN] Provisions a new client factory tenant organization.
   * [BN] নতুন গার্মেন্টস কারখানা ক্লায়েন্ট প্রতিষ্ঠান নিবন্ধন করে।
   */
  createTenant: async (payload: CreateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.post<Tenant>('/tenants', payload);
    const data = response?.data || (response as unknown as Tenant);
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to create client tenant record.');
    }
    return data;
  },

  /**
   * [EN] Updates existing client factory tenant details.
   * [BN] বিদ্যমান ক্লায়েন্ট কারখানা তথ্য হালনাগাদ করে।
   */
  updateTenant: async (id: string, payload: UpdateTenantRequest): Promise<Tenant> => {
    const response = await apiClient.put<Tenant>(`/tenants/${id}`, payload);
    const data = response?.data || (response as unknown as Tenant);
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to update client tenant record.');
    }
    return data;
  },

  /**
   * [EN] Soft-deletes a client factory tenant.
   * [BN] ক্লায়েন্ট কারখানা টেন্যান্টের নিরাপদ সফট-ডিলিট সম্পন্ন করে।
   */
  deleteTenant: async (id: string): Promise<void> => {
    await apiClient.delete(`/tenants/${id}`);
  },

  /**
   * [EN] Restores a soft-deleted client factory tenant.
   * [BN] সফট-ডিলিটকৃত ক্লায়েন্ট কারখানা টেন্যান্ট ফিরিয়ে আনে।
   */
  restoreTenant: async (id: string): Promise<Tenant> => {
    const response = await apiClient.post<Tenant>(`/tenants/${id}/restore`);
    const data = response?.data || (response as unknown as Tenant);
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to restore client tenant record.');
    }
    return data;
  },

  /**
   * [EN] Permanently purges a soft-deleted client factory tenant.
   * [BN] সফট-ডিলিটকৃত ক্লায়েন্ট কারখানা টেন্যান্ট চিরতরে মুছে ফেলে।
   */
  purgeTenant: async (id: string): Promise<void> => {
    await apiClient.delete(`/tenants/${id}/purge`);
  },

  /**
   * [EN] Checks whether a subdomain is available for registration.
   * [BN] সাবডোমেনটি খালি আছে কি না তা ব্যাকএন্ডের মাধ্যমে যাচাই করে।
   */
  checkSubdomainAvailable: async (subdomain: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<boolean>(`/tenants/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`);
      return response?.data ?? (typeof response === 'boolean' ? response : false);
    } catch {
      return false;
    }
  },
};
