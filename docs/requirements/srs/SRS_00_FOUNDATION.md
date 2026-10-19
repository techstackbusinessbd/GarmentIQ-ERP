# সফটওয়্যার রিকোয়ারমেন্টস স্পেসিফিকেশন (SRS) - ফাউন্ডেশন ও লোকাল এনভায়রনমেন্ট
## SRS-00: কোর আর্কিটেকচার, টেক স্ট্যাক, ডিপেন্ডেন্সি ও লোকাল এনভায়রনমেন্ট

*প্রজেক্ট: RMG Woven, Denim & Non-Denim Enterprise ERP + Traceability + RFID Platform*  
*স্ট্যান্ডার্ড: IEEE 830 Software Requirements Specification*  
*তত্ত্বাবধায়ক: 👨‍💼 তানভীর আহমেদ (Chief Architect) ও 👨‍💻 আরিফুল ইসলাম (Tech Lead)*  
*তারিখ: ১৯ অক্টোবর ২০২৬ | সংস্করণ: ১.০ (খসড়া - স্যারের পর্যালোচনার জন্য)*  

---

## ১. ভূমিকা ও ভিত্তি স্কোপ (Introduction & Foundation Scope)

### ১.১ উদ্দেশ্যের পরিধি (Purpose):
এই স্পেসিফিকেশন ডকুমেন্টের মূল উদ্দেশ্য হলো গার্মেন্টস ইআরপি প্ল্যাটফর্মের **কোর ফাউন্ডেশন (Sprint 0)**-এর আর্কিটেকচারাল, টেকনিক্যাল ও এনভায়রনমেন্টাল রিকোয়ারমেন্টস নির্দিষ্ট করা। এটি সিস্টেমের সমস্ত পরবর্তী ১০টি বাউন্ডেড কনটেক্সটের (Merchandising, Inventory, Cutting, Sewing, Washing, ইত্যাদি) একক ভিত্তি (Shared Bedrock) হিসেবে কাজ করবে।

