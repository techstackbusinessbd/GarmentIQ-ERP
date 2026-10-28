/**
 * =============================================================================
 * [EN] Client Organization Permanent Purge Modal Component (ClientPurgeModal)
 * [BN] ক্লায়েন্ট প্রতিষ্ঠান চিরতরে মুছে ফেলা (Purge) নিশ্চিতকরণ মাইক্রো-মডাল
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 27 (Micro-modal), Rule 28 (Single word)
 */

import React from 'react';
import { AlertOctagon, X, Trash2 } from 'lucide-react';
import type { Tenant } from '@/types';

export interface ClientPurgeModalProps {
  readonly client: Tenant | null;
  readonly isOpen: boolean;
  readonly isPurging: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ClientPurgeModal: React.FC<ClientPurgeModalProps> = ({
  client,
  isOpen,
  isPurging,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-surface-card border border-border-subtle rounded-[6px] shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-surface-muted/30">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertOctagon size={16} />
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">Purge Client</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-text-muted hover:text-text-primary rounded-[3px] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-2.5 text-xs text-text-secondary">
          <p>
            Permanently purge client organization <strong className="text-text-primary">{client.tenantName || client.companyName}</strong> (
            <span className="font-mono text-brand-accent">{client.tenantCode}</span>)?
          </p>
          <div className="p-2.5 rounded-[4px] bg-status-danger-bg border border-status-danger-border text-status-danger space-y-0.5">
            <p className="font-semibold text-[11px]">Permanent Action Warning:</p>
            <p className="text-[10px] leading-tight">
              This action cannot be undone. All database records and users belonging to this factory will be purged forever.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-border-subtle flex items-center justify-end gap-2 bg-surface-muted/40">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPurging}
            className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] border border-border-subtle transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPurging}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-status-danger hover:bg-red-700 rounded-[3px] shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={12} className={isPurging ? 'animate-spin' : ''} />
            <span>Purge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientPurgeModal;
