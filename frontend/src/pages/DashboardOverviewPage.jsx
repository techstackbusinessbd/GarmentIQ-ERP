import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { PageShell } from '../components/layout/PageShell';
import { MetricCard } from '../components/ui/MetricCard';
import { Shirt, Scissors, Activity, Waves, TrendingUp } from 'lucide-react';

/**
 * [EN] Dashboard Overview Page.
 * Default landing view inside AppLayout showing factory-wide KPIs.
 * Built with 100% reusable components (Rule 21) and dynamic theme tokens (Rule 20).
 *
 * [BN] ড্যাশবোর্ড ওভারভিউ পেজ যা ফ্যাক্টরির সামগ্রিক উৎপাদন মেট্রিক্স প্রদর্শন করে।
 */
export const DashboardOverviewPage = () => {
  return (
    <PageShell>
      <PageHeader
        title="Operations & Production Overview"
        subtitle="Real-time Order-to-Shipment (O2S) tracking and shop floor performance across units."
        breadcrumbs={[{ label: 'Executive Dashboard' }]}
        actionSlot={
          <button className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer">
            <TrendingUp size={14} />
            <span>Generate Shift Report</span>
          </button>
        }
      />

      {/* 1. Global KPI Metrics Cards Grid (100% Component-Based - Rule 21) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Active Orders (PO)"
          value="48 Styles"
          subtitle="1.2M Pcs in Pipeline"
          icon={Shirt}
          variant="brand"
        />

        <MetricCard
          title="Cut Plan Efficiency"
          value="84.6%"
          subtitle="Marker Wastage: 1.4%"
          icon={Scissors}
          variant="success"
        />

        <MetricCard
          title="Sewing Efficiency"
          value="71.2%"
          subtitle="Target: 75.0% (18 Lines)"
          icon={Activity}
          variant="warning"
        />

        <MetricCard
          title="Laundry Wash Batches"
          value="14 Active"
          subtitle="Garment Dyeing & Enzyme"
          icon={Waves}
          variant="info"
        />
      </div>

      {/* 2. Welcome State Card */}
      <div className="bg-surface-card border border-border-subtle rounded-card p-6 shadow-xs transition-colors duration-200">
        <h2 className="text-base font-bold text-text-primary mb-2">
          Enterprise RMG Platform Foundation Ready
        </h2>
        <p className="text-xs text-text-muted leading-relaxed max-w-3xl">
          The core architecture, centralized design tokens, and page-driven routing system are fully active.
          Navigate through the master sidebar to explore individual bounded contexts including Merchandising,
          Cutting, Sewing, and Industrial Wash.
        </p>
      </div>
    </PageShell>
  );
};

export default DashboardOverviewPage;
