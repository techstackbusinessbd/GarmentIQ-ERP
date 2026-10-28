/**
 * =============================================================================
 * [EN] Enterprise Executive Authentication Page (LoginPage.tsx)
 * [BN] এন্টারপ্রাইজ এক্সিকিউটিভ সেন্টার্ড লগইন পেজ (সেন্টার্ড কার্ড আর্কিটেকচার)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server Validation), Rule 28 (1-word button), Rule 29 (Zero unnecessary text)
 * [BN] আন্তর্জাতিক এন্টারপ্রাইজ মানদণ্ডে সেন্টার্ড এক্সিকিউটিভ কার্ড: বাহুল্য বর্জিত, দ্রুত ও নির্ভুল।
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
  Building2,
} from 'lucide-react';
import { useAuthStore, useThemeStore } from '@/store';
import { extractSubdomain } from '@/utils';
import { getDefaultDashboardPath } from '@/routes';
import { APP_METADATA } from '@/constants';
import { BrandLogo } from '@/components/ui';
import { LoginTextileBackground } from '@/components/auth';

/**
 * [EN] Centered Executive Corporate Login Page Component.
 * [BN] সেন্টার্ড এক্সিকিউটিভ করপোরেট লগইন পেজ কম্পোনেন্ট।
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { theme, setMode } = useThemeStore();

  const [username, setUsername] = useState<string>('superadmin');
  const [password, setPassword] = useState<string>('Password@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const detectedSubdomain = extractSubdomain();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetPath = (location.state as any)?.from?.pathname;

  const resolveDestination = (currentUser = user): string => {
    if (targetPath && targetPath !== '/' && targetPath !== '/login') {
      return targetPath;
    }
    return getDefaultDashboardPath(currentUser);
  };

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative selection:bg-accent/20 bg-surface-base">
      {/* Background Architectural Canvas Layer */}
      <LoginTextileBackground />

      {/* Top Utility Bar: Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={() => setMode(isDark ? 'light' : 'dark')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-surface-card border border-border-subtle hover:bg-surface-hover text-xs font-medium text-text-primary shadow-xs transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
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

      {/* Centered Executive Authentication Card */}
      <div className="w-full max-w-[390px] bg-surface-card border border-border-subtle rounded-[6px] shadow-sm p-6 sm:p-8 relative z-10 transition-colors">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="lg" showText={false} className="mb-3" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-text-primary">
              {APP_METADATA.NAME}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-[3px] bg-surface-muted border border-border-subtle text-text-muted">
              {APP_METADATA.VERSION}
            </span>
          </div>

          {detectedSubdomain ? (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-accent/10 border border-accent/20 text-accent text-xs font-semibold font-mono uppercase tracking-wider">
              <Building2 size={12} />
              <span>{detectedSubdomain}</span>
            </div>
          ) : (
            <span className="text-xs text-text-muted mt-1">
              Enterprise Management System
            </span>
          )}
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

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
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
                placeholder="Username or email"
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Password
            </label>
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
                placeholder="Password"
                className="w-full pl-9 pr-10 py-2 text-sm bg-surface-card border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
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
                  <span>Logging...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </div>
        </form>

        {/* Minimal Footer */}
        <div className="mt-6 pt-4 border-t border-border-subtle text-center text-[11px] text-text-muted">
          <span>Enterprise Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
