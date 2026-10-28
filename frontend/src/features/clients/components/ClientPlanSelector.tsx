/**
 * =============================================================================
 * [EN] Multi-Tier ERP Subscription Plan Selector Cards (ClientPlanSelector.tsx)
 * [BN] ক্লায়েন্ট ইআরপি সাবস্ক্রিপশন প্ল্যান ও লাইসেন্স সিলেক্টর (রুল ০৭, ১৫ ও ২০)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] এন্টারপ্রাইজ টাইটেনিয়াম, প্রফেশনাল এবং স্টার্টার প্ল্যান কার্ড নির্বাচন।
 */

import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../constants/clientConstants';

export interface ClientPlanSelectorProps {
  readonly subscriptionTier: string;
  readonly onSubscriptionTierChange: (val: string) => void;
}

export const ClientPlanSelector: React.FC<ClientPlanSelectorProps> = ({
  subscriptionTier,
  onSubscriptionTierChange,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-text-primary">
          Subscription Plan <span className="text-status-danger">*</span>
        </label>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-1.5 py-0.5 rounded-[3px]">
          <Sparkles size={11} />
          <span>All Features Included</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 p-1 bg-surface-muted/80 rounded-md border border-border-subtle shadow-inner h-9.5 gap-1">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = subscriptionTier === plan.id;
          const getPlanBadge = () => {
            if (!isSelected) return 'text-text-muted';
            if (plan.id === 'ENTERPRISE') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
            if (plan.id === 'PROFESSIONAL') return 'bg-sky-500/15 text-sky-600 dark:text-sky-400';
            return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
          };

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSubscriptionTierChange(plan.id)}
              className={`flex items-center justify-center gap-2 px-2 text-xs rounded-sm transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${
                isSelected
                  ? 'bg-surface-card text-text-primary font-bold shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-card/40 font-medium'
              }`}
            >
              <div className={`p-1 rounded-[3px] flex items-center justify-center ${getPlanBadge()}`}>
                <Award size={13} />
              </div>
              <span className="truncate">{plan.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClientPlanSelector;
