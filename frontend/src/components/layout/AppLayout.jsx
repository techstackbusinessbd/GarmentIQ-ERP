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
    <div className="min-h-screen bg-slate-50 flex">
      {/* ================================================================== */}
      {/* 1. MASTER SIDEBAR (Fixed w-64, Unified Typography & Spacing)      */}
      {/* ================================================================== */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shrink-0 border-r border-slate-800 z-30`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-xs">
              R
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-white uppercase">
                  Garments ERP
                </span>
                <span className="text-[10px] text-indigo-400 font-mono tracking-wider">
                  DENIM & WOVEN O2S
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <IconComponent size={18} className="shrink-0" />
                {isSidebarOpen && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-400/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Tenant Footer Profile */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                <User size={16} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-slate-200">Director / CTO</span>
                <span className="text-[10px] text-slate-400">admin@garmentserp.com</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ================================================================== */}
      {/* 2. MAIN VIEW SHELL (Global Top Header + Workspace)                 */}
      {/* ================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Top Header (h-16, Unit Selector, Notifications) */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Factory Unit Selector */}
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-slate-500" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {FACTORY_UNITS.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.id} - {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search & Notification Utilities */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search styles, PO, roll barcode..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg w-64 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              title="System Alerts"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
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
