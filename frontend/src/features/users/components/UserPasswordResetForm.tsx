/**
 * =============================================================================
 * [EN] Premium User Password Reset Form Component (UserPasswordResetForm.tsx)
 * [BN] প্রিমিয়াম ব্যবহারকারী পাসওয়ার্ড রিসেট ফর্ম কম্পোনেন্ট (UserPasswordResetForm.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28 (Single-word buttons)
 * [BN] নতুন পাসওয়ার্ড নির্ধারণ, অটো-জেনারেট, লাইভ স্ট্রেংথ মিটার ও একাউন্ট আনলক ফর্ম।
 */

import React, { useState, useMemo } from 'react';
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

  // Password strength calculation (0 to 3)
  const strengthScore = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const strengthConfig = useMemo(() => {
    switch (strengthScore) {
      case 3:
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
      case 2:
        return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
      default:
        return { label: '', color: 'bg-border-subtle', text: 'text-text-muted' };
    }
  }, [strengthScore]);

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
        toast.success('Password generated & copied');
      }).catch(() => {});
    }
  };

  const handleCopyPassword = () => {
    if (!newPassword || !navigator.clipboard) return;
    navigator.clipboard.writeText(newPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info('Copied');
    }).catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (newPassword.length < 8) {
      toast.error('Minimum 8 characters required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
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
      toast.success(`Password updated for @${username}`);
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Password reset failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMatched = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-surface-card border border-border-subtle rounded-[6px] shadow-xs space-y-4">
      {/* Header with Title & Generate Button */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <KeyRound size={15} className="text-brand-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Set Password
          </h3>
        </div>
        <Button
          type="button"
          size="xs"
          variant="secondary"
          onClick={handleGeneratePassword}
          icon={<Sparkles size={12} />}
        >
          Generate
        </Button>
      </div>

      {/* New Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          New Password
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
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="p-1 text-text-muted hover:text-text-primary cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* Live Strength Meter */}
        {newPassword && (
          <div className="pt-1 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-1">
              <span className={`h-1 flex-1 rounded-full transition-all ${strengthScore >= 1 ? strengthConfig.color : 'bg-border-subtle'}`} />
              <span className={`h-1 flex-1 rounded-full transition-all ${strengthScore >= 2 ? strengthConfig.color : 'bg-border-subtle'}`} />
              <span className={`h-1 flex-1 rounded-full transition-all ${strengthScore >= 3 ? strengthConfig.color : 'bg-border-subtle'}`} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${strengthConfig.text}`}>
              {strengthConfig.label}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
            className={`w-full pl-3 pr-8 py-2 text-xs bg-surface-base border rounded-[4px] text-text-primary focus:outline-none shadow-2xs font-mono transition-colors ${
              confirmPassword && !isMatched
                ? 'border-rose-400 focus:border-rose-500'
                : isMatched
                ? 'border-emerald-400 focus:border-emerald-500'
                : 'border-border-subtle focus:border-brand-accent'
            }`}
          />
          {confirmPassword && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              {isMatched ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <AlertCircle size={14} className="text-rose-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unlock Account Checkbox */}
      <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-text-primary select-none">
          <input
            type="checkbox"
            checked={unlockAccount}
            onChange={(e) => setUnlockAccount(e.target.checked)}
            className="rounded-[3px] border-border-subtle text-brand-accent focus:ring-brand-accent/20 cursor-pointer"
          />
          <span className="font-medium">Unlock account & reset attempts</span>
        </label>
        <Unlock size={13} className="text-text-muted" />
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          size="sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isMatched || newPassword.length < 8}
          variant="primary"
          size="sm"
          icon={<KeyRound size={13} />}
        >
          {isSubmitting ? 'Resetting' : 'Reset'}
        </Button>
      </div>
    </form>
  );
};

export default UserPasswordResetForm;
