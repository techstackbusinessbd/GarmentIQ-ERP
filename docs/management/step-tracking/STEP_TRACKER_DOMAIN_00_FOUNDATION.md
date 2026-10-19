# ডোমেন ০: ফাউন্ডেশন ও কোর প্ল্যাটফর্ম স্টেপ ট্র্যাকার
## Domain 0: Foundation & Core Platform Step Tracker

> **ডোমেন স্ট্যাটাস**: 🟢 **ACTIVE (চলমান)**  
> **লকিং নীতি**: এই ডোমেনের সমস্ত ধাপ ১০০% সম্পন্ন ও কিউএ টেস্ট পাস হলে ফাইলটি 🔒 **LOCKED & ARCHIVED** করা হবে।  
> **কাজের পাইপলাইন ক্রম**: `Document ➔ Database ➔ Backend ➔ Frontend ➔ QA Gate`  
> 🛑 **[রুল ২২ (জিরো স্টেপ-স্কিপিং)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/22_strict_sequential_step_execution_and_zero_skipping.md)**: কোনো সিঙ্গেল স্টেপ বাদ বা স্কিপ করে পরবর্তী স্টেপে যাওয়া সম্পূর্ণ নিষিদ্ধ।  
> 🔗 **[রুল ২৩ (কঠোর নির্ভরতা ক্রম)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/23_strict_dependency_hierarchy_and_prerequisite_ordering.md)**: কোনো চাইল্ড উপাদান তার প্যারেন্ট প্রি-রিকুইজিট ছাড়া কখনোই ডিজাইন বা কোড করা যাবে না।  
> 🔢 **[রুল ২৪ (অটো কোড জেনারেশন)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/24_dynamic_auto_code_generation_and_configurable_formats.md)**: সমস্ত বিজনেস কোড (Buyer, Style, PO) ১০০% সিস্টেম অটো-জেনারেটেড ও অ্যাডমিন কনফিগারেবল হতে হবে।

---

### 👥 ভার্চুয়াল ইঞ্জিনিয়ারিং টিম (Team Roster)
- **👔 Product Director / CTO**: আপনি (স্যার / বস) — কৌশলগত দিকনির্দেশনা ও সাইন-অফ
- **👨‍💼 তানভীর আহমেদ**: Chief Solutions Architect & PM — ডোমেন আর্কিটেকচার ও স্পেক্স
- **👨‍💻 আরিফুল ইসলাম**: Tech Lead & Backend Specialist — Java 21, Spring Boot, PostgreSQL 17
- **👩‍💻 সাদিয়া জাহান**: Senior Frontend & UI/UX Specialist — React 19, TypeScript, Tailwind CSS v4
- **👩‍🔬 ফারহানা চৌধুরী**: Lead QA & Security Gatekeeper — জিরো এরর অডিট ও কোয়ালিটি গেট

---

### 📊 স্ট্যাটাস নির্দেশিকা ও লকিং প্রোটোকল (রুল ২৬ অনুবর্তী)
- 🟢 **DONE (🔒 LOCKED)** : পদক্ষেপ সম্পন্ন, কিউএ-ভেরিফাইড এবং স্থায়ীভাবে সিলগালাকৃত
- 🔓 **IN PROGRESS** : সিটিও (স্যার) অনুমোদিত এবং বর্তমানে কাজ চলমান (একবারে কেবল ১টি)
- 🔒 **LOCKED** : ভবিষ্যতের আসন্ন পদক্ষেপ (বসের প্রত্যক্ষ আনলক অনুমোদন ছাড়া স্পর্শ করা সম্পূর্ণ নিষিদ্ধ)
- ⛔ **BLOCKED** : কোনো পূর্বশর্ত বা বাধার কারণে আটকে থাকা কাজ

---

## পর্ব ১: ফাউন্ডেশন ➔ ডকুমেন্টেশন (Foundation > Document)
> **স্কোপ**: সিস্টেম রুলস, ফাউন্ডেশন এসআরএস, ৪টি আই-কমফোর্ট থিম, শার্প মাইক্রো-রেডিয়াস, মাস্টার শেল, ইউওএম/সাইজ স্পেক্স ও অ্যাথেন্টিকেশন পলিসি।

