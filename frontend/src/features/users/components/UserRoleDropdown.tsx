/**
 * =============================================================================
 * [EN] Enterprise User Role Multi-Select Dropdown (UserRoleDropdown)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী রোল মাল্টি-সিলেক্ট ড্রপডাউন (UserRoleDropdown)
 * =============================================================================
 * [EN] Replaces large matrix cards with a compact, searchable multi-role dropdown.
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] কমপ্যাক্ট ড্রপডাউনে ট্যাগ, সার্চ ফিল্টার ও চেকবক্সের মাধ্যমে একাধিক রোল নির্বাচন।
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  Search,
  X,
  Check,
  Shield,
  Scissors,
  Activity,
  CheckCircle2,
  Waves,
  Ship,
  Eye,
  Building2,
  Briefcase,
} from 'lucide-react';
import { ENTERPRISE_ROLES, ROLE_MAP, type RoleDefinition } from '../constants/roleConstants';

export interface UserRoleDropdownProps {
  readonly selectedRoles: readonly string[];
  readonly availableRoles?: readonly RoleDefinition[];
  readonly onToggleRole: (roleCode: string) => void;
  readonly onSelectAll?: () => void;
  readonly onClearSelection?: () => void;
}

/** [EN] Returns specific domain icon for each enterprise role */
function getRoleIcon(code: string) {
  switch (code) {
    case 'ROLE_SUPER_ADMIN':
      return <Shield size={14} className="text-status-danger" />;
    case 'ROLE_ADMIN':
      return <Building2 size={14} className="text-brand-accent" />;
    case 'ROLE_MERCHANDISER':
      return <Briefcase size={14} className="text-brand-accent" />;
    case 'ROLE_CUTTING_MANAGER':
      return <Scissors size={14} className="text-status-warning" />;
    case 'ROLE_SEWING_SUPERVISOR':
      return <Activity size={14} className="text-status-info" />;
    case 'ROLE_QA_INSPECTOR':
      return <CheckCircle2 size={14} className="text-status-success" />;
    case 'ROLE_FINISHING_MANAGER':
      return <Waves size={14} className="text-brand-accent" />;
    case 'ROLE_COMMERCIAL_OFFICER':
      return <Ship size={14} className="text-status-info" />;
    case 'ROLE_EXECUTIVE_VIEWER':
      return <Eye size={14} className="text-brand-accent" />;
    default:
      return <ShieldCheck size={14} className="text-text-muted" />;
  }
}

export const UserRoleDropdown: React.FC<UserRoleDropdownProps> = ({
  selectedRoles,
  availableRoles,
  onToggleRole,
  onSelectAll,
  onClearSelection,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const allRoles = useMemo(() => {
    return availableRoles && availableRoles.length > 0 ? availableRoles : ENTERPRISE_ROLES;
  }, [availableRoles]);

  const activeRoleMap = useMemo(() => {
    const map: Record<string, RoleDefinition> = { ...ROLE_MAP };
    allRoles.forEach((r) => {
      map[r.code] = r;
    });
    return map;
  }, [allRoles]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filtered roles based on search
  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allRoles;
    return allRoles.filter(
      (r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
    );
  }, [searchQuery, allRoles]);

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-text-primary">
          Assigned Roles & Authorities <span className="text-status-danger">*</span>
        </label>
        <span className="text-[11px] font-mono text-text-muted">
          {selectedRoles.length} selected
        </span>
      </div>

      {/* Dropdown Trigger Box */}
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
          className={`w-full min-h-[38px] px-3 py-1.5 bg-surface-card border rounded-[4px] text-xs cursor-pointer flex items-center justify-between gap-2 transition-colors ${
            isOpen
              ? 'border-brand-accent ring-1 ring-brand-accent/20'
              : 'border-border-subtle hover:border-border-strong'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0 py-0.5">
            <ShieldCheck size={14} className="text-brand-accent shrink-0" />
            {selectedRoles.length === 0 ? (
              <span className="text-text-muted">Select user roles & permissions...</span>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedRoles.slice(0, 3).map((code) => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[3px] bg-brand-accent-light text-brand-accent border border-brand-accent/20"
                  >
                    <span>{activeRoleMap[code]?.name || code}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRole(code);
                      }}
                      className="hover:text-status-danger cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {selectedRoles.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-[3px] bg-surface-muted text-text-muted border border-border-subtle">
                    +{selectedRoles.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <ChevronDown
            size={14}
            className={`text-text-muted shrink-0 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-brand-accent' : ''
            }`}
          />
        </div>

        {/* Dropdown Popover Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-surface-card border border-border-subtle rounded-[6px] shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
            {/* Search and Action Bar */}
            <div className="p-2 border-b border-border-subtle bg-surface-muted/30 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles..."
                  className="w-full pl-8 pr-2 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:outline-none focus:border-brand-accent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {onSelectAll && (
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="px-2 py-1 text-[10px] font-medium text-brand-accent hover:underline cursor-pointer shrink-0"
                >
                  All
                </button>
              )}
              {onClearSelection && (
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="px-2 py-1 text-[10px] font-medium text-text-muted hover:text-status-danger cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Roles List */}
            <div className="max-h-56 overflow-y-auto p-1.5 space-y-1 divide-y divide-border-subtle/30">
              {filteredRoles.map((role) => {
                const isChecked = selectedRoles.includes(role.code);
                return (
                  <div
                    key={role.code}
                    onClick={() => onToggleRole(role.code)}
                    className={`flex items-start gap-2.5 p-2 rounded-[4px] cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-brand-accent-light/50 text-text-primary'
                        : 'hover:bg-surface-muted/60 text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getRoleIcon(role.code)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-medium text-text-primary truncate">
                          {role.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-brand-accent border-brand-accent text-white'
                              : 'border-border-subtle bg-surface-card'
                          }`}
                        >
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              {filteredRoles.length === 0 && (
                <div className="p-4 text-center text-xs text-text-muted">
                  No roles match "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-[10px] text-text-muted">
        Assign one or more roles granting specific factory domain permissions
      </p>
    </div>
  );
};

export default UserRoleDropdown;
