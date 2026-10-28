/**
 * =============================================================================
 * [EN] Multi-Tenant Client Domain & Configuration Constants (clientConstants.ts)
 * [BN] ক্লায়েন্ট প্রতিষ্ঠান কনফিগারেশন, শিল্প জোন ও সাবস্ক্রিপশন ধ্রুবকসমূহ
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Zero Inline Data)
 * [BN] তৈরি পোশাক ও ডেনিম কারখানার ক্যাটাগরি, শিল্প জোন এবং সাবস্ক্রিপশন প্ল্যানের মেটাডেটা।
 */

export interface BusinessTypeOption {
  readonly id: string;
  readonly label: string;
  readonly badge: string;
  readonly description: string;
  readonly iconName: 'Flame' | 'Shirt' | 'Layers' | 'Building2';
}

export const BUSINESS_TYPES: readonly BusinessTypeOption[] = [
  {
    id: 'DENIM',
    label: 'Denim Specialist',
    badge: 'Woven Denim',
    description: 'Heavy bottom-weights, laser whiskers, 3D scraping, enzyme washing & stone abrasion.',
    iconName: 'Flame',
  },
  {
    id: 'NON_DENIM',
    label: 'Non-Denim Woven',
    badge: 'Twill, Poplin, Chino',
    description: 'Chino pants, cargo trousers, formal dress shirts, active outerwear & jackets.',
    iconName: 'Shirt',
  },
  {
    id: 'BOTH',
    label: 'Both (Denim & Non-Denim)',
    badge: 'Full Woven Suite',
    description: 'Versatile woven manufacturing encompassing both washed denim and non-denim apparel.',
    iconName: 'Layers',
  },
];

export const FACTORY_ZONES: readonly string[] = [
  'Ashulia Industrial Zone (Dhaka)',
  'Gazipur Industrial Area (Konabari / Tongi)',
  'Dhaka EPZ (DEPZ - Savar)',
  'Chittagong EPZ (CEPZ - South)',
  'Karnaphuli EPZ (KEPZ)',
  'Adamjee EPZ (Siddhirganj / Narayanganj)',
  'Comilla EPZ (Chittagong Highway)',
  'Narayanganj Hosiery & Knitting Cluster',
  'Bhaluka Industrial Corridor (Mymensingh)',
  'Mirzapur & Tangail Textile Belt',
  'Other Industrial Area / Export Park',
];

export interface CompanyStructureOption {
  readonly id: 'GROUP_OF_COMPANIES' | 'STANDALONE_FACTORY';
  readonly name: string;
  readonly badge: string;
  readonly description: string;
}

export const COMPANY_STRUCTURES: readonly CompanyStructureOption[] = [
  {
    id: 'GROUP_OF_COMPANIES',
    name: 'Group of Companies (Conglomerate)',
    badge: 'MULTI-PLANT',
    description: 'Central corporate group governing multiple factories, spinning mills, and laundry plants.',
  },
  {
    id: 'STANDALONE_FACTORY',
    name: 'Single Company (Standalone Factory)',
    badge: 'SINGLE-PLANT',
    description: 'Independent apparel manufacturing company with combined administration and factory floor.',
  },
];

export interface HostingModelOption {
  readonly id: 'CLOUD_SAAS' | 'SELF_HOSTED';
  readonly name: string;
  readonly badge: string;
  readonly description: string;
}

export const HOSTING_MODELS: readonly HostingModelOption[] = [
  {
    id: 'CLOUD_SAAS',
    name: 'GarmentIQ Managed Cloud (SaaS)',
    badge: 'SUBDOMAIN ROUTING',
    description: 'Cloud deployment with instant subdomain allocation, automated backups, and 24/7 SLA.',
  },
  {
    id: 'SELF_HOSTED',
    name: 'Self-Hosted / Private Server (On-Premise)',
    badge: 'CUSTOM DOMAIN / IP',
    description: 'Hosted on client private data center, Dell/HPE server rack, or private VPC network.',
  },
];

export interface SubscriptionPlanOption {
  readonly id: string;
  readonly name: string;
  readonly tierBadge: string;
  readonly isPopular?: boolean;
  readonly description: string;
  readonly features: readonly string[];
}

export const SUBSCRIPTION_PLANS: readonly SubscriptionPlanOption[] = [
  {
    id: 'ENTERPRISE',
    name: 'Enterprise Titanium',
    tierBadge: 'EXPORTER CHOICE',
    isPopular: true,
    description: 'Full Order-to-Shipment (O2S) + UHF Gen2 RFID + Denim Laundry & DPP Compliance.',
    features: [
      'Unlimited Sewing Lines & Real-Time Floor Terminals',
      'UHF Gen2 RFID Bundle & Garment Tracking',
      'Industrial Laundry (Wet/Dry/Laser) Process Engine',
      'Digital Product Passport (DPP, GOTS, OEKO-TEX)',
      'Sub-200ms Enterprise SLA & Dedicated Account Support',
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional Woven/Denim',
    tierBadge: 'GROWING FACTORIES',
    isPopular: false,
    description: 'Core ERP + 2D Barcode Bundle Management + Standard Costing & Subcontracting.',
    features: [
      'Up to 32 Active Sewing Lines',
      '2D QR / Code128 Bundle Ticket Generation',
      'Marker Ratio, Cutting & Sewing Floor Balancing',
      'Commercial Invoicing & Customs Shipping Manifests',
      'Standard Business Hours SLA & Cloud Backups',
    ],
  },
  {
    id: 'STARTER',
    name: 'Core Merchandising',
    tierBadge: 'SOURCING & APPAREL',
    isPopular: false,
    description: 'Style Repository + Buyer PO Tracking + Fabric Booking & Central Inventory.',
    features: [
      'Up to 10 Sewing Lines or Sourcing Offices',
      'Style Tech-Pack & BOM Specification Archive',
      'Fabric & Trims Consumption Calculation',
      'Supplier & Mill Procurement Tracking',
      'Community Ticket Support',
    ],
  },
];
