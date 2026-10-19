/**
 * =============================================================================
 * [EN] Master App Component with Page-Driven React Router Configuration
 * [BN] পেজ-ড্রিভেন রিঅ্যাক্ট রাউটার কনফিগারেশন সহ মূল অ্যাপ কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Design Tokens)
 * [BN] রুল ০৭ ও রুল ১৫ মেনে সম্পূর্ণ দ্বিভাষিক কমেন্ট সমৃদ্ধ রুট কম্পোনেন্ট।
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';

/**
 * [EN] Root Application Component.
 * Sets up the browser routing hierarchy, global Sonner toast manager, and default page shells.
 *
 * [BN] মূল অ্যাপ্লিকেশন কম্পোনেন্ট।
 * ব্রাউজার রাউটিং হায়ারার্কি, গ্লোবাল টোস্ট নোটিফিকেশন ম্যানেজার এবং ডিফল্ট পেজ শেল কনফিগার করে।
 *
 * @returns [EN] Rendered root React tree / [BN] রেন্ডারকৃত রিঅ্যাক্ট অ্যাপ্লিকেশন
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* =====================================================================
       * [EN] Global Toast Notification Center (Sonner)
       * [BN] গ্লোবাল টোস্ট নোটিফিকেশন সেন্টার (Sonner)
       * ===================================================================== */}
      <Toaster position="top-right" richColors closeButton />

      {/* =====================================================================
       * [EN] Master Route Hierarchy wrapped in AppLayout Shell
       * [BN] AppLayout শেল দ্বারা আবদ্ধ মাস্টার রুট হায়ারার্কি
       * ===================================================================== */}
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* [EN] Default Foundation Overview View / [BN] ডিফল্ট ফাউন্ডেশন ওভারভিউ ভিউ */}
          <Route
            index
            element={
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* [EN] Dashboard Title Header / [BN] ড্যাশবোর্ড টাইটেল হেডার */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border-subtle gap-2">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-text-primary">
                      Operations Dashboard
                    </h1>
                    <p className="text-xs text-text-muted mt-0.5">
                      Real-time enterprise overview across Woven, Denim & Laundry plants.
                    </p>
                  </div>
                </div>

                {/* [EN] KPI Metrics Cards Grid (4-Column) / [BN] কেপিআই মেট্রিক কার্ডস গ্রিড */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* [EN] KPI Card 1: Buyer POs / [BN] কেপিআই কার্ড ১: বায়ার অর্ডার */}
                  <div className="bg-surface-card border border-border-subtle rounded-card p-4 shadow-xs">
                    <span className="text-xs font-medium text-text-muted">Active Buyer Orders</span>
                    <div className="text-2xl font-bold text-text-primary mt-1 font-mono">142 PO</div>
                    <span className="text-[11px] text-status-success font-medium mt-1 inline-block">
                      ↑ 8.4% vs last week
                    </span>
                  </div>

                  {/* [EN] KPI Card 2: Fabric Roll Stock / [BN] কেপিআই কার্ড ২: ফেব্রিক রোল স্টক */}
                  <div className="bg-surface-card border border-border-subtle rounded-card p-4 shadow-xs">
                    <span className="text-xs font-medium text-text-muted">Fabric In-Stock</span>
                    <div className="text-2xl font-bold text-text-primary mt-1 font-mono">84,250 Yds</div>
                    <span className="text-[11px] text-text-muted font-medium mt-1 inline-block">
                      Ashulia Warehouse
                    </span>
                  </div>

                  {/* [EN] KPI Card 3: Sewing Line Output / [BN] কেপিআই কার্ড ৩: সুইং লাইন আউটপুট */}
                  <div className="bg-surface-card border border-border-subtle rounded-card p-4 shadow-xs">
                    <span className="text-xs font-medium text-text-muted">Sewing Floor Output</span>
                    <div className="text-2xl font-bold text-text-primary mt-1 font-mono">92.4% Eff</div>
                    <span className="text-[11px] text-status-success font-medium mt-1 inline-block">
                      Lines 1 - 12 Active
                    </span>
                  </div>

                  {/* [EN] KPI Card 4: RFID Gate Pass / [BN] কেপিআই কার্ড ৪: আরএফআইডি গেট পাস */}
                  <div className="bg-surface-card border border-border-subtle rounded-card p-4 shadow-xs">
                    <span className="text-xs font-medium text-text-muted">RFID Gate Pass</span>
                    <div className="text-2xl font-bold text-text-primary mt-1 font-mono">1,820 Ctns</div>
                    <span className="text-[11px] text-status-info font-medium mt-1 inline-block">
                      100% Verified
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          {/* [EN] Catch-all redirect to root / [BN] ক্যাচ-অল রিডাইরেক্ট রুট */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
