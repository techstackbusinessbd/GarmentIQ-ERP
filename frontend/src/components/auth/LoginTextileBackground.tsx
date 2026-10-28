/**
 * =============================================================================
 * [EN] Clean Corporate Background Canvas (LoginTextileBackground)
 * [BN] ক্লিন করপোরেট লাইট ব্যাকগ্রাউন্ড ক্যানভাস (ডার্ক ছাড়া সাধারণ ও মার্জিত)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/02_COLOR_PALETTES_AND_VARIANTS.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] ব্যবহারকারীর নির্দেশ মোতাবেক ডার্ক ছাড়া উজ্জ্বল, সিম্পল ও এন্টারপ্রাইজ ক্যানভাস।
 */

import React from 'react';

/**
 * [EN] Clean, lightweight corporate background layer.
 * Adapts to dynamic theme variables without imposing dark backgrounds.
 *
 * [BN] পরিচ্ছন্ন করপোরেট ব্যাকগ্রাউন্ড লেয়ার।
 * লাইট মোডকে প্রাধান্য দিয়ে হালকা মাইক্রো-গ্রিড এবং সফট অ্যাকসেন্ট গ্লো প্রদর্শন করে।
 *
 * @returns [EN] Rendered background canvas / [BN] রেন্ডারকৃত ব্যাকগ্রাউন্ড
 */
export const LoginTextileBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dynamic Base Surface responding to theme (Light by default) */}
      <div className="absolute inset-0 bg-surface-base transition-colors duration-200" />

      {/* Clean Subtle Micro-Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Gentle Top Ambient Accent Glow (Soft, not dark) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-64 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[480px] h-64 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
