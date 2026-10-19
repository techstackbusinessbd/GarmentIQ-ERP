/**
 * =============================================================================
 * [EN] Master Enterprise Application Shell (AppLayout)
 * [BN] মাস্টার এন্টারপ্রাইজ অ্যাপ্লিকেশন শেল (AppLayout)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Constants), Rule 20 (Tokens)
 * [BN] আর্কিটেকচারাল স্পেসিফিকেশন মেনে একক অভিন্ন মাস্টার শেল লেআউট কম্পোনেন্ট।
 */

import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Layers,
  Scissors,
  Palette,
  Activity,
  Waves,
  CheckCircle2,
  PackageCheck,
  Ship,
  Users,
  Binary,
  Database,
  Search,
  Bell,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';
import {
  NAVIGATION_GROUPS,
  FACTORY_UNITS,
  GLOBAL_SEARCH_HOTKEY,
  APP_METADATA,
  type NavItem,
  type NavGroup,
} from '@/constants';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

/**
 * [EN] Icon mapping table for dynamic sidebar Lucide components.
 * [BN] ডায়নামিক সাইডবার আইকন ম্যাপিং টেবিল (স্ট্রিং নাম থেকে রিঅ্যাক্ট কম্পোনেন্ট)।
 */
const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  Shirt,
  Layers,
  Scissors,
  Palette,
  Activity,
  Waves,
  CheckCircle2,
  PackageCheck,
  Ship,
  Users,
  Binary,
  Database,
};

/**
 * [EN] Properties interface for the Master Application Layout.
 * [BN] মাস্টার অ্যাপ্লিকেশন লেআউট প্রপস ইন্টারফেস।
 */
interface AppLayoutProps {
  /** [EN] Optional children components to render inside workspace canvas / [BN] মূল ক্যানভাসে রেন্ডার করার চিলড্রেন */
  readonly children?: React.ReactNode;
}

