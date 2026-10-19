/**
 * =============================================================================
 * [EN] Centralized Status Badge and Workflow Indicator Constants
 * [BN] সেন্ট্রালাইজড স্ট্যাটাস ব্যাজ ও ওয়ার্কফ্লো ইন্ডিকেটর কনস্ট্যান্টস (রুল ১৯ অনুবর্তী)
 * =============================================================================
 * [EN] Strictly uses design system CSS tokens. Zero inline colors.
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Zero Inline Data)
 * [BN] ডিজাইন সিস্টেমের সিএসএস টোকেন ব্যবহারকারী স্ট্যাটাস কালার ম্যাপিং।
 */

/**
 * [EN] Configuration contract for status pills and domain indicators.
 * [BN] স্ট্যাটাস পিল এবং ডোমেন ব্যাজের কনফিগারেশন কন্ট্রাক্ট।
 */
export interface StatusConfig {
  /** [EN] Humanized English label for UI display / [BN] ইউআইতে প্রদর্শনের জন্য ইংরেজি লেবেল */
  readonly label: string;

  /** [EN] Background styling token class / [BN] ব্যাকগ্রাউন্ড সিএসএস টোকেন ক্লাস */
  readonly bgClass: string;

  /** [EN] Text typography color token class / [BN] টেক্সট কালার টোকেন ক্লাস */
  readonly textClass: string;

  /** [EN] Border line styling token class / [BN] বর্ডার লাইন টোকেন ক্লাস */
  readonly borderClass: string;

  /** [EN] Pulsing or static dot indicator color class / [BN] স্ট্যাটাস ডট ইন্ডিকেটর কালার ক্লাস */
  readonly dotColor: string;
}

/**
 * [EN] RMG Domain Status Pill Configurations.
 * Defines badge colors and labels across Buyer POs, Cutting, Sewing, and Shipments.
 *
 * [BN] আরএমজি ডোমেন স্ট্যাটাস পিল কনফিগারেশনসমূহ।
 * বায়ার অর্ডার, কাটিং, সুইং ও শিপমেন্টের প্রমিত ব্যাজ ও কালার ম্যাপিং।
 */
export const STATUS_CONFIG: Readonly<Record<string, StatusConfig>> = {
  ACTIVE: {
    label: 'Active',
    bgClass: 'bg-status-success-bg',
    textClass: 'text-status-success',
    borderClass: 'border-status-success-border',
    dotColor: 'bg-status-success',
  },
  INACTIVE: {
    label: 'Inactive',
    bgClass: 'bg-surface-muted',
    textClass: 'text-text-muted',
    borderClass: 'border-border-subtle',
    dotColor: 'bg-slate-400',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bgClass: 'bg-status-success-bg',
    textClass: 'text-status-success',
    borderClass: 'border-status-success-border',
    dotColor: 'bg-status-success',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bgClass: 'bg-status-warning-bg',
    textClass: 'text-status-warning',
    borderClass: 'border-status-warning-border',
    dotColor: 'bg-status-warning',
  },
  PENDING: {
    label: 'Pending',
    bgClass: 'bg-status-warning-bg',
    textClass: 'text-status-warning',
    borderClass: 'border-status-warning-border',
    dotColor: 'bg-status-warning',
  },
  DRAFT: {
    label: 'Draft',
    bgClass: 'bg-status-info-bg',
    textClass: 'text-status-info',
    borderClass: 'border-status-info-border',
    dotColor: 'bg-status-info',
  },
  COMPLETED: {
    label: 'Completed',
    bgClass: 'bg-status-success-bg',
    textClass: 'text-status-success',
    borderClass: 'border-status-success-border',
    dotColor: 'bg-status-success',
  },
  CANCELLED: {
    label: 'Cancelled',
    bgClass: 'bg-status-danger-bg',
    textClass: 'text-status-danger',
    borderClass: 'border-status-danger-border',
    dotColor: 'bg-status-danger',
  },
  REJECTED: {
    label: 'Rejected',
    bgClass: 'bg-status-danger-bg',
    textClass: 'text-status-danger',
    borderClass: 'border-status-danger-border',
    dotColor: 'bg-status-danger',
  },
  SHIPPED: {
    label: 'Shipped',
    bgClass: 'bg-status-success-bg',
    textClass: 'text-status-success',
    borderClass: 'border-status-success-border',
    dotColor: 'bg-status-success',
  },
};

/**
 * [EN] Fabric & Garment Quality Defect Severity Configurations.
 * Mapped to 4-point fabric inspection and garment AQL quality audit workflows.
 *
 * [BN] কোয়ালিটি ইন্সপেকশন ও ডিফেক্ট তীব্রতা কনফিগারেশন।
 * ৪-পয়েন্ট ফেব্রিক ও তৈরি পোশাকের AQL অডিট ওয়ার্কফ্লোর সাথে সংযুক্ত।
 */
export const DEFECT_SEVERITY_CONFIG: Readonly<Record<string, StatusConfig>> = {
  CRITICAL: {
    label: 'Critical',
    bgClass: 'bg-status-danger-bg',
    textClass: 'text-status-danger font-bold',
    borderClass: 'border-status-danger-border',
    dotColor: 'bg-status-danger',
  },
  MAJOR: {
    label: 'Major',
    bgClass: 'bg-status-warning-bg',
    textClass: 'text-status-warning font-semibold',
    borderClass: 'border-status-warning-border',
    dotColor: 'bg-status-warning',
  },
  MINOR: {
    label: 'Minor',
    bgClass: 'bg-status-info-bg',
    textClass: 'text-status-info',
    borderClass: 'border-status-info-border',
    dotColor: 'bg-status-info',
  },
};