| Step ID | Task Description | Depends On (প্রি-রিকুইজিট) | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S0-DOC-01` | আর্কিটেকচার, টিম রুলস ও ভার্চুয়াল টিম ফ্রেমওয়ার্ক | `- (Root)` | [AGENTS.md](file:///g:/ERP-Software/Garments-ERP/AGENTS.md) | তানভীর | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-02` | ফাউন্ডেশন এসআরএস ও গিট রিপোজিটরি সিঙ্ক | `S0-DOC-01` | [SRS_00_FOUNDATION.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_00_FOUNDATION.md) | তানভীর | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-03` | ভার্সন কন্ট্রোল, রিলিজ ম্যানেজমেন্ট ও ক্যাশ স্পেক | `S0-DOC-02` | [VERSION_CONTROL.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/VERSION_CONTROL_AND_RELEASE_MANAGEMENT.md) | তানভীর | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-04` | ডিজাইন সিস্টেম (টাইপোগ্রাফি, ৪টি থিম, মাইক্রো-রেডিয়াস) | `S0-DOC-02` | [01_TYPOGRAPHY.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/01_TYPOGRAPHY_AND_TYPE_SCALE.md) | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-05` | ৬০-৩০-১০ কালার রেশিও ও কম্পোনেন্ট কালার ম্যাপিং | `S0-DOC-04` | [05_COLOR_RATIO.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/05_SCREEN_COLOR_RATIO_AND_COMPONENT_MAPPING.md) | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-06` | মাস্টার শেল লেআউট ও উইজেট ড্যাশবোর্ড স্পেক | `S0-DOC-05` | [06_THEME_LAYOUT.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md) | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-07` | গ্লোবাল মাস্টার ডেটা স্পেক্স (UOM, সাইজ গ্রিড, ডিফেক্ট) | `S0-DOC-02` | [SRS_00_FOUNDATION.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_00_FOUNDATION.md) | তানভীর | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DOC-08` | অথেন্টিকেশন ও আরবিকিউ (JWT/RBAC) সিকিউরিটি স্পেক | `S0-DOC-02` | [SRS_00B_AUTH.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_00B_AUTH.md) | তানভীর | 🟢 **DONE (🔒 LOCKED)** |

---

## পর্ব ২: ফাউন্ডেশন ➔ ডেটাবেজ (Foundation > Database)
> **স্কোপ**: ডকারাইজড PostgreSQL 17, Redis 7, ফ্রেশ ভলিউম, কোর মাস্টার ডেটা সিডিং ও টপোলজিক্যাল Auth/User স্কিমা মাইগ্রেশন।

