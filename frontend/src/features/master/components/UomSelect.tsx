/**
 * =============================================================================
 * [EN] Measurement Unit of Measure (UOM) Selector Component (UomSelect)
 * [BN] তৈরি পোশাক পরিমাপের একক (UOM) সিলেক্টর কম্পোনেন্ট (UomSelect)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server-Side Validation)
 * [BN] ফ্যাব্রিক, সুতা ও এক্সেসরিজ পরিমাপের জন্য ক্যাশড UOM ড্রপডাউন সিলেক্টর।
 */

import React from 'react';
import { Ruler, Loader2 } from 'lucide-react';
import { useUnits } from '../hooks/useMasterData';

/**
 * [EN] Properties contract for the UomSelect component.
 * [BN] UomSelect কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface UomSelectProps {
  /** [EN] Currently selected unit code / [BN] নির্বাচিত এককের কোড */
  readonly value?: string;

  /** [EN] Change handler callback / [BN] মান পরিবর্তনের কলব্যাক */
  readonly onChange: (unitCode: string) => void;

  /** [EN] Optional material category filter (FABRIC, TRIM, GENERAL) / [BN] ক্যাটাগরি ফিল্টার */
  readonly category?: string;

  /** [EN] Disabled state / [BN] নিষ্ক্রিয় অবস্থা */
  readonly disabled?: boolean;

  /** [EN] Placeholder text / [BN] প্লেসহোল্ডার টেক্সট */
  readonly placeholder?: string;

  /** [EN] Validation error message / [BN] ভ্যালিডেশন এরর বার্তা */
  readonly error?: string;

  /** [EN] Additional container CSS classes / [BN] অতিরিক্ত সিএসএস ক্লাস */
  readonly className?: string;
}

/**
 * [EN] Reusable Measurement Unit Selector.
 * [BN] পুনর্ব্যবহারযোগ্য পরিমাপের একক সিলেক্টর কম্পোনেন্ট।
 */
export const UomSelect: React.FC<UomSelectProps> = ({
  value,
  onChange,
  category,
  disabled = false,
  placeholder = 'Select Unit (e.g. YDS, PCS)',
  error,
  className = '',
}) => {
  const { data: units = [], isLoading } = useUnits(category);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className={`w-full pl-8 pr-8 py-1.5 text-xs bg-surface-card border rounded-[3px] text-text-primary focus:border-brand-accent focus:outline-none transition-colors disabled:bg-surface-muted disabled:text-text-muted ${
            error ? 'erp-input-error' : 'border-border-subtle'
          }`}
        >
          <option value="" disabled>
            {isLoading ? 'Loading Units...' : placeholder}
          </option>
          {units.map((u) => (
            <option key={u.id} value={u.unitCode}>
              {u.unitCode} — {u.unitName} ({u.unitCategory})
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
          {isLoading ? <Loader2 size={13} className="animate-spin text-brand-accent" /> : <Ruler size={13} />}
        </div>
      </div>

      {error && <div className="erp-error-message">{error}</div>}
    </div>
  );
};
