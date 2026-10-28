/**
 * =============================================================================
 * [EN] Navigation Permission Filter Utilities (navPermissionUtils.ts)
 * [BN] নেভিগেশন মেনু পারমিশন ফিল্টারিং ইউটিলিটি
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 */

/**
 * [EN] Checks whether a navigation item path is permitted for the active user
 * [BN] বর্তমান ব্যবহারকারীর জন্য নির্দিষ্ট মেনু আইটেমটি অনুমোদিত কিনা তা যাচাই করে
 */
export const isNavPathPermitted = (
  path: string,
  hasPermission: (code: string) => boolean,
  isSuperAdmin: boolean,
  itemPermission?: string
): boolean => {
  if (
    isSuperAdmin ||
    path.startsWith('/app/overview') ||
    path === '/app/dashboard' ||
    path.includes('/profile')
  ) {
    return true;
  }

  // [EN] Explicit navigation item permission takes immediate precedence
  // [BN] মেনু আইটেমে সুনির্দিষ্ট পারমিশন দেওয়া থাকলে সরাসরি তা প্রয়োগ করা হবে
  if (itemPermission) {
    return hasPermission(itemPermission);
  }

  // Admin Domain Modules (Order: Specific subpaths strictly evaluated before generic prefixes)
  if (path.includes('/admin/users/special-permissions')) return hasPermission('SPECIAL_PERM:MENU') || hasPermission('USER:SPECIAL_PERMISSION') || hasPermission('ROLE:MENU');
  if (path.includes('/admin/users/reset-password')) return hasPermission('PASSWORD_RESET:MENU') || hasPermission('USER:RESET_PASSWORD');
  if (path.includes('/admin/users/new')) return hasPermission('USER:CREATE');
  if (path.includes('/admin/users')) return hasPermission('USER:MENU');
  if (path.includes('/admin/clients/new')) return hasPermission('TENANT:CREATE');
  if (path.includes('/admin/clients')) return hasPermission('TENANT:MENU');
  if (path.includes('/admin/roles')) return hasPermission('ROLE:MENU');
  if (path.includes('/admin/settings/auto-code')) return hasPermission('AUTO_CODE:MENU') || hasPermission('AUTO_CODE:VIEW') || hasPermission('SETTINGS:MENU');
  if (path.includes('/admin/settings/shifts')) return hasPermission('SHIFT:MENU') || hasPermission('SHIFT:VIEW') || hasPermission('SETTINGS:MENU');
  if (path.includes('/admin/settings/currencies')) return hasPermission('CURRENCY:MENU') || hasPermission('CURRENCY:VIEW') || hasPermission('SETTINGS:MENU');
  if (path.includes('/admin/settings/security')) return hasPermission('SECURITY:MENU') || hasPermission('SECURITY:VIEW') || hasPermission('SETTINGS:MENU');
  if (path.includes('/admin/settings')) return hasPermission('SETTINGS:MENU') || hasPermission('AUTO_CODE:MENU') || hasPermission('SHIFT:MENU') || hasPermission('CURRENCY:MENU') || hasPermission('SECURITY:MENU') || hasPermission('AUDIT_LOG:MENU');
  if (path.includes('/admin/audit')) return hasPermission('AUDIT_LOG:MENU') || hasPermission('AUDIT_LOG:VIEW') || hasPermission('SETTINGS:MENU');
  if (path.includes('/admin/library')) return hasPermission('LIBRARY:MENU');

  // Merchandising Domain Modules
  if (path.includes('/merchandising/orders')) return hasPermission('ORDER:MENU');
  if (path.includes('/merchandising/styles')) return hasPermission('STYLE:MENU');
  if (path.includes('/merchandising/costing')) return hasPermission('COSTING:MENU');

  // Raw Materials & Cutting
  if (path.includes('/inventory/rolls')) return hasPermission('ROLL:MENU');
  if (path.includes('/inventory/qc')) return hasPermission('FABRIC_QC:MENU');
  if (path.includes('/cutting')) return hasPermission('CUTTING:MENU') || hasPermission('MARKER:MENU');

  // Embellishment, Sewing & Laundry
  if (path.includes('/embellishment')) return hasPermission('ORDER:MENU');
  if (path.includes('/sewing')) return hasPermission('SEWING:MENU') || hasPermission('SCAN:MENU');
  if (path.includes('/washing')) return hasPermission('WASH:MENU') || hasPermission('BATCH:MENU');

  // Quality, Packaging & Commercial Export
  if (path.includes('/quality')) return hasPermission('QC:MENU') || hasPermission('AQL:MENU');
  if (path.includes('/packing/gate-pass')) return hasPermission('GATE_PASS:MENU');
  if (path.includes('/packing')) return hasPermission('CARTON:MENU') || hasPermission('GATE_PASS:MENU');
  if (path.includes('/commercial/invoices')) return hasPermission('INVOICE:MENU');
  if (path.includes('/commercial/shipments')) return hasPermission('SHIPMENT:MENU');
  if (path.includes('/commercial')) return hasPermission('INVOICE:MENU') || hasPermission('SHIPMENT:MENU') || hasPermission('GATE_PASS:MENU');

  return true;
};

/**
 * [EN] Resolve best landing URL for a domain based on user permissions
 * [BN] পারমিশনের ভিত্তিতে ডোমেনের জন্য সর্বোত্তম ল্যান্ডিং রুট নির্ধারণ
 */
export const getDomainLandingPath = (
  domain: { path: string; groups: readonly { items: readonly { path: string; permission?: string }[] }[] },
  hasPermission: (code: string) => boolean,
  isSuperAdmin: boolean
): string => {
  if (isSuperAdmin || isNavPathPermitted(domain.path, hasPermission, isSuperAdmin)) {
    return domain.path;
  }
  for (const group of domain.groups) {
    for (const item of group.items) {
      if (isNavPathPermitted(item.path, hasPermission, isSuperAdmin, item.permission)) {
        return item.path;
      }
    }
  }
  return domain.path;
};

