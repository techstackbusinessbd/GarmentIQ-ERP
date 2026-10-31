/**
 * =============================================================================
 * [EN] Buyer Commercial Terms & Compliance Form Component (BuyerCommercialFields.tsx)
 * [BN] বায়ার বাণিজ্যিক শর্তাবলী ও কমপ্লায়েন্স ফর্ম কম্পোনেন্ট (BuyerCommercialFields.tsx)
 * =============================================================================
 * [EN] Reference: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] মুদ্রা, পেমেন্ট টার্মস, ক্রেডিট দিন, কমিশন %, সোশ্যাল কমপ্লায়েন্স ও স্ট্যাটাস ফিল্ডস।
 */

import React from 'react';
import { DollarSign } from 'lucide-react';
import { TextInput, Select } from '@/components/ui';
import type { BuyerStatus, ComplianceStatus } from '@/types';
import {
  CURRENCY_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  COMPLIANCE_STATUS_OPTIONS,
  STATUS_OPTIONS,
} from '../constants/buyerConstants';

export interface BuyerCommercialFieldsProps {
  readonly defaultCurrency: string;
  readonly onDefaultCurrencyChange: (v: string) => void;
  readonly paymentTerms: string;
  readonly onPaymentTermsChange: (v: string) => void;
  readonly creditPeriodDays: number;
  readonly onCreditPeriodDaysChange: (v: number) => void;
  readonly commissionPercentage: number;
  readonly onCommissionPercentageChange: (v: number) => void;
  readonly complianceStatus: ComplianceStatus;
  readonly onComplianceStatusChange: (v: ComplianceStatus) => void;
  readonly status: BuyerStatus;
  readonly onStatusChange: (v: BuyerStatus) => void;
  readonly notes: string;
  readonly onNotesChange: (v: string) => void;
}

export const BuyerCommercialFields: React.FC<BuyerCommercialFieldsProps> = ({
  defaultCurrency,
  onDefaultCurrencyChange,
  paymentTerms,
  onPaymentTermsChange,
  creditPeriodDays,
  onCreditPeriodDaysChange,
  commissionPercentage,
  onCommissionPercentageChange,
  complianceStatus,
  onComplianceStatusChange,
  status,
  onStatusChange,
  notes,
  onNotesChange,
}) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 pb-3 border-b border-border-subtle text-text-primary">
        <DollarSign size={16} className="text-accent" />
        <h3 className="text-xs font-bold uppercase tracking-wider">
          Commercial Terms & Compliance
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Currency */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Default Currency *
          </label>
          <Select
            value={defaultCurrency}
            onChange={(e) => onDefaultCurrencyChange(e.target.value)}
            options={CURRENCY_OPTIONS as any}
          />
        </div>

        {/* Payment Terms */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Payment Terms *
          </label>
          <Select
            value={paymentTerms}
            onChange={(e) => onPaymentTermsChange(e.target.value)}
            options={PAYMENT_TERMS_OPTIONS as any}
          />
        </div>

        {/* Credit Period Days */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Credit Days *
          </label>
          <TextInput
            type="number"
            min={0}
            value={creditPeriodDays.toString()}
            onChange={(e) => onCreditPeriodDaysChange(parseInt(e.target.value, 10) || 0)}
          />
        </div>

        {/* Commission Percentage */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Commission % *
          </label>
          <TextInput
            type="number"
            step="0.01"
            min={0}
            max={100}
            value={commissionPercentage.toString()}
            onChange={(e) => onCommissionPercentageChange(parseFloat(e.target.value) || 0)}
          />
        </div>

        {/* Compliance Status */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Compliance Status *
          </label>
          <Select
            value={complianceStatus}
            onChange={(e) => onComplianceStatusChange(e.target.value as ComplianceStatus)}
            options={COMPLIANCE_STATUS_OPTIONS as any}
          />
        </div>

        {/* Operational Status */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Status *
          </label>
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as BuyerStatus)}
            options={STATUS_OPTIONS as any}
          />
        </div>
      </div>

      {/* Commercial Notes */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary mb-1">
          Special Commercial Instructions
        </label>
        <TextInput
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. Requires Nominated Trim Supplier, 3rd party SGS inspection."
        />
      </div>
    </div>
  );
};
