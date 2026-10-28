/**
 * =============================================================================
 * [EN] Enterprise Date & Time Formatting Utilities (dateUtils.ts)
 * [BN] এন্টারপ্রাইজ তারিখ ও সময় ফরম্যাটিং ইউটিলিটি (dateUtils.ts)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
 * [BN] ডাটাবেজের ইউটিসি (UTC) টাইমস্ট্যাম্পকে ব্রাউজারের লোকাল টাইমজোনে (যেমন: এশিয়া/ঢাকা GMT+6) রূপান্তর।
 */

/**
 * [EN] Formats an ISO date-time string into user's local timezone: YYYY-MM-DD HH:mm:ss
 * [BN] আইএসও টাইমস্ট্যাম্পকে ব্যবহারকারীর লোকাল টাইমজোনে YYYY-MM-DD HH:mm:ss ফরম্যাটে রূপান্তর করে
 */
export const formatLocalDateTime = (isoString?: string | null): string => {
  if (!isoString) return '—';

  try {
    let raw = String(isoString).trim();
    if (!raw) return '—';

    // [EN] If raw ISO timestamp has no timezone offset (missing Z or +/-), append Z to ensure UTC interpretation
    // [BN] টাইমজোনের অফসেট না থাকলে ইউটিসি হিসেবে গণ্য করার জন্য Z যুক্ত করা
    if (!raw.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(raw)) {
      raw += 'Z';
    }

    const d = new Date(raw);
    if (isNaN(d.getTime())) {
      return String(isoString).replace('T', ' ').substring(0, 19);
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    const ss = pad(d.getSeconds());

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  } catch {
    return String(isoString).replace('T', ' ').substring(0, 19);
  }
};

/**
 * [EN] Returns human-readable local date-time with resolved timezone name for tooltips
 * [BN] টুলটিপের জন্য লোকাল টাইমজোন ও পূর্ণাঙ্গ তারিখ-সময় রিটার্ন করে
 */
export const formatDateTimeTooltip = (isoString?: string | null): string => {
  if (!isoString) return '';

  try {
    let raw = String(isoString).trim();
    if (!raw.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(raw)) {
      raw += 'Z';
    }

    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(isoString);

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    return `${d.toLocaleString()} (${tz})`;
  } catch {
    return String(isoString);
  }
};
