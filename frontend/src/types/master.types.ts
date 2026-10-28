/**
 * =============================================================================
 * [EN] Global RMG Master Reference Data Types
 * [BN] তৈরি পোশাক শিল্পের গ্লোবাল মাস্টার রেফারেন্স ডেটা টাইপসমূহ
 * =============================================================================
 */

/**
 * [EN] Standard measurement unit representation.
 * [BN] প্রমিত পরিমাপের একক ডেটা মডেল।
 */
export interface MasterUnit {
  /** [EN] Unit UUID / [BN] এককের ইউনিক আইডি */
  id: string;

  /** [EN] Standard unit code (e.g. PCS, YDS, DZN) / [BN] এককের কোড */
  unitCode: string;

  /** [EN] Full descriptive unit title (e.g. Pieces, Yards) / [BN] এককের নাম */
  unitName: string;

  /** [EN] Material category (e.g. GENERAL, FABRIC, TRIM) / [BN] ক্যাটাগরি */
  unitCategory: string;

  /** [EN] Active unit flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;

  /** [EN] System default fallback unit flag / [BN] ডিফল্ট একক কি না */
  isDefault: boolean;
}

/**
 * [EN] Standard apparel size matrix breakdown item.
 * [BN] তৈরি পোশাকের সাইজ গ্রিড আইটেম ডেটা মডেল।
 */
export interface MasterSize {
  /** [EN] Size UUID / [BN] সাইজের ইউনিক আইডি */
  id: string;

  /** [EN] Standard size alphanumeric code (e.g. S, M, L, 32/34) / [BN] সাইজ কোড */
  sizeCode: string;

  /** [EN] Size category (e.g. ALPHA, WAIST_INSEAM) / [BN] সাইজের ধরন */
  sizeCategory: string;

  /** [EN] Visual display sorting sequence order / [BN] ডিসপ্লে সর্টিং ক্রম */
  displayOrder: number;

  /** [EN] Active size flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;
}

/**
 * [EN] Quality inspection standard defect code classification item.
 * [BN] কোয়ালিটি কন্ট্রোল স্ট্যান্ডার্ড ডিফেক্ট কোড ডেটা মডেল।
 */
export interface MasterDefectCode {
  /** [EN] Defect code UUID / [BN] ডিফেক্ট ইউনিক আইডি */
  id: string;

  /** [EN] Defect alphanumeric code (e.g. DEF_STITCH_01) / [BN] ডিফেক্ট কোড */
  defectCode: string;

  /** [EN] Human-readable defect title / [BN] ডিফেক্টের নাম */
  defectName: string;

  /** [EN] Defect operation category (e.g. SEWING, CUTTING, WASHING) / [BN] পর্যায় */
  defectCategory: string;

  /** [EN] Severity classification (e.g. CRITICAL, MAJOR, MINOR) / [BN] তীব্রতা */
  severityLevel: string;

  /** [EN] Active defect code flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;
}

/**
 * [EN] Domain-driven Master Library Entry (Rule 12 & ADR-015).
 * [BN] ডোমেন-ভিত্তিক মাস্টার লাইব্রেরি এন্ট্রি মডেল।
 */
export interface MasterLibraryEntry {
  id: string;
  tenantId?: string;
  domainCode: string;
  entityType: string;
  entryCode: string;
  entryName: string;
  displayOrder: number;
  description?: string;
  attributes?: string | Record<string, unknown>;
  isActive: boolean;
  isSystemSeeded: boolean;
  createdAt?: string;
  updatedAt?: string;
}
