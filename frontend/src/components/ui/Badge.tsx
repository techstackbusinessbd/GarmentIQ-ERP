/**
 * =============================================================================
 * [EN] Enterprise Status Badge Primitive Component (Badge.tsx)
 * [BN] এন্টারপ্রাইজ স্ট্যাটাস ব্যাজ কম্পোনেন্ট (রুল ০৭, ১৫ ও ২০)
 * =============================================================================
 */

import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant;
  readonly icon?: React.ReactNode;
  readonly dot?: boolean;
}

const BADGE_STYLES: Record<BadgeVariant, { bg: string; dot: string }> = {
  success: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
  info: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
  },
  neutral: {
    bg: 'bg-surface-muted text-text-secondary border-border-subtle',
    dot: 'bg-slate-400',
  },
  accent: {
    bg: 'bg-brand-accent-light text-brand-accent border-brand-accent/30',
    dot: 'bg-brand-accent',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const styles = BADGE_STYLES[variant];

  return (
    <span
      {...props}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold border rounded-[3px] select-none ${styles.bg} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
