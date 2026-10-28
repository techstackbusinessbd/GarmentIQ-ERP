/**
 * =============================================================================
 * [EN] Multi-Tenant Client Blueprint Live Preview Card (ClientPreviewCard.tsx)
 * [BN] ক্লায়েন্ট প্রতিষ্ঠান লাইভ ব্লুপ্রিন্ট প্রিভিউ ও রেডিনেস গেজ কার্ড (রুল ০৭, ১৫ ও ২০)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] রিয়েল-টাইম প্রোফাইল রেডিনেস স্কোর (০-১০০%), ওভেন ডোমেন ও লিগ্যাল স্ট্যাটাস সামারি।
 */

import React, { useMemo } from 'react';
import {
  Building2,
  Award,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Save,
  ArrowLeft,
  Flame,
  Shirt,
  Layers,
  FileText,
  Gauge,
  Server,
  Cloud,
} from 'lucide-react';

export interface ClientPreviewCardProps {
  readonly tenantCode: string;
  readonly tenantName: string;
  readonly subscriptionTier: string;
  readonly contactEmail: string;
  readonly contactPhone?: string;
  readonly address?: string;
  readonly businessType?: string;
  readonly companyType?: 'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY';
  readonly hostingType?: 'CLOUD_SAAS' | 'SELF_HOSTED';
  readonly tradeLicenseNo?: string;
  readonly bgmeaRegNo?: string;
  readonly active: boolean;
  readonly isEditing: boolean;
  readonly isSubmitting: boolean;
  readonly onCancel: () => void;
  readonly submitFormId: string;
}

