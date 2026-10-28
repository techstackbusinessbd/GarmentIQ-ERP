/**
 * =============================================================================
 * [EN] Multi-Tenant Client Factory Data Table (ClientTable)
 * [BN] মাল্টি-টেন্যান্ট ক্লায়েন্ট ফ্যাক্টরি ডেটা টেবিল (ClientTable) (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Reference: Approved Architecture Specification (2026-10-21)
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table v8), Rule 15, Rule 20, Rule 28
 * [BN] ট্যানস্ট্যাক টেবিল ভি৮ চালিত ক্লায়েন্ট ফ্যাক্টরি গ্রিড, ফিল্টারিং ও অ্যাকশনস।
 */

import React, { useState, useMemo } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Tenant } from '@/types';
import { DataTable, Button } from '@/components/ui';
import { clientService } from '../services/clientService';
import { ClientDeactivateModal } from './ClientDeactivateModal';
import { ClientRestoreModal } from './ClientRestoreModal';
import { ClientPurgeModal } from './ClientPurgeModal';
import { useClientColumns } from './useClientColumns';

export interface ClientTableProps {
  readonly clients: readonly Tenant[];
  readonly isLoading: boolean;
  readonly onRefresh: () => void;
  readonly onEditClient: (client: Tenant) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  isLoading,
  onRefresh,
  onEditClient,
}) => {
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'TRASH'>('ACTIVE');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [clientToDeactivate, setClientToDeactivate] = useState<Tenant | null>(null);
  const [clientToRestore, setClientToRestore] = useState<Tenant | null>(null);
  const [clientToPurge, setClientToPurge] = useState<Tenant | null>(null);
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  const activeCount = useMemo(() => clients.filter((c) => !c.isDeleted && !c.deleted).length, [clients]);
  const trashCount = useMemo(() => clients.filter((c) => c.isDeleted || c.deleted).length, [clients]);

  const modeFilteredClients = useMemo(() => {
    return clients.filter((c) => {
      const isDel = Boolean(c.isDeleted || c.deleted);
      return viewMode === 'TRASH' ? isDel : !isDel;
    });
  }, [clients, viewMode]);

  const filteredClients = useMemo(() => {
    if (selectedTier === 'ALL') return modeFilteredClients;
    return modeFilteredClients.filter((c) => (c.subscriptionTier || 'ENTERPRISE') === selectedTier);
  }, [modeFilteredClients, selectedTier]);

  const handleConfirmDeactivate = async () => {
    if (!clientToDeactivate) return;
    setIsDeactivating(true);
    try {
      await clientService.deleteTenant(clientToDeactivate.id);
      toast.success(`Client "${clientToDeactivate.tenantName || clientToDeactivate.tenantCode}" moved to trash.`);
      setClientToDeactivate(null);
      onRefresh();
    } catch {
      toast.error('Failed to deactivate client factory.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleConfirmRestore = async () => {
    if (!clientToRestore) return;
    setIsRestoring(true);
    try {
      await clientService.restoreTenant(clientToRestore.id);
      toast.success(`Client "${clientToRestore.tenantName || clientToRestore.tenantCode}" restored successfully.`);
      setClientToRestore(null);
      onRefresh();
    } catch {
      toast.error('Failed to restore client factory.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleConfirmPurge = async () => {
    if (!clientToPurge) return;
    setIsPurging(true);
    try {
      await clientService.purgeTenant(clientToPurge.id);
      toast.success(`Client "${clientToPurge.tenantName || clientToPurge.tenantCode}" permanently purged.`);
      setClientToPurge(null);
      onRefresh();
    } catch {
      toast.error('Failed to purge client factory.');
    } finally {
      setIsPurging(false);
    }
  };

  const columns = useClientColumns({
    onEditClient,
    onDeactivate: setClientToDeactivate,
    onRestore: setClientToRestore,
    onPurge: setClientToPurge,
  });

  return (
    <>
      <DataTable
        title="Client Directory"
        icon={<Building2 size={16} className="text-brand-accent" />}
        headerExtra={
          <span className="text-xs text-text-muted font-medium">
            Total: <span className="font-semibold text-text-primary">{filteredClients.length}</span>{' '}
            {filteredClients.length === 1 ? 'Organization' : 'Organizations'}
          </span>
        }
        headerActions={
          <div className="flex items-center gap-2">
            {/* [EN] Active vs Trash toggle / [BN] অ্যাক্টিভ বনাম ট্র্যাশ টগল */}
            <div className="inline-flex items-center p-0.5 bg-surface-muted rounded border border-border-subtle">
              <button
                type="button"
                onClick={() => setViewMode('ACTIVE')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  viewMode === 'ACTIVE' ? 'bg-surface-card text-brand-accent shadow-2xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('TRASH')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  viewMode === 'TRASH' ? 'bg-surface-card text-status-danger shadow-2xs' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Trash ({trashCount})
              </button>
            </div>

            {viewMode === 'ACTIVE' && (
              <>
                <label htmlFor="client-plan-filter" className="text-xs font-medium text-text-secondary whitespace-nowrap">Plan:</label>
                <select
                  id="client-plan-filter"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
                >
                  <option value="ALL">All Plans ({modeFilteredClients.length})</option>
                  <option value="ENTERPRISE">Enterprise Plan</option>
                  <option value="PROFESSIONAL">Professional Plan</option>
                  <option value="STARTER">Starter Plan</option>
                </select>
              </>
            )}

            <Button size="xs" variant="secondary" onClick={onRefresh} disabled={isLoading} icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}>
              Refresh
            </Button>
          </div>
        }
        columns={columns}
        data={filteredClients}
        isLoading={isLoading}
        searchPlaceholder="Search clients..."
      />

      <ClientDeactivateModal
        client={clientToDeactivate}
        isOpen={Boolean(clientToDeactivate)}
        isDeactivating={isDeactivating}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setClientToDeactivate(null)}
      />

      <ClientRestoreModal
        client={clientToRestore}
        isOpen={Boolean(clientToRestore)}
        isRestoring={isRestoring}
        onConfirm={handleConfirmRestore}
        onCancel={() => setClientToRestore(null)}
      />

      <ClientPurgeModal
        client={clientToPurge}
        isOpen={Boolean(clientToPurge)}
        isPurging={isPurging}
        onConfirm={handleConfirmPurge}
        onCancel={() => setClientToPurge(null)}
      />
    </>
  );
};

export default ClientTable;
