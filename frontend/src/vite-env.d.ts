/// <reference types="vite/client" />

/**
 * [EN] Environment variable type definitions for Garments ERP Frontend.
 * [BN] গার্মেন্টস ইআরপি ফ্রন্টএন্ডের জন্য এনভায়রনমেন্ট ভ্যারিয়েবল টাইপ ডেফিনিশন।
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
