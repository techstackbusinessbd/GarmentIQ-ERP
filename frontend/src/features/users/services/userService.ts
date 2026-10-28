/**
 * =============================================================================
 * [EN] Enterprise User Management REST Service (userService)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী ব্যবস্থাপনা সার্ভিস (userService) (রুল ০৭ ও ১৫ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Server-Side Validation)
 * [BN] ব্যাকএন্ড /api/v1/users এন্ডপয়েন্টের সাথে যোগাযোগের জন্য টাইপড ক্লায়েন্ট সার্ভিস।
 */

import { apiClient } from '@/services/apiClient';
import type { User, CreateUserRequest, UpdateUserRequest, ApiResponse, UserCustomPermission } from '@/types';

/**
 * [EN] Service object encapsulating all user CRUD REST operations.
 * [BN] ব্যবহারকারী সংক্রান্ত সমস্ত ক্রুড অপারেশন পরিচালনাকারী সার্ভিস অবজেক্ট।
 */
export const userService = {
  /**
    * [EN] Fetch active (or optionally all including soft-deleted) users.
   * [BN] বর্তমান টেন্যান্টের সক্রিয় (বা ডিলিটকৃতসহ) ব্যবহারকারীর তালিকা আনা।
   */
  getUsers: async (includeDeleted: boolean = false): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/users${includeDeleted ? '?includeDeleted=true' : ''}`);
    return response.data || [];
  },

  /**
   * [EN] Fetch single user profile by UUID.
   * [BN] আইডি দিয়ে নির্দিষ্ট ব্যবহারকারীর প্রোফাইল আনা।
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    if (!response.data) {
      throw new Error('User record not found.');
    }
    return response.data;
  },

  /**
   * [EN] Provision a new user account with credentials and roles.
   * [BN] নতুন ব্যবহারকারী অ্যাকাউন্ট ও রোল তৈরি করা।
   */
  createUser: async (payload: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', payload);
    if (!response.data) {
      throw new Error('Failed to create user record.');
    }
    return response.data;
  },

  /**
   * [EN] Update existing user profile information and assigned roles.
   * [BN] বিদ্যমান ব্যবহারকারীর প্রোফাইল ও রোল হালনাগাদ করা।
   */
  updateUser: async (id: string, payload: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, payload);
    if (!response.data) {
      throw new Error('Failed to update user record.');
    }
    return response.data;
  },

  /**
   * [EN] Perform safe soft deletion of a user account.
   * [BN] ব্যবহারকারী অ্যাকাউন্ট সফট-ডিলিট করা।
   */
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/users/${id}`);
  },

  /**
   * [EN] Restores a soft-deleted user account.
   * [BN] সফট-ডিলিটকৃত ব্যবহারকারী অ্যাকাউন্ট ফিরিয়ে আনা।
   */
  restoreUser: async (id: string): Promise<User> => {
    const response = await apiClient.post<User>(`/users/${id}/restore`);
    if (!response.data) {
      throw new Error('Failed to restore user record.');
    }
    return response.data;
  },

  /**
   * [EN] Permanently purges a soft-deleted user account from database.
   * [BN] সফট-ডিলিটকৃত ব্যবহারকারী অ্যাকাউন্ট চিরতরে মুছে ফেলা।
   */
  purgeUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/users/${id}/purge`);
  },

  /**
   * [EN] Unlock a locked user account and reset failed login attempts.
   * [BN] লক হওয়া ব্যবহারকারী অ্যাকাউন্ট আনলক করা।
   */
  unlockUser: async (id: string): Promise<User> => {
    const response = await apiClient.post<User>(`/users/${id}/unlock`);
    if (!response.data) {
      throw new Error('Failed to unlock user record.');
    }
    return response.data;
  },

  /**
   * [EN] Fetch all custom permission overrides for a specific user.
   * [BN] নির্দিষ্ট ব্যবহারকারীর কাস্টম পারমিশন ওভাররাইড তালিকা সংগ্রহ।
   */
  getCustomPermissions: async (id: string): Promise<UserCustomPermission[]> => {
    const response = await apiClient.get<UserCustomPermission[]>(`/users/${id}/custom-permissions`);
    return response.data || [];
  },

  /**
   * [EN] Bulk update custom permission overrides for a specific user.
   * [BN] ব্যবহারকারীর কাস্টম পারমিশন তালিকা বাল্ক হালনাগাদ করা।
   */
  updateCustomPermissions: async (id: string, permissions: UserCustomPermission[]): Promise<UserCustomPermission[]> => {
    const response = await apiClient.put<UserCustomPermission[]>(`/users/${id}/custom-permissions`, { permissions });
    return response.data || [];
  },

  /**
   * [EN] Admin resets user password with optional account unlocking.
   * [BN] অ্যাডমিন কর্তৃক ইউজারের পাসওয়ার্ড রিসেট ও আনলক করা।
   */
  resetPassword: async (id: string, newPassword: string, unlockAccount: boolean = true): Promise<User> => {
    const response = await apiClient.post<User>(`/users/${id}/reset-password`, {
      newPassword,
      unlockAccount,
    });
    if (!response.data) {
      throw new Error('Failed to reset user password.');
    }
    return response.data;
  },

  /**
   * [EN] Authenticated employee changes own password with old password verification.
   * [BN] লগইনকৃত ব্যবহারকারী কর্তৃক নিজ পাসওয়ার্ড পরিবর্তন।
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

export default userService;
