/**
 * =============================================================================
 * [EN] Master-Detail Screen Clearance Row Component (MasterDetailClearanceRow.tsx)
 * [BN] মাস্টার-ডিটেল স্ক্রিন ক্লিয়ারেন্স রো কম্পোনেন্ট (MasterDetailClearanceRow.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] মানবিক ভাষায় পরিষ্কার স্ক্রিন টাইটেল, সহজ অ্যাক্সেস টিয়ার বাটন এবং ঐচ্ছিক গ্র্যানুলার অ্যাকশন।
 */

import React, { useState } from 'react';
import {
  ChevronRight,
  Shield,
  Eye,
  PenTool,
  ShieldCheck,
  Ban,
  Check,
  CheckCircle2,
} from 'lucide-react';
import type { MatrixFeatureDef } from '../constants/accessMatrixTypes';
import {
  resolveFeatureLevel,
  type ModuleAccessLevel,
} from '../utils/accessLevelUtils';

export interface MasterDetailClearanceRowProps {
  readonly feature: MatrixFeatureDef;
  readonly moduleName: string;
  readonly activePermissions: ReadonlySet<string>;
  readonly isSuperAdmin: boolean;
  readonly onChangeLevel: (level: ModuleAccessLevel) => void;
  readonly onToggleAction: (code: string) => void;
}

export const MasterDetailClearanceRow: React.FC<MasterDetailClearanceRowProps> = ({
  feature,
  moduleName,
  activePermissions,
  isSuperAdmin,
  onChangeLevel,
  onToggleAction,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const currentLevel = resolveFeatureLevel(feature, activePermissions);
  const nonMenuActions = Object.entries(feature.actions).filter(
    ([k, a]) => k !== 'menu' && a !== null
  );
  const isBinaryScreen = nonMenuActions.length <= 1;

  // Single binary action (e.g. Password Reset or Special Permission)
  const singleAction = isBinaryScreen && nonMenuActions.length === 1 ? nonMenuActions[0]![1] : null;
  const isSingleActionActive = isSuperAdmin || (singleAction && activePermissions.has(singleAction.code));

  return (
    <div className="p-3.5 bg-surface-card hover:bg-surface-muted/30 border border-border-subtle rounded-xl transition-all shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Feature Identity */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-surface-muted border border-border-subtle flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
            <Shield size={14} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary tracking-tight truncate">
                {feature.name}
              </span>
              <span className="text-[10px] text-text-muted font-mono uppercase bg-surface-muted px-1.5 py-0.2 rounded border border-border-subtle">
                {moduleName}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-text-muted">
                {isBinaryScreen
                  ? singleAction ? singleAction.label : 'Single clearance control'
                  : `${nonMenuActions.length} operational actions available`}
              </span>

              {!isBinaryScreen && nonMenuActions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-[10px] font-semibold text-brand-accent hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide actions' : 'Customize actions'}</span>
                  <ChevronRight size={10} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Access Tier Selector */}
        <div className="shrink-0 self-start sm:self-center">
          {isBinaryScreen ? (
            /* Simple Binary Toggle Button (Allowed vs Denied) */
            <button
              type="button"
              disabled={isSuperAdmin}
              onClick={() => onChangeLevel(isSingleActionActive ? 'NONE' : 'FULL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                isSingleActionActive
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shadow-2xs'
                  : 'bg-surface-muted text-text-muted border-border-subtle hover:text-text-primary'
              } ${isSuperAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              {isSingleActionActive ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Allowed (Active)</span>
                </>
              ) : (
                <>
                  <Ban size={13} className="text-text-muted" />
                  <span>Restricted (Off)</span>
                </>
              )}
            </button>
          ) : (
            /* 4-Tier Segmented Control */
            <div className="inline-flex items-center p-0.5 bg-surface-muted rounded-lg border border-border-subtle text-xs gap-0.5 shadow-inner">
              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onChangeLevel('NONE')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  currentLevel === 'NONE'
                    ? 'bg-surface-card text-text-primary shadow-xs font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title="No Access: Cannot view or modify"
              >
                No Access
              </button>

              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onChangeLevel('VIEW')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  currentLevel === 'VIEW'
                    ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 shadow-xs font-bold'
                    : 'text-text-muted hover:text-sky-600'
                }`}
                title="View Only: Read-only access"
              >
                <Eye size={10} />
                <span>View</span>
              </button>

              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onChangeLevel('EDIT')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  currentLevel === 'EDIT'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-text-muted hover:text-emerald-600'
                }`}
                title="Can Edit: Create and modify data"
              >
                <PenTool size={10} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onChangeLevel('FULL')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  currentLevel === 'FULL'
                    ? 'bg-brand-accent text-white shadow-xs font-bold'
                    : 'text-text-muted hover:text-brand-accent'
                }`}
                title="Full Admin: Unrestricted permissions"
              >
                <ShieldCheck size={10} />
                <span>Full</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Granular Actions Drawer */}
      {isExpanded && !isBinaryScreen && (
        <div className="mt-3 pt-3 border-t border-border-subtle/60 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
          <span className="text-[10px] font-mono text-text-muted uppercase font-bold mr-1">
            Action Toggles:
          </span>
          {nonMenuActions.map(([key, action]) => {
            if (!action) return null;
            const isGranted = isSuperAdmin || activePermissions.has(action.code);

            return (
              <button
                key={key}
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onToggleAction(action.code)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                  isGranted
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-semibold'
                    : 'bg-surface-card text-text-muted border-border-subtle hover:text-text-primary'
                }`}
              >
                {isGranted && <Check size={10} strokeWidth={3} className="text-emerald-600" />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
