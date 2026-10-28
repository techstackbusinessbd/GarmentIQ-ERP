/**
 * =============================================================================
 * [EN] User Basic Information & Credentials Form Component (UserBasicFields)
 * [BN] ব্যবহারকারী প্রোফাইল, রোল ও ক্রেডেনশিয়াল ফর্ম কম্পোনেন্ট (UserBasicFields)
 * =============================================================================
 * [EN] Reference: Approved UI/UX Specification by CTO (2026-10-21)
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] একক সমন্বিত কার্ডে ক্লায়েন্ট টেন্যান্ট, এমপ্লয়ি কার্ড নম্বর, রোল, স্ট্যাটাস ও ক্রেডেনশিয়াল।
 */

import React from 'react';
import {
  Building2,
  User as UserIcon,
  AtSign,
  Mail,
  Briefcase,
  Phone,
  Activity,
  IdCard,
} from 'lucide-react';
import type { UserStatus, Tenant } from '@/types';
import type { RoleDefinition } from '../constants/roleConstants';
import { UserRoleDropdown } from './UserRoleDropdown';
import { UserPasswordFields } from './UserPasswordFields';

export interface UserBasicFieldsProps {
  readonly isEditing: boolean;
  readonly fullName: string; readonly onFullNameChange: (v: string) => void;
  readonly username: string; readonly onUsernameChange: (v: string) => void;
  readonly email: string; readonly onEmailChange: (v: string) => void;
  readonly employeeCardNo: string; readonly onEmployeeCardNoChange: (v: string) => void;
  readonly designation: string; readonly onDesignationChange: (v: string) => void;
  readonly phone: string; readonly onPhoneChange: (v: string) => void;
  readonly selectedRoles: readonly string[]; readonly onToggleRole: (roleCode: string) => void;
  readonly availableRoles?: readonly RoleDefinition[];
  readonly onSelectAllRoles?: () => void; readonly onClearRoles?: () => void;
  readonly status: UserStatus; readonly onStatusChange: (v: UserStatus) => void;
  readonly password?: string; readonly onPasswordChange?: (v: string) => void;
  readonly confirmPassword?: string; readonly onConfirmPasswordChange?: (v: string) => void;
  readonly tenantId?: string; readonly onTenantIdChange?: (v: string) => void;
  readonly tenants?: readonly Tenant[]; readonly isSuperAdmin?: boolean;
  readonly currentTenantName?: string; readonly currentTenantCode?: string;
}

