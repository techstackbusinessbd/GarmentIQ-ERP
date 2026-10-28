/**
 * =============================================================================
 * [EN] User Password Reset Workspace Page (UserPasswordResetPage.tsx)
 * [BN] ব্যবহারকারী পাসওয়ার্ড রিসেট কার্যক্ষেত্র পেজ (UserPasswordResetPage.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 27 (Full-page)
 * [BN] অ্যাডমিন কর্তৃক কর্মীদের নিরাপদ পাসওয়ার্ড রিসেট, অটো-জেনারেট ও আনলকিং ওয়ার্কফ্লো।
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Lock,
  RefreshCw,
  ShieldCheck,
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

  // Load all users for directory selection
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
      // If param or query param provided, ensure it's selected
      const targetId = paramId || searchParams.get('userId');
      if (targetId) {
        setSelectedUserId(targetId);
      }
    } catch {
      toast.error('Failed to load user directory.');
    } finally {
      setIsLoading(false);
    }
  }, [paramId, searchParams]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Sync state if paramId changes
  useEffect(() => {
    if (paramId) {
      setSelectedUserId(paramId);
    }
  }, [paramId]);

  // Resolve currently selected target user
  const targetUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  // Filter locked accounts needing immediate unlock/reset
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="animate-spin text-brand-accent" size={28} />
        <p className="text-xs text-text-muted">Loading employee credentials workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Password Reset Workspace"
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
              icon={<Users size={14} />}
            >
              Directory
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={loadUsers}
              disabled={isLoading}
              icon={<RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Searchable User Selector Toolbar */}
      <div className="p-4 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Target Employee Selection
            </label>
            <p className="text-[11px] text-text-muted mt-0.5">
              Search by name, @username, punch card ID, or email to reset credentials.
            </p>
          </div>
          <div className="w-full sm:w-80">
            <SearchableUserSelect
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={handleSelectUser}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Locked Accounts Quick-Select Alert Pill Bar */}
        {lockedUsers.length > 0 && (
          <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-2 text-xs">
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <AlertTriangle size={13} className="text-amber-600" />
              <span>{lockedUsers.length} Locked Account{lockedUsers.length > 1 ? 's' : ''}:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {lockedUsers.map((lu) => (
                <button
                  key={lu.id}
                  type="button"
                  onClick={() => handleSelectUser(lu.id)}
                  className={`px-2 py-0.5 rounded-[3px] text-[11px] font-mono font-medium transition-colors cursor-pointer flex items-center gap-1 border ${
                    selectedUserId === lu.id
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                  }`}
                  title="Click to select this locked account"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {targetUser ? (
            <>
              {/* Target User Overview Card */}
              <div className="p-4 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-brand-accent/15 text-brand-accent font-bold text-base flex items-center justify-center shrink-0">
                    {targetUser.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-text-primary truncate">{targetUser.fullName}</h2>
                      <span className="font-mono text-xs text-text-muted">(@{targetUser.username})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      {targetUser.employeeCardNo && (
                        <span className="px-1.5 py-0.2 rounded bg-surface-muted text-brand-accent font-mono text-[10px] font-bold border border-border-subtle">
                          Card ID: {targetUser.employeeCardNo}
                        </span>
                      )}
                      <span className="text-text-muted text-[11px]">{targetUser.email}</span>
                      {targetUser.designation && (
                        <span className="text-text-muted text-[11px]">• {targetUser.designation}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <Badge variant={targetUser.status === 'LOCKED' ? 'warning' : 'success'}>
                    {targetUser.status}
                  </Badge>
                  {targetUser.status === 'LOCKED' && (
                    <span className="text-[10px] text-status-warning flex items-center gap-1 font-medium">
                      <Lock size={10} /> Locked Account
                    </span>
                  )}
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
            </>
          ) : (
            <div className="p-8 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto">
                <KeyRound size={22} />
              </div>
              <h3 className="text-sm font-bold text-text-primary">No Employee Selected</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                Please search and select an employee from the dropdown above, or select a locked account to reset their password.
              </p>
            </div>
          )}
        </div>

        {/* Right Info Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-brand-accent" />
              <span>Security Protocols</span>
            </h4>
            <div className="space-y-2 text-xs text-text-muted leading-relaxed">
              <p>
                <strong>Administrative Reset Only:</strong> For factory and data security, employee password resets are managed directly by authorized system administrators.
              </p>
              <p>
                <strong>Password Policy:</strong> Minimum 8 characters with alphanumeric credentials.
              </p>
              <p>
                <strong>Audit Trail:</strong> All password updates and unlock actions are recorded with admin identifier and timestamp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPasswordResetPage;
