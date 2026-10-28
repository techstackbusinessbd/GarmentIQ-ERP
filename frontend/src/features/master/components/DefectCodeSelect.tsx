/**
 * =============================================================================
 * [EN] Quality Defect Code Selector Component (DefectCodeSelect)
 * [BN] কোয়ালিটি কন্ট্রোল ডিফেক্ট কোড সিলেক্টর কম্পোনেন্ট (DefectCodeSelect)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00_FOUNDATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 25 (Server-Side Validation)
 * [BN] কাটিং, সুইং ও ওয়াশিং প্রসেসে ডিফেক্ট লগিংয়ের জন্য ক্যাশড ড্রপডাউন সিলেক্টর।
 */

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDefectCodes } from '../hooks/useMasterData';

/**
 * [EN] Properties contract for the DefectCodeSelect component.
 * [BN] DefectCodeSelect কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface DefectCodeSelectProps {
  /** [EN] Currently selected defect code / [BN] নির্বাচিত ডিফেক্ট কোড */
  readonly value?: string;

  /** [EN] Change handler callback / [BN] ডিফেক্ট পরিবর্তনের কলব্যাক */
  readonly onChange: (defectCode: string) => void;

  /** [EN] Optional process category filter (FABRIC, SEWING, WASHING) / [BN] প্রসেস ক্যাটাগরি ফিল্টার */
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
 * [EN] Reusable Quality Defect Code Selector Component.
 * [BN] পুনর্ব্যবহারযোগ্য কোয়ালিটি ডিফেক্ট কোড সিলেক্টর কম্পোনেন্ট।
 */
export const DefectCodeSelect: React.FC<DefectCodeSelectProps> = ({
  value,
  onChange,
  category,
  disabled = false,
  placeholder = 'Select Defect Code (e.g. Broken Stitch)',
  error,
  className = '',
}) => {
  const { data: defectCodes = [], isLoading } = useDefectCodes(category);

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
            {isLoading ? 'Loading Defect Codes...' : placeholder}
          </option>
          {defectCodes.map((d) => (
            <option key={d.id} value={d.defectCode}>
              {d.defectCode} — {d.defectName} [{d.severityLevel}] ({d.defectCategory})
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
          {isLoading ? <Loader2 size={13} className="animate-spin text-brand-accent" /> : <AlertTriangle size={13} />}
        </div>
      </div>

      {error && <div className="erp-error-message">{error}</div>}
    </div>
  );
};
