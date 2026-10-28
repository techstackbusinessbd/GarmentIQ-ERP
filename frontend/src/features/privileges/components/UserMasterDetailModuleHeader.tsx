/**
 * =============================================================================
 * [EN] User Master-Detail Module Header Component (UserMasterDetailModuleHeader.tsx)
 * [BN] ব্যবহারকারী মাস্টার-ডিটেল মডিউল হেডার কম্পোনেন্ট (UserMasterDetailModuleHeader.tsx)
 * =============================================================================
 * [EN] Reference: Grouping banner for modules in user custom overrides matrix
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 28/29 (Microcopy)
 * [BN] ব্যবহারকারী ম্যাট্রিক্সের মডিউল ব্যানার: সাব-ফিচার সমূহের প্যারেন্ট গ্রুপ ও মডিউল রিসেট।
 */

import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  Settings,
  BookOpen,
  Layers,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import type { MatrixModuleDef } from '../constants/accessMatrixTypes';

export interface UserMasterDetailModuleHeaderProps {
  readonly module: MatrixModuleDef;
  readonly customGrants: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly isCollapsed?: boolean;
  readonly onToggleCollapse?: (moduleId: string) => void;
  readonly onResetModule: (allCodes: readonly string[]) => void;
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

export const UserMasterDetailModuleHeader: React.FC<UserMasterDetailModuleHeaderProps> = ({
  module,
  customGrants,
  isSuperAdmin,
  isCollapsed = false,
  onToggleCollapse,
  onResetModule,
}) => {
  const allModuleCodes = useMemo(() => {
    const codes: string[] = [];
    module.features.forEach((feature) => {
      Object.values(feature.actions).forEach((act) => {
        if (act && !codes.includes(act.code)) codes.push(act.code);
      });
    });
    return codes;
  }, [module.features]);

  const moduleOverrideCount = useMemo(() => {
    return allModuleCodes.filter((c) => customGrants.has(c)).length;
  }, [allModuleCodes, customGrants]);

  return (
    <tr
      onClick={() => onToggleCollapse?.(module.id)}
      className="bg-surface-muted/70 hover:bg-surface-muted border-t-2 border-b border-border-subtle/80 text-text-primary border-l-4 border-l-brand-accent cursor-pointer transition-colors select-none"
    >
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

          <div className="w-6 h-6 rounded-[4px] bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0">
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

      <td colSpan={2} className="p-2 px-3 align-middle text-right">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {moduleOverrideCount > 0 ? (
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                +{moduleOverrideCount}
              </span>
              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onResetModule(allModuleCodes)}
                className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer disabled:opacity-40"
                title="Reset overrides"
              >
                <RotateCcw size={9} />
                <span>Reset</span>
              </button>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-text-muted/60">
              Baseline
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};
