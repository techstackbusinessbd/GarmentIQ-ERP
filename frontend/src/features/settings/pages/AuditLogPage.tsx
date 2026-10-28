/**
 * =============================================================================
 * [EN] Enterprise System Audit Log Page Component (AuditLogPage.tsx)
 * [BN] এন্টারপ্রাইজ সিস্টেম ও সিকিউরিটি অডিট লগ পেজ কম্পোনেন্ট (AuditLogPage.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] নিরাপত্তা ইভেন্ট, ব্যবহারকারী ক্রিয়াকলাপ ও সিস্টেম পরিবর্তনের সম্পূর্ণ অডিট ট্রেইল।
 */

import React from 'react';
import { SystemAuditLogsTab } from '../components/SystemAuditLogsTab';

export const AuditLogPage: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <SystemAuditLogsTab />
    </div>
  );
};

export default AuditLogPage;
