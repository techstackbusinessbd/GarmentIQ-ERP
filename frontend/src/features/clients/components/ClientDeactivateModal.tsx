/**
 * =============================================================================
 * [EN] Client Organization Deactivation Modal (ClientDeactivateModal)
 * [BN] ক্লায়েন্ট প্রতিষ্ঠান নিষ্ক্রিয়করণ নিশ্চিতকরণ মডাল (রুল ০৭ ও ১৫)
 * =============================================================================
 */

import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import type { Tenant } from '@/types';

export interface ClientDeactivateModalProps {
  readonly client: Tenant | null;
  readonly isOpen: boolean;
  readonly isDeactivating: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ClientDeactivateModal: React.FC<ClientDeactivateModalProps> = ({
  client,
  isOpen,
  isDeactivating,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-surface-card border border-border-subtle rounded-[6px] shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/30">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertTriangle size={18} />
            <h3 className="text-sm font-bold text-text-primary">
              Deactivate Client Account
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-text-muted hover:text-text-primary rounded-[3px] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-text-secondary">
          <p>
            Are you sure you want to deactivate{' '}
            <strong className="text-text-primary">{client.tenantName || client.companyName}</strong>{' '}
            (<span className="font-mono text-brand-accent">{client.tenantCode}</span>)?
          </p>
          <div className="p-3 rounded-[4px] bg-status-danger-bg border border-status-danger-border text-status-danger space-y-1">
            <p className="font-semibold">⚠️ Notice:</p>
            <p className="text-[11px] leading-tight">
              All users under this client account will lose access immediately.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-end gap-2 bg-surface-muted/40">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeactivating}
            className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] border border-border-subtle transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeactivating}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-status-danger hover:bg-red-700 rounded-[3px] shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={13} className={isDeactivating ? 'animate-spin' : ''} />
            <span>Deactivate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDeactivateModal;
