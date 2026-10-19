import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

/**
 * [EN] Create TanStack Query Client with optimal caching defaults.
 * [BN] তানস্ট্যাক কুয়েরি ক্লায়েন্ট অপটিমাল ক্যাশিং কনফিগারেশন সহ।
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: '0.75rem',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </QueryClientProvider>
    </React.StrictMode>
  );
}
