/**
 * =============================================================================
 * [EN] Platform Security Governance Tab Component (SecuritySettingsTab.tsx)
 * [BN] প্ল্যাটফর্ম সিকিউরিটি ও লকআউট কনফিগারেশন ট্যাব (SecuritySettingsTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Validation)
 * [BN] ব্যর্থ পাসওয়ার্ড লকিং থ্রেশহোল্ড, লকআউট মেয়াদ ও সেশন পলিসি কনফিগারেশন।
 */

import React from 'react';
import { CheckCircle2, ShieldAlert, KeyRound, Timer } from 'lucide-react';
import { Badge, TextInput } from '@/components/ui';

export interface SecuritySettingsTabProps {
  readonly lockoutMinutes: string;
  readonly onLockoutMinutesChange: (val: string) => void;
  readonly maxFailedAttempts: string;
  readonly onMaxFailedAttemptsChange: (val: string) => void;
  readonly sessionTimeout: string;
  readonly onSessionTimeoutChange: (val: string) => void;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({
  lockoutMinutes,
  onLockoutMinutesChange,
  maxFailedAttempts,
  onMaxFailedAttemptsChange,
  sessionTimeout,
  onSessionTimeoutChange,
}) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={15} className="text-brand-accent" />
            <span>Password Security & Account Lockout Policy</span>
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Configure consecutive failed password threshold and account lockout duration for factory personnel.
          </p>
        </div>
        <Badge variant="success">
          Security Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Lockout Minutes Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary flex items-center gap-1">
              <Timer size={13} className="text-status-warning" />
              <span>Account Lockout Duration (Minutes)</span>
            </label>
            <div className="flex items-center gap-1">
              {['15', '30', '60'].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onLockoutMinutesChange(mins)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-semibold transition-colors cursor-pointer border ${
                    lockoutMinutes === mins
                      ? 'bg-brand-accent text-white border-brand-accent shadow-2xs'
                      : 'bg-surface-muted text-text-muted hover:text-text-primary border-border-subtle'
                  }`}
                  title={`Set lockout to ${mins} minutes`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
          <TextInput
            type="number"
            min={5}
            max={1440}
            value={lockoutMinutes}
            onChange={(e) => onLockoutMinutesChange(e.target.value)}
            className="font-mono"
            placeholder="e.g. 15, 30"
          />
          <p className="text-[10px] text-text-muted">
            Lockout period when user exceeds failed attempts. Set to <strong>15 mins</strong> for fast factory shift recovery.
          </p>
        </div>

        {/* Max Failed Attempts Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary flex items-center gap-1">
              <KeyRound size={13} className="text-brand-accent" />
              <span>Max Failed Password Attempts</span>
            </label>
            <div className="flex items-center gap-1">
              {['3', '5', '8'].map((att) => (
                <button
                  key={att}
                  type="button"
                  onClick={() => onMaxFailedAttemptsChange(att)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-semibold transition-colors cursor-pointer border ${
                    maxFailedAttempts === att
                      ? 'bg-brand-accent text-white border-brand-accent shadow-2xs'
                      : 'bg-surface-muted text-text-muted hover:text-text-primary border-border-subtle'
                  }`}
                  title={`Set threshold to ${att} failed attempts`}
                >
                  {att}x
                </button>
              ))}
            </div>
          </div>
          <TextInput
            type="number"
            min={3}
            max={10}
            value={maxFailedAttempts}
            onChange={(e) => onMaxFailedAttemptsChange(e.target.value)}
            className="font-mono"
            placeholder="Default 5 (Min 3, Max 10)"
          />
          <p className="text-[10px] text-text-muted">
            Consecutive wrong passwords before account is locked automatically.
          </p>
        </div>

        {/* Session Timeout */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-primary">
            User Session Timeout (Minutes)
          </label>
          <TextInput
            type="number"
            min={15}
            max={480}
            value={sessionTimeout}
            onChange={(e) => onSessionTimeoutChange(e.target.value)}
            className="font-mono"
          />
          <p className="text-[10px] text-text-muted">Automatic session expiration time for inactive users.</p>
        </div>

        {/* Auditable Entity Standard Badge */}
        <div className="p-3.5 rounded-[4px] bg-surface-base border border-border-subtle space-y-1">
          <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-status-success" />
            <span>Full Audit Logging Enabled</span>
          </span>
          <p className="text-[11px] text-text-muted">
            All system actions record creator, modifier, timestamp, and audit trail history.
          </p>
        </div>
      </div>
    </div>
  );
};
