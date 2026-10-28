/**
 * =============================================================================
 * [EN] Micro-Modal for Deleting a Custom Role (DeleteRoleModal.tsx)
 * [BN] কাস্টম রোল অপসারণের মাইক্রো কনফার্মেশন ডায়ালগ (রুল ২৭ অনুবর্তী)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 27 (Micro-Modal Only)
 * [BN] শুধুমাত্র নিশ্চিতকরণ ডায়ালগের জন্য ক্ষুদ্র মাইক্রো-মডাল ব্যবহার।
 */

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui';
import type { RoleDefinition } from '@/features/users';

export interface DeleteRoleModalProps {
  readonly role: RoleDefinition | null;
  readonly isOpen: boolean;
  readonly isDeleting?: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  role,
  isOpen,
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !role) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-role-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-surface-card border border-border-subtle rounded-[6px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-surface-muted/50">
          <div className="flex items-center gap-2.5 text-status-danger">
            <div className="p-1.5 rounded-[4px] bg-status-danger-bg border border-status-danger-border">
              <AlertTriangle size={18} />
            </div>
            <h3 id="delete-role-title" className="text-sm font-semibold text-text-primary">
              Delete Custom Role
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-text-muted hover:text-text-primary rounded-[4px] hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-text-secondary leading-relaxed">
            Are you sure you want to permanently delete the custom enterprise role{' '}
            <span className="font-semibold text-text-primary underline decoration-status-danger/40">
              {role.name}
            </span>{' '}
            (<code className="font-mono text-brand-accent text-[11px]">{role.code}</code>)?
          </p>
          <div className="p-3 rounded-[4px] bg-status-danger-bg/40 border border-status-danger-border text-[11px] text-text-secondary space-y-1">
            <p className="font-semibold text-status-danger">Security Notice:</p>
            <p>
              This role and its baseline permission mapping will be removed. Built-in system roles cannot be deleted. Roles with currently assigned active employees cannot be removed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border-subtle bg-surface-muted/30">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            icon={<Trash2 size={13} className={isDeleting ? 'animate-spin' : ''} />}
          >
            {isDeleting ? 'Deleting' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
