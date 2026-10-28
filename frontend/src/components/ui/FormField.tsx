/**
 * =============================================================================
 * [EN] Enterprise Form Field Wrapper Component (FormField.tsx)
 * [BN] এন্টারপ্রাইজ ফর্ম ফিল্ড র‍্যাপার কম্পোনেন্ট (রুল ০৭, ১৫, ২০ ও ২৫)
 * =============================================================================
 * [EN] Provides consistent label, required asterisk, helper text, and server error.
 * [BN] সামঞ্জস্যপূর্ণ লেবেল, রিকোয়ার্ড লাল এস্টারিস্ক, সহায়ক ক্যাপশন ও এরর প্রদর্শন।
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  readonly id?: string;
  readonly label?: string;
  readonly required?: boolean;
  readonly helperText?: string;
  readonly error?: string | null;
  readonly className?: string;
  readonly children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  helperText,
  error,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-text-primary select-none"
        >
          {label}
          {required && (
            <span className="text-status-danger ml-0.5" title="Required field">
              *
            </span>
          )}
        </label>
      )}

      <div>{children}</div>

      {error ? (
        <p className="text-[11px] font-medium text-status-danger flex items-center gap-1 mt-1 animate-fadeIn">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-text-muted mt-0.5 leading-tight">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
