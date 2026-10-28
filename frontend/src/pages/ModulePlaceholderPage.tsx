/**
 * =============================================================================
 * [EN] Enterprise Domain Module Placeholder View (ModulePlaceholderPage)
 * [BN] এন্টারপ্রাইজ ডোমেন মডিউল প্লেসহোল্ডার ভিউ (ModulePlaceholderPage)
 * =============================================================================
 * [EN] Reference: docs/specifications/ROUTE_URL_AND_MENU_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] আসন্ন স্প্রিন্টে বাস্তবায়নের অপেক্ষায় থাকা ডোমেনসমূহের জন্য সুবিন্যস্ত এন্টারপ্রাইজ ভিউ।
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import { PageHeader, Badge } from '@/components/ui';

/**
 * [EN] Properties contract for ModulePlaceholderPage.
 * [BN] ModulePlaceholderPage কম্পোনেন্টের প্রপার্টিজ কনট্রাক্ট।
 */
export interface ModulePlaceholderPageProps {
  /** [EN] Human-readable module title / [BN] মডিউলের নাম */
  readonly title: string;

  /** [EN] Parent domain context / [BN] প্যারেন্ট ডোমেন কনটেক্সট */
  readonly domain: string;

  /** [EN] Implementation roadmap status / [BN] রোডম্যাপ স্ট্যাটাস */
  readonly roadmapStatus?: string;

  /** [EN] Detailed module overview description / [BN] মডিউলের বিস্তারিত বর্ণনা */
  readonly description: string;

  /** [EN] Key functional capabilities planned for this module / [BN] পরিকল্পিত কার্যকারিতাসমূহ */
  readonly plannedCapabilities?: readonly string[];
}

/**
 * [EN] Standard Enterprise Domain Module Roadmap Shell.
 * [BN] মানসম্মত এন্টারপ্রাইজ ডোমেন মডিউল রোডম্যাপ শেল কম্পোনেন্ট।
 */
export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({
  title,
  domain,
  roadmapStatus = 'Domain Execution in Progress',
  description,
  plannedCapabilities = [
    'Automated Order-to-Shipment (O2S) tracking and live status updates',
    'Real-time UHF Gen2 RFID shop floor synchronization',
    'ACID transactional consistency and audit trail logging',
  ],
}) => {
  const homePath = '/app/overview';

  return (
    <div className="space-y-6">
      {/* [EN] Unified Page Header & Breadcrumbs / [BN] সমন্বিত পেজ হেডার ও ব্রেডক্রাম্ব */}
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: homePath },
          { label: domain },
          { label: title },
        ]}
        title={title}
        badge={
          <div className="flex items-center gap-1.5">
            <Badge variant="accent">
              {domain}
            </Badge>
            <Badge variant="info" icon={<Calendar size={11} />}>
              {roadmapStatus}
            </Badge>
          </div>
        }
        subtitle={description}
        actions={
          <Link
            to={homePath}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[3px] bg-surface-muted hover:bg-surface-hover border border-border-subtle text-text-primary transition-colors shadow-xs"
          >
            <ArrowLeft size={13} />
            <span>Back to Overview</span>
          </Link>
        }
      />

      {/* Module Overview Banner Card */}
      <div className="bg-surface-card border border-border-subtle rounded-[6px] p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Compass size={14} className="text-brand-accent shrink-0" />
          <span>This module is part of the integrated <strong>Order-to-Shipment (O2S)</strong> lifecycle platform.</span>
        </div>
        <Badge variant="neutral">
          {domain}
        </Badge>
      </div>

      {/* Planned Functional Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-brand-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Planned Core Capabilities
            </h3>
          </div>
          <ul className="space-y-2">
            {plannedCapabilities.map((cap, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-brand-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Enterprise Integration & Security
            </h3>
          </div>
          <div className="space-y-2 text-xs text-text-muted leading-relaxed">
            <p>
              • Role-based access control and isolated factory tenant data governance.
            </p>
            <p>
              • High-speed data grids optimized for fast shop floor and office workflows.
            </p>
            <p>
              • Seamless synchronization with Central Master Library and system settings.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/settings/master"
              className="inline-flex items-center gap-1.5 text-xs text-brand-accent font-semibold hover:underline"
            >
              <FileText size={12} /> View Master Reference Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePlaceholderPage;