| Step ID | Task Description | Depends On (প্রি-রিকুইজিট) | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S0-DB-01` | ডকারাইজড PostgreSQL 17 ও Redis 7 কনফিগারেশন | `পর্ব ১ (DOC)` | [docker-compose.yml](file:///g:/ERP-Software/Garments-ERP/docker/docker-compose.yml) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DB-02` | মাস্টার সিড স্ক্রিপ্ট (Units, Sizes, Defect Codes & UUIDv7) | `S0-DB-01, S0-DOC-07` | [seed-master-data.sql](file:///g:/ERP-Software/Garments-ERP/scripts/seed-garments-master-data.sql) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DB-03` | ১-ক্লিক ডেমো ডেটা পার্জ স্ক্রিপ্ট (রুল ১৩) | `S0-DB-02` | [purge-demo-data.sql](file:///g:/ERP-Software/Garments-ERP/scripts/purge-demo-data.sql) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DB-04` | ফ্রেশ ডেটাবেজ ভলিউম রিসেট ও হেলথচেক ভেরিফিকেশন | `S0-DB-03` | PostgreSQL 17 (Port 5433) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-DB-05` | টেন্যান্ট, অটো-কোড, রোল ও ইউজার স্কিমা Flyway V1 স্ক্রিপ্ট | `S0-DB-04, S0-DOC-08` | [V1__init_tenants_auth_and_users.sql](file:///g:/ERP-Software/Garments-ERP/backend/src/main/resources/db/migration/V1__init_tenants_auth_and_users.sql) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |

---

## পর্ব ৩: ফাউন্ডেশন ➔ ব্যাকএন্ড ডেভেলপমেন্ট (Foundation > Backend)
> **স্কোপ**: Java 21, Spring Boot 3.3.4, Kernel, Tenant, Auto-Code Engine, RBAC, Users, Auth ও Master Data APIs।

| Step ID | Task Description | Depends On (প্রি-রিকুইজিট) | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S0-BE-01` | ব্যাকএন্ড ম্যাভেন ম্যানিফেস্ট ও ডিপেন্ডেন্সি রেজোলিউশন | `S0-DB-01` | [backend/pom.xml](file:///g:/ERP-Software/Garments-ERP/backend/pom.xml) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-02` | অ্যাপ্লিকেশন কনফিগারেশন ও ভার্চুয়াল থ্রেডস সক্রিয়করণ | `S0-BE-01` | [application.yml](file:///g:/ERP-Software/Garments-ERP/backend/src/main/resources/application.yml) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-03` | RFC 9562 টাইম-অর্ডারড UUIDv7 জেনারেটর ইউটিলিটি | `S0-BE-01` | [UuidV7Generator.java](file:///g:/ERP-Software/Garments-ERP/backend/src/main/java/com/garments/erp/core/utils/UuidV7Generator.java) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-04` | মাল্টি-টেন্যান্ট অডিটেবল বেস এন্টিটি ও অপটিমিস্টিক লক | `S0-BE-03` | [AuditableBaseEntity.java](file:///g:/ERP-Software/Garments-ERP/backend/src/main/java/com/garments/erp/core/entity/AuditableBaseEntity.java) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-05` | সেন্ট্রাল রেসপন্স এনভেলপ অবজেক্টস (`ApiResponse`) | `S0-BE-01` | [ApiResponse.java](file:///g:/ERP-Software/Garments-ERP/backend/src/main/java/com/garments/erp/core/response/ApiResponse.java) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-06` | গ্লোবাল এক্সেপশন ও মানবিক এরর হ্যান্ডলার | `S0-BE-05` | [GlobalExceptionHandler.java](file:///g:/ERP-Software/Garments-ERP/backend/src/main/java/com/garments/erp/core/exception/GlobalExceptionHandler.java) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-07` | স্প্রিং বুট মূল অ্যাপ্লিকেশন এন্ট্রি পয়েন্ট | `S0-BE-02` | [ErpApplication.java](file:///g:/ERP-Software/Garments-ERP/backend/src/main/java/com/garments/erp/ErpApplication.java) | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-08` | রুট Tenant Entity, Repository ও টেন্যান্ট কনটেক্সট | `S0-DB-05, S0-BE-04` | `backend/.../tenant/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-09` | ডাইনামিক অটো-কোড জেনারেশন ইঞ্জিন (রুল ২৪) | `S0-BE-08` | `backend/.../sequence/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-10` | রোল ও পারমিশন Entities ও Repositories (RBAC) | `S0-BE-08` | `backend/.../auth/entity/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-11` | ইউজার Entity, UserRole ও UserRepository | `S0-BE-08, S0-BE-10` | `backend/.../user/entity/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-12` | JWT Token Provider, JwtFilter ও Security Config | `S0-BE-11` | `backend/.../security/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-13` | AuthService ও Auth REST Controller (`/api/v1/auth/**`) | `S0-BE-12` | `backend/.../auth/controller/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-14` | User Management Service & REST Controller (`/api/v1/users/**`) | `S0-BE-11, S0-BE-13` | `backend/.../user/controller/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-15` | গ্লোবাল মাস্টার ডেটা Entities, Service ও Controllers (`/api/v1/master/**`) | `S0-BE-08, S0-DB-02` | `backend/.../master/` | আরিফ | 🟢 **DONE (🔒 LOCKED)** |
| `S0-BE-QA` | ব্যাকএন্ড ম্যাভেন কম্পাইলেশন, ইউনিট ও সিকিউরিটি টেস্ট অডিট | `S0-BE-01 থেকে 15` | `mvn clean verify` -> 30/30 passed (0 errors) | ফারহানা | 🟢 **DONE (🔒 LOCKED)** |

---

## পর্ব ৪: ফাউন্ডেশন ➔ ফ্রন্টএন্ড ডেভেলপমেন্ট (Foundation > Frontend)
> **স্কোপ**: React 19, Strict TypeScript, Vite 6, Tailwind CSS v4, ৪টি আই-কমফোর্ট থিম, শার্প মাইক্রো-রেডিয়াস, ১০০% উইজেট ড্যাশবোর্ড, মাস্টার ডেটা গ্রিড ও লগইন পেজ।

| Step ID | Task Description | Depends On (প্রি-রিকুইজিট) | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S0-FE-01` | React 19 + Strict TypeScript + Vite 6 প্যাকেজ কনফিগ | `পর্ব ১ (DOC)` | `frontend/package.json`, `tsconfig.json` | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-FE-02` | সেন্ট্রালাইজড টাইপ ইন্টারফেস ও ডেটা মডেলস | `S0-FE-01, S0-BE-05` | `src/types/*.ts` | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-FE-03` | Tailwind v4 থিম টোকেনস ও শার্প মাইক্রো-রেডিয়াস CSS | `S0-FE-01, S0-DOC-04` | `src/index.css` (4 Eye-Comfort Themes) | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-FE-04` | সেন্ট্রালাইজড ইউআই ও নেভিগেশন কনস্ট্যান্টস | `S0-FE-02` | `src/constants/*.ts` | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-FE-05` | Zustand থিম ও সেন্ট্রাল টাইপড API ক্লায়েন্ট | `S0-FE-03, S0-FE-04` | `themeStore.ts`, `apiClient.ts` | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-FE-06` | মাস্টার লেআউট শেল ও ThemeSwitcher পপওভার | `S0-FE-05` | `AppLayout.tsx`, `ThemeSwitcher.tsx` | সাদিয়া | 🟢 **DONE (🔒 LOCKED)** |
| `S0-FE-07` | উইজেট ফ্রেমওয়ার্ক (`WidgetContainer`, `WidgetHeader`) | `S0-FE-06` | `WidgetContainer.tsx` | সাদিয়া | 🔒 **LOCKED** |
| `S0-FE-08` | Zustand AuthStore, টোকেন হ্যান্ডলার ও ProtectedRoute গার্ড | `S0-FE-05, S0-BE-13` | `frontend/src/store/authStore.ts` | সাদিয়া | 🔒 **LOCKED** |
| `S0-FE-09` | কর্পোরেট লগইন স্ক্রিন (Sapphire Theme) | `S0-FE-08` | `frontend/src/pages/LoginPage.tsx` | সাদিয়া | 🔒 **LOCKED** |
| `S0-FE-10` | ইউজার লিস্ট ও রোল-পারমিশন অ্যাসাইনমেন্ট ম্যাট্রিক্স UI | `S0-FE-08, S0-BE-14` | `frontend/src/features/users/` | সাদিয়া | 🔒 **LOCKED** |
| `S0-FE-11` | ১০০% উইজেট-ভিত্তিক ড্যাশবোর্ড ওভারভিউ পেজ | `S0-FE-07, S0-FE-08` | `DashboardOverviewPage.tsx` | সাদিয়া | 🔒 **LOCKED** |
| `S0-FE-12` | মাস্টার ডেটা TanStack Query হুকস ও সিলেক্টর কম্পোনেন্ট | `S0-FE-05, S0-BE-15` | `frontend/src/features/master/` | সাদিয়া | 🔒 **LOCKED** |
| `S0-FE-QA` | ফ্রন্টএন্ড টাইপস্ক্রিপ্ট টাইপ-চেকিং অডিট | `S0-FE-01 থেকে 12` | `tsc --noEmit` -> 0 errors | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৫: ফাউন্ডেশন ➔ কোয়ালিটি গেট ও সাইন-অফ (Foundation > QA Gate)

| Step ID | Task Description | Depends On (প্রি-রিকুইজিট) | Verification Method | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S0-QA-01` | ব্যাকএন্ড এপিআই ও সিকিউরিটি ইন্টিগ্রেশন অডিট | `S0-BE-QA` | `mvn verify` -> 0 failures | ফারহানা | 🔒 **LOCKED** |
| `S0-QA-02` | ফ্রন্টএন্ড স্ট্রিক্ট টাইপ ও বিল্ড ভেরিফিকেশন | `S0-FE-QA` | `npm run build` & `tsc --noEmit` | ফারহানা | 🔒 **LOCKED** |
| `S0-QA-03` | ডকার ফুল-স্ট্যাক লাইভ সার্ভিসেস অডিট | `S0-QA-01, S0-QA-02` | `docker compose ps` & HTTP 200 | ফারহানা | 🔒 **LOCKED** |
| `S0-QA-04` | ডোমেন ০ চূড়ান্ত সাইন-অফ ও ফাইল লকিং | `S0-QA-03` | সিটিও (স্যার) সাইন-অফ ➔ 🔒 LOCKED | তানভীর | 🔒 **LOCKED** |

---

## 🔒 ডোমেন ০ লকিং প্রোটোকল (Domain Locking Protocol)
পর্ব ৫ সম্পন্ন হলে:
1. তানভীর আহমেদ ও ফারহানা চৌধুরী চূড়ান্ত সাইন-অফ রিপোর্ট দেবেন।
2. সিটিও (স্যার) চূড়ান্ত অনুমোদন দিলে এই ফাইলটি **🔒 LOCKED & ARCHIVED** ঘোষণা করা হবে।
3. পরবর্তী ডোমেন হিসেবে **`docs/management/step-tracking/STEP_TRACKER_DOMAIN_01_MERCHANDISING.md`** সক্রিয় করা হবে।
