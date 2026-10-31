/**
 * =============================================================================
 * [EN] Centralized Buyer UI Constants (buyerConstants.ts)
 * [BN] কেন্দ্রীভূত বায়ার ইউআই কনস্ট্যান্টস (buyerConstants.ts)
 * =============================================================================
 * [EN] Reference: Rule 19 (Centralized UI Constants), Rule 28 (Single-Word Buttons), Rule 29 (Minimal Text)
 */

export const BUYER_TYPE_OPTIONS = [
  { value: 'DIRECT', label: 'Direct' },
  { value: 'BUYING_HOUSE', label: 'Buying House' },
  { value: 'AGENT', label: 'Agent' },
  { value: 'IMPORTER', label: 'Importer' },
  { value: 'DOMESTIC', label: 'Domestic' },
] as const;

export const COMPLIANCE_STATUS_OPTIONS = [
  { value: 'COMPLIANT', label: 'Compliant' },
  { value: 'CONDITIONAL', label: 'Conditional' },
  { value: 'AUDIT_PENDING', label: 'Pending' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
] as const;

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'BDT', label: 'BDT' },
] as const;

export const PAYMENT_TERMS_OPTIONS = [
  { value: 'LC_AT_SIGHT', label: 'LC At Sight' },
  { value: 'LC_AT_60_DAYS', label: 'LC 60 Days' },
  { value: 'LC_AT_90_DAYS', label: 'LC 90 Days' },
  { value: 'TT_ADVANCE', label: 'TT Advance' },
  { value: 'DA', label: 'DA' },
  { value: 'DP', label: 'DP' },
] as const;

export const SEASON_PATTERN_OPTIONS = [
  { value: 'FOUR_SEASONS', label: 'Four Seasons' },
  { value: 'TWO_SEASONS', label: 'Two Seasons' },
  { value: 'YEAR_ROUND', label: 'Year Round' },
] as const;

/**
 * [EN] Standard destination and country of origin list for global RMG buyers
 * [BN] তৈরি পোশাক রফতানি ও আন্তর্জাতিক বায়ারদের দেশসমূহের প্রমিত তালিকা
 */
export const COUNTRY_OPTIONS = [
  { value: 'USA', label: 'United States (USA)' },
  { value: 'United Kingdom', label: 'United Kingdom (UK)' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Spain', label: 'Spain' },
  { value: 'France', label: 'France' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates (UAE)' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'China', label: 'China' },
  { value: 'Hong Kong', label: 'Hong Kong' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'India', label: 'India' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Other', label: 'Other' },
] as const;
