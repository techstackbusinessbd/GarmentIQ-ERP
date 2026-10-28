/**
 * =============================================================================
 * [EN] User Account Restore Confirmation Micro-Modal (UserRestoreModal)
 * [BN] ব্যবহারকারী একাউন্ট রিস্টোর নিশ্চিতকরণ মাইক্রো-মডাল (রুল ০৭, ১৫, ২৭ ও ২৮)
 * =============================================================================
 */

import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui';

export interface UserRestoreModalProps {
  readonly isOpen: boolean;
  readonly username: string;
  readonly isRestoring: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export const UserRestoreModal: React.FC<UserRestoreModalProps> = ({
  isOpen,
  username,
  isRestoring,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-card border border-border-subtle rounded-[6px] shadow-lg max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-accent">
            <RotateCcw size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Restore User
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isRestoring}
            className="text-text-muted hover:text-text-primary p-1 rounded-[3px] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 text-xs text-text-secondary space-y-2">
          <p>
            Are you sure you want to restore user account{' '}
            <span className="font-mono font-bold text-text-primary">@{username}</span>?
          </p>
          <p className="text-[11px] text-text-muted">
            The account will be moved back to Active status and granted access according to its assigned roles.
          </p>
        </div>

        <div className="p-3 bg-surface-muted/50 border-t border-border-subtle flex items-center justify-end gap-2">
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
            Restore
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserRestoreModal;
