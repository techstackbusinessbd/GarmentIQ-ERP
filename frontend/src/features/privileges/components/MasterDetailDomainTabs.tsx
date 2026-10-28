/**
 * =============================================================================
 * [EN] Master-Detail Domain Navigation Ribbon (MasterDetailDomainTabs.tsx)
 * [BN] মাস্টার-ডিটেল ডোমেন নেভিগেশন রিবন কম্পোনেন্ট (MasterDetailDomainTabs.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ভবিষ্যৎ স্কেলিং-এর জন্য ডোমেন নির্বাচন ট্যাব এবং স্ক্রিন সার্চ রিবন।
 */

import React from 'react';
import { Layers, Search } from 'lucide-react';
import type { MatrixDomainDef } from '../constants/accessMatrixTypes';
import { TextInput } from '@/components/ui/TextInput';

export interface MasterDetailDomainTabsProps {
  readonly domains: readonly MatrixDomainDef[];
  readonly selectedDomainId: string;
  readonly onSelectDomainId: (domainId: string) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
}

export const MasterDetailDomainTabs: React.FC<MasterDetailDomainTabsProps> = ({
  domains,
  selectedDomainId,
  onSelectDomainId,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs">
      {/* Domain Selection Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-0.5">
        <button
          type="button"
          onClick={() => onSelectDomainId('all')}
          className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
            selectedDomainId === 'all'
              ? 'bg-brand-accent text-white border-brand-accent shadow-2xs'
              : 'bg-surface-muted/70 hover:bg-surface-muted text-text-secondary border-border-subtle'
          }`}
        >
          All Domains ({domains.length})
        </button>

        {domains.map((domain) => {
          const isSelected = domain.id === selectedDomainId;
          const totalFeatures = domain.modules.reduce((acc, m) => acc + m.features.length, 0);

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onSelectDomainId(domain.id)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-brand-accent text-white border-brand-accent shadow-2xs'
                  : 'bg-surface-muted/70 hover:bg-surface-muted text-text-secondary border-border-subtle'
              }`}
            >
              <Layers size={12} className={isSelected ? 'text-white' : 'text-brand-accent'} />
              <span>{domain.title}</span>
              <span
                className={`text-[10px] font-mono px-1 py-0.2 rounded-[2px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-surface-card text-text-muted border border-border-subtle'
                }`}
              >
                {totalFeatures}
              </span>
            </button>
          );
        })}
      </div>

      {/* Module/Screen Search Input using standard TextInput component */}
      <div className="w-full sm:w-64 shrink-0">
        <TextInput
          leftIcon={<Search size={13} />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter modules or actions..."
        />
      </div>
    </div>
  );
};
