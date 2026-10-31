/**
 * =============================================================================
 * [EN] Domain 01 Merchandising Types & DTO Contracts (merchandising.types.ts)
 * [BN] ডোমেন ০১ মার্চেন্ডাইজিং টাইপস ও ডিটিও ইন্টারফেস (merchandising.types.ts)
 * =============================================================================
 */

export type BuyerType = 'DIRECT' | 'BUYING_HOUSE' | 'AGENT' | 'IMPORTER' | 'DOMESTIC';
export type BuyerStatus = 'ACTIVE' | 'INACTIVE';
export type ComplianceStatus = 'COMPLIANT' | 'CONDITIONAL' | 'AUDIT_PENDING';

export interface BuyerBrand {
  id: string;
  tenantId: string;
  buyerId: string;
  brandCode: string;
  brandName: string;
  targetMarket?: string;
  seasonPattern: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: BuyerStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Buyer {
  id: string;
  tenantId: string;
  buyerCode: string;
  buyerName: string;
  shortName?: string;
  buyerType: BuyerType;
  commissionPercentage: number;
  countryOfOrigin: string;
  headquartersAddress?: string;
  contactPersonName?: string;
  contactEmail?: string;
  contactPhone?: string;
  defaultCurrency: string;
  paymentTerms: string;
  creditPeriodDays: number;
  complianceStatus: ComplianceStatus;
  status: BuyerStatus;
  notes?: string;
  brandCount?: number;
  brands?: BuyerBrand[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateBuyerPayload {
  buyerCode?: string;
  buyerName: string;
  shortName?: string;
  buyerType: BuyerType;
  commissionPercentage: number;
  countryOfOrigin: string;
  headquartersAddress?: string;
  contactPersonName?: string;
  contactEmail?: string;
  contactPhone?: string;
  defaultCurrency: string;
  paymentTerms: string;
  creditPeriodDays: number;
  complianceStatus: ComplianceStatus;
  status: BuyerStatus;
  notes?: string;
}

export interface UpdateBuyerPayload {
  buyerName: string;
  shortName?: string;
  buyerType: BuyerType;
  commissionPercentage: number;
  countryOfOrigin: string;
  headquartersAddress?: string;
  contactPersonName?: string;
  contactEmail?: string;
  contactPhone?: string;
  defaultCurrency: string;
  paymentTerms: string;
  creditPeriodDays: number;
  complianceStatus: ComplianceStatus;
  status: BuyerStatus;
  notes?: string;
}

export interface CreateBuyerBrandPayload {
  brandCode?: string;
  brandName: string;
  targetMarket?: string;
  seasonPattern: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: BuyerStatus;
  notes?: string;
}

export interface UpdateBuyerBrandPayload {
  brandName: string;
  targetMarket?: string;
  seasonPattern: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: BuyerStatus;
  notes?: string;
}

