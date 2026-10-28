/**
 * =============================================================================
 * [EN] Executive Profile Identity Card Component (ProfileIdentityCard.tsx)
 * [BN] এক্সিকিউটিভ প্রোফাইল আইডেন্টিটি কার্ড কম্পোনেন্ট (ProfileIdentityCard.tsx)
 * =============================================================================
 * [EN] Rules: Rule 05 (Zero Static Data), Rule 07 (<300 lines), Rule 15 (Bilingual),
 *             Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] ১০০% ডাইনামিক ডেটাবেজ-চালিত ইউজারের প্রাতিষ্ঠানিক তথ্য ও অ্যাকাউন্ট বিবরণী।
 */

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Copy,
  Check,
  Building2,
  IdCard,
  UserCheck,
  Shield,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { Badge } from '@/components/ui/Badge';

export const ProfileIdentityCard: React.FC = () => {
  const { user } = useAuthStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (!navigator.clipboard || !text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.info('Copied');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const userRoles = user?.roles && user.roles.length > 0 ? user.roles : ['ROLE_USER'];

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Account Details Grid */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <UserCheck size={15} className="text-brand-accent" />
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Corporate Credentials
            </h2>
          </div>
          <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'warning'}>
            {user?.status || 'ACTIVE'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Full Name */}
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle space-y-0.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block">
              Full Name
            </span>
            <span className="font-semibold text-text-primary text-xs block">
              {user?.fullName || user?.username || '—'}
            </span>
          </div>

          {/* Username */}
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle space-y-0.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block">
              Username
            </span>
            <span className="font-mono font-semibold text-text-primary text-xs block">
              @{user?.username || '—'}
            </span>
          </div>

          {/* Email Address */}
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle flex items-center justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
                <Mail size={11} className="text-brand-accent" />
                <span>Email</span>
              </span>
              <span className="font-semibold text-text-primary text-xs truncate block">
                {user?.email || '—'}
              </span>
            </div>
            {user?.email && (
              <button
                type="button"
                onClick={() => copyToClipboard(user.email, 'email')}
                className="p-1 rounded text-text-muted hover:text-text-primary cursor-pointer shrink-0"
                title="Copy email"
              >
                {copiedKey === 'email' ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
              </button>
            )}
          </div>

          {/* Phone Number */}
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle space-y-0.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
              <Phone size={11} className="text-brand-accent" />
              <span>Contact Phone</span>
            </span>
            <span className="font-mono text-text-primary text-xs block">
              {user?.phone || 'Not Specified'}
            </span>
          </div>

          {/* Corporate Designation */}
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle space-y-0.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block">
              Designation
            </span>
            <span className="font-semibold text-text-primary text-xs block">
              {user?.designation || 'Factory Operator'}
            </span>
          </div>

          {/* Punch/RFID Card No */}
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle space-y-0.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
              <IdCard size={11} className="text-brand-accent" />
              <span>Employee Card ID</span>
            </span>
            <span className="font-mono font-bold text-text-primary text-xs block">
              {user?.employeeCardNo || 'Not Assigned'}
            </span>
          </div>
        </div>

        {/* Factory Tenant Scope */}
        <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
              <Building2 size={11} className="text-brand-accent" />
              <span>Factory Tenant Scope</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary text-xs">
                {user?.tenantName || 'Platform Root'}
              </span>
              {user?.tenantCode && (
                <span className="px-1.5 py-0.2 rounded bg-surface-muted text-[10px] font-mono font-bold text-text-secondary border border-border-subtle">
                  {user.tenantCode}
                </span>
              )}
            </div>
          </div>
          {user?.tenantId && (
            <button
              type="button"
              onClick={() => copyToClipboard(user.tenantId, 'tenantId')}
              className="p-1 rounded text-text-muted hover:text-text-primary cursor-pointer shrink-0"
              title="Copy Tenant UUID"
            >
              {copiedKey === 'tenantId' ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
            </button>
          )}
        </div>

        {/* Assigned Roles Strip */}
        <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle space-y-1.5 text-xs">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
            <Shield size={11} className="text-brand-accent" />
            <span>Assigned Security Roles</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {userRoles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono font-bold tracking-wider bg-brand-accent/10 text-brand-accent border border-brand-accent/25 uppercase"
              >
                {role.replace(/^ROLE_/, '').replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Audit Timestamps */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock size={12} className="text-brand-accent shrink-0" />
            <span>Created: {formatDate(user?.createdAt)}</span>
          </span>
          {user?.updatedAt && (
            <span className="font-mono text-[11px]">
              Last Modified: {formatDate(user.updatedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileIdentityCard;
