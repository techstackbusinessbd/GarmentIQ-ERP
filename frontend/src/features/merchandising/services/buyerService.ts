/**
 * =============================================================================
 * [EN] Global Buyer & Sub-Brand REST Client Service (buyerService.ts)
 * [BN] বায়ার ও সাব-ব্র্যান্ড রেস্ট ক্লায়েন্ট সার্ভিস (buyerService.ts)
 * =============================================================================
 * [EN] Reference: Domain 01 Merchandising, Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ব্যাকএন্ড /api/v1/merchandising/buyers এন্ডপয়েন্টের সাথে যোগাযোগের জন্য সার্ভিস।
 */

import { apiClient } from '@/services/apiClient';
import type {
  Buyer,
  BuyerBrand,
  CreateBuyerPayload,
  UpdateBuyerPayload,
  CreateBuyerBrandPayload,
  UpdateBuyerBrandPayload,
  PaginatedResponse,
} from '@/types';

export interface BuyerQueryParams {
  search?: string;
  status?: string;
  buyerType?: string;
  page?: number;
  size?: number;
}

export const buyerService = {
  /**
   * [EN] Paginated search for buyers with filtering
   * [BN] পেজিনেটেড বায়ার তালিকা ও ফিল্টারিং
   */
  getBuyers: async (params?: BuyerQueryParams): Promise<PaginatedResponse<Buyer>> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status && params.status !== 'ALL') searchParams.append('status', params.status);
    if (params?.buyerType && params.buyerType !== 'ALL') searchParams.append('buyerType', params.buyerType);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const qs = searchParams.toString();
    const endpoint = `/merchandising/buyers${qs ? `?${qs}` : ''}`;
    const response = await apiClient.get<PaginatedResponse<Buyer>>(endpoint);
    return response.data || {
      content: [],
      pageNumber: 0,
      pageSize: 20,
      totalElements: 0,
      totalPages: 0,
      isLast: true,
    };
  },

  /**
   * [EN] Fetch active buyers for dropdowns
   * [BN] ড্রপডাউনের জন্য সক্রিয় বায়ারদের তালিকা
   */
  getActiveBuyers: async (): Promise<Buyer[]> => {
    const response = await apiClient.get<Buyer[]>('/merchandising/buyers/active');
    return response.data || [];
  },

  /**
   * [EN] Fetch single buyer by ID with brands
   * [BN] আইডি দিয়ে একক বায়ার ও সাব-ব্র্যান্ড লোড করা
   */
  getBuyerById: async (id: string): Promise<Buyer> => {
    const response = await apiClient.get<Buyer>(`/merchandising/buyers/${id}`);
    if (!response.data) throw new Error('Buyer not found');
    return response.data;
  },

  /**
   * [EN] Create new buyer
   * [BN] নতুন বায়ার তৈরি করা
   */
  createBuyer: async (payload: CreateBuyerPayload): Promise<Buyer> => {
    const response = await apiClient.post<Buyer>('/merchandising/buyers', payload);
    if (!response.data) throw new Error('Failed to create buyer');
    return response.data;
  },

  /**
   * [EN] Update existing buyer
   * [BN] বায়ার তথ্য হালনাগাদ
   */
  updateBuyer: async (id: string, payload: UpdateBuyerPayload): Promise<Buyer> => {
    const response = await apiClient.put<Buyer>(`/merchandising/buyers/${id}`, payload);
    if (!response.data) throw new Error('Failed to update buyer');
    return response.data;
  },

  /**
   * [EN] Soft-delete buyer
   * [BN] বায়ার সফট ডিলিট
   */
  deleteBuyer: async (id: string): Promise<void> => {
    await apiClient.delete(`/merchandising/buyers/${id}`);
  },

  /**
   * [EN] List brands under a buyer
   * [BN] বায়ারের অধীনস্থ সাব-ব্র্যান্ড তালিকা
   */
  getBrands: async (buyerId: string): Promise<BuyerBrand[]> => {
    const response = await apiClient.get<BuyerBrand[]>(`/merchandising/buyers/${buyerId}/brands`);
    return response.data || [];
  },

  /**
   * [EN] Add sub-brand to buyer
   * [BN] নতুন সাব-ব্র্যান্ড তৈরি
   */
  createBrand: async (buyerId: string, payload: CreateBuyerBrandPayload): Promise<BuyerBrand> => {
    const response = await apiClient.post<BuyerBrand>(`/merchandising/buyers/${buyerId}/brands`, payload);
    if (!response.data) throw new Error('Failed to create brand');
    return response.data;
  },

  /**
   * [EN] Update sub-brand
   * [BN] সাব-ব্র্যান্ড হালনাগাদ
   */
  updateBrand: async (buyerId: string, brandId: string, payload: UpdateBuyerBrandPayload): Promise<BuyerBrand> => {
    const response = await apiClient.put<BuyerBrand>(`/merchandising/buyers/${buyerId}/brands/${brandId}`, payload);
    if (!response.data) throw new Error('Failed to update brand');
    return response.data;
  },

  /**
   * [EN] Soft-delete sub-brand
   * [BN] সাব-ব্র্যান্ড সফট ডিলিট
   */
  deleteBrand: async (buyerId: string, brandId: string): Promise<void> => {
    await apiClient.delete(`/merchandising/buyers/${buyerId}/brands/${brandId}`);
  },
};
