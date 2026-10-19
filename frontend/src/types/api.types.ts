/**
 * =============================================================================
 * [EN] Enterprise REST API Response and Error Contract Types
 * [BN] এন্টারপ্রাইজ REST API রেসপন্স ও এরর কন্ট্রাক্ট টাইপসমূহ (রুল ২৫ অনুবর্তী)
 * =============================================================================
 * [EN] Strictly mirrors backend ApiResponse<T> envelope and server-side validation models.
 * [BN] ব্যাকএন্ডের ApiResponse<T> এনভেলপ এবং সার্ভার-সাইড ভ্যালিডেশন মডেলের সাথে হুবহু সামঞ্জস্যপূর্ণ।
 */

/**
 * [EN] Standardized envelope returned by all backend REST API endpoints.
 * [BN] ব্যাকএন্ডের সকল রেস্ট এপিআই এন্ডপয়েন্ট থেকে ফেরত পাঠানো প্রমিত এনভেলপ।
 */
export interface ApiResponse<T = unknown> {
  /** [EN] Execution outcome (true = success, false = failure) / [BN] ফলাফল ফ্ল্যাগ */
  success: boolean;

  /** [EN] User-facing humanized notification message / [BN] মানবিক নোটিফিকেশন বার্তা */
  message: string;

  /** [EN] Typed payload data (or validation field errors map on HTTP 422) / [BN] মূল ডেটা */
  data?: T;

  /** [EN] Error category or system error code / [BN] এরর ক্যাটাগরি কোড */
  error?: string;

  /** [EN] ISO-8601 UTC timestamp of response / [BN] রেসপন্সের ISO-8601 টাইমস্ট্যাম্প */
  timestamp: string;

  /** [EN] Originating API request path / [BN] এপিআই রিকোয়েস্ট পাথ */
  path?: string;
}

/**
 * [EN] Map of field-level validation errors returned by the server on HTTP 422/400.
 * [BN] HTTP 422/400 এররে সার্ভারের পাঠানো ফিল্ড-ভিত্তিক ভ্যালিডেশন এরর মেসেজ ম্যাপ।
 */
export type FieldErrors = Record<string, string>;

/**
 * [EN] Standard paginated response structure for high-density enterprise grids.
 * [BN] এন্টারপ্রাইজ গ্রিডের জন্য স্ট্যান্ডার্ড পেজিনেটেড রেসপন্স অবজেক্ট।
 */
export interface PaginatedResponse<T> {
  /** [EN] Array of entities for the current page / [BN] চলতি পেজের রেকর্ড তালিকা */
  content: T[];

  /** [EN] Current zero-indexed page number / [BN] পেজ নম্বর (০ ভিত্তিক) */
  pageNumber: number;

  /** [EN] Number of items per page / [BN] প্রতি পেজের আকার */
  pageSize: number;

  /** [EN] Total count of records across all pages / [BN] মোট রেকর্ডের সংখ্যা */
  totalElements: number;

  /** [EN] Total number of pages / [BN] মোট পেজ সংখ্যা */
  totalPages: number;

  /** [EN] Whether current page is the last page / [BN] এটি শেষ পেজ কি না */
  isLast: boolean;
}

/**
 * [EN] Normalized application error extracted from Axios or Network failures.
 * [BN] এক্সিওস বা নেটওয়ার্ক ফেইলিউর থেকে সংগৃহীত প্রমিত অ্যাপ্লিকেশন এরর অবজেক্ট।
 */
export interface ApiError {
  /** [EN] Humanized error message for toast / [BN] টোস্টের উপযোগী মানবিক বার্তা */
  message: string;

  /** [EN] HTTP status code (e.g. 400, 401, 403, 404, 422, 500) / [BN] HTTP স্ট্যাটাস */
  status?: number;

  /** [EN] Specific field-level validation errors from server / [BN] সার্ভার ফিল্ড এরর */
  fieldErrors?: FieldErrors;

  /** [EN] Raw error code / [BN] র এরর কোড */
  code?: string;
}
