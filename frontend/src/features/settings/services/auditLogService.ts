/**
 * =============================================================================
 * [EN] Enterprise System Audit Log & Security Trail Service (auditLogService.ts)
 * [BN] এন্টারপ্রাইজ সিস্টেম অডিট লগ ও সিকিউরিটি ট্রেইল সার্ভিস (auditLogService.ts)
 * =============================================================================
 * [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] সরাসরি ব্যাকএন্ড স্প্রিং বুট এপিআই (/settings/audit-logs) থেকে অডিট লগ ফেচ ও সংরক্ষণ করে।
 */

import { apiClient } from '@/services/apiClient';
import { formatLocalDateTime } from '@/utils';

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';

export type AuditCategory =
  | 'SECURITY_POLICY'
  | 'USER_MANAGEMENT'
  | 'ROLE_MANAGEMENT'
  | 'TENANT_MANAGEMENT'
  | 'AUTO_CODE'
  | 'FACTORY_SHIFTS'
  | 'CURRENCY_RATE'
  | 'AUTH_EVENT'
  | 'MERCHANDISING'
  | 'MASTER_LIBRARY';

export interface AuditLogEntry {
  id: string;
  tenantId?: string;
  tenantCode?: string;
  tenantName?: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  actorFullName?: string;
  actorEmail?: string;
  actorDesignation?: string;
  actorDepartment?: string;
  category: AuditCategory;
  action: string;
  targetResource: string;
  details: string;
  severity: AuditSeverity;
  ipAddress: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

export const auditLogService = {
  /**
   * [EN] Fetch audit logs sorted by timestamp descending with optional client tenantId and actor filters
   * [BN] সর্বাধুনিক সময় অনুযায়ী সাজানো অডিট লগ ফেচ করা (ঐচ্ছিক ক্লায়েন্ট টেন্যান্ট আইডি ও অ্যাক্টর ইউজার ফিল্টারসহ)
   */
  getAuditLogs: async (page = 0, size = 50, tenantId?: string, actor?: string): Promise<AuditLogEntry[]> => {
    try {
      const params: Record<string, unknown> = { page, size };
      if (tenantId && tenantId !== 'ALL') {
        params.tenantId = tenantId;
      }
      if (actor && actor !== 'ALL') {
        params.actor = actor;
      }
      const response = await apiClient.get<PageResponse<AuditLogEntry>>('/settings/audit-logs', {
        params,
      });
      return response.data?.content || [];
    } catch {
      return [];
    }
  },

  /**
   * [EN] Record a new audit log entry in PostgreSQL
   * [BN] ডেটাবেজে নতুন অডিট লগ এন্ট্রি যোগ করা
   */
  logEntry: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> => {
    try {
      await apiClient.post('/settings/audit-logs', entry);
    } catch {
      // Non-blocking background log
    }
  },

  /**
   * [EN] Export logs as CSV string
   * [BN] সিএসভি ফরম্যাটে লগ এক্সপোর্ট করা
   */
  exportToCsv: (logs: AuditLogEntry[]): string => {
    const header = 'Timestamp,Actor,Role,Category,Action,Target,Details,Severity,IP\n';
    const rows = logs
      .map(
        (l) =>
          `"${formatLocalDateTime(l.timestamp)}","${l.actor}","${l.actorRole}","${l.category}","${l.action}","${l.targetResource}","${(l.details || '').replace(/"/g, '""')}","${l.severity}","${l.ipAddress}"`
      )
      .join('\n');
    return header + rows;
  },
};
