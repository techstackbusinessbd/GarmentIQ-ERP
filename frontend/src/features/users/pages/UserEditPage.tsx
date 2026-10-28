/**
 * [EN] User Account Modification Page (UserEditPage)
 * [BN] ব্যবহারকারী তথ্য হালনাগাদ ও রোল পরিবর্তন পেজ (UserEditPage)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, RefreshCw, Unlock, Lock, Shield, KeyRound, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import type { User, UserStatus, Tenant } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { PageHeader, Button } from '@/components/ui';
import { userService } from '../services/userService';
import { clientService } from '@/features/clients/services/clientService';
import { roleService } from '@/features/privileges/services/roleService';
import { UserBasicFields } from '../components/UserBasicFields';
import { UserPreviewCard } from '../components/UserPreviewCard';
import type { RoleDefinition } from '../constants/roleConstants';

export const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser, hasRole } = useAuthStore();
  const isSuperAdmin = hasRole('ROLE_SUPER_ADMIN');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState<string>(authUser?.tenantId || '');
  const [availableRoles, setAvailableRoles] = useState<RoleDefinition[]>([]);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [employeeCardNo, setEmployeeCardNo] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    roleService.getRoles().then((data) => {
      const visibleData = isSuperAdmin ? data : data.filter((r) => r.roleCode !== 'ROLE_SUPER_ADMIN');
      setAvailableRoles(visibleData.map((r) => ({
        code: r.roleCode, name: r.roleName, description: r.description || '',
        badgeVariant: r.roleCode === 'ROLE_SUPER_ADMIN' ? 'danger' : (r.isSystemRole ?? r.systemRole) ? 'primary' : 'success',
        permissions: r.permissions,
        isSystemRole: r.isSystemRole ?? r.systemRole ?? ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER'].includes(r.roleCode),
      })));
    }).catch(() => {});
  }, [isSuperAdmin]);

  const loadUser = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await userService.getUserById(id);
      setCurrentUser(user);
      setTenantId(user.tenantId);
      setUsername(user.username);
      setEmail(user.email);
      setFullName(user.fullName);
      setEmployeeCardNo(user.employeeCardNo || '');
      setPhone(user.phone || '');
      setDesignation(user.designation || '');
      setStatus(user.status || 'ACTIVE');
      setSelectedRoles(user.roles || []);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to fetch user record.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => { if (isSuperAdmin) clientService.getAllTenants().then(setTenants).catch(() => {}); }, [isSuperAdmin]);

  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const currentTenantName = selectedTenant?.tenantName || currentUser?.tenantName || authUser?.tenantName || 'Enterprise Platform';
  const currentTenantCode = selectedTenant?.tenantCode || currentUser?.tenantCode || authUser?.tenantCode || 'PRIMARY';

  const handleToggleRole = (roleCode: string) => {
    setSelectedRoles((prev) => prev.includes(roleCode) ? prev.filter((r) => r !== roleCode) : [...prev, roleCode]);
  };

  const handleDirectUnlock = async () => {
    if (!id) return;
    setIsUnlocking(true);
    try {
      await userService.unlockUser(id);
      setStatus('ACTIVE');
      if (currentUser) setCurrentUser({ ...currentUser, status: 'ACTIVE' });
      toast.success(`User @${username} unlocked successfully.`);
    } catch {
      toast.error('Failed to unlock user.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (selectedRoles.length === 0) {
      toast.error('Please assign at least one system role.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const updatedUser = await userService.updateUser(id, {
        tenantId: isSuperAdmin && tenantId ? tenantId : undefined,
        email: email.trim(), fullName: fullName.trim(),
        employeeCardNo: employeeCardNo.trim() || undefined,
        phone: phone.trim() || undefined, designation: designation.trim() || undefined,
        status, roles: selectedRoles, roleCodes: selectedRoles,
      });
      setCurrentUser(updatedUser);
      toast.success(`User @${username} updated successfully.`);
      navigate('/app/admin/users');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to update user profile.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="animate-spin text-brand-accent" size={28} />
        <p className="text-xs text-text-muted">Loading user profile details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Edit User"
        breadcrumbs={[
          { label: 'Home', href: '/app/overview' },
          { label: 'Administration', href: '/app/admin/users' },
          { label: 'User Directory', href: '/app/admin/users' },
          { label: 'Edit User' },
        ]}
        actions={
          <>
            <Button size="sm" variant="secondary" onClick={() => navigate('/app/admin/users')} icon={<ArrowLeft size={14} />}>
              Cancel
            </Button>
            {id && (
              <Button size="sm" variant="secondary" onClick={() => navigate(`/app/admin/users/${id}/reset-password`)} icon={<KeyRound size={14} />} title="Reset password for this user">
                Password
              </Button>
            )}
            {id && (
              <Button size="sm" variant="secondary" onClick={() => navigate(`/app/admin/roles/matrix?mode=user&userId=${id}`)} icon={<Shield size={14} />} title="Configure custom permissions in central Access Matrix">
                Privileges
              </Button>
            )}
            <Button size="sm" variant="primary" type="submit" form="user-edit-form" disabled={isSubmitting} icon={<Save size={14} />}>
              {isSubmitting ? 'Saving' : 'Save'}
            </Button>
          </>
        }
      />

      {currentUser?.status === 'LOCKED' && (
        <div className="p-3 bg-status-warning-bg border border-status-warning-border rounded-[4px] flex items-center justify-between gap-2.5 text-text-primary text-xs">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-status-warning shrink-0" />
            <span>This account is currently <strong>LOCKED</strong> due to consecutive failed login attempts.</span>
          </div>
          <Button
            size="xs"
            variant="secondary"
            onClick={handleDirectUnlock}
            disabled={isUnlocking}
            icon={<Unlock size={12} />}
          >
            Unlock
          </Button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-status-danger-bg border border-status-danger-border rounded-[4px] flex items-start gap-2.5 text-status-danger text-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-bold">Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <form id="user-edit-form" onSubmit={handleSubmit}>
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                  <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    User Profile & System Authorization
                  </h2>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Update profile credentials, punch card number, assigned roles, and status.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-text-muted">
                  Fields with <span className="text-status-danger">*</span> are mandatory
                </span>
              </div>

              <UserBasicFields
                isEditing={true}
                fullName={fullName} onFullNameChange={setFullName}
                username={username} onUsernameChange={setUsername}
                email={email} onEmailChange={setEmail}
                employeeCardNo={employeeCardNo} onEmployeeCardNoChange={setEmployeeCardNo}
                designation={designation} onDesignationChange={setDesignation}
                phone={phone} onPhoneChange={setPhone}
                selectedRoles={selectedRoles} onToggleRole={handleToggleRole}
                availableRoles={availableRoles}
                onSelectAllRoles={() => setSelectedRoles((availableRoles.length > 0 ? availableRoles : []).map((r) => r.code))}
                onClearRoles={() => setSelectedRoles([])}
                status={status} onStatusChange={setStatus}
                tenantId={tenantId} onTenantIdChange={setTenantId}
                tenants={tenants} isSuperAdmin={isSuperAdmin}
                currentTenantName={currentTenantName} currentTenantCode={currentTenantCode}
              />
            </div>
          </form>

          {id && (
            <div className="mt-4 p-3.5 bg-surface-card border border-border-subtle rounded-[6px] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-[4px] bg-brand-accent/10 text-brand-accent shrink-0">
                  <Shield size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">Fine-Grained Custom Privileges</h3>
                  <p className="text-[11px] text-text-muted">Configure granular custom grants in the Access Matrix.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/app/admin/roles/matrix?mode=user&userId=${id}`)}
                className="px-2.5 py-1 text-xs font-semibold text-brand-accent hover:text-white bg-brand-accent/10 hover:bg-brand-accent border border-brand-accent/30 rounded-[4px] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
              >
                <span>Matrix</span>
                <SlidersHorizontal size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <UserPreviewCard
            fullName={fullName} username={username} email={email}
            designation={designation} phone={phone} employeeCardNo={employeeCardNo}
            tenantName={currentTenantName} tenantCode={currentTenantCode}
            status={status} selectedRoles={selectedRoles}
            isSubmitting={isSubmitting} isEditing={true}
            onCancel={() => navigate('/app/admin/users')} submitFormId="user-edit-form"
          />
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
