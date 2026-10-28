/**
 * =============================================================================
 * [EN] Enterprise User Live Identity Preview Card (UserPreviewCard)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী লাইভ আইডেন্টিটি প্রিভিউ কার্ড (UserPreviewCard)
 * =============================================================================
 * [EN] Reference: Approved UI/UX Specification by CTO (2026-10-21)
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] নতুন ইউজার তৈরির সময় রিয়েল-টাইম প্রোফাইল অবতার, পদবী ও পারমিশন প্রিভিউ।
 */

import React from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Lock,
  UserPlus,
  Save,
  CheckCircle2,
  IdCard,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { UserStatus } from '@/types';
import { ENTERPRISE_ROLES, ROLE_MAP } from '../constants/roleConstants';

/**
 * [EN] Properties contract for UserPreviewCard.
 * [BN] UserPreviewCard কম্পোনেন্টের প্রপার্টিজ ইন্টারফেস।
 */
export interface UserPreviewCardProps {
  readonly fullName: string;
  readonly username: string;
  readonly email: string;
  readonly designation: string;
  readonly phone: string;
  readonly employeeCardNo?: string;
  readonly tenantName?: string;
  readonly tenantCode?: string;
  readonly status: UserStatus;
  readonly selectedRoles: readonly string[];
  readonly isSubmitting: boolean;
  readonly isEditing: boolean;
  readonly onCancel: () => void;
  readonly submitFormId: string;
}

/**
 * [EN] Computes user initials from full name or username.
 * [BN] পুরো নাম বা ইউজারনেম থেকে নামের আদ্যক্ষর তৈরি।
 */
function getInitials(name: string, fallback: string): string {
  const clean = name.trim();
  if (!clean) {
    return fallback.slice(0, 2).toUpperCase() || 'NU';
  }
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) || 'NU').toUpperCase();
  }
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
}

/**
 * [EN] Live Enterprise Identity & Privilege Preview Card.
 * [BN] রিয়েল-টাইম এন্টারপ্রাইজ আইডেন্টিটি ও প্রিভিলেজ প্রিভিউ কার্ড।
 */
export const UserPreviewCard: React.FC<UserPreviewCardProps> = ({
  fullName,
  username,
  email,
  designation,
  phone,
  employeeCardNo = '',
  tenantName,
  tenantCode,
  status,
  selectedRoles,
  isSubmitting,
  isEditing,
  onCancel,
  submitFormId,
}) => {
  const initials = getInitials(fullName, username);
  const displayName = fullName.trim() || 'New Team Member';
  const displayUsername = username.trim() ? `@${username.trim()}` : '@pending.username';
  const displayDesignation = designation.trim() || 'Factory Operations';

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs sticky top-28 space-y-5">
      {/* Card Header Label */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-1.5 text-text-muted">
          <UserIcon size={14} className="text-brand-accent" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary">
            Live Identity Preview
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-status-success-bg text-status-success text-[10px] font-semibold border border-status-success-border font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          <span>{status}</span>
        </span>
      </div>

      {/* Hero Avatar & Identity Section */}
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-brand-accent to-blue-700 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 ring-2 ring-brand-accent/20">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-text-primary truncate">
            {displayName}
          </h3>
          <p className="text-xs font-mono text-brand-accent truncate">
            {displayUsername}
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
            <Briefcase size={11} className="shrink-0" />
            <span className="truncate">{displayDesignation}</span>
          </div>
        </div>
      </div>

      {/* Contact Metadata Block */}
      <div className="p-3 bg-surface-muted/30 border border-border-subtle rounded-[4px] space-y-2 text-xs">
        {tenantName && (
          <div className="flex items-center gap-2 text-text-primary min-w-0 font-medium text-[11px] pb-1.5 border-b border-border-subtle/50">
            <Building2 size={13} className="shrink-0 text-brand-accent" />
            <span className="truncate">
              {tenantName} {tenantCode ? `(${tenantCode})` : ''}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-text-muted min-w-0">
          <Mail size={12} className="shrink-0 text-text-muted" />
          <span className="truncate text-text-primary">
            {email.trim() || 'user@factory.com'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-muted min-w-0 font-mono text-[11px]">
          <Phone size={12} className="shrink-0 text-text-muted" />
          <span className="truncate text-text-primary">
            {phone.trim() || '+880 1700-000000'}
          </span>
        </div>
        {employeeCardNo.trim() && (
          <div className="flex items-center gap-2 text-brand-accent min-w-0 font-mono text-[11px] pt-1 border-t border-border-subtle/40">
            <IdCard size={12} className="shrink-0 text-brand-accent" />
            <span className="truncate font-semibold">
              ID: {employeeCardNo.trim()}
            </span>
          </div>
        )}
      </div>

      {/* Granted Roles & Scopes */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-primary flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-brand-accent" />
            <span>Assigned Authorities</span>
          </span>
          <span className="font-mono text-[10px] text-text-muted">
            {selectedRoles.length} / {ENTERPRISE_ROLES.length}
          </span>
        </div>

        {selectedRoles.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {selectedRoles.map((code) => {
              const def = ROLE_MAP[code];
              return (
                <span
                  key={code}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-[3px] bg-brand-accent-light text-brand-accent border border-brand-accent/20"
                >
                  <CheckCircle2 size={10} />
                  <span>{def?.name || code}</span>
                </span>
              );
            })}
          </div>
        ) : (
          <div className="p-2.5 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-[4px] bg-surface-base">
            No system roles assigned yet
          </div>
        )}
      </div>

      {/* Compliance Notice */}
      <div className="p-2.5 bg-surface-base border border-border-subtle rounded-[4px] flex items-start gap-2 text-[11px] text-text-muted">
        <Lock size={13} className="shrink-0 text-brand-accent mt-0.5" />
        <p className="leading-tight">
          Role-Based Access Control enforced. All administrative actions are securely logged in the audit trail.
        </p>
      </div>

      {/* Primary Actions Group */}
      <div className="pt-2 border-t border-border-subtle space-y-2">
        <Button
          type="submit"
          form={submitFormId}
          disabled={isSubmitting}
          className="w-full"
          variant="primary"
          icon={isEditing ? <Save size={14} /> : <UserPlus size={14} />}
        >
          {isSubmitting ? 'Saving' : 'Save'}
        </Button>

        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full"
          variant="secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UserPreviewCard;
