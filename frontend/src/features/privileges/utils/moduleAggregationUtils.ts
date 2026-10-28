/**
 * =============================================================================
 * [EN] Module Permission Aggregation Utility (moduleAggregationUtils.ts)
 * [BN] মডিউল-স্তরের পারমিশন অ্যাগ্রিগেশন ইউটিলিটি (moduleAggregationUtils.ts)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 05 (DB Parity)
 * [BN] ক্যাটালগের ফিচারগুলোকে মডিউল স্তরে একত্রিত করে মেনু, ক্রাড এবং স্পেশাল অ্যাকশনে বিন্যস্ত করে।
 */

import type { MatrixModuleDef } from '../constants/accessMatrixTypes';

export interface ModuleActionItem {
  readonly code: string;
  readonly label: string;
  readonly key: string;
}

export interface AggregatedModuleClearance {
  readonly moduleId: string;
  readonly moduleName: string;
  readonly moduleDescription: string;
  readonly targetPath: string;
  readonly allCodes: readonly string[];
  readonly menuActions: readonly ModuleActionItem[];
  readonly primaryMenuCode?: string;
  readonly crudActions: {
    readonly view?: ModuleActionItem;
    readonly create?: ModuleActionItem;
    readonly edit?: ModuleActionItem;
    readonly delete?: ModuleActionItem;
  };
  readonly specialActions: readonly ModuleActionItem[];
}

/**
 * [EN] Aggregates features of a module into unified Menu, CRUD, and Special Actions
 * [BN] একটি মডিউলের সমস্ত ফিচারকে মেনু, সাধারণ সিআরইউডি ও বিশেষ অ্যাকশনে রূপান্তরিত করে
 */
export const aggregateModulePermissions = (module: MatrixModuleDef): AggregatedModuleClearance => {
  const allCodes: string[] = [];
  const menuActions: ModuleActionItem[] = [];
  let viewAction: ModuleActionItem | undefined;
  let createAction: ModuleActionItem | undefined;
  let editAction: ModuleActionItem | undefined;
  let deleteAction: ModuleActionItem | undefined;
  const specialActions: ModuleActionItem[] = [];

  let targetPath = '';

  module.features.forEach((feature) => {
    if (!targetPath && feature.path) {
      targetPath = feature.path;
    }

    Object.entries(feature.actions).forEach(([key, action]) => {
      if (!action) return;
      if (!allCodes.includes(action.code)) {
        allCodes.push(action.code);
      }

      const item: ModuleActionItem = {
        code: action.code,
        label: action.label,
        key,
      };

      if (key === 'menu' || action.code.endsWith(':MENU')) {
        menuActions.push(item);
      } else if (key === 'view') {
        if (!viewAction) {
          viewAction = item;
        } else if (!specialActions.some((s) => s.code === action.code)) {
          specialActions.push(item);
        }
      } else if (key === 'create') {
        if (!createAction) {
          createAction = item;
        } else if (!specialActions.some((s) => s.code === action.code)) {
          specialActions.push(item);
        }
      } else if (key === 'edit') {
        if (!editAction) {
          editAction = item;
        } else if (!specialActions.some((s) => s.code === action.code)) {
          specialActions.push(item);
        }
      } else if (key === 'delete') {
        if (!deleteAction) {
          deleteAction = item;
        } else if (!specialActions.some((s) => s.code === action.code)) {
          specialActions.push(item);
        }
      } else {
        // Special / Advanced operational action
        if (!specialActions.some((s) => s.code === action.code)) {
          specialActions.push(item);
        }
      }
    });
  });

  // Determine primary sidebar navigation menu code
  const primaryMenu =
    menuActions.find(
      (m) => !m.code.includes('PASSWORD_RESET') && !m.code.includes('SPECIAL_PERM') && !m.code.includes('PROFILE')
    ) || menuActions[0];

  const fallbackPath = `/app/admin/${module.id.replace('_mgmt', '')}`;

  return {
    moduleId: module.id,
    moduleName: module.name,
    moduleDescription: module.description || 'Enterprise module clearance and access boundaries',
    targetPath: targetPath || fallbackPath,
    allCodes,
    menuActions,
    primaryMenuCode: primaryMenu?.code,
    crudActions: {
      view: viewAction,
      create: createAction,
      edit: editAction,
      delete: deleteAction,
    },
    specialActions,
  };
};
