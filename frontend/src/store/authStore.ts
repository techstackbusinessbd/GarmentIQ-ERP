/**
 * =============================================================================
 * [EN] Enterprise Authentication and RBAC Store (authStore)
 * [BN] এন্টারপ্রাইজ অথেনটিকেশন ও আরবিএসি পারমিশন স্টোর (authStore)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 19 (Constants)
 * [BN] ব্যবহারকারীর লগইন সেশন, রিফ্রেশ টোকেন ও রোল-পারমিশন যাচাইকারী Zustand স্টোর।
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type { LoginRequest, LoginResponse, User } from '@/types';
import { apiClient } from '@/services/apiClient';
import { AUTH_STORAGE_KEY, REFRESH_TOKEN_KEY, TENANT_STORAGE_KEY } from '@/constants';
import {
  initBrowserSession,
  clearBrowserSession,
  isBrowserSessionActive,
  purgeSessionStorage,
} from '@/utils';

/**
 * [EN] State contract for the Authentication Store.
 * [BN] অথেনটিকেশন স্টোরের স্টেট ও অ্যাকশন ইন্টারফেস।
 */
export interface AuthState {
  /** [EN] Currently authenticated user profile / [BN] বর্তমান লগইনকৃত ইউজারের প্রোফাইল */
  user: User | null;

  /** [EN] JWT access token / [BN] জেডব্লিউটি এক্সেস টোকেন */
  token: string | null;

  /** [EN] Long-lived refresh token / [BN] দীর্ঘমেয়াদী রিফ্রেশ টোকেন */
  refreshToken: string | null;

  /** [EN] Authentication status flag / [BN] অথেনটিকেটেড কি না */
  isAuthenticated: boolean;

  /** [EN] Loading state during auth requests / [BN] অথেনটিকেশন লোডিং অবস্থা */
  isLoading: boolean;

  /** [EN] Error message string / [BN] এরর মেসেজ */
  error: string | null;

  /** [EN] Authenticate with username and password / [BN] ক্রেডেনশিয়াল দিয়ে লগইন সম্পাদন */
  login: (credentials: LoginRequest) => Promise<boolean>;

  /** [EN] Silently refresh expired access token / [BN] সাইলেন্ট রিফ্রেশ টোকেন নবায়ন */
  refreshSession: () => Promise<boolean>;

  /** [EN] Fetch latest user profile from server / [BN] সার্ভার থেকে প্রোফাইল রিফ্রেশ */
  fetchProfile: () => Promise<void>;

  /** [EN] Invalidate session and clean credentials / [BN] সেশন সমাপ্তি ও লগআউট */
  logout: (broadcast?: boolean) => void;

  /** [EN] Clear current authentication error / [BN] এরর মেসেজ মুছে ফেলা */
  clearError: () => void;

  /** [EN] Verify if user has a specific role code / [BN] ইউজারের নির্দিষ্ট রোল আছে কি না */
  hasRole: (roleCode: string) => boolean;

  /** [EN] Verify if user has any of the listed roles / [BN] ইউজারের তালিকায় কোনো রোল আছে কি না */
  hasAnyRole: (roleCodes: readonly string[]) => boolean;
}

