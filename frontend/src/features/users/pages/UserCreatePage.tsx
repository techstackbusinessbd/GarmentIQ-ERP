/**
 * =============================================================================
 * [EN] User Account Provisioning Page (UserCreatePage)
 * [BN] নতুন ব্যবহারকারী নিবন্ধন ও রোল নির্ধারণ পেজ (UserCreatePage)
 * =============================================================================
 * [EN] Reference: Approved UI/UX Specification by CTO (2026-10-21)
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] একক সমন্বিত কার্ডে ক্লায়েন্ট টেন্যান্ট, এমপ্লয়ি কার্ড নম্বর, রোল, স্ট্যাটাস ও লাইভ প্রিভিউ।
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { UserStatus, Tenant } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { PageHeader, Button } from '@/components/ui';
import { userService } from '../services/userService';
import { clientService } from '@/features/clients/services/clientService';
import { roleService } from '@/features/privileges/services/roleService';
import { UserBasicFields } from '../components/UserBasicFields';
import { UserPreviewCard } from '../components/UserPreviewCard';
import type { RoleDefinition } from '../constants/roleConstants';

export const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, hasRole } = useAuthStore();
  const isSuperAdmin = hasRole('ROLE_SUPER_ADMIN');

  // Tenant state for multi-tenant allocation
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState<string>(authUser?.tenantId || '');
  const [availableRoles, setAvailableRoles] = useState<RoleDefinition[]>([]);

  // Form input states
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [employeeCardNo, setEmployeeCardNo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Submission state and server error
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load live database roles & tenants
  useEffect(() => {
    roleService.getRoles().then((data) => {
      const visibleData = isSuperAdmin ? data : data.filter((r) => r.roleCode !== 'ROLE_SUPER_ADMIN');
      setAvailableRoles(visibleData.map((r) => {
        const isBuiltIn = r.isSystemRole ?? r.systemRole ?? ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER'].includes(r.roleCode);
        return {
          code: r.roleCode, name: r.roleName, description: r.description || '',
          badgeVariant: r.roleCode === 'ROLE_SUPER_ADMIN' ? 'danger' : isBuiltIn ? 'primary' : 'success',
          permissions: r.permissions, isSystemRole: isBuiltIn,
        };
      }));
    }).catch(() => {});
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) {
      clientService.getAllTenants().then((data) => {
        setTenants(data);
        if (data[0] && !tenantId) setTenantId(data[0].id);
      }).catch(() => {});
    }
  }, [isSuperAdmin, tenantId]);

  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const currentTenantName =
    selectedTenant?.tenantName ||
    selectedTenant?.companyName ||
    authUser?.tenantName ||
    'Enterprise Platform';
  const currentTenantCode =
    selectedTenant?.tenantCode || authUser?.tenantCode || 'PRIMARY';

  /** [EN] Toggle role selection in dropdown / [BN] রোল সিলেকশন টগল */
  const handleToggleRole = (roleCode: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleCode)
        ? prev.filter((r) => r !== roleCode)
        : [...prev, roleCode]
    );
  };

  /** [EN] Select all roles / [BN] সকল রোল সিলেক্ট */
  const handleSelectAllRoles = () => {
    setSelectedRoles((availableRoles.length > 0 ? availableRoles : []).map((r) => r.code));
  };

  /** [EN] Clear all roles / [BN] সকল রোল ক্লিয়ার */
  const handleClearRoles = () => {
    setSelectedRoles([]);
  };

  /** [EN] Handle form submission with server-side validation / [BN] ফর্ম সাবমিশন */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please check and try again.');
      setIsSubmitting(false);
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error('Please assign at least one system role.');
      setIsSubmitting(false);
      return;
    }

    try {
      await userService.createUser({
        tenantId: isSuperAdmin && tenantId ? tenantId : undefined,
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        employeeCardNo: employeeCardNo.trim() || undefined,
        phone: phone.trim() || undefined,
        designation: designation.trim() || undefined,
        status,
        roles: selectedRoles,
        roleCodes: selectedRoles,
      });

      toast.success(`User @${username} created successfully.`);
      navigate('/app/admin/users');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to create user. Please check server validation.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header & Navigation Actions */}
      <PageHeader
        title="Create User"
        breadcrumbs={[
          { label: 'Home', href: '/app/overview' },
          { label: 'Administration', href: '/app/admin/users' },
          { label: 'User Directory', href: '/app/admin/users' },
          { label: 'Create User' },
        ]}
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/app/admin/users')}
              icon={<ArrowLeft size={14} />}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              form="user-create-form"
              disabled={isSubmitting}
              icon={<UserPlus size={14} />}
            >
              {isSubmitting ? 'Saving' : 'Save'}
            </Button>
          </>
        }
      />

      {/* Server Validation Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-status-danger-bg border border-status-danger-border rounded-[4px] flex items-start gap-2.5 text-status-danger text-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-bold">Validation Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Workspace Grid (Form + Live Identity Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Input in a Single Cohesive Card (8 Cols) */}
        <div className="lg:col-span-8">
          <form id="user-create-form" onSubmit={handleSubmit}>
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                  <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    User Profile & System Authorization
                  </h2>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Personal credentials, factory punch card, assigned roles and account status.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-text-muted">
                  Fields with <span className="text-status-danger">*</span> are mandatory
                </span>
              </div>

              <UserBasicFields
                isEditing={false}
                fullName={fullName}
                onFullNameChange={setFullName}
                username={username}
                onUsernameChange={setUsername}
                email={email}
                onEmailChange={setEmail}
                employeeCardNo={employeeCardNo}
                onEmployeeCardNoChange={setEmployeeCardNo}
                designation={designation}
                onDesignationChange={setDesignation}
                phone={phone}
                onPhoneChange={setPhone}
                selectedRoles={selectedRoles}
                availableRoles={availableRoles}
                onToggleRole={handleToggleRole}
                onSelectAllRoles={handleSelectAllRoles}
                onClearRoles={handleClearRoles}
                status={status}
                onStatusChange={setStatus}
                password={password}
                onPasswordChange={setPassword}
                confirmPassword={confirmPassword}
                onConfirmPasswordChange={setConfirmPassword}
                tenantId={tenantId}
                onTenantIdChange={setTenantId}
                tenants={tenants}
                isSuperAdmin={isSuperAdmin}
                currentTenantName={currentTenantName}
                currentTenantCode={currentTenantCode}
              />
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Live Identity Preview (4 Cols) */}
        <div className="lg:col-span-4">
          <UserPreviewCard
            fullName={fullName}
            username={username}
            email={email}
            designation={designation}
            phone={phone}
            employeeCardNo={employeeCardNo}
            tenantName={currentTenantName}
            tenantCode={currentTenantCode}
            status={status}
            selectedRoles={selectedRoles}
            isSubmitting={isSubmitting}
            isEditing={false}
            onCancel={() => navigate('/users')}
            submitFormId="user-create-form"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCreatePage;
