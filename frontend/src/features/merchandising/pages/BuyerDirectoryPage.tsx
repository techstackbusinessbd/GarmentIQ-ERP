/**
 * =============================================================================
 * [EN] Global Buyer Directory Page (BuyerDirectoryPage.tsx)
 * [BN] গ্লোবাল বায়ার ডিরেক্টরি পেজ (BuyerDirectoryPage.tsx)
 * =============================================================================
 * [EN] Reference: Domain 01 Merchandising, Rule 05 (Zero Static), Rule 20 (Tokens), Rule 27 (Full Page), Rule 28 (Single-word buttons)
 * [BN] বায়ার মাস্টার তালিকা ও সাব-ব্র্যান্ড পোর্টফোলিও ব্যবস্থাপনা স্ক্রিন।
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Building2 } from 'lucide-react';
import { Button, DataTable } from '@/components/ui';
import type { Buyer } from '@/types';
import { buyerService } from '../services/buyerService';
import { useBuyerColumns } from '../components/useBuyerColumns';
import { BuyerDeleteModal } from '../components/BuyerDeleteModal';
import { BuyerBrandDrawer } from '../components/BuyerBrandDrawer';
import { BUYER_TYPE_OPTIONS, STATUS_OPTIONS } from '../constants/buyerConstants';

export const BuyerDirectoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals & Drawer state
  const [buyerToDelete, setBuyerToDelete] = useState<Buyer | null>(null);
  const [brandDrawerBuyer, setBrandDrawerBuyer] = useState<Buyer | null>(null);

  const fetchBuyers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await buyerService.getBuyers({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        buyerType: typeFilter !== 'ALL' ? typeFilter : undefined,
        size: 100,
      });
      setBuyers(res.content || []);
    } catch {
      // Handled by global interceptor
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  const columns = useBuyerColumns({
    onOpenBrands: (b) => setBrandDrawerBuyer(b),
    onEditBuyer: (b) => navigate(`/app/merchandising/buyers/${b.id}/edit`),
    onDeleteBuyer: (b) => setBuyerToDelete(b),
  });

  return (
    <div className="w-full">
      <DataTable
        title="Buyers"
        icon={<Building2 size={16} className="text-brand-accent" />}
        headerExtra={
          <span className="text-xs font-mono font-medium text-text-muted">
            {buyers.length}
          </span>
        }
        headerActions={
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Types</option>
              {BUYER_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <Button
              size="xs"
              variant="secondary"
              onClick={fetchBuyers}
              disabled={isLoading}
              icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>

            <Button
              size="xs"
              variant="primary"
              onClick={() => navigate('/app/merchandising/buyers/new')}
              icon={<Plus size={13} />}
            >
              Register
            </Button>
          </div>
        }
        searchPlaceholder="Search buyers..."
        columns={columns}
        data={buyers}
        isLoading={isLoading}
        initialPageSize={10}
      />

      {/* Confirmation Micro-Modal & Brand Drawer */}
      <BuyerDeleteModal
        isOpen={Boolean(buyerToDelete)}
        buyer={buyerToDelete}
        onClose={() => setBuyerToDelete(null)}
        onSuccess={fetchBuyers}
      />

      <BuyerBrandDrawer
        isOpen={Boolean(brandDrawerBuyer)}
        buyer={brandDrawerBuyer}
        onClose={() => setBrandDrawerBuyer(null)}
        onRefreshParent={fetchBuyers}
      />
    </div>
  );
};

export default BuyerDirectoryPage;
