/**
 * =============================================================================
 * [EN] Master-Detail 3-Tier Cascading Filter Toolbar (MasterDetailFilterBar.tsx)
 * [BN] মাস্টার-ডিটেল ৩-স্তরের ক্যাসকেডিং ফিল্টার টুলবার (MasterDetailFilterBar.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 29 (Minimal Text)
 * [BN] মিনিমাল ফিল্টারিং: ডোমেন ➔ মডিউল ➔ স্ক্রিন ক্যাসকেডিং ড্রপডাউন ও সার্চ।
 */

import React, { useMemo } from 'react';
import { Layers, Boxes, Compass, Search, RotateCcw, Filter } from 'lucide-react';
import type { MatrixDomainDef } from '../constants/accessMatrixTypes';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

export interface MasterDetailFilterBarProps {
  readonly domains: readonly MatrixDomainDef[];
  readonly selectedDomainId: string;
  readonly onSelectDomainId: (domainId: string) => void;
  readonly selectedModuleId: string;
  readonly onSelectModuleId: (moduleId: string) => void;
  readonly selectedFeatureId: string;
  readonly onSelectFeatureId: (featureId: string) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly onResetFilters: () => void;
}

export const MasterDetailFilterBar: React.FC<MasterDetailFilterBarProps> = ({
  domains,
  selectedDomainId,
  onSelectDomainId,
  selectedModuleId,
  onSelectModuleId,
  selectedFeatureId,
  onSelectFeatureId,
  searchQuery,
  onSearchChange,
  onResetFilters,
}) => {
  // Cascading available modules based on selected domain
  const availableModules = useMemo(() => {
    if (selectedDomainId === 'all') {
      return domains.flatMap((d) => d.modules);
    }
    const domain = domains.find((d) => d.id === selectedDomainId);
    return domain ? domain.modules : [];
  }, [domains, selectedDomainId]);

  // Cascading available submodules/features based on selected module
  const availableFeatures = useMemo(() => {
    if (selectedModuleId === 'all') {
      return availableModules.flatMap((m) => m.features);
    }
    const mod = availableModules.find((m) => m.id === selectedModuleId);
    return mod ? mod.features : [];
  }, [availableModules, selectedModuleId]);

  const domainOptions = useMemo(
    () => [
      { value: 'all', label: 'All Domains', count: domains.length },
      ...domains.map((d) => ({
        value: d.id,
        label: d.title,
        count: d.modules.reduce((acc, m) => acc + m.features.length, 0),
      })),
    ],
    [domains]
  );

  const moduleOptions = useMemo(
    () => [
      { value: 'all', label: 'All Modules', count: availableModules.length },
      ...availableModules.map((m) => ({
        value: m.id,
        label: m.name,
        count: m.features.length,
      })),
    ],
    [availableModules]
  );

  const featureOptions = useMemo(
    () => [
      { value: 'all', label: 'All Screens', count: availableFeatures.length },
      ...availableFeatures.map((f) => ({
        value: f.id,
        label: f.name,
        description: f.path,
      })),
    ],
    [availableFeatures]
  );

  const isFilterActive =
    selectedDomainId !== 'all' ||
    selectedModuleId !== 'all' ||
    selectedFeatureId !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="p-2.5 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs space-y-2">
      {/* Filter Ribbon Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle/60">
        <div className="flex items-center gap-1.5 text-text-primary text-xs font-bold tracking-tight">
          <Filter size={12} className="text-brand-accent" />
          <span>Filters</span>
        </div>

        {isFilterActive && (
          <Button
            variant="ghost"
            size="xs"
            icon={<RotateCcw size={11} />}
            onClick={onResetFilters}
            className="text-text-muted hover:text-rose-600"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Cascading Searchable Combobox Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-end">
        {/* Tier 1: Searchable Domain Combobox */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-text-muted flex items-center gap-1">
            <Layers size={10} className="text-brand-accent" />
            <span>Domain</span>
          </label>
          <SearchableSelect
            options={domainOptions}
            value={selectedDomainId}
            onChange={(val) => {
              onSelectDomainId(val);
              onSelectModuleId('all');
              onSelectFeatureId('all');
            }}
            placeholder="Select domain..."
            searchPlaceholder="Search domains..."
          />
        </div>

        {/* Tier 2: Searchable Module Combobox */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-text-muted flex items-center gap-1">
            <Boxes size={10} className="text-brand-accent" />
            <span>Module</span>
          </label>
          <SearchableSelect
            options={moduleOptions}
            value={selectedModuleId}
            onChange={(val) => {
              onSelectModuleId(val);
              onSelectFeatureId('all');
            }}
            placeholder="Select module..."
            searchPlaceholder="Search modules..."
          />
        </div>

        {/* Tier 3: Searchable Submodule / Feature Combobox */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-text-muted flex items-center gap-1">
            <Compass size={10} className="text-brand-accent" />
            <span>Screen</span>
          </label>
          <SearchableSelect
            options={featureOptions}
            value={selectedFeatureId}
            onChange={onSelectFeatureId}
            placeholder="Select screen..."
            searchPlaceholder="Search screens..."
          />
        </div>

        {/* Tier 4: Keyword Search Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-text-muted flex items-center gap-1">
            <Search size={10} className="text-brand-accent" />
            <span>Search</span>
          </label>
          <TextInput
            leftIcon={<Search size={12} />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search actions..."
          />
        </div>
      </div>
    </div>
  );
};
