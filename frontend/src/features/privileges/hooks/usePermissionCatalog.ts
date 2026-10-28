/**
 * =============================================================================
 * [EN] Dynamic Permission Matrix Catalog Hook (usePermissionCatalog.ts)
 * [BN] ডায়নামিক পারমিশন ম্যাট্রিক্স ক্যাটালগ হুক (usePermissionCatalog.ts)
 * =============================================================================
 * [EN] Rules: Rule 01 (100% Dynamic Data), Rule 05 (Database Single Source of Truth),
 *             Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] ডাটাবেজ থেকে সরাসরি হায়ারার্কিক্যাল প্রিভিলেজ ক্যাটালগ ফেচ করে রেন্ডার করায়।
 */

import { useQuery } from '@tanstack/react-query';
import { permissionService } from '../services/permissionService';
import type { MatrixDomainDef } from '../constants/accessMatrixTypes';

/**
 * [EN] Reactive query hook to fetch the dynamic domain-module-action catalog
 * [BN] ডায়নামিক ডোমেন-মডিউল-অ্যাকশন ক্যাটালগ সংগ্রহের রিঅ্যাক্টিভ কোয়েরি হুক
 *
 * @param domain [EN] Optional domain filter (defaults to 'admin' for Domain 00)
 */
export const usePermissionCatalog = (domain: string = 'admin') => {
  return useQuery<MatrixDomainDef[], Error>({
    queryKey: ['permission-catalog', domain],
    queryFn: () => permissionService.getPermissionCatalog(domain),
    staleTime: 5 * 60 * 1000, // [EN] 5 minutes cache / [BN] ৫ মিনিট ক্যাশ
  });
};
