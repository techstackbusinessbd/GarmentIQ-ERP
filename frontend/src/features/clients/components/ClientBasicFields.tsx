/**
 * =============================================================================
 * [EN] Client Factory Reusable Form Input Fields (ClientBasicFields.tsx)
 * [BN] ক্লায়েন্ট কারখানা পুনর্ব্যবহারযোগ্য ফর্ম ইনপুট ফিল্ডস (রুল ০৭, ১৫ ও ২০)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server-side)
 * [BN] নতুন অনবোর্ডিং এবং এডিট পেজের জন্য শেয়ার্ড ফর্ম ফিল্ড কম্পোনেন্ট।
 */

import React from 'react';
import { Building2, Award, Mail, Phone, MapPin, ShieldCheck, Sparkles, FileText, BadgeCheck } from 'lucide-react';

export interface ClientBasicFieldsProps {
  readonly isEditing: boolean;
  readonly tenantCode: string;
  readonly onTenantCodeChange?: (val: string) => void;
  readonly tenantName: string;
  readonly onTenantNameChange: (val: string) => void;
  readonly contactEmail: string;
  readonly onContactEmailChange: (val: string) => void;
  readonly contactPhone: string;
  readonly onContactPhoneChange: (val: string) => void;
  readonly address: string;
  readonly onAddressChange: (val: string) => void;
  readonly tradeLicenseNo?: string;
  readonly onTradeLicenseNoChange?: (val: string) => void;
  readonly bgmeaRegNo?: string;
  readonly onBgmeaRegNoChange?: (val: string) => void;
  readonly subscriptionTier?: string;
  readonly onSubscriptionTierChange?: (val: string) => void;
  readonly showSubscriptionTierSelect?: boolean;
  readonly active?: boolean;
  readonly onActiveChange?: (val: boolean) => void;
  readonly isSystemTenant?: boolean;
}

export const ClientBasicFields: React.FC<ClientBasicFieldsProps> = ({
  isEditing,
  tenantCode,
  onTenantCodeChange: _onTenantCodeChange,
  tenantName,
  onTenantNameChange,
  contactEmail,
  onContactEmailChange,
  contactPhone,
  onContactPhoneChange,
  address,
  onAddressChange,
  tradeLicenseNo = '',
  onTradeLicenseNoChange,
  bgmeaRegNo = '',
  onBgmeaRegNoChange,
  subscriptionTier = 'ENTERPRISE',
  onSubscriptionTierChange,
  showSubscriptionTierSelect = false,
  active = true,
  onActiveChange,
  isSystemTenant = false,
}) => {
  return (
    <div className="space-y-5">
      {/* 2-Column: Company Code & Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Code (System Auto-Generated - Rule 24) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-text-primary">
              Company Code
            </label>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-1.5 py-0.5 rounded-[3px]">
              <Sparkles size={11} />
              <span>Auto-Generated</span>
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
              <Building2 size={14} />
            </span>
            <input
              type="text"
              readOnly
              disabled
              value={isEditing ? tenantCode : (tenantCode || 'SYSTEM AUTO-GENERATED')}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono uppercase bg-surface-muted/50 border border-border-subtle rounded-[4px] text-text-secondary cursor-not-allowed select-none font-bold"
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            {isEditing
              ? 'Company code is permanently assigned by the system and cannot be modified.'
              : 'System automatically assigns next sequential code conforming to CLT-{SEQ:4} format.'}
          </p>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Company Name <span className="text-status-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={tenantName}
            onChange={(e) => onTenantNameChange(e.target.value)}
            placeholder="e.g. Ha-Meem Denim Mills Ltd."
            className="w-full px-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors"
          />
          <p className="text-[10px] text-text-muted mt-1">
            Official business entity name printed on reports, invoices, and shipping manifests.
          </p>
        </div>
      </div>

      {/* 2-Column: Legal Credentials (Trade License No & BGMEA Reg No) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trade License Number */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Trade License / Incorporation No
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
              <FileText size={14} />
            </span>
            <input
              type="text"
              value={tradeLicenseNo}
              onChange={(e) => onTradeLicenseNoChange?.(e.target.value)}
              placeholder="e.g. TRAD/DNCC/021984/2023"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors"
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            City Corporation / Municipal trade license number for regulatory compliance.
          </p>
        </div>

        {/* BGMEA / BKMEA Reg No */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            BGMEA / BKMEA Registration No
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
              <BadgeCheck size={14} />
            </span>
            <input
              type="text"
              value={bgmeaRegNo}
              onChange={(e) => onBgmeaRegNoChange?.(e.target.value)}
              placeholder="e.g. BGMEA-REG-04812"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors"
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            National apparel export association member registry ID for bonded UD privileges.
          </p>
        </div>
      </div>

      {/* 2-Column: Contact Email & Contact Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Email */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Contact Email <span className="text-status-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
              <Mail size={14} />
            </span>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => onContactEmailChange(e.target.value)}
              placeholder="admin@company.com"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors"
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            Primary email address for account notifications, alerts, and billing notices.
          </p>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
              <Phone size={14} />
            </span>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => onContactPhoneChange(e.target.value)}
              placeholder="+880 1711-000000"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors"
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            Company office or support contact phone number.
          </p>
        </div>
      </div>

      {/* Company Address */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Registered Corporate Address
        </label>
        <div className="relative">
          <span className="absolute top-2 left-2.5 pointer-events-none text-text-muted">
            <MapPin size={14} />
          </span>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Plot 123, Industrial Area, Ashulia, Dhaka, Bangladesh"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors resize-none"
          />
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          Registered corporate headquarters or central apparel manufacturing facility.
        </p>
      </div>

      {/* Subscription Plan & Account Status (when showSubscriptionTierSelect or isEditing) */}
      {(showSubscriptionTierSelect || isEditing) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border-subtle">
          {showSubscriptionTierSelect && onSubscriptionTierChange && (
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Subscription Plan <span className="text-status-danger">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
                  <Award size={14} />
                </span>
                <select
                  value={subscriptionTier}
                  onChange={(e) => onSubscriptionTierChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="ENTERPRISE">ENTERPRISE (Full O2S, RFID Tracking, Multi-Plant)</option>
                  <option value="PROFESSIONAL">PROFESSIONAL (Woven/Denim, Standard Barcode)</option>
                  <option value="STARTER">STARTER (Basic Merchandising & Inventory)</option>
                </select>
              </div>
            </div>
          )}

          {isEditing && onActiveChange && (
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Account Status
              </label>
              {isSystemTenant ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-accent-light border border-brand-accent/20 rounded-[4px] text-brand-accent text-xs font-semibold">
                  <ShieldCheck size={14} />
                  <span>System Root Account (Always Active)</span>
                </div>
              ) : (
                <select
                  value={active ? 'ACTIVE' : 'SUSPENDED'}
                  onChange={(e) => onActiveChange(e.target.value === 'ACTIVE')}
                  className="w-full px-3 py-1.5 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE (Normal Access)</option>
                  <option value="SUSPENDED">SUSPENDED (Access Disabled)</option>
                </select>
              )}
              <p className="text-[10px] text-text-muted mt-1">
                Suspended accounts prevent all users from logging in.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientBasicFields;
