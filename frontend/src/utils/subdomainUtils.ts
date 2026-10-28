/**
 * =============================================================================
 * [EN] Multi-Tenant Subdomain & Portal Navigation Utilities (subdomainUtils)
 * [BN] মাল্টি-টেন্যান্ট সাবডোমেন ও ক্লায়েন্ট পোর্টাল রাউটিং ইউটিলিটি (subdomainUtils)
 * =============================================================================
 * [EN] Reference: docs/specifications/HYBRID_DELIVERY_AND_DEPLOYMENT_SPECIFICATION.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] আরএফসি ৬৬৭১ কমপ্লায়েন্ট লোকাল *.localhost ও ক্লাউড সাবডোমেন হ্যান্ডলার।
 * =============================================================================
 */

import type { Tenant } from '@/types';

/**
 * [EN] Reserved platform subdomain slugs that do not belong to customer factories.
 * [BN] প্ল্যাটফর্মের নিজস্ব সংরক্ষিত সাবডোমেন স্ল্যাগসমূহ যা কোনো কারখানার নয়।
 */
const RESERVED_SUBDOMAINS: ReadonlySet<string> = new Set([
  'www',
  'app',
  'system',
  'admin',
  'api',
  'platform',
  'mail',
  'cdn',
  'static',
]);

/**
 * [EN] Checks if a subdomain is reserved by the platform root infrastructure.
 * [BN] সাবডোমেন স্ল্যাগটি প্ল্যাটফর্মের সংরক্ষিত কি না তা যাচাই করে।
 *
 * @param sub [EN] Candidate subdomain string / [BN] সাবডোমেন স্ট্রিং
 * @returns [EN] True if reserved, false otherwise / [BN] সংরক্ষিত হলে true
 */
export const isReservedSubdomain = (sub: string): boolean => {
  if (!sub) return false;
  return RESERVED_SUBDOMAINS.has(sub.trim().toLowerCase());
};

/**
 * [EN] Extracts tenant subdomain slug from the current browser hostname.
 * Supports *.localhost in local development and *.garmentiq.com in production.
 *
 * [BN] বর্তমান ব্রাউজার হোস্টনেম থেকে ক্লায়েন্ট সাবডোমেন আলাদা করে বের করে।
 *
 * @param hostname [EN] Hostname string to parse / [BN] পার্স করার জন্য হোস্টনেম
 * @returns [EN] Subdomain slug or null if root / [BN] সাবডোমেন স্ল্যাগ অথবা রুট হলে null
 */
export const extractSubdomain = (
  hostname = typeof window !== 'undefined' ? window.location.hostname : ''
): string | null => {
  if (!hostname) return null;

  const normalized = hostname.trim().toLowerCase();

  // [EN] Local development: e.g. "factory1.localhost"
  // [BN] লোকাল ডেভেলপমেন্ট: যেমন "factory1.localhost"
  if (normalized.endsWith('.localhost')) {
    const parts = normalized.split('.');
    const candidate = parts[0];
    if (parts.length >= 2 && candidate && candidate !== 'localhost') {
      return isReservedSubdomain(candidate) ? null : candidate;
    }
    return null;
  }

  // [EN] Production cloud: e.g. "factory1.garmentiq.com"
  // [BN] প্রডাকশন ক্লাউড: যেমন "factory1.garmentiq.com"
  if (normalized.endsWith('.garmentiq.com')) {
    const parts = normalized.split('.');
    const candidate = parts[0];
    if (parts.length >= 3 && candidate) {
      return isReservedSubdomain(candidate) ? null : candidate;
    }
    return null;
  }

  return null;
};

/**
 * [EN] Resolves the fully-qualified portal URL for a given client factory tenant.
 * - Self-hosted with custom domain: Uses custom domain (https://...)
 * - Local development: http://{subdomain}.localhost:{port}/
 * - Production cloud: https://{subdomain}.garmentiq.com
 *
 * [BN] ক্লায়েন্ট টেন্যান্টের জন্য সম্পূর্ণ অ্যাক্সেস URL প্রস্তুত করে।
 *
 * @param t [EN] Tenant entity / [BN] টেন্যান্ট অবজেক্ট
 * @returns [EN] Absolute portal URL / [BN] অ্যাবসোলিউট পোর্টাল URL
 */
export const resolveClientPortalUrl = (t: Tenant): string => {
  // [EN] 1. Self-hosted custom domain takes priority
  // [BN] ১. সেলফ-হোস্টেড কাস্টম ডোমেন থাকলে তা অগ্রাধিকার পাবে
  if (t.hostingType === 'SELF_HOSTED' && t.customDomain) {
    return t.customDomain.startsWith('http://') || t.customDomain.startsWith('https://')
      ? t.customDomain
      : `https://${t.customDomain}`;
  }

  const sub = (t.subdomain || (t.tenantCode === 'SYSTEM' ? 'system' : t.tenantCode)).toLowerCase().trim();

  // [EN] 2. Local environment detection (*.localhost or 127.0.0.1 or localhost)
  // [BN] ২. লোকাল ডেভেলপমেন্ট ডিটেকশন (RFC 6761 অনুযায়ী *.localhost সরাসরি লোকালহোস্টে কাজ করে)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    const isLocal =
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1';

    if (isLocal) {
      const protocol = window.location.protocol;
      const portStr = window.location.port ? `:${window.location.port}` : '';
      return `${protocol}//${sub}.localhost${portStr}/`;
    }
  }

  // [EN] 3. Production Cloud Multi-Tenant SaaS URL
  // [BN] ৩. প্রডাকশন ক্লাউড মাল্টি-টেন্যান্ট SaaS URL
  return `https://${sub}.garmentiq.com`;
};
