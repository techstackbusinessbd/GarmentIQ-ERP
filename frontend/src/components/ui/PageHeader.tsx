/**
 * =============================================================================
 * [EN] Unified Enterprise Page Header Component (PageHeader)
 * [BN] সমন্বিত এন্টারপ্রাইজ পেজ হেডার কম্পোনেন্ট (PageHeader)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens & Consistency), Rule 21 (Components)
 * [BN] সকল পেজের জন্য অভিন্ন ব্রেডক্রাম্ব, টাইটেল, সাবটাইটেল ও অ্যাকশন টুলবার স্ট্রাকচার।
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * [EN] Breadcrumb item representation (retained for backward-compatible prop signatures).
 * [BN] ব্রেডক্রাম্ব আইটেম ইন্টারফেস (ব্যাকওয়ার্ড কম্প্যাটিবিলিটির জন্য সংরক্ষিত)।
 */
export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

/**
 * [EN] Properties contract for the PageHeader component.
 * [BN] PageHeader কম্পোনেন্টের প্রপার্টিজ ইন্টারফেস।
 */
export interface PageHeaderProps {
  /** [EN] Legacy breadcrumbs (now centrally rendered in Topbar) / [BN] ব্রেডক্রাম্ব এখন সেন্ট্রাল টপবারে রেন্ডার হয় */
  readonly breadcrumbs?: readonly BreadcrumbItem[];

  /** [EN] Main page title / [BN] মূল পেজ টাইটেল */
  readonly title: string;

  /** [EN] Optional subtitle description / [BN] সাবটাইটেল বিবরণ */
  readonly subtitle?: string;

  /** [EN] Optional badge next to title / [BN] টাইটেলের পাশের ব্যাজ */
  readonly badge?: React.ReactNode;

  /** [EN] Optional back button callback / [BN] ব্যাক বাটন কলব্যাক */
  readonly onBack?: () => void;

  /** [EN] Right-aligned action buttons toolbar / [BN] ডানপাশের অ্যাকশন বাটনসমূহ */
  readonly actions?: React.ReactNode;

  /** [EN] Optional CSS className / [BN] অপশনাল সিএসএস ক্লাস */
  readonly className?: string;
}

/**
 * [EN] Master PageHeader Component implementing Rule 20 Section 6.
 * Ensures 100% layout and visual consistency across all pages.
 *
 * [BN] মাস্টার পেজ হেডার কম্পোনেন্ট (রুল ২০ সেকশন ৬ অনুবর্তী)।
 * প্ল্যাটফর্মের সকল পেজে অভিন্ন লেআউট ও ডিজাইন কনসিস্টেন্সি নিশ্চিত করে।
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs: _breadcrumbs,
  title,
  subtitle,
  badge,
  onBack,
  actions,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* [EN] Page Title Row with Optional Back Button & Actions / [BN] পেজ টাইটেল ও অ্যাকশন রো */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border-subtle gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-[4px] border border-border-subtle bg-surface-card hover:bg-surface-muted text-text-primary transition-colors shrink-0"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary truncate">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
