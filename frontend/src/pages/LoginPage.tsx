/**
 * =============================================================================
 * [EN] Clean & Simple Corporate Login Page (LoginPage)
 * [BN] সাধারণ, উজ্জ্বল ও মার্জিত করপোরেট লগইন পেজ (থিম মোড পরিবর্তন সুবিধা সহ)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server Validation)
 * [BN] ব্যবহারকারীর নির্দেশ মোতাবেক: সিম্পল ও লাইট ডিজাইন, ডার্ক নয় কিন্তু লাইট/ডার্ক মোড টগল বিদ্যমান।
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
import {
  LoginTextileBackground,
  LoginBrandHeader,
} from '@/components/auth';

/**
 * [EN] Simple Corporate Login Page.
 * Features a clean light canvas, centered card, and accessible light/dark theme toggle.
 *
 * [BN] পরিচ্ছন্ন করপোরেট লগইন পেজ।
 * স্ক্রিনের কেন্দ্রে মার্জিত লাইট কার্ড এবং সহজে মোড (লাইট/ডার্ক) পরিবর্তনের ব্যবস্থা রয়েছে।
 *
 * @returns [EN] Rendered login view / [BN] রেন্ডারকৃত লগইন ভিউ
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { theme, setMode } = useThemeStore();

  // [EN] Form input states / [BN] ফর্ম ইনপুট স্টেটসমূহ
  const [username, setUsername] = useState<string>('superadmin');
  const [password, setPassword] = useState<string>('Password@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const detectedSubdomain = extractSubdomain();

  // [EN] Target path redirection upon successful auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetPath = (location.state as any)?.from?.pathname;

  /**
   * [EN] Computes the target landing path based on role and prior navigation intent.
   * [BN] পূর্বের রুট ইন্টেন্ট অথবা ইউজারের রোলের ওপর ভিত্তি করে গন্তব্য নির্ধারণ।
   */
  const resolveDestination = (currentUser = user): string => {
    if (targetPath && targetPath !== '/' && targetPath !== '/login') {
      return targetPath;
    }
    return getDefaultDashboardPath(currentUser);
  };

  // [EN] Synchronous guard: Authenticated users can NEVER access or see the login page
  // [BN] সিনক্রোনাস গার্ড: অথেনটিকেটেড ব্যবহারকারীরা কখনই লগইন পেজে প্রবেশ বা দেখতে পারবেন না
  if (isAuthenticated && user) {
    return <Navigate to={resolveDestination(user)} replace />;
  }

  /** [EN] Form submission handler / [BN] ফর্ম সাবমিট হ্যান্ডলার */
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


  // [EN] Check if current theme is dark mode / [BN] ডার্ক মোড সক্রিয় কিনা
  const isDark = theme === 'obsidian';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-brand-accent/20">
      {/* =====================================================================
       * [EN] Clean Background: Light & Crisp with Subtle Micro-Grid
       * [BN] ক্লিন ব্যাকগ্রাউন্ড: লাইট ও পরিচ্ছন্ন সারফেস
       * ===================================================================== */}
      <LoginTextileBackground />

      {/* =====================================================================
       * [EN] Screen Top Header: Branding (Left) & Darkmode (Right)
       * [BN] পুরো স্ক্রিনের টপ হেডার: ব্র্যান্ডিং (বামে) ও ডার্কমোড (ডানে)
       * ===================================================================== */}
      <header className="absolute top-0 inset-x-0 p-4 sm:p-6 z-20 flex items-center justify-between pointer-events-auto">
        {/* Left: Brand Logo & GarmentIQ [ ERP ] */}
        <LoginBrandHeader />

        {/* Right: Quick Dark / Light Toggle Button - Sharp Micro-Radius (4px) */}
        <button
          type="button"
          onClick={() => setMode(isDark ? 'light' : 'dark')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-surface-card border border-border-subtle hover:bg-surface-hover text-xs font-medium text-text-primary shadow-xs transition-colors"
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
      </header>

      {/* =====================================================================
       * [EN] Centered Clean Floating Login Box - Sharp Micro-Radius (6px)
       * [BN] স্ক্রিনের কেন্দ্রে মূল মার্জিত শার্প লাইট কার্ড (৬px মাইক্রো-রেডিয়াস)
       * ===================================================================== */}
      <div className="w-full max-w-[400px] bg-surface-card border border-border-subtle rounded-[6px] shadow-lg p-6 sm:p-8 relative z-10 my-auto transition-colors">
        {/* Clean Sign In Title */}
        <div className="mb-6">
          {detectedSubdomain && (
            <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-brand-accent-light border border-brand-accent/20 text-brand-accent text-xs font-semibold font-mono tracking-wide">
              <Building2 size={13} />
              <span>{detectedSubdomain.toUpperCase()} WORKSPACE</span>
            </div>
          )}
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Sign In
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {detectedSubdomain
              ? `Dedicated enterprise workspace for ${detectedSubdomain.toUpperCase()}.`
              : 'Enter your credentials to continue.'}
          </p>
        </div>


        {/* Server Validation Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-[4px] bg-status-danger-bg border border-status-danger-border flex items-start gap-2.5 text-status-danger text-xs animate-in fade-in duration-200">
            {error.toLowerCase().includes('lock') ? (
              <Lock size={15} className="shrink-0 mt-0.5 text-status-danger" />
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
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
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
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2 text-sm bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted hover:text-text-primary select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-[2px] border-border-subtle text-brand-accent focus:ring-brand-accent/30"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[4px] text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover active:scale-[0.99] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Logging</span>
              </span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Clean Footer below Login Box */}
      <div className="relative z-10 mt-6 text-center text-xs text-text-muted flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>GarmentIQ ERP • Enterprise Secure Session</span>
      </div>
    </div>
  );
};

export default LoginPage;
