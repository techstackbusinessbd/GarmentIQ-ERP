/**
 * =============================================================================
 * [EN] Profile Password Change Card Component (ProfileChangePasswordCard.tsx)
 * [BN] প্রোফাইল পাসওয়ার্ড পরিবর্তন কার্ড কম্পোনেন্ট (ProfileChangePasswordCard.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Validation)
 * [BN] ব্যবহারকারীর বর্তমান পাসওয়ার্ড ভেরিফাই করে নতুন পাসওয়ার্ড সেট করার স্বয়ংসম্পূর্ণ কার্ড।
 */

import React, { useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '@/features/users/services/userService';

/**
 * [EN] Profile Change Password Card Component
 * [BN] ব্যবহারকারীর ব্যক্তিগত পাসওয়ার্ড পরিবর্তন কার্ড
 */
export const ProfileChangePasswordCard: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // [EN] Basic password strength computation / [BN] পাসওয়ার্ড শক্তি মূল্যায়ন
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500 text-rose-600' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500 text-amber-600' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-sky-500 text-sky-600' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500 text-emerald-600' };
  };

  const strength = getPasswordStrength(newPassword);
  const isMatched = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password cannot be identical to the current password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      toast.success('Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to change password. Check your current password.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[8px] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <KeyRound size={14} className="text-brand-accent" />
          <span>Change Account Password</span>
        </h2>
        <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
          <ShieldCheck size={12} className="text-status-success" /> End-to-End Encrypted
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Current Password Field */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-text-secondary">
            Current Password <span className="text-status-danger">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full pl-3 pr-10 py-1.5 text-xs bg-surface-muted/40 border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none shadow-2xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
            >
              {showCurrentPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-text-secondary">
            New Password <span className="text-status-danger">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              className="w-full pl-3 pr-10 py-1.5 text-xs bg-surface-muted/40 border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none shadow-2xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
            >
              {showNewPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>

          {/* Strength Meter Bar */}
          {newPassword && (
            <div className="pt-1 space-y-1">
              <div className="h-1 w-full bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-text-muted">Password Strength:</span>
                <span className={`font-semibold ${strength.color.split(' ')[1]}`}>
                  {strength.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-text-secondary">
            Confirm New Password <span className="text-status-danger">*</span>
          </label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter matching new password"
            required
            className={`w-full px-3 py-1.5 text-xs bg-surface-muted/40 border rounded-[4px] text-text-primary focus:outline-none shadow-2xs font-mono ${
              confirmPassword && !isMatched
                ? 'border-rose-400 focus:border-rose-500'
                : isMatched
                ? 'border-emerald-400 focus:border-emerald-500'
                : 'border-border-subtle focus:border-brand-accent'
            }`}
          />
          {confirmPassword && (
            <div className="text-[10px] flex items-center gap-1 pt-0.5">
              {isMatched ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <Check size={11} strokeWidth={3} /> Passwords match
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle size={11} /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !isMatched || newPassword.length < 8 || !currentPassword}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover rounded-[4px] transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Lock size={13} />
            <span>{isSubmitting ? 'Updating' : 'Update'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileChangePasswordCard;
