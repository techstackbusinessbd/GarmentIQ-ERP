/**
 * =============================================================================
 * [EN] Executive Profile Identity & Authorization Card (ProfileIdentityCard.tsx)
 * [BN] এক্সিকিউটিভ প্রোফাইল আইডেন্টিটি ও অনুমতি কার্ড
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] কর্পোরেট ক্রেডেনশিয়াল, ডিপার্টমেন্ট, পারমিশন বিবরণ ও সুরক্ষিত সেশন সাইনআউট কার্ড।
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Copy,
  Check,
  Shield,
  Building2,
  Lock,
  LogOut,
  BadgeCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';

/**
 * [EN] Corporate Profile Identity & Authorization Card Component.
 * [BN] ব্যবহারকারীর কর্পোরেট পরিচয় ও সিস্টেম অথোরাইজেশন কার্ড।
 */
export const ProfileIdentityCard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const userEmail = user?.email || `${user?.username || 'admin'}@garmentiqerp.com`;
  const tenantId = user?.tenantId || '019472ba-0e00-7000-8800-000000000000';

  return (
    <div className="space-y-5">
      {/* =====================================================================
       * [EN] Corporate Credentials Card
       * [BN] কর্পোরেট ক্রেডেনশিয়াল কার্ড
       * ===================================================================== */}
      <div className="bg-surface-card border border-border-subtle rounded-[8px] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <BadgeCheck size={14} className="text-brand-accent" />
            <span>Corporate Credentials</span>
          </h2>
          <span className="text-[10px] font-mono text-text-muted">Verified Enterprise Profile</span>
        </div>

        {/* Credential Fields List */}
        <div className="space-y-3 text-xs">
          {/* Corporate Email */}
          <div className="p-2.5 rounded-[4px] bg-surface-muted/40 border border-border-subtle/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail size={15} className="text-brand-accent shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-text-muted font-medium block">Corporate Email</span>
                <span className="font-semibold text-text-primary truncate block">{userEmail}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(userEmail, 'Email')}
              className="p-1 rounded-[3px] text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer shrink-0"
              title="Copy Email"
            >
              {copiedField === 'Email' ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
            </button>
          </div>

          {/* Employee Code & Department */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-[4px] bg-surface-muted/40 border border-border-subtle/70">
              <span className="text-[10px] text-text-muted font-medium block">Employee Code</span>
              <span className="font-mono font-bold text-text-primary text-xs mt-0.5 block">255776</span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-surface-muted/40 border border-border-subtle/70">
              <span className="text-[10px] text-text-muted font-medium block">Department</span>
              <span className="font-semibold text-text-primary text-xs mt-0.5 truncate block">Technology & IT</span>
            </div>
          </div>

          {/* Assigned Roles & Permissions */}
          <div className="p-2.5 rounded-[4px] bg-surface-muted/40 border border-border-subtle/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-medium flex items-center gap-1.5">
                <Shield size={12} className="text-brand-accent" />
                <span>System Authorizations</span>
              </span>
              <span className="text-[10px] font-mono text-status-success font-semibold">Tier 1 Full Access</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {(user?.roles && user.roles.length > 0 ? user.roles : ['ROLE_SUPER_ADMIN']).map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono font-bold tracking-wider bg-brand-accent/15 text-brand-accent border border-brand-accent/25 uppercase"
                >
                  {role.replace(/^ROLE_/, '').replace(/_/g, ' ')}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-semibold bg-surface-card text-text-secondary border border-border-subtle">
                BOM & Costing Approval
              </span>
              <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-semibold bg-surface-card text-text-secondary border border-border-subtle">
                Shop Floor Overwrite
              </span>
            </div>
          </div>

          {/* Factory Tenant Scope */}
          <div className="p-2.5 rounded-[4px] bg-surface-muted/40 border border-border-subtle/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 size={15} className="text-text-muted shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-text-muted font-medium block">Active Factory Tenant Scope</span>
                <span className="font-mono text-text-primary text-[11px] truncate block">{tenantId}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(tenantId, 'Tenant ID')}
              className="p-1 rounded-[3px] text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer shrink-0"
              title="Copy Tenant ID"
            >
              {copiedField === 'Tenant ID' ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * [EN] Enterprise Session Security & Safe Sign Out
       * [BN] এন্টারপ্রাইজ সেশন সিকিউরিটি ও নিরাপদ সাইন আউট কার্ড
       * ===================================================================== */}
      <div className="bg-surface-card border border-border-subtle rounded-[8px] p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Lock size={13} className="text-status-success" />
            <span>Session Protection</span>
          </h3>
          <span className="h-2 w-2 rounded-full bg-status-success" />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-text-muted">Browser Session Anchor</span>
            <span className="font-mono text-status-success font-semibold text-[11px]">Enforced (RFC 6265)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-border-subtle/50">
            <span className="text-text-muted">Cross-Tab Realtime Sync</span>
            <span className="font-mono text-brand-accent font-semibold text-[11px]">Broadcast Active</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-border-subtle/50">
            <span className="text-text-muted">Auto-Logout on Browser Exit</span>
            <span className="font-mono text-status-success font-semibold text-[11px]">Enabled</span>
          </div>
        </div>

        {/* Safe Sign Out Button Placed at Bottom of Security Card */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-status-danger bg-status-danger-bg hover:bg-status-danger/15 border border-status-danger-border rounded-[4px] transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileIdentityCard;
