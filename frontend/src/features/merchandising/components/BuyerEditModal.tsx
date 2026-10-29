/**
 * =============================================================================
 * [EN] Edit Buyer Modal (BuyerEditModal.tsx)
 * [BN] বায়ার তথ্য হালনাগাদ মডাল (BuyerEditModal.tsx)
 * =============================================================================
 * [EN] Reference: Rule 27 (Micro-modal), Rule 28 (Single-word buttons), Rule 29 (Minimal text)
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, TextInput, Select } from '@/components/ui';
import type { Buyer, UpdateBuyerPayload } from '@/types';
import { buyerService } from '../services/buyerService';
import {
  BUYER_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  COMPLIANCE_STATUS_OPTIONS,
  STATUS_OPTIONS,
} from '../constants/buyerConstants';

interface BuyerEditModalProps {
  isOpen: boolean;
  buyer: Buyer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BuyerEditModal: React.FC<BuyerEditModalProps> = ({
  isOpen,
  buyer,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateBuyerPayload>({
    buyerName: '',
    shortName: '',
    buyerType: 'DIRECT',
    commissionPercentage: 0,
    countryOfOrigin: '',
    defaultCurrency: 'USD',
    paymentTerms: 'LC_AT_SIGHT',
    creditPeriodDays: 30,
    complianceStatus: 'COMPLIANT',
    status: 'ACTIVE',
    notes: '',
  });

  useEffect(() => {
    if (buyer) {
      setFormData({
        buyerName: buyer.buyerName || '',
        shortName: buyer.shortName || '',
        buyerType: buyer.buyerType || 'DIRECT',
        commissionPercentage: buyer.commissionPercentage || 0,
        countryOfOrigin: buyer.countryOfOrigin || '',
        defaultCurrency: buyer.defaultCurrency || 'USD',
        paymentTerms: buyer.paymentTerms || 'LC_AT_SIGHT',
        creditPeriodDays: buyer.creditPeriodDays || 30,
        complianceStatus: buyer.complianceStatus || 'COMPLIANT',
        status: buyer.status || 'ACTIVE',
        notes: buyer.notes || '',
      });
    }
  }, [buyer]);

  if (!isOpen || !buyer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.buyerName.trim()) {
      toast.error('Buyer name is required');
      return;
    }
    if (!formData.countryOfOrigin.trim()) {
      toast.error('Country is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await buyerService.updateBuyer(buyer.id, formData);
      toast.success('Buyer updated');
      onSuccess();
      onClose();
    } catch {
      // Handled by global axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-surface-card border border-border-subtle rounded-[6px] shadow-lg max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Edit Buyer
            </h3>
            <span className="font-mono text-xs text-text-muted">
              ({buyer.buyerCode})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Name *
              </label>
              <TextInput
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Short Name
              </label>
              <TextInput
                value={formData.shortName || ''}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Type
              </label>
              <Select
                value={formData.buyerType}
                onChange={(e) => setFormData({ ...formData, buyerType: e.target.value as any })}
                options={BUYER_TYPE_OPTIONS as any}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Country *
              </label>
              <TextInput
                value={formData.countryOfOrigin}
                onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Currency
              </label>
              <Select
                value={formData.defaultCurrency}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                options={CURRENCY_OPTIONS as any}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Terms
              </label>
              <Select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                options={PAYMENT_TERMS_OPTIONS as any}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Credit Days
              </label>
              <TextInput
                type="number"
                value={formData.creditPeriodDays.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditPeriodDays: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Commission %
              </label>
              <TextInput
                type="number"
                step="0.01"
                value={formData.commissionPercentage.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    commissionPercentage: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Compliance
              </label>
              <Select
                value={formData.complianceStatus}
                onChange={(e) => setFormData({ ...formData, complianceStatus: e.target.value as any })}
                options={COMPLIANCE_STATUS_OPTIONS as any}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                options={STATUS_OPTIONS as any}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