export const UserBasicFields: React.FC<UserBasicFieldsProps> = ({
  isEditing,
  availableRoles,
  fullName,
  onFullNameChange,
  username,
  onUsernameChange,
  email,
  onEmailChange,
  employeeCardNo,
  onEmployeeCardNoChange,
  designation,
  onDesignationChange,
  phone,
  onPhoneChange,
  selectedRoles,
  onToggleRole,
  onSelectAllRoles,
  onClearRoles,
  status,
  onStatusChange,
  password = '',
  onPasswordChange,
  confirmPassword = '',
  onConfirmPasswordChange,
  tenantId = '',
  onTenantIdChange,
  tenants = [],
  isSuperAdmin = false,
  currentTenantName = 'Enterprise Platform',
  currentTenantCode = 'PRIMARY',
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 0: Client Organization / Factory Tenant Selection */}
      <div className="space-y-1.5 sm:col-span-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-text-primary">
            Client Organization / Factory Tenant <span className="text-status-danger">*</span>
          </label>
          <span className="text-[10px] font-mono text-brand-accent">
            {isSuperAdmin ? 'Super Admin Privilege' : 'Factory Bound'}
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Building2 size={14} />
          </div>
          {isSuperAdmin ? (
            <select
              value={tenantId}
              onChange={(e) => onTenantIdChange?.(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none cursor-pointer font-medium transition-colors"
            >
              <option value="" disabled>-- Select Client Factory Organization --</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tenantName || t.companyName} ({t.tenantCode})
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full pl-9 pr-3 py-2 text-xs bg-surface-muted border border-border-subtle rounded-[4px] text-text-muted font-medium flex items-center justify-between">
              <span>{currentTenantName} ({currentTenantCode})</span>
              <span className="text-[10px] text-text-muted font-mono">Locked to your factory</span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-text-muted">
          {isSuperAdmin
            ? 'Select which client organization or factory group this user account belongs to'
            : 'User account is strictly isolated within your registered factory organization'}
        </p>
      </div>

      {/* Row 1, Col 1: Full Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Full Name <span className="text-status-danger">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <UserIcon size={14} />
          </div>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="e.g. Tanvir Ahmed"
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none transition-colors"
          />
        </div>
        <p className="text-[10px] text-text-muted">Legal employee or floor operator name</p>
      </div>

      {/* Row 1, Col 2: Username */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Username <span className="text-status-danger">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <AtSign size={14} />
          </div>
          <input
            type="text"
            required
            disabled={isEditing}
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="e.g. tanvir.ahmed"
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none disabled:bg-surface-muted disabled:text-text-muted font-mono transition-colors"
          />
        </div>
        <p className="text-[10px] text-text-muted">Unique login account identifier</p>
      </div>

      {/* Row 2, Col 1: Email Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Email Address <span className="text-status-danger">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Mail size={14} />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="e.g. user@factory.com"
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none transition-colors"
          />
        </div>
        <p className="text-[10px] text-text-muted">Corporate email for OTP & alerts</p>
      </div>

      {/* Row 2, Col 2: Employee ID (Punch / RFID) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Employee ID (Punch / RFID)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <IdCard size={14} />
          </div>
          <input
            type="text"
            value={employeeCardNo}
            onChange={(e) => onEmployeeCardNoChange(e.target.value)}
            placeholder="e.g. 255776"
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none font-mono transition-colors"
          />
        </div>
        <p className="text-[10px] text-text-muted">Factory punch machine or RFID card number (e.g. 255776)</p>
      </div>

      {/* Row 3, Col 1: Designation */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Designation
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Briefcase size={14} />
          </div>
          <input
            type="text"
            value={designation}
            onChange={(e) => onDesignationChange(e.target.value)}
            placeholder="e.g. Merchandiser Lead"
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none transition-colors"
          />
        </div>
        <p className="text-[10px] text-text-muted">Operational job role on factory floor</p>
      </div>

      {/* Row 3, Col 2: Phone Number */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Phone size={14} />
          </div>
          <input
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+8801700000000"
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none font-mono transition-colors"
          />
        </div>
        <p className="text-[10px] text-text-muted">Mobile contact with country code</p>
      </div>

      {/* Row 4, Col 1: Assigned Roles & Operational Authorities */}
      <div className="space-y-1.5">
        <UserRoleDropdown
          selectedRoles={selectedRoles}
          availableRoles={availableRoles}
          onToggleRole={onToggleRole}
          onSelectAll={onSelectAllRoles}
          onClearSelection={onClearRoles}
        />
      </div>

      {/* Row 4, Col 2: Account Status */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-text-primary">
            Account Status <span className="text-status-danger">*</span>
          </label>
          <span className="text-[11px] font-mono font-medium text-brand-accent">
            {status}
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Activity size={14} />
          </div>
          <select
            value={status}
            disabled={selectedRoles.includes('ROLE_SUPER_ADMIN') || selectedRoles.includes('SUPER_ADMIN') || username === 'superadmin'}
            onChange={(e) => onStatusChange(e.target.value as UserStatus)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="ACTIVE">ACTIVE (Full access)</option>
            {status === 'LOCKED' && <option value="LOCKED">LOCKED (Temporarily locked)</option>}
            <option value="INACTIVE">INACTIVE (Temporarily disabled)</option>
            <option value="SUSPENDED">SUSPENDED (Security lock)</option>
          </select>
        </div>
        <p className="text-[10px] text-text-muted">Immediate operational authorization state</p>
      </div>

      {/* Row 5 (Create Only): Modular Password Fields */}
      {!isEditing && (
        <UserPasswordFields
          password={password}
          onPasswordChange={onPasswordChange}
          confirmPassword={confirmPassword}
          onConfirmPasswordChange={onConfirmPasswordChange}
        />
      )}
    </div>
  );
};

export default UserBasicFields;
