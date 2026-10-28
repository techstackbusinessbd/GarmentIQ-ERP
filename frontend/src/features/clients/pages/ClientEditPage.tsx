/**
 * =============================================================================
 * [EN] Multi-Tenant Client Factory Edit Page (ClientEditPage.tsx)
 * [BN] ক্লায়েন্ট কারখানা তথ্য ও সাবস্ক্রিপশন সম্পাদনা পেজ - এক্সিকিউটিভ ২-কলাম লেআউট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] উইজার্ড বা ট্যাববিহীন আধুনিক সিঙ্গেল-স্ক্রিন ফর্ম ও রিয়েল-টাইম ফ্যাক্টবক্স প্রিভিউ কার্ড।
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Phone, Award, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, Button } from '@/components/ui';
import { clientService } from '../services/clientService';
import { ClientStep1Corporate } from '../components/ClientStep1Corporate';
import { ClientStep2Contact } from '../components/ClientStep2Contact';
import { ClientPlanSelector } from '../components/ClientPlanSelector';
import { ClientPreviewCard } from '../components/ClientPreviewCard';

export const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form States
  const [tenantCode, setTenantCode] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const [companyType, setCompanyType] = useState<'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY'>('GROUP_OF_COMPANIES');
  const [hostingType, setHostingType] = useState<'CLOUD_SAAS' | 'SELF_HOSTED'>('CLOUD_SAAS');
  const [subdomain, setSubdomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [active, setActive] = useState<boolean>(true);
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [tradeLicenseNo, setTradeLicenseNo] = useState<string>('');
  const [bgmeaRegNo, setBgmeaRegNo] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [subscriptionTier, setSubscriptionTier] = useState<string>('ENTERPRISE');
  const [businessType, setBusinessType] = useState<string>('DENIM');

  const isSystemTenant = tenantCode === 'SYSTEM';

  useEffect(() => {
    if (!id) { navigate('/app/admin/clients'); return; }
    setIsLoading(true);
    clientService.getTenantById(id)
      .then((t) => {
        setTenantCode(t.tenantCode);
        setTenantName(t.tenantName || t.companyName || '');
        setCompanyType((t.companyType as 'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY') || 'GROUP_OF_COMPANIES');
        setHostingType((t.hostingType as 'CLOUD_SAAS' | 'SELF_HOSTED') || 'CLOUD_SAAS');
        setSubdomain(t.subdomain || '');
        setCustomDomain(t.customDomain || '');
        setActive(t.active);
        setContactEmail(t.contactEmail || '');
        setContactPhone(t.contactPhone || '');
        setTradeLicenseNo(t.tradeLicenseNo || '');
        setBgmeaRegNo(t.bgmeaRegNo || '');
        setAddress(t.address || '');
        setSubscriptionTier(t.subscriptionTier || 'ENTERPRISE');
        setBusinessType(t.businessType || 'DENIM');
      })
      .catch(() => { toast.error('Failed to load client details.'); navigate('/app/admin/clients'); })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const errors: Record<string, string> = {};
    if (!tenantName.trim()) errors.tenantName = 'Company name is required';
    if (!contactEmail.trim() || !contactEmail.includes('@')) errors.contactEmail = 'Valid contact email is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please review the highlighted fields before saving.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const updated = await clientService.updateTenant(id, {
        tenantName: tenantName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        address: address.trim() || undefined,
        tradeLicenseNo: tradeLicenseNo.trim() || undefined,
        bgmeaRegNo: bgmeaRegNo.trim() || undefined,
        companyType,
        hostingType,
        subdomain: hostingType === 'CLOUD_SAAS' ? subdomain.trim() || undefined : undefined,
        customDomain: hostingType === 'SELF_HOSTED' ? customDomain.trim() || undefined : undefined,
        subscriptionTier,
        businessType,
        active: isSystemTenant ? true : active,
      });

      toast.success(`Client "${updated.tenantName}" updated successfully.`);
      navigate('/app/admin/clients');
    } catch (err: unknown) {
      const resp = (err as { response?: { data?: { message?: string; data?: Record<string, string> } } })?.response?.data;
      if (resp?.data && typeof resp.data === 'object') setFieldErrors(resp.data);
      toast.error(resp?.message || (err as { message?: string })?.message || 'Failed to update client details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <div className="w-7 h-7 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-text-muted font-medium">Loading client details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* Sticky Top Page Header with Save & Cancel Actions */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pt-1 -mt-2">
        <PageHeader
          title={`Edit Client: ${tenantName || tenantCode}`}
          breadcrumbs={[
            { label: 'Home', href: '/app/overview' },
            { label: 'Administration', href: '/app/admin/clients' },
            { label: 'Client Directory', href: '/app/admin/clients' },
            { label: 'Edit Client' },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/app/admin/clients')}
                icon={<ArrowLeft size={14} />}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="client-edit-form"
                variant="primary"
                icon={<Save size={14} />}
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comprehensive Form (8 cols = ~67%) */}
        <div className="lg:col-span-8 space-y-6">
          <form id="client-edit-form" onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* 1. Corporate Identity & Deployment */}
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Building2 size={16} className="text-brand-accent" />
                <span>1. Corporate Identity & Deployment</span>
              </h2>
              <ClientStep1Corporate
                tenantCode={tenantCode}
                tenantName={tenantName}
                onTenantNameChange={setTenantName}
                companyType={companyType}
                onCompanyTypeChange={setCompanyType}
                hostingType={hostingType}
                onHostingTypeChange={setHostingType}
                subdomain={subdomain}
                onSubdomainChange={setSubdomain}
                customDomain={customDomain}
                onCustomDomainChange={setCustomDomain}
                businessType={businessType}
                onBusinessTypeChange={setBusinessType}
                active={active}
                onActiveChange={setActive}
                isSystemTenant={isSystemTenant}
                errors={fieldErrors}
              />
            </div>

            {/* 2. Official Contact & Legal Details */}
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Phone size={16} className="text-brand-accent" />
                <span>2. Official Contact & Legal Details</span>
              </h2>
              <ClientStep2Contact
                contactEmail={contactEmail}
                onContactEmailChange={setContactEmail}
                contactPhone={contactPhone}
                onContactPhoneChange={setContactPhone}
                tradeLicenseNo={tradeLicenseNo}
                onTradeLicenseNoChange={setTradeLicenseNo}
                bgmeaRegNo={bgmeaRegNo}
                onBgmeaRegNoChange={setBgmeaRegNo}
                address={address}
                onAddressChange={setAddress}
                errors={fieldErrors}
              />
            </div>

            {/* 3. ERP Subscription Plan */}
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Award size={16} className="text-brand-accent" />
                <span>3. Software Subscription License</span>
              </h2>
              <ClientPlanSelector
                subscriptionTier={subscriptionTier}
                onSubscriptionTierChange={setSubscriptionTier}
              />
            </div>

            {/* Bottom Inline Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => navigate('/app/admin/clients')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                icon={<Save size={14} />}
              >
                Save
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky FactBox Preview (4 cols = ~33%) */}
        <div className="lg:col-span-4 self-start sticky top-20">
          <ClientPreviewCard
            tenantCode={tenantCode}
            tenantName={tenantName}
            subscriptionTier={subscriptionTier}
            businessType={businessType}
            companyType={companyType}
            hostingType={hostingType}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            address={address}
            tradeLicenseNo={tradeLicenseNo}
            bgmeaRegNo={bgmeaRegNo}
            active={active}
            isEditing={true}
            isSubmitting={isSubmitting}
            onCancel={() => navigate('/app/admin/clients')}
            submitFormId="client-edit-form"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientEditPage;
