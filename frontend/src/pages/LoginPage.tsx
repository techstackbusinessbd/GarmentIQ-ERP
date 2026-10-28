/**
 * =============================================================================
 * [EN] Enterprise Split-Screen Corporate Login Page (LoginPage.tsx)
 * [BN] এন্টারপ্রাইজ ৫০/৫০ স্প্লিট-স্ক্রিন করপোরেট লগইন পেজ (থিম মোড পরিবর্তন সুবিধা সহ)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server Validation), Rule 28 (1-word button)
 * [BN] আন্তর্জাতিক এন্টারপ্রাইজ মানদণ্ডে ৫০/৫০ স্প্লিট-স্ক্রিন: বামে আরএমজি ফিচার প্যানেল এবং ডানে শার্প সাইন-ইন ফর্ম।
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Sun,
  Moon,
  Building2,
} from 'lucide-react';
import { useAuthStore, useThemeStore } from '@/store';
import { extractSubdomain } from '@/utils';
import { getDefaultDashboardPath } from '@/routes';
import { LoginHeroPanel } from '@/components/auth';

/**
 * [EN] 50/50 Split-Screen Corporate Login Page Component.
 * [BN] ৫০/৫০ স্প্লিট-স্ক্রিন করপোরেট লগইন পেজ কম্পোনেন্ট।
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { theme, setMode } = useThemeStore();

  // Form input states
  const [username, setUsername] = useState<string>('superadmin');
  const [password, setPassword] = useState<string>('Password@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const detectedSubdomain = extractSubdomain();

  // Target path redirection upon successful auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetPath = (location.state as any)?.from?.pathname;

  const resolveDestination = (currentUser = user): string => {
    if (targetPath && targetPath !== '/' && targetPath !== '/login') {
      return targetPath;
    }
    return getDefaultDashboardPath(currentUser);
  };

  // Guard: Authenticated users redirect immediately
  if (isAuthenticated && user) {
    return <Navigate to={resolveDestination(user)} replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password) return;

    const success = await login({
      username: username.trim(),
      password,
      tenantCode: detectedSubdomain || undefined,
    });
    if (success) {
      const currentUser = useAuthStore.getState().user;
      navigate(resolveDestination(currentUser), { replace: true });
    }
  };

  const isDark = theme === 'obsidian';

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-surface-base relative selection:bg-accent/20">
      {/* =====================================================================
       * [EN] Left Column: Executive Brand Showcase & Highlights (50% on lg+)
       * [BN] বাম পাশের কলাম: এক্সিকিউটিভ ব্র্যান্ড ও ডোমেন হাইলাইটস
       * ===================================================================== */}
      <LoginHeroPanel detectedSubdomain={detectedSubdomain} />

      {/* =====================================================================
       * [EN] Right Column: High-Clarity Corporate Authentication Canvas
       * [BN] ডান পাশের কলাম: পরিষ্কার ও মার্জিত করপোরেট সাইন-ইন ক্যানভাস
       * ===================================================================== */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative bg-surface-base transition-colors min-h-screen">
        {/* Top Utility Bar: Theme Switcher */}
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={() => setMode(isDark ? 'light' : 'dark')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-surface-card border border-border-subtle hover:bg-surface-hover text-xs font-medium text-text-primary shadow-xs transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun size={13} className="text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-slate-600 dark:text-slate-300" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Centered Sign In Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          {/* Workspace Title & Badge */}
          <div className="mb-6">
            {detectedSubdomain ? (
              <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-accent/10 border border-accent/25 text-accent text-xs font-semibold font-mono tracking-wide">
                <Building2 size={13} />
                <span>{detectedSubdomain.toUpperCase()} WORKSPACE</span>
              </div>
            ) : (
              <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-surface-muted border border-border-subtle text-text-muted text-xs font-mono">
                <Building2 size={13} />
                <span>ENTERPRISE PORTAL</span>
              </div>
            )}
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Sign In
            </h2>
            <p className="text-xs text-text-muted mt-1.5">
              {detectedSubdomain
                ? `Dedicated enterprise workspace for ${detectedSubdomain.toUpperCase()}.`
                : 'Enter your credentials to continue.'}
            </p>
          </div>

          {/* Server Validation Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-[4px] bg-danger/10 border border-danger/25 flex items-start gap-2.5 text-danger text-xs animate-in fade-in duration-200">
              {error.toLowerCase().includes('lock') ? (
                <Lock size={15} className="shrink-0 mt-0.5 text-danger" />
              ) : (
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {/* Corporate Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <User size={15} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or corporate email"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-text-primary"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock size={15} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-[3px] border-border-subtle text-accent focus:ring-accent/30 cursor-pointer accent-accent"
                />
                <span className="text-xs text-text-secondary select-none">
                  Remember me
                </span>
              </label>
            </div>

            {/* Single-Word Submit Button (Rule 28) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !username.trim() || !password}
                className="w-full py-2.5 px-4 rounded-[4px] bg-accent hover:bg-accent-hover active:bg-accent-active disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Corporate Security Footer */}
        <div className="w-full text-center text-xs text-text-muted pt-6 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-accent" />
          <span>GarmentIQ ERP • Enterprise Secure Session</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
