/**
 * =============================================================================
 * [EN] Step 3: Primary Administrator Account (ClientStep3Admin.tsx)
 * [BN] ধাপ ৩: প্রধান ক্লায়েন্ট অ্যাডমিনিস্ট্রেটর অ্যাকাউন্ট (রুল ০৭ ও ২১)
 * =============================================================================
 */

import React, { useState } from 'react';
import { User, AtSign, Mail, Phone, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { FormField, TextInput, Badge } from '@/components/ui';

export interface ClientStep3AdminProps {
  readonly adminFullName: string;
  readonly onAdminFullNameChange: (val: string) => void;
  readonly adminEmail: string;
  readonly onAdminEmailChange: (val: string) => void;
  readonly adminUsername: string;
  readonly onAdminUsernameChange: (val: string) => void;
  readonly adminPhone: string;
  readonly onAdminPhoneChange: (val: string) => void;
  readonly adminPassword: string;
  readonly onAdminPasswordChange: (val: string) => void;
  readonly adminPasswordConfirm: string;
  readonly onAdminPasswordConfirmChange: (val: string) => void;
  readonly subdomainOrHost: string;
  readonly errors?: Record<string, string>;
}

export const ClientStep3Admin: React.FC<ClientStep3AdminProps> = ({
  adminFullName,
  onAdminFullNameChange,
  adminEmail,
  onAdminEmailChange,
  adminUsername,
  onAdminUsernameChange,
  adminPhone,
  onAdminPhoneChange,
  adminPassword,
  onAdminPasswordChange,
  adminPasswordConfirm,
  onAdminPasswordConfirmChange,
  subdomainOrHost,
  errors = {},
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Administrator Notice Banner */}
      <div className="p-3 bg-surface-muted border border-border-subtle rounded-[4px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand-accent shrink-0" />
          <p className="text-xs text-text-secondary">
            This account will be the primary administrator for <span className="font-mono font-bold text-text-primary">{subdomainOrHost}</span>.
          </p>
        </div>
        <Badge variant="success" icon={<ShieldCheck size={11} />}>
          Administrator
        </Badge>
      </div>

      {/* 2-Column: Admin Full Name & Username */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          required
          error={errors.adminFullName}
          helperText="Name of the primary administrator"
        >
          <TextInput
            placeholder="e.g. Inamul Haq Khan"
            value={adminFullName}
            onChange={(e) => onAdminFullNameChange(e.target.value)}
            leftIcon={<User size={14} />}
            hasError={Boolean(errors.adminFullName)}
            autoFocus
          />
        </FormField>

        <FormField
          label="Username"
          required
          error={errors.adminUsername}
          helperText="Sign-in username (lowercase, no spaces)"
        >
          <TextInput
            placeholder="e.g. inamul.admin"
            value={adminUsername}
            onChange={(e) => onAdminUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
            leftIcon={<AtSign size={14} />}
            hasError={Boolean(errors.adminUsername)}
            className="font-mono"
          />
        </FormField>
      </div>

      {/* 2-Column: Work Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Work Email"
          required
          error={errors.adminEmail}
          helperText="Official email for password resets and alerts"
        >
          <TextInput
            type="email"
            placeholder="e.g. inamul.khan@hameem-group.com"
            value={adminEmail}
            onChange={(e) => onAdminEmailChange(e.target.value)}
            leftIcon={<Mail size={14} />}
            hasError={Boolean(errors.adminEmail)}
          />
        </FormField>

        <FormField
          label="Mobile Number"
          error={errors.adminPhone}
          helperText="Direct contact number for account security"
        >
          <TextInput
            type="tel"
            placeholder="e.g. +880 1711-000000"
            value={adminPhone}
            onChange={(e) => onAdminPhoneChange(e.target.value)}
            leftIcon={<Phone size={14} />}
            hasError={Boolean(errors.adminPhone)}
          />
        </FormField>
      </div>

      {/* 2-Column: Password & Confirm Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Password"
          required
          error={errors.adminPassword}
          helperText="Must be at least 6 characters"
        >
          <TextInput
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={adminPassword}
            onChange={(e) => onAdminPasswordChange(e.target.value)}
            hasError={Boolean(errors.adminPassword)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />
        </FormField>

        <FormField
          label="Confirm Password"
          required
          error={errors.adminPasswordConfirm}
          helperText="Re-enter password to confirm"
        >
          <TextInput
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={adminPasswordConfirm}
            onChange={(e) => onAdminPasswordConfirmChange(e.target.value)}
            hasError={Boolean(errors.adminPasswordConfirm)}
          />
        </FormField>
      </div>
    </div>
  );
};

export default ClientStep3Admin;
