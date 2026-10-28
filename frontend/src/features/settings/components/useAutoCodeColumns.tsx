/**
 * =============================================================================
 * [EN] TanStack Table Columns for Auto-Code Templates (useAutoCodeColumns.tsx)
 * [BN] অটো-কোড টেমপ্লেট টেবিলের ট্যানস্ট্যাক কলাম ডেফিনিশন হুক
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (High Perf), Rule 15 (Bilingual), Rule 24 (Auto-Code)
 * [BN] ডায়নামিক অটো-কোড কনফিগারেশন, ইনলাইন এডিটিং ও লাইভ প্রিভিউ কলাম।
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, X, Save, Sparkles } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { CodeSequenceTemplate } from '../services/sequenceTemplateService';

const ENTITY_LABELS: Record<string, { title: string; desc: string }> = {
  BUYER: { title: 'Buyer Profile', desc: 'Global buyer master account numbering' },
  STYLE: { title: 'Style Tech-Pack', desc: 'Design tech-pack and garment style code' },
  PURCHASE_ORDER: { title: 'Purchase Order (PO)', desc: 'Buyer purchase order sequence' },
  CUTTING_ORDER: { title: 'Cutting Lay Order', desc: 'CAD cutting lay plan and order ID' },
  BUNDLE: { title: 'Sewing Cut Bundle', desc: 'Shop floor QR/RFID cut bundle tag' },
  CARTON: { title: 'Master Export Carton', desc: 'Final packing export carton code' },
};

export interface UseAutoCodeColumnsParams {
  readonly editingId: string | null;
  readonly editPrefix: string;
  readonly setEditPrefix: (val: string) => void;
  readonly editPattern: string;
  readonly editPadding: number;
  readonly setEditPadding: (val: number) => void;
  readonly editReset: 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY';
  readonly setEditReset: (val: 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY') => void;
  readonly livePreview: string;
  readonly isSaving: boolean;
  readonly onStartEdit: (tpl: CodeSequenceTemplate) => void;
  readonly onCancelEdit: () => void;
  readonly onSaveEdit: (id: string) => void;
  readonly onPatternChange: (pattern: string, prefix: string, padding: number) => void;
}

export const useAutoCodeColumns = ({
  editingId,
  editPrefix,
  setEditPrefix,
  editPattern,
  editPadding,
  setEditPadding,
  editReset,
  setEditReset,
  livePreview,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onPatternChange,
}: UseAutoCodeColumnsParams): ColumnDef<CodeSequenceTemplate>[] => {
  return useMemo<ColumnDef<CodeSequenceTemplate>[]>(
    () => [
      {
        id: 'entity',
        accessorFn: (row) => `${row.entityType} ${ENTITY_LABELS[row.entityType]?.title || ''}`,
        header: 'Business Entity',
        cell: ({ row }) => {
          const tpl = row.original;
          const meta = ENTITY_LABELS[tpl.entityType] || { title: tpl.entityType, desc: 'Auto code sequence' };
          return (
            <div className="min-w-0">
              <span className="font-bold text-xs text-text-primary block leading-tight">{meta.title}</span>
              <span className="text-[10px] text-text-muted block truncate">{meta.desc}</span>
            </div>
          );
        },
      },
      {
        id: 'prefix',
        accessorKey: 'prefix',
        header: 'Prefix',
        cell: ({ row }) => {
          const tpl = row.original;
          if (editingId === tpl.id) {
            return (
              <input
                type="text"
                value={editPrefix}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setEditPrefix(val);
                  onPatternChange(editPattern, val, editPadding);
                }}
                className="w-20 px-2 py-1 text-xs font-mono font-bold bg-surface-card border border-brand-accent rounded text-text-primary focus:outline-none shadow-2xs"
              />
            );
          }
          return <span className="font-mono font-bold text-xs text-text-secondary">{tpl.prefix}</span>;
        },
      },
      {
        id: 'pattern',
        accessorKey: 'pattern',
        header: 'Pattern Format',
        cell: ({ row }) => {
          const tpl = row.original;
          if (editingId === tpl.id) {
            return (
              <input
                type="text"
                value={editPattern}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  onPatternChange(val, editPrefix, editPadding);
                }}
                className="w-48 px-2 py-1 text-xs font-mono bg-surface-card border border-brand-accent rounded text-brand-accent font-semibold focus:outline-none shadow-2xs"
              />
            );
          }
          return <span className="font-mono text-xs font-semibold text-brand-accent">{tpl.pattern}</span>;
        },
      },
      {
        id: 'paddingLength',
        accessorKey: 'paddingLength',
        header: 'Padding',
        cell: ({ row }) => {
          const tpl = row.original;
          if (editingId === tpl.id) {
            return (
              <select
                value={editPadding}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setEditPadding(val);
                  onPatternChange(editPattern, editPrefix, val);
                }}
                className="px-2 py-1 text-xs font-mono bg-surface-card border border-border-subtle rounded text-text-primary cursor-pointer shadow-2xs"
              >
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} digits</option>
                ))}
              </select>
            );
          }
          return <span className="font-mono text-xs text-text-muted">{tpl.paddingLength} digits</span>;
        },
      },
      {
        id: 'resetFrequency',
        accessorKey: 'resetFrequency',
        header: 'Reset Frequency',
        cell: ({ row }) => {
          const tpl = row.original;
          if (editingId === tpl.id) {
            return (
              <select
                value={editReset}
                onChange={(e) => setEditReset(e.target.value as 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY')}
                className="px-2 py-1 text-xs font-mono bg-surface-card border border-border-subtle rounded text-text-primary cursor-pointer shadow-2xs"
              >
                <option value="NEVER">NEVER</option>
                <option value="YEARLY">YEARLY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="DAILY">DAILY</option>
              </select>
            );
          }
          return <Badge variant="neutral">{tpl.resetFrequency}</Badge>;
        },
      },
      {
        id: 'preview',
        accessorKey: 'samplePreview',
        header: 'Live Generated Code',
        cell: ({ row }) => {
          const tpl = row.original;
          const previewText = editingId === tpl.id ? (livePreview || tpl.samplePreview) : tpl.samplePreview;
          return (
            <Badge variant="success" icon={<Sparkles size={11} />} className="font-mono text-xs font-bold">
              {previewText}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const tpl = row.original;
          if (editingId === tpl.id) {
            return (
              <div className="flex items-center gap-1">
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => onSaveEdit(tpl.id)}
                  disabled={isSaving}
                  title="Save Pattern"
                  icon={<Save size={12} />}
                >
                  Save
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={onCancelEdit}
                  title="Cancel"
                  icon={<X size={12} />}
                >
                  Cancel
                </Button>
              </div>
            );
          }
          return (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => onStartEdit(tpl)}
              icon={<Edit2 size={12} />}
            >
              Configure
            </Button>
          );
        },
      },
    ],
    [
      editingId,
      editPrefix,
      editPattern,
      editPadding,
      editReset,
      livePreview,
      isSaving,
      onStartEdit,
      onCancelEdit,
      onSaveEdit,
      onPatternChange,
      setEditPrefix,
      setEditPadding,
      setEditReset,
    ]
  );
};

export default useAutoCodeColumns;
