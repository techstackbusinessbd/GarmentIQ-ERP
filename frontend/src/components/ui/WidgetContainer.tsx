/**
 * =============================================================================
 * [EN] Enterprise Widget Container Component (WidgetContainer)
 * [BN] এন্টারপ্রাইজ উইজেট কন্টেইনার কম্পোনেন্ট (WidgetContainer)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 * [BN] ড্যাশবোর্ড উইজেট, ডেটা কার্ড ও কেপিআই ব্লকের প্রধান ফ্রেমওয়ার্ক কন্টেইনার।
 */

import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import type { WidgetContainerProps } from '@/types';
import { WidgetHeader } from './WidgetHeader';

/**
 * [EN] Unified Widget Container Component.
 * Encapsulates header bar, loading skeleton overlay, error handling with retry, and collapsible body.
 *
 * [BN] সমন্বিত উইজেট কন্টেইনার কম্পোনেন্ট।
 * হেডার বার, লোডিং স্কেলিটন স্টেট, রিট্রাই সুবিধা সহ এরর হ্যান্ডলিং ও কোল্যাপ্সিবল বডি পরিচালনা করে।
 *
 * @param props [EN] Container properties / [BN] কন্টেইনার প্রপার্টিজ
 * @returns [EN] Rendered widget container element / [BN] রেন্ডারকৃত উইজেট এলিমেন্ট
 */
export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  subtitle,
  icon,
  badge,
  actions = [],
  headerExtra,
  children,
  isLoading = false,
  error = null,
  onRetry,
  collapsible = false,
  defaultCollapsed = false,
  onRefresh,
  isRefreshing = false,
  footer,
  className = '',
  bodyClassName = '',
}) => {
  // [EN] Internal collapse state if not externally controlled
  // [BN] কোল্যাপ্সড অবস্থার ইন্টারনাল স্টেট
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  /**
   * [EN] Handle toggling collapse state
   * [BN] কোল্যাপ্স অবস্থা টগল হ্যান্ডলার
   */
  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const hasHeader = Boolean(title || icon || badge || actions.length > 0 || headerExtra || collapsible || onRefresh);

  return (
    <div
      id={id}
      data-testid={id ? `widget-${id}` : undefined}
      className={`bg-surface-card border border-border-subtle rounded-[6px] shadow-xs overflow-hidden flex flex-col transition-all duration-200 ${
        isCollapsed ? 'self-start h-auto' : 'h-full'
      } ${className}`}
    >
      {/* [EN] Optional Widget Header Section */}
      {/* [BN] ঐচ্ছিক উইজেট হেডার সেকশন */}
      {hasHeader && title && (
        <WidgetHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          badge={badge}
          actions={actions}
          headerExtra={headerExtra}
          collapsible={collapsible}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      )}

      {/* [EN] Main Widget Content Area (Collapsible) */}
      {/* [BN] মূল উইজেট কন্টেন্ট এরিয়া (কোল্যাপ্সযোগ্য) */}
      {!isCollapsed && (
        <div className="relative flex-1 flex flex-col">
          {/* [EN] Error State Display */}
          {/* [BN] এরর স্টেট ডিসপ্লে */}
          {error ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-status-danger-bg border border-status-danger-border flex items-center justify-center text-status-danger mb-3">
                <AlertCircle size={20} />
              </div>
              <h4 className="text-sm font-semibold text-text-primary mb-1">
                Unable to load widget data
              </h4>
              <p className="text-xs text-text-muted max-w-sm mb-4">{error}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-accent hover:bg-brand-accent-hover rounded-[3px] transition-colors shadow-xs"
                >
                  <RotateCcw size={13} />
                  <span>Retry</span>
                </button>
              )}
            </div>
          ) : isLoading ? (
            /* [EN] Loading Skeleton State */
            /* [BN] লোডিং স্কেলিটন স্টেট */
            <div className="p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-surface-muted rounded-[3px] w-2/5" />
              <div className="space-y-2">
                <div className="h-3 bg-surface-muted rounded-[3px] w-full" />
                <div className="h-3 bg-surface-muted rounded-[3px] w-4/5" />
                <div className="h-3 bg-surface-muted rounded-[3px] w-3/5" />
              </div>
              <div className="h-8 bg-surface-muted rounded-[3px] w-1/3" />
            </div>
          ) : (
            /* [EN] Active Children Content */
            /* [BN] সক্রিয় মূল কন্টেন্ট */
            <div className={`p-4 flex-1 ${bodyClassName}`}>{children}</div>
          )}

          {/* [EN] Optional Widget Footer Section */}
          {/* [BN] ঐচ্ছিক উইজেট ফুটার সেকশন */}
          {footer && (
            <div className="px-4 py-2.5 bg-surface-muted/40 border-t border-border-subtle text-xs text-text-muted mt-auto">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
