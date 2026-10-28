/**
 * =============================================================================
 * [EN] Clean Corporate Background Canvas (LoginTextileBackground)
 * [BN] ক্লিন করপোরেট ব্যাকগ্রাউন্ড ক্যানভাস (আর্কিটেকচারাল মাইক্রো-গ্রিড ও সফট অ্যাকসেন্ট গ্লো)
 * =============================================================================
 * [EN] Reference: docs/specifications/design-system/02_COLOR_PALETTES_AND_VARIANTS.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] সেন্টার্ড করপোরেট লগইনের জন্য মার্জিত ও প্রফেশনাল লাইট/ডার্ক রেস্পন্সিভ ব্যাকগ্রাউন্ড।
 */

import React from 'react';

/**
 * [EN] Clean, lightweight corporate background layer with subtle micro-dots.
 * Adapts seamlessly to active theme tokens (Light / Obsidian / Dark).
 *
 * [BN] পরিচ্ছন্ন করপোরেট ব্যাকগ্রাউন্ড লেয়ার।
 * লাইট ও ডার্ক মোডে মার্জিত মাইক্রো-ডট গ্রিড এবং সফট অ্যাম্বিয়েন্ট অ্যাকসেন্ট গ্লো প্রদর্শন করে।
 */
export const LoginTextileBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dynamic Base Surface */}
      <div className="absolute inset-0 bg-surface-base transition-colors duration-200" />

      {/* Clean Subtle Micro-Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--border) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Gentle Ambient Accent Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[480px] h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
