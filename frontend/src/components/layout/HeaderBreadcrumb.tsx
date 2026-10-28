/**
 * =============================================================================
 * [EN] Global Header Dynamic Breadcrumb Component (HeaderBreadcrumb)
 * [BN] গ্লোবাল হেডার ডাইনামিক ব্রেডক্রাম্ব কম্পোনেন্ট (HeaderBreadcrumb)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] টপবারে সক্রিয় রুট অনুসারে স্বয়ংক্রিয় ডোমেন ❯ মডিউল ❯ পেজ ব্রেডক্রাম্ব রেন্ডার করে।
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ERP_DOMAINS, type DomainItem } from '@/constants';

interface CrumbSegment {
  readonly label: string;
  readonly path?: string;
}

/**
 * [EN] Resolves dynamic breadcrumb segments from current pathname & domain hierarchy.
 * [BN] বর্তমান URL পাথ এবং ডোমেন ট্রি থেকে স্বয়ংক্রিয় ব্রেডক্রাম্ব সেগমেন্ট নির্ধারণ।
 */
const resolveBreadcrumbTrail = (pathname: string): CrumbSegment[] => {
  // 1. Resolve Active Level 1 Domain
  const matchedDomain: DomainItem =
    ERP_DOMAINS.find((d) =>
      d.rootPrefix === '/app/overview'
        ? pathname.startsWith('/app/overview') || pathname === '/app/dashboard'
        : pathname.startsWith(d.rootPrefix) || (d.id === 'admin' && pathname.startsWith('/app/settings'))
    ) || (ERP_DOMAINS[0] as DomainItem);

  const trail: CrumbSegment[] = [
    { label: matchedDomain.label, path: matchedDomain.path },
  ];

  // 2. Resolve Active Level 2 Module Group
  const activeGroup = matchedDomain.groups.find((group) =>
    group.items.some(
      (item) =>
        pathname === item.path ||
        (item.path !== '/' && pathname.startsWith(item.path)) ||
        item.children?.some((child) => pathname === child.path || pathname.startsWith(child.path))
    )
  ) || matchedDomain.groups[0];

  if (activeGroup && activeGroup.title) {
    trail.push({ label: activeGroup.title });
  }

  // 3. Resolve Active Level 3 Menu Item
  const activeItem = activeGroup?.items.find(
    (item) =>
      pathname === item.path ||
      (item.path !== '/' && pathname.startsWith(item.path))
  );

  if (activeItem) {
    trail.push({ label: activeItem.label, path: activeItem.path });

    // 4. Resolve Leaf / Sub-actions (e.g. /new, /edit, or child links)
    const activeChild = activeItem.children?.find((c) => pathname === c.path);
    if (activeChild) {
      trail.push({ label: activeChild.label, path: activeChild.path });
    } else if (pathname.endsWith('/new')) {
      trail.push({ label: 'Create New' });
    } else if (pathname.endsWith('/edit')) {
      trail.push({ label: 'Edit' });
    }
  }

  return trail;
};

/**
 * [EN] Topbar Breadcrumb component displayed beside the sidebar collapse toggle.
 * [BN] টপবারে সাইডবার টগল বাটনের পাশে প্রদর্শিত একমাত্র এন্টারপ্রাইজ ব্রেডক্রাম্ব।
 */
export const HeaderBreadcrumb: React.FC = () => {
  const location = useLocation();
  const trail = resolveBreadcrumbTrail(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs select-none">
      {trail.map((crumb, idx) => {
        const isLast = idx === trail.length - 1;

        return (
          <React.Fragment key={`${crumb.label}-${idx}`}>
            {idx > 0 && (
              <ChevronRight size={13} className="text-muted-foreground/60 shrink-0" />
            )}
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : crumb.path ? (
              <Link
                to={crumb.path}
                className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[160px]"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-muted-foreground truncate max-w-[160px]">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default HeaderBreadcrumb;
