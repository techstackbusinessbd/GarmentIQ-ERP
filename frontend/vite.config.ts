/**
 * [EN] Vite 6 Configuration for Garments ERP Frontend.
 * Integrates React 19, Tailwind CSS v4 Vite plugin, and path aliases.
 *
 * [BN] গার্মেন্টস ইআরপি ফ্রন্টএন্ডের জন্য Vite ৬ কনফিগারেশন।
 * React ১৯, Tailwind CSS v4 প্লাগইন এবং পাথ অ্যালিয়াস ইন্টিগ্রেশন।
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    // [EN] Enable React 19 fast refresh and JSX transformation
    // [BN] React ১৯ ফাস্ট রিফ্রেশ ও JSX ট্রান্সফরমেশন সক্রিয়করণ
    react(),

    // [EN] Tailwind CSS v4 official Vite compiler plugin
    // [BN] Tailwind CSS v4 অফিসিয়াল Vite কম্পাইলার প্লাগইন
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // [EN] Map '@' prefix to the 'src' directory for clean imports
      // [BN] ক্লিন ইমপোর্টের জন্য '@' প্রিফিক্সকে 'src' ডিরেক্টরিতে ম্যাপ করা
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // [EN] Bind to all interfaces for Docker compatibility / [BN] ডকার সামঞ্জস্যের জন্য 0.0.0.0
    strictPort: true,
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
  },
});
