/**
 * =============================================================================
 * [EN] User Account Permanent Purge Confirmation Micro-Modal (UserPurgeModal)
 * [BN] ব্যবহারকারী একাউন্ট চিরতরে মুছে ফেলা নিশ্চিতকরণ মাইক্রো-মডাল (রুল ০৭, ১৫, ২৭ ও ২৮)
 * =============================================================================
 */

import React from 'react';
import { AlertOctagon, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';

export interface UserPurgeModalProps {
  readonly isOpen: boolean;
  readonly username: string;
  readonly isPurging: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export const UserPurgeModal: React.FC<UserPurgeModalProps> = ({
  isOpen,
  username,
  isPurging,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-card border border-status-danger-border rounded-[6px] shadow-lg max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-status-danger-bg/30">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertOctagon size={18} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Purge User
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPurging}
            className="text-text-muted hover:text-text-primary p-1 rounded-[3px] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 text-xs text-text-secondary space-y-2">
          <p>
            Permanently purge user account{' '}
            <span className="font-mono font-bold text-text-primary">@{username}</span>?
          </p>
          <p className="text-[11px] text-status-danger font-medium">
            Warning: This action is permanent and cannot be undone. All linked custom clearance records will be wiped.
          </p>
        </div>

        <div className="p-3 bg-surface-muted/50 border-t border-border-subtle flex items-center justify-end gap-2">
          <Button size="xs" variant="secondary" onClick={onClose} disabled={isPurging}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPurging}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-status-danger hover:bg-status-danger/90 rounded-[3px] shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={12} className={isPurging ? 'animate-spin' : ''} />
            <span>Purge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPurgeModal;
