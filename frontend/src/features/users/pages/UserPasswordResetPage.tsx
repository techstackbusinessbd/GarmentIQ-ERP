/**
 * =============================================================================
 * [EN] Premium User Password Reset Page (UserPasswordResetPage.tsx)
 * [BN] প্রিমিয়াম ব্যবহারকারী পাসওয়ার্ড রিসেট পেজ (UserPasswordResetPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28 (Single-word buttons)
 * [BN] কর্মীদের নিরাপদ পাসওয়ার্ড রিসেট, অটো-জেনারেট ও একাউন্ট আনলকিং প্রিমিয়াম কার্যক্ষেত্র।
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Lock,
  RefreshCw,
  AlertTriangle,
  KeyRound,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { PageHeader, Badge, Button } from '@/components/ui';
import { userService } from '../services/userService';
import { UserPasswordResetForm } from '../components/UserPasswordResetForm';
import { SearchableUserSelect } from '@/features/privileges/components/SearchableUserSelect';

export const UserPasswordResetPage: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    paramId || searchParams.get('userId') || ''
  );

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
      const targetId = paramId || searchParams.get('userId');
      if (targetId) {
        setSelectedUserId(targetId);
      }
    } catch {
      toast.error('Failed to load user directory');
    } finally {
      setIsLoading(false);
    }
  }, [paramId, searchParams]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (paramId) {
      setSelectedUserId(paramId);
    }
  }, [paramId]);

  const targetUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const lockedUsers = useMemo(
    () => users.filter((u) => u.status === 'LOCKED'),
    [users]
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setSearchParams({ userId }, { replace: true });
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] space-y-2">
        <RefreshCw className="animate-spin text-brand-accent" size={24} />
        <p className="text-xs text-text-muted">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {/* Top Page Header */}
      <PageHeader
        title="Password Reset"
        breadcrumbs={[
          { label: 'Home', href: '/app/overview' },
          { label: 'Administration', href: '/app/admin/users' },
          { label: 'User Directory', href: '/app/admin/users' },
          { label: 'Password Reset' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/app/admin/users')}
              icon={<Users size={13} />}
            >
              Directory
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={loadUsers}
              disabled={isLoading}
              icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Target User Selector Panel */}
      <div className="p-4 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Select Employee
          </label>
          <div className="w-full sm:w-80">
            <SearchableUserSelect
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={handleSelectUser}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Locked Accounts Quick-Select Pills */}
        {lockedUsers.length > 0 && (
          <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-2 text-xs">
            <span className="text-amber-600 font-semibold flex items-center gap-1 text-[11px]">
              <AlertTriangle size={12} className="text-amber-500" />
              <span>{lockedUsers.length} Locked:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1">
              {lockedUsers.map((lu) => (
                <button
                  key={lu.id}
                  type="button"
                  onClick={() => handleSelectUser(lu.id)}
                  className={`px-2 py-0.5 rounded-[3px] text-[11px] font-mono font-medium transition-colors cursor-pointer flex items-center gap-1 border ${
                    selectedUserId === lu.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border-amber-500/20'
                  }`}
                  title="Click to select"
                >
                  <Lock size={10} />
                  <span>@{lu.username}</span>
                  {lu.employeeCardNo && <span className="opacity-75 text-[10px]">({lu.employeeCardNo})</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Body */}
      {targetUser ? (
        <div className="space-y-4">
          {/* Employee Identity Hero Card */}
          <div className="p-4 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent font-bold text-sm flex items-center justify-center shrink-0">
                {targetUser.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-text-primary truncate">{targetUser.fullName}</h2>
                  <span className="font-mono text-[11px] text-text-muted">(@{targetUser.username})</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px]">
                  {targetUser.employeeCardNo && (
                    <span className="px-1.5 py-0.2 rounded bg-surface-base text-brand-accent font-mono text-[10px] font-bold border border-border-subtle">
                      Card: {targetUser.employeeCardNo}
                    </span>
                  )}
                  <span className="text-text-muted">{targetUser.email}</span>
                  {targetUser.designation && (
                    <span className="text-text-muted">• {targetUser.designation}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              <Badge variant={targetUser.status === 'LOCKED' ? 'warning' : 'success'}>
                {targetUser.status}
              </Badge>
            </div>
          </div>

          {/* Reset Password Form */}
          <UserPasswordResetForm
            userId={targetUser.id}
            username={targetUser.username}
            onSuccess={() => {
              loadUsers();
            }}
            onCancel={() => navigate('/app/admin/users')}
          />
        </div>
      ) : (
        <div className="p-10 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs text-center space-y-2.5">
          <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto">
            <KeyRound size={18} />
          </div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">No Employee Selected</h3>
          <p className="text-[11px] text-text-muted max-w-sm mx-auto">
            Select an employee from the dropdown above to reset password credentials.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPasswordResetPage;
