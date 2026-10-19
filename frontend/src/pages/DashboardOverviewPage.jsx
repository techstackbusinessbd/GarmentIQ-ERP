import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { PageShell } from '../components/layout/PageShell';
import { Shirt, Scissors, Activity, Waves, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * [EN] Dashboard Overview Page.
 * Default landing view inside AppLayout showing factory-wide KPIs.
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
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs flex items-center gap-2">
            <TrendingUp size={14} />
            <span>Generate Shift Report</span>
          </button>
        }
      />

      {/* 1. Global KPI Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Orders (PO)</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Shirt size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">48 Styles</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">1.2M Pcs in Pipeline</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cut Plan Efficiency</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Scissors size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">84.6%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Marker Wastage: 1.4%</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sewing Efficiency</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">71.2%</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Target: 75.0% (18 Lines)</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Laundry Wash Batches</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Waves size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">14 Active</div>
          <div className="text-[11px] text-sky-600 font-medium mt-1">Garment Dyeing & Enzyme</div>
        </div>
      </div>

      {/* 2. Welcome State Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Enterprise RMG Platform Foundation Ready
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          The core architecture, centralized design tokens, and page-driven routing system are fully active.
          Navigate through the master sidebar to explore individual bounded contexts including Merchandising,
          Cutting, Sewing, and Industrial Wash.
        </p>
      </div>
    </PageShell>
  );
};

export default DashboardOverviewPage;
