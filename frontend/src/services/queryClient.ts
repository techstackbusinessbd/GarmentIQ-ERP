/**
 * =============================================================================
 * [EN] Centralized TanStack Query Client Configuration
 * [BN] কেন্দ্রীভূত TanStack Query ক্লায়েন্ট কনফিগারেশন (রুল ০৮ ও ১৯ অনুবর্তী)
 * =============================================================================
 * [EN] Reference: docs/specifications/TECH_STACK.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (High Performance), Rule 15 (Bilingual)
 * [BN] এন্টারপ্রাইজ ডেটা ক্যাশিং, ৫ মিনিট স্টেল টাইম এবং সাব-২০০ms এপিআই পারফরম্যান্স।
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * [EN] Shared TanStack QueryClient instance configured for high-density enterprise ERP.
 * [BN] হাই-ডেনসিটি এন্টারপ্রাইজ ইআরপির জন্য কনফিগারকৃত শেয়ার্ড TanStack QueryClient।
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes fresh cache
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
      retry: 1, // Single retry on transient failure
      refetchOnWindowFocus: false, // Prevent background refetch jitter
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
