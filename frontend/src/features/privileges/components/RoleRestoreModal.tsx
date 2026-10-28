/**
 * =============================================================================
 * [EN] Role Restore Modal Component (RoleRestoreModal.tsx)
 * [BN] রোল পুনরুদ্ধার ও পুনর্বহাল নিশ্চিতকরণ মাইক্রো-মডাল
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 27 (Micro-Modal Only), Rule 28 (Single Word)
 */

import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui';
import type { RoleDefinition } from '@/features/users';

export interface RoleRestoreModalProps {
  readonly role: RoleDefinition | null;
  readonly isOpen: boolean;
  readonly isRestoring?: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

export const RoleRestoreModal: React.FC<RoleRestoreModalProps> = ({
  role,
  isOpen,
  isRestoring = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !role) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-role-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-surface-card border border-border-subtle rounded-[6px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-muted/50">
          <div className="flex items-center gap-2 text-brand-accent">
            <RotateCcw size={16} />
            <h3 id="restore-role-title" className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Restore Role
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isRestoring}
            className="p-1 text-text-muted hover:text-text-primary rounded-[4px] hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-2.5 text-xs text-text-secondary">
          <p>
            Restore role <span className="font-semibold text-text-primary">{role.name}</span> (
            <code className="font-mono text-brand-accent text-[11px]">{role.code}</code>)?
          </p>
          <div className="p-2.5 rounded-[4px] bg-brand-accent-light/40 border border-brand-accent/20 text-brand-accent space-y-0.5">
            <p className="font-semibold text-[11px]">Notice:</p>
            <p className="text-[10px] leading-tight">
              The role will be restored to active roles list with all its original permissions intact.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-border-subtle bg-surface-muted/30">
          <Button size="xs" variant="secondary" onClick={onClose} disabled={isRestoring}>
            Cancel
          </Button>
          <Button
            size="xs"
            variant="primary"
            onClick={onConfirm}
            disabled={isRestoring}
            icon={<RotateCcw size={12} className={isRestoring ? 'animate-spin' : ''} />}
          >
            {isRestoring ? 'Restoring' : 'Restore'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleRestoreModal;
