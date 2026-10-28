/**
 * =============================================================================
 * [EN] User Password Reset Form Component (UserPasswordResetForm.tsx)
 * [BN] ব্যবহারকারী পাসওয়ার্ড রিসেট ফর্ম কম্পোনেন্ট (UserPasswordResetForm.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Design tokens)
 * [BN] নতুন পাসওয়ার্ড নির্ধারণ, অটো-জেনারেট ও একাউন্ট আনলক করার ফর্ম।
 */

import React, { useState } from 'react';
import {
  KeyRound,
  Check,
  Copy,
  Sparkles,
  Unlock,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { userService } from '../services/userService';
import { auditLogService } from '@/features/settings/services/auditLogService';

export interface UserPasswordResetFormProps {
  readonly userId: string;
  readonly username: string;
  readonly onSuccess: () => void;
  readonly onCancel: () => void;
}

export const UserPasswordResetForm: React.FC<UserPasswordResetFormProps> = ({
  userId,
  username,
  onSuccess,
  onCancel,
}) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [unlockAccount, setUnlockAccount] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // [EN] Generate strong random password / [BN] শক্তিশালী র‍্যান্ডম পাসওয়ার্ড জেনারেট
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let generated = 'Garment@';
    for (let i = 0; i < 6; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(generated).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Generated strong password & copied to clipboard.');
      }).catch(() => {});
    }
  };

  const handleCopyPassword = () => {
    if (!newPassword || !navigator.clipboard) return;
    navigator.clipboard.writeText(newPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info('Password copied to clipboard.');
    }).catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.resetPassword(userId, newPassword, unlockAccount);
      auditLogService.logEntry({
        actor: 'superadmin',
        actorRole: 'System Super Admin',
        category: 'USER_MANAGEMENT',
        action: 'PASSWORD_RESET',
        targetResource: `User: ${username}`,
        details: `Password reset by administrator.${unlockAccount ? ' Account lock released.' : ''}`,
        severity: 'SUCCESS',
        ipAddress: '127.0.0.1 (Web UI)',
      });
      toast.success(`Password for @${username} has been successfully reset.`);
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to reset password.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMatched = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs space-y-5">
      <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound size={15} className="text-brand-accent" />
            <span>Set New Password</span>
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Enter a new password or auto-generate a secure password suggestion.
          </p>
        </div>
        <Button
          size="xs"
          variant="secondary"
          onClick={handleGeneratePassword}
          icon={<Sparkles size={13} />}
        >
          Generate
        </Button>
      </div>

      {/* New Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          New Password <span className="text-status-danger">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
            minLength={8}
            className="w-full pl-3 pr-20 py-2 text-xs bg-surface-base border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none shadow-2xs font-mono"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {newPassword && (
              <button
                type="button"
                onClick={handleCopyPassword}
                title="Copy password"
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Confirm New Password <span className="text-status-danger">*</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter matching password"
          required
          className={`w-full px-3 py-2 text-xs bg-surface-base border rounded-[4px] text-text-primary focus:outline-none shadow-2xs font-mono ${
            confirmPassword && !isMatched
              ? 'border-rose-400 focus:border-rose-500'
              : isMatched
              ? 'border-emerald-400 focus:border-emerald-500'
              : 'border-border-subtle focus:border-brand-accent'
          }`}
        />
        {confirmPassword && (
          <div className="text-[11px] flex items-center gap-1">
            {isMatched ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> Passwords match
              </span>
            ) : (
              <span className="text-rose-600 flex items-center gap-1">
                <AlertCircle size={12} /> Passwords do not match
              </span>
            )}
          </div>
        )}
      </div>

      {/* Account Unlock Option */}
      <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-text-primary select-none">
          <input
            type="checkbox"
            checked={unlockAccount}
            onChange={(e) => setUnlockAccount(e.target.checked)}
            className="rounded-[3px] border-border-subtle text-brand-accent focus:ring-brand-accent/20 cursor-pointer"
          />
          <span className="font-medium">Automatically unlock account & clear failed login attempts</span>
        </label>
        <Unlock size={14} className="text-text-muted" />
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isMatched || newPassword.length < 8}
          variant="primary"
          icon={<KeyRound size={14} />}
        >
          {isSubmitting ? 'Resetting' : 'Reset'}
        </Button>
      </div>
    </form>
  );
};
