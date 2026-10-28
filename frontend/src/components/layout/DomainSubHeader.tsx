/**
 * =============================================================================
 * [EN] Master Operational Domain Secondary Topbar (DomainSubHeader)
 * [BN] মাস্টার অপারেশনাল ডোমেন ২য় টপবার কম্পোনেন্ট (DomainSubHeader)
 * =============================================================================
 * [EN] Features: Sidebar Colspan Toggle + In-Menu Search + Full-Width Domain Tabs
 * [BN] বামে সাইডবার কলাপ্স বাটন ও মেনু সার্চ, ডানে ফুল-উইডথ অপারেশনাল ডোমেন পিলস।
 */

import React, { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Shirt, Layers, Scissors, Palette, Activity,
  Waves, CheckCircle2, PackageCheck, Ship, Users, Building2, Shield,
  Search, X, Menu, ChevronLeft
} from 'lucide-react';
import {
  ERP_DOMAINS, type DomainItem,
} from '@/constants';

/**
 * [EN] Dynamic icon mapping table for domain icons.
 * [BN] ডোমেন আইকন ডায়নামিক ম্যাপিং টেবিল।
 */
const DOMAIN_ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutDashboard, Shirt, Layers, Scissors, Palette, Activity,
  Waves, CheckCircle2, PackageCheck, Ship, Users, Building2, Shield,
};

/**
 * [EN] Properties contract for DomainSubHeader component.
 * [BN] DomainSubHeader কম্পোনেন্টের প্রপার্টিজ ইন্টারফেস।
 */
export interface DomainSubHeaderProps {
  /** [EN] Optional styling classes / [BN] অপশনাল সিএসএস ক্লাস */
  readonly className?: string;
  /** [EN] Sidebar expanded/collapsed state / [BN] সাইডবার খোলা বা বন্ধের অবস্থা */
  readonly isSidebarOpen?: boolean;
  /** [EN] Callback to toggle sidebar collapse / [BN] সাইডবার টগল কলব্যাক */
  readonly onToggleSidebar?: () => void;
  /** [EN] Current menu search/filter query / [BN] চলতি মেনু সার্চ কোয়েরি */
  readonly menuSearchQuery?: string;
  /** [EN] Callback on menu search text change / [BN] মেনু সার্চ পরিবর্তনের কলব্যাক */
  readonly onMenuSearchChange?: (query: string) => void;
}

/**
 * [EN] Secondary Topbar for Fast Operational Domain Switching.
 * Features sidebar collapse button, live menu search, and 1-word domain tabs.
 *
 * [BN] দ্রুত অপারেশনাল ডোমেন পরিবর্তনের জন্য ২য় সাব-হেডার টপবার।
 * সাইডবার কলাপ্স বাটন, রিয়েল-টাইম মেনু সার্চ এবং ডোমেন পিলস সংবলিত।
 */
export const DomainSubHeader: React.FC<DomainSubHeaderProps> = ({
  className = '',
  isSidebarOpen = true,
  onToggleSidebar,
  menuSearchQuery = '',
  onMenuSearchChange,
}) => {
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const domains = ERP_DOMAINS;

  /**
   * [EN] Helper method to safely render Lucide icon by string name.
   * [BN] স্ট্রিং নাম অনুযায়ী ডায়নামিক Lucide আইকন রেন্ডারার।
   */
  const renderIcon = (iconName: string) => {
    const IconComponent = DOMAIN_ICON_MAP[iconName] || LayoutDashboard;
    return <IconComponent size={14} className="shrink-0" />;
  };

  return (
    <nav
      aria-label="Operational Domains Navigation"
      className={`fixed top-16 left-0 right-0 z-30 h-10 w-full bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs select-none transition-colors ${className}`}
    >
      <div className="h-full w-full flex items-center gap-0 overflow-x-auto scrollbar-none">
        {/* Left Section: Sidebar Colspan Toggle Button & In-Menu Search Option */}
        <div
          className={`h-full shrink-0 flex items-center border-r border-slate-200 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64 px-3 justify-between gap-2' : 'w-16 px-1.5 justify-center gap-1'
          }`}
        >
          {/* Sidebar Colspan / Collapse Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1 rounded-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer shrink-0"
            title={isSidebarOpen ? 'Collapse Navigation Sidebar' : 'Expand Navigation Sidebar'}
            aria-label="Toggle Sidebar Navigation"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>

          {isSidebarOpen ? (
            /* Expanded Mode: Full In-Menu Quick Search / Filter Input */
            <div className="relative flex items-center flex-1 min-w-0">
              <Search size={12} className="absolute left-2.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={menuSearchQuery}
                onChange={(e) => onMenuSearchChange?.(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-7 pr-6 py-0.5 text-[11px] bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-[3px] focus:outline-hidden focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 transition-all shadow-xs"
              />
              {menuSearchQuery && (
                <button
                  type="button"
                  onClick={() => onMenuSearchChange?.('')}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  title="Clear menu search"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ) : (
            /* Collapsed Mode: Quick Search Trigger Button (Expands sidebar & focuses search input) */
            <button
              type="button"
              onClick={() => {
                onToggleSidebar?.();
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              className="p-1 rounded-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer shrink-0"
              title="Search menu (Expand sidebar)"
              aria-label="Search menu"
            >
              <Search size={14} />
            </button>
          )}
        </div>

        {/* Center / Right Section: Operational Domain Tabs */}
        <div className="flex items-center gap-0.5 h-full overflow-x-auto scrollbar-none px-2">
          {domains.map((domain: DomainItem) => {
            // [EN] Match domain if current URL starts with rootPrefix or matches path
            // [BN] চলতি ইউআরএল রুট প্রিফিক্স বা টার্গেট পাথের সাথে মিললে সক্রিয় চিহ্নিত করা
            const isActive =
              domain.rootPrefix === '/app/overview'
                ? location.pathname.startsWith('/app/overview') || location.pathname === '/app/dashboard'
                : location.pathname.startsWith(domain.rootPrefix);

            return (
              <NavLink
                key={domain.id}
                to={domain.path}
                title={`${domain.label} Domain`}
                className={`h-full inline-flex items-center gap-1.5 px-3 text-xs tracking-tight transition-colors shrink-0 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? 'border-brand-accent text-brand-accent bg-white font-semibold shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span className={isActive ? 'text-brand-accent' : 'text-slate-400'}>
                  {renderIcon(domain.iconName)}
                </span>
                <span>{domain.label}</span>
                {domain.badge && (
                  <span
                    className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded-[2px] font-bold tracking-wider ${
                      isActive
                        ? 'bg-brand-accent text-white shadow-2xs'
                        : 'bg-slate-200/80 text-slate-600 border border-slate-300/60'
                    }`}
                  >
                    {domain.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DomainSubHeader;
