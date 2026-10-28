/**
 * =============================================================================
 * [EN] Role Permission Selector Component (RolePermissionSelector.tsx)
 * [BN] রোল পারমিশন ক্যাটালগ সিলেক্টর কম্পোনেন্ট (রুল ০৭ ও ২১)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 */

import React from 'react';
import { Check } from 'lucide-react';
import type { MatrixDomainDef, MatrixActionDef } from '../constants/accessMatrixTypes';

export interface RolePermissionSelectorProps {
  readonly catalogDomains: readonly MatrixDomainDef[];
  readonly selectedPermissions: ReadonlySet<string>;
  readonly onTogglePermission: (code: string) => void;
  readonly onToggleModuleAll: (moduleCodes: string[]) => void;
}

export const RolePermissionSelector: React.FC<RolePermissionSelectorProps> = ({
  catalogDomains,
  selectedPermissions,
  onTogglePermission,
  onToggleModuleAll,
}) => {
  return (
    <div className="space-y-4">
      {catalogDomains.flatMap((domain) => domain.modules).map((module) => {
        const moduleCodes = module.features.flatMap((f) =>
          Object.values(f.actions)
            .filter((a): a is MatrixActionDef => a !== null)
            .map((a) => a.code)
        );
        const isAllChecked = moduleCodes.length > 0 && moduleCodes.every((c) => selectedPermissions.has(c));

        return (
          <div
            key={module.id}
            className="border border-border-subtle rounded-[4px] bg-surface-muted/20 p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-primary">{module.name}</span>
                {module.description && <p className="text-[11px] text-text-muted">{module.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => onToggleModuleAll(moduleCodes)}
                className="text-[11px] font-medium text-brand-accent hover:underline cursor-pointer"
              >
                {isAllChecked ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-border-subtle/50">
              {module.features.flatMap((f) =>
                Object.values(f.actions)
                  .filter((act): act is MatrixActionDef => act !== null)
                  .map((act) => {
                    const isChecked = selectedPermissions.has(act.code);
                    return (
                      <button
                        key={act.code}
                        type="button"
                        onClick={() => onTogglePermission(act.code)}
                        className={`flex items-center gap-2 p-2 rounded-[3px] border text-left text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent font-medium'
                            : 'bg-surface-card border-border-subtle text-text-secondary hover:bg-surface-muted'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-[2px] flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-brand-accent border-brand-accent text-white' : 'border-border-subtle bg-surface-card'
                          }`}
                        >
                          {isChecked && <Check size={10} />}
                        </div>
                        <span className="truncate">{act.label || act.code}</span>
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RolePermissionSelector;
