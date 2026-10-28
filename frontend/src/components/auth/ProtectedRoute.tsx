/**
 * =============================================================================
 * [EN] Enterprise Protected Route Security Guard (ProtectedRoute)
 * [BN] এন্টারপ্রাইজ প্রটেক্টেড রাউট সিকিউরিটি গার্ড (ProtectedRoute)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 * [BN] অননুমোদিত প্রবেশ রোধ, স্বয়ংক্রিয় লগইন রিডাইরেক্ট এবং আরবিএসি রোল ও পারমিশন ভ্যালিডেশন গার্ড।
 */

import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store';
import { usePermission } from '@/features/privileges';

/**
 * [EN] Properties contract for the ProtectedRoute component.
 * [BN] ProtectedRoute কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface ProtectedRouteProps {
  /** [EN] Optional array of role codes authorized to access this route / [BN] অনুমোদনপ্রাপ্ত রোল কোডের তালিকা */
  readonly allowedRoles?: readonly string[];

  /** [EN] Optional granular permission code or codes required / [BN] প্রয়োজনীয় নির্দিষ্ট পারমিশন কোড */
  readonly requiredPermission?: string | readonly string[];

  /** [EN] Optional child components to render when authorized / [BN] অনুমতি থাকলে প্রদর্শিত চিলড্রেন */
  readonly children?: React.ReactNode;
}

/**
 * [EN] Enterprise Security Guard Component for Application Routes.
 * Validates authentication session and role/permission gates before granting view access.
 *
 * [BN] অ্যাপ্লিকেশন রুটের জন্য এন্টারপ্রাইজ সিকিউরিটি গার্ড কম্পোনেন্ট।
 * রাউটে প্রবেশাধিকার দেওয়ার পূর্বে ব্যবহারকারীর সেশন এবং রোল-পারমিশন যাচাই করে।
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requiredPermission,
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated, user, hasAnyRole } = useAuthStore();
  const { hasPermission, hasAnyPermission, isSuperAdmin } = usePermission();
  const [isVerifyingFresh, setIsVerifyingFresh] = useState<boolean>(false);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState<boolean>(false);

  // [EN] Step 1: Redirect unauthenticated visitors to corporate login
  // [BN] ধাপ ১: অননুমোদিত ব্যবহারকারীকে লগইন পেজে রিডাইরেক্ট করা
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // [EN] Step 2: Super Admin bypasses all route clearance checks
  // [BN] ধাপ ২: সুপার অ্যাডমিন সরাসরি সমস্ত রুটে প্রবেশের অধিকার রাখে
  if (isSuperAdmin) {
    return children ? <>{children}</> : <Outlet />;
  }

  let isAuthorized = true;
  const missingRequirements: string[] = [];

  // [EN] Step 3: Verify role authorization if specific roles are required
  // [BN] ধাপ ৩: নির্দিষ্ট রোলের বাধ্যবাধকতা থাকলে ব্যবহারকারীর রোল যাচাই করা
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      isAuthorized = false;
      missingRequirements.push(...allowedRoles);
    }
  }

  // [EN] Step 4: Verify granular permission if specified
  // [BN] ধাপ ৪: নির্দিষ্ট গ্র্যানুলার পারমিশন যাচাই করা
  if (isAuthorized && requiredPermission) {
    if (typeof requiredPermission === 'string') {
      if (!hasPermission(requiredPermission)) {
        isAuthorized = false;
        missingRequirements.push(requiredPermission);
      }
    } else if (Array.isArray(requiredPermission) && requiredPermission.length > 0) {
      if (!hasAnyPermission(requiredPermission)) {
        isAuthorized = false;
        missingRequirements.push(...requiredPermission);
      }
    }
  }

  // [EN] Real-time live synchronization: If unauthorized, attempt one-time fresh check from server before blocking
  // [BN] লাইভ সিঙ্ক: অনুমতি না থাকলে পেজ ব্লক করার পূর্বে সার্ভার থেকে লেটেস্ট পারমিশন যাচাই করা
  useEffect(() => {
    if (!isAuthorized && !hasAttemptedRefresh && isAuthenticated && !isSuperAdmin) {
      setIsVerifyingFresh(true);
      useAuthStore
        .getState()
        .fetchProfile()
        .finally(() => {
          setIsVerifyingFresh(false);
          setHasAttemptedRefresh(true);
        });
    }
  }, [isAuthorized, hasAttemptedRefresh, isAuthenticated, isSuperAdmin]);

  const handleManualRecheck = async () => {
    setIsVerifyingFresh(true);
    await useAuthStore.getState().fetchProfile();
    setIsVerifyingFresh(false);
  };

  if (isVerifyingFresh) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-surface-base text-xs text-text-muted gap-2.5">
        <RefreshCw size={22} className="animate-spin text-brand-accent" />
        <span className="font-medium text-text-secondary">Verifying enterprise clearance from server...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-surface-base">
        <div className="max-w-md w-full bg-surface-card border border-border-subtle rounded-[6px] shadow-sm p-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-status-danger-bg border border-status-danger-border flex items-center justify-center text-status-danger mb-4">
            <ShieldAlert size={28} />
          </div>

          <h2 className="text-xl font-bold text-text-primary tracking-tight mb-2">
            Access Restricted
          </h2>

          <p className="text-sm text-text-muted leading-relaxed mb-6">
            Your corporate account (<strong>{user.username}</strong>) does not have the required permissions to view this domain screen.
          </p>

          <div className="w-full bg-surface-muted border border-border-subtle rounded-[4px] p-3 text-xs text-text-muted mb-6 text-left">
            <span className="font-semibold block mb-1">Required Authorities / Roles:</span>
            <div className="flex flex-wrap gap-1">
              {missingRequirements.map((req) => (
                <span
                  key={req}
                  className="px-2 py-0.5 rounded-[2px] bg-surface-card border border-border-subtle text-[11px] font-mono text-text-secondary"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={handleManualRecheck}
              disabled={isVerifyingFresh}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-text-primary bg-surface-base hover:bg-surface-muted border border-border-subtle rounded-[4px] shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={isVerifyingFresh ? 'animate-spin' : ''} />
              <span>Retry</span>
            </button>
            <Link
              to="/app/overview/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover rounded-[4px] shadow-xs transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // [EN] Step 5: Access granted; render children or nested router Outlet
  // [BN] ধাপ ৫: অনুমতি প্রাপ্ত; চিলড্রেন অথবা নেস্টেড আউটলেট রেন্ডার করা
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
