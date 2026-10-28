/**
 * =============================================================================
 * [EN] Master-Detail Module Header Row Component (MasterDetailModuleHeader.tsx)
 * [BN] মাস্টার-ডিটেল মডিউল হেডার রো কম্পোনেন্ট (MasterDetailModuleHeader.tsx)
 * =============================================================================
 * [EN] Reference: Grouping banner for modules with bulk module-level actions
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] মডিউল হেডার ব্যানার: কলাপসিবল অ্যাকর্ডিয়ন ও এক ক্লিকে সম্পূর্ণ মডিউল ক্লিয়ারেন্স কন্ট্রোল।
 */

import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  Settings,
  BookOpen,
  Layers,
  Sparkles,
  Eye,
  ChevronDown,
} from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';
import { Badge } from '@/components/ui/Badge';

export interface MasterDetailModuleHeaderProps {
  readonly module: MatrixModuleDef;
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly isCollapsed?: boolean;
  readonly onToggleCollapse?: (moduleId: string) => void;
  readonly onSetModulePermissions: (allCodes: readonly string[], grantCodes: readonly string[]) => void;
}

const getModuleIcon = (moduleId: string) => {
  switch (moduleId) {
    case 'user_mgmt': return <Users size={14} />;
    case 'client_mgmt': return <Building2 size={14} />;
    case 'role_mgmt': return <ShieldCheck size={14} />;
    case 'settings_mgmt': return <Settings size={14} />;
    case 'library_mgmt': return <BookOpen size={14} />;
    default: return <Layers size={14} />;
  }
};

export const MasterDetailModuleHeader: React.FC<MasterDetailModuleHeaderProps> = ({
  module,
  activePermissions,
  isSuperAdmin,
  isCollapsed = false,
  onToggleCollapse,
  onSetModulePermissions,
}) => {
  // Aggregate all permission codes for all features under this module
  const { allModuleCodes, readOnlyModuleCodes } = useMemo(() => {
    const all: string[] = [];
    const readOnly: string[] = [];

    module.features.forEach((feature) => {
      Object.entries(feature.actions).forEach(([key, act]) => {
        if (!act) return;
        if (!all.includes(act.code)) all.push(act.code);
        if (key === 'menu' || key === 'view') {
          if (!readOnly.includes(act.code)) readOnly.push(act.code);
        }
      });
    });

    return { allModuleCodes: all, readOnlyModuleCodes: readOnly };
  }, [module.features]);

  const grantedInModule = useMemo(() => {
    if (isSuperAdmin) return allModuleCodes.length;
    return allModuleCodes.filter((code) => activePermissions.has(code)).length;
  }, [isSuperAdmin, allModuleCodes, activePermissions]);

  const totalInModule = allModuleCodes.length;

  const handleApplyFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSuperAdmin) return;
    onSetModulePermissions(allModuleCodes, allModuleCodes);
  };

  const handleApplyReadOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSuperAdmin) return;
    onSetModulePermissions(allModuleCodes, readOnlyModuleCodes);
  };

  const handleApplyNone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSuperAdmin) return;
    onSetModulePermissions(allModuleCodes, []);
  };

  return (
    <tr
      onClick={() => onToggleCollapse?.(module.id)}
      className="bg-surface-muted/70 hover:bg-surface-muted border-t-2 border-b border-border-subtle/80 text-text-primary border-l-4 border-l-accent cursor-pointer transition-colors select-none"
    >
      {/* Module Title & Chevron */}
      <td colSpan={3} className="p-2 px-3 align-middle">
        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <ChevronDown
              size={14}
              className={`text-text-muted transition-transform duration-200 shrink-0 ${
                isCollapsed ? '-rotate-90' : ''
              }`}
            />
          )}

          <div className="w-6 h-6 rounded-[4px] bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            {getModuleIcon(module.id)}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-text-primary font-mono">
            {module.name}
          </span>

          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-card border border-border-subtle text-text-muted">
            {module.features.length}
          </span>
        </div>
      </td>

      {/* Module Bulk Action Buttons & Status (Ultra-Minimal) */}
      <td colSpan={2} className="p-2 px-3 align-middle text-right">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={handleApplyFull}
              className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-text-secondary hover:text-text-primary bg-surface-card border border-border-subtle transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-0.5 shadow-2xs"
            >
              <Sparkles size={9} className="text-accent" />
              <span>Full</span>
            </button>

            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={handleApplyReadOnly}
              className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-text-secondary hover:text-text-primary bg-surface-card border border-border-subtle transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-0.5 shadow-2xs"
            >
              <Eye size={9} className="text-info" />
              <span>Read</span>
            </button>

            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={handleApplyNone}
              className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-text-secondary hover:text-danger bg-surface-card border border-border-subtle transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              None
            </button>
          </div>

          <Badge
            variant={
              grantedInModule === totalInModule
                ? 'success'
                : grantedInModule === 0
                ? 'neutral'
                : 'warning'
            }
            dot
          >
            {grantedInModule === totalInModule
              ? `Full (${grantedInModule}/${totalInModule})`
              : grantedInModule === 0
              ? `None (0/${totalInModule})`
              : `Partial (${grantedInModule}/${totalInModule})`}
          </Badge>
        </div>
      </td>
    </tr>
  );
};
