/**
 * =============================================================================
 * [EN] Buyer Basic Information Form Component (BuyerBasicFields.tsx)
 * [BN] বায়ার মৌলিক তথ্য ফর্ম কম্পোনেন্ট (BuyerBasicFields.tsx)
 * =============================================================================
 * [EN] Reference: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] বায়ার নাম, শর্ট নেম, টাইপ, কান্ট্রি, হেডকোয়ার্টার ও কন্টাক্ট পারসন ফিল্ডস।
 */

import React from 'react';
import { Building2, Globe } from 'lucide-react';
import { TextInput, Select, SearchableSelect } from '@/components/ui';
import type { BuyerType } from '@/types';
import { BUYER_TYPE_OPTIONS, COUNTRY_OPTIONS } from '../constants/buyerConstants';

export interface BuyerBasicFieldsProps {
  readonly isEditing?: boolean;
  readonly buyerCode?: string;
  readonly buyerName: string;
  readonly onBuyerNameChange: (v: string) => void;
  readonly shortName: string;
  readonly onShortNameChange: (v: string) => void;
  readonly buyerType: BuyerType;
  readonly onBuyerTypeChange: (v: BuyerType) => void;
  readonly countryOfOrigin: string;
  readonly onCountryOfOriginChange: (v: string) => void;
  readonly headquartersAddress: string;
  readonly onHeadquartersAddressChange: (v: string) => void;
  readonly contactPersonName: string;
  readonly onContactPersonNameChange: (v: string) => void;
  readonly contactEmail: string;
  readonly onContactEmailChange: (v: string) => void;
  readonly contactPhone: string;
  readonly onContactPhoneChange: (v: string) => void;
}

export const BuyerBasicFields: React.FC<BuyerBasicFieldsProps> = ({
  isEditing = false,
  buyerCode,
  buyerName,
  onBuyerNameChange,
  shortName,
  onShortNameChange,
  buyerType,
  onBuyerTypeChange,
  countryOfOrigin,
  onCountryOfOriginChange,
  headquartersAddress,
  onHeadquartersAddressChange,
  contactPersonName,
  onContactPersonNameChange,
  contactEmail,
  onContactEmailChange,
  contactPhone,
  onContactPhoneChange,
}) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 pb-3 border-b border-border-subtle text-text-primary">
        <Building2 size={16} className="text-accent" />
        <h3 className="text-xs font-bold uppercase tracking-wider">
          Basic Information
        </h3>
        {isEditing && buyerCode && (
          <span className="ml-auto font-mono text-xs font-semibold text-text-muted">
            {buyerCode}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Buyer Name */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Buyer Name *
          </label>
          <TextInput
            value={buyerName}
            onChange={(e) => onBuyerNameChange(e.target.value)}
            placeholder="e.g. H&M Group, Levi's"
            required
            autoFocus={!isEditing}
          />
        </div>

        {/* Short Name */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Short Name
          </label>
          <TextInput
            value={shortName}
            onChange={(e) => onShortNameChange(e.target.value)}
            placeholder="e.g. H&M"
          />
        </div>

        {/* Buyer Type */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Buyer Type *
          </label>
          <Select
            value={buyerType}
            onChange={(e) => onBuyerTypeChange(e.target.value as BuyerType)}
            options={BUYER_TYPE_OPTIONS as any}
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Country of Origin *
          </label>
          <SearchableSelect
            options={COUNTRY_OPTIONS}
            value={countryOfOrigin}
            onChange={onCountryOfOriginChange}
            placeholder="Select country..."
            searchPlaceholder="Search country..."
            icon={<Globe size={13} className="text-accent" />}
          />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Contact Person
          </label>
          <TextInput
            value={contactPersonName}
            onChange={(e) => onContactPersonNameChange(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Contact Email
          </label>
          <TextInput
            type="email"
            value={contactEmail}
            onChange={(e) => onContactEmailChange(e.target.value)}
            placeholder="e.g. merchant@buyer.com"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Contact Phone
          </label>
          <TextInput
            value={contactPhone}
            onChange={(e) => onContactPhoneChange(e.target.value)}
            placeholder="e.g. +46 8 796 55 00"
          />
        </div>

        {/* Headquarters Address */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary mb-1">
            Headquarters Address
          </label>
          <TextInput
            value={headquartersAddress}
            onChange={(e) => onHeadquartersAddressChange(e.target.value)}
            placeholder="e.g. Mäster Samuelsgatan 46A, Stockholm"
          />
        </div>
      </div>
    </div>
  );
};
