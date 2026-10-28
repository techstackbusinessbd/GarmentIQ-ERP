/**
 * =============================================================================
 * [EN] Commercial Currencies & Exchange Rates Tab Component (CurrencySettingsTab.tsx)
 * [BN] বাণিজ্যিক কারেন্সি ও বৈদেশিক মুদ্রা বিনিময় হার কনফিগারেশন ট্যাব (CurrencySettingsTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table), Rule 15 (Bilingual),
 *             Rule 17 (Enterprise UI), Rule 21 (Component-based)
 * [BN] গার্মেন্ট রপ্তানি বিলিং, মার্চেন্ডাইজিং কস্টিং ও লোকাল অপারেশনের বিনিময় হার ব্যবস্থাপনা।
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, RefreshCw, Calculator, Save, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, Button, TextInput } from '@/components/ui';
import { currencyService, type CurrencyRate } from '../services/currencyService';
import { useCurrencyColumns } from './useCurrencyColumns';

interface CurrencySettingsTabProps {
  readonly onBaselineRateChange?: (bdtPerUsd: string) => void;
}

export const CurrencySettingsTab: React.FC<CurrencySettingsTabProps> = ({ onBaselineRateChange }) => {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [calcAmount, setCalcAmount] = useState<string>('1000');
  const [calcFrom, setCalcFrom] = useState<string>('USD');
  const [calcTo, setCalcTo] = useState<string>('BDT');
  const [isSaving, setIsSaving] = useState(false);

  const loadCurrencies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await currencyService.getCurrencies();
      setCurrencies(data);
      const usdEntry = data.find((c) => c.code === 'USD');
      if (usdEntry && onBaselineRateChange) {
        onBaselineRateChange(usdEntry.rateToBdt.toFixed(2));
      }
    } catch {
      toast.error('Failed to load currency rates.');
    } finally {
      setIsLoading(false);
    }
  }, [onBaselineRateChange]);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  const handleUpdateBdtRate = useCallback((code: string, newBdtRate: number) => {
    setCurrencies((prev) =>
      prev.map((c) => {
        if (c.code !== code) return c;
        return {
          ...c,
          rateToBdt: newBdtRate,
        };
      })
    );
  }, []);

  const columns = useCurrencyColumns({
    onUpdateBdtRate: handleUpdateBdtRate,
  });

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const curr of currencies) {
        await currencyService.updateRate(curr.code, curr.rateToBdt);
      }
      toast.success('Commercial currency conversion rates successfully updated in database.');
      loadCurrencies();
    } catch {
      toast.error('Failed to update currency rates in database.');
    } finally {
      setIsSaving(false);
    }
  };

  // Costing calculator conversion logic
  const calculateConversion = (): string => {
    const amount = parseFloat(calcAmount) || 0;
    const fromCurr = currencies.find((c) => c.code === calcFrom);
    const toCurr = currencies.find((c) => c.code === calcTo);
    if (!fromCurr || !toCurr || toCurr.rateToBdt === 0) return '0.00';

    const amountInBdt = amount * fromCurr.rateToBdt;
    const finalAmount = amountInBdt / toCurr.rateToBdt;
    return finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-5">
      {/* Enterprise TanStack DataTable */}
      <DataTable
        title="Apparel Commercial & Costing Currencies"
        subtitle="Benchmark exchange rates for buyer PO billing, fabric imports, and local CM payroll budgeting."
        icon={<DollarSign size={16} className="text-brand-accent" />}
        columns={columns}
        data={currencies}
        isLoading={isLoading}
        searchPlaceholder="Search currencies by code or name..."
        initialPageSize={10}
        headerExtra={
          <span className="text-xs text-text-muted font-medium">
            Configured:{' '}
            <span className="font-semibold text-text-primary">{currencies.length}</span>{' '}
            {currencies.length === 1 ? 'Currency' : 'Currencies'}
          </span>
        }
        headerActions={
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="secondary"
              onClick={loadCurrencies}
              disabled={isLoading}
              icon={<RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
            <Button
              size="xs"
              variant="primary"
              onClick={handleSaveAll}
              disabled={isSaving}
              icon={isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            >
              Save
            </Button>
          </div>
        }
      />

      {/* Interactive Costing & Forex Converter Widget */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
          <Calculator size={15} className="text-status-success" />
          <span>Rapid Merchandiser Forex & Costing Converter</span>
        </div>
        <p className="text-[11px] text-text-muted">
          Quickly simulate buyer order costing, FOB export amounts, and raw material import valuations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-text-primary mb-1">Costing Amount</label>
            <TextInput
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(e.target.value)}
              className="font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-primary mb-1">From Currency</label>
            <select
              value={calcFrom}
              onChange={(e) => setCalcFrom(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-[4px] bg-surface-base border border-border-subtle text-text-primary font-semibold focus:border-brand-accent focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-primary mb-1">To Currency</label>
            <select
              value={calcTo}
              onChange={(e) => setCalcTo(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-[4px] bg-surface-base border border-border-subtle text-text-primary font-semibold focus:border-brand-accent focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div className="p-2.5 rounded-[4px] bg-surface-muted border border-border-subtle flex items-center justify-between">
            <div className="text-[10px] text-text-muted uppercase font-bold flex items-center gap-1">
              <ArrowRightLeft size={12} className="text-brand-accent" />
              <span>Converted Value</span>
            </div>
            <div className="text-sm font-mono font-bold text-brand-accent">
              {calculateConversion()} {calcTo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettingsTab;
