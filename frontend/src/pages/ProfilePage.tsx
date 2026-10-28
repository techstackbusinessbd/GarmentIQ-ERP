/**
 * =============================================================================
 * [EN] Enterprise User Profile & Workspace Preferences Hub (ProfilePage.tsx)
 * [BN] এন্টারপ্রাইজ ব্যবহারকারী প্রোফাইল ও প্রেফারেন্স হাব (ProfilePage.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] অপশন A অনুসারী ইউনিফাইড সাব-ট্যাব আর্কিটেকচার:
 *      ১. Profile & Identity (ব্যক্তিগত তথ্য, টেন্যান্ট স্কোপ ও সেশন)
 *      ২. Security & Password (পাসওয়ার্ড পরিবর্তন ও সেশন সুরক্ষা)
 *      ৩. Workspace Preferences (থিম স্টুডিও, ডার্ক/লাইট মোড, সাইডবার ও কালার প্যালেট)
 *      ৪. My Roles & Access (অর্পিত রোল ও বাউন্ডেড কনটেক্সট পারমিশনস)
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  KeyRound,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import {
  ProfileHeader,
  ProfileIdentityCard,
  ProfileChangePasswordCard,
  ProfileThemeStudio,
  ProfileRolesTab,
} from '@/features/profile';

type ProfileTabKey = 'PROFILE' | 'SECURITY' | 'PREFERENCES' | 'ROLES';

interface TabDefinition {
  readonly key: ProfileTabKey;
  readonly label: string;
  readonly icon: React.FC<{ size?: number; className?: string }>;
  readonly badge?: string;
}

const PROFILE_TABS: readonly TabDefinition[] = [
  { key: 'PROFILE', label: 'Profile & Credentials', icon: User },
  { key: 'SECURITY', label: 'Security & Password', icon: KeyRound },
  { key: 'PREFERENCES', label: 'Workspace Preferences', icon: Palette },
  { key: 'ROLES', label: 'My Roles & Privileges', icon: ShieldCheck },
];

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab')?.toUpperCase();
  const validTab = PROFILE_TABS.some((t) => t.key === queryTab) ? (queryTab as ProfileTabKey) : 'PROFILE';

  const [activeTab, setActiveTab] = useState<ProfileTabKey>(validTab);

  const handleTabChange = (key: ProfileTabKey) => {
    setActiveTab(key);
    setSearchParams(key === 'PROFILE' ? {} : { tab: key.toLowerCase() });
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. Executive Identity Banner & Avatar Header */}
      <ProfileHeader />

      {/* 2. Unified Navigation Tabs Bar (Option A Standard) */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] px-2 pt-1 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 border-b border-border-subtle/50 min-w-max">
          {PROFILE_TABS.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap select-none ${
                  isActive
                    ? 'border-brand-accent text-brand-accent bg-brand-accent/5 rounded-t-[4px]'
                    : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-muted/50'
                }`}
              >
                <IconComp size={15} className={isActive ? 'text-brand-accent' : 'text-text-muted'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dynamic Active Tab Canvas */}
      <div className="transition-all duration-200">
        {/* Tab 1: Profile & Corporate Credentials */}
        {activeTab === 'PROFILE' && (
          <div className="max-w-4xl mx-auto">
            <ProfileIdentityCard />
          </div>
        )}

        {/* Tab 2: Security, Password Change & Session Safeguards */}
        {activeTab === 'SECURITY' && (
          <div className="max-w-2xl mx-auto">
            <ProfileChangePasswordCard />
          </div>
        )}

        {/* Tab 3: Workspace Theme Studio & Visual Preferences */}
        {activeTab === 'PREFERENCES' && (
          <div className="max-w-4xl mx-auto">
            <ProfileThemeStudio />
          </div>
        )}

        {/* Tab 4: RBAC Clearances & Bounded Context Clearance */}
        {activeTab === 'ROLES' && (
          <div className="max-w-5xl mx-auto">
            <ProfileRolesTab />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
