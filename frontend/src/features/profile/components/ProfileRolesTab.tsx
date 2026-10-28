/**
 * =============================================================================
 * [EN] User Assigned Roles & Active Permissions Tab (ProfileRolesTab.tsx)
 * [BN] ব্যবহারকারীর অর্পিত ভূমিকা ও সক্রিয় পারমিশনস ট্যাব (ProfileRolesTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 05 (Zero Static Data), Rule 07 (<300 lines), Rule 15 (Bilingual),
 *             Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] ১০০% ডায়নামিক ও সত্য তথ্য: ডাটাবেজ থেকে ইউজারের কার্যকর রোল ও প্রিভিলেজ ক্যাটালগ ভিউ।
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Shield,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { usePermission } from '@/features/privileges/hooks/usePermission';
import { usePermissionCatalog } from '@/features/privileges/hooks/usePermissionCatalog';
import { Badge } from '@/components/ui/Badge';

export const ProfileRolesTab: React.FC = () => {
  const { user } = useAuthStore();
  const { isSuperAdmin, permissions: userPerms } = usePermission();
  const { data: catalog = [], isLoading } = usePermissionCatalog();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const assignedRoles = user?.roles && user.roles.length > 0 ? user.roles : ['ROLE_USER'];

  // Flatten all catalog features & actions to check user access
  const resolvedPermissions = useMemo(() => {
    const list: { code: string; label: string; module: string; feature: string; isGranted: boolean }[] = [];

    catalog.forEach((domain) => {
      domain.modules.forEach((mod) => {
        mod.features.forEach((feat) => {
          Object.entries(feat.actions).forEach(([, act]) => {
            if (!act) return;
            const granted = isSuperAdmin || (userPerms && userPerms.has(act.code));
            list.push({
              code: act.code,
              label: act.label,
              module: mod.name,
              feature: feat.name,
              isGranted: Boolean(granted),
            });
          });
        });
      });
    });

    return list;
  }, [catalog, isSuperAdmin, userPerms]);

  const grantedCount = useMemo(() => {
    if (isSuperAdmin) return resolvedPermissions.length;
    return resolvedPermissions.filter((p) => p.isGranted).length;
  }, [resolvedPermissions, isSuperAdmin]);

  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return resolvedPermissions;
    const q = searchQuery.toLowerCase();
    return resolvedPermissions.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.feature.toLowerCase().includes(q) ||
        p.module.toLowerCase().includes(q)
    );
  }, [resolvedPermissions, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 1. Assigned Roles Banner */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-brand-accent" />
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Assigned Security Roles
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {assignedRoles.length} Active Role{assignedRoles.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {assignedRoles.map((role) => {
            const isSuper = role === 'ROLE_SUPER_ADMIN';
            return (
              <div
                key={role}
                className="p-3 rounded-[4px] bg-surface-base border border-border-subtle flex items-center gap-3 min-w-[200px]"
              >
                <div
                  className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 ${
                    isSuper
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-brand-accent/15 text-brand-accent'
                  }`}
                >
                  {isSuper ? <Lock size={13} /> : <Shield size={13} />}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-text-primary text-xs block">
                    {role.replace(/^ROLE_/, '').replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted block">
                    {role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Effective Functional Permissions Grid */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Effective Permissions
            </h3>
            <Badge variant="success">
              {grantedCount} of {resolvedPermissions.length} Granted
            </Badge>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter permissions..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-base border border-border-subtle rounded-[4px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-accent shadow-2xs font-mono"
            />
          </div>
        </div>

        {/* Permissions Table / List */}
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading permissions catalog...</div>
        ) : filteredPermissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">No permissions match search filter</div>
        ) : (
          <div className="max-h-96 overflow-y-auto divide-y divide-border-subtle/50 scrollbar-thin rounded-[4px] border border-border-subtle">
            {filteredPermissions.map((p) => (
              <div
                key={p.code}
                className="p-2.5 flex items-center justify-between gap-3 text-xs bg-surface-card hover:bg-surface-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-primary">{p.code}</span>
                    <span className="text-[10px] text-text-muted font-medium">• {p.feature}</span>
                  </div>
                  <span className="text-[11px] text-text-muted block mt-0.5">{p.module}</span>
                </div>

                <div className="shrink-0">
                  {p.isGranted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success bg-status-success-bg px-2 py-0.5 rounded-[3px] border border-status-success-border">
                      <CheckCircle2 size={11} /> Granted
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-text-muted">Restricted</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileRolesTab;
