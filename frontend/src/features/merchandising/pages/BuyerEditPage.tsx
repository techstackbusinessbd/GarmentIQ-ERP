/**
 * =============================================================================
 * [EN] Buyer Profile Modification Page (BuyerEditPage.tsx)
 * [BN] বায়ার তথ্য পরিমার্জন পেজ (BuyerEditPage.tsx)
 * =============================================================================
 * [EN] Reference: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 27 (Full-Page Workflow)
 * [BN] বায়ার এডিটের পূর্ণাঙ্গ ডেডিকেটেড পেজ (/app/merchandising/buyers/:id/edit)।
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import type { BuyerType, BuyerStatus, ComplianceStatus } from '@/types';
import { buyerService } from '../services/buyerService';
import { BuyerBasicFields } from '../components/BuyerBasicFields';
import { BuyerCommercialFields } from '../components/BuyerCommercialFields';
import { BuyerPreviewCard } from '../components/BuyerPreviewCard';

export const BuyerEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [buyerCode, setBuyerCode] = useState<string>('');

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

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    buyerService
      .getBuyerById(id)
      .then((buyer) => {
        setBuyerCode(buyer.buyerCode);
        setBuyerName(buyer.buyerName);
        setShortName(buyer.shortName || '');
        setBuyerType(buyer.buyerType);
        setCountryOfOrigin(buyer.countryOfOrigin);
        setHeadquartersAddress(buyer.headquartersAddress || '');
        setContactPersonName(buyer.contactPersonName || '');
        setContactEmail(buyer.contactEmail || '');
        setContactPhone(buyer.contactPhone || '');
        setDefaultCurrency(buyer.defaultCurrency);
        setPaymentTerms(buyer.paymentTerms);
        setCreditPeriodDays(buyer.creditPeriodDays);
        setCommissionPercentage(buyer.commissionPercentage || 0);
        setComplianceStatus(buyer.complianceStatus);
        setStatus(buyer.status);
        setNotes(buyer.notes || '');
      })
      .catch(() => {
        navigate('/app/merchandising/buyers');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
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
      await buyerService.updateBuyer(id, {
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

      toast.success('Buyer updated');
      navigate('/app/merchandising/buyers');
    } catch {
      // Handled by global axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Edit Buyer"
        subtitle="Update commercial terms"
        badge={
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-muted border border-border-subtle text-text-primary">
            {buyerCode}
          </span>
        }
        onBack={() => navigate('/app/merchandising/buyers')}
      />

      <form id="buyer-edit-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Fields (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <BuyerBasicFields
              isEditing={true}
              buyerCode={buyerCode}
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
              isEditing={true}
              buyerCode={buyerCode}
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
              submitFormId="buyer-edit-form"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
