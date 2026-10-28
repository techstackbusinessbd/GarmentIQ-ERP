/**
 * =============================================================================
 * [EN] Enterprise Widget Metric / KPI Card Component (WidgetMetricCard)
 * [BN] এন্টারপ্রাইজ উইজেট মেট্রিক / কেপিআই কার্ড কম্পোনেন্ট (WidgetMetricCard)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 * [BN] ড্যাশবোর্ড ওভারভিউ ও আরএমজি ফ্লোর এক্সিকিউশনের জন্য উচ্চ-মানের মেট্রিক কার্ড।
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WidgetMetricCardProps, MetricTrendDirection } from '@/types';

/**
 * [EN] Resolve trend icon and styling classes.
 * [BN] ট্রেন্ড আইকন ও স্টাইল ক্লাস নির্ধারণ।
 */
const renderTrendIndicator = (direction?: MetricTrendDirection, delta?: string) => {
  if (!delta) return null;

  switch (direction) {
    case 'up':
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-status-success">
          <TrendingUp size={13} className="shrink-0" />
          <span>{delta}</span>
        </span>
      );
    case 'down':
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-status-danger">
          <TrendingDown size={13} className="shrink-0" />
          <span>{delta}</span>
        </span>
      );
    case 'neutral':
    default:
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-text-muted">
          <Minus size={13} className="shrink-0" />
          <span>{delta}</span>
        </span>
      );
  }
};

/**
 * [EN] Unified Metric Card Component.
 * [BN] সমন্বিত মেট্রিক কার্ড কম্পোনেন্ট।
 *
 * @param props [EN] Component properties / [BN] কম্পোনেন্ট প্রপার্টিজ
 * @returns [EN] Rendered metric KPI card element / [BN] রেন্ডারকৃত মেট্রিক কার্ড
 */
export const WidgetMetricCard: React.FC<WidgetMetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  trendDelta,
  trendDirection,
  trendContext,
  badge,
  accentVariant = 'primary',
  isLoading = false,
  onClick,
  className = '',
}) => {
  // [EN] Subtle, eye-soothing ambient wash without harsh glare
  // [BN] চোখে আরামদায়ক কোমল ব্যাকগ্রাউন্ড ওয়াশ (কোনো চড়া নিয়ন ভাব থাকবে না)
  const ambientGlowClasses = {
    primary: 'from-brand-accent/[0.035]',
    success: 'from-emerald-500/[0.035]',
    warning: 'from-amber-500/[0.035]',
    danger: 'from-rose-500/[0.035]',
  }[accentVariant];

  const iconVariantClasses = {
    primary: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  }[accentVariant];

  return (
    <div
      id={id}
      data-testid={id ? `metric-card-${id}` : undefined}
      onClick={onClick}
      className={`group relative overflow-hidden bg-gradient-to-b from-surface-card to-surface-card/95 border border-border-subtle hover:border-border-strong rounded-[6px] shadow-2xs hover:shadow-xs p-4 sm:p-4.5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-brand-accent/40' : ''
      } ${className}`}
    >
      {/* Subtle corner ambient wash for tactile depth (eye-comfort, zero harsh glare) */}
      <div
        className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${ambientGlowClasses} to-transparent rounded-bl-full pointer-events-none transition-opacity duration-300`}
      />

      {/* Top Header Row: Label & Icon */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider truncate">
            {title}
          </span>
          {badge && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase tracking-wider rounded-[2px] bg-surface-muted text-text-muted border border-border-subtle">
              {badge.label}
            </span>
          )}
        </div>

        {icon && (
          <div
            className={`w-8 h-8 rounded-[6px] shrink-0 flex items-center justify-center border shadow-2xs transition-transform duration-200 group-hover:scale-105 ${iconVariantClasses}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Stat Value Row */}
      <div className="relative mt-2.5 flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-7 bg-surface-muted rounded w-20 animate-pulse" />
        ) : (
          <span className="text-2xl sm:text-[26px] font-bold font-mono tracking-tight text-text-primary tabular-nums leading-none">
            {value}
          </span>
        )}
        {renderTrendIndicator(trendDirection, trendDelta)}
        {trendContext && (
          <span className="text-[10px] text-text-muted truncate">({trendContext})</span>
        )}
      </div>

      {/* Subtitle / Helper Row */}
      {!trendDelta && subtitle && (
        <p className="relative text-[11px] text-text-muted mt-2 leading-tight truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
