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
  Ship,
  Radio,
  ChevronDown,
  Bell,
  Search,
  Building2,
  Menu,
  X,
  User,
} from 'lucide-react';
import { NAVIGATION_ITEMS, FACTORY_UNITS } from '../../constants/navigationConstants';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

/**
 * [EN] Icon Resolver Map to dynamically render Lucide icons by name.
 * Strictly avoids hardcoding icon elements inline in components.
 *
 * [BN] আইকন রেজলভার ম্যাপ যা ডায়নামিকালি আইকন নাম দিয়ে রেন্ডার করে।
 */
const ICON_MAP = {
  LayoutDashboard,
  Shirt,
  Layers,
  Scissors,
  Palette,
  Activity,
  Waves,
  Ship,
  Radio,
};

/**
 * [EN] Master Enterprise AppLayout Shell component.
 * Implements ADR-006: 100% Unified Global Design System and Master Layout.
 *
 * [BN] মাস্টার এন্টারপ্রাইজ অ্যাপ লেআউট শেল কম্পোনেন্ট।
 * সম্পূর্ণ ইআরপিতে একক সাইডবার, একক টপ বার এবং অভিন্ন স্পেসিং নিশ্চিত করে।
 */
export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(FACTORY_UNITS[0].id);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-base flex text-text-primary transition-colors duration-200">
      {/* ================================================================== */}
      {/* 1. MASTER SIDEBAR (Fixed w-64, Unified Typography & Spacing)      */}
      {/* ================================================================== */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-brand-sidebar text-slate-300 transition-all duration-300 flex flex-col shrink-0 border-r border-brand-sidebar-border z-30`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-sidebar-border bg-brand-sidebar-header">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-sm bg-brand-accent flex items-center justify-center font-bold text-white shrink-0 shadow-xs">
              R
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-white uppercase">
                  Garments ERP
                </span>
                <span className="text-[10px] text-brand-accent-light font-mono tracking-wider">
                  DENIM & WOVEN O2S
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors"
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-accent text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <IconComponent size={18} className="shrink-0" />
                {isSidebarOpen && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-xs bg-brand-accent/20 text-brand-accent-light font-semibold border border-brand-accent/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Tenant Footer Profile with SemVer Release Badge */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-brand-sidebar-border bg-brand-sidebar-header/60 space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-sm bg-white/5 border border-white/10">
              <div className="h-8 w-8 rounded-sm bg-white/10 flex items-center justify-center text-slate-300 shrink-0">
                <User size={16} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-slate-200">Director / CTO</span>
                <span className="text-[10px] text-slate-400">admin@garmentserp.com</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-mono">
              <span>GarmentIQ-ERP</span>
              <span className="px-1.5 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                v0.1.0-alpha
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* ================================================================== */}
      {/* 2. MAIN VIEW SHELL (Global Top Header + Workspace)                 */}
      {/* ================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Top Header (h-16, Unit Selector, Notifications, Themes) */}
        <header className="h-16 bg-surface-card border-b border-border-subtle px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors duration-200">
          {/* Factory Unit Selector */}
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-text-muted" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="text-xs font-medium bg-surface-muted border border-border-subtle rounded-sm px-3 py-1.5 text-text-primary focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors cursor-pointer"
            >
              {FACTORY_UNITS.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.id} - {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search, Theme Switcher & Notification Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-2.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search styles, PO, roll barcode..."
                className="pl-9 pr-4 py-1.5 text-xs bg-surface-muted border border-border-subtle rounded-sm w-64 text-text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors"
              />
            </div>

            {/* Enterprise Multi-Theme Switcher (Rule 21 & ADR-010) */}
            <ThemeSwitcher />

            <button
              className="p-2 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors relative"
              title="System Alerts"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-danger ring-2 ring-surface-card"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
