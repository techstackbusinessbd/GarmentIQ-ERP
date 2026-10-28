/**
 * =============================================================================
 * [EN] Platform Security Governance Page (SecuritySettingsPage.tsx)
 * [BN] প্ল্যাটফর্ম সিকিউরিটি ও লকআউট পলিসি পেজ (SecuritySettingsPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] ব্যর্থ পাসওয়ার্ড লকিং থ্রেশহোল্ড, লকআউট মেয়াদ ও সেশন পলিসি কনফিগারেশন পেজ।
 */

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, Button } from '@/components/ui';
import { settingsService } from '../services/settingsService';
import { auditLogService } from '../services/auditLogService';
import { SecuritySettingsTab } from '../components/SecuritySettingsTab';

export const SecuritySettingsPage: React.FC = () => {
  const [sessionTimeout, setSessionTimeout] = useState<string>('60');
  const [lockoutMinutes, setLockoutMinutes] = useState<string>('30');
  const [maxFailedAttempts, setMaxFailedAttempts] = useState<string>('5');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    settingsService.getSecuritySettings()
      .then((s) => {
        setLockoutMinutes(String(s.lockoutMinutes));
        setMaxFailedAttempts(String(s.maxFailedAttempts));
        setSessionTimeout(String(s.sessionTimeoutMinutes));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      await settingsService.updateSecuritySettings({
        lockoutMinutes: Math.max(5, Number(lockoutMinutes) || 30),
        maxFailedAttempts: Math.max(3, Math.min(10, Number(maxFailedAttempts) || 5)),
        sessionTimeoutMinutes: Math.max(15, Number(sessionTimeout) || 60),
      });

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
    <div className="w-full space-y-4">
      <PageHeader
        title="Platform Security Governance"
        subtitle="Configure password lockout duration, retry thresholds, and idle session expiration."
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleSaveSecuritySettings}
            isLoading={isSaving}
            disabled={isLoading}
            icon={<Save size={14} />}
          >
            Save
          </Button>
        }
      />

      <SecuritySettingsTab
        lockoutMinutes={lockoutMinutes}
        onLockoutMinutesChange={setLockoutMinutes}
        maxFailedAttempts={maxFailedAttempts}
        onMaxFailedAttemptsChange={setMaxFailedAttempts}
        sessionTimeout={sessionTimeout}
        onSessionTimeoutChange={setSessionTimeout}
      />
    </div>
  );
};

export default SecuritySettingsPage;
