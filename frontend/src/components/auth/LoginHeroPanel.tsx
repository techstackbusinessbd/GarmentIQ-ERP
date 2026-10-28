/**
 * =============================================================================
 * [EN] Corporate Login Hero Showcase Panel (LoginHeroPanel)
 * [BN] করপোরেট লগইন হিরো প্যানেল কম্পোনেন্ট (LoginHeroPanel)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Components)
 * [BN] লগইন পেজের বাম পাশের ব্র্যান্ডিং, আরএমজি প্ল্যাটফর্ম ফিচার হাইলাইটস এবং সিকিউরিটি ফুটার।
 */

import React from 'react';
import { ShieldCheck, Radio, Layers, Building2 } from 'lucide-react';
import { APP_METADATA } from '@/constants';
import { BrandLogo } from '@/components/ui/BrandLogo';

export interface LoginHeroPanelProps {
  readonly detectedSubdomain?: string | null;
}

/**
 * [EN] Left Brand Column for Corporate Login (50% split-screen layout).
 * [BN] করপোরেট লগইনের বাম পাশের ৫০% ব্র্যান্ড কলাম কম্পোনেন্ট।
 */
export const LoginHeroPanel: React.FC<LoginHeroPanelProps> = ({ detectedSubdomain }) => {
  return (
    <div className="w-full lg:w-1/2 bg-[#142B45] text-white p-8 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden shrink-0">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                {APP_METADATA.NAME}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-[2px] bg-white/10 text-slate-300 border border-white/10">
                {APP_METADATA.VERSION}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Woven, Denim & Laundry Enterprise Platform
            </span>
          </div>
        </div>

        {detectedSubdomain && (
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white/10 border border-white/15 text-emerald-300 text-xs font-bold font-mono tracking-wide">
            <Building2 size={13} className="text-emerald-400" />
            <span>{detectedSubdomain.toUpperCase()} ENTERPRISE CLOUD</span>
          </div>
        )}

        <div className="mt-8 lg:mt-12 max-w-lg">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Order-to-Shipment Intelligence for Modern Apparel Factories.
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Unified traceability connecting yarn procurement, shrinkage-compensated CAD cutting, RFID sewing lines, industrial denim laundry, and export shipping.
          </p>
        </div>
      </div>

      {/* Domain Highlights List */}
      <div className="relative z-10 my-8 space-y-3 max-w-md">
        <div className="flex items-start gap-3 p-3 rounded-[6px] bg-white/5 border border-white/10">
          <Radio size={18} className="text-sky-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-white">UHF Gen2 RFID Floor Automation</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Automated cut-piece bundle, wash batch & carton tracking.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-[6px] bg-white/5 border border-white/10">
          <Layers size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-white">Denim Laundry & Wet Processing</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Dry/wet recipe parameters with GOTS chemical compliance.</p>
          </div>
        </div>
      </div>

      {/* Brand Security Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>256-Bit TLS • Role-Based Access Control</span>
        </div>
        <span>© 2026 GarmentIQ</span>
      </div>
    </div>
  );
};
