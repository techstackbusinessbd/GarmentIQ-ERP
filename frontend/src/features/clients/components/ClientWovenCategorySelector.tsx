/**
 * =============================================================================
 * [EN] Multi-Tenant Client Woven Category Selector (ClientWovenCategorySelector.tsx)
 * [BN] তৈরি পোশাক ওভেন উৎপাদন ক্যাটাগরি সেলেক্টর (রুল ০৭, ১৫, ১৭ ও ২০)
 * =============================================================================
 * [EN] Executive compact 3-card grid for Woven RMG: Denim vs Non-Denim vs Both.
 * [BN] ডেনিম স্পেশালিস্ট, নন-ডেনিম ও উভয় ক্যাটাগরি নির্বাচনের এক্সিকিউটিভ ৩-কার্ড গ্রিড।
 */

import React from 'react';
import { Flame, Shirt, Layers, Check } from 'lucide-react';

export interface ClientWovenCategorySelectorProps {
  readonly value: string;
  readonly onChange: (val: string) => void;
}

interface WovenOption {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: React.ReactNode;
  readonly activeColorClass: string;
}

const WOVEN_OPTIONS: readonly WovenOption[] = [
  {
    id: 'DENIM',
    title: 'Denim Specialist',
    subtitle: 'Woven Bottoms & Wash',
    icon: <Flame size={16} />,
    activeColorClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    id: 'NON_DENIM',
    title: 'Non-Denim Woven',
    subtitle: 'Twill, Chino & Tops',
    icon: <Shirt size={16} />,
    activeColorClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  },
  {
    id: 'BOTH',
    title: 'Both Categories',
    subtitle: 'Denim & Non-Denim',
    icon: <Layers size={16} />,
    activeColorClass: 'bg-brand-accent/15 text-brand-accent border-brand-accent/30',
  },
];

export const ClientWovenCategorySelector: React.FC<ClientWovenCategorySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-text-primary">
          Woven Category <span className="text-status-danger">*</span>
        </label>
        <span className="text-[10px] text-text-muted font-medium">RMG Woven Platform</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {WOVEN_OPTIONS.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-3 rounded-[6px] border transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none flex items-center justify-between text-left group ${
                isSelected
                  ? 'bg-brand-accent/[0.04] border-brand-accent ring-1.5 ring-brand-accent/25 shadow-xs'
                  : 'bg-surface-card hover:bg-surface-muted/40 border-border-subtle hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? opt.activeColorClass
                      : 'bg-surface-muted text-text-muted border-border-subtle group-hover:text-text-primary'
                  }`}
                >
                  {opt.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-text-primary block leading-tight truncate">
                    {opt.title}
                  </span>
                  <span className="text-[10px] text-text-muted block mt-0.5 leading-tight truncate">
                    {opt.subtitle}
                  </span>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1.5 transition-all ${
                  isSelected
                    ? 'bg-brand-accent text-white shadow-xs'
                    : 'border border-border-subtle bg-surface-muted'
                }`}
              >
                {isSelected && <Check size={10} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClientWovenCategorySelector;
