/**
 * =============================================================================
 * [EN] Soft-Delete Buyer Confirmation Modal (BuyerDeleteModal.tsx)
 * [BN] বায়ার নিষ্ক্রিয়করণ নিশ্চিতকরণ মডাল (BuyerDeleteModal.tsx)
 * =============================================================================
 * [EN] Reference: Rule 27 (Micro-modal), Rule 28 (Single-word buttons), Rule 29 (Minimal text)
 */

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import type { Buyer } from '@/types';
import { buyerService } from '../services/buyerService';

interface BuyerDeleteModalProps {
  isOpen: boolean;
  buyer: Buyer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BuyerDeleteModal: React.FC<BuyerDeleteModalProps> = ({
  isOpen,
  buyer,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !buyer) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await buyerService.deleteBuyer(buyer.id);
      toast.success('Buyer removed');
      onSuccess();
      onClose();
    } catch {
      // Handled by interceptor
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-surface-card border border-border-subtle rounded-[6px] shadow-lg max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertTriangle size={18} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Deactivate Buyer
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 text-xs text-text-secondary space-y-2">
          <p>
            Are you sure you want to deactivate{' '}
            <strong className="text-text-primary">{buyer.buyerName}</strong> (
            <span className="font-mono text-text-muted">{buyer.buyerCode}</span>)?
          </p>
          <p className="text-[11px] text-text-muted">
            The buyer and associated sub-brands will be archived from active merchandising operations.
          </p>
        </div>

        <div className="p-3 bg-surface-base border-t border-border-subtle flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};
