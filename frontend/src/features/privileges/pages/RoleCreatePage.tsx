/**
 * =============================================================================
 * [EN] Full-Page Enterprise Role Provisioning Workspace (RoleCreatePage.tsx)
 * [BN] পূর্ণাঙ্গ পেজ এন্টারপ্রাইজ কাস্টম রোল তৈরি ও পারমিশন অ্যাসাইনমেন্ট (রুল ২৭)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20, Rule 21, Rule 25, Rule 27
 * [BN] রুল ২৭ মেনে সম্পূর্ণ স্বতন্ত্র রুটেড পেজে রোল সৃষ্টি ও ডায়নামিক পারমিশন সিলেকশন।
 */

import React, { useState, useId, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Save, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, Button, TextInput } from '@/components/ui';
import { roleService } from '../services/roleService';
import { usePermissionCatalog } from '../hooks/usePermissionCatalog';
import { usePermission } from '../hooks/usePermission';
import { extractCatalogPermissionCodes } from '../constants/accessMatrixConstants';
import { RolePreviewCard } from '../components/RolePreviewCard';
import { RolePermissionSelector } from '../components/RolePermissionSelector';

export const RoleCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const titleId = useId();
  const codeId = useId();
  const descId = useId();

  const { isSuperAdmin: isCallerSuperAdmin } = usePermission();
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: rawCatalog = [], isLoading: isLoadingCatalog } = usePermissionCatalog('admin');

  // [EN] Omit platform-root modules (client_mgmt) for tenant operators
  // [BN] নন-সুপারঅ্যাডমিন অপারেটরদের জন্য ক্লায়েন্ট ম্যানেজমেন্ট বাদ দেওয়া
  const catalogDomains = useMemo(() => {
    if (isCallerSuperAdmin) return rawCatalog;
    return rawCatalog.map((d) => ({
      ...d,
      modules: d.modules.filter((m) => m.id !== 'client_mgmt'),
    }));
  }, [rawCatalog, isCallerSuperAdmin]);

  const allCatalogCodes = useMemo(
    () => extractCatalogPermissionCodes(catalogDomains),
    [catalogDomains]
  );

  /**
   * [EN] Automatically derive role code from title if not manually customized
   * [BN] রোল টাইটেল থেকে স্বয়ংক্রিয়ভাবে ROLE_ প্রিফিক্সসহ রোল কোড তৈরি
   */
  const handleTitleChange = (val: string) => {
    setRoleName(val);
    if (!isCodeManuallyEdited) {
      const sanitized = val
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setRoleCode(sanitized ? `ROLE_${sanitized}` : '');
    }
  };

  const handleTogglePermission = (code: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleToggleModuleAll = (moduleCodes: string[]) => {
    const allSelected = moduleCodes.every((c) => selectedPermissions.has(c));
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        moduleCodes.forEach((c) => next.delete(c));
      } else {
        moduleCodes.forEach((c) => next.add(c));
      }
      return next;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!roleName.trim()) {
      toast.error('Role name is required.');
      return;
    }

    if (!roleCode.trim()) {
      toast.error('Role code is required.');
      return;
    }

    const normalizedCode = roleCode.trim().toUpperCase().startsWith('ROLE_')
      ? roleCode.trim().toUpperCase()
      : `ROLE_${roleCode.trim().toUpperCase()}`;

    setIsSubmitting(true);
    try {
      await roleService.createRole({
        roleCode: normalizedCode,
        roleName: roleName.trim(),
        description: description.trim() || undefined,
        permissionCodes: Array.from(selectedPermissions),
      });
      toast.success(`Role '${roleName}' created successfully.`);
      navigate('/app/admin/roles');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create role';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <PageHeader
        title="Create Enterprise Role"
        subtitle="Onboard custom factory job roles and initialize functional permission baselines."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Admin', href: '/app/admin/roles' },
          { label: 'Roles', href: '/app/admin/roles' },
          { label: 'New Role' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/app/admin/roles')}
              icon={<ArrowLeft size={13} />}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              icon={<Save size={13} className={isSubmitting ? 'animate-spin' : ''} />}
            >
              {isSubmitting ? 'Saving' : 'Save'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Permissions Catalog */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Details Card */}
          <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <Shield size={16} className="text-brand-accent" />
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Role Identity & Scope
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor={titleId} className="block text-xs font-semibold text-text-primary">
                  Role Title <span className="text-status-danger">*</span>
                </label>
                <TextInput
                  id={titleId}
                  placeholder="e.g. Senior Merchandiser"
                  value={roleName}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor={codeId} className="block text-xs font-semibold text-text-primary">
                  Role Code (System Identifier) <span className="text-status-danger">*</span>
                </label>
                <TextInput
                  id={codeId}
                  placeholder="e.g. ROLE_SENIOR_MERCHANDISER"
                  value={roleCode}
                  onChange={(e) => {
                    setRoleCode(e.target.value.toUpperCase());
                    setIsCodeManuallyEdited(true);
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={descId} className="block text-xs font-medium text-text-secondary">
                Operational Scope / Description
              </label>
              <textarea
                id={descId}
                rows={3}
                placeholder="Describe role responsibilities, factory authority, and scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs text-text-primary bg-surface-muted/30 border border-border-subtle rounded-[4px] p-2.5 focus:border-brand-accent focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Granular Clearances Assignment Card */}
          <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-accent" />
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Baseline Permissions Clearance
                </h3>
              </div>
              <span className="text-xs text-text-muted">
                Selected:{' '}
                <strong className="text-brand-accent">{selectedPermissions.size}</strong> of{' '}
                {allCatalogCodes.length}
              </span>
            </div>

            {isLoadingCatalog ? (
              <div className="py-8 text-center text-xs text-text-muted">Loading permissions catalog...</div>
            ) : (
              <RolePermissionSelector
                catalogDomains={catalogDomains}
                selectedPermissions={selectedPermissions}
                onTogglePermission={handleTogglePermission}
                onToggleModuleAll={handleToggleModuleAll}
              />
            )}
          </div>
        </div>

        {/* Right Column: Live Identity Preview Card */}
        <div className="lg:col-span-4 sticky top-6">
          <RolePreviewCard
            roleName={roleName}
            roleCode={roleCode}
            description={description}
            permissionsCount={selectedPermissions.size}
            isSubmitting={isSubmitting}
            onSubmit={() => handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleCreatePage;
