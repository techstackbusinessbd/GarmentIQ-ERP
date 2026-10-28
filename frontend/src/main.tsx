/**
 * =============================================================================
 * [EN] Application Entry Point for Garments ERP Frontend
 * [BN] গার্মেন্টস ইআরপি ফ্রন্টএন্ডের মূল অ্যাপ্লিকেশন এন্ট্রি পয়েন্ট
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Design Tokens)
 * [BN] DOM-এ মূল React ১৯ অ্যাপ্লিকেশন মাউন্ট করা এবং গ্লোবাল সিএসএস লোড করা।
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { queryClient } from './services/queryClient';

// [EN] Locate root DOM container in index.html
// [BN] index.html ফাইলে রুট DOM কন্টেইনার চিহ্নিত করা
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element in index.html');
}

// [EN] Mount root React application within StrictMode and QueryClientProvider
// [BN] StrictMode এবং QueryClientProvider সহ রুট অ্যাপ্লিকেশন মাউন্ট করা
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
