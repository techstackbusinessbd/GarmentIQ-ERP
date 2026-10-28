/**
 * =============================================================================
 * [EN] Multi-Tenant Organization Data Types
 * [BN] মাল্টি-টেন্যান্ট প্রতিষ্ঠান সংক্রান্ত ডেটা টাইপসমূহ
 * =============================================================================
 * [EN] Represents tenant boundaries, subscription tier, and company metadata.
 * [BN] টেন্যান্ট আইসোলেশন বাউন্ডারি, সাবস্ক্রিপশন প্ল্যান এবং কোম্পানির মেটাডেটা।
 */

/**
 * [EN] Root tenant entity representation.
 * [BN] রুট টেন্যান্ট বা পোশাক কারখানার মূল প্রতিষ্ঠানের তথ্য।
 */
export interface Tenant {
  /** [EN] Unique UUID of the tenant / [BN] টেন্যান্টের ইউনিক UUID */
  id: string;

  /** [EN] Short alphanumeric tenant code (e.g. FACTORY1) / [BN] সংক্ষিপ্ত টেন্যান্ট কোড */
  tenantCode: string;

  /** [EN] Full registered business / factory group name / [BN] প্রতিষ্ঠানের সম্পূর্ণ নাম */
  tenantName: string;

  /** [EN] Company name alias / [BN] কোম্পানি নাম এলিয়াস */
  companyName?: string;

  /** [EN] Contact email address / [BN] যোগাযোগের ইমেইল */
  contactEmail?: string;

  /** [EN] Contact phone / [BN] যোগাযোগের ফোন */
  contactPhone?: string;

  /** [EN] Physical address / [BN] কারখানার ঠিকানা */
  address?: string;

  /** [EN] ERP subscription tier / [BN] সাবস্ক্রিপশন প্ল্যান */
  subscriptionTier?: string;

  /** [EN] Core apparel manufacturing domain / [BN] মূল তৈরি পোশাক ও ডেনিম উৎপাদন ক্ষেত্র */
  businessType?: string;

  /** [EN] Factory cluster or export zone / [BN] শিল্প অঞ্চল বা রফতানি প্রক্রিয়াকরণ অঞ্চল */
  factoryZone?: string;

  /** [EN] Operational sewing lines / [BN] সক্রিয় সুইং লাইনের সংখ্যা */
  sewingLines?: number;

  /** [EN] Daily garment output capacity / [BN] দৈনিক প্রাক্কলিত উৎপাদন সক্ষমতা */
  dailyCapacity?: number;

  /** [EN] In-house washing plant flag / [BN] নিজস্ব ওয়াশিং ও ডায়িং লন্ড্রি প্ল্যান্ট */
  hasWashingPlant?: boolean;

  /** [EN] Trade license number / [BN] ট্রেড লাইসেন্স নম্বর */
  tradeLicenseNo?: string;

  /** [EN] BGMEA / BKMEA export reg no / [BN] বিজিএমইএ মেম্বারশিপ নম্বর */
  bgmeaRegNo?: string;

  /** [EN] Corporate company structure / [BN] প্রাতিষ্ঠানিক কাঠামো */
  companyType?: string;

  /** [EN] Hosting infrastructure type / [BN] হোস্টিং মডেল */
  hostingType?: string;

  /** [EN] Cloud subdomain slug / [BN] ক্লাউড সাবডোমেন স্লাগ */
  subdomain?: string;

  /** [EN] On-premise custom domain / [BN] সেলফ-হোস্টেড কাস্টম ডোমেন */
  customDomain?: string;

  /** [EN] Registered factory units count / [BN] নিবন্ধিত কারখানা ইউনিটের সংখ্যা */
  factoryCount?: number;

  /** [EN] Active tenant flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;

  /** [EN] Soft-deleted flag / [BN] সফট-ডিলিট চিহ্নিতকরণ */
  isDeleted?: boolean;
  deleted?: boolean;

  /** [EN] Creation timestamp in ISO-8601 format / [BN] তৈরির সময় */
  createdAt?: string;

  /** [EN] Last update timestamp in ISO-8601 format / [BN] সর্বশেষ আপডেটের সময় */
  updatedAt?: string;
}

/**
 * [EN] Inbound client factory tenant provisioning payload.
 * [BN] নতুন ক্লায়েন্ট গার্মেন্টস কারখানা নিবন্ধনের ডেটা পে-লোড।
 */
export interface CreateTenantRequest {
  tenantCode?: string;
  tenantName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  subscriptionTier?: string;
  businessType?: string;
  factoryZone?: string;
  sewingLines?: number;
  dailyCapacity?: number;
  hasWashingPlant?: boolean;
  tradeLicenseNo?: string;
  bgmeaRegNo?: string;
  companyType?: string;
  hostingType?: string;
  subdomain?: string;
  customDomain?: string;
  adminFullName?: string;
  adminEmail?: string;
  adminUsername?: string;
  adminPhone?: string;
  adminPassword?: string;
}

/**
 * [EN] Inbound client factory tenant modification payload.
 * [BN] বিদ্যমান ক্লায়েন্ট কারখানা তথ্য হালনাগাদের ডেটা পে-লোড।
 */
export interface UpdateTenantRequest {
  tenantName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  subscriptionTier?: string;
  businessType?: string;
  factoryZone?: string;
  sewingLines?: number;
  dailyCapacity?: number;
  hasWashingPlant?: boolean;
  tradeLicenseNo?: string;
  bgmeaRegNo?: string;
  companyType?: string;
  hostingType?: string;
  subdomain?: string;
  customDomain?: string;
  active?: boolean;
}
