/**
 * =============================================================================
 * [EN] Sidebar Domain Picker Dropdown Component (SidebarDomainPicker)
 * [BN] সাইডবার ডোমেন সিলেক্টর ড্রপডাউন কম্পোনেন্ট (লেভেল ১ ডোমেন নির্বাচন)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] সাইডবারের মাথায় ১৩টি ডোমেন পরিবর্তনের মার্জিত ও দ্রুত সিলেক্টর।
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, Shirt, Layers, Scissors, Palette, Activity,
  Waves, CheckCircle2, PackageCheck, Ship, Users, Building2, Shield,
  ChevronDown,
} from 'lucide-react';
import type { DomainItem } from '@/constants';

const DOMAIN_ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutDashboard, Shirt, Layers, Scissors, Palette, Activity,
  Waves, CheckCircle2, PackageCheck, Ship, Users, Building2, Shield,
};

export interface SidebarDomainPickerProps {
  readonly activeDomain: DomainItem;
  readonly domains: readonly DomainItem[];
  readonly isSidebarOpen: boolean;
  readonly onSelectDomain: (domain: DomainItem) => void;
  readonly onExpandSidebar?: () => void;
}

export const SidebarDomainPicker: React.FC<SidebarDomainPickerProps> = ({
  activeDomain,
  domains,
  isSidebarOpen,
  onSelectDomain,
  onExpandSidebar,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const renderIcon = (iconName: string, size = 16) => {
    const IconComp = DOMAIN_ICON_MAP[iconName] || LayoutDashboard;
    return <IconComp size={size} className="shrink-0" />;
  };

  return (
    <div className="relative px-2 py-2 border-b border-[var(--sidebar-border)]" ref={containerRef}>
      {isSidebarOpen ? (
        /* Expanded Mode: Full Domain Picker Trigger Button */
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-xs font-semibold bg-[var(--sidebar-hover-bg)] hover:bg-accent/15 border border-[var(--sidebar-border)] text-[var(--sidebar-text)] transition-all cursor-pointer shadow-2xs group"
          title="Switch Operational Domain (Level 1)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-[3px] bg-accent/15 text-accent shrink-0">
              {renderIcon(activeDomain.iconName, 15)}
            </span>
            <div className="flex flex-col text-left truncate">
              <span className="text-[10px] font-mono uppercase text-[var(--sidebar-text-muted)] leading-none">
                Domain
              </span>
              <span className="text-xs font-bold text-[var(--sidebar-text)] truncate">
                {activeDomain.label}
              </span>
            </div>
          </div>
          <ChevronDown
            size={14}
            className={`text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)] transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : (
        /* Collapsed Mode: Slim Icon Trigger Button */
        <button
          type="button"
          onClick={() => {
            onExpandSidebar?.();
            setIsOpen(true);
          }}
          className="w-full flex items-center justify-center p-2 rounded-sm text-accent bg-[var(--sidebar-hover-bg)] hover:bg-accent/15 border border-[var(--sidebar-border)] transition-all cursor-pointer shadow-2xs"
          title={`Domain: ${activeDomain.label} (Click to change)`}
        >
          {renderIcon(activeDomain.iconName, 18)}
        </button>
      )}

      {/* Floating Domain Selection Popover Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className="absolute left-2 right-2 top-full mt-1.5 bg-[var(--sidebar-popover-bg)] border border-[var(--sidebar-border)] rounded-[6px] shadow-2xl z-50 py-1.5 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--sidebar-text-muted)] border-b border-[var(--sidebar-border)] mb-1">
            Operational Domains ({domains.length})
          </div>
          <div className="space-y-0.5 px-1">
            {domains.map((domain) => {
              const isSelected = domain.id === activeDomain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => {
                    onSelectDomain(domain);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-accent text-white font-semibold shadow-xs'
                      : 'text-[var(--sidebar-text)] hover:text-white hover:bg-[var(--sidebar-hover-bg)]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={isSelected ? 'text-white' : 'text-accent'}>
                      {renderIcon(domain.iconName, 14)}
                    </span>
                    <span className="truncate">{domain.label}</span>
                  </div>
                  {domain.badge && (
                    <span
                      className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded-[2px] font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-text-muted)] border border-[var(--sidebar-border)]'
                      }`}
                    >
                      {domain.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
