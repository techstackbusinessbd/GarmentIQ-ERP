/**
 * =============================================================================
 * [EN] Step 2: Legal & Contact Details (ClientStep2Contact.tsx)
 * [BN] ধাপ ২: প্রাতিষ্ঠানিক যোগাযোগ ও আইনি লাইসেন্স তথ্য (রুল ০৭ ও ২১)
 * =============================================================================
 */

import React from 'react';
import { Mail, Phone, FileText, Award, MapPin } from 'lucide-react';
import { FormField, TextInput } from '@/components/ui';

export interface ClientStep2ContactProps {
  readonly contactEmail: string;
  readonly onContactEmailChange: (val: string) => void;
  readonly contactPhone: string;
  readonly onContactPhoneChange: (val: string) => void;
  readonly tradeLicenseNo: string;
  readonly onTradeLicenseNoChange: (val: string) => void;
  readonly bgmeaRegNo: string;
  readonly onBgmeaRegNoChange: (val: string) => void;
  readonly address: string;
  readonly onAddressChange: (val: string) => void;
  readonly errors?: Record<string, string>;
}

export const ClientStep2Contact: React.FC<ClientStep2ContactProps> = ({
  contactEmail,
  onContactEmailChange,
  contactPhone,
  onContactPhoneChange,
  tradeLicenseNo,
  onTradeLicenseNoChange,
  bgmeaRegNo,
  onBgmeaRegNoChange,
  address,
  onAddressChange,
  errors = {},
}) => {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* 2-Column: Official Email & Contact Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Official Email"
          required
          error={errors.contactEmail}
          helperText="Primary email for official communications"
        >
          <TextInput
            type="email"
            placeholder="e.g. info@hameem-group.com"
            value={contactEmail}
            onChange={(e) => onContactEmailChange(e.target.value)}
            leftIcon={<Mail size={14} />}
            hasError={Boolean(errors.contactEmail)}
            autoFocus
          />
        </FormField>

        <FormField
          label="Phone Number"
          error={errors.contactPhone}
          helperText="Official landline or mobile contact number"
        >
          <TextInput
            type="tel"
            placeholder="e.g. +880 2-8878000"
            value={contactPhone}
            onChange={(e) => onContactPhoneChange(e.target.value)}
            leftIcon={<Phone size={14} />}
            hasError={Boolean(errors.contactPhone)}
          />
        </FormField>
      </div>

      {/* 2-Column: Trade License & BGMEA Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Trade License Number"
          error={errors.tradeLicenseNo}
          helperText="Valid municipal trade license number"
        >
          <TextInput
            placeholder="e.g. TRAD/DSCC/019283/2024"
            value={tradeLicenseNo}
            onChange={(e) => onTradeLicenseNoChange(e.target.value)}
            leftIcon={<FileText size={14} />}
            hasError={Boolean(errors.tradeLicenseNo)}
          />
        </FormField>

        <FormField
          label="BGMEA / BKMEA Registration"
          error={errors.bgmeaRegNo}
          helperText="Association membership or registration number"
        >
          <TextInput
            placeholder="e.g. BGMEA-2045"
            value={bgmeaRegNo}
            onChange={(e) => onBgmeaRegNoChange(e.target.value)}
            leftIcon={<Award size={14} />}
            hasError={Boolean(errors.bgmeaRegNo)}
          />
        </FormField>
      </div>

      {/* Full Width: Headquarters Address */}
      <FormField
        label="Office Address"
        error={errors.address}
        helperText="Corporate office or registered factory address"
      >
        <TextInput
          placeholder="e.g. 387 Tejgaon I/A, Dhaka-1208, Bangladesh"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          leftIcon={<MapPin size={14} />}
          hasError={Boolean(errors.address)}
        />
      </FormField>
    </div>
  );
};

export default ClientStep2Contact;
