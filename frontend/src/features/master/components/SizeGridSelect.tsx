/**
 * =============================================================================
 * [EN] Apparel Size Matrix Breakdown Selector Component (SizeGridSelect)
 * [BN] তৈরি পোশাকের সাইজ গ্রিড সিলেক্টর কম্পোনেন্ট (SizeGridSelect)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server-Side Validation)
 * [BN] আলফা সাইজ (S-3XL) ও ডেনিম ওয়েস্ট/ইনসিম সাইজ বাছাইয়ের জন্য প্রমিত সিলেক্টর।
 */

import React from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { useSizes } from '../hooks/useMasterData';

/**
 * [EN] Properties contract for the SizeGridSelect component.
 * [BN] SizeGridSelect কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface SizeGridSelectProps {
  /** [EN] Currently selected size code / [BN] নির্বাচিত সাইজ কোড */
  readonly value?: string;

  /** [EN] Change handler callback / [BN] সাইজ পরিবর্তনের কলব্যাক */
  readonly onChange: (sizeCode: string) => void;

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
 * [EN] Reusable Garment Size Selector Component.
 * [BN] পুনর্ব্যবহারযোগ্য পোশাকের সাইজ সিলেক্টর কম্পোনেন্ট।
 */
export const SizeGridSelect: React.FC<SizeGridSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select Garment Size (e.g. 32/34, L)',
  error,
  className = '',
}) => {
  const { data: sizes = [], isLoading } = useSizes();

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
            {isLoading ? 'Loading Sizes...' : placeholder}
          </option>
          {sizes.map((s) => (
            <option key={s.id} value={s.sizeCode}>
              {s.sizeCode} ({s.sizeCategory})
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
          {isLoading ? <Loader2 size={13} className="animate-spin text-brand-accent" /> : <Tag size={13} />}
        </div>
      </div>

      {error && <div className="erp-error-message">{error}</div>}
    </div>
  );
};
