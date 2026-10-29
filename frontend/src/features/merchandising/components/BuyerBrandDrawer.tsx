/**
 * =============================================================================
 * [EN] Buyer Sub-Brand Portfolio Drawer (BuyerBrandDrawer.tsx)
 * [BN] বায়ার সাব-ব্র্যান্ড পোর্টফোলিও ড্রয়ার (BuyerBrandDrawer.tsx)
 * =============================================================================
 * [EN] Reference: Rule 21 (Component-based), Rule 28 (Single-word buttons)
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, TextInput, Select, Badge } from '@/components/ui';
import type { Buyer, BuyerBrand, CreateBuyerBrandPayload } from '@/types';
import { buyerService } from '../services/buyerService';
import { SEASON_PATTERN_OPTIONS } from '../constants/buyerConstants';

interface BuyerBrandDrawerProps {
  isOpen: boolean;
  buyer: Buyer | null;
  onClose: () => void;
  onRefreshParent: () => void;
}

export const BuyerBrandDrawer: React.FC<BuyerBrandDrawerProps> = ({
  isOpen,
  buyer,
  onClose,
  onRefreshParent,
}) => {
  const [brands, setBrands] = useState<BuyerBrand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newBrand, setNewBrand] = useState<CreateBuyerBrandPayload>({
    brandName: '',
    targetMarket: 'Global',
    seasonPattern: 'FOUR_SEASONS',
    status: 'ACTIVE',
  });

  const loadBrands = async (buyerId: string) => {
    try {
      setIsLoading(true);
      const data = await buyerService.getBrands(buyerId);
      setBrands(data);
    } catch {
      // Handled by global interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (buyer && isOpen) {
      loadBrands(buyer.id);
      setShowAddForm(false);
    }
  }, [buyer, isOpen]);

  if (!isOpen || !buyer) return null;

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.brandName.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      setIsAdding(true);
      await buyerService.createBrand(buyer.id, newBrand);
      toast.success('Brand added');
      setNewBrand({
        brandName: '',
        targetMarket: 'Global',
        seasonPattern: 'FOUR_SEASONS',
        status: 'ACTIVE',
      });
      setShowAddForm(false);
      loadBrands(buyer.id);
      onRefreshParent();
    } catch {
      // Handled by interceptor
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    try {
      await buyerService.deleteBrand(buyer.id, brandId);
      toast.success('Brand removed');
      loadBrands(buyer.id);
      onRefreshParent();
    } catch {
      // Handled by interceptor
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-surface-card border-l border-border-subtle w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-base">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-brand-primary" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Sub-Brand Portfolio
              </h3>
              <p className="text-[11px] text-text-muted">
                {buyer.buyerName} ({buyer.buyerCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3 border-b border-border-subtle flex justify-between items-center bg-surface-card">
          <span className="text-xs font-medium text-text-secondary">
            Brands ({brands.length})
          </span>
          {!showAddForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="text-xs h-7 px-2 flex items-center gap-1"
            >
              <Plus size={12} />
              Add
            </Button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleAddBrand} className="p-3 border-b border-border-subtle bg-surface-base space-y-2">
            <div>
              <label className="block text-[10px] font-semibold uppercase text-text-secondary mb-0.5">
                Brand Name *
              </label>
              <TextInput
                value={newBrand.brandName}
                onChange={(e) => setNewBrand({ ...newBrand, brandName: e.target.value })}
                placeholder="e.g. COS, Monki"
                autoFocus
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold uppercase text-text-secondary mb-0.5">
                  Target Market
                </label>
                <TextInput
                  value={newBrand.targetMarket || ''}
                  onChange={(e) => setNewBrand({ ...newBrand, targetMarket: e.target.value })}
                  placeholder="e.g. Europe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase text-text-secondary mb-0.5">
                  Season
                </label>
                <Select
                  value={newBrand.seasonPattern}
                  onChange={(e) => setNewBrand({ ...newBrand, seasonPattern: e.target.value })}
                  options={SEASON_PATTERN_OPTIONS as any}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isAdding}
              >
                {isAdding ? 'Adding' : 'Save'}
              </Button>
            </div>
          </form>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-text-muted">
              <Loader2 size={18} className="animate-spin mr-2" />
              <span className="text-xs">Loading</span>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-muted">
              No sub-brands registered
            </div>
          ) : (
            brands.map((b) => (
              <div
                key={b.id}
                className="p-2.5 rounded border border-border-subtle bg-surface-card flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-text-muted">
                      {b.brandCode}
                    </span>
                    <span className="text-xs font-semibold text-text-primary">
                      {b.brandName}
                    </span>
                    <Badge variant={b.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {b.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
                    {b.targetMarket && <span>Market: {b.targetMarket}</span>}
                    <span>Pattern: {b.seasonPattern}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteBrand(b.id)}
                  className="h-7 w-7 p-0 flex items-center justify-center text-text-muted hover:text-status-danger"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border-subtle bg-surface-base flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
