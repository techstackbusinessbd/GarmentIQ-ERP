/**
 * =============================================================================
 * [EN] Executive Assigned Roles & Access Permissions Tab (ProfileRolesTab.tsx)
 * [BN] ব্যবহারকারীর অর্পিত ভূমিকা ও মডিউল পারমিশনস ট্যাব (ProfileRolesTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] সক্রিয় ইউজারের দায়িত্ব, অনুমোদিত রোল ও বাউন্ডেড কনটেক্সট পারমিশন ক্লিয়ারেন্স ভিউ।
 */

import React from 'react';
import {
  ShieldCheck,
  Shield,
  Layers,
  Lock,
  CheckCircle2,
  Building2,
  Key,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { usePermission } from '@/features/privileges/hooks/usePermission';
import { Badge } from '@/components/ui';

interface BoundedContextPermission {
  readonly id: string;
  readonly domainName: string;
  readonly scope: string;
  readonly accessLevel: 'FULL_CONTROL' | 'OPERATIONAL' | 'READ_ONLY' | 'RESTRICTED';
  readonly description: string;
}

const BOUNDED_CONTEXTS: readonly BoundedContextPermission[] = [
  {
    id: 'ctx-admin',
    domainName: 'Domain 00: Foundation & System Administration',
    scope: 'Multi-Tenant, User Accounts, Role Matrix, Global Config',
    accessLevel: 'FULL_CONTROL',
    description: 'Create, modify, and revoke enterprise users and platform parameters.',
  },
  {
    id: 'ctx-merch',
    domainName: 'Domain 01: Merchandising & Buyer Order (O2S)',
    scope: 'Tech Pack, Consumption BOM, Costing Sheets, PO Tracking',
    accessLevel: 'FULL_CONTROL',
    description: 'Approve buyer purchase orders and issue master production allocations.',
  },
  {
    id: 'ctx-cut',
    domainName: 'Domain 02: Fabric Sourcing & Smart Cutting',
    scope: 'Fabric Shrinkage, CAD Markers, Cut Bundle RFID Generation',
    accessLevel: 'OPERATIONAL',
    description: 'Execute cutting lay plans and monitor fabric roll utilization.',
  },
  {
    id: 'ctx-sew',
    domainName: 'Domain 03: Industrial Sewing Floor Operations',
    scope: 'Line Balancing, Realtime Hourly Output, RFID Bundle Scan',
    accessLevel: 'OPERATIONAL',
    description: 'Track shop floor WIP and production operator target metrics.',
  },
  {
    id: 'ctx-wash',
    domainName: 'Domain 04: Industrial Laundry & Denim Washing',
    scope: 'Dry & Wet Wash Recipes, Garment Dyeing, Chemical Consumption',
    accessLevel: 'OPERATIONAL',
    description: 'Monitor laundry batch cycle time and wash quality approvals.',
  },
  {
    id: 'ctx-export',
    domainName: 'Domain 05: Commercial Export & Container Shipment',
    scope: 'Carton Packing Matrix, Commercial Invoice, Customs BL Dispatch',
    accessLevel: 'FULL_CONTROL',
    description: 'Authorize container gate pass and generate final export packing lists.',
  },
];

export const ProfileRolesTab: React.FC = () => {
  const { user } = useAuthStore();
  const { isSuperAdmin } = usePermission();

  const userRoles = user?.roles && user.roles.length > 0 ? user.roles : ['ROLE_SUPER_ADMIN'];

  const getAccessBadgeVariant = (level: BoundedContextPermission['accessLevel']) => {
    switch (level) {
      case 'FULL_CONTROL':
        return 'success';
      case 'OPERATIONAL':
        return 'accent';
      case 'READ_ONLY':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getAccessBadgeLabel = (level: BoundedContextPermission['accessLevel']) => {
    switch (level) {
      case 'FULL_CONTROL':
        return 'Full Control';
      case 'OPERATIONAL':
        return 'Operational R/W';
      case 'READ_ONLY':
        return 'Audit Read-Only';
      default:
        return 'Restricted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="bg-surface-card border border-border-subtle rounded-[8px] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[4px] bg-brand-accent/10 text-brand-accent flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                System Authorizations & Security Tier
              </h2>
              <p className="text-[11px] text-text-muted">
                Effective Role-Based Access Control (RBAC) privileges granted to your account.
              </p>
            </div>
          </div>
          <Badge variant={isSuperAdmin ? 'success' : 'accent'}>
            {isSuperAdmin ? 'Tier 1 Global Authority' : 'Enterprise Operator'}
          </Badge>
        </div>

        {/* Roles List */}
        <div className="space-y-3">
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
            Assigned Enterprise Roles ({userRoles.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userRoles.map((role) => {
              const formattedRole = role.replace(/^ROLE_/, '').replace(/_/g, ' ');
              return (
                <div
                  key={role}
                  className="p-3 rounded-[6px] bg-surface-muted/30 border border-border-subtle flex items-start gap-2.5"
                >
                  <span className="p-1.5 rounded-[4px] bg-brand-accent/15 text-brand-accent shrink-0 mt-0.5">
                    <Key size={14} />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-text-primary block font-mono">
                      {formattedRole}
                    </span>
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      Directly assigned by Tenant Administrator
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Baseline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle">
            <span className="text-[10px] text-text-muted font-medium block">Authentication Scheme</span>
            <span className="font-mono text-xs font-bold text-text-primary mt-0.5 flex items-center gap-1.5">
              <Lock size={12} className="text-status-success" />
              <span>JWT Bearer (HMAC-SHA256)</span>
            </span>
          </div>

          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle">
            <span className="text-[10px] text-text-muted font-medium block">Multi-Factor Readiness</span>
            <span className="font-mono text-xs font-bold text-text-primary mt-0.5 flex items-center gap-1.5">
              <Shield size={12} className="text-brand-accent" />
              <span>TOTP Authenticator Ready</span>
            </span>
          </div>

          <div className="p-3 rounded-[4px] bg-surface-base border border-border-subtle">
            <span className="text-[10px] text-text-muted font-medium block">Data Isolation Policy</span>
            <span className="font-mono text-xs font-bold text-text-primary mt-0.5 flex items-center gap-1.5">
              <Building2 size={12} className="text-status-info" />
              <span>Tenant Row-Level Security</span>
            </span>
          </div>
        </div>
      </div>

      {/* Domain Access Matrix Table */}
      <div className="bg-surface-card border border-border-subtle rounded-[8px] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[4px] bg-status-info-bg text-status-info flex items-center justify-center">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Operational Bounded Context Clearance
              </h3>
              <p className="text-[11px] text-text-muted">
                Your account clearance level across all 11 core garment manufacturing domains.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {isSuperAdmin ? 'Unrestricted Super Admin' : 'Filtered RBAC'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-muted/30 text-text-secondary text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Manufacturing Domain</th>
                <th className="py-2.5 px-3 font-semibold">Operational Scope</th>
                <th className="py-2.5 px-3 font-semibold">Effective Clearance</th>
                <th className="py-2.5 px-3 font-semibold">Privilege Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {BOUNDED_CONTEXTS.map((ctx) => (
                <tr key={ctx.id} className="hover:bg-surface-muted/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-text-primary flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-status-success shrink-0" />
                    <span>{ctx.domainName}</span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary text-[11px] font-mono">
                    {ctx.scope}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={getAccessBadgeVariant(ctx.accessLevel)}>
                      {getAccessBadgeLabel(ctx.accessLevel)}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-text-muted text-[11px]">
                    {ctx.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileRolesTab;
