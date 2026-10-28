/**
 * =============================================================================
 * [EN] Step 1: Organization Identity & Deployment (ClientStep1Corporate.tsx)
 * [BN] ধাপ ১: প্রতিষ্ঠান পরিচিতি ও ক্লাউড/প্রাইভেট হোস্টিং কনফিগারেশন (রুল ০৭ ও ২১)
 * =============================================================================
 */

import React from 'react';
import { Building2, Factory, Cloud, Server, Lock, Globe } from 'lucide-react';
import { FormField, TextInput } from '@/components/ui';
import { ClientWovenCategorySelector } from './ClientWovenCategorySelector';

export interface ClientStep1CorporateProps {
  readonly tenantCode: string;
  readonly tenantName: string;
  readonly onTenantNameChange: (val: string) => void;
  readonly companyType: 'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY';
  readonly onCompanyTypeChange: (val: 'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY') => void;
  readonly hostingType: 'CLOUD_SAAS' | 'SELF_HOSTED';
  readonly onHostingTypeChange: (val: 'CLOUD_SAAS' | 'SELF_HOSTED') => void;
  readonly subdomain: string;
  readonly onSubdomainChange: (val: string) => void;
  readonly customDomain: string;
  readonly onCustomDomainChange: (val: string) => void;
  readonly businessType: string;
  readonly onBusinessTypeChange: (val: string) => void;
  readonly active?: boolean;
  readonly onActiveChange?: (val: boolean) => void;
  readonly isSystemTenant?: boolean;
  readonly errors?: Record<string, string>;
}

