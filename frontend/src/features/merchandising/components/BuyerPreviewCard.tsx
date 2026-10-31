/**
 * =============================================================================
 * [EN] Enterprise Buyer Live Profile Preview Card (BuyerPreviewCard.tsx)
 * [BN] এন্টারপ্রাইজ বায়ার লাইভ প্রোফাইল প্রিভিউ কার্ড (BuyerPreviewCard.tsx)
 * =============================================================================
 * [EN] Reference: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28 (Single-word buttons)
 * [BN] বায়ার তৈরির সময় রিয়েল-টাইম তথ্য প্রিভিউ ও অ্যাকশন বাটন প্যানেল।
 */

import React from 'react';
import {
  Globe,
  DollarSign,
  Percent,
  Calendar,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { Button, Badge, type BadgeVariant } from '@/components/ui';
import type { BuyerType, BuyerStatus, ComplianceStatus } from '@/types';

export interface BuyerPreviewCardProps {
  readonly isEditing?: boolean;
  readonly buyerCode?: string;
  readonly buyerName: string;
  readonly shortName?: string;
  readonly buyerType: BuyerType;
  readonly countryOfOrigin: string;
  readonly defaultCurrency: string;
  readonly paymentTerms: string;
  readonly creditPeriodDays: number;
  readonly commissionPercentage: number;
  readonly complianceStatus: ComplianceStatus;
  readonly status: BuyerStatus;
  readonly isSubmitting: boolean;
  readonly onCancel: () => void;
  readonly submitFormId: string;
}

function getInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return 'BY';
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return (parts[0]?.slice(0, 2) || 'BY').toUpperCase();
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
}

export const BuyerPreviewCard: React.FC<BuyerPreviewCardProps> = ({
  isEditing = false,
  buyerCode,
  buyerName,
  shortName,
  buyerType,
  countryOfOrigin,
  defaultCurrency,
  paymentTerms,
  creditPeriodDays,
  commissionPercentage,
  complianceStatus,
  status,
  isSubmitting,
  onCancel,
  submitFormId,
}) => {
  const complianceVariant: BadgeVariant =
    complianceStatus === 'COMPLIANT'
      ? 'success'
      : complianceStatus === 'CONDITIONAL'
      ? 'warning'
      : 'info';

  const typeVariant: BadgeVariant = buyerType === 'DIRECT' ? 'accent' : 'neutral';
  const statusVariant: BadgeVariant = status === 'ACTIVE' ? 'success' : 'neutral';

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-5 shadow-xs sticky top-6">
      {/* Header Monogram & Name */}
      <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
        <div className="w-12 h-12 rounded-[6px] bg-accent/15 border border-accent/30 text-accent font-bold font-mono text-base flex items-center justify-center shrink-0 shadow-2xs">
          {getInitials(buyerName)}
        </div>
        <div className="truncate flex-1">
          <h4 className="text-sm font-bold text-text-primary truncate">
            {buyerName.trim() || 'Untitled Buyer'}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-[11px] font-semibold text-text-muted">
              {buyerCode || 'Auto (BYR-xxxx)'}
            </span>
            {shortName && (
              <span className="text-[11px] text-text-secondary">
                • {shortName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Badges Summary */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant={typeVariant}>{buyerType}</Badge>
        <Badge variant={complianceVariant}>{complianceStatus}</Badge>
        <Badge variant={statusVariant}>{status}</Badge>
      </div>

      {/* Snapshot Specs */}
      <div className="space-y-2.5 text-xs text-text-secondary pt-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Globe size={13} /> Country
          </span>
          <span className="font-medium text-text-primary">
            {countryOfOrigin || '—'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <DollarSign size={13} /> Terms
          </span>
          <span className="font-mono font-medium text-text-primary">
            {defaultCurrency} / {paymentTerms}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Calendar size={13} /> Credit Days
          </span>
          <span className="font-mono font-medium text-text-primary">
            {creditPeriodDays} days
          </span>
        </div>

        {commissionPercentage > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-text-muted">
              <Percent size={13} /> Commission
            </span>
            <span className="font-mono font-semibold text-accent">
              {commissionPercentage.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons (Rule 28 Single-Word Labels) */}
      <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
        <Button
          type="submit"
          form={submitFormId}
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting}
          icon={<Save size={15} />}
        >
          {isSubmitting ? (isEditing ? 'Updating' : 'Saving') : isEditing ? 'Update' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          disabled={isSubmitting}
          onClick={onCancel}
          icon={<ArrowLeft size={15} />}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