export const ClientPreviewCard: React.FC<ClientPreviewCardProps> = ({
  tenantCode,
  tenantName,
  subscriptionTier,
  contactEmail,
  contactPhone = '',
  address = '',
  businessType = 'DENIM',
  companyType = 'GROUP_OF_COMPANIES',
  hostingType = 'CLOUD_SAAS',
  tradeLicenseNo = '',
  bgmeaRegNo = '',
  active,
  isEditing,
  isSubmitting,
  onCancel,
  submitFormId,
}) => {
  /**
   * [EN] Calculate live readiness score (0-100%) based on onboarding fields
   * [BN] অনবোর্ডিং ফর্ম পূরণের ওপর ভিত্তি করে লাইভ রেডিনেস স্কোর হিসাব করা
   */
  const readinessScore = useMemo(() => {
    let score = 0;
    if (tenantName.trim()) score += 30;
    if (contactEmail.trim()) score += 30;
    if (businessType) score += 20;
    if (tradeLicenseNo.trim() || bgmeaRegNo.trim()) score += 20;
    return Math.min(100, score);
  }, [tenantName, contactEmail, businessType, tradeLicenseNo, bgmeaRegNo]);

  const getDomainInfo = (type: string) => {
    switch (type) {
      case 'DENIM':
        return { label: 'Denim Specialist', icon: <Flame size={13} className="text-amber-500 shrink-0" /> };
      case 'NON_DENIM':
        return { label: 'Non-Denim Woven', icon: <Shirt size={13} className="text-sky-500 shrink-0" /> };
      case 'BOTH':
      default:
        return { label: 'Denim & Non-Denim', icon: <Layers size={13} className="text-brand-accent shrink-0" /> };
    }
  };

  const domain = getDomainInfo(businessType);

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header & Readiness Gauge */}
      <div className="border-b border-border-subtle pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Gauge size={13} className="text-brand-accent" />
            <span>{isEditing ? 'Live Profile Snapshot' : 'Onboarding Blueprint'}</span>
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[3px] border ${
              readinessScore >= 80
                ? 'bg-status-success-bg text-status-success border-status-success-border'
                : readinessScore >= 40
                ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
                : 'bg-surface-muted text-text-muted border-border-subtle'
            }`}
          >
            {readinessScore}% READY
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-muted h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              readinessScore >= 80
                ? 'bg-status-success'
                : readinessScore >= 40
                ? 'bg-brand-accent'
                : 'bg-text-muted'
            }`}
            style={{ width: `${readinessScore}%` }}
          />
        </div>

        <h3 className="text-xs font-bold text-text-primary mt-2 truncate">
          {tenantName || 'Company Identity Preview'}
        </h3>
      </div>

      {/* Main Identity Box */}
      <div className="p-3.5 bg-surface-muted/50 border border-border-subtle rounded-[6px] space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-[4px] bg-brand-accent-light text-brand-accent flex items-center justify-center font-bold text-xs shrink-0">
              <Building2 size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-text-primary block truncate">
                {tenantName || 'Pending Company Name'}
              </span>
              <span className="font-mono text-[10px] font-bold text-brand-accent uppercase">
                {tenantCode || 'CLT-0001'}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-wider border shrink-0 ${
              active
                ? 'bg-status-success-bg text-status-success border-status-success-border'
                : 'bg-status-danger-bg text-status-danger border-status-danger-border'
            }`}
          >
            {active ? <CheckCircle2 size={10} /> : <AlertOctagon size={10} />}
            <span>{active ? 'ACTIVE' : 'SUSPENDED'}</span>
          </span>
        </div>

        {/* Woven Category & Structure Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold bg-surface-card border border-border-subtle text-text-primary">
            {domain.icon}
            <span>{domain.label}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-medium bg-surface-card border border-border-subtle text-text-muted">
            {companyType === 'GROUP_OF_COMPANIES' ? 'Group of Companies' : 'Single Factory'}
          </span>
        </div>
      </div>

      {/* Deployment & Legal Specs Grid */}
      <div className="space-y-1.5 text-[11px] pt-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
          Corporate Architecture
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-surface-muted/30 border border-border-subtle rounded-[4px]">
            <div className="flex items-center gap-1 text-text-muted text-[10px]">
              {hostingType === 'CLOUD_SAAS' ? <Cloud size={11} /> : <Server size={11} />}
              <span>Hosting</span>
            </div>
            <span className="font-semibold text-xs text-text-primary block mt-0.5">
              {hostingType === 'CLOUD_SAAS' ? 'Cloud SaaS' : 'Self-Hosted'}
            </span>
          </div>

          <div className="p-2 bg-surface-muted/30 border border-border-subtle rounded-[4px]">
            <div className="flex items-center gap-1 text-text-muted text-[10px]">
              <Award size={11} />
              <span>Subscription</span>
            </div>
            <span className="font-semibold text-xs text-text-primary block mt-0.5">
              {subscriptionTier}
            </span>
          </div>
        </div>

        {(tradeLicenseNo || bgmeaRegNo) && (
          <div className="flex items-center gap-1.5 text-text-muted text-[10px] pt-0.5">
            <FileText size={11} className="shrink-0" />
            <span className="truncate">
              {[tradeLicenseNo ? `TL: ${tradeLicenseNo}` : '', bgmeaRegNo ? `Reg: ${bgmeaRegNo}` : ''].filter(Boolean).join(' • ')}
            </span>
          </div>
        )}
      </div>

      {/* Contact Summary */}
      <div className="space-y-1.5 text-[11px] text-text-secondary border-t border-border-subtle pt-2">
        <div className="flex items-center gap-2">
          <Mail size={12} className="text-text-muted shrink-0" />
          <span className="truncate">{contactEmail || 'No contact email'}</span>
        </div>
        {contactPhone && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-text-muted shrink-0" />
            <span className="truncate font-mono">{contactPhone}</span>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-2">
            <MapPin size={12} className="text-text-muted shrink-0 mt-0.5" />
            <span className="line-clamp-1">{address}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-border-subtle space-y-2">
        <button
          type="submit"
          form={submitFormId}
          disabled={isSubmitting}
          className="w-full py-2 px-3 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover rounded-[4px] shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          <Save size={14} />
          <span>{isSubmitting ? 'Saving' : 'Save'}</span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full py-1.5 px-3 text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-card hover:bg-surface-muted border border-border-subtle rounded-[4px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default ClientPreviewCard;
