/**
 * =============================================================================
 * [EN] Role Live Preview FactBox Card Component (RolePreviewCard.tsx)
 * [BN] রোল লাইভ প্রিভিউ কার্ড কম্পোনেন্ট (রুল ০৭ ও ২১)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components), Rule 28
 */

import React from 'react';
import { Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui';

export interface RolePreviewCardProps {
  readonly roleName: string;
  readonly roleCode: string;
  readonly description: string;
  readonly permissionsCount: number;
  readonly isSubmitting: boolean;
  readonly onSubmit: () => void;
}

export const RolePreviewCard: React.FC<RolePreviewCardProps> = ({
  roleName,
  roleCode,
  description,
  permissionsCount,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-4 shadow-sm">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        Live Role Preview
      </h4>

      <div className="p-4 rounded-[6px] bg-surface-muted/40 border border-border-subtle space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h5 className="font-semibold text-text-primary text-sm leading-tight">
              {roleName.trim() || 'Role Title Preview'}
            </h5>
            <span className="font-mono text-[11px] text-text-muted tracking-wide">
              {roleCode.trim() || 'ROLE_CODE_PREVIEW'}
            </span>
          </div>
        </div>

        <div className="text-xs text-text-secondary leading-snug line-clamp-3">
          {description.trim() || 'Operational scope description will appear here as you type.'}
        </div>

        <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
          <span className="text-text-muted">Classification</span>
          <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-semibold bg-status-success-bg text-status-success border border-status-success-border">
            Custom Role
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Permissions Count</span>
          <span className="font-semibold text-text-primary">
            {permissionsCount} Clearances
          </span>
        </div>
      </div>

      <Button
        size="md"
        variant="primary"
        className="w-full justify-center"
        onClick={onSubmit}
        disabled={isSubmitting}
        icon={<Save size={14} className={isSubmitting ? 'animate-spin' : ''} />}
      >
        {isSubmitting ? 'Saving' : 'Save'}
      </Button>
    </div>
  );
};

export default RolePreviewCard;
