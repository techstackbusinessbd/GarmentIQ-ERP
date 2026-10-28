/**
 * =============================================================================
 * [EN] Master Reference Data Page (MasterDataPage)
 * [BN] মাস্টার রেফারেন্স ডেটা পেজ (MasterDataPage) (রুল ০৭ ও ২১ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] পোশাক শিল্পের গ্লোবাল রেফারেন্স ডেটা ভিউয়ার, রিফ্রেশার ও ইন্টারেক্টিভ স্যান্ডবক্স।
 */

import React, { useState } from 'react';
import { Ruler, Tag, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WidgetMetricCard, PageHeader, Button } from '@/components/ui';
import { useUnits, useSizes, useDefectCodes } from '../hooks/useMasterData';
import { MasterUnitsTable } from '../components/MasterUnitsTable';
import { MasterSizesTable } from '../components/MasterSizesTable';
import { MasterDefectCodesTable } from '../components/MasterDefectCodesTable';
import { UomSelect } from '../components/UomSelect';
import { SizeGridSelect } from '../components/SizeGridSelect';
import { DefectCodeSelect } from '../components/DefectCodeSelect';

type TabType = 'UNITS' | 'SIZES' | 'DEFECTS' | 'SANDBOX';

/**
 * [EN] Master Reference Data Page Component.
 * [BN] মাস্টার রেফারেন্স ডেটা পেজ কম্পোনেন্ট।
 */
export const MasterDataPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('UNITS');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Sandbox test states
  const [demoUom, setDemoUom] = useState<string>('YDS');
  const [demoSize, setDemoSize] = useState<string>('L');
  const [demoDefect, setDemoDefect] = useState<string>('DEF_STITCH_01');

  // TanStack Queries
  const { data: units = [], isLoading: unitsLoading } = useUnits();
  const { data: sizes = [], isLoading: sizesLoading } = useSizes();
  const { data: defectCodes = [], isLoading: defectsLoading } = useDefectCodes();

  /**
   * [EN] Refresh and invalidate all master caches.
   * [BN] সকল মাস্টার ক্যাশ ইনভ্যালিডেট করে নতুন ডেটা রিফেচ করা।
   */
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['master'] });
      toast.success('Master reference data refreshed successfully');
    } catch {
      toast.error('Failed to refresh master data');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* [EN] Unified Page Header & Breadcrumbs / [BN] সমন্বিত পেজ হেডার ও ব্রেডক্রাম্ব */}
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/app/overview' },
          { label: 'Administration', href: '/app/admin/library' },
          { label: 'Master Library' },
        ]}
        title="Master Library"
        subtitle="Standard units of measure, garment sizes, and defect codes."
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
        }
      />

      {/* [EN] KPI Summary Cards (4-Column) / [BN] কেপিআই মেট্রিক কার্ডস গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetMetricCard
          id="kpi-units"
          title="Measurement Units"
          value={`${units.length} Units`}
          subtitle="Standard UOM Catalog"
          icon={<Ruler size={16} />}
          accentVariant="primary"
          isLoading={unitsLoading}
        />
        <WidgetMetricCard
          id="kpi-sizes"
          title="Garment Sizes"
          value={`${sizes.length} Sizes`}
          subtitle="Alpha & Numeric Grids"
          icon={<Tag size={16} />}
          accentVariant="success"
          isLoading={sizesLoading}
        />
        <WidgetMetricCard
          id="kpi-defects"
          title="Defect Codes"
          value={`${defectCodes.length} Codes`}
          subtitle="Inspection Quality Catalog"
          icon={<AlertTriangle size={16} />}
          accentVariant="warning"
          isLoading={defectsLoading}
        />
        <WidgetMetricCard
          id="kpi-status"
          title="Library Status"
          value="Synchronized"
          subtitle="Enterprise Master Cache"
          icon={<Layers size={16} />}
          accentVariant="primary"
          isLoading={isRefreshing}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border-subtle">
        <button
          onClick={() => setActiveTab('UNITS')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'UNITS'
              ? 'border-brand-accent text-brand-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Ruler size={13} />
          <span>Measurement Units ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SIZES')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'SIZES'
              ? 'border-brand-accent text-brand-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Tag size={13} />
          <span>Size Matrices ({sizes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DEFECTS')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'DEFECTS'
              ? 'border-brand-accent text-brand-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <AlertTriangle size={13} />
          <span>Quality Defect Codes ({defectCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SANDBOX')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'SANDBOX'
              ? 'border-brand-accent text-brand-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Layers size={13} />
          <span>Selector Sandbox</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'UNITS' && <MasterUnitsTable units={units} isLoading={unitsLoading} onRefresh={handleRefreshAll} />}
      {activeTab === 'SIZES' && <MasterSizesTable sizes={sizes} isLoading={sizesLoading} onRefresh={handleRefreshAll} />}
      {activeTab === 'DEFECTS' && (
        <MasterDefectCodesTable defectCodes={defectCodes} isLoading={defectsLoading} onRefresh={handleRefreshAll} />
      )}

      {/* Interactive Sandbox Tab */}
      {activeTab === 'SANDBOX' && (
        <div className="bg-surface-card border border-border-subtle rounded-[3px] p-5 space-y-5">
          <div>
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Live Reusable Selector Sandbox
            </h2>
            <p className="text-[11px] text-text-muted mt-1">
              Verify real-time data binding and state management for the core dropdown components
              powering Merchandising, Cutting, and Sewing workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* UOM Selector Demo */}
            <div className="p-3 bg-surface-base/50 border border-border-subtle rounded-[3px] space-y-2">
              <label className="block text-[11px] font-semibold text-text-primary">
                Fabric / Trim Unit of Measure
              </label>
              <UomSelect value={demoUom} onChange={setDemoUom} />
              <div className="text-[10px] text-text-muted pt-1">
                Selected Value: <span className="font-mono font-semibold text-text-primary">{demoUom}</span>
              </div>
            </div>

            {/* Size Selector Demo */}
            <div className="p-3 bg-surface-base/50 border border-border-subtle rounded-[3px] space-y-2">
              <label className="block text-[11px] font-semibold text-text-primary">
                Garment Size Matrix Breakdown
              </label>
              <SizeGridSelect value={demoSize} onChange={setDemoSize} />
              <div className="text-[10px] text-text-muted pt-1">
                Selected Value: <span className="font-mono font-semibold text-text-primary">{demoSize}</span>
              </div>
            </div>

            {/* Defect Code Selector Demo */}
            <div className="p-3 bg-surface-base/50 border border-border-subtle rounded-[3px] space-y-2">
              <label className="block text-[11px] font-semibold text-text-primary">
                Quality Inspection Defect Code
              </label>
              <DefectCodeSelect value={demoDefect} onChange={setDemoDefect} />
              <div className="text-[10px] text-text-muted pt-1">
                Selected Value: <span className="font-mono font-semibold text-text-primary">{demoDefect}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDataPage;
