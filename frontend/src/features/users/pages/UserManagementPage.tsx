/**
 * =============================================================================
 * [EN] Enterprise User Management Page Component (UserManagementPage)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী ব্যবস্থাপনা পেজ কম্পোনেন্ট (UserManagementPage)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 * [BN] ব্যবহারকারী একাউন্ট পর্যবেক্ষণ, নতুন ইউজার যোগ এবং ভূমিকা-অনুমতি নিয়ন্ত্রণ।
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { userService } from '../services/userService';
import { UserTable } from '../components/UserTable';

/**
 * [EN] User Directory Workspace Page Component.
 * [BN] ব্যবহারকারী ডিরেক্টরি ওয়ার্কস্পেস পেজ কম্পোনেন্ট (রুল ০৭, ১৫ ও ২১)।
 */
export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * [EN] Fetch user records from backend REST API
   * [BN] ব্যাকএন্ড এপিআই থেকে ব্যবহারকারী তালিকা সংগ্রহ
   */
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers(true);
      setUsers(data);
    } catch {
      // Handled by global apiClient interceptor
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="w-full">
      <UserTable
        users={users}
        isLoading={isLoading}
        onRefresh={loadUsers}
      />
    </div>
  );
};

export default UserManagementPage;
