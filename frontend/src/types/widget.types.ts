/**
 * =============================================================================
 * [EN] Enterprise Widget Framework Type Definitions
 * [BN] এন্টারপ্রাইজ উইজেট ফ্রেমওয়ার্ক টাইপ ডেফিনিশন (রুল ০৭ ও ১৫ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Author: Sadia Jahan (Senior Frontend Lead) & Farhana Chowdhury (Lead QA)
 * [BN] ১০০% উইজেট-ভিত্তিক ড্যাশবোর্ড ও আরএমজি কেপিআই কার্ডের সার্বিক টাইপ চুক্তি।
 */

import React from 'react';

/**
 * [EN] Visual variant types for widget containers.
 * [BN] উইজেট কন্টেইনারের ভিজ্যুয়াল ভ্যারিয়েন্ট টাইপ।
 */
export type WidgetVariant = 'default' | 'metric' | 'table' | 'chart' | 'alert';

/**
 * [EN] Status badge variant styles for widget headers.
 * [BN] উইজেট হেডারের স্ট্যাটাস ব্যাজ ভ্যারিয়েন্ট।
 */
export type WidgetBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * [EN] Badge configuration metadata for widget headers.
 * [BN] উইজেট হেডারের ব্যাজ কনফিগারেশন মেটাডেটা।
 */
export interface WidgetBadgeConfig {
  /** [EN] Badge display label / [BN] ব্যাজের টেক্সট লেবেল */
  readonly label: string;

  /** [EN] Color variant / [BN] কালার ভ্যারিয়েন্ট */
  readonly variant?: WidgetBadgeVariant;
}

/**
 * [EN] Quick action item for widget header toolbar.
 * [BN] উইজেট হেডার টুলবারের কুইক অ্যাকশন আইটেম।
 */
export interface WidgetActionItem {
  /** [EN] Unique action identifier / [BN] অ্যাকশন আইডেন্টিফায়ার */
  readonly id: string;

  /** [EN] Accessible label or tooltip text / [BN] অ্যাক্সেসিবল লেবেল বা টুলটিপ */
  readonly label: string;

  /** [EN] Icon component / [BN] আইকন এলিমেন্ট */
  readonly icon: React.ReactNode;

  /** [EN] Click callback handler / [BN] ক্লিক ইভেন্ট হ্যান্ডলার */
  readonly onClick: () => void;

  /** [EN] Whether action is currently disabled / [BN] অ্যাকশন নিষ্ক্রিয় কি না */
  readonly disabled?: boolean;

  /** [EN] Whether action should show loading spinner / [BN] স্পিনার লোডিং স্টেট */
  readonly loading?: boolean;
}

/**
 * [EN] Properties contract for the WidgetHeader component.
 * [BN] WidgetHeader কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface WidgetHeaderProps {
  /** [EN] Primary title text / [BN] মূল টাইটেল টেক্সট */
  readonly title: string;

  /** [EN] Contextual subtitle or domain note / [BN] প্রাসঙ্গিক সাবটাইটেল বা ডোমেন নোট */
  readonly subtitle?: string;

  /** [EN] Leading icon element / [BN] বামপাশের আইকন উপাদান */
  readonly icon?: React.ReactNode;

  /** [EN] Optional status badge configuration / [BN] ঐচ্ছিক স্ট্যাটাস ব্যাজ কনফিগারেশন */
  readonly badge?: WidgetBadgeConfig;

  /** [EN] Quick action items array / [BN] অ্যাকশন আইটেমস অ্যারে */
  readonly actions?: readonly WidgetActionItem[];

  /** [EN] Custom extra React node in header / [BN] কাস্টম অতিরিক্ত হেডার উপাদান */
  readonly headerExtra?: React.ReactNode;

  /** [EN] Whether widget supports collapsing / [BN] কোল্যাপ্স সমর্থন করে কি না */
  readonly collapsible?: boolean;

  /** [EN] Current collapsed state / [BN] বর্তমান কোল্যাপ্সড অবস্থা */
  readonly isCollapsed?: boolean;

  /** [EN] Toggle collapse handler / [BN] কোল্যাপ্স টগল ইভেন্ট হ্যান্ডলার */
  readonly onToggleCollapse?: () => void;

  /** [EN] Refresh action callback / [BN] রিফ্রেশ অ্যাকশন কলব্যাক */
  readonly onRefresh?: () => void;

  /** [EN] Refreshing indicator state / [BN] রিফ্রেশিং লোডিং স্টেট */
  readonly isRefreshing?: boolean;

  /** [EN] Additional header container CSS classes / [BN] অতিরিক্ত হেডার সিএসএস ক্লাস */
  readonly className?: string;
}

