/**
 * =============================================================================
 * [EN] Configurable Auto-Code Settings Tab Component (AutoCodeSettingsTab.tsx)
 * [BN] কনফিগারেবল অটো-কোড সেটিংস ট্যাব কম্পোনেন্ট (AutoCodeSettingsTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table), Rule 15 (Bilingual),
 *             Rule 17 (Enterprise UI), Rule 24 (Auto-Code)
 * [BN] ব্যাকএন্ড এপিআই কানেক্টেড ডাইনামিক অটো-কোড টেমপ্লেট কনফিগারেশন গ্রিড।
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Binary, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, Button, Badge } from '@/components/ui';
import {
  sequenceTemplateService,
  type CodeSequenceTemplate,
} from '../services/sequenceTemplateService';
import { useAutoCodeColumns } from './useAutoCodeColumns';

export const AutoCodeSettingsTab: React.FC = () => {
  const [templates, setTemplates] = useState<CodeSequenceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit buffer state
  const [editPrefix, setEditPrefix] = useState<string>('');
  const [editPattern, setEditPattern] = useState<string>('');
  const [editPadding, setEditPadding] = useState<number>(4);
  const [editReset, setEditReset] = useState<'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY'>('YEARLY');
  const [livePreview, setLivePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await sequenceTemplateService.getAllTemplates();
      setTemplates(data);
    } catch {
      toast.error('Failed to load auto-code sequence templates.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleStartEdit = useCallback((tpl: CodeSequenceTemplate) => {
    setEditingId(tpl.id);
    setEditPrefix(tpl.prefix);
    setEditPattern(tpl.pattern);
    setEditPadding(tpl.paddingLength);
    setEditReset(tpl.resetFrequency);
    setLivePreview(tpl.samplePreview || '');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handlePatternChange = useCallback(async (pattern: string, prefix: string, padding: number) => {
    setEditPattern(pattern);
    try {
      const preview = await sequenceTemplateService.previewPattern(pattern, prefix, padding);
      setLivePreview(preview);
    } catch {
      const sample = pattern
        .replace('{YYYY}', '2026')
        .replace('{MM}', '10')
        .replace(new RegExp(`\\{SEQ:${padding}\\}`, 'g'), '0'.repeat(padding - 1) + '1');
      setLivePreview(sample);
    }
  }, []);

  const handleSaveEdit = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await sequenceTemplateService.updateTemplate(id, {
        prefix: editPrefix.trim().toUpperCase(),
        pattern: editPattern.trim().toUpperCase(),
        paddingLength: editPadding,
        resetFrequency: editReset,
      });
      toast.success('Auto-code sequence template updated successfully.');
      setEditingId(null);
      await loadTemplates();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to update template.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [editPrefix, editPattern, editPadding, editReset, loadTemplates]);

  const columns = useAutoCodeColumns({
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
    onStartEdit: handleStartEdit,
    onCancelEdit: handleCancelEdit,
    onSaveEdit: handleSaveEdit,
    onPatternChange: handlePatternChange,
  });

  return (
    <div className="space-y-4">
      {/* Enterprise TanStack DataTable */}
      <DataTable
        title="Document Numbering & Auto-Code Templates"
        subtitle="Configurable numbering sequences. Customize prefixes, date tokens {YYYY}, {MM} and padding per business entity."
        icon={<Binary size={16} className="text-brand-accent" />}
        columns={columns}
        data={templates}
        isLoading={isLoading}
        searchPlaceholder="Search templates by entity, prefix or pattern..."
        initialPageSize={10}
        headerExtra={
          <Badge variant="success">
            Live ({templates.length} Entities)
          </Badge>
        }
        headerActions={
          <Button
            size="xs"
            variant="secondary"
            onClick={loadTemplates}
            disabled={isLoading}
            icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
        }
      />
    </div>
  );
};

export default AutoCodeSettingsTab;
