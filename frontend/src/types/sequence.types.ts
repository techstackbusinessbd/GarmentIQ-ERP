/**
 * =============================================================================
 * [EN] Dynamic Auto-Code Generation and Template Data Types (Rule 24)
 * [BN] ডাইনামিক অটো-কোড জেনারেশন ও কনফিগারেবল টেমপ্লেট টাইপসমূহ (রুল ২৪)
 * =============================================================================
 */

/**
 * [EN] Supported ERP entity types for automated code sequence generation.
 * [BN] স্বয়ংক্রিয় কোড সিকোয়েন্স জেনারেশন সমর্থিত ইআরপি এনটিটির তালিকা।
 */
export type EntityTypeCode =
  | 'BUYER'
  | 'STYLE'
  | 'PURCHASE_ORDER'
  | 'CUT_PLAN'
  | 'BUNDLE'
  | 'PRINT_EMB_CHALLAN'
  | 'WASH_CHALLAN'
  | 'CARTON'
  | 'COMMERCIAL_INVOICE';

/**
 * [EN] Sequence counter reset interval frequency.
 * [BN] সিকোয়েন্স কাউন্টার রিসেট করার ফ্রিকোয়েন্সি।
 */
export type ResetFrequency = 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY';

/**
 * [EN] Configurable code sequence formatting template representation.
 * [BN] কনফিগারেবল কোড সিকোয়েন্স ফরম্যাট টেমপ্লেট ডেটা মডেল।
 */
export interface CodeSequenceTemplate {
  /** [EN] Template UUID / [BN] টেমপ্লেটের ইউনিক আইডি */
  id: string;

  /** [EN] Owning tenant UUID / [BN] টেন্যান্ট আইডি */
  tenantId: string;

  /** [EN] Target business entity type / [BN] সংশ্লিষ্ট এনটিটির ধরন */
  entityType: EntityTypeCode;

  /** [EN] Configurable pattern string with tokens / [BN] কনফিগারেবল প্যাটার্ন স্ট্রিং */
  pattern: string;

  /** [EN] Static prefix string / [BN] প্রিফিক্স স্ট্রিং */
  prefix: string;

  /** [EN] Zero-padding digit count / [BN] শূন্য দিয়ে প্যাডিংয়ের দৈর্ঘ্য */
  paddingLength: number;

  /** [EN] Reset interval frequency / [BN] কাউন্টার রিসেট সময়কাল */
  resetFrequency: ResetFrequency;

  /** [EN] Active template flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;

  /** [EN] Creation timestamp / [BN] তৈরির সময় */
  createdAt?: string;

  /** [EN] Last update timestamp / [BN] সর্বশেষ আপডেটের সময় */
  updatedAt?: string;

  /** [EN] Simulated live preview code / [BN] সিমুলেটেড লাইভ প্রিভিউ কোড */
  previewCode?: string;
}

/**
 * [EN] Code sequence template update request payload.
 * [BN] কোড সিকোয়েন্স টেমপ্লেট পরিবর্তনের জন্য রিকোয়েস্ট পে-লোড।
 */
export interface CodeSequenceTemplateUpdate {
  /** [EN] Configurable pattern / [BN] প্যাটার্ন */
  pattern: string;

  /** [EN] Prefix string / [BN] প্রিফিক্স */
  prefix: string;

  /** [EN] Padding length / [BN] প্যাডিং দৈর্ঘ্য */
  paddingLength: number;

  /** [EN] Reset frequency / [BN] রিসেট ফ্রিকোয়েন্সি */
  resetFrequency: ResetFrequency;

  /** [EN] Active flag / [BN] সক্রিয় কি না */
  active: boolean;
}
