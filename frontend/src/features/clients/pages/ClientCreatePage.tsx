/**
 * =============================================================================
 * [EN] Multi-Tenant Client Factory Registration Page (ClientCreatePage.tsx)
 * [BN] ক্লায়েন্ট প্রতিষ্ঠান নিবন্ধন পেজ - এক্সিকিউটিভ ২-কলাম লেআউট (রুল ০৭, ১৫, ২০, ২১)
 * =============================================================================
 * [EN] Reference: Approved UI/UX Architecture by CTO (Executive 2-Column Form + FactBox)
 * [BN] উইজার্ডবিহীন আধুনিক সিঙ্গেল-স্ক্রিন ফর্ম ও রিয়েল-টাইম ফ্যাক্টবক্স প্রিভিউ কার্ড।
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, Award, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, Button } from '@/components/ui';
import { clientService } from '../services/clientService';
import { ClientStep1Corporate } from '../components/ClientStep1Corporate';
import { ClientStep2Contact } from '../components/ClientStep2Contact';
import { ClientAdminAccountToggle } from '../components/ClientAdminAccountToggle';
import { ClientPlanSelector } from '../components/ClientPlanSelector';
import { ClientPreviewCard } from '../components/ClientPreviewCard';

export const ClientCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // Form Field States
  const [tenantCode, setTenantCode] = useState<string>('CLT-0001');
  const [tenantName, setTenantName] = useState<string>('');
  const [companyType, setCompanyType] = useState<'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY'>('GROUP_OF_COMPANIES');
  const [hostingType, setHostingType] = useState<'CLOUD_SAAS' | 'SELF_HOSTED'>('CLOUD_SAAS');
  const [subdomain, setSubdomain] = useState<string>(''), [customDomain, setCustomDomain] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>(''), [contactPhone, setContactPhone] = useState<string>('');
  const [tradeLicenseNo, setTradeLicenseNo] = useState<string>(''), [bgmeaRegNo, setBgmeaRegNo] = useState<string>('');
  const [address, setAddress] = useState<string>(''), [businessType, setBusinessType] = useState<string>('DENIM');
  const [subscriptionTier, setSubscriptionTier] = useState<string>('ENTERPRISE');

  // Initial Administrator Account States (Optional Toggle)
  const [createAdminAccount, setCreateAdminAccount] = useState<boolean>(true);
  const [adminFullName, setAdminFullName] = useState<string>(''), [adminEmail, setAdminEmail] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState<string>(''), [adminPhone, setAdminPhone] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('Admin@1234'), [adminPasswordConfirm, setAdminPasswordConfirm] = useState<string>('Admin@1234');

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    clientService.getNextClientCode()
      .then((code) => { if (isMounted && code) setTenantCode(code); })
      .catch(() => { if (isMounted) setTenantCode('CLT-0001'); });
    return () => { isMounted = false; };
  }, []);

  const handleTenantNameChange = (val: string) => {
    setTenantName(val);
    if (fieldErrors.tenantName) {
      setFieldErrors((prev) => { const c = { ...prev }; delete c.tenantName; return c; });
    }
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
    if (!subdomain || subdomain === slug.slice(0, -1)) setSubdomain(slug);
    if (!adminUsername || adminUsername === `${slug.slice(0, -1)}.admin`) {
      setAdminUsername(slug ? `${slug}.admin` : '');
    }
    if (!adminFullName) {
      setAdminFullName(val ? `${val} Admin` : '');
    }
  };

  const handleContactEmailChange = (val: string) => {
    setContactEmail(val);
    if (fieldErrors.contactEmail) {
      setFieldErrors((prev) => { const c = { ...prev }; delete c.contactEmail; return c; });
    }
    if (!adminEmail || adminEmail === contactEmail) setAdminEmail(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!tenantName.trim()) errors.tenantName = 'Company name is required';
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      errors.contactEmail = 'Valid official contact email is required';
    }

    if (hostingType === 'CLOUD_SAAS') {
      const sub = subdomain.trim().toLowerCase();
      if (!sub) errors.subdomain = 'Dedicated subdomain is required';
      else if (!/^[a-z0-9-]+$/.test(sub)) errors.subdomain = 'Only lowercase letters, numbers, and hyphens allowed';
    } else if (hostingType === 'SELF_HOSTED' && !customDomain.trim()) {
      errors.customDomain = 'Host domain or IP address is required';
    }

    if (createAdminAccount) {
      if (!adminUsername.trim()) errors.adminUsername = 'Login username is required';
      if (!adminEmail.trim() || !adminEmail.includes('@')) errors.adminEmail = 'Valid admin email is required';
      if (!adminPassword || adminPassword.length < 6) errors.adminPassword = 'Password must be at least 6 characters';
      if (adminPassword !== adminPasswordConfirm) errors.adminPasswordConfirm = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please review the highlighted fields before saving.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const created = await clientService.createTenant({
        tenantCode: tenantCode.trim() ? tenantCode.trim().toUpperCase() : undefined,
        tenantName: tenantName.trim(), companyType, hostingType,
        subdomain: hostingType === 'CLOUD_SAAS' ? subdomain.trim().toLowerCase() : undefined,
        customDomain: hostingType === 'SELF_HOSTED' ? customDomain.trim() : undefined,
        contactEmail: contactEmail.trim(), contactPhone: contactPhone.trim() || undefined,
        address: address.trim() || undefined, tradeLicenseNo: tradeLicenseNo.trim() || undefined,
        bgmeaRegNo: bgmeaRegNo.trim() || undefined, subscriptionTier, businessType,
        adminFullName: createAdminAccount ? (adminFullName.trim() || `${tenantName.trim()} Admin`) : undefined,
        adminEmail: createAdminAccount ? adminEmail.trim() : undefined,
        adminUsername: createAdminAccount ? adminUsername.trim().toLowerCase() : undefined,
        adminPhone: createAdminAccount ? (adminPhone.trim() || undefined) : undefined,
        adminPassword: createAdminAccount ? adminPassword.trim() : undefined,
      });

      toast.success(`Client "${created.tenantName}" registered successfully.`);
      navigate('/app/admin/clients');
    } catch (err: unknown) {
      const resp = (err as { response?: { data?: { message?: string; data?: Record<string, string> } } })?.response?.data;
      const msg = resp?.message || (err as { message?: string })?.message || 'Failed to register client.';
      const newErrors: Record<string, string> = {};
      if (resp?.data && typeof resp.data === 'object') Object.assign(newErrors, resp.data);
      setFieldErrors(newErrors);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* [EN] Sticky Top Page Header: Pinned actions without extra clutter */}
      {/* [BN] স্টিকি টপ পেজ হেডার: অতিরিক্ত বার ছাড়াই সহজে অ্যাক্সেসযোগ্য সেভ বাটন */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pt-1 -mt-2">
        <PageHeader
          title="Create Client"
          breadcrumbs={[
            { label: 'Home', href: '/app/overview' },
            { label: 'Administration', href: '/app/admin/clients' },
            { label: 'Client Directory', href: '/app/admin/clients' },
            { label: 'Create Client' },
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
                form="client-create-form"
                variant="primary"
                icon={<Save size={14} />}
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comprehensive Single Form (8 cols = ~67%) */}
        <div className="lg:col-span-8 space-y-6">
          <form id="client-create-form" onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* 1. Corporate Identity & Deployment */}
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Building2 size={16} className="text-brand-accent" />
                <span>1. Corporate Identity & Deployment</span>
              </h2>
              <ClientStep1Corporate
                tenantCode={tenantCode} tenantName={tenantName} onTenantNameChange={handleTenantNameChange}
                companyType={companyType} onCompanyTypeChange={setCompanyType} hostingType={hostingType}
                onHostingTypeChange={setHostingType} subdomain={subdomain} onSubdomainChange={setSubdomain}
                customDomain={customDomain} onCustomDomainChange={setCustomDomain}
                businessType={businessType} onBusinessTypeChange={setBusinessType}
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
                contactEmail={contactEmail} onContactEmailChange={handleContactEmailChange}
                contactPhone={contactPhone} onContactPhoneChange={setContactPhone}
                tradeLicenseNo={tradeLicenseNo} onTradeLicenseNoChange={setTradeLicenseNo}
                bgmeaRegNo={bgmeaRegNo} onBgmeaRegNoChange={setBgmeaRegNo}
                address={address} onAddressChange={setAddress} errors={fieldErrors}
              />
            </div>

            {/* 3. ERP Subscription Plan */}
            <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Award size={16} className="text-brand-accent" />
                <span>3. Software Subscription License</span>
              </h2>
              <ClientPlanSelector
                subscriptionTier={subscriptionTier} onSubscriptionTierChange={setSubscriptionTier}
              />
            </div>

            {/* 4. Primary Administrator Account (Optional Toggle) */}
            <ClientAdminAccountToggle
              createAdminAccount={createAdminAccount}
              onCreateAdminAccountChange={setCreateAdminAccount}
              adminFullName={adminFullName} onAdminFullNameChange={setAdminFullName}
              adminEmail={adminEmail} onAdminEmailChange={setAdminEmail}
              adminUsername={adminUsername} onAdminUsernameChange={setAdminUsername}
              adminPhone={adminPhone} onAdminPhoneChange={setAdminPhone}
              adminPassword={adminPassword} onAdminPasswordChange={setAdminPassword}
              adminPasswordConfirm={adminPasswordConfirm} onAdminPasswordConfirmChange={setAdminPasswordConfirm}
              subdomainOrHost={hostingType === 'CLOUD_SAAS' ? `${subdomain || 'company'}.garmentiq.com` : customDomain || 'private host'}
              errors={fieldErrors}
            />

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
                Create
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky FactBox Preview (4 cols = ~33%) */}
        <div className="lg:col-span-4 self-start sticky top-20">
          <ClientPreviewCard
            tenantCode={tenantCode} tenantName={tenantName} subscriptionTier={subscriptionTier}
            contactEmail={contactEmail} contactPhone={contactPhone} address={address}
            businessType={businessType} companyType={companyType} hostingType={hostingType}
            tradeLicenseNo={tradeLicenseNo} bgmeaRegNo={bgmeaRegNo}
            active={true} isEditing={false} isSubmitting={isSubmitting}
            onCancel={() => navigate('/app/admin/clients')}
            submitFormId="client-create-form"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientCreatePage;