/**
 * [EN] Zustand Auth Store Hook with local storage persistence.
 * [BN] লোকাল স্টোরেজ পারসিস্টেন্স সহ Zustand Auth Store হুক।
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * [EN] Execute user authentication and token storage.
       * [BN] ব্যবহারকারী অথেনটিকেশন ও টোকেন সংরক্ষণ সম্পাদন।
       */
      login: async (credentials: LoginRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
          const data = response.data;

          if (!data || !data.accessToken) {
            throw new Error('Invalid authentication response from server.');
          }

          // [EN] Synchronize storage keys
          // [BN] লোকাল স্টোরেজ কি সমলয় করা
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, data.accessToken);
            if (data.refreshToken) {
              localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            }
            if (data.user?.tenantId) {
              localStorage.setItem(TENANT_STORAGE_KEY, data.user.tenantId);
            }
            initBrowserSession();
          } catch {
            // [EN] Ignore storage access issues / [BN] স্টোরেজ এক্সেস সীমাবদ্ধতা অগ্রাহ্য করা
          }

          set({
            user: data.user,
            token: data.accessToken,
            refreshToken: data.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success('Welcome back', {
            description: `Signed in as ${data.user?.fullName || data.user?.username}.`,
          });

          return true;
        } catch (err: unknown) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const apiError = (err as any)?.apiError;
          const errorMessage =
            apiError?.message ||
            (err instanceof Error ? err.message : 'Invalid credentials. Please verify your login.');

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
          });

          return false;
        }
      },

      /**
       * [EN] Silently renew access token using stored refresh token.
       * [BN] সংরক্ষিত রিফ্রেশ টোকেন ব্যবহার করে নীরবে এক্সেস টোকেন নবায়ন।
       */
      refreshSession: async (): Promise<boolean> => {
        const currentRefreshToken = get().refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!currentRefreshToken) {
          get().logout();
          return false;
        }

        try {
          const response = await apiClient.post<LoginResponse>('/auth/refresh', {
            refreshToken: currentRefreshToken,
          });
          const data = response.data;

          if (!data?.accessToken) {
            get().logout();
            return false;
          }

          localStorage.setItem(AUTH_STORAGE_KEY, data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
          }

          set({
            token: data.accessToken,
            refreshToken: data.refreshToken || currentRefreshToken,
            isAuthenticated: true,
            user: data.user || get().user,
          });

          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      /**
       * [EN] Retrieve and update profile of currently logged-in user.
       * [BN] লগইনকৃত ইউজারের সর্বশেষ প্রোফাইল তথ্য সার্ভার থেকে আনা।
       */
      fetchProfile: async (): Promise<void> => {
        try {
          const response = await apiClient.get<User>('/auth/me');
          const userData = (response?.data && (response.data as User).id)
            ? response.data
            : (response && (response as unknown as User).id ? (response as unknown as User) : null);
          if (userData) {
            set({ user: userData });
          }
        } catch {
          // [EN] Token might have expired; handled by interceptor
          // [BN] টোকেনের মেয়াদ উত্তীর্ণ হতে পারে; ইন্টারসেপ্টর দ্বারা পরিচালিত
        }
      },

      /**
       * [EN] Clear user authentication tokens and sign out (loop-guarded).
       * [BN] ইনফিনিট লুপ সুরক্ষিত অথেনটিকেশন সেশন বাতিল ও লগআউট সম্পাদন।
       */
      logout: (broadcast = true) => {
        const state = get();
        const wasAuth =
          state.isAuthenticated ||
          Boolean(state.token) ||
          Boolean(typeof window !== 'undefined' && localStorage.getItem(AUTH_STORAGE_KEY));

        // [EN] Prevent infinite loop: if already logged out, do not re-trigger
        // [BN] ইনফিনিট লুপ প্রতিরোধ: ইউজার ইতোমধ্যে লগআউট থাকলে পুনরায় টোস্ট বা ক্লিনআপ না করা
        if (!wasAuth) return;

        try {
          clearBrowserSession(broadcast);
          purgeSessionStorage();
        } catch {
          // [EN] Ignore storage access issues / [BN] স্টোরেজ এক্সেস সীমাবদ্ধতা অগ্রাহ্য করা
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        toast.info('Session Ended', {
          description: 'You have been signed out successfully.',
        });
      },

      /**
       * [EN] Reset error state / [BN] এরর স্টেট রিসেট
       */
      clearError: () => set({ error: null }),

      /**
       * [EN] Check if current user has the specified role code.
       * [BN] ইউজারের নির্ধারিত রোল কোড বিদ্যমান কি না যাচাই।
       */
      hasRole: (roleCode: string): boolean => {
        const user = get().user;
        if (!user || !user.roles) return false;
        return user.roles.includes(roleCode);
      },

      /**
       * [EN] Check if current user has any of the specified roles.
       * [BN] ইউজারের যেকোনো একটি প্রদত্ত রোল আছে কি না যাচাই।
       */
      hasAnyRole: (roleCodes: readonly string[]): boolean => {
        const user = get().user;
        if (!user || !user.roles) return false;
        return roleCodes.some((role) => user.roles.includes(role));
      },
    }),
    {
      name: 'garments_erp_auth_state',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // [EN] If browser was completely closed and reopened, auto-expire session
        // [BN] ব্রাউজার পুরোপুরি বন্ধ করার পর পুনরায় খুললে সেশন বাতিল করে লগআউট করা
        if (state && state.isAuthenticated && !isBrowserSessionActive()) {
          purgeSessionStorage();
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);
