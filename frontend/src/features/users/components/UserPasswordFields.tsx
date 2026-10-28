/**
 * =============================================================================
 * [EN] User Password & Confirmation Form Fields (UserPasswordFields)
 * [BN] ব্যবহারকারীর পাসওয়ার্ড ও কনফার্মেশন ফর্ম ফিল্ডস কম্পোনেন্ট (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Encapsulates password strength, visibility toggle, and matching indicators.
 * [BN] পাসওয়ার্ড ইনপুট, দৃশ্যমানতা টগল এবং কনফার্ম পাসওয়ার্ড ম্যাচিং ভ্যালিডেশন।
 */

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export interface UserPasswordFieldsProps {
  readonly password?: string;
  readonly onPasswordChange?: (v: string) => void;
  readonly confirmPassword?: string;
  readonly onConfirmPasswordChange?: (v: string) => void;
}

export const UserPasswordFields: React.FC<UserPasswordFieldsProps> = ({
  password = '',
  onPasswordChange,
  confirmPassword = '',
  onConfirmPasswordChange,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const passwordsMatch = Boolean(
    password && confirmPassword && password === confirmPassword
  );

  return (
    <>
      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Password <span className="text-status-danger">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Lock size={14} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => onPasswordChange?.(e.target.value)}
            placeholder="Enter password"
            className="w-full pl-9 pr-9 py-2 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 focus:outline-none font-mono transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary cursor-pointer transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <p className="text-[10px] text-text-muted">Min 8 alphanumeric characters</p>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          Confirm Password <span className="text-status-danger">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Lock size={14} />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            placeholder="Re-enter password"
            className={`w-full pl-9 pr-9 py-2 text-xs bg-surface-card border rounded-[4px] text-text-primary focus:ring-1 focus:outline-none font-mono transition-colors ${
              confirmPassword && password
                ? passwordsMatch
                  ? 'border-status-success focus:border-status-success focus:ring-status-success/20'
                  : 'border-status-danger focus:border-status-danger focus:ring-status-danger/20'
                : 'border-border-subtle focus:border-brand-accent focus:ring-brand-accent/20'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary cursor-pointer transition-colors"
            title={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {confirmPassword && password ? (
          passwordsMatch ? (
            <p className="text-[10px] text-status-success flex items-center gap-1 font-medium">
              <CheckCircle2 size={11} />
              <span>Passwords match</span>
            </p>
          ) : (
            <p className="text-[10px] text-status-danger flex items-center gap-1 font-medium">
              <AlertCircle size={11} />
              <span>Passwords do not match</span>
            </p>
          )
        ) : (
          <p className="text-[10px] text-text-muted">Must match password exactly</p>
        )}
      </div>
    </>
  );
};
