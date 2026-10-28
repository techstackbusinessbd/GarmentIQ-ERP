/**
 * =============================================================================
 * [EN] User Special Permissions Dedicated Workspace (UserSpecialPermissionsPage.tsx)
 * [BN] ব্যবহারকারী বিশেষ অনুমতি ও ওভাররাইড ডেডিকেটেড পেজ (UserSpecialPermissionsPage.tsx)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components), Rule 27 (Full-page)
 * [BN] নির্দিষ্ট কর্মীর জন্য রোল বেসলাইনের অতিরিক্ত বিশেষ ক্লিয়ারেন্স ও ওভাররাইড ব্যবস্থাপনা।
 */

import React, { useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserMatrixView } from '../components/UserMatrixView';

export const UserSpecialPermissionsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const effectiveUserId = id || searchParams.get('userId') || undefined;

  // [EN] Memoized user change handler to sync URL without triggering infinite render loops
  // [BN] মেমোইজড ইউজার হ্যান্ডলার যা লুপ ছাড়াই নেভিগেশন ও ইউআরএল সিঙ্ক বজায় রাখে
  const handleUserChange = useCallback((userId: string) => {
    if (id) {
      if (id === userId) return;
      navigate(`/app/admin/users/${userId}/special-permissions`, { replace: true });
    } else {
      if (searchParams.get('userId') === userId) return;
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('userId', userId);
      setSearchParams(nextParams, { replace: true });
    }
  }, [id, searchParams, navigate, setSearchParams]);

  return (
    <div className="space-y-4 w-full">
      {/* Standardized Enterprise PageHeader */}
      <PageHeader
        title="Special Permissions"
        subtitle="Account clearance overrides & exceptions"
        badge={
          <Badge variant="accent">
            Overrides
          </Badge>
        }
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={13} />}
            onClick={() => navigate('/app/admin/users')}
            title="Return to User Directory"
          >
            Directory
          </Button>
        }
      />

      {/* Main Master-Detail High-Density Workspace */}
      <UserMatrixView
        initialUserId={effectiveUserId}
        onUserChange={handleUserChange}
      />
    </div>
  );
};

export default UserSpecialPermissionsPage;
