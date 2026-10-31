/**
 * =============================================================================
 * [EN] Buyer Onboarding & Registration Page (BuyerCreatePage.tsx)
 * [BN] নতুন বায়ার নিবন্ধন পেজ (BuyerCreatePage.tsx)
 * =============================================================================
 * [EN] Reference: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 27 (Full-Page Workflow)
 * [BN] বায়ার তৈরির পূর্ণাঙ্গ ডেডিকেটেড পেজ (/app/merchandising/buyers/new)।
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui';
import type { BuyerType, BuyerStatus, ComplianceStatus } from '@/types';
import { buyerService } from '../services/buyerService';
import { BuyerBasicFields } from '../components/BuyerBasicFields';
import { BuyerCommercialFields } from '../components/BuyerCommercialFields';
import { BuyerPreviewCard } from '../components/BuyerPreviewCard';

export const BuyerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form state
  const [buyerName, setBuyerName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [buyerType, setBuyerType] = useState<BuyerType>('DIRECT');
  const [countryOfOrigin, setCountryOfOrigin] = useState<string>('');
  const [headquartersAddress, setHeadquartersAddress] = useState<string>('');
  const [contactPersonName, setContactPersonName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  const [defaultCurrency, setDefaultCurrency] = useState<string>('USD');
  const [paymentTerms, setPaymentTerms] = useState<string>('LC_AT_SIGHT');
  const [creditPeriodDays, setCreditPeriodDays] = useState<number>(30);
  const [commissionPercentage, setCommissionPercentage] = useState<number>(0);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus>('COMPLIANT');
  const [status, setStatus] = useState<BuyerStatus>('ACTIVE');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      toast.error('Buyer name is required');
      return;
    }
    if (!countryOfOrigin.trim()) {
      toast.error('Country of origin is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await buyerService.createBuyer({
        buyerName: buyerName.trim(),
        shortName: shortName.trim() || undefined,
        buyerType,
        countryOfOrigin: countryOfOrigin.trim(),
        headquartersAddress: headquartersAddress.trim() || undefined,
        contactPersonName: contactPersonName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        defaultCurrency,
        paymentTerms,
        creditPeriodDays,
        commissionPercentage,
        complianceStatus,
        status,
        notes: notes.trim() || undefined,
      });

      toast.success('Buyer registered');
      navigate('/app/merchandising/buyers');
    } catch {
      // Handled by global axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Register Buyer"
        subtitle="Commercial profile & trade terms"
        onBack={() => navigate('/app/merchandising/buyers')}
      />

      <form id="buyer-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Fields (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <BuyerBasicFields
              buyerName={buyerName}
              onBuyerNameChange={setBuyerName}
              shortName={shortName}
              onShortNameChange={setShortName}
              buyerType={buyerType}
              onBuyerTypeChange={setBuyerType}
              countryOfOrigin={countryOfOrigin}
              onCountryOfOriginChange={setCountryOfOrigin}
              headquartersAddress={headquartersAddress}
              onHeadquartersAddressChange={setHeadquartersAddress}
              contactPersonName={contactPersonName}
              onContactPersonNameChange={setContactPersonName}
              contactEmail={contactEmail}
              onContactEmailChange={setContactEmail}
              contactPhone={contactPhone}
              onContactPhoneChange={setContactPhone}
            />

            <BuyerCommercialFields
              defaultCurrency={defaultCurrency}
              onDefaultCurrencyChange={setDefaultCurrency}
              paymentTerms={paymentTerms}
              onPaymentTermsChange={setPaymentTerms}
              creditPeriodDays={creditPeriodDays}
              onCreditPeriodDaysChange={setCreditPeriodDays}
              commissionPercentage={commissionPercentage}
              onCommissionPercentageChange={setCommissionPercentage}
              complianceStatus={complianceStatus}
              onComplianceStatusChange={setComplianceStatus}
              status={status}
              onStatusChange={setStatus}
              notes={notes}
              onNotesChange={setNotes}
            />
          </div>

          {/* Right Column: Live Identity Preview Card (1 Col) */}
          <div className="lg:col-span-1">
            <BuyerPreviewCard
              buyerName={buyerName}
              shortName={shortName}
              buyerType={buyerType}
              countryOfOrigin={countryOfOrigin}
              defaultCurrency={defaultCurrency}
              paymentTerms={paymentTerms}
              creditPeriodDays={creditPeriodDays}
              commissionPercentage={commissionPercentage}
              complianceStatus={complianceStatus}
              status={status}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/app/merchandising/buyers')}
              submitFormId="buyer-form"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
