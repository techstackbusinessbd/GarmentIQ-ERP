/**
 * =============================================================================
 * [EN] Unsaved Changes Floating Bar Component (UnsavedChangesFloatingBar.tsx)
 * [BN] আনসেভড পরিবর্তন ফ্লোটিং অ্যাকশন বার কম্পোনেন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] কোনো পারমিশন পরিবর্তনের সাথে সাথে স্ক্রিনের নিচে ভেসে ওঠা স্টিকি সেভ ও ডিসকার্ড অ্যাকশন বার।
 */

import React from 'react';
import { AlertCircle, RotateCcw, Save, Loader2 } from 'lucide-react';

export interface UnsavedChangesFloatingBarProps {
  readonly roleName?: string;
  readonly title?: string;
  readonly saveLabel?: string;
  readonly modifiedCount: number;
  readonly isSaving: boolean;
  readonly onDiscard: () => void;
  readonly onSave: () => void;
}

export const UnsavedChangesFloatingBar: React.FC<UnsavedChangesFloatingBarProps> = ({
  roleName,
  title,
  saveLabel = 'Save',
  modifiedCount,
  isSaving,
  onDiscard,
  onSave,
}) => {
  if (modifiedCount <= 0) return null;

  const displayTitle = title || (roleName ? `Unsaved Changes in ${roleName}` : 'Unsaved Modifications Pending');

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="p-3 bg-surface-card/95 backdrop-blur-md border border-brand-accent/30 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs ring-1 ring-brand-accent/15">
        {/* Status indicator & Message */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertCircle size={15} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-text-primary truncate">
              {displayTitle}
            </div>
            <div className="text-[11px] text-text-muted">
              <span className="font-mono font-semibold text-brand-accent">{modifiedCount}</span> permission(s) modified
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isSaving}
            onClick={onDiscard}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface-muted/80 hover:bg-surface-muted border border-border-subtle transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw size={12} />
            <span>Discard</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-accent hover:bg-brand-accent-hover active:scale-98 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span>{isSaving ? 'Saving' : saveLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
