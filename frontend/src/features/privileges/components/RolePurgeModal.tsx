/**
 * =============================================================================
 * [EN] Role Permanent Purge Modal Component (RolePurgeModal.tsx)
 * [BN] রোল চিরতরে মুছে ফেলা (Purge) নিশ্চিতকরণ মাইক্রো-মডাল
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 27 (Micro-Modal Only), Rule 28 (Single Word)
 */

import React from 'react';
import { AlertOctagon, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui';
import type { RoleDefinition } from '@/features/users';

export interface RolePurgeModalProps {
  readonly role: RoleDefinition | null;
  readonly isOpen: boolean;
  readonly isPurging?: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

export const RolePurgeModal: React.FC<RolePurgeModalProps> = ({
  role,
  isOpen,
  isPurging = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !role) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="purge-role-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-surface-card border border-border-subtle rounded-[6px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-muted/50">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertOctagon size={16} />
            <h3 id="purge-role-title" className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Purge Role
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPurging}
            className="p-1 text-text-muted hover:text-text-primary rounded-[4px] hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-2.5 text-xs text-text-secondary">
          <p>
            Permanently purge role <span className="font-semibold text-text-primary">{role.name}</span> (
            <code className="font-mono text-brand-accent text-[11px]">{role.code}</code>)?
          </p>
          <div className="p-2.5 rounded-[4px] bg-status-danger-bg border border-status-danger-border text-status-danger space-y-0.5">
            <p className="font-semibold text-[11px]">Permanent Action Warning:</p>
            <p className="text-[10px] leading-tight">
              This action cannot be undone. The role will be permanently erased from the database.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-border-subtle bg-surface-muted/30">
          <Button size="xs" variant="secondary" onClick={onClose} disabled={isPurging}>
            Cancel
          </Button>
          <Button
            size="xs"
            variant="danger"
            onClick={onConfirm}
            disabled={isPurging}
            icon={<Trash2 size={12} className={isPurging ? 'animate-spin' : ''} />}
          >
            {isPurging ? 'Purging' : 'Purge'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RolePurgeModal;
