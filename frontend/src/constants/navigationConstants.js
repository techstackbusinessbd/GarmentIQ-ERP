/**
 * [EN] Centralized Navigation Constants for Garments ERP.
 * Defines the master sidebar navigation menu across all 10 Bounded Contexts.
 * Strictly adheres to Rule 19: Zero inline data in React components.
 *
 * [BN] গার্মেন্টস ইআরপি সেন্ট্রালাইজড নেভিগেশন কনস্ট্যান্টস।
 * সমস্ত ১০টি বাউন্ডেড কনটেক্সটের মাস্টার সাইডবার মেনু সংজ্ঞায়িত করে। রুল ১৯ মেনে জিরো ইনলাইন ডেটা।
 */

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Overview & Analytics',
    path: '/',
    iconName: 'LayoutDashboard',
    badge: null,
  },
  {
    id: 'merchandising',
    label: 'Merchandising & Orders',
    path: '/merchandising/orders',
    iconName: 'Shirt',
    badge: 'O2S',
    children: [
      { id: 'buyer-orders', label: 'Buyer Orders (PO)', path: '/merchandising/orders' },
      { id: 'styles-techpack', label: 'Styles & Techpacks', path: '/merchandising/styles' },
      { id: 'bom-costing', label: 'BOM & Costing', path: '/merchandising/costing' },
    ],
  },
  {
    id: 'fabric-inventory',
    label: 'Fabric & Yarn Warehouse',
    path: '/inventory/rolls',
    iconName: 'Layers',
    badge: null,
    children: [
      { id: 'fabric-rolls', label: 'Fabric Roll Inventory', path: '/inventory/rolls' },
      { id: 'four-point-qc', label: '4-Point QC Inspection', path: '/inventory/inspections' },
    ],
  },
  {
    id: 'cutting-cad',
    label: 'CAD & Cutting Floor',
    path: '/cutting/cut-orders',
    iconName: 'Scissors',
    badge: null,
    children: [
      { id: 'marker-plans', label: 'Marker Plans & Ratio', path: '/cutting/cut-orders' },
      { id: 'bundle-tickets', label: 'Bundle Barcode Generation', path: '/cutting/bundles' },
    ],
  },
  {
    id: 'embellishment',
    label: 'Print & Embroidery (Emb)',
    path: '/embellishment/batches',
    iconName: 'Palette',
    badge: null,
  },
  {
    id: 'sewing-floor',
    label: 'Sewing Floor & Realtime',
    path: '/sewing/lines',
    iconName: 'Activity',
    badge: 'Live',
    children: [
      { id: 'line-efficiency', label: 'Line Balancing & Output', path: '/sewing/lines' },
      { id: 'traffic-light-qc', label: '7-0 QC & DHU Tracker', path: '/sewing/qc' },
    ],
  },
  {
    id: 'industrial-wash',
    label: 'Denim Laundry & Wash',
    path: '/washing/recipes',
    iconName: 'Waves',
    badge: null,
  },
  {
    id: 'commercial-shipping',
    label: 'Commercial & Shipments',
    path: '/commercial/shipments',
    iconName: 'Ship',
    badge: null,
  },
  {
    id: 'rfid-iot-edge',
    label: 'RFID Smart Portals',
    path: '/rfid/scanners',
    iconName: 'Radio',
    badge: 'IoT',
  },
];

export const FACTORY_UNITS = [
  { id: 'UNIT-01', name: 'Woven & Denim Main Plant (Ashulia)' },
  { id: 'UNIT-02', name: 'Industrial Laundry & Garment Dyeing (Gazipur)' },
  { id: 'UNIT-03', name: 'High-Density Screen Print & Emb Unit (Narayanganj)' },
];
