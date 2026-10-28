/**
 * =============================================================================
 * [EN] Shop Floor Execution Routes (shopFloorRoutes.tsx)
 * [BN] শপ ফ্লোর এক্সিকিউশন রাউটস (shopFloorRoutes.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 21 (Component-based)
 * [BN] ক্লায়েন্ট অ্যাপ (/app/*) কাটিং রুম, প্রিন্ট/এমব্রয়ডারি, সুইং ফ্লোর ও ওয়াশিং প্ল্যান্ট রাউটসমূহ।
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ModulePlaceholderPage } from '@/pages';

export const renderShopFloorRoutes = (): React.ReactNode => (
  <>
    {/* Cutting Room (Domain: cutting) */}
    <Route path="/app/cutting" element={<Navigate to="/app/cutting/markers" replace />} />
    <Route
      path="/app/cutting/markers"
      element={
        <ModulePlaceholderPage
          title="Marker Planning"
          domain="Domain 03: Cutting"
          description="Shrinkage-compensated marker plans, fabric width allowance, and CAD efficiency."
        />
      }
    />
    <Route
      path="/app/cutting/lay-orders"
      element={
        <ModulePlaceholderPage
          title="Cutting Lay Orders"
          domain="Domain 03: Cutting"
          description="Table cutting spreading orders, ply counts, and bundle breakdown tickets."
        />
      }
    />
    <Route
      path="/app/cutting/bundles"
      element={
        <ModulePlaceholderPage
          title="Cut Bundles & QR"
          domain="Domain 03: Cutting"
          description="Cut-piece bundle tickets, QR barcodes, and UHF RFID tag encoding."
        />
      }
    />

    {/* Legacy /app/cad-cutting Redirects */}
    <Route path="/app/cad-cutting" element={<Navigate to="/app/cutting/markers" replace />} />
    <Route path="/app/cad-cutting/markers" element={<Navigate to="/app/cutting/markers" replace />} />
    <Route path="/app/cad-cutting/lay-orders" element={<Navigate to="/app/cutting/lay-orders" replace />} />
    <Route path="/app/cad-cutting/bundles" element={<Navigate to="/app/cutting/bundles" replace />} />

    {/* Embellishment */}
    <Route
      path="/app/embellishment"
      element={
        <ModulePlaceholderPage
          title="Screen Print & Emb"
          domain="Domain 04: Embellishment"
          description="Cut-panel screen printing, digital printing, and high-density embroidery tracking."
        />
      }
    />
    <Route
      path="/app/embellishment/chalan"
      element={
        <ModulePlaceholderPage
          title="Chalan & Dispatch"
          domain="Domain 04: Embellishment"
          description="Print and embroidery dispatch chalans, vendor handover, and receiving inspection."
        />
      }
    />

    {/* Sewing Floor */}
    <Route
      path="/app/sewing"
      element={
        <ModulePlaceholderPage
          title="Sewing Floor & RFID"
          domain="Domain 05: Sewing"
          description="Live sewing line balancing, bundle progression, and real-time operator tracking."
        />
      }
    />
    <Route
      path="/app/sewing/lines"
      element={
        <ModulePlaceholderPage
          title="Line Output & Target"
          domain="Domain 05: Sewing"
          description="Hourly sewing line output targets, line efficiency %, and SMV earned minutes."
        />
      }
    />
    <Route
      path="/app/sewing/bundles"
      element={
        <ModulePlaceholderPage
          title="Live Bundle Scan"
          domain="Domain 05: Sewing"
          description="Sewing operator bundle checkpoint scanning and line bottleneck diagnostics."
        />
      }
    />

    {/* Denim Laundry Plant */}
    <Route
      path="/app/washing"
      element={
        <ModulePlaceholderPage
          title="Denim Laundry Plant"
          domain="Domain 06: Laundry"
          description="Industrial denim washing, wet & dry processes, ozone bleach, and enzyme recipes."
        />
      }
    />
    <Route
      path="/app/washing/recipes"
      element={
        <ModulePlaceholderPage
          title="Wash Recipes"
          domain="Domain 06: Laundry"
          description="Standard denim wash recipes, temperature charts, and liquor ratio parameters."
        />
      }
    />
    <Route
      path="/app/washing/batches"
      element={
        <ModulePlaceholderPage
          title="Active Wash Batches"
          domain="Domain 06: Laundry"
          description="Washing drum load tracking, cycle countdown, and chemical consumption logs."
        />
      }
    />

    {/* Backward Compatibility Redirect Aliases */}
    <Route path="/cad-cutting" element={<Navigate to="/app/cad-cutting" replace />} />
    <Route path="/cad-cutting/*" element={<Navigate to="/app/cad-cutting" replace />} />
    <Route path="/cutting" element={<Navigate to="/app/cad-cutting" replace />} />
    <Route path="/cutting/*" element={<Navigate to="/app/cad-cutting" replace />} />
    <Route path="/embellishment" element={<Navigate to="/app/embellishment" replace />} />
    <Route path="/embellishment/*" element={<Navigate to="/app/embellishment" replace />} />
    <Route path="/sewing" element={<Navigate to="/app/sewing" replace />} />
    <Route path="/sewing/*" element={<Navigate to="/app/sewing" replace />} />
    <Route path="/washing" element={<Navigate to="/app/washing" replace />} />
    <Route path="/washing/*" element={<Navigate to="/app/washing" replace />} />
  </>
);
