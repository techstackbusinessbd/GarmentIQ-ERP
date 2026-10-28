/**
 * =============================================================================
 * [EN] Profile Password Change Card Component (ProfileChangePasswordCard.tsx)
 * [BN] প্রোফাইল পাসওয়ার্ড পরিবর্তন কার্ড কম্পোনেন্ট (ProfileChangePasswordCard.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens),
 *             Rule 28 (Single-word buttons), Rule 29 (Minimal Text)
 * [BN] ব্যবহারকারীর বর্তমান পাসওয়ার্ড ভেরিফাই করে নতুন পাসওয়ার্ড সেট করার স্বয়ংসম্পূর্ণ কার্ড।
 */

import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { userService } from '@/features/users/services/userService';

export const ProfileChangePasswordCard: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const isMatched = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Enter current password');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Minimum 8 characters required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must differ from current password');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Password update failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <KeyRound size={15} className="text-brand-accent" />
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Change Password
          </h2>
        </div>
        <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
          <ShieldCheck size={12} className="text-brand-accent" />
          <span>Minimum 8 Characters</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Current Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-text-primary">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full pl-3 pr-10 py-2 text-xs bg-surface-base border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none shadow-2xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((p) => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
            >
              {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-text-primary">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter 8+ characters"
              required
              minLength={8}
              className="w-full pl-3 pr-10 py-2 text-xs bg-surface-base border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none shadow-2xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
            >
              {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
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

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-text-primary">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter matching password"
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

        {/* Actions */}
        <div className="flex items-center justify-end pt-2 border-t border-border-subtle">
          <Button
            type="submit"
            disabled={isSubmitting || !isMatched || newPassword.length < 8 || !currentPassword}
            variant="primary"
            size="sm"
            icon={<KeyRound size={13} />}
          >
            {isSubmitting ? 'Updating' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileChangePasswordCard;
