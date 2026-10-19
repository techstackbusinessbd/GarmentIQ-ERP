import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';

/**
 * [EN] Master App Component with Page-Driven React Router v7 configuration.
 * Strictly adheres to ADR-005: Every major workflow has a dedicated page route.
 *
 * [BN] মাস্টার অ্যাপ কম্পোনেন্ট যা পেজ-ড্রিভেন রাউটার কনফিগারেশন নিশ্চিত করে।
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          {/* Catch-all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
