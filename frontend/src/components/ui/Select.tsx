/**
 * =============================================================================
 * [EN] Enterprise Dropdown Select Primitive Component (Select.tsx)
 * [BN] এন্টারপ্রাইজ ড্রপডাউন সিলেক্ট কম্পোনেন্ট (রুল ০৭, ১৫, ২০ ও ২৫)
 * =============================================================================
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  readonly options: readonly SelectOption[];
  readonly hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, hasError = false, disabled, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          {...props}
          ref={ref}
          disabled={disabled}
          className={`w-full h-9 pl-3 pr-8 text-xs appearance-none rounded-[4px] border font-sans transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-surface-muted/60 disabled:text-text-secondary ${
            hasError
              ? 'border-status-danger bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-status-danger/20'
              : 'border-border-subtle bg-surface-card text-text-primary hover:border-border-strong focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'
          } ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute right-2.5 pointer-events-none text-text-muted shrink-0">
          <ChevronDown size={14} />
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
