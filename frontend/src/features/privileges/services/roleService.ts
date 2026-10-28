/**
 * =============================================================================
 * [EN] Enterprise Role & Privilege Management REST Service (roleService.ts)
 * [BN] এন্টারপ্রাইজ রোল ও প্রিভিলেজ ব্যবস্থাপনা রেস্ট সার্ভিস (রুল ২৫ ও রুল ২৭ অনুবর্তী)
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ব্যাকএন্ড /api/v1/roles এন্ডপয়েন্টের মাধ্যমে ডাটাবেজ থেকে সরাসরি ডেটা ও CRUD অ্যাকশন চালায়।
 */

import { apiClient } from '@/services/apiClient';

export interface BackendRoleDto {
  readonly id: string;
  readonly roleCode: string;
  readonly roleName: string;
  readonly description?: string;
  readonly isSystemRole?: boolean;
  readonly systemRole?: boolean;
  readonly permissions?: readonly string[];
  readonly tenantId?: string;
  readonly tenantCode?: string;
  readonly tenantName?: string;
  readonly isDeleted?: boolean;
  readonly deleted?: boolean;
}

export interface CreateRolePayload {
  readonly roleCode: string;
  readonly roleName: string;
  readonly description?: string;
  readonly permissionCodes?: readonly string[];
}

export interface UpdateRolePayload {
  readonly roleName: string;
  readonly description?: string;
  readonly permissionCodes?: readonly string[];
}

export const roleService = {
  /**
   * [EN] Fetch all active roles (or all including soft-deleted) from PostgreSQL database
   * [BN] ডাটাবেজ থেকে সমস্ত সক্রিয় রোল (বা ডিলিটকৃতসহ) সংগ্রহ করা
   */
  getRoles: async (includeDeleted: boolean = false): Promise<BackendRoleDto[]> => {
    const response = await apiClient.get<BackendRoleDto[]>(`/roles${includeDeleted ? '?includeDeleted=true' : ''}`);
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response as unknown as BackendRoleDto[];
    return [];
  },

  /**
   * [EN] Fetch role definition by standard role code
   * [BN] রোল কোড দিয়ে নির্দিষ্ট রোলের তথ্য সংগ্রহ করা
   */
  getRoleByCode: async (roleCode: string): Promise<BackendRoleDto> => {
    const response = await apiClient.get<BackendRoleDto>(`/roles/${roleCode}`);
    const data = response?.data || (response as unknown as BackendRoleDto);
    if (!data) {
      throw new Error(`Role not found: ${roleCode}`);
    }
    return data;
  },

  /**
   * [EN] Creates a new enterprise custom role
   * [BN] কারখানার জন্য নতুন কাস্টম এন্টারপ্রাইজ রোল তৈরি করা (রুল ২৫)
   */
  createRole: async (payload: CreateRolePayload): Promise<BackendRoleDto> => {
    const response = await apiClient.post<BackendRoleDto>('/roles', payload);
    return response.data || (response as unknown as BackendRoleDto);
  },

  /**
   * [EN] Updates an existing custom role title, description, and permissions
   * [BN] বিদ্যমান রোলের নাম, বিবরণ ও পারমিশন হালনাগাদ করা
   */
  updateRole: async (roleCode: string, payload: UpdateRolePayload): Promise<BackendRoleDto> => {
    const response = await apiClient.put<BackendRoleDto>(`/roles/${roleCode}`, payload);
    return response.data || (response as unknown as BackendRoleDto);
  },

  /**
   * [EN] Deletes a custom role (protected from system roles)
   * [BN] কাস্টম এন্টারপ্রাইজ রোল ডাটাবেজ থেকে অপসারণ
   */
  deleteRole: async (roleCode: string): Promise<void> => {
    await apiClient.delete(`/roles/${roleCode}`);
  },

  /**
   * [EN] Restores a soft-deleted custom role
   * [BN] সফট-ডিলিটকৃত কাস্টম রোল ফিরিয়ে আনা
   */
  restoreRole: async (roleCode: string): Promise<BackendRoleDto> => {
    const response = await apiClient.post<BackendRoleDto>(`/roles/${roleCode}/restore`);
    return response.data || (response as unknown as BackendRoleDto);
  },

  /**
   * [EN] Permanently purges a soft-deleted custom role from database
   * [BN] সফট-ডিলিটকৃত কাস্টম রোল চিরতরে মুছে ফেলা
   */
  purgeRole: async (roleCode: string): Promise<void> => {
    await apiClient.delete(`/roles/${roleCode}/purge`);
  },

  /**
   * [EN] Fetch dynamic permission codes assigned to a role in PostgreSQL
   * [BN] ডাটাবেজ থেকে সরাসরি রোলের নির্ধারিত পারমিশন কোড আনা
   */
  getRolePermissions: async (roleCode: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(`/roles/${roleCode}/permissions`);
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response as unknown as string[];
    return [];
  },

  /**
   * [EN] Save updated permission codes for a role in PostgreSQL role_permissions
   * [BN] ডাটাবেজে রোলের নতুন পারমিশন কোড সেট সংরক্ষণ করা
   */
  updateRolePermissions: async (
    roleCode: string,
    permissionCodes: readonly string[]
  ): Promise<string[]> => {
    const response = await apiClient.put<string[]>(
      `/roles/${roleCode}/permissions`,
      permissionCodes
    );
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response as unknown as string[];
    return [];
  },
};