/**
 * [EN] Properties contract for the unified WidgetContainer component.
 * [BN] ইউনিফাইড WidgetContainer কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface WidgetContainerProps {
  /** [EN] Unique identifier for DOM and testing / [BN] ইউনিক আইডি */
  readonly id?: string;

  /** [EN] Primary title text / [BN] উইজেটের শিরোনাম */
  readonly title?: string;

  /** [EN] Contextual subtitle / [BN] প্রাসঙ্গিক সাবটাইটেল */
  readonly subtitle?: string;

  /** [EN] Leading icon element / [BN] উইজেট হেডার আইকন */
  readonly icon?: React.ReactNode;

  /** [EN] Optional status badge configuration / [BN] স্ট্যাটাস ব্যাজ */
  readonly badge?: WidgetBadgeConfig;

  /** [EN] Toolbar actions list / [BN] অ্যাকশন বাটন তালিকা */
  readonly actions?: readonly WidgetActionItem[];

  /** [EN] Custom header extra node / [BN] অতিরিক্ত কাস্টম হেডার নোড */
  readonly headerExtra?: React.ReactNode;

  /** [EN] Child nodes representing widget body / [BN] উইজেটের মূল বডি কন্টেন্ট */
  readonly children: React.ReactNode;

  /** [EN] Visual variant / [BN] ভিজ্যুয়াল ভ্যারিয়েন্ট */
  readonly variant?: WidgetVariant;

  /** [EN] Data loading state (renders skeleton / spinner overlay) / [BN] ডেটা লোডিং স্টেট */
  readonly isLoading?: boolean;

  /** [EN] Human-readable error message (renders error fallback with retry) / [BN] মানবিক এরর মেসেজ */
  readonly error?: string | null;

  /** [EN] Retry callback when error is present / [BN] এরর পুনর্চেষ্টার কলব্যাক */
  readonly onRetry?: () => void;

  /** [EN] Whether widget body is collapsible / [BN] উইজেট বডি কোল্যাপ্সযোগ্য কি না */
  readonly collapsible?: boolean;

  /** [EN] Initial collapsed state (default: false) / [BN] প্রাথমিক কোল্যাপ্সড স্টেট */
  readonly defaultCollapsed?: boolean;

  /** [EN] Data refresh callback / [BN] ডেটা রিফ্রেশ কলব্যাক */
  readonly onRefresh?: () => void;

  /** [EN] Data refreshing state for spinner animation / [BN] ডেটা রিফ্রেশিং স্টেট */
  readonly isRefreshing?: boolean;

  /** [EN] Optional footer element / [BN] উইজেটের ঐচ্ছিক ফুটার এলিমেন্ট */
  readonly footer?: React.ReactNode;

  /** [EN] Additional CSS classes for outer container / [BN] বাইরের কন্টেইনার ক্লাস */
  readonly className?: string;

  /** [EN] Additional CSS classes for inner body / [BN] ভেতরের বডি কন্টেন্ট ক্লাস */
  readonly bodyClassName?: string;
}

/**
 * [EN] Trend direction type for metric KPI widgets.
 * [BN] কেপিআই মেট্রিক উইজেটের ট্রেন্ড দিক টাইপ।
 */
export type MetricTrendDirection = 'up' | 'down' | 'neutral';

/**
 * [EN] Properties contract for the specialized WidgetMetricCard component.
 * [BN] বিশেষায়িত WidgetMetricCard কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface WidgetMetricCardProps {
  /** [EN] Unique card identifier / [BN] কার্ডের ইউনিক আইডি */
  readonly id?: string;

  /** [EN] Metric title label (e.g. "Cutting Efficiency") / [BN] মেট্রিক টাইটেল */
  readonly title: string;

  /** [EN] Primary numeric or formatted value (e.g. "94.8%") / [BN] মূল সংখ্যা বা মান */
  readonly value: string | number;

  /** [EN] Subtitle or domain description / [BN] সাবটাইটেল বা ডোমেন নোট */
  readonly subtitle?: string;

  /** [EN] Leading thematic icon / [BN] থিমেটিক আইকন */
  readonly icon?: React.ReactNode;

  /** [EN] Trend percentage change or delta text (e.g. "+3.2%") / [BN] ট্রেন্ড ডেল্টা মান */
  readonly trendDelta?: string;

  /** [EN] Trend direction indicator / [BN] ট্রেন্ড দিক */
  readonly trendDirection?: MetricTrendDirection;

  /** [EN] Trend comparative context (e.g. "vs last month") / [BN] তুলনামূলক প্রেক্ষাপট */
  readonly trendContext?: string;

  /** [EN] Status badge configuration / [BN] স্ট্যাটাস ব্যাজ */
  readonly badge?: WidgetBadgeConfig;

  /** [EN] Visual accent color variant / [BN] অ্যাকসেন্ট কালার ভ্যারিয়েন্ট */
  readonly accentVariant?: 'primary' | 'success' | 'warning' | 'danger';

  /** [EN] Loading state / [BN] লোডিং অবস্থা */
  readonly isLoading?: boolean;

  /** [EN] Optional click action / [BN] ক্লিক অ্যাকশন */
  readonly onClick?: () => void;

  /** [EN] Additional CSS classes / [BN] অতিরিক্ত ক্লাস */
  readonly className?: string;
}
