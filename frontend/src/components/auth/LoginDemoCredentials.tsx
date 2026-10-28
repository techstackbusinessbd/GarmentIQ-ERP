/**
 * =============================================================================
 * [EN] Simplified Demo Credentials Bar (LoginDemoCredentials)
 * [BN] সরলীকৃত টেস্ট ক্রেডেনশিয়াল অটো-ফিল বার
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] এক ক্লিকে ডিফল্ট টেস্ট অ্যাকাউন্ট পূরণের পরিষ্কার অপশন।
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * [EN] Props for LoginDemoCredentials component.
 * [BN] LoginDemoCredentials কম্পোনেন্টের প্রপস।
 */
export interface LoginDemoCredentialsProps {
  /** [EN] Callback invoked with username and password / [BN] ক্রেডেনশিয়াল ফিল করার কলব্যাক */
  onSelectCredentials: (username: string, pass: string) => void;
  /** [EN] Currently entered username for active highlight / [BN] সক্রিয় ইউজারনেম */
  currentUsername?: string;
}

/**
 * [EN] Minimalist Demo Credentials Bar.
 * [BN] এক ক্লিকে পূরণযোগ্য টেস্ট ক্রেডেনশিয়াল বাটন।
 */
export const LoginDemoCredentials: React.FC<LoginDemoCredentialsProps> = ({
  onSelectCredentials,
}) => {
  return (
    <div className="mt-5 pt-4 border-t border-border-subtle">
      <button
        type="button"
        onClick={() => onSelectCredentials('superadmin', 'Password@123')}
        className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] bg-surface-muted hover:bg-surface-hover border border-border-subtle text-xs transition-colors group"
      >
        <span className="flex items-center gap-1.5 text-text-muted group-hover:text-text-primary">
          <Sparkles size={13} className="text-amber-500" />
          <span>Demo Account:</span>
          <strong className="font-mono text-text-primary">superadmin</strong>
        </span>
        <span className="text-[11px] font-semibold text-brand-accent">
          Click to Fill
        </span>
      </button>
    </div>
  );
};
