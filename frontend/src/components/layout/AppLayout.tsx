/**
 * [EN] Master Enterprise Application Shell (AppLayout) - Rules: 07 (<300 lines), 15, 19, 20
 * [BN] একক টপবার এবং স্মার্ট সিঙ্গেল-অ্যাকর্ডিয়ন সংবলিত মাস্টার এন্টারপ্রাইজ শেল।
 */
import React, { useState, useMemo, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Shirt, Layers, Scissors, Palette, Activity, Waves, CheckCircle2, PackageCheck, Ship,
  Users, User, UserPlus, Plus, Binary, Database, Building2, Shield, ShieldCheck, ShieldAlert, Settings, Library, Search, X, ChevronRight, ChevronDown, Folder, SlidersHorizontal, KeyRound, History, ChevronsDown, ChevronsUp, Clock, DollarSign, Ruler, Tag, Calendar, AlertTriangle,
} from 'lucide-react';
import { ERP_DOMAINS, APP_METADATA, type NavItem, type NavGroup, type DomainItem } from '@/constants';
import { useAuthStore, useThemeStore } from '@/store';
import { isPlatformSuperAdmin } from '@/routes';
import { usePermission } from '@/features/privileges';
import { isNavPathPermitted, getDomainLandingPath } from './navPermissionUtils';
import { AppHeader } from './AppHeader';
import { SidebarDomainPicker } from './SidebarDomainPicker';
import { BrandLogo } from '@/components/ui';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutDashboard, Shirt, Layers, Scissors, Palette, Activity, Waves, CheckCircle2, PackageCheck, Ship,
  Users, User, UserPlus, Plus, Binary, Database, Building2, Shield, ShieldCheck, ShieldAlert, Settings, Library, Folder, SlidersHorizontal, KeyRound, History, Clock, DollarSign, Ruler, Tag, Calendar, AlertTriangle,
};

interface AppLayoutProps { readonly children?: React.ReactNode; }

