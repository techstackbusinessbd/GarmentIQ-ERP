import axios from 'axios';
import { toast } from 'sonner';

/**
 * [EN] Centralized Axios HTTP Client for Garments ERP Backend REST APIs.
 * Automatically injects JWT Bearer tokens and translates backend errors to friendly Sonner toasts.
 *
 * [BN] গার্মেন্টস ইআরপি সেন্ট্রাল এপিআই ক্লায়েন্ট।
 * স্বয়ংক্রিয়ভাবে জেডব্লিউটি টোকেন ইনজেক্ট করে এবং ব্যাকএন্ড এররকে ব্যবহারকারী-বান্ধব টোস্ট নোটিফিকেশনে রূপান্তর করে।
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// [EN] Request Interceptor: Attach JWT token if available
// [BN] রিকোয়েস্ট ইন্টারসেপ্টর: লোকালস্টোরেজ থেকে টোকেন থাকলে হেডারে সংযুক্ত করে
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [EN] Response Interceptor: Handle HTTP status codes gracefully
// [BN] রেসপন্স ইন্টারসেপ্টর: স্ট্যাটাস কোড অনুযায়ী মার্জিত নোটিফিকেশন প্রদর্শন
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || 'Unable to connect to the server. Please check your network connection.';

    if (status === 401) {
      toast.error('Session Expired', {
        description: 'Please sign in again to continue your work.',
      });
      // Optionally redirect to login
    } else if (status === 403) {
      toast.error('Access Denied', {
        description: message,
      });
    } else if (status === 404) {
      toast.warning('Record Not Found', {
        description: message,
      });
    } else if (status === 409) {
      toast.error('Simultaneous Update Detected', {
        description: message,
      });
    } else {
      toast.error('Operation Failed', {
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
