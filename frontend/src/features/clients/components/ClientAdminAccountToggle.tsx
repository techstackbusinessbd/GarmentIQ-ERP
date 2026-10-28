/**
 * =============================================================================
 * [EN] Client Onboarding Administrator Account Toggle Section (ClientAdminAccountToggle.tsx)
 * [BN] ক্লায়েন্ট অনবোর্ডিং প্রধান অ্যাডমিন একাউন্ট টগল সেকশন (রুল ০৭, ১৫, ২০)
 * =============================================================================
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ClientStep3Admin } from './ClientStep3Admin';

export interface ClientAdminAccountToggleProps {
  readonly createAdminAccount: boolean;
  readonly onCreateAdminAccountChange: (val: boolean) => void;
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

export const ClientAdminAccountToggle: React.FC<ClientAdminAccountToggleProps> = ({
  createAdminAccount,
  onCreateAdminAccountChange,
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
  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand-accent" />
          <span>5. Primary Administrator Account</span>
        </h2>
        <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={createAdminAccount}
            onChange={(e) => onCreateAdminAccountChange(e.target.checked)}
            className="rounded border-border-subtle text-brand-accent focus:ring-brand-accent/30 h-4 w-4 cursor-pointer"
          />
          <span>Provision Admin Account</span>
        </label>
      </div>

      {createAdminAccount ? (
        <ClientStep3Admin
          adminFullName={adminFullName}
          onAdminFullNameChange={onAdminFullNameChange}
          adminEmail={adminEmail}
          onAdminEmailChange={onAdminEmailChange}
          adminUsername={adminUsername}
          onAdminUsernameChange={onAdminUsernameChange}
          adminPhone={adminPhone}
          onAdminPhoneChange={onAdminPhoneChange}
          adminPassword={adminPassword}
          onAdminPasswordChange={onAdminPasswordChange}
          adminPasswordConfirm={adminPasswordConfirm}
          onAdminPasswordConfirmChange={onAdminPasswordConfirmChange}
          subdomainOrHost={subdomainOrHost}
          errors={errors}
        />
      ) : (
        <div className="p-3 bg-surface-muted/50 border border-border-subtle rounded-[4px] text-xs text-text-muted flex items-center gap-2">
          <ShieldCheck size={14} className="text-text-muted shrink-0" />
          <span>
            Client organization will be created without an initial administrator account. You can create users later in User Management.
          </span>
        </div>
      )}
    </div>
  );
};

export default ClientAdminAccountToggle;
