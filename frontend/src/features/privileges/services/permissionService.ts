/**
 * =============================================================================
 * [EN] Functional Permissions REST Service (permissionService.ts)
 * [BN] ফাংশনাল পারমিশন ক্যাটালগ রেস্ট সার্ভিস
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ব্যাকএন্ড /api/v1/permissions এন্ডপয়েন্টের মাধ্যমে ডাটাবেজ থেকে সমস্ত পারমিশন আনে।
 */

import { apiClient } from '@/services/apiClient';
import type { MatrixDomainDef } from '../constants/accessMatrixTypes';

export interface BackendPermissionDto {
  readonly id: string;
  readonly permissionCode: string;
  readonly moduleName: string;
  readonly description: string;
}

export const permissionService = {
  /**
   * [EN] Fetch all registered permissions dynamically from PostgreSQL
   * [BN] ডাটাবেজ থেকে সমস্ত সিস্টেম পারমিশন ক্যাটালগ সংগ্রহ করা
   */
  getAllPermissions: async (): Promise<BackendPermissionDto[]> => {
    const response = await apiClient.get<BackendPermissionDto[]>('/permissions');
    return response.data || [];
  },

  /**
   * [EN] Fetch dynamic hierarchical permission matrix catalog grouped by domain and module
   * [BN] ডাটাবেজ থেকে ডোমেন ও মডিউল অনুযায়ী গ্রুপ করা হায়ারার্কিক্যাল প্রিভিলেজ ক্যাটালগ সংগ্রহ করা
   */
  getPermissionCatalog: async (domain?: string): Promise<MatrixDomainDef[]> => {
    const params = domain ? { domain } : undefined;
    const response = await apiClient.get<MatrixDomainDef[]>('/permissions/catalog', { params });
    return response.data || [];
  },
};
