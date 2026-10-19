# সফটওয়্যার রিকোয়ারমেন্টস স্পেসিফিকেশন: অথেন্টিকেশন ও রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC)
## Software Requirements Specification: Authentication & RBAC Security (SRS-00B)

> **মডিউল**: Module 0.3 - Identity, Multi-Tenant Authentication & Authorization  
> **আর্কিটেকচার লিড**: তানভীর আহমেদ (Chief Solutions Architect & PM)  
> **সিকিউরিটি অডিটর**: ফারহানা চৌধুরী (Lead QA & Security Gatekeeper)  
> **স্ট্যাটাস**: 🟢 **DRAFTED & SPECIFIED** (Java 21, Spring Security 6, JJWT, PostgreSQL 17)  
> **নিয়মাবলি রেফারেন্স**: [রুল ১১](file:///g:/ERP-Software/Garments-ERP/.agents/rules/11_mandatory_user_approval_gate.md), [রুল ২২](file:///g:/ERP-Software/Garments-ERP/.agents/rules/22_strict_sequential_step_execution_and_zero_skipping.md)

---

### ১. ব্যবসায়িক উদ্দেশ্য ও মিশন (Business Objectives)
গার্মেন্টস ইআরপি একটি মিশন-ক্রিটিক্যাল এন্টারপ্রাইজ সিস্টেম। বায়ার অর্ডার কস্টিং, ফেব্রিক ইনভেন্টরি, কাটিং রেশিও এবং কমার্শিয়াল এলসি ডেটার সর্বোচ্চ নিরাপত্তা নিশ্চিত করার জন্য একটি স্টেটলেস, মাল্টি-টেন্যান্ট ও গ্র্যানুলার রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC) ফ্রেমওয়ার্ক অপরিহার্য।

---

### ২. কোর সিকিউরিটি পলিসি (Security Policies)
1. **স্টেটলেস আর্কিটেকচার**: কোনো HTTP সেশন সার্ভারে সংরক্ষিত হবে না (`SessionCreationPolicy.STATELESS`)।
2. **পাসওয়ার্ড হ্যাশিং**: ইন্ডাস্ট্রি-স্ট্যান্ডার্ড `BCryptPasswordEncoder` (Work factor: 12)।
3. **জেডব্লিউটি (JJWT 0.12+) স্পেসিফিকেশন**:
   - **অ্যালগরিদম**: HMAC-SHA256 (HS256) বা HMAC-SHA512।
   - **অ্যাক্সেস টোকেন লাইফটাইম**: ৬০ মিনিট (Development) / ১৫ মিনিট (Production)।
   - **রিফ্রেশ টোকেন লাইফটাইম**: ৭ দিন (Redis-এ সংরক্ষিত রিভোকেশন ট্র্যাকিং)।
   - **টোকেন ক্লেইমস (Claims)**:
     - `sub`: ইউজার আইডি (RFC 9562 UUIDv7)
     - `email`: প্রাতিষ্ঠানিক ইমেইল
     - `tenantId`: মাল্টি-টেন্যান্ট অর্গানাইজেশন আইডি
     - `roles`: ইউজারের অ্যাসাইনড রোল কোডের তালিকা (`ROLE_MERCHANDISER`, ইত্যাদি)
     - `permissions`: গ্র্যানুলার পারমিশন কোড (`ORDER:CREATE`, `CUTTING:EXECUTE`, ইত্যাদি)

---

### ৩. ডেটাবেজ স্কিমা মডেল (RBAC Entity Relationship)

```
[tenants] 1 ──── N [users] 1 ──── N [user_roles] N ──── 1 [roles] 1 ──── N [role_permissions] N ──── 1 [permissions]
```

