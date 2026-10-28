/**
 * =============================================================================
 * [EN] Enterprise System Settings & Platform Governance (SystemSettingsPage)
 * [BN] এন্টারপ্রাইজ সিস্টেম সেটিংস ও প্ল্যাটফর্ম পলিসি পেজ (SystemSettingsPage)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 24 (Auto-Code)
 * [BN] অটো-কোড টেম্পলেটস, কারখানার শিফট ক্যালেন্ডার, কারেন্সি, প্ল্যাটফর্ম সিকিউরিটি ও অডিট লগ।
 */

import React, { useState, useEffect } from 'react';
import {
  Binary, Clock, DollarSign, Shield, History,
  Save, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { WidgetMetricCard, PageHeader } from '@/components/ui';
import { usePermission } from '@/features/privileges';
import { settingsService } from '../services/settingsService';
import { auditLogService } from '../services/auditLogService';
import { AutoCodeSettingsTab } from '../components/AutoCodeSettingsTab';
import { FactoryShiftsTab } from '../components/FactoryShiftsTab';
import { CurrencySettingsTab } from '../components/CurrencySettingsTab';
import { SecuritySettingsTab } from '../components/SecuritySettingsTab';
import { SystemAuditLogsTab } from '../components/SystemAuditLogsTab';

type SettingsTab = 'AUTO_CODE' | 'SHIFTS' | 'FINANCE' | 'SECURITY' | 'LOGS';

export const SystemSettingsPage: React.FC = () => {
  const { hasPermission, isSuperAdmin } = usePermission();

  const canViewAutoCode = isSuperAdmin || hasPermission('AUTO_CODE:VIEW') || hasPermission('AUTO_CODE:MENU') || hasPermission('SETTINGS:VIEW') || hasPermission('SETTINGS:MENU');
  const canViewShifts = isSuperAdmin || hasPermission('SHIFT:VIEW') || hasPermission('SHIFT:MENU') || hasPermission('SETTINGS:VIEW') || hasPermission('SETTINGS:MENU');
  const canViewFinance = isSuperAdmin || hasPermission('CURRENCY:VIEW') || hasPermission('CURRENCY:MENU') || hasPermission('SETTINGS:VIEW') || hasPermission('SETTINGS:MENU');
  const canViewSecurity = isSuperAdmin || hasPermission('SECURITY:VIEW') || hasPermission('SECURITY:MENU') || hasPermission('SETTINGS:VIEW') || hasPermission('SETTINGS:MENU');
  const canViewLogs = isSuperAdmin || hasPermission('AUDIT_LOG:VIEW') || hasPermission('AUDIT_LOG:MENU') || hasPermission('SETTINGS:VIEW') || hasPermission('SETTINGS:MENU');

  const defaultTab: SettingsTab = canViewAutoCode ? 'AUTO_CODE' : canViewShifts ? 'SHIFTS' : canViewFinance ? 'FINANCE' : canViewSecurity ? 'SECURITY' : 'LOGS';
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);
  const [exchangeRate, setExchangeRate] = useState<string>('121.50');
  const [sessionTimeout, setSessionTimeout] = useState<string>('60');
  const [lockoutMinutes, setLockoutMinutes] = useState<string>('30');
  const [maxFailedAttempts, setMaxFailedAttempts] = useState<string>('5');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!canViewAutoCode && activeTab === 'AUTO_CODE') {
      if (canViewShifts) setActiveTab('SHIFTS');
      else if (canViewFinance) setActiveTab('FINANCE');
      else if (canViewSecurity) setActiveTab('SECURITY');
      else if (canViewLogs) setActiveTab('LOGS');
    }
  }, [canViewAutoCode, canViewShifts, canViewFinance, canViewSecurity, canViewLogs, activeTab]);

  useEffect(() => {
    if (canViewSecurity) {
      settingsService.getSecuritySettings().then((s) => {
        setLockoutMinutes(String(s.lockoutMinutes));
        setMaxFailedAttempts(String(s.maxFailedAttempts));
        setSessionTimeout(String(s.sessionTimeoutMinutes));
      }).catch(() => {});
    }
  }, [canViewSecurity]);

  const handleSaveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      await settingsService.updateSecuritySettings({
        lockoutMinutes: Math.max(5, Number(lockoutMinutes) || 30),
        maxFailedAttempts: Math.max(3, Math.min(10, Number(maxFailedAttempts) || 5)),
        sessionTimeoutMinutes: Math.max(15, Number(sessionTimeout) || 60),
      });

      // Record audit log entry
      auditLogService.logEntry({
        actor: 'superadmin',
        actorRole: 'System Super Admin',
        category: 'SECURITY_POLICY',
        action: 'POLICY_UPDATE',
        targetResource: 'Platform Security Policy',
        details: `Lockout policy updated: ${lockoutMinutes}m duration, ${maxFailedAttempts}x max attempts.`,
        severity: 'WARNING',
        ipAddress: '127.0.0.1 (Web UI)',
      });

      toast.success(`Platform security policy saved (Lockout: ${lockoutMinutes}m, Attempts: ${maxFailedAttempts}x).`);
    } catch {
      toast.error('Failed to save security settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* [EN] Unified Page Header & Breadcrumbs / [BN] সমন্বিত পেজ হেডার ও ব্রেডক্রাম্ব */}
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/app/overview' },
          { label: 'Administration', href: '/app/admin/settings' },
          { label: 'System Settings' },
        ]}
        title="System Settings"
        subtitle="Manage dynamic auto-code formats, factory shifts, currency rates, security preferences, and audit logs."
        actions={
          activeTab === 'SECURITY' ? (
            <button
              type="button"
              onClick={handleSaveSecuritySettings}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover rounded-[4px] shadow-xs transition-colors disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
              <span>Save</span>
            </button>
          ) : undefined
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetMetricCard
          id="kpi-patterns"
          title="Configurable Codes"
          value="6 Templates"
          subtitle="Auto Sequence Engine"
          icon={<Binary size={16} />}
          accentVariant="primary"
        />
        <WidgetMetricCard
          id="kpi-shifts"
          title="Plant Shifts"
          value="3 Shifts"
          subtitle="Regular, OT & Night"
          icon={<Clock size={16} />}
          accentVariant="primary"
        />
        <WidgetMetricCard
          id="kpi-rate"
          title="Exchange Rate"
          value={`${exchangeRate} BDT`}
          subtitle="USD Baseline Rate"
          icon={<DollarSign size={16} />}
          accentVariant="success"
        />
        <WidgetMetricCard
          id="kpi-auth"
          title="Security & Audit"
          value={`${lockoutMinutes} Mins`}
          subtitle={`Lockout Duration (${maxFailedAttempts}x)`}
          icon={<Shield size={16} />}
          accentVariant="warning"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border-subtle overflow-x-auto">
        {canViewAutoCode && (
          <button
            onClick={() => setActiveTab('AUTO_CODE')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'AUTO_CODE'
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Binary size={14} />
            <span>Auto-Code Formats</span>
          </button>
        )}

        {canViewShifts && (
          <button
            onClick={() => setActiveTab('SHIFTS')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'SHIFTS'
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Clock size={14} />
            <span>Factory Shifts & Hours</span>
          </button>
        )}

        {canViewFinance && (
          <button
            onClick={() => setActiveTab('FINANCE')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'FINANCE'
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <DollarSign size={14} />
            <span>Currencies & Rates</span>
          </button>
        )}

        {canViewSecurity && (
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'SECURITY'
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Shield size={14} />
            <span>Platform Security</span>
          </button>
        )}

        {canViewLogs && (
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'LOGS'
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <History size={14} />
            <span>System & Audit Logs</span>
          </button>
        )}
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'AUTO_CODE' && canViewAutoCode && <AutoCodeSettingsTab />}
      {activeTab === 'SHIFTS' && canViewShifts && <FactoryShiftsTab />}
      {activeTab === 'FINANCE' && canViewFinance && <CurrencySettingsTab onBaselineRateChange={setExchangeRate} />}
      {activeTab === 'SECURITY' && canViewSecurity && (
        <SecuritySettingsTab
          lockoutMinutes={lockoutMinutes}
          onLockoutMinutesChange={setLockoutMinutes}
          maxFailedAttempts={maxFailedAttempts}
          onMaxFailedAttemptsChange={setMaxFailedAttempts}
          sessionTimeout={sessionTimeout}
          onSessionTimeoutChange={setSessionTimeout}
        />
      )}
      {activeTab === 'LOGS' && canViewLogs && <SystemAuditLogsTab />}
    </div>
  );
};

export default SystemSettingsPage;
