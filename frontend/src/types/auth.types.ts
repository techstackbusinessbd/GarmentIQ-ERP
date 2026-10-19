/**
 * =============================================================================
 * [EN] Identity, RBAC Permissions, and Authentication Data Types
 * [BN] ব্যবহারকারী পরিচয়, আরবিএসি রোল-পারমিশন ও অথেনটিকেশন টাইপসমূহ
 * =============================================================================
 */

/**
 * [EN] User lifecycle status enumeration.
 * [BN] ব্যবহারকারীর বর্তমান সক্রিয়তা বা অবস্থা নির্দেশক এনাম।
 */
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED' | 'INACTIVE';

/**
 * [EN] Granular system permission representation.
 * [BN] সূক্ষ্ম দানাদার সিস্টেম পারমিশন ডেটা মডেল।
 */
export interface Permission {
  /** [EN] Permission UUID / [BN] পারমিশন ইউনিক আইডি */
  id: string;

  /** [EN] Unique permission code (e.g. USER_CREATE, STYLE_APPROVE) / [BN] পারমিশন কোড */
  permissionCode: string;

  /** [EN] Functional ERP module name (e.g. IAM, MERCHANDISING) / [BN] মডিউলের নাম */
  moduleName: string;

  /** [EN] Descriptive operational scope / [BN] পারমিশনের বিবরণ */
  description?: string;

  /** [EN] Active permission flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;
}

/**
 * [EN] Security role with bundled permissions.
 * [BN] পারমিশনের গুচ্ছসহ সিকিউরিটি রোল ডেটা মডেল।
 */
export interface Role {
  /** [EN] Role UUID / [BN] রোল ইউনিক আইডি */
  id: string;

  /** [EN] Standard role code (e.g. ROLE_SUPER_ADMIN, ROLE_MERCHANDISER) / [BN] রোল কোড */
  roleCode: string;

  /** [EN] Human-friendly role title / [BN] মানবিক রোলের শিরোনাম */
  roleName: string;

  /** [EN] Detailed role responsibilities / [BN] রোলের দায়িত্বের বিবরণ */
  description?: string;

  /** [EN] Active role flag / [BN] সক্রিয় কি না নির্দেশক ফ্ল্যাগ */
  active: boolean;

  /** [EN] Associated granular permissions / [BN] অন্তর্ভুক্ত পারমিশনের তালিকা */
  permissions?: Permission[];
}

/**
 * [EN] Corporate enterprise user profile representation.
 * [BN] প্রতিষ্ঠানের ব্যবহারকারী প্রোফাইল ডেটা মডেল।
 */
export interface User {
  /** [EN] User UUID / [BN] ব্যবহারকারীর ইউনিক আইডি */
  id: string;

  /** [EN] Owning tenant UUID / [BN] প্রতিষ্ঠানের টেন্যান্ট আইডি */
  tenantId: string;

  /** [EN] Unique username for login / [BN] লগইন ইউজারনেম */
  username: string;

  /** [EN] Corporate email address / [BN] প্রাতিষ্ঠানিক ইমেইল ঠিকানা */
  email: string;

  /** [EN] Full display name / [BN] ব্যবহারকারীর পূর্ণ নাম */
  fullName: string;

  /** [EN] Contact phone number / [BN] যোগাযোগের ফোন নম্বর */
  phone?: string;

  /** [EN] Corporate job designation / [BN] পদবী */
  designation?: string;

  /** [EN] User status enum / [BN] বর্তমান স্ট্যাটাস */
  status: UserStatus;

  /** [EN] List of assigned role codes / [BN] নির্ধারিত রোল কোডের তালিকা */
  roles: string[];

  /** [EN] Account creation timestamp / [BN] অ্যাকাউন্ট তৈরির সময় */
  createdAt: string;

  /** [EN] Last profile update timestamp / [BN] সর্বশেষ আপডেটের সময় */
  updatedAt?: string;
}

/**
 * [EN] Inbound authentication login request payload.
 * [BN] ব্যবহারকারী লগইনের জন্য প্রেরিত ক্রেডেনশিয়াল ডেটা।
 */
export interface LoginRequest {
  /** [EN] Username / [BN] ইউজারনেম */
  username: string;

  /** [EN] Password / [BN] পাসওয়ার্ড */
  password: string;
}

/**
 * [EN] Outbound authentication login response from server.
 * [BN] সফল লগইনের পর সার্ভার থেকে প্রাপ্ত টোকেন ও প্রোফাইল রেসপন্স।
 */
export interface LoginResponse {
  /** [EN] Cryptographic JWT bearer access token / [BN] জেডব্লিউটি এক্সেস টোকেন */
  accessToken: string;

  /** [EN] Long-lived refresh token for silent renewal / [BN] রিফ্রেশ টোকেন */
  refreshToken: string;

  /** [EN] Token authorization scheme (e.g. Bearer) / [BN] টোকেন টাইপ */
  tokenType: string;

  /** [EN] Token lifetime in milliseconds / [BN] টোকেনের স্থায়িত্বকাল (মিলিসেকেন্ড) */
  expiresInMs: number;

  /** [EN] Authenticated user summary profile / [BN] ব্যবহারকারীর প্রোফাইল তথ্য */
  user: User;
}

/**
 * [EN] Silent token renewal request payload.
 * [BN] সাইলেন্ট টোকেন নবায়নের জন্য রিফ্রেশ টোকেন রিকোয়েস্ট।
 */
export interface RefreshTokenRequest {
  /** [EN] Valid refresh token / [BN] বৈধ রিফ্রেশ টোকেন */
  refreshToken: string;
}

/**
 * [EN] User account provisioning request payload.
 * [BN] নতুন ব্যবহারকারী তৈরির জন্য রিকোয়েস্ট পে-লোড।
 */
export interface CreateUserRequest {
  /** [EN] Unique username / [BN] ইউজারনেম */
  username: string;

  /** [EN] Corporate email address / [BN] ইমেইল */
  email: string;

  /** [EN] Full display name / [BN] পূর্ণ নাম */
  fullName: string;

  /** [EN] Plaintext initial password / [BN] পাসওয়ার্ড */
  password: string;

  /** [EN] Contact phone number / [BN] ফোন */
  phone?: string;

  /** [EN] Organizational designation / [BN] পদবী */
  designation?: string;

  /** [EN] Array of role codes to assign / [BN] রোলের কোড তালিকা */
  roleCodes?: string[];
}

/**
 * [EN] User account modification request payload.
 * [BN] বিদ্যমান ব্যবহারকারীর তথ্য সংশোধনের জন্য রিকোয়েস্ট।
 */
export interface UpdateUserRequest {
  /** [EN] Updated email address / [BN] পরিবর্তিত ইমেইল */
  email?: string;

  /** [EN] Updated full name / [BN] পরিবর্তিত নাম */
  fullName?: string;

  /** [EN] Updated phone number / [BN] পরিবর্তিত ফোন */
  phone?: string;

  /** [EN] Updated designation / [BN] পরিবর্তিত পদবী */
  designation?: string;

  /** [EN] Updated user lifecycle status / [BN] পরিবর্তিত স্ট্যাটাস */
  status?: UserStatus;

  /** [EN] Updated role codes / [BN] পরিবর্তিত রোল কোড */
  roleCodes?: string[];
}
