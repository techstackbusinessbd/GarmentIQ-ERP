/**
 * =============================================================================
 * [EN] Master Library Domain Types & Data Contracts (types.ts)
 * [BN] মাস্টার লাইব্রেরি ডোমেন টাইপস ও ডেটা কনট্রাক্টস (types.ts)
 * =============================================================================
 * [EN] Reference: docs/specifications/TECH_STACK.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Centralized Constants)
 * [BN] গার্মেন্টস ইআরপির ৯টি বাউন্ডেড ডোমেনের কেন্দ্রীয় মাস্টার ডেটা টাইপস।
 */

/**
 * [EN] Bounded Domain Identifiers for Master Reference Libraries
 * [BN] মাস্টার রেফারেন্স লাইব্রেরির ৯টি মূল ডোমেন কোড
 */
export type LibraryDomainCode =
  | 'MERCHANDISING'
  | 'FABRIC'
  | 'CUTTING'
  | 'SEWING'
  | 'WASHING'
  | 'QUALITY'
  | 'PACKING'
  | 'COMMERCIAL'
  | 'GLOBAL';

/**
 * [EN] Entity category types for Merchandising Domain Master Library
 * [BN] মার্চেন্ডাইজিং ডোমেন মাস্টার লাইব্রেরির এনটিটি ক্যাটাগরি
 */
export type MerchEntityType =
  | 'GARMENT_ITEM'
  | 'COLOR'
  | 'SEASON'
  | 'SAMPLE_STAGE'
  | 'SIZE_GRID';

/**
 * [EN] Master Library Entry record contract
 * [BN] মাস্টার লাইব্রেরি এন্ট্রি রেকর্ড কনট্রাক্ট
 */
export interface MasterLibraryEntry {
  readonly id: string;
  readonly tenantId: string;
  readonly domainCode: string;
  readonly entityType: string;
  readonly entryCode: string;
  readonly entryName: string;
  readonly displayOrder: number;
  readonly description?: string | null;
  readonly attributes?: Record<string, unknown> | null;
  readonly isActive: boolean;
  readonly isSystemSeeded: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy?: string | null;
}

/**
 * [EN] Inbound payload to create a new Master Library Entry
 * [BN] নতুন মাস্টার লাইব্রেরি রেকর্ড তৈরির ইনবাউন্ড পেলোড
 */
export interface CreateMasterLibraryEntryPayload {
  readonly domainCode: string;
  readonly entityType: string;
  readonly entryCode: string;
  readonly entryName: string;
  readonly displayOrder?: number;
  readonly description?: string;
  readonly attributes?: Record<string, unknown>;
}

/**
 * [EN] Inbound payload to update an existing Master Library Entry
 * [BN] বিদ্যমান মাস্টার লাইব্রেরি রেকর্ড আপডেটের ইনবাউন্ড পেলোড
 */
export interface UpdateMasterLibraryEntryPayload {
  readonly entryName: string;
  readonly displayOrder?: number;
  readonly description?: string;
  readonly attributes?: Record<string, unknown>;
  readonly isActive?: boolean;
}
