/**
 * =============================================================================
 * [EN] Enterprise Platform Governance & Foundation Overview (DashboardOverviewPage)
 * [BN] এন্টারপ্রাইজ প্ল্যাটফর্ম গভর্ন্যান্স ও ফাউন্ডেশন ওভারভিউ পেজ
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 13 (Zero Demo Data), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] ফ্রেশ সিস্টেমের জন্য ১০০% লাইভ ডেটাবেজ মেট্রিক্স ও অ্যাডমিন অনবোর্ডিং কনসোল।
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Users,
  Shield,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { isPlatformSuperAdmin } from '@/routes';
import { WidgetMetricCard, PageHeader, Button, Badge } from '@/components/ui';
import { clientService } from '@/features/clients';
import { userService } from '@/features/users';
import { roleService, permissionService } from '@/features/privileges';

interface PlatformStats {
  tenantsCount: number;
  usersCount: number;
  activeUsersCount: number;
  lockedUsersCount: number;
  rolesCount: number;
  permissionsCount: number;
}

/**
 * [EN] Fresh Enterprise Platform Overview Component.
 * [BN] ফ্রেশ এন্টারপ্রাইজ প্ল্যাটফর্ম ওভারভিউ কম্পোনেন্ট।
 */
export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = isPlatformSuperAdmin(user);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState<PlatformStats>({
    tenantsCount: 0,
    usersCount: 0,
    activeUsersCount: 0,
    lockedUsersCount: 0,
    rolesCount: 0,
    permissionsCount: 0,
  });

  /**
   * [EN] Loads live platform statistics directly from PostgreSQL database via services
   * [BN] সার্ভিসসমূহের মাধ্যমে সরাসরি PostgreSQL ডাটাবেজ থেকে লাইভ প্ল্যাটফর্ম পরিসংখ্যান লোড করে
   */
  const loadPlatformStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [tenants, users, roles, permissions] = await Promise.all([
        isPlatformSuperAdmin(useAuthStore.getState().user)
          ? clientService.getAllTenants().catch(() => [])
          : Promise.resolve([]),
        userService.getUsers().catch(() => []),
        roleService.getRoles().catch(() => []),
        permissionService.getAllPermissions().catch(() => []),
      ]);

      const activeUsers = users.filter((u: { status: string }) => u.status === 'ACTIVE').length;
      const lockedUsers = users.filter((u: { status: string }) => u.status === 'LOCKED').length;

      setStats({
        tenantsCount: isPlatformSuperAdmin(useAuthStore.getState().user) ? tenants.length : 1,
        usersCount: users.length,
        activeUsersCount: activeUsers,
        lockedUsersCount: lockedUsers,
        rolesCount: roles.length,
        permissionsCount: permissions.length,
      });
    } catch {
      toast.error('Failed to refresh platform overview.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPlatformStats();
  }, [loadPlatformStats]);

  const handleRefresh = async () => {
    await loadPlatformStats();
    toast.success('Dashboard Refreshed', {
      description: 'Live factory, user, and access statistics updated.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/app/overview' },
          { label: 'Platform Overview' },
        ]}
        title="Enterprise Platform Overview"
        badge={
          <Badge variant="success" icon={<CheckCircle2 size={12} />}>
            System Operational
          </Badge>
        }
        subtitle={`Welcome, ${user?.fullName || user?.username || 'Administrator'}. Enterprise governance and system administration console.`}
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
        }
      />

      {/* 4-Column Live Database Metrics Grid (Zero Mock Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetMetricCard
          id="registered-tenants"
          title={isSuperAdmin ? 'Factory Tenants' : 'Tenant Workspace'}
          value={isSuperAdmin ? `${stats.tenantsCount} Org` : (user?.tenantCode || 'STANDARD GROUP')}
          subtitle={isSuperAdmin ? 'Registered Factory Groups' : 'Factory Workspace'}
          icon={<Building2 size={16} />}
          accentVariant="primary"
          badge={{ label: 'Active', variant: 'success' }}
        />

        <WidgetMetricCard
          id="active-system-users"
          title="System Users"
          value={`${stats.usersCount} Accounts`}
          subtitle={`${stats.activeUsersCount} Active • ${stats.lockedUsersCount} Locked`}
          icon={<Users size={16} />}
          accentVariant="success"
          badge={{ label: 'Active', variant: 'success' }}
        />

        <WidgetMetricCard
          id="system-roles"
          title="Security Roles"
          value={`${stats.rolesCount} Roles`}
          subtitle="Enterprise Role Hierarchy"
          icon={<Shield size={16} />}
          accentVariant="primary"
          badge={{ label: 'RBAC', variant: 'info' }}
        />

        <WidgetMetricCard
          id="active-permissions"
          title="Permission Rules"
          value={`${stats.permissionsCount} Rules`}
          subtitle="Security Access Rules"
          icon={<ShieldCheck size={16} />}
          accentVariant="warning"
          badge={{ label: 'Active', variant: 'info' }}
        />
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
