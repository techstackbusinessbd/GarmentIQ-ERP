/**
 * =============================================================================
 * [EN] User Account Deactivation Confirmation Modal (UserDeactivateModal)
 * [BN] ব্যবহারকারী একাউন্ট নিষ্ক্রিয়করণ নিশ্চিতকরণ মডাল (UserDeactivateModal)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 02 (Sec 8: Modals for small/simple CRUD), Rule 07 (<300 lines), Rule 15, Rule 20
 * [BN] ব্যবহারকারী একাউন্ট সফট-ডিলিট বা নিষ্ক্রিয়করণের জন্য ছোট কনটেক্সচুয়াল মডাল।
 */

import React from 'react';
import { AlertTriangle, X, UserX } from 'lucide-react';

/**
 * [EN] Properties contract for UserDeactivateModal.
 * [BN] UserDeactivateModal কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface UserDeactivateModalProps {
  readonly isOpen: boolean;
  readonly username: string;
  readonly isDeactivating: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

/**
 * [EN] Lightweight Confirmation Modal for Account Deactivation.
 * [BN] একাউন্ট নিষ্ক্রিয়করণের জন্য ছোট কনফার্মেশন মডাল কম্পোনেন্ট।
 */
export const UserDeactivateModal: React.FC<UserDeactivateModalProps> = ({
  isOpen,
  username,
  isDeactivating,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-surface-card border border-border-subtle rounded-[6px] shadow-lg max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertTriangle size={18} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Deactivate User Account
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeactivating}
            className="text-text-muted hover:text-text-primary p-1 rounded-[3px] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 text-xs text-text-secondary space-y-2">
          <p>
            Are you sure you want to deactivate user account{' '}
            <span className="font-mono font-bold text-text-primary">@{username}</span>?
          </p>
          <p className="text-[11px] text-text-muted">
            The user will lose immediate access to shop floor dashboards, merchandising orders, and
            enterprise workflows. This action can be reversed by an administrator.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-surface-muted/50 border-t border-border-subtle flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeactivating}
            className="px-3 py-1.5 text-xs font-medium text-text-primary bg-surface-card hover:bg-surface-muted border border-border-subtle rounded-[3px] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeactivating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-status-danger hover:bg-status-danger/90 rounded-[3px] shadow-xs transition-colors disabled:opacity-50"
          >
            <UserX size={13} />
            <span>{isDeactivating ? 'Deactivating...' : 'Deactivate User'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeactivateModal;
