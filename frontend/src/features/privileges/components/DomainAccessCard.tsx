/**
 * =============================================================================
 * [EN] Domain Access Accordion Card Component (DomainAccessCard.tsx)
 * [BN] ডোমেন অ্যাক্সেস একর্ডিয়ন কার্ড কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ডোমেন ০০-এর ৬টি কোর সাবসিস্টেম মডিউলের অ্যাক্সেস কনফিগারেশন কার্ড।
 */

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import type {
  MatrixDomainDef,
  MatrixModuleDef,
  MatrixFeatureDef,
} from '../constants/accessMatrixTypes';
import {
  resolveFeatureLevel,
  type ModuleAccessLevel,
} from '../utils/accessLevelUtils';
import { ModuleAccessRow } from './ModuleAccessRow';

export interface DomainAccessCardProps {
  readonly domain: MatrixDomainDef;
  readonly activePermissions: ReadonlySet<string>;
  readonly onChangeFeatureLevel: (feature: MatrixFeatureDef, level: ModuleAccessLevel) => void;
  readonly onToggleAction: (feature: MatrixFeatureDef, code: string) => void;
  readonly onSetDomainLevel: (domain: MatrixDomainDef, level: ModuleAccessLevel) => void;
  readonly onSetModuleLevel?: (module: MatrixModuleDef, level: ModuleAccessLevel) => void;
  readonly disabled?: boolean;
  readonly isUserMode?: boolean;
  readonly roleBasePermissions?: ReadonlySet<string>;
  readonly onResetFeatureToRole?: (feature: MatrixFeatureDef) => void;
}

export const DomainAccessCard: React.FC<DomainAccessCardProps> = ({
  domain,
  activePermissions,
  onChangeFeatureLevel,
  onToggleAction,
  onSetDomainLevel,
  disabled = false,
  isUserMode = false,
  roleBasePermissions,
  onResetFeatureToRole,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Calculate domain-level feature counts
  const allDomainFeatures = useMemo(() => {
    return domain.modules.flatMap((m) => m.features);
  }, [domain.modules]);

  const activeFeaturesCount = useMemo(() => {
    return allDomainFeatures.filter((f) => {
      const level = resolveFeatureLevel(f, activePermissions);
      return level !== 'NONE';
    }).length;
  }, [allDomainFeatures, activePermissions]);

  const totalFeatures = allDomainFeatures.length;
  const isFullyActive = totalFeatures > 0 && activeFeaturesCount === totalFeatures;

  return (
    <div className="border border-border-subtle rounded-[6px] bg-surface-card overflow-hidden shadow-xs mb-3 transition-shadow hover:shadow-sm">
      {/* Domain Master Header Strip */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded((prev) => !prev);
          }
        }}
        className="px-4 py-3 bg-surface-muted/60 hover:bg-surface-muted border-b border-border-subtle/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-[4px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
            <Layers size={16} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-brand-accent uppercase tracking-wider text-[10px] bg-brand-accent/10 px-1.5 py-0.2 rounded font-bold">
                {domain.id.toUpperCase()}
              </span>
              <h3 className="text-sm font-bold text-text-primary truncate">
                {domain.title}
              </h3>
            </div>

            <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5">
              <span>{domain.modules.length} Subsystem Modules</span>
              <span>•</span>
              <span className={activeFeaturesCount > 0 ? 'text-emerald-700 dark:text-emerald-300 font-medium' : ''}>
                {activeFeaturesCount} of {totalFeatures} Enabled
              </span>
              {isFullyActive && (
                <CheckCircle2 size={11} className="text-emerald-600 inline shrink-0" />
              )}
            </p>
          </div>
        </div>

        {/* Bulk Domain-Level Quick Access Controls */}
        <div
          className="flex items-center gap-2.5 self-start sm:self-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-muted/90 border border-border-subtle shadow-inner gap-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-2 font-bold hidden md:inline">
              Set All:
            </span>
            <button
              type="button"
              disabled={disabled || isUserMode}
              onClick={() => onSetDomainLevel(domain, 'NONE')}
              className={`px-2.5 py-1 text-[11px] font-semibold text-text-muted hover:text-text-primary hover:bg-surface-card rounded-md transition-all ${
                isUserMode ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              } disabled:opacity-40`}
              title={isUserMode ? "Role baseline permissions cannot be revoked" : "Disable all modules in this domain"}
            >
              None
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSetDomainLevel(domain, 'VIEW')}
              className="px-2.5 py-1 text-[11px] font-semibold text-status-info hover:bg-status-info-bg/80 rounded-md transition-all cursor-pointer disabled:opacity-50"
              title="Set all modules in this domain to View Only"
            >
              View
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSetDomainLevel(domain, 'EDIT')}
              className="px-2.5 py-1 text-[11px] font-semibold text-status-success hover:bg-status-success-bg/80 rounded-md transition-all cursor-pointer disabled:opacity-50"
              title="Set all modules in this domain to Can Edit"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSetDomainLevel(domain, 'FULL')}
              className="px-2.5 py-1 text-[11px] font-semibold text-brand-accent hover:bg-brand-accent/15 rounded-md transition-all cursor-pointer disabled:opacity-50"
              title="Grant full administrative access across this domain"
            >
              Full
            </button>
          </div>

          <div className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-card border border-border-subtle/50 transition-colors">
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Accordion Body: Clean Subsystem Module Groups */}
      {isExpanded && (
        <div className="divide-y divide-border-subtle/70 bg-surface-card">
          {domain.modules.map((module) => (
            <div key={module.id} className="divide-y divide-border-subtle/50">
              {module.features.length > 1 && (
                <div className="px-4 py-2 bg-surface-muted/50 border-b border-border-subtle/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider font-mono">
                      {module.name}
                    </span>
                    <span className="text-[10px] text-text-muted bg-surface-card px-1.5 py-0.5 rounded border border-border-subtle font-medium">
                      {module.features.length} Screens / Features
                    </span>
                  </div>
                  {module.description && (
                    <span className="text-[11px] text-text-muted hidden sm:inline">
                      {module.description}
                    </span>
                  )}
                </div>
              )}
              {module.features.map((feature) => {
                const currentLevel = resolveFeatureLevel(feature, activePermissions);
                const roleLevel = roleBasePermissions ? resolveFeatureLevel(feature, roleBasePermissions) : undefined;
                const isOverridden = isUserMode && roleLevel !== undefined && currentLevel !== roleLevel;

                return (
                  <ModuleAccessRow
                    key={`${module.id}-${feature.id}`}
                    feature={feature}
                    description={module.features.length > 1 ? undefined : module.description}
                    currentLevel={currentLevel}
                    activePermissions={activePermissions}
                    onChangeLevel={(level) => onChangeFeatureLevel(feature, level)}
                    onToggleAction={(code) => onToggleAction(feature, code)}
                    disabled={disabled}
                    isUserMode={isUserMode}
                    roleLevel={roleLevel}
                    roleBasePermissions={roleBasePermissions}
                    isOverridden={isOverridden}
                    onResetToRole={onResetFeatureToRole ? () => onResetFeatureToRole(feature) : undefined}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
