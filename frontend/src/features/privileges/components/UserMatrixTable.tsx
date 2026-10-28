/**
 * =============================================================================
 * [EN] User Custom Overrides Matrix Table (UserMatrixTable.tsx)
 * [BN] ব্যবহারকারী কাস্টম ওভাররাইড ম্যাট্রিক্স টেবিল (UserMatrixTable.tsx)
 * =============================================================================
 * [EN] Domain ➔ Module ➔ Action 3-state privilege table for individual users.
 * [BN] ব্যবহারকারীর রোলের ইনহেরিটেন্স ও কাস্টম গ্রান্ট/ডিনাই প্রদর্শক গ্রিড।
 */

import React from 'react';
import { Shield, Plus, Minus, Info } from 'lucide-react';
import type { MatrixDomainDef } from '../constants/accessMatrixConstants';

interface UserMatrixTableProps {
  filteredDomains: MatrixDomainDef[];
  roleBasePermissions: Set<string>;
  customGrants: Set<string>;
  customDenials: Set<string>;
  isEffectiveGranted: (code: string) => boolean;
  onToggleAction: (code: string) => void;
  isSuperAdminUser?: boolean;
}

const ACTION_COLUMNS = [
  { key: 'menu', label: 'Menu', width: 'w-24', dot: 'bg-indigo-500' },
  { key: 'view', label: 'View', width: 'w-20', dot: 'bg-sky-500' },
  { key: 'create', label: 'Create', width: 'w-20', dot: 'bg-emerald-500' },
  { key: 'edit', label: 'Edit', width: 'w-20', dot: 'bg-amber-500' },
  { key: 'delete', label: 'Delete', width: 'w-20', dot: 'bg-rose-500' },
  { key: 'approve', label: 'Approve', width: 'w-24', dot: 'bg-purple-500' },
] as const;

export const UserMatrixTable: React.FC<UserMatrixTableProps> = ({
  filteredDomains,
  roleBasePermissions,
  customGrants,
  customDenials,
  isEffectiveGranted,
  onToggleAction,
  isSuperAdminUser,
}) => {
  return (
    <div className="border border-border-subtle rounded-[6px] bg-surface-card overflow-hidden shadow-xs space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-muted/90 backdrop-blur-xs border-b border-border-subtle text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              <th className="py-2.5 px-3 w-48">Domain</th>
              <th className="py-2.5 px-3 min-w-[200px]">Application Page / Screen</th>
              {ACTION_COLUMNS.map((col) => (
                <th key={col.key} className={`py-2.5 px-2 text-center ${col.width}`}>
                  <div className="inline-flex items-center gap-1.5 justify-center">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                    <span>{col.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/70">
            {filteredDomains.map((domain) => (
              <React.Fragment key={domain.id}>
                <tr className="bg-surface-muted/40 font-semibold text-text-primary text-[11px]">
                  <td colSpan={8} className="py-2 px-3 border-y border-border-subtle/50">
                    <span className="font-mono text-brand-accent uppercase tracking-wider mr-2 text-[10px] bg-brand-accent/10 px-1.5 py-0.5 rounded font-bold">
                      {domain.id.toUpperCase()}
                    </span>
                    <span className="font-bold text-text-primary">{domain.title}</span>
                    <span className="ml-2 text-[10px] text-text-muted font-normal">
                      ({domain.modules.length} {domain.modules.length === 1 ? 'page' : 'pages'})
                    </span>
                  </td>
                </tr>
                {domain.modules.flatMap((m) => m.features).map((feature) => (
                  <tr key={feature.id} className="hover:bg-brand-accent/5 transition-colors">
                    <td className="py-2 px-3 text-[11px] text-text-muted font-mono">{domain.title.split(' ')[0]}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-text-primary text-xs">{feature.name}</div>
                      <div className="text-[10px] text-brand-accent/80 font-mono mt-0.5">{feature.path || feature.id}</div>
                    </td>
                    {ACTION_COLUMNS.map((col) => {
                      const action = feature.actions[col.key];
                      if (!action) {
                        return <td key={col.key} className="py-2 px-2 text-center text-text-muted/30 font-mono text-[10px]">—</td>;
                      }
                      const code = action.code;
                      const isGranted = isEffectiveGranted(code);
                      const isFromRole = roleBasePermissions.has(code);
                      const isCustomGrant = customGrants.has(code);
                      const isCustomDenial = customDenials.has(code);

                      return (
                        <td key={col.key} className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleAction(code)}
                            disabled={isSuperAdminUser}
                            title={`${action.label} (${code})\nState: ${
                              isCustomGrant
                                ? 'Custom Granted (+)'
                                : isCustomDenial
                                ? 'Explicitly Denied (-)'
                                : isFromRole
                                ? 'Inherited from Role (Default)'
                                : 'No Access (Off)'
                            }\nClick to toggle override state.`}
                            className={`inline-flex items-center justify-center gap-1 px-2 py-0.8 rounded-[4px] text-[10px] font-semibold border transition-all shadow-2xs ${
                              isCustomGrant
                                ? 'bg-status-success-bg text-status-success border-status-success-border font-bold hover:brightness-95'
                                : isCustomDenial
                                ? 'bg-status-danger-bg text-status-danger border-status-danger-border font-bold hover:brightness-95'
                                : isGranted
                                ? 'bg-surface-muted text-text-secondary border-border-subtle hover:text-text-primary hover:border-text-muted'
                                : 'bg-transparent text-text-muted/40 border-transparent hover:border-border-subtle hover:text-text-muted'
                            } ${isSuperAdminUser ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                          >
                            {isCustomGrant ? (
                              <>
                                <Plus size={10} strokeWidth={3} className="text-status-success" />
                                <span>Grant</span>
                              </>
                            ) : isCustomDenial ? (
                              <>
                                <Minus size={10} strokeWidth={3} className="text-status-danger" />
                                <span>Deny</span>
                              </>
                            ) : isGranted ? (
                              <>
                                <Shield size={9} className="text-brand-accent shrink-0" />
                                <span>Role</span>
                              </>
                            ) : (
                              <span>Off</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Premium Sticky Legend Footer */}
      <div className="p-3 bg-surface-muted/60 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold bg-surface-muted text-text-secondary border border-border-subtle">
              <Shield size={9} className="text-brand-accent" /> Role
            </span>
            <span className="text-[11px] text-text-muted">Inherited from Role</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-status-success-bg text-status-success border border-status-success-border">
              <Plus size={9} strokeWidth={3} /> Grant
            </span>
            <span className="text-[11px] text-text-muted">Direct Custom Grant</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-status-danger-bg text-status-danger border border-status-danger-border">
              <Minus size={9} strokeWidth={3} /> Deny
            </span>
            <span className="text-[11px] text-text-muted">Explicit Restriction</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-[3px] text-[10px] text-text-muted/50 border border-border-subtle/50">
              Off
            </span>
            <span className="text-[11px] text-text-muted">No Access</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <Info size={12} className="text-brand-accent shrink-0" />
          <span>Click any pill to cycle override state. All changes are saved to user audit history.</span>
        </div>
      </div>
    </div>
  );
};
