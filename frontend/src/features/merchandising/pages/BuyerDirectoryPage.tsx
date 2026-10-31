/**
 * =============================================================================
 * [EN] Global Buyer Directory Page (BuyerDirectoryPage.tsx)
 * [BN] গ্লোবাল বায়ার ডিরেক্টরি পেজ (BuyerDirectoryPage.tsx)
 * =============================================================================
 * [EN] Reference: Domain 01 Merchandising, Rule 05 (Zero Static), Rule 27 (Full Page), Rule 28 (Single-word buttons)
 * [BN] বায়ার মাস্টার তালিকা ও সাব-ব্র্যান্ড পোর্টফোলিও ব্যবস্থাপনা স্ক্রিন।
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Building2 } from 'lucide-react';
import { Button, TextInput, Select, DataTable } from '@/components/ui';
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
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals & Drawer state
  const [buyerToDelete, setBuyerToDelete] = useState<Buyer | null>(null);
  const [brandDrawerBuyer, setBrandDrawerBuyer] = useState<Buyer | null>(null);

  const fetchBuyers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await buyerService.getBuyers({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        buyerType: typeFilter !== 'ALL' ? typeFilter : undefined,
      });
      setBuyers(res.content || []);
    } catch {
      // Handled by global interceptor
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  const columns = useBuyerColumns({
    onOpenBrands: (b) => setBrandDrawerBuyer(b),
    onEditBuyer: (b) => navigate(`/app/merchandising/buyers/${b.id}/edit`),
    onDeleteBuyer: (b) => setBuyerToDelete(b),
  });

  return (
    <div className="p-6 space-y-4">
      {/* Page Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-accent/10 text-accent">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-tight">
              Buyers
            </h1>
            <p className="text-xs text-text-muted">
              Directory & brand portfolio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={fetchBuyers}
            disabled={isLoading}
            icon={<RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/app/merchandising/buyers/new')}
            icon={<Plus size={14} />}
          >
            Register
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 rounded border border-border-subtle bg-surface-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="w-64">
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="text-xs"
            />
          </div>

          <div className="w-36">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[{ value: 'ALL', label: 'All Types' }, ...BUYER_TYPE_OPTIONS] as any}
            />
          </div>

          <div className="w-32">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: 'ALL', label: 'All Status' }, ...STATUS_OPTIONS] as any}
            />
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-text-muted">
          {buyers.length}
        </span>
      </div>

      {/* High-Density Data Grid */}
      <div className="rounded border border-border-subtle bg-surface-card overflow-hidden">
        <DataTable
          columns={columns}
          data={buyers}
          isLoading={isLoading}
        />
      </div>

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
