/**
 * =============================================================================
 * [EN] Official Corporate Brand Logo & Identity Lockup (BrandLogo)
 * [BN] অফিশিয়াল করপোরেট ব্র্যান্ড লোগো ও আইডেন্টিটি লকআপ কম্পোনেন্ট (BrandLogo)
 * =============================================================================
 * [EN] Reference: Approved by Product Director / CTO (2026-10-20)
 * [EN] Brand: GarmentIQ [ ERP ] with Hexagonal Textile Weave Monogram
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * =============================================================================
 */

import React from 'react';
import { APP_METADATA } from '@/constants';

/**
 * [EN] Properties contract for BrandLogo component.
 * [BN] BrandLogo কম্পোনেন্টের প্রপার্টিজ ইন্টারফেস।
 */
export interface BrandLogoProps {
  /** [EN] Display size variant / [BN] লোগোর সাইজ ভ্যারিয়েন্ট */
  readonly size?: 'sm' | 'md' | 'lg';
  /** [EN] Whether to display the text label & badge / [BN] টেক্সট ও ব্যাজ দৃশ্যমান থাকবে কিনা */
  readonly showText?: boolean;
  /** [EN] Dynamic badge label ('PLATFORM' for super admin, 'PORTAL' for clients) / [BN] ডাইনামিক ব্যাজ লেবেল */
  readonly badgeText?: string;
  /** [EN] Light text color for dark backgrounds like the master sidebar / [BN] ডার্ক ব্যাকগ্রাউন্ডের জন্য লাইট টেক্সট */
  readonly inverted?: boolean;
  /** [EN] Additional CSS classes / [BN] অতিরিক্ত সিএসএস ক্লাস */
  readonly className?: string;
}

/**
 * [EN] Official Platform Brand Logo.
 * Features a sharp 6px micro-radius container, hexagonal textile weave SVG monogram,
 * bold 'GarmentIQ' title, and a dynamic sharp 2px 'PLATFORM' or 'PORTAL' micro-badge.
 *
 * [BN] প্ল্যাটফর্মের অফিশিয়াল ব্র্যান্ড লোগো।
 * ৬px শার্প মাইক্রো-রেডিয়াস সম্বলিত হেক্সাগোনাল টেক্সটাইল উইভ এসভিজি মনোগ্রাম,
 * বোল্ড 'GarmentIQ' নাম এবং ডাইনামিক ২px শার্প 'PLATFORM' বা 'PORTAL' মাইক্রো-ব্যাজ সংবলিত।
 *
 * @param props [EN] BrandLogo properties / [BN] লোগো প্রপার্টিজ
 * @returns [EN] Rendered logo lockup / [BN] রেন্ডারকৃত লোগো লকআপ
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  badgeText = 'PORTAL',
  inverted = false,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 rounded-[5px]',
    md: 'w-8 h-8 rounded-[6px]',
    lg: 'w-10 h-10 rounded-[8px]',
  }[size];

  const svgSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* [EN] Hexagonal Textile Weave Monogram Icon */}
      {/* [BN] হেক্সাগোনাল টেক্সটাইল উইভ মনোগ্রাম আইকন */}
      <div
        className={`${iconSizeClasses} bg-brand-accent flex items-center justify-center text-white shrink-0 shadow-xs`}
      >
        <svg
          className={svgSizeClasses}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Hexagon */}
          <path
            d="M16 4L27 10.5V21.5L16 28L5 21.5V10.5L16 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Cross Weave Strands */}
          <path
            d="M16 4V28M5 10.5L27 21.5M5 21.5L27 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Core Center Node */}
          <circle cx="16" cy="16" r="2.5" fill="white" />
        </svg>
      </div>

      {/* [EN] Brand Title & Sharp ERP Micro-Badge */}
      {/* [BN] ব্র্যান্ড টাইটেল ও শার্প ERP মাইক্রো-ব্যাজ */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span
            className={`${textSizeClasses} font-bold tracking-tight ${
              inverted ? 'text-white' : 'text-text-primary'
            }`}
          >
            {APP_METADATA.SHORT_NAME}
          </span>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wide rounded-[2px] border ${
              inverted
                ? badgeText === 'PLATFORM'
                  ? 'bg-brand-accent/35 text-white border-brand-accent/60 shadow-xs'
                  : 'bg-brand-accent/25 text-white border-brand-accent/50 shadow-xs'
                : badgeText === 'PLATFORM'
                  ? 'bg-brand-accent-light text-brand-accent border-brand-accent/40 font-extrabold'
                  : 'bg-brand-accent-light text-brand-accent border-brand-accent/20'
            }`}
          >
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
