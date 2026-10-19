/**
 * ==============================================================================
 * [EN] Reusable Enterprise MetricCard Primitive Component
 * [BN] রিইউজেবল এন্টারপ্রাইজ মেট্রিক কার্ড প্রিমিটিভ কম্পোনেন্ট
 *
 * Rules Compliant:
 * - Rule 07: File length under 300 lines
 * - Rule 15: Bilingual commenting (EN/BN)
 * - Rule 20: 100% Driven by centralized theme tokens
 * - Rule 21: Component-based UI/UX primitive
 * ==============================================================================
 */

import React from 'react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'brand',
}) => {
  const variantStyles = {
    brand: 'bg-brand-accent-light/60 text-brand-accent',
    success: 'bg-status-success-bg text-status-success',
    warning: 'bg-status-warning-bg text-status-warning',
    info: 'bg-status-info-bg text-status-info',
    danger: 'bg-status-danger-bg text-status-danger',
  };

  const iconClass = variantStyles[variant] || variantStyles.brand;

  return (
    <div className="bg-surface-card border border-border-subtle rounded-xl p-5 shadow-xs transition-all duration-200 hover:border-brand-accent/40">
      <div className="flex items-center justify-between text-text-muted mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconClass}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text-primary font-mono tabular-nums">
        {value}
      </div>
      {subtitle && (
        <div className="text-[11px] text-text-muted font-medium mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
