/**
 * =============================================================================
 * [EN] Enterprise Widget Header Component (WidgetHeader)
 * [BN] এন্টারপ্রাইজ উইজেট হেডার কম্পোনেন্ট (WidgetHeader)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 * [BN] উইজেটের টাইটেল, ডোমেন সাবটাইটেল, স্ট্যাটাস ব্যাজ ও অ্যাকশন টুলবার নিয়ন্ত্রণকারী কম্পোনেন্ট।
 */

import React from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { WidgetHeaderProps, WidgetBadgeVariant } from '@/types';

/**
 * [EN] Helper function to resolve status badge styling classes based on variant.
 * [BN] স্ট্যাটাস ব্যাজ ভ্যারিয়েন্টের ওপর ভিত্তি করে স্টাইল ক্লাস নির্ধারণের সহায়ক মেথড।
 */
const getBadgeClasses = (variant: WidgetBadgeVariant = 'neutral'): string => {
  switch (variant) {
    case 'success':
      return 'bg-status-success-bg text-status-success border-status-success-border';
    case 'warning':
      return 'bg-status-warning-bg text-status-warning border-status-warning-border';
    case 'danger':
      return 'bg-status-danger-bg text-status-danger border-status-danger-border';
    case 'info':
      return 'bg-status-info-bg text-status-info border-status-info-border';
    case 'neutral':
    default:
      return 'bg-surface-muted text-text-muted border-border-subtle';
  }
};

/**
 * [EN] Unified Widget Header Component.
 * [BN] সমন্বিত উইজেট হেডার কম্পোনেন্ট।
 *
 * @param props [EN] Header properties contract / [BN] হেডার প্রপার্টিজ কনট্রাক্ট
 * @returns [EN] Rendered header bar element / [BN] রেন্ডারকৃত হেডার এলিমেন্ট
 */
export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions = [],
  headerExtra,
  collapsible = false,
  isCollapsed = false,
  onToggleCollapse,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-surface-card transition-colors ${
        isCollapsed ? 'border-b-0' : 'border-b border-border-subtle'
      } ${className}`}
    >
      {/* [EN] Left Section: Icon, Title, Subtitle, and Badge */}
      {/* [BN] বাম পাশ: আইকন, টাইটেল, সাবটাইটেল এবং স্ট্যাটাস ব্যাজ */}
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className="shrink-0 text-text-muted flex items-center justify-center">
            {icon}
          </div>
        )}

        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-text-primary tracking-tight truncate">
              {title}
            </h3>

            {badge && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-[2px] border ${getBadgeClasses(
                  badge.variant
                )}`}
              >
                {badge.label}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-text-muted truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* [EN] Right Section: Extra elements, Actions Toolbar, Refresh, and Collapse */}
      {/* [BN] ডান পাশ: কাস্টম এলিমেন্টস, অ্যাকশন টুলবার, রিফ্রেশ এবং কোল্যাপ্স টগল */}
      <div className="flex items-center gap-1 shrink-0 ml-3">
        {headerExtra && <div className="mr-1">{headerExtra}</div>}

        {/* [EN] Dynamic Action Toolbar Items */}
        {/* [BN] ডায়নামিক অ্যাকশন টুলবার আইটেমসমূহ */}
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            title={action.label}
            aria-label={action.label}
            className={`p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent/30 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {action.loading ? (
              <RefreshCw size={14} className="animate-spin text-brand-accent" />
            ) : (
              action.icon
            )}
          </button>
        ))}

        {/* [EN] Built-in Refresh Button */}
        {/* [BN] বিল্ট-ইন ডেটা রিফ্রেশ বাটন */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Widget Data"
            aria-label="Refresh Widget Data"
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent/30 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={`${isRefreshing ? 'animate-spin text-brand-accent' : ''}`}
            />
          </button>
        )}

        {/* [EN] Built-in Collapse / Expand Button */}
        {/* [BN] বিল্ট-ইন কোল্যাপ্স / এক্সপ্যান্ড বাটন */}
        {collapsible && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Widget' : 'Collapse Widget'}
            aria-label={isCollapsed ? 'Expand Widget' : 'Collapse Widget'}
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent/30 ml-0.5"
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};