### ১.২ কোর গোল্ডেন প্রিন্সিপালস (Non-Negotiable Principles):
1. **ডকার-ফার্স্ট ডেভেলপমেন্ট ([রুল ০৫](file:///g:/ERP-Software/Garments-ERP/.agents/rules/05_docker_first_environment.md))**: হোস্ট মেশিনের পরিবেশ ১০০% ক্লিন রেখে ব্যাকএন্ড, ডেটাবেজ ও ফ্রন্টএন্ড কন্টেইনারে চলবে।
2. **জিরো হার্ডকোড ও ১০০% ভ্যারিয়েবল ড্রিভেন ([রুল ০৮](file:///g:/ERP-Software/Garments-ERP/.agents/rules/08_clean_code_and_zero_placeholder.md))**: সমস্ত পোর্ট, ডিবি ক্রিডেনশিয়াল ও সিক্রেট `application.yml` ও ডকার এনভায়রনমেন্ট ভ্যারিয়েবল থেকে আসবে।
3. **পেজ-ড্রিভেন আর্কিটেকচার ([ADR-005](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#সিদ্ধান্ত-০০৫-পেজ-ড্রিভেন-ন্যাভিগেশন-ও-কনটেক্সচুয়াল-মাইক্রো-মডাল-পলিসি-page-driven-architecture))**: জটিল কাজের জন্য আলাদা রুটেড পেজ এবং ছোট সিআরইউডির জন্য মাইক্রো-মডাল।
4. **১০০% অভিন্ন গ্লোবাল ডিজাইন সিস্টেম ([ADR-006](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#সিদ্ধান্ত-০০৬-১০০-অভিন্ন-গ্লোবাল-ডিজাইন-সিস্টেম-ও-মাস্টার-লেআউট-আর্কিটেকচার-unified-design-system))**: ভিন্ন পেজে ভিন্ন ডিজাইন বা কালার নিষিদ্ধ; একক মাস্টার শেল ও টোকেন।
5. **টাকা ও কাপড়ের নির্ভুলতা ([রুল ০১](file:///g:/ERP-Software/Garments-ERP/.agents/rules/01_backend_standards_java.md))**: কোনো ফ্লোটিং পয়েন্ট (`float`/`double`) নিষিদ্ধ; সবসময় **`BigDecimal`** ব্যবহার হবে।

---

## ২. রানটাইম ও লোকাল এনভায়রনমেন্ট স্পেসিফিকেশন (Environment Requirements)

| উপাদান | স্পেসিফিকেশন | পোর্ট ও অ্যাক্সেস | দায়িত্ব ও ভূমিকা |
| :--- | :--- | :---: | :--- |
| **হোস্ট ওএস** | Windows 10/11 64-bit | Local PC | পিডব্লিউএসএইচ (PowerShell) ও ডকার ইঞ্জিন হোস্ট। |
| **কন্টেইনার ইঞ্জিন**| Docker Engine 29+ & Compose v5+ | Docker Daemon | ব্যাকএন্ড, ফ্রন্টএন্ড, ডিবি ও পিজিঅ্যাডমিন কন্টেইনারাইজেশন। |
| **ডেটাবেজ সার্ভার**| PostgreSQL 16 Alpine | `5432:5432` | রিলেশনাল ডেটা ও JSONB সাইজ-কালার ম্যাট্রিক্স স্টোরেজ। |
| **ডিবি ম্যানেজমেন্ট**| pgAdmin 4 (Official Docker) | `5050:80` | ওয়েব ব্রাউজার দিয়ে লাইভ ডেটাবেজ টেবিল ও ইনডেক্স পরিদর্শন। |
| **ব্যাকএন্ড রানটাইম**| Java 21 LTS (Eclipse Temurin) | `8080:8080` | স্প্রিং বুট ৩.৩.৪ রেস্ট এপিআই ও ভার্চুয়াল থ্রেডস। |
| **ফ্রন্টএন্ড রানটাইম**| Node.js 22 / Vite 6 Dev Server | `5173:5173` | রিঅ্যাক্ট ১৯ হট মডিউল রিপ্লেসমেন্ট (HMR)। |

---

## ৩. ব্যাকএন্ড টেক স্ট্যাক ও প্যাকেজ স্পেসিফিকেশন (Backend Foundation - Java 21)

### ৩.১ ম্যাভেন ডিপেন্ডেন্সি ম্যানিফেস্ট ([backend/pom.xml](file:///g:/ERP-Software/Garments-ERP/backend/pom.xml)):
- **Spring Boot Starter Web (3.3.4)**: নন-ব্লকিং এন্টারপ্রাইজ রেস্টফুল এপিআই কন্ট্রাক্ট।
- **Spring Data JPA & Hibernate**: পোস্টগ্রেসকিউএল কানেক্টিভিটি, অপটিমিস্টিক লকিং (`@Version`) এবং মাল্টি-টেন্যান্ট পার্টিশনিং।
- **Spring Boot Starter Security & JJWT (0.12.6)**: স্টেটলেস এইচটিটিপি বেয়ারার টোকেন ও আরবিকিউ (Role-Based Access Control)।
- **PostgreSQL JDBC Driver**: লেটেস্ট ড্রাইভার সংযোগ পুলিং (HikariCP: Max 20, Min-Idle 5)।
- **Flyway Database Migration**: ভার্সন-নিয়ন্ত্রিত স্বয়ংক্রিয় ডিবি স্কিমা মাইগ্রেশন স্ক্রিপ্ট।
- **MapStruct (1.5.5) & Lombok (1.18.34)**: হাই-পারফরম্যান্স কম্পাইল-টাইম অবজেক্ট ম্যাপিং ও বয়লারপ্লেট অপসারণ।
- **ZXing (3.5.3)**: কাটিং বান্ডিল বারকোড ও কিউআর কোড জেনারেশন ও স্ক্যানিং ইন্টারফেস।
- **Apache POI (OOXML)**: বায়ার অর্ডার, বিওএম ও মার্চেন্ডাইজিং এক্সেল শিট ইমপোর্ট/এক্সপোর্ট ইঞ্জিন।
- **SpringDoc OpenAPI (2.6.0)**: সোয়াগার ৩ ইন্টার‌্যাক্টিভ এপিআই ডকুমেন্টেশন (`/swagger-ui.html`)।

### ৩.২ ব্যাকএন্ড কোর ক্লাস ফ্রেমওয়ার্ক:
1. **`AuditableBaseEntity`**: সমস্ত টেবিলের জন্য প্রাইমারি কি `UUID id`, `tenant_id`, `factory_unit_id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted` এবং `@Version Long version`।
2. **`ApiResponse<T>`**: স্ট্যান্ডার্ড এনভেলপ রেসপন্স (`success`, `message`, `data`, `timestamp`, `path`)।
3. **`PaginatedResponse<T>`**: এন্টারপ্রাইজ টেবিলের জন্য পেজিনেটেড ডেটা স্ট্রাকচার।
4. **`GlobalExceptionHandler`**: রোবোটিক স্ট্যাকট্রেস屏蔽 করে সহজ মানবিক ইংরেজিতে এরর অবজেক্ট প্রদানকারী সেন্ট্রাল হ্যান্ডলার।

---

## ৪. ফ্রন্টএন্ড টেক স্ট্যাক ও প্যাকেজ স্পেসিফিকেশন (Frontend Foundation - React 19)

### ৪.১ ফ্রন্টএন্ড প্যাকেজ ম্যানিফেস্ট ([frontend/package.json](file:///g:/ERP-Software/Garments-ERP/frontend/package.json)):
- **React 19 & React DOM 19**: লেটেস্ট কনকারেন্ট রিঅ্যাক্ট কোর।
- **Vite 6 & @vitejs/plugin-react**: সুপারফাস্ট বিল্ড ইঞ্জিন ও সাব-সেকেন্ড এইচএমআর।
- **React Router DOM 7**: পেজ-ড্রিভেন রাউটিং (`/orders`, `/styles`, `/cutting`, `/sewing`)।
- **Tailwind CSS v4 & @tailwindcss/vite**: সেন্ট্রালাইজড ভ্যারিয়েবল ও `@theme` ডিজাইন সিস্টেম।
- **@tanstack/react-query (v5)**: ব্যাকএন্ড এপিআই ডেটা ক্যাশিং, রি-ফেচিং ও ব্যাকগ্রাউন্ড সিঙ্ক।
- **@tanstack/react-table (v8)**: আল্ট্রা হাই-পারফরম্যান্স ভার্চুয়ালাইজড মাস্টার গ্রিড টেবিল।
- **Lucide React**: অভিন্ন আইকন কিট (আইকন সাইজ ও স্ট্রোক সেন্ট্রালি নিয়ন্ত্রিত)।
- **React Hook Form & Zod**: পারফরম্যান্ট ফর্ম স্টেট ও টাইপ-সেফ ক্লায়েন্ট ভ্যালিডেশন।
- **Zustand**: লাইটওয়েট গ্লোবাল স্টেট (Tenant, Factory Unit, Active User, Theme)।
- **Sonner & Axios**: সেন্ট্রালাইজড টোস্ট নোটিফিকেশন ও ইন্টারসেপ্টেড এপিআই ক্লায়েন্ট।

### ৪.২ ইউনিফাইড ইউআই আর্কিটেকচার ও মাস্টার লেআউট:
1. **`AppLayout.jsx`**:
   - ফিক্সড সাইডবার (উইডথ `w-64`, কোলাপসড `w-20`): সমস্ত পেজে একই নেভিগেশন।
   - গ্লোবাল হেডার (উচ্চতা `h-16`): ইউনিট সিলেক্টর, টেন্যান্ট নেম, ইউজার ব্যাজ।
   - মেইন ওয়ার্কস্পেস: স্ট্যান্ডার্ড কন্টেইনার উইডথ ও প্যাডিং (`p-6 lg:p-8`)।
2. **`PageHeader.jsx`**:
   - ব্রেডক্রাম্ব নেভিগেশন, `text-2xl font-bold` পেজ টাইটেল, সাবটাইটেল এবং স্ট্যান্ডার্ড অ্যাকশন বাটন গ্রুপ।
3. **`DataTable.jsx`**:
   - সম্পূর্ণ প্ল্যাটফর্মের জন্য একক তানস্ট্যাক টেবিল র‍্যাপার (অভিন্ন হেডার কালার, রো হাইট, পেজিনেশন ও সার্চবার)।
4. **সেন্ট্রাল ডিজাইন টোকেনস (`src/index.css`)**:
   - `--color-brand-accent: #4f46e5` (Indigo/Denim), `--color-surface-base: #f8fafc`, এবং ৪টি সেমান্টিক স্ট্যাটাস কালার।

---

## ৫. ডেটাবেজ ও ডকার কম্পোজ অর্কেস্ট্রেশন (Docker Blueprint)

### ৫.১ সার্ভিস ম্যাট্রিক্স ([docker/docker-compose.yml](file:///g:/ERP-Software/Garments-ERP/docker/docker-compose.yml)):
```yaml
services:
  postgres:  # PostgreSQL 16 Alpine + Persistent Volume + Seed Script
  backend:   # Java 21 Spring Boot + Volume Mount for Hot Reload
  frontend:  # React 19 + Vite Dev Server + Port 5173 Hot Reload
  pgadmin:   # pgAdmin 4 Web GUI on Port 5050
```

### ৫.২ সিড ও ১-ক্লিক পার্জ আর্কিটেকচার:
- **মাস্টার সিড (`scripts/seed-garments-master-data.sql`)**: প্রাথমিক টেন্যান্ট, ফ্যাক্টরি ইউনিট, সিস্টেম রোলস ও অ্যাডমিন ইউজার স্বয়ংক্রিয়ভাবে ডেটাবেজে লোড হবে।
- **১-ক্লিক পার্জ (`scripts/purge-demo-data.sql`)**: টেস্ট ও ডেমো ডেটা ১-ক্লিকে মুছে ফেলে ফ্রেশ প্রোডাকশন পরিবেশ প্রস্তুত করার নিশ্চয়তা ([রুল ১৩](file:///g:/ERP-Software/Garments-ERP/.agents/rules/13_demo_data_purge_and_clean_environment.md))।

---

## ৬. নন-ফাংশনাল কোয়ালিটি রিকোয়ারমেন্টস (NFRs):

1. **ফাইল সাইজ সিলিং ([রুল ০৭](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md))**: কোনো সোর্স কোড ফাইল ৩০০ লাইনের বেশি হবে না।
2. **দ্বিভাষিক কোড কমেন্টিং ([রুল ১৫](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md))**: প্রতিটি ক্লাস ও মেথডে `[EN]` ও `[BN]` পূর্ণাঙ্গ কমেন্ট থাকবে।
3. **মানবিক ভাষা কপিরাইটিং ([রুল ০৪](file:///g:/ERP-Software/Garments-ERP/.agents/rules/04_ui_copywriting_and_ux.md))**: স্ক্রিনে কোনো রোবোটিক বা ব্যাকএন্ড কোড মেসেজ দেখানো নিষিদ্ধ।
4. **পারফরম্যান্স এসএলএ**: এপিআই রেসপন্স < ২০০ms, ফ্রন্টএন্ড ইনিশিয়াল লোড < ১ সেকেন্ড, ডেভ সার্ভার HMR < ১০০ms।

---

## 🔍 ৭. কিউএ গ্রহণযোগ্যতার মানদণ্ড (Sprint 0 QA Checklist by Farhana):

- [ ] `docker compose up -d` দিলে পোস্টগ্রেসকিউএল, ব্যাকএন্ড, ফ্রন্টএন্ড ও পিজিঅ্যাডমিন ৪টি কন্টেইনারই হেলদি অবস্থায় চালু হতে হবে।
- [ ] ব্রাউজারে `http://localhost:5173` খুললে অভিন্ন মাস্টার লেআউট শেল লোড হতে হবে।
- [ ] ব্রাউজারে `http://localhost:8080/api/v1/swagger-ui.html` খুললে সোয়াগার এপিআই ডকুমেন্টেশন দৃশ্যমান হতে হবে।
- [ ] ব্রাউজারে `http://localhost:5050` খুললে পিজিঅ্যাডমিনে লগইন করে পোস্টগ্রেসকিউএল ডেটাবেজ টেবিল দেখা যেতে হবে।
- [ ] `scripts/purge-demo-data.sql` স্ক্রিপ্ট এক্সিকিউট করলে কোনো ইরর ছাড়া টেস্ট ডেটা পার্জ হতে হবে।
