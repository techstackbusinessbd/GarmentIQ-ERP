/**
 * =============================================================================
 * [EN] Module Access Level Row Component (ModuleAccessRow.tsx)
 * [BN] মডিউল অ্যাক্সেস লেভেল নির্বাচন রো কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] প্রতিটি মডিউলের জন্য আধুনিক সেগমেন্টেড পিল সিলেক্টর ও গ্র্যানুলার অ্যাকশন ড্রয়ার।
 */

import React, { useState } from 'react';
import {
  Eye,
  PenTool,
  ShieldCheck,
  Ban,
  ChevronRight,
  Sliders,
  RotateCcw,
  Compass,
} from 'lucide-react';
import type { MatrixFeatureDef } from '../constants/accessMatrixTypes';
import {
  ACCESS_LEVEL_OPTIONS,
  LEVEL_RANKS,
  type ModuleAccessLevel,
} from '../utils/accessLevelUtils';
import { GranularActionDrawer } from './GranularActionDrawer';

export interface ModuleAccessRowProps {
  readonly feature: MatrixFeatureDef;
  readonly description?: string;
  readonly currentLevel: ModuleAccessLevel;
  readonly activePermissions: ReadonlySet<string>;
  readonly onChangeLevel: (level: ModuleAccessLevel) => void;
  readonly onToggleAction: (code: string) => void;
  readonly disabled?: boolean;
  readonly isUserMode?: boolean;
  readonly roleLevel?: ModuleAccessLevel;
  readonly roleBasePermissions?: ReadonlySet<string>;
  readonly isOverridden?: boolean;
  readonly onResetToRole?: () => void;
}

const LEVEL_ICONS: Record<ModuleAccessLevel, React.FC<{ size?: number; className?: string }>> = {
  NONE: Ban,
  VIEW: Eye,
  EDIT: PenTool,
  FULL: ShieldCheck,
  CUSTOM: Sliders,
};

export const ModuleAccessRow: React.FC<ModuleAccessRowProps> = ({
  feature,
  description,
  currentLevel,
  activePermissions,
  onChangeLevel,
  onToggleAction,
  disabled = false,
  isUserMode = false,
  roleLevel,
  roleBasePermissions,
  isOverridden = false,
  onResetToRole,
}) => {
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState<boolean>(false);

  return (
    <div
      className={`px-4 py-3.5 transition-colors group ${
        isOverridden
          ? 'bg-amber-500/[0.04] border-l-2 border-amber-500'
          : 'hover:bg-surface-muted/35'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Module Title & Context Metadata */}
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsAdvancedExpanded((prev) => !prev)}
            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all duration-200 mt-0.5 cursor-pointer shrink-0 ${
              isAdvancedExpanded
                ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30 rotate-90'
                : 'bg-surface-muted/60 text-text-muted hover:text-text-primary hover:bg-surface-muted border-border-subtle/80'
            }`}
            title={isAdvancedExpanded ? 'Collapse granular clearances' : 'Inspect granular action clearances'}
          >
            <ChevronRight size={13} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-text-primary text-xs tracking-tight">
                {feature.name}
              </span>

              {feature.path && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-text-muted bg-surface-muted/80 px-2 py-0.5 rounded-full border border-border-subtle/70">
                  <Compass size={10} className="text-text-muted/70" />
                  <span>{feature.path}</span>
                </span>
              )}

              {/* User Mode State Pill */}
              {isUserMode && roleLevel && (
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    isOverridden
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-surface-muted text-text-muted border border-border-subtle'
                  }`}
                >
                  {isOverridden ? 'Custom Override' : `Role: ${roleLevel}`}
                </span>
              )}

              {isUserMode && isOverridden && onResetToRole && (
                <button
                  type="button"
                  onClick={onResetToRole}
                  disabled={disabled}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  title="Revert module to role default"
                >
                  <RotateCcw size={10} />
                  <span>Revert</span>
                </button>
              )}
            </div>

            {description && (
              <p className="text-[11px] text-text-muted mt-0.5 leading-snug line-clamp-1">
                {description}
              </p>
            )}

            {currentLevel === 'CUSTOM' && (
              <div className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/25">
                <Sliders size={10} />
                <span>Custom Clearance: Granular action selections differ from standard tiers</span>
              </div>
            )}
          </div>
        </div>

        {/* 4-Level Unified Segmented Controller */}
        <div className="inline-flex items-center p-1 rounded-lg bg-surface-muted/80 border border-border-subtle shadow-inner gap-0.5 self-start lg:self-center shrink-0">
          {ACCESS_LEVEL_OPTIONS.map((opt) => {
            const isSelected = currentLevel === opt.level;
            const IconComponent = LEVEL_ICONS[opt.level];
            const isBelowRoleBaseline = isUserMode && roleLevel ? LEVEL_RANKS[opt.level] < LEVEL_RANKS[roleLevel] : false;
            const isOptionDisabled = disabled || isBelowRoleBaseline;

            return (
              <button
                key={opt.level}
                type="button"
                disabled={isOptionDisabled}
                onClick={() => onChangeLevel(opt.level)}
                title={
                  isBelowRoleBaseline
                    ? `Cannot downgrade below assigned role baseline (${roleLevel}). Role permissions are read-only.`
                    : `${opt.label}: ${opt.shortDesc}`
                }
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-surface-card text-text-primary shadow-xs border border-border-subtle font-bold'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-card/60 border border-transparent'
                } ${isOptionDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
              >
                <IconComponent
                  size={12}
                  className={
                    isSelected
                      ? opt.level === 'NONE'
                        ? 'text-text-muted'
                        : opt.level === 'VIEW'
                        ? 'text-status-info'
                        : opt.level === 'EDIT'
                        ? 'text-status-success'
                        : 'text-brand-accent'
                      : 'text-text-muted/70'
                  }
                />
                <span>{opt.label}</span>
                {isSelected && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      opt.level === 'NONE'
                        ? 'bg-text-muted'
                        : opt.level === 'VIEW'
                        ? 'bg-status-info'
                        : opt.level === 'EDIT'
                        ? 'bg-status-success'
                        : 'bg-brand-accent'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Granular Clearances Drawer Component */}
      {isAdvancedExpanded && (
        <GranularActionDrawer
          feature={feature}
          activePermissions={activePermissions}
          roleBasePermissions={roleBasePermissions}
          isUserMode={isUserMode}
          disabled={disabled}
          onToggleAction={onToggleAction}
        />
      )}
    </div>
  );
};
