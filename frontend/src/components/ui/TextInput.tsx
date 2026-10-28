/**
 * =============================================================================
 * [EN] Enterprise Text Input Primitive Component (TextInput.tsx)
 * [BN] এন্টারপ্রাইজ টেক্সট ইনপুট কম্পোনেন্ট (রুল ০৭, ১৫, ২০ ও ২৫)
 * =============================================================================
 * [EN] Standardized h-9 height, micro-radius, icon slots, and token borders.
 * [BN] স্ট্যান্ডার্ড h-9 হাইট, শার্প রেডিয়াস, আইকন স্লট ও সেন্ট্রাল টোকেন নির্ভর স্টাইল।
 */

import React from 'react';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly hasError?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ leftIcon, rightIcon, hasError = false, disabled, readOnly, className = '', ...props }, ref) => {
    const isInteractive = !disabled && !readOnly;

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 flex items-center pointer-events-none text-text-muted shrink-0">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full h-9 text-xs transition-colors rounded-[4px] border font-sans ${
            leftIcon ? 'pl-9' : 'pl-3'
          } ${rightIcon ? 'pr-9' : 'pr-3'} ${
            hasError
              ? 'border-status-danger bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-status-danger/20'
              : isInteractive
              ? 'border-border-subtle bg-surface-card text-text-primary hover:border-border-strong focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'
              : 'border-border-subtle bg-surface-muted/60 text-text-secondary cursor-not-allowed select-none'
          } ${className}`}
        />

        {rightIcon && (
          <span className="absolute right-3 flex items-center text-text-muted shrink-0">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