/**
 * [EN] Unified Application Shell Component.
 * Encapsulates the collapsible master sidebar, sticky top header, and fluid content canvas.
 *
 * [BN] সমন্বিত অ্যাপ্লিকেশন শেল কম্পোনেন্ট।
 * কোল্যাপ্সিবল মাস্টার সাইডবার, স্টিকি টপ হেডার এবং ফ্লুইড কন্টেন্ট ক্যানভাস অন্তর্ভুক্ত করে।
 *
 * @param props [EN] Component properties / [BN] কম্পোনেন্ট প্রপার্টিজ
 * @returns [EN] Rendered unified application layout / [BN] রেন্ডারকৃত লেআউট
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // [EN] Sidebar toggle state (Expanded: 256px / Collapsed: 80px)
  // [BN] সাইডবার খোলা বা বন্ধের টগল স্টেট (প্রসারিত: ২৫৬px / সংকুচিত: ৮০px)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // [EN] Currently selected factory production plant unit
  // [BN] বর্তমানে নির্বাচিত ফ্যাক্টরি প্রোডাকশন প্ল্যান্ট ইউনিট
  const [selectedUnit, setSelectedUnit] = useState<string>(FACTORY_UNITS[0]?.id || '');

  // [EN] Current browser routing location for active menu highlighting
  // [BN] সক্রিয় মেনু আইটেম হাইলাইট করার জন্য চলতি ব্রাউজার রুট লোকেশন
  const location = useLocation();

  /**
   * [EN] Helper method to safely render dynamic Lucide icon by name.
   * [BN] আইকন নাম দিয়ে নিরাপদে ডায়নামিক Lucide আইকন রেন্ডার করার সহায়ক মেথড।
   */
  const renderNavIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || LayoutDashboard;
    return <IconComponent size={18} className="shrink-0" />;
  };

  return (
    <div className="min-h-screen flex bg-surface-base text-text-primary antialiased font-sans">
      {/* =====================================================================
       * [EN] 1. MASTER COLLAPSIBLE SIDEBAR (256px Expanded / 80px Collapsed)
       * [BN] ১. মাস্টার কোল্যাপ্সিবল সাইডবার (২৫৬px প্রসারিত / ৮০px সংকুচিত)
       * ===================================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-brand-sidebar border-r border-brand-sidebar-border transition-all duration-300 ease-in-out select-none ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* [EN] Brand Header with Logo and Collapse Toggle / [BN] লোগো ও কোল্যাপ্স বাটন সহ ব্র্যান্ড হেডার */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-sidebar-border bg-brand-sidebar-header shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-sm bg-brand-accent flex items-center justify-center font-bold text-white shrink-0 shadow-xs tracking-wider">
              R
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold tracking-tight text-white leading-tight">
                  {APP_METADATA.NAME}
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  {APP_METADATA.TAGLINE}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* [EN] Grouped Navigation Items Tree / [BN] গ্রুপভিত্তিক অপারেশনাল নেভিগেশন লিংকসমূহ */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {NAVIGATION_GROUPS.map((group: NavGroup) => (
            <div key={group.id} className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                  {group.title}
                </div>
              )}
              {group.items.map((item: NavItem) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    title={!isSidebarOpen ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-sm text-xs transition-all ${
                      isActive
                        ? 'bg-brand-accent text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {renderNavIcon(item.iconName)}
                    {isSidebarOpen && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {isSidebarOpen && item.badge && (
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-xs bg-brand-accent/20 text-brand-accent-light font-semibold border border-brand-accent/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* [EN] Release SemVer Profile Footer / [BN] রিলিজ ভার্সন ও ইউজার প্রোফাইল ফুটার */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-brand-sidebar-border bg-brand-sidebar-header/60 shrink-0 space-y-2">
            <div className="flex items-center gap-2.5 p-2 rounded-sm bg-white/5 border border-white/10">
              <div className="h-7 w-7 rounded-sm bg-white/10 flex items-center justify-center text-slate-300 shrink-0">
                <User size={15} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-white truncate">Enterprise Admin</span>
                <span className="text-[10px] text-slate-400 truncate">Woven & Denim Lead</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-mono">
              <span>{APP_METADATA.SHORT_NAME}</span>
              <span className="px-1.5 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {APP_METADATA.VERSION}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* =====================================================================
       * [EN] 2. MAIN APPLICATION WORKSPACE CANVAS (PageShell)
       * [BN] ২. মূল অ্যাপ্লিকেশন ওয়ার্কস্পেস ক্যানভাস (PageShell)
       * ===================================================================== */}
      <div
        role="main"
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        {/* [EN] Top Application Header (Fixed 64px, Sticky z-20) / [BN] টপ অ্যাপ্লিকেশন হেডার (৬৪px ফিক্সড) */}
        <header className="h-16 sticky top-0 z-20 flex items-center justify-between px-6 bg-surface-card border-b border-border-subtle shrink-0 shadow-xs">
          {/* [EN] Left Section: Factory Production Unit Selector / [BN] বাম পাশ: ফ্যাক্টরি প্ল্যান্ট ইউনিট সিলেক্টর */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="appearance-none text-xs font-semibold bg-surface-muted border border-border-subtle rounded-sm pl-3 pr-8 py-1.5 text-text-primary focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20 cursor-pointer shadow-xs"
              >
                {FACTORY_UNITS.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.code} • {unit.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
              />
            </div>
          </div>

          {/* [EN] Right Section: Search, Theme Switcher, Alerts & Avatar / [BN] ডান পাশ: সার্চ, থিম, অ্যালার্ট ও অবতার */}
          <div className="flex items-center gap-3">
            {/* [EN] Global Search Bar with Shortcut / [BN] শর্টকাট সহ গ্লোবাল সার্চ ইনপুট */}
            <div className="relative hidden md:block">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search styles, PO, roll barcode..."
                className="pl-8 pr-14 py-1.5 text-xs bg-surface-muted border border-border-subtle rounded-sm w-64 text-text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors shadow-xs"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 py-0.5 rounded-xs bg-surface-card border border-border-subtle text-text-muted pointer-events-none">
                {GLOBAL_SEARCH_HOTKEY}
              </span>
            </div>

            {/* [EN] Eye-Comfort Theme Switcher / [BN] ৪টি চোখের স্বাচ্ছন্দ্যপূর্ণ থিম সুইচার */}
            <ThemeSwitcher />

            {/* [EN] Notification Bell with 8px Danger Pulse Dot / [BN] ৮px লাল পালস ডট সহ নোটিফিকেশন বেল */}
            <button
              type="button"
              className="p-1.5 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors relative cursor-pointer"
              title="System Alerts & QC Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-status-danger ring-2 ring-surface-card animate-pulse" />
            </button>

            {/* [EN] User Quick Profile Avatar / [BN] ইউজার কুইক প্রোফাইল অবতার */}
            <div className="h-8 w-8 rounded-sm bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
          </div>
        </header>

        {/* [EN] Page Content Canvas (Fluid clamped to max-w-[1920px]) / [BN] পেজ কন্টেন্ট ক্যানভাস */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-[1920px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
