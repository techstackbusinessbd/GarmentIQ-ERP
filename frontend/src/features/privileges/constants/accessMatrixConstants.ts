/**
 * =============================================================================
 * [EN] Enterprise Access Matrix Types and Dynamic Helpers (accessMatrixConstants.ts)
 * [BN] এন্টারপ্রাইজ অ্যাক্সেস ম্যাট্রিক্স টাইপস ও ডায়নামিক হেল্পার ফাংশন
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Database Source: db/migration/V14__add_permission_catalog_metadata_and_hierarchy.sql
 * [EN] Rules: Rule 01 (100% Dynamic Data), Rule 05 (Database Ground Truth),
 *             Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Centralized Types)
 * [BN] হার্ডকোডেড ডেটা সম্পূর্ণ পরিহার করে পোস্টগ্রেসকিউএল ও এপিআই থেকে ডেটা রেন্ডার করার হেল্পার।
 */

import type {
  MatrixDomainDef,
  MatrixActionDef,
} from './accessMatrixTypes';
export * from './accessMatrixTypes';

/**
 * [EN] Dynamically extracts all distinct permission codes across a domain catalog
 * [BN] ডায়নামিক ক্যাটালগ থেকে সকল স্বাতন্ত্র্যসূচক পারমিশন কোড সংগ্রহ করে
 */
export const extractCatalogPermissionCodes = (domains: readonly MatrixDomainDef[]): string[] => {
  return Array.from(
    new Set(
      domains.flatMap((d) =>
        d.modules.flatMap((m) =>
          m.features.flatMap((f) =>
            Object.values(f.actions)
              .filter((a): a is MatrixActionDef => a !== null)
              .map((a) => a.code)
          )
        )
      )
    )
  );
};
