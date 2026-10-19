import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * [EN] Master PageHeader Component implementing ADR-006 uniform layout standards.
 * Every page across the ERP uses this identical header structure.
 *
 * [BN] মাস্টার পেজ হেডার কম্পোনেন্ট যা সম্পূর্ণ ইআরপিতে অভিন্ন ব্রেডক্রাম্ব,
 * টাইটেল এবং অ্যাকশন বাটন গ্রুপ নিশ্চিত করে।
 */
export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actionSlot = null,
}) => {
  return (
    <div className="mb-6 space-y-2">
      {/* 1. Breadcrumbs Row */}
      <nav className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
        <Link to="/" className="hover:text-brand-accent flex items-center gap-1 transition-colors">
          <Home size={13} />
          <span>Home</span>
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={12} className="text-text-muted shrink-0 opacity-60" />
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-brand-accent transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text-primary font-semibold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* 2. Page Title & Action Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons Slot */}
        {actionSlot && (
          <div className="flex items-center gap-3 shrink-0">
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