/**
 * [EN] Master Single-Topbar 3-Level Application Shell with Smart Single-Accordion.
 * [BN] একক টপবার এবং স্মার্ট সিঙ্গেল-অ্যাকর্ডিয়ন সংবলিত মাস্টার এন্টারপ্রাইজ শেল।
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const { user } = useAuthStore();
  const { isSuperAdmin, hasPermission } = usePermission();
  const { sidebarTheme, isDark } = useThemeStore();
  const isSidebarDark = sidebarTheme === 'dark' || isDark;
  const brandingBadge = isPlatformSuperAdmin(user) ? 'PLATFORM' : 'PORTAL';
  const location = useLocation();
  const navigate = useNavigate();

  // Match accessible Level 1 Domains for current user
  const accessibleDomains = useMemo(() => {
    if (isSuperAdmin) return ERP_DOMAINS;
    return ERP_DOMAINS.filter((d) => d.id === 'overview' || d.groups.some((g) => g.items.some((it) => isNavPathPermitted(it.path, hasPermission, isSuperAdmin, it.permission))));
  }, [isSuperAdmin, hasPermission]);

  // Match active Level 1 Domain from current URL path
  const matchedDomain: DomainItem = accessibleDomains.find((d) =>
    d.rootPrefix === '/app/overview'
      ? location.pathname.startsWith('/app/overview') || location.pathname === '/app/dashboard'
      : location.pathname.startsWith(d.rootPrefix) || (d.id === 'admin' && location.pathname.startsWith('/app/settings'))
  ) || (accessibleDomains[0] as DomainItem) || (ERP_DOMAINS[0] as DomainItem);

  const activeNavGroups = matchedDomain?.groups || [];

  // Real-time filter search & dynamic RBAC clearance
  const filteredNavGroups = useMemo(() => {
    const q = menuSearchQuery.trim().toLowerCase();
    return activeNavGroups
      .map((g) => {
        const permitted = g.items.filter((it) => isNavPathPermitted(it.path, hasPermission, isSuperAdmin, it.permission));
        const searched = q ? permitted.filter((it) => it.label.toLowerCase().includes(q) || it.children?.some((c) => c.label.toLowerCase().includes(q))) : permitted;
        return { ...g, items: searched };
      })
      .filter((g) => g.items.length > 0);
  }, [activeNavGroups, menuSearchQuery, hasPermission, isSuperAdmin]);

  // Active item resolution (exact match prioritized over longest prefix to avoid dual selection)
  const activeItemPath = useMemo(() => {
    const allItems = activeNavGroups.flatMap((g) => g.items);
    const exact = allItems.find((it) => it.path === location.pathname);
    if (exact) return exact.path;
    const matches = allItems.filter((it) => it.path !== '/' && location.pathname.startsWith(`${it.path}/`));
    return matches.sort((a, b) => b.path.length - a.path.length)[0]?.path || null;
  }, [activeNavGroups, location.pathname]);

  // Active module group containing the current route
  const activeGroupId = useMemo(() => {
    if (!activeItemPath) return null;
    return activeNavGroups.find((g) =>
      g.items.some((it) => it.path === activeItemPath || it.children?.some((c) => c.path === activeItemPath))
    )?.id || null;
  }, [activeNavGroups, activeItemPath]);

  // [EN] Smart Single-Accordion: Auto-expand only active module and collapse others on route change
  // [BN] স্মার্ট সিঙ্গেল-অ্যাকর্ডিয়ন: পেজ লোড ও রাউট পরিবর্তনে শুধুমাত্র সক্রিয় মডিউল এক্সপ্যান্ড থাকবে
  useEffect(() => {
    if (!activeGroupId) return;
    setCollapsedModules(() => {
      const next: Record<string, boolean> = {};
      activeNavGroups.forEach((g) => { next[g.id] = g.id !== activeGroupId; });
      return next;
    });
  }, [activeGroupId, matchedDomain.id]);

  // [EN] Accordion click: opening one closes all other modules; clicking an open one collapses it
  // [BN] অ্যাকর্ডিয়ন ক্লিক: নতুন মডিউল খুললে বাকিগুলো বন্ধ হবে, খোলাটিতে ক্লিক করলে বন্ধ হবে
  const toggleModuleCollapse = (groupId: string) => {
    setCollapsedModules((prev) => {
      const isCurrentlyCollapsed = prev[groupId] !== undefined ? prev[groupId] : groupId !== activeGroupId;
      const next: Record<string, boolean> = {};
      activeNavGroups.forEach((g) => {
        next[g.id] = isCurrentlyCollapsed ? g.id !== groupId : true;
      });
      return next;
    });
  };

  // [EN] Check if all visible groups are collapsed / [BN] সকল দৃশ্যমান মডিউল সংকুচিত কিনা যাচাই
  const areAllModulesCollapsed = useMemo(() => {
    if (filteredNavGroups.length === 0) return false;
    return filteredNavGroups.every((g) => (collapsedModules[g.id] !== undefined ? collapsedModules[g.id] : g.id !== activeGroupId));
  }, [filteredNavGroups, collapsedModules, activeGroupId]);

  // [EN] Master 1-click toggle to expand or collapse all modules
  // [BN] ১-ক্লিকে সকল মডিউল এক্সপ্যান্ড বা কলাপ্স করার মাস্টার টগল
  const toggleAllModules = () => {
    const shouldCollapse = !areAllModulesCollapsed;
    setCollapsedModules(() => {
      const next: Record<string, boolean> = {};
      filteredNavGroups.forEach((g) => { next[g.id] = shouldCollapse; });
      return next;
    });
  };

  const renderNavIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName] || LayoutDashboard;
    return <Icon size={16} className="shrink-0" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-text-primary antialiased font-sans">
      {/* 3-Level Sidebar (100vh Full Viewport Height) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-all duration-300 ease-in-out select-none ${isSidebarOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Brand Logo Header (Top of Sidebar, 64px) */}
        <div className={`h-16 flex items-center border-b border-[var(--sidebar-border)] shrink-0 ${isSidebarOpen ? 'px-3.5' : 'justify-center'}`}>
          <BrandLogo size="md" showText={isSidebarOpen} badgeText={brandingBadge} inverted={isSidebarDark} />
        </div>

        {/* LEVEL 1: Domain Switcher Header */}
        <SidebarDomainPicker
          activeDomain={matchedDomain} domains={accessibleDomains} isSidebarOpen={isSidebarOpen}
          onSelectDomain={(domain) => navigate(getDomainLandingPath(domain, hasPermission, isSuperAdmin))}
          onExpandSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Quick Menu Search / Filter & Master Expand/Collapse Toggle */}
        {isSidebarOpen && (
          <div className="px-2.5 pt-2 pb-1 border-b border-[var(--sidebar-border)]/50">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1 flex items-center">
                <Search size={12} className="absolute left-2.5 text-[var(--sidebar-text-muted)] pointer-events-none" />
                <input
                  type="text"
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  placeholder="Filter menus..."
                  className="w-full pl-7 pr-6 py-1 text-[11px] bg-[var(--sidebar-hover-bg)] border border-[var(--sidebar-border)] text-[var(--sidebar-text)] placeholder:text-[var(--sidebar-text-muted)] rounded-sm focus:outline-hidden focus:border-accent transition-all shadow-2xs"
                />
                {menuSearchQuery && (
                  <button type="button" onClick={() => setMenuSearchQuery('')} className="absolute right-1.5 p-0.5 text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] cursor-pointer">
                    <X size={10} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={toggleAllModules}
                title={areAllModulesCollapsed ? 'Expand All Modules' : 'Collapse All Modules'}
                className="shrink-0 p-1 text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] border border-[var(--sidebar-border)] rounded-sm transition-colors cursor-pointer"
              >
                {areAllModulesCollapsed ? <ChevronsDown size={13} /> : <ChevronsUp size={13} />}
              </button>
            </div>
          </div>
        )}

        {/* LEVEL 2 & LEVEL 3: Grouped Module Accordions & Menu Tree */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
          {filteredNavGroups.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[var(--sidebar-text-muted)]">
              No menus matching &quot;{menuSearchQuery}&quot;
            </div>
          ) : (
            filteredNavGroups.map((group: NavGroup) => {
              const isModuleCollapsed = menuSearchQuery.trim()
                ? false
                : (collapsedModules[group.id] !== undefined ? collapsedModules[group.id] : group.id !== activeGroupId);

              return (
                <div key={group.id} className="space-y-0.5">
                  {/* LEVEL 2: Module Header (Accordion Toggle) */}
                  {isSidebarOpen ? (
                    <button
                      type="button"
                      onClick={() => toggleModuleCollapse(group.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] rounded-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Folder size={12} className="text-[var(--sidebar-text-muted)] shrink-0" />
                        <span className="truncate">{group.title}</span>
                      </div>
                      {isModuleCollapsed ? <ChevronRight size={12} className="text-[var(--sidebar-text-muted)] shrink-0" /> : <ChevronDown size={12} className="text-[var(--sidebar-text-muted)] shrink-0" />}
                    </button>
                  ) : (
                    <div className="my-1.5 border-t border-[var(--sidebar-border)] mx-1" />
                  )}

                  {/* LEVEL 3: Menu Items inside Module */}
                  {!isModuleCollapsed && (
                    <div className="space-y-0.5">
                      {group.items.map((item: NavItem) => {
                        const isItemActive = activeItemPath === item.path;

                        return (
                          <div key={item.id} className="space-y-0.5">
                            <NavLink
                              to={item.path}
                              title={!isSidebarOpen ? item.label : undefined}
                              className={`flex items-center rounded-sm text-xs transition-all ${
                                isSidebarOpen ? 'gap-2.5 px-3 py-1.5' : 'justify-center p-2.5'
                              } ${isItemActive ? 'bg-accent text-white shadow-xs font-semibold' : 'text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)]'}`}
                            >
                              {renderNavIcon(item.iconName)}
                              {isSidebarOpen && <span className="truncate flex-1 text-left">{item.label}</span>}
                              {isSidebarOpen && item.badge && (
                                <span className="text-[10px] font-mono uppercase px-1 py-0.2 rounded-xs font-semibold bg-accent/30 text-white border border-accent/60 shadow-xs">{item.badge}</span>
                              )}
                            </NavLink>

                            {/* Sub-children leaf actions if present */}
                            {isSidebarOpen && item.children && isItemActive && (
                              <div className="ml-6 my-0.5 pl-2 space-y-0.5 border-l border-[var(--sidebar-border)]">
                                {item.children.map((child) => (
                                  <NavLink
                                    key={child.id}
                                    to={child.path}
                                    className={`block px-2 py-1 text-[11px] rounded-xs transition-colors ${
                                      location.pathname === child.path ? 'text-accent font-semibold bg-accent/15 border-l-2 border-accent' : 'text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)]'
                                    }`}
                                  >
                                    {child.label}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }))}
        </nav>

        {/* Footer: System Status */}
        <div className="p-2.5 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--sidebar-text-muted)]">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                <span>System Operational</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-[2px] font-mono text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{APP_METADATA.VERSION}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
              <span className="text-[8px] font-mono px-1 py-0.2 rounded-[2px] border font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{APP_METADATA.VERSION.replace(/-.*$/, '')}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Docked Topbar (64px) */}
      <AppHeader isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main Workspace Canvas (Top-16 dock) */}
      <div role="main" className={`flex-1 flex flex-col min-w-0 pt-16 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-64' : 'pl-16'}`}>
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1920px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
