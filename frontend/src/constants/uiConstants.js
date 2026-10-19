/**
 * [EN] Centralized UI Constants and Status Configurations for Garments ERP.
 * Strictly adheres to Rule 19 & 20: No inline styles or inline objects in components.
 *
 * [BN] সেন্ট্রালাইজড ইউআই কনস্ট্যান্টস ও স্ট্যাটাস ব্যাজ কনফিগারেশন।
 */

export const STATUS_PILL_CONFIG = {
  ACTIVE: {
    label: 'Active',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    borderClass: 'border-emerald-200/80 dark:border-emerald-800',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    borderClass: 'border-emerald-200/80 dark:border-emerald-800',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    textClass: 'text-amber-700 dark:text-amber-400',
    borderClass: 'border-amber-200/80 dark:border-amber-800',
  },
  DRAFT: {
    label: 'Draft',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40',
    textClass: 'text-sky-700 dark:text-sky-400',
    borderClass: 'border-sky-200/80 dark:border-sky-800',
  },
  CANCELLED: {
    label: 'Cancelled',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    textClass: 'text-rose-700 dark:text-rose-400',
    borderClass: 'border-rose-200/80 dark:border-rose-800',
  },
};

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
