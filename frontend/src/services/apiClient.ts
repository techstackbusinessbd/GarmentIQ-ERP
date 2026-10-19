/**
 * =============================================================================
 * [EN] Enterprise Typed REST API Client (Axios + Sonner)
 * [BN] এন্টারপ্রাইজ টাইপড REST API ক্লায়েন্ট (Axios + Sonner) (রুল ২৫ অনুবর্তী)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 25 (Server-Side Validation)
 * [BN] রুল ০৭ ও রুল ১৫ মেনে সম্পূর্ণ দ্বিভাষিক কমেন্ট সমৃদ্ধ টাইপড এপিআই ক্লায়েন্ট।
 *
 * [EN] Features:
 *  - Automatic Bearer JWT Injection
 *  - Rule 25 Server-Side Validation Error parsing (HTTP 422 FieldErrors)
 *  - RFC 9562 UUIDv7 & Tenant Context Headers
 *  - Humanized Toast Alerts (Zero robotic stacktraces)
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';
import type { ApiError, ApiResponse, FieldErrors } from '@/types';
import { AUTH_STORAGE_KEY } from '@/constants';

/**
 * [EN] Resolve base API URL from environment or local proxy default.
 * [BN] এনভায়রনমেন্ট ভ্যারিয়েবল অথবা লোকাল প্রক্সি থেকে বেস URL নির্ধারণ।
 */
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';

/**
 * [EN] Core Axios instance configured for enterprise RMG platform.
 * [BN] এন্টারপ্রাইজ আরএমজি প্ল্যাটফর্মের জন্য কনফিগার করা মূল Axios ইন্সট্যান্স।
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * [EN] Request Interceptor: Attach JWT token and Tenant ID to outgoing requests.
 * [BN] রিকোয়েস্ট ইন্টারসেপ্টর: প্রতিটি রিকোয়েস্টে টোকেন ও টেন্যান্ট আইডি সংযুক্ত করে।
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem(AUTH_STORAGE_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const tenantId = localStorage.getItem('garments_erp_tenant_id');
        if (tenantId && config.headers) {
          config.headers['X-Tenant-ID'] = tenantId;
        }
      } catch {
        // [EN] Ignore storage access restrictions / [BN] লোকাল স্টোরেজ এক্সেস সীমাবদ্ধতা অগ্রাহ্য করা
      }
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

/**
 * [EN] Response Interceptor: Parse envelopes and map Rule 25 server validation errors.
 * [BN] রেসপন্স ইন্টারসেপ্টর: এনভেলপ আনর্যাপিং এবং রুল ২৫ সার্ভার এরর ম্যাপিং।
 */
axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response): any => {
    // [EN] Direct unwrapping of backend ApiResponse envelope
    // [BN] ব্যাকএন্ড ApiResponse এনভেলপের সরাসরি আনর্যাপিং
    return response.data;
  },
  (error: AxiosError<ApiResponse<FieldErrors>>) => {
    const status = error.response?.status;
    const responseBody = error.response?.data;
    const serverMessage =
      responseBody?.message ||
      'Unable to connect to the server. Please check your network connection.';

    // [EN] Structured humanized error object
    // [BN] কাঠামোগত মানবিক এরর অবজেক্ট
    const normalizedError: ApiError = {
      message: serverMessage,
      status,
      code: responseBody?.error,
    };

    // [EN] Rule 25: Server-side validation error handling (HTTP 422 Unprocessable Entity)
    // [BN] রুল ২৫: সার্ভার-সাইড ভ্যালিডেশন এরর হ্যান্ডলিং (HTTP 422)
    if (status === 422 && responseBody?.data) {
      normalizedError.fieldErrors = responseBody.data;
      toast.warning('Validation Required', {
        description: serverMessage,
      });
    } else if (status === 401) {
      toast.error('Session Expired', {
        description: 'Please sign in again to continue your session.',
      });
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch {
          // [EN] Ignore storage cleanup error / [BN] স্টোরেজ ক্লিনআপ এরর অগ্রাহ্য করা
        }
      }
    } else if (status === 403) {
      toast.error('Access Denied', {
        description:
          serverMessage !== 'Unable to connect to the server. Please check your network connection.'
            ? serverMessage
            : 'You do not have permission to perform this operation.',
      });
    } else if (status === 404) {
      toast.warning('Record Not Found', {
        description: serverMessage,
      });
    } else if (status === 409) {
      toast.error('Simultaneous Update Detected', {
        description:
          serverMessage ||
          'Another user has modified this record. Please refresh and review before saving.',
      });
    } else if (status && status >= 500) {
      toast.error('Server Encountered an Issue', {
        description:
          serverMessage ||
          'An internal error occurred. Please notify engineering support.',
      });
    } else if (!error.response) {
      toast.error('Network Connection Error', {
        description:
          'Cannot reach the Garments ERP backend server. Please verify Docker services.',
      });
    }

    // [EN] Attach normalized ApiError for component catch blocks
    // [BN] কম্পোনেন্টের জন্য প্রমিত ApiError সংযুক্ত করা
    Object.assign(error, { apiError: normalizedError });
    return Promise.reject(error);
  }
);

/**
 * [EN] Strongly Typed REST API Client wrapper.
 * Provides type-safe convenience methods for standard HTTP verbs.
 *
 * [BN] স্ট্রংলি টাইপড REST API ক্লায়েন্ট র্যাপার।
 * স্ট্যান্ডার্ড HTTP মেথডগুলোর জন্য টাইপ-সেফ সুবিধা প্রদান করে।
 */
export const apiClient = {
  /**
   * [EN] Execute HTTP GET request / [BN] HTTP GET রিকোয়েস্ট সম্পাদন
   */
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    axiosInstance.get(url, config),

  /**
   * [EN] Execute HTTP POST request with payload / [BN] পেলোড সহ HTTP POST রিকোয়েস্ট সম্পাদন
   */
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => axiosInstance.post(url, data, config),

  /**
   * [EN] Execute HTTP PUT full replacement request / [BN] HTTP PUT সম্পূর্ণ আপডেট রিকোয়েস্ট সম্পাদন
   */
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => axiosInstance.put(url, data, config),

  /**
   * [EN] Execute HTTP PATCH partial update request / [BN] HTTP PATCH আংশিক আপডেট রিকোয়েস্ট সম্পাদন
   */
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => axiosInstance.patch(url, data, config),

  /**
   * [EN] Execute HTTP DELETE request / [BN] HTTP DELETE রিকোয়েস্ট সম্পাদন
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    axiosInstance.delete(url, config),
};

export default apiClient;
