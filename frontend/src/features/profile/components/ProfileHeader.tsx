/**
 * =============================================================================
 * [EN] Executive Profile Header Banner Component (ProfileHeader.tsx)
 * [BN] এক্সিকিউটিভ প্রোফাইল হেডার ব্যানার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] কর্পোরেট কভার ব্যানার, এক্সিকিউটিভ অবতার, ভেরিফাইড স্ট্যাটাস ও পদবী ব্যানার।
 */

import React from 'react';
import { ShieldCheck, Building, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store';

/**
 * [EN] Executive Profile Cover & Identity Banner.
 * Designed with a subtle corporate mesh banner, executive avatar, and role credentials.
 * Zero sign-out button in header per enterprise UI standards.
 *
 * [BN] এক্সিকিউটিভ প্রোফাইল কভার ও আইডেন্টিটি ব্যানার।
 * সাবটেল কর্পোরেট ব্যানার, অবতার ও পদবী ব্যাজ সমৃদ্ধ।
 */
export const ProfileHeader: React.FC = () => {
  const { user } = useAuthStore();

  const getInitials = (): string => {
    if (!user?.fullName) return (user?.username?.substring(0, 2) || 'AK').toUpperCase();
    const parts = user.fullName.trim().split(/\s+/);
    return `${parts[0]?.charAt(0) || ''}${parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : ''}`.toUpperCase();
  };

  const primaryRole = user?.roles?.[0]?.replace(/^ROLE_/, '').replace(/_/g, ' ') || 'SUPER ADMIN';

  return (
    <div className="relative rounded-[8px] overflow-hidden bg-surface-card border border-border-subtle shadow-xs">
      {/* =====================================================================
       * [EN] Corporate Decorative Mesh Gradient Banner
       * [BN] কর্পোরেট ডেকোরেটিভ মেশ গ্রেডিয়েন্ট ব্যানার
       * ===================================================================== */}
      <div className="h-28 sm:h-36 w-full bg-linear-to-r from-brand-accent/20 via-brand-accent/10 to-surface-muted relative overflow-hidden border-b border-border-subtle">
        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(var(--color-brand-accent, #2563eb) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="absolute right-4 top-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-card/80 backdrop-blur-md border border-border-subtle text-[11px] font-semibold text-text-secondary shadow-xs">
          <Sparkles size={13} className="text-brand-accent" />
          <span>GarmentIQ Executive Portal</span>
        </div>
      </div>

      {/* =====================================================================
       * [EN] Profile Identity Strip (Overlapping Avatar & Title)
       * [BN] প্রোফাইল আইডেন্টিটি স্ট্রিপ (ওভারল্যাপিং অবতার ও পদবী)
       * ===================================================================== */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        {/* Left: Avatar & Identity Details */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
          {/* Avatar with Verified Status */}
          <div className="relative shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[8px] bg-linear-to-br from-brand-accent to-brand-accent-hover text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md border-4 border-surface-card select-none">
              {getInitials()}
            </div>
            {/* Green Online Pulse Indicator */}
            <span
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-status-success ring-2 ring-surface-card animate-pulse"
              title="Active Enterprise Session"
            />
          </div>

          {/* User Full Name, Designation & Badges */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                {user?.fullName || user?.username || 'Executive User'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider bg-status-success-bg text-status-success border border-status-success-border">
                <ShieldCheck size={11} />
                <span>Active Account</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-text-secondary flex items-center gap-2 flex-wrap">
              <span>{user?.designation || 'Chief Technology Officer'}</span>
              <span className="text-text-muted">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <Building size={13} />
                <span>Group Corporate HQ</span>
              </span>
            </p>

            {/* Role Tags */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono font-bold tracking-wider bg-brand-accent/10 text-brand-accent border border-brand-accent/25 uppercase">
                {primaryRole}
              </span>
              <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-semibold bg-surface-muted text-text-muted border border-border-subtle">
                Executive Authorization
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
