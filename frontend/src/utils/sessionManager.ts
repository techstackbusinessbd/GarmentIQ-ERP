/**
 * =============================================================================
 * [EN] Enterprise Browser Session Manager (sessionManager)
 * [BN] এন্টারপ্রাইজ ব্রাউজার সেশন ম্যানেজার (sessionManager)
 * =============================================================================
 * [EN] Reference: RFC 6265 HTTP State Management Mechanism
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Constants)
 * [BN] নতুন ট্যাব ও নতুন উইন্ডোতে সেশন রক্ষা করে এবং সম্পূর্ণ ব্রাউজার বন্ধ হলে
 * স্বয়ংক্রিয়ভাবে লগআউট নিশ্চিত করে।
 */

import {
  SESSION_COOKIE_KEY,
  SESSION_SYNC_CHANNEL,
  AUTH_STORAGE_KEY,
  REFRESH_TOKEN_KEY,
  TENANT_STORAGE_KEY,
} from '@/constants';

/**
 * [EN] Broadcast sync message payload interface.
 * [BN] ক্রস-ট্যাব ব্রডকাস্ট মেসেজ পে-লোড ইন্টারফেস।
 */
export interface SessionSyncMessage {
  readonly type: 'SESSION_LOGIN' | 'SESSION_LOGOUT';
  readonly timestamp: number;
  readonly senderId: string;
}

/**
 * [EN] Unique instance identifier for current tab/window to prevent self-broadcast loops.
 * [BN] বর্তমান ট্যাব/উইন্ডোর ইউনিক আইডি যা নিজস্ব ব্রডকাস্ট লুপ প্রতিরোধ করে।
 */
const TAB_INSTANCE_ID =
  typeof window !== 'undefined'
    ? `${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`
    : 'ssr';

/**
 * [EN] Helper to check if running in a browser environment.
 * [BN] ব্রাউজার এনভায়রনমেন্ট যাচাইকারী হেল্পার।
 */
const isBrowser = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * [EN] Establishes a browser session anchor cookie (no expiry, lives for browser session).
 * [BN] একটি ব্রাউজার সেশন কুকি স্থাপন করে (মেয়াদহীন, সম্পূর্ণ ব্রাউজার বন্ধ হওয়া পর্যন্ত স্থায়ী)।
 */
export const initBrowserSession = (): void => {
  if (!isBrowser()) return;

  try {
    // [EN] Set cookie without Expires or Max-Age to create an RFC 6265 Session Cookie
    // [BN] Expires বা Max-Age ছাড়া কুকি সেট করা হলো যা ব্রাউজার প্রসেস বন্ধ হলেই বিলুপ্ত হবে
    document.cookie = `${SESSION_COOKIE_KEY}=active; path=/; SameSite=Lax`;
    broadcastSessionEvent('SESSION_LOGIN');
  } catch {
    // [EN] Ignore cookie writing errors in restricted sandboxes / [BN] স্যান্ডবক্স এরর অগ্রাহ্য করা
  }
};

/**
 * [EN] Destroys the browser session anchor cookie.
 * [BN] ব্রাউজার সেশন কুকিটি মুছে ফেলে।
 *
 * @param broadcast [EN] Whether to broadcast event to other tabs / [BN] অন্য ট্যাবে ব্রডকাস্ট পাঠাবে কি না
 */
export const clearBrowserSession = (broadcast = true): void => {
  if (!isBrowser()) return;

  try {
    document.cookie = `${SESSION_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    if (broadcast) {
      broadcastSessionEvent('SESSION_LOGOUT');
    }
  } catch {
    // [EN] Ignore cookie write restrictions / [BN] কুকি রাইট এরর অগ্রাহ্য করা
  }
};

/**
 * [EN] Verifies if the browser session anchor cookie is currently present.
 * [BN] ব্রাউজার সেশন কুকিটি বর্তমানে বিদ্যমান কি না তা যাচাই করে।
 *
 * @returns [EN] True if session cookie exists / [BN] সেশন কুকি বিদ্যমান থাকলে true
 */
export const isBrowserSessionActive = (): boolean => {
  if (!isBrowser()) return false;

  try {
    const cookies = document.cookie.split(';');
    return cookies.some((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE_KEY}=`));
  } catch {
    return false;
  }
};

/**
 * [EN] Clears all authentication artifacts from persistent local storage.
 * [BN] লোকাল স্টোরেজ থেকে সমস্ত অথেনটিকেশন ক্রেডেনশিয়াল মুছে ফেলে।
 */
export const purgeSessionStorage = (): void => {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TENANT_STORAGE_KEY);
    localStorage.removeItem('garments_erp_auth_state');
  } catch {
    // [EN] Ignore storage access issues / [BN] স্টোরেজ এক্সেস সীমাবদ্ধতা অগ্রাহ্য করা
  }
};

/**
 * [EN] Broadcasts session lifecycle event to all other open tabs/windows.
 * [BN] অন্যান্য সকল সক্রিয় ট্যাব ও উইন্ডোতে সেশন ইভেন্ট প্রেরণ করে।
 */
export const broadcastSessionEvent = (type: SessionSyncMessage['type']): void => {
  if (!isBrowser() || typeof BroadcastChannel === 'undefined') return;

  try {
    const channel = new BroadcastChannel(SESSION_SYNC_CHANNEL);
    channel.postMessage({
      type,
      timestamp: Date.now(),
      senderId: TAB_INSTANCE_ID,
    });
    channel.close();
  } catch {
    // [EN] BroadcastChannel unsupported or restricted / [BN] চ্যানেল সমর্থিত না হলে অগ্রাহ্য
  }
};

/**
 * [EN] Subscribes to cross-tab session lifecycle broadcasts.
 * [BN] ক্রস-ট্যাব সেশন ব্রডকাস্ট ইভেন্ট লিসেনার চালু করে।
 *
 * @param onLogout [EN] Callback invoked when another tab triggers logout / [BN] অন্য ট্যাব লগআউট করলে কলব্যাক
 * @param onLogin [EN] Callback invoked when another tab logs in / [BN] অন্য ট্যাব লগইন করলে কলব্যাক
 * @returns [EN] Teardown unsubscription function / [BN] লিসেনার বন্ধ করার আনসাবস্ক্রাইব ফাংশন
 */
export const subscribeToSessionEvents = (
  onLogout: () => void,
  onLogin?: () => void
): (() => void) => {
  if (!isBrowser() || typeof BroadcastChannel === 'undefined') return () => {};

  try {
    const channel = new BroadcastChannel(SESSION_SYNC_CHANNEL);

    channel.onmessage = (event: MessageEvent<SessionSyncMessage>) => {
      const { type, senderId } = event.data || {};
      // [EN] Drop echo broadcasts originating from this exact tab instance
      // [BN] বর্তমান ট্যাব থেকে আসা নিজস্ব ব্রডকাস্ট ড্রপ করে লুপ প্রতিরোধ
      if (!type || senderId === TAB_INSTANCE_ID) return;

      if (type === 'SESSION_LOGOUT') {
        onLogout();
      } else if (type === 'SESSION_LOGIN' && onLogin) {
        onLogin();
      }
    };

    return () => {
      channel.close();
    };
  } catch {
    return () => {};
  }
};
