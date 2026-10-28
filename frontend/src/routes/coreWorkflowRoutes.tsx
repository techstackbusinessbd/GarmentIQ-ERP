/**
 * =============================================================================
 * [EN] Core Workflows & Merchandising Routes (coreWorkflowRoutes.tsx)
 * [BN] কোর ওয়ার্কফ্লোজ ও মার্চেন্ডাইজিং রাউটস (coreWorkflowRoutes.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] ক্লায়েন্ট অ্যাপ (/app/*) ড্যাশবোর্ড, মার্চেন্ডাইজিং ও ইনভেন্টরি রাউটসমূহ।
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { DashboardOverviewPage, ModulePlaceholderPage } from '@/pages';

export const renderCoreWorkflowRoutes = (): React.ReactNode => (
  <>
    {/* Core Overview & Dashboard (Domain: overview, Module: dashboard) */}
    <Route path="/app/overview" element={<Navigate to="/app/overview/dashboard" replace />} />
    <Route path="/app/overview/dashboard" element={<DashboardOverviewPage />} />
    <Route path="/app/dashboard" element={<Navigate to="/app/overview/dashboard" replace />} />

    {/* Merchandising & Orders */}
    <Route
      path="/app/merchandising"
      element={
        <ModulePlaceholderPage
          title="Merchandising & Orders"
          domain="Domain 01: Merchandising"
          description="Buyer purchase order booking, tech-pack style matrices, consumption formulas, and cost sheet budgeting."
        />
      }
    />
    <Route
      path="/app/merchandising/orders"
      element={
        <ModulePlaceholderPage
          title="Buyer Orders (PO)"
          domain="Domain 01: Merchandising"
          description="Buyer purchase order management, order tracking, and size-color booking matrix."
        />
      }
    />
    <Route
      path="/app/merchandising/orders/:id"
      element={
        <ModulePlaceholderPage
          title="Order Detail (PO)"
          domain="Domain 01: Merchandising"
          description="Order details, style specifications, BOM allocation, and delivery milestones."
        />
      }
    />
    <Route
      path="/app/merchandising/styles"
      element={
        <ModulePlaceholderPage
          title="Styles & Tech-Packs"
          domain="Domain 01: Merchandising"
          description="Style master records, tech-pack documents, and measurement grading."
        />
      }
    />
    <Route
      path="/app/merchandising/styles/:id"
      element={
        <ModulePlaceholderPage
          title="Style Detail"
          domain="Domain 01: Merchandising"
          description="Style measurement charts, consumption parameters, and approved samples."
        />
      }
    />
    <Route
      path="/app/merchandising/costing"
      element={
        <ModulePlaceholderPage
          title="BOM & Costing"
          domain="Domain 01: Merchandising"
          description="Fabric consumption, trim budget calculations, and CM cost sheet."
        />
      }
    />

    {/* Fabric & Yarn Warehouse */}
    <Route
      path="/app/inventory"
      element={
        <ModulePlaceholderPage
          title="Fabric & Yarn Warehouse"
          domain="Domain 02: Inventory"
          description="Fabric and yarn stock management, warehouse bins, and procurement status."
        />
      }
    />
    <Route
      path="/app/inventory/rolls"
      element={
        <ModulePlaceholderPage
          title="Roll Stock & Barcode"
          domain="Domain 02: Inventory"
          description="Fabric roll receiving, barcode roll allocation, and warehouse shelf rack tracking."
        />
      }
    />
    <Route
      path="/app/inventory/qc"
      element={
        <ModulePlaceholderPage
          title="4-Point Fabric QC"
          domain="Domain 02: Inventory"
          description="Four-point fabric inspection, penalty point calculation, and defect mapping."
        />
      }
    />

    {/* Backward Compatibility Redirect Aliases */}
    <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
    <Route path="/merchandising" element={<Navigate to="/app/merchandising" replace />} />
    <Route path="/merchandising/orders" element={<Navigate to="/app/merchandising/orders" replace />} />
    <Route path="/merchandising/styles" element={<Navigate to="/app/merchandising/styles" replace />} />
    <Route path="/merchandising/costing" element={<Navigate to="/app/merchandising/costing" replace />} />
    <Route path="/inventory" element={<Navigate to="/app/inventory" replace />} />
    <Route path="/inventory/rolls" element={<Navigate to="/app/inventory/rolls" replace />} />
    <Route path="/inventory/qc" element={<Navigate to="/app/inventory/qc" replace />} />
  </>
);
