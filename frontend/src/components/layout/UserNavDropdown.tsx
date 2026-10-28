/**
 * =============================================================================
 * [EN] Enterprise Authenticated User Navigation Dropdown (UserNavDropdown)
 * [BN] এন্টারপ্রাইজ অথেনটিকেটেড ইউজার ন্যাভিগেশন ড্রপডাউন কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ব্যবহারকারীর প্রোফাইল তথ্য, প্রোফাইল লিংক ও সাইন আউটের জন্য পরিচ্ছন্ন ড্রপডাউন মেনু।
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store';

/**
 * [EN] Streamlined & Ultra-Clean Authenticated User Dropdown Menu Component.
 * Features identity banner, Profile & Preferences link, admin shortcuts, and sign-out.
 * Theme configuration is cleanly decoupled and placed in the dedicated Profile page.
 *
 * [BN] স্লিম ও পরিচ্ছন্ন ইউজার ড্রপডাউন মেনু কম্পোনেন্ট।
 * প্রোফাইল কার্ড, মাই প্রোফাইল লিংক, অ্যাডমিন শর্টকাট এবং সাইন আউটের পরিচ্ছন্ন ইন্টারফেস।
 */
export interface UserNavDropdownProps {
  readonly variant?: 'light' | 'dark';
}

/**
 * [EN] Streamlined & Ultra-Clean Authenticated User Dropdown Menu Component.
 * Features identity banner, Profile & Preferences link, admin shortcuts, and sign-out.
 * Theme configuration is cleanly decoupled and placed in the dedicated Profile page.
 *
 * [BN] স্লিম ও পরিচ্ছন্ন ইউজার ড্রপডাউন মেনু কম্পোনেন্ট।
 * প্রোফাইল কার্ড, মাই প্রোফাইল লিংক, অ্যাডমিন শর্টকাট এবং সাইন আউটের পরিচ্ছন্ন ইন্টারফেস।
 */
export const UserNavDropdown: React.FC<UserNavDropdownProps> = ({
  variant = 'dark',
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // [EN] Close dropdown on outside click or Escape key / [BN] বাইরে বা Escape চাপলে ড্রপডাউন বন্ধ করা
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // [EN] Compute user initials / [BN] ইউজারের নামের আদ্যক্ষর নির্ধারণ
  const getInitials = (): string => {
    if (!user?.fullName) return (user?.username?.substring(0, 2) || 'AD').toUpperCase();
    const parts = user.fullName.trim().split(/\s+/);
    return `${parts[0]?.charAt(0) || ''}${parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : ''}`.toUpperCase();
  };

  const formatRole = (r: string) =>
    r.replace(/^ROLE_/, '').split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  const primaryRoleCode = user?.roles?.[0]?.replace('ROLE_', '') || 'USER';
  const userSubtitle = user?.designation || formatRole(user?.roles?.[0] || 'ROLE_USER');

  // [EN] Sign out action handler / [BN] সাইন আউট হ্যান্ডলার
  const handleSignOut = () => {
    setIsOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* =====================================================================
       * [EN] Dropdown Trigger Button - Avatar, User Label & Animated Chevron
       * [BN] ড্রপডাউন ট্রিগার বাটন - অবতার, ইউজারের নাম ও শেভরন
       * ===================================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2.5 px-2 py-1 rounded-[4px] transition-colors cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-brand-accent/30 ${
          isDark ? 'hover:bg-slate-800/80 text-slate-100' : 'hover:bg-surface-muted text-text-primary'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Avatar Square - Sharp Micro-Radius (4px) */}
        <div className={`h-8 w-8 rounded-[4px] border flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
          isDark
            ? 'bg-brand-accent/25 border-brand-accent/40 text-brand-accent-light'
            : 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'
        }`}>
          {getInitials()}
        </div>

        {/* User Display Name & Role Label (Hidden on small mobile screens) */}
        <div className="hidden sm:flex flex-col text-left justify-center min-w-0">
          <span className={`text-xs font-semibold leading-tight max-w-[150px] truncate ${
            isDark ? 'text-slate-100' : 'text-text-primary'
          }`}>
            {user?.fullName || user?.username || 'Active User'}
          </span>
          <span className={`text-[11px] leading-tight mt-0.5 font-medium tracking-normal truncate ${
            isDark ? 'text-slate-400' : 'text-text-muted'
          }`}>
            {userSubtitle.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Animated Chevron Indicator */}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isDark ? 'text-slate-400' : 'text-text-muted'
          } ${isOpen ? 'rotate-180 text-brand-accent' : ''}`}
        />
      </button>

      {/* =====================================================================
       * [EN] Ultra-Clean Dropdown Menu Popover (Zero Theme Clutter)
       * [BN] অতি-পরিচ্ছন্ন ড্রপডাউন মেনু পপওভার (থিম ক্লাটারমুক্ত)
       * ===================================================================== */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-[6px] bg-surface-card border border-border-subtle shadow-xl z-50 py-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Section 1: User Identity Header */}
          <div className="px-4 py-3 border-b border-border-subtle bg-surface-muted/20">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-text-primary truncate">
                {user?.fullName || user?.username || 'System User'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-status-success font-medium shrink-0">
                <CheckCircle size={10} /> Active
              </span>
            </div>
            <div className="text-[11px] text-text-muted truncate mt-0.5">
              {user?.email || `${user?.username || 'user'}@garmentiqerp.com`}
            </div>
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-[2px] bg-brand-accent/10 text-brand-accent border border-brand-accent/20 uppercase">
                {primaryRoleCode.replace(/_/g, ' ')}
              </span>
              {user?.designation && (
                <span className="text-[10px] text-text-muted font-medium truncate">
                  • {user.designation}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Essential Actions (Profile First) */}
          <div className="p-1 space-y-0.5">
            {/* My Profile Action */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/app/admin/profile');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary rounded-[4px] hover:bg-surface-hover hover:text-brand-accent transition-colors text-left cursor-pointer"
            >
              <User size={14} className="text-brand-accent shrink-0" />
              <span>My Profile & Preferences</span>
            </button>
          </div>

          {/* Section 3: Clean Sign Out Button */}
          <div className="pt-1 mt-1 border-t border-border-subtle p-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-status-danger rounded-[4px] hover:bg-status-danger-bg transition-colors text-left cursor-pointer"
            >
              <LogOut size={14} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavDropdown;
