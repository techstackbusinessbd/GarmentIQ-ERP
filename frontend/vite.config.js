import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * [EN] Vite 6 configuration for Garments ERP Enterprise Frontend.
 * Integrates React 19 concurrent engine and Tailwind CSS v4 compiler.
 *
 * [BN] গার্মেন্টস ইআরপি এন্টারপ্রাইজ ফ্রন্টএন্ডের জন্য Vite ৬ কনফিগারেশন।
 * রিঅ্যাক্ট ১৯ কনকারেন্ট ইঞ্জিন এবং টেইলউইন্ড সিএসএস v4 কম্পাইলার যুক্ত করে।
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
  },
});
