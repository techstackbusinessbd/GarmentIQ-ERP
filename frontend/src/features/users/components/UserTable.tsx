/**
 * =============================================================================
 * [EN] Enterprise User Data Grid Table Component (UserTable)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী ডেটা গ্রিড টেবিল কম্পোনেন্ট (UserTable)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { User, Tenant } from '@/types';
import { DataTable, Button } from '@/components/ui';
import { userService } from '../services/userService';
import { clientService } from '@/features/clients/services/clientService';
import { UserDeactivateModal } from './UserDeactivateModal';
import { UserRestoreModal } from './UserRestoreModal';
import { UserPurgeModal } from './UserPurgeModal';
import { useUserColumns } from './useUserColumns';

/** [EN] UserTable properties contract / [BN] UserTable কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট */
export interface UserTableProps {
  readonly users: readonly User[];
  readonly isLoading: boolean;
  readonly onRefresh: () => void;
}

/** [EN] Unified User Table Component / [BN] সমন্বিত ইউজার টেবিল কম্পোনেন্ট */
export const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onRefresh }) => {
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'TRASH'>('ACTIVE');
  const [selectedClient, setSelectedClient] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [userToRestore, setUserToRestore] = useState<User | null>(null);
  const [userToPurge, setUserToPurge] = useState<User | null>(null);
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  /** [EN] Fetch all registered tenant organizations / [BN] নিবন্ধিত টেন্যান্ট তালিকা আনয়ন */
  useEffect(() => {
    clientService
      .getAllTenants()
      .then((data) => {
        if (Array.isArray(data)) setAvailableTenants(data);
      })
      .catch(() => {
        // Safe fallback when non-superadmin or offline
      });
  }, []);

  const activeCount = useMemo(() => users.filter((u) => !u.isDeleted && !u.deleted).length, [users]);
  const trashCount = useMemo(() => users.filter((u) => u.isDeleted || u.deleted).length, [users]);

  const modeFilteredUsers = useMemo(() => {
    return users.filter((u) => {
      const isDel = Boolean(u.isDeleted || u.deleted);
      return viewMode === 'TRASH' ? isDel : !isDel;
    });
  }, [users, viewMode]);

  /** [EN] Unique client options with counts / [BN] ক্লায়েন্ট ড্রপডাউন অপশন ও ইউজার সংখ্যা */
  const clientOptions = useMemo(() => {
    const map = new Map<string, { code: string; name: string; count: number }>();

    availableTenants.forEach((t) => {
      if (t.tenantCode) {
        map.set(t.tenantCode, {
          code: t.tenantCode,
          name: t.tenantName || t.companyName || t.tenantCode,
          count: 0,
        });
      }
    });

    modeFilteredUsers.forEach((u) => {
      const code = u.tenantCode || u.tenantId || 'SYSTEM';
      const existing = map.get(code);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(code, {
          code,
          name: u.tenantName || (code === 'SYSTEM' ? 'GarmentIQ ERP' : 'Enterprise Platform'),
          count: 1,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.code === 'SYSTEM') return -1;
      if (b.code === 'SYSTEM') return 1;
      return a.code.localeCompare(b.code);
    });
  }, [modeFilteredUsers, availableTenants]);

  /** [EN] Users belonging to selected client / [BN] নির্দিষ্ট ক্লায়েন্টের আওতাধীন ইউজার */
  const usersForCurrentClient = useMemo(() => {
    if (selectedClient === 'ALL') return modeFilteredUsers;
    return modeFilteredUsers.filter((u) => {
      const code = u.tenantCode || u.tenantId || 'SYSTEM';
      return code === selectedClient || u.tenantId === selectedClient;
    });
  }, [modeFilteredUsers, selectedClient]);

  /** [EN] Filtered users based on client and status / [BN] ফিল্টারকৃত ইউজার তালিকা */
  const filteredUsers = useMemo(() => {
    return usersForCurrentClient.filter((u) => {
      if (selectedStatus === 'ALL') return true;
      return u.status === selectedStatus;
    });
  }, [usersForCurrentClient, selectedStatus]);

  /** [EN] Execute user deactivation / [BN] ব্যবহারকারী নিষ্ক্রিয়করণ */
  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return;
    setIsDeactivating(true);
    try {
      await userService.deleteUser(userToDeactivate.id);
      toast.success(`User @${userToDeactivate.username} moved to trash.`);
      setUserToDeactivate(null);
      onRefresh();
    } catch {
      toast.error('Failed to deactivate user.');
    } finally {
      setIsDeactivating(false);
    }
  };

  /** [EN] Execute user restore / [BN] ব্যবহারকারী অ্যাকাউন্ট পুনর্বহাল */
  const handleConfirmRestore = async () => {
    if (!userToRestore) return;
    setIsRestoring(true);
    try {
      await userService.restoreUser(userToRestore.id);
      toast.success(`User @${userToRestore.username} restored successfully.`);
      setUserToRestore(null);
      onRefresh();
    } catch {
      toast.error('Failed to restore user.');
    } finally {
      setIsRestoring(false);
    }
  };

  /** [EN] Execute permanent user purge / [BN] ব্যবহারকারী অ্যাকাউন্ট চিরতরে মুছে ফেলা */
  const handleConfirmPurge = async () => {
    if (!userToPurge) return;
    setIsPurging(true);
    try {
      await userService.purgeUser(userToPurge.id);
      toast.success(`User @${userToPurge.username} permanently purged.`);
      setUserToPurge(null);
      onRefresh();
    } catch {
      toast.error('Failed to purge user.');
    } finally {
      setIsPurging(false);
    }
  };

  /** [EN] Toggle lock / unlock state / [BN] অ্যাকাউন্ট লক বা আনলক টগল */
  const handleToggleLock = async (u: User) => {
    try {
      if (u.status === 'LOCKED') {
        await userService.unlockUser(u.id);
        toast.success(`User @${u.username} unlocked successfully.`);
      } else {
        await userService.updateUser(u.id, { status: 'LOCKED' });
        toast.success(`User @${u.username} locked successfully.`);
      }
      onRefresh();
    } catch {
      toast.error('Failed to change user lock state.');
    }
  };

  /** [EN] Columns generated via hook / [BN] কলাম ডেফিনিশন হুক */
  const columns = useUserColumns({
    onToggleLock: handleToggleLock,
    onDeactivate: setUserToDeactivate,
    onRestore: setUserToRestore,
    onPurge: setUserToPurge,
  });

  return (
    <>
      <DataTable
        title="User Directory"
        icon={<Users size={16} className="text-brand-accent" />}
        headerExtra={
          <span className="text-xs text-text-muted font-medium">
            Total: <span className="font-semibold text-text-primary">{filteredUsers.length}</span>
            {filteredUsers.length !== users.length && <span className="text-text-muted"> of {users.length}</span>}{' '}
            {users.length === 1 ? 'User' : 'Users'}
          </span>
        }
        headerActions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-0.5 bg-surface-muted rounded border border-border-subtle">
              <button
                type="button"
                onClick={() => setViewMode('ACTIVE')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  viewMode === 'ACTIVE' ? 'bg-surface-card text-brand-accent shadow-2xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('TRASH')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  viewMode === 'TRASH' ? 'bg-surface-card text-status-danger shadow-2xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Trash ({trashCount})
              </button>
            </div>

            <label htmlFor="user-client-filter" className="text-xs font-medium text-text-secondary whitespace-nowrap">Client:</label>
            <select
              id="user-client-filter"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="max-w-[200px] truncate px-2.5 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Clients ({modeFilteredUsers.length})</option>
              {clientOptions.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.count})</option>
              ))}
            </select>

            {viewMode === 'ACTIVE' && (
              <>
                <label htmlFor="user-status-filter" className="text-xs font-medium text-text-secondary whitespace-nowrap">Status:</label>
                <select
                  id="user-status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
                >
                  <option value="ALL">All Statuses ({usersForCurrentClient.length})</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="LOCKED">LOCKED ({usersForCurrentClient.filter((u) => u.status === 'LOCKED').length})</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </>
            )}

            <Button size="xs" variant="secondary" onClick={onRefresh} disabled={isLoading} icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}>
              Refresh
            </Button>
          </div>
        }
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        searchPlaceholder="Search by name, username, card ID, or email..."
        initialPageSize={10}
      />

      <UserDeactivateModal
        isOpen={Boolean(userToDeactivate)}
        username={userToDeactivate?.username || ''}
        isDeactivating={isDeactivating}
        onClose={() => setUserToDeactivate(null)}
        onConfirm={handleConfirmDeactivate}
      />

      <UserRestoreModal
        isOpen={Boolean(userToRestore)}
        username={userToRestore?.username || ''}
        isRestoring={isRestoring}
        onClose={() => setUserToRestore(null)}
        onConfirm={handleConfirmRestore}
      />

      <UserPurgeModal
        isOpen={Boolean(userToPurge)}
        username={userToPurge?.username || ''}
        isPurging={isPurging}
        onClose={() => setUserToPurge(null)}
        onConfirm={handleConfirmPurge}
      />
    </>
  );
};

export default UserTable;
