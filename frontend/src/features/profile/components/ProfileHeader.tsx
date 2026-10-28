/**
 * =============================================================================
 * [EN] Executive Profile Header Component (ProfileHeader.tsx)
 * [BN] এক্সিকিউটিভ প্রোফাইল হেডার কম্পোনেন্ট (ProfileHeader.tsx)
 * =============================================================================
 * [EN] Rules: Rule 05 (Dynamic Data), Rule 07 (<300 lines), Rule 15 (Bilingual),
 *             Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] সোশ্যাল কভারহীন কমপ্যাক্ট এক্সিকিউটিভ আইডেন্টিটি স্ট্রিপ (১০০% ডাইনামিক ডেটা)।
 */

import React from 'react';
import { Shield, Building2, Calendar, IdCard } from 'lucide-react';
import { useAuthStore } from '@/store';
import { Badge } from '@/components/ui/Badge';

export const ProfileHeader: React.FC = () => {
  const { user } = useAuthStore();

  const getInitials = (): string => {
    if (!user?.fullName) return (user?.username?.substring(0, 2) || 'US').toUpperCase();
    const parts = user.fullName.trim().split(/\s+/);
    return `${parts[0]?.charAt(0) || ''}${parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : ''}`.toUpperCase();
  };

  const primaryRole = user?.roles?.[0]?.replace(/^ROLE_/, '').replace(/_/g, ' ') || 'USER';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Oct 2026';

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar & Identity Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Executive Avatar with Status Dot */}
          <div className="relative shrink-0">
            <div className="h-14 w-14 rounded-[6px] bg-brand-accent/10 border border-brand-accent/30 text-brand-accent flex items-center justify-center font-bold text-lg select-none shadow-2xs">
              {getInitials()}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-surface-card ${
                user?.status === 'ACTIVE' ? 'bg-status-success' : 'bg-status-warning'
              }`}
              title={user?.status || 'ACTIVE'}
            />
          </div>

          {/* User Details */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-text-primary tracking-tight truncate">
                {user?.fullName || user?.username || 'System User'}
              </h1>
              <span className="font-mono text-xs text-text-muted">(@{user?.username})</span>
              <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'warning'}>
                {user?.status || 'ACTIVE'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
              {user?.designation && (
                <span className="text-text-secondary font-medium">{user.designation}</span>
              )}
              <span className="flex items-center gap-1">
                <Building2 size={12} className="text-brand-accent shrink-0" />
                <span>{user?.tenantName || user?.tenantCode || 'Factory Workspace'}</span>
              </span>
              {user?.employeeCardNo && (
                <span className="flex items-center gap-1 font-mono text-[11px] text-text-secondary">
                  <IdCard size={12} className="text-text-muted shrink-0" />
                  <span>Card: {user.employeeCardNo}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Role & Membership Metadata */}
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle/50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono font-bold tracking-wider bg-brand-accent/10 text-brand-accent border border-brand-accent/25 uppercase flex items-center gap-1">
              <Shield size={11} />
              <span>{primaryRole}</span>
            </span>
          </div>
          <span className="text-[11px] text-text-muted flex items-center gap-1">
            <Calendar size={11} />
            <span>Member since {memberSince}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
