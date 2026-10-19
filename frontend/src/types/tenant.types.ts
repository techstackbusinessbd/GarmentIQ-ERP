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

  /** [EN] Short alphanumeric tenant code (e.g. TEX_BD) / [BN] সংক্ষিপ্ত টেন্যান্ট কোড */
  tenantCode: string;

  /** [EN] Full registered business name / [BN] প্রতিষ্ঠানের সম্পূর্ণ নাম */
  companyName: string;

  /** [EN] ERP subscription tier (e.g. ENTERPRISE, PROFESSIONAL) / [BN] সাবস্ক্রিপশন প্ল্যান */
  subscriptionPlan: string;

  /** [EN] Active tenant flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;

  /** [EN] Creation timestamp in ISO-8601 format / [BN] তৈরির সময় */
  createdAt: string;

  /** [EN] Last update timestamp in ISO-8601 format / [BN] সর্বশেষ আপডেটের সময় */
  updatedAt?: string;
}
