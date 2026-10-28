/**
 * =============================================================================
 * [EN] Logistics, QC, Shipping & Settings Routes (logisticsRoutes.tsx)
 * [BN] লজিস্টিকস, কিউসি, শিপিং ও সেটিংস রাউটস (logisticsRoutes.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] ক্লায়েন্ট অ্যাপ (/app/*) কোয়ালিটি, কার্টনিং, কমার্শিয়াল ও সিস্টেম সেটিংস রাউটসমূহ।
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ModulePlaceholderPage } from '@/pages';

export const renderLogisticsAndSystemRoutes = (): React.ReactNode => (
  <>
    {/* Quality & AQL Audit */}
    <Route
      path="/app/quality"
      element={
        <ModulePlaceholderPage
          title="Quality & AQL Audit"
          domain="Domain 07: Quality"
          description="Sewing inline inspection, end-line QC traffic lights, and final AQL 2.5 export audit."
        />
      }
    />
    <Route
      path="/app/quality/inline"
      element={
        <ModulePlaceholderPage
          title="Inline & Endline QC"
          domain="Domain 07: Quality"
          description="Line defect mapping, 7-0 traffic light inspection, and DHU calculation."
        />
      }
    />
    <Route
      path="/app/quality/aql-audit"
      element={
        <ModulePlaceholderPage
          title="Final AQL Audit"
          domain="Domain 07: Quality"
          description="Pre-shipment buyer specification AQL audit, carton sample checks, and pass/fail certificates."
        />
      }
    />

    {/* Finishing & Carton Packing */}
    <Route
      path="/app/packing"
      element={
        <ModulePlaceholderPage
          title="Carton RFID Packing"
          domain="Domain 08: Finishing & Packing"
          description="Garment finishing press, metal detector verification, and carton packing."
        />
      }
    />
    <Route
      path="/app/packing/cartons"
      element={
        <ModulePlaceholderPage
          title="Master Cartons"
          domain="Domain 08: Finishing & Packing"
          description="Assorted and solid size-color carton RFID packing and barcode scanning."
        />
      }
    />
    <Route
      path="/app/packing/gate-pass"
      element={
        <ModulePlaceholderPage
          title="RFID Gate Pass"
          domain="Domain 08: Finishing & Packing"
          description="Warehouse dispatch RFID tunnel scanner, auto-verification, and e-gate pass."
        />
      }
    />

    {/* Commercial & Shipments */}
    <Route
      path="/app/commercial"
      element={
        <ModulePlaceholderPage
          title="Commercial & Shipments"
          domain="Domain 09: Commercial"
          description="Export invoices, packing lists, forwarder handover, and shipment logistics."
        />
      }
    />
    <Route
      path="/app/commercial/invoices"
      element={
        <ModulePlaceholderPage
          title="Export Invoices"
          domain="Domain 09: Commercial"
          description="Commercial export invoices, HS codes, and customs documentation."
        />
      }
    />
    <Route
      path="/app/commercial/shipments"
      element={
        <ModulePlaceholderPage
          title="Container Dispatch"
          domain="Domain 09: Commercial"
          description="Container loading, bill of lading (BL) tracking, and port dispatch."
        />
      }
    />

    {/* Backward Compatibility Redirect Aliases for Logistics */}
    <Route path="/quality" element={<Navigate to="/app/quality" replace />} />
    <Route path="/quality/*" element={<Navigate to="/app/quality" replace />} />
    <Route path="/packing" element={<Navigate to="/app/packing" replace />} />
    <Route path="/packing/*" element={<Navigate to="/app/packing" replace />} />
    <Route path="/commercial" element={<Navigate to="/app/commercial" replace />} />
    <Route path="/commercial/*" element={<Navigate to="/app/commercial" replace />} />
    <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

    {/* Default Fallback Redirect */}
    <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
  </>
);
