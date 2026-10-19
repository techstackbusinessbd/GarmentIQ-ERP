import React from 'react';

/**
 * [EN] Master PageShell container component.
 * Provides unified spacing (space-y-6) and max-width bounds across all pages.
 *
 * [BN] মাস্টার পেজ শেল কন্টেইনার কম্পোনেন্ট যা সমস্ত পেজে অভিন্ন স্পেসিং বজায় রাখে।
 */
export const PageShell = ({ children, className = '' }) => {
  return (
    <div className={`space-y-6 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default PageShell;