#### ক. `users` টেবিল
- `id` (UUID, PK, UUIDv7)
- `tenant_id` (UUID, FK, NOT NULL)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `email` (VARCHAR(100), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `full_name` (VARCHAR(100), NOT NULL)
- `department` (VARCHAR(50)) - যেমন: MERCHANDISING, CUTTING, SEWING, QA, ACCOUNTS
- `designation` (VARCHAR(50))
- `phone` (VARCHAR(20))
- `status` (VARCHAR(20), NOT NULL) - `ACTIVE`, `INACTIVE`, `SUSPENDED`
- `created_at`, `updated_at`, `created_by`, `updated_by`, `version` (AuditableBaseEntity)

#### খ. `roles` টেবিল
- `id` (UUID, PK, UUIDv7)
- `tenant_id` (UUID, FK, NOT NULL)
- `role_code` (VARCHAR(50), NOT NULL) - যেমন: `ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, `ROLE_MERCHANDISER`, `ROLE_CUTTING_MANAGER`, `ROLE_SEWING_SUPERVISOR`, `ROLE_QA_INSPECTOR`, `ROLE_FINISHING_MANAGER`, `ROLE_COMMERCIAL_OFFICER`, `ROLE_EXECUTIVE_VIEWER`
- `role_name` (VARCHAR(100), NOT NULL)
- `description` (TEXT)
- `is_system_role` (BOOLEAN, DEFAULT false)
- `created_at`, `updated_at`, `created_by`, `updated_by`, `version`

#### গ. `permissions` টেবিল
- `id` (UUID, PK, UUIDv7)
- `permission_code` (VARCHAR(60), UNIQUE, NOT NULL) - যেমন: `ORDER:READ`, `ORDER:WRITE`, `ORDER:APPROVE`, `CUTTING:EXECUTE`, `FINISHING:APPROVE`, `USER:MANAGE`
- `module_name` (VARCHAR(50), NOT NULL)
- `description` (VARCHAR(200))

#### ঘ. জাংশন টেবিল
- `user_roles`: (`user_id`, `role_id`, PK (`user_id`, `role_id`))
- `role_permissions`: (`role_id`, `permission_id`, PK (`role_id`, `permission_id`))

---

### ৪. REST API কন্ট্রাক্ট স্পেসিফিকেশন (API Contracts)

#### ৪.১ ইউজার লগইন (`POST /api/v1/auth/login`)
- **পাবলিক অ্যান্ডপয়েন্ট** (কোনো টোকেনের প্রয়োজন নেই)
- **রিকোয়েস্ট বডি**:
```json
{
  "usernameOrEmail": "tanvir.merchandiser",
  "password": "Password@123"
}
```
- **সাকসেস রেসপন্স (200 OK)**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcy1pcy1yZWZyZXNoLXRva2Vu...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "019472ba-7e23-745a-90ab-123456789abc",
      "username": "tanvir.merchandiser",
      "email": "tanvir@garmentserp.com",
      "fullName": "Tanvir Ahmed",
      "department": "MERCHANDISING",
      "roles": ["ROLE_MERCHANDISER"],
      "permissions": ["ORDER:READ", "ORDER:WRITE", "BOM:VIEW"]
    }
  },
  "timestamp": "2026-10-19T18:10:00Z"
}
```

#### ৪.২ টোকেন রিফ্রেশ (`POST /api/v1/auth/refresh`)
- **রিকোয়েস্ট বডি**: `{"refreshToken": "..."}`
- **রেসপন্স**: নতুন `accessToken` এবং `expiresIn`।

#### ৪.৩ বর্তমান ইউজার প্রোফাইল (`GET /api/v1/auth/me`)
- **হেডার**: `Authorization: Bearer <accessToken>`
- **রেসপন্স**: লগইনকৃত ইউজারের ডিটেইলস ও সক্রিয় পারমিশনস।

#### ৪.৪ পাসওয়ার্ড পরিবর্তন (`POST /api/v1/auth/change-password`)
- **হেডার**: `Authorization: Bearer <accessToken>`
- **রিকোয়েস্ট**: `{"oldPassword": "...", "newPassword": "..."}`

---

### ৫. প্রাক-সংজ্ঞায়িত সিস্টেম রোলস (Default Seed Roles)

| Role Code | Role Name | Primary Responsibility |
| :--- | :--- | :--- |
| `ROLE_SUPER_ADMIN` | System Super Admin | সম্পূর্ণ মাল্টি-টেন্যান্ট সিস্টেম কন্ট্রোল ও টেন্যান্ট ক্রিয়েশন |
| `ROLE_ADMIN` | Factory Admin | ফ্যাক্টরি ইউজার ম্যানেজমেন্ট, রোল ও পারমিশন কন্ট্রোল |
| `ROLE_MERCHANDISER` | Merchandiser Lead | বায়ার স্টাইল, কস্টিং, BOM ও অর্ডার লাইফসাইকেল ম্যানেজমেন্ট |
| `ROLE_CUTTING_MANAGER`| Cutting Floor Manager | ফেব্রিক ইস্যু, মার্কার রেশিও, কাটিং অর্ডার ও বান্ডিল ট্র্যাকিং |
| `ROLE_SEWING_SUPERVISOR`| Sewing Floor Supervisor| লাইন লোডিং, ঘন্টাভিত্তিক সুইং আউটপুট ও ডিফেক্ট লগ |
| `ROLE_QA_INSPECTOR` | QA Auditor | ইনকামিং ফেব্রিক ইন্সপেকশন (4-Point), ইন-লাইন ও ফাইনাল অডিট |
| `ROLE_FINISHING_MANAGER`| Finishing In-charge | ওয়াশ চালান, আয়রনিং, প্যাকিং ও কার্টনিং ভেরিফিকেশন |
| `ROLE_COMMERCIAL_OFFICER`| Commercial Officer | বায়ার এলসি, এক্সপোর্ট চালান, কাস্টমস ও শিপমেন্ট গেটপাস |
| `ROLE_EXECUTIVE_VIEWER` | Executive Dashboard | ম্যানেজমেন্ট ভিউয়ার (সিএক্সও / ডিরেক্টরদের জন্য রিড-অনলি মোড) |

---

### ৬. সিকিউরিটি গেট ও কিউএ টেস্ট সাইন-অফ মানদণ্ড
- [ ] ভুল পাসওয়ার্ড দিলে ৩ বারের পর ব্রুট-ফোর্স প্রটেকশন / রেট লিমিটিং ট্রিগার হতে হবে।
- [ ] এক্সপায়ার্ড টোকেন রিকোয়েস্টে `401 Unauthorized` ফেরত দিতে হবে।
- [ ] রোল পারমিশন ব্যতিরেকে রিসোর্স অ্যাক্সেস করলে `403 Forbidden` ফেরত দিতে হবে।
- [ ] রেসপন্স ও এরর মেসেজে কোনো ডেটাবেজ স্ট্যাক ট্রেস উন্মুক্ত করা যাবে না।
