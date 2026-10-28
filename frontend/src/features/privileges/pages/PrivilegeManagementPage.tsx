/**
 * =============================================================================
 * [EN] Enterprise Role Directory Workspace (PrivilegeManagementPage)
 * [BN] এন্টারপ্রাইজ রোল ডিরেক্টরি ওয়ার্কস্পেস পেজ (PrivilegeManagementPage)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components), Rule 27
 * [BN] ক্লায়েন্ট ও ইউজার ডিরেক্টরির সাথে হুবহু একীভূত এন্টারপ্রাইজ রোল ও পারমিশন কন্ট্রোল।
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { RoleDefinition } from '@/features/users';
import { RoleTable } from '../components/RoleTable';
import { roleService } from '../services/roleService';
import { usePermission } from '../hooks/usePermission';

/**
 * [EN] Role Directory Management Workspace Page Component.
 * [BN] রোল ডিরেক্টরি ব্যবস্থাপনা ওয়ার্কস্পেস পেজ কম্পোনেন্ট (রুল ২৭ অনুবর্তী ফুল-পেজ রাউটিং)।
 */
export const PrivilegeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperAdmin: isCallerSuperAdmin } = usePermission();
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  /**
   * [EN] Fetch active & soft-deleted roles dynamically from PostgreSQL database
   * [BN] ডাটাবেজ থেকে সমস্ত সক্রিয় ও সফট-ডিলিটকৃত রোল এবং পারমিশন সরাসরি লোড করা
   */
  const loadRoles = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await roleService.getRoles(true);
      const visibleData = isCallerSuperAdmin ? data : data.filter((r) => r.roleCode !== 'ROLE_SUPER_ADMIN');
      const mapped: RoleDefinition[] = visibleData.map((r) => {
        const isBuiltIn = r.isSystemRole ?? r.systemRole ?? (
          r.roleCode === 'ROLE_SUPER_ADMIN' ||
          r.roleCode === 'ROLE_ADMIN' ||
          r.roleCode === 'ROLE_USER'
        );

        const isDel = Boolean(r.isDeleted || (r as unknown as { deleted?: boolean }).deleted);

        return {
          code: r.roleCode,
          name: r.roleName,
          description: r.description || '',
          badgeVariant: r.roleCode === 'ROLE_SUPER_ADMIN' ? 'danger' : isBuiltIn ? 'primary' : 'success',
          permissions: r.permissions,
          isSystemRole: isBuiltIn,
          tenantId: r.tenantId,
          tenantCode: r.tenantCode,
          tenantName: r.tenantName,
          isDeleted: isDel,
          deleted: isDel,
        };
      });
      setRoles(mapped);
    } catch {
      toast.error('Failed to load roles from database.');
    } finally {
      setIsRefreshing(false);
    }
  }, [isCallerSuperAdmin]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return (
    <div className="w-full">
      <RoleTable
        roles={roles}
        isLoading={isRefreshing}
        onRefresh={loadRoles}
        onCreateRole={() => navigate('/app/admin/roles/new')}
        onViewPermissions={(role) => navigate(`/app/admin/roles/matrix?mode=role&role=${role.code}`)}
        onViewMatrix={() => navigate('/app/admin/roles/matrix')}
      />
    </div>
  );
};

export default PrivilegeManagementPage;