export const ClientStep1Corporate: React.FC<ClientStep1CorporateProps> = ({
  tenantCode,
  tenantName,
  onTenantNameChange,
  companyType,
  onCompanyTypeChange,
  hostingType,
  onHostingTypeChange,
  subdomain,
  onSubdomainChange,
  customDomain,
  onCustomDomainChange,
  businessType,
  onBusinessTypeChange,
  active = true,
  onActiveChange,
  isSystemTenant = false,
  errors = {},
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Account Status Switch (Edit Mode) */}
      {onActiveChange && (
        <div className="flex items-center justify-between p-3 bg-surface-muted/50 border border-border-subtle rounded-[6px]">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-status-success animate-pulse' : 'bg-status-warning'}`} />
            <div>
              <span className="text-xs font-bold text-text-primary block">
                Account Status: {active ? 'Active' : 'Suspended'}
              </span>
              <span className="text-[10px] text-text-muted block">
                {isSystemTenant ? 'System platform root tenant cannot be suspended' : 'Control operational login access for this client'}
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              disabled={isSystemTenant}
              onChange={(e) => onActiveChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-accent disabled:opacity-50"></div>
          </label>
        </div>
      )}

      {/* 2-Column: Company Code & Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Company Code"
          helperText="System-generated code"
          className="md:col-span-1"
        >
          <TextInput
            value={tenantCode || 'CLT-0001'}
            readOnly
            leftIcon={<Lock size={14} />}
            className="font-mono font-bold tracking-wider uppercase text-text-secondary"
          />
        </FormField>

        <FormField
          label="Company Name"
          required
          error={errors.tenantName}
          helperText="Official registered company name"
          className="md:col-span-2"
        >
          <TextInput
            placeholder="e.g. Ha-Meem Denim Mills Ltd."
            value={tenantName}
            onChange={(e) => onTenantNameChange(e.target.value)}
            leftIcon={<Building2 size={14} />}
            hasError={Boolean(errors.tenantName)}
            autoFocus
          />
        </FormField>
      </div>

      {/* 2-Column: Company Type & Hosting Model Linear/macOS Style Segmented Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Type Segmented Switcher */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Company Type <span className="text-status-danger">*</span>
          </label>
          <div className="grid grid-cols-2 p-1 bg-surface-muted/80 rounded-md border border-border-subtle shadow-inner h-9.5 gap-1">
            <button
              type="button"
              onClick={() => onCompanyTypeChange('GROUP_OF_COMPANIES')}
              className={`flex items-center justify-center gap-2 text-xs rounded-sm transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${
                companyType === 'GROUP_OF_COMPANIES'
                  ? 'bg-surface-card text-text-primary font-bold shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-card/40 font-medium'
              }`}
            >
              <div className={`p-1 rounded-[3px] flex items-center justify-center ${companyType === 'GROUP_OF_COMPANIES' ? 'bg-brand-accent/15 text-brand-accent' : 'text-text-muted'}`}>
                <Building2 size={13} />
              </div>
              <span className="truncate">Group of Companies</span>
            </button>
            <button
              type="button"
              onClick={() => onCompanyTypeChange('STANDALONE_FACTORY')}
              className={`flex items-center justify-center gap-2 text-xs rounded-sm transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${
                companyType === 'STANDALONE_FACTORY'
                  ? 'bg-surface-card text-text-primary font-bold shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-card/40 font-medium'
              }`}
            >
              <div className={`p-1 rounded-[3px] flex items-center justify-center ${companyType === 'STANDALONE_FACTORY' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'text-text-muted'}`}>
                <Factory size={13} />
              </div>
              <span className="truncate">Single Factory</span>
            </button>
          </div>
        </div>

        {/* Hosting Model Segmented Switcher */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Hosting Model <span className="text-status-danger">*</span>
          </label>
          <div className="grid grid-cols-2 p-1 bg-surface-muted/80 rounded-md border border-border-subtle shadow-inner h-9.5 gap-1">
            <button
              type="button"
              onClick={() => onHostingTypeChange('CLOUD_SAAS')}
              className={`flex items-center justify-center gap-2 text-xs rounded-sm transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${
                hostingType === 'CLOUD_SAAS'
                  ? 'bg-surface-card text-text-primary font-bold shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-card/40 font-medium'
              }`}
            >
              <div className={`p-1 rounded-[3px] flex items-center justify-center ${hostingType === 'CLOUD_SAAS' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400' : 'text-text-muted'}`}>
                <Cloud size={13} />
              </div>
              <span className="truncate">Managed Cloud</span>
            </button>
            <button
              type="button"
              onClick={() => onHostingTypeChange('SELF_HOSTED')}
              className={`flex items-center justify-center gap-2 text-xs rounded-sm transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${
                hostingType === 'SELF_HOSTED'
                  ? 'bg-surface-card text-text-primary font-bold shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-card/40 font-medium'
              }`}
            >
              <div className={`p-1 rounded-[3px] flex items-center justify-center ${hostingType === 'SELF_HOSTED' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' : 'text-text-muted'}`}>
                <Server size={13} />
              </div>
              <span className="truncate">Self-Hosted</span>
            </button>
          </div>
        </div>
      </div>

      {/* Woven Manufacturing Category: Executive Compact 3-Card Grid (Rule 07, 17) */}
      <ClientWovenCategorySelector
        value={businessType}
        onChange={onBusinessTypeChange}
      />

      {/* Subdomain / Domain Input */}
      {hostingType === 'CLOUD_SAAS' ? (
        <FormField
          label="Subdomain"
          required
          error={errors.subdomain}
          helperText={`Access URL: https://${subdomain || 'company'}.garmentiq.com`}
        >
          <div className="flex items-center">
            <TextInput
              placeholder="e.g. hameem"
              value={subdomain}
              onChange={(e) =>
                onSubdomainChange(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                )
              }
              leftIcon={<Globe size={14} />}
              hasError={Boolean(errors.subdomain)}
              className="rounded-r-none font-mono"
            />
            <span className="h-9 px-3 bg-surface-muted border border-l-0 border-border-subtle rounded-r-[4px] text-xs font-mono text-text-muted flex items-center select-none shrink-0">
              .garmentiq.com
            </span>
          </div>
        </FormField>
      ) : (
        <FormField
          label="Server Domain or IP"
          required
          error={errors.customDomain}
          helperText="Domain name or static IP address of the local server"
        >
          <TextInput
            placeholder="e.g. erp.hameemgroup.com or 192.168.1.100"
            value={customDomain}
            onChange={(e) => onCustomDomainChange(e.target.value)}
            leftIcon={<Server size={14} />}
            hasError={Boolean(errors.customDomain)}
            className="font-mono"
          />
        </FormField>
      )}
    </div>
  );
};

export default ClientStep1Corporate;
