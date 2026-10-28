/**
 * =============================================================================
 * [EN] Unified Enterprise Button Component (Button.tsx)
 * [BN] সর্বজনীন এন্টারপ্রাইজ বাটন কম্পোনেন্ট (রুল ০৭, ১৫, ২০ ও ২১)
 * =============================================================================
 * [EN] Design Tokens: Uses central design tokens from index.css.
 * [BN] ডিজাইন টোকেনস: index.css থেকে সেন্ট্রাল কালার টোকেন ও ফন্ট ব্যবহৃত হয়েছে।
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly isLoading?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
  readonly fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-accent hover:bg-accent-hover text-white shadow-xs focus:ring-2 focus:ring-accent/20 active:scale-[0.98]',
  secondary:
    'bg-surface hover:bg-surface-muted text-foreground border border-border shadow-xs focus:ring-2 focus:ring-slate-300/20 active:scale-[0.98]',
  outline:
    'bg-transparent hover:bg-accent/10 text-accent border border-accent focus:ring-2 focus:ring-accent/20 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-surface-muted text-muted-foreground hover:text-foreground focus:ring-0 active:scale-[0.98]',
  danger:
    'bg-danger hover:bg-red-700 text-white shadow-xs focus:ring-2 focus:ring-danger/20 active:scale-[0.98]',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-[11px] gap-1 rounded-[3px]',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[4px]',
  md: 'h-9 px-4 text-xs font-semibold gap-2 rounded-[4px]',
  lg: 'h-10 px-5 text-sm font-semibold gap-2.5 rounded-[6px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
        VARIANT_STYLES[variant]
      } ${SIZE_STYLES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <Loader2 size={size === 'xs' ? 12 : 14} className="animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}

      {children}

      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
    </button>
  );
};

export default Button;
