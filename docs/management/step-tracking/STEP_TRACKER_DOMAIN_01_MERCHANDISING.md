# ডোমেন ০১: মার্চেন্ডাইজিং ও অর্ডার প্রসেসিং স্টেপ ট্র্যাকার
## Domain 01: Merchandising, Costing & Order Processing Step Tracker

> **ডোমেন স্ট্যাটাস**: 🟢 **ACTIVE & INITIALIZED (স্পেসিফিকেশন ও স্কিমা প্রস্তুতকরণ পর্ব)**  
> **কাজের পাইপলাইন ক্রম**: `Specification ➔ Database (Flyway) ➔ Backend ➔ Frontend ➔ QA Gate`  
> 🛑 **[রুল ২২ (জিরো স্টেপ-স্কিপিং)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/22_strict_sequential_step_execution_and_zero_skipping.md)**: কোনো সিঙ্গেল স্টেপ বাদ বা স্কিপ করে পরবর্তী স্টেপে যাওয়া সম্পূর্ণ নিষিদ্ধ।  
> 🔗 **[রুল ২৩ (কঠোর নির্ভরতা ক্রম)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/23_strict_dependency_hierarchy_and_prerequisite_ordering.md)**: কোনো চাইল্ড উপাদান তার প্যারেন্ট প্রি-রিকুইজিট ছাড়া কখনোই কোড করা যাবে না।  
> 🔒 **[রুল ২৬ (কঠোর লকিং ও আনলক গেট)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/26_step_tracker_strict_locking_and_explicit_unlock_gate.md)**: প্রতিটি পদক্ষেপ স্যারের প্রত্যক্ষ আনলক অনুমোদনের পরেই কেবল `IN PROGRESS` হবে।

---

### 👥 ভার্চুয়াল ইঞ্জিনিয়ারিং টিম (Team Roster & Ownership)
- **👔 Product Director / CTO**: আপনি (স্যার / বস) — চূড়ান্ত সাইন-অফ ও আনলক গেটকিপার
- **👨‍💼 তানভীর আহমেদ**: Chief Solutions Architect & PM — ডোমেন আর্কিটেকচার ও স্পেক্স ওনার
- **👨‍💻 আরিফুল ইসলাম**: Tech Lead & Backend Specialist — Java 21, Spring Boot, PostgreSQL 17
- **👩‍💻 সাদিয়া জাহান**: Senior Frontend & UI/UX Specialist — React 19, Tailwind CSS v4, TanStack
- **👩‍🔬 ফারহানা চৌধুরী**: Lead QA & Security Gatekeeper — জিরো এরর অডিট ও কোয়ালিটি গেট
- **👩‍💼 নাসরিন সুলতানা**: Lead Technical Writer & Documentation Specialist — এসআরএস, বিআরডি ও ট্র্যাকার সিঙ্ক
- **👨‍💻 মাহমুদুল হাসান**: Lead DevOps & IoT/RFID Engineer — ডকার, আরএফআইডি গেটওয়ে ও ডেপ্লয়মেন্ট

---

### 📊 প্রমিত স্ট্যাটাস নির্দেশিকা (রুল ২৬ অনুবর্তী)
- 🟢 **DONE (🔒 LOCKED)** : পদক্ষেপ সম্পন্ন, কিউএ-ভেরিফাইড এবং স্থায়ীভাবে সিলগালাকৃত
- 🔓 **IN PROGRESS** : সিটিও (স্যার) অনুমোদিত এবং বর্তমানে কাজ চলমান (একবারে কেবল ১টি)
- 🔒 **LOCKED** : ভবিষ্যতের আসন্ন পদক্ষেপ (বসের প্রত্যক্ষ আনলক অনুমোদন ছাড়া স্পর্শ করা সম্পূর্ণ নিষিদ্ধ)
- ⛔ **BLOCKED** : কোনো অনিবার্য প্রি-রিকুইজিট বা বাধার কারণে আটকে থাকা কাজ

---

## পর্ব ১: বায়ার ও ব্র্যান্ড ম্যানেজমেন্ট (Module 1: Buyer & Brand)
> **স্কোপ**: বায়ার গ্লোবাল প্রোফাইল, সাব-ব্র্যান্ড পোর্টফোলিও, কান্ট্রি, ইনভয়েস কারেন্সি, পেমেন্ট টার্মস ও কমপ্লায়েন্স সার্টিফিকেশন।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M1-DOC-01` | বায়ার ও ব্র্যান্ড ডিটেইল স্পেক্স ও PostgreSQL স্কিমা ড্রাফট | ডোমেন ০০ সিলগালা | V27 Flyway Schema Draft (buyers, buyer_brands) | আরিফুল ও তানভীর | ✅ **COMPLETED** |
| `S1-M1-BE-02` | ব্যাকএন্ড JPA Entities, Repositories, UUIDv7 ও Auditing | `S1-M1-DOC-01` | `Buyer.java`, `BuyerBrand.java`, AuditableBase | আরিফুল | ✅ **COMPLETED** |
| `S1-M1-BE-03` | DTOs, অটো-কোড জেনারেটর (`BYR-xxxx`), Service ও Controller | `S1-M1-BE-02` | `BuyerService.java`, REST Endpoints, RBAC | আরিফুল | ✅ **COMPLETED** |
| `S1-M1-FE-04` | ফ্রন্টএন্ড বায়ার ও ব্র্যান্ড ডিরেক্টরি, সাব-ড্রয়ার ও অ্যাকশনস | `S1-M1-BE-03` | React 19 Table, Sub-Brand Drawer, Single-Word Buttons | সাদিয়া | ✅ **COMPLETED** |
| `S1-M1-QA-05` | বায়ার ও ব্র্যান্ড ইউনিট/ইন্টিগ্রেশন টেস্ট ও কিউএ সাইন-অফ | `S1-M1-FE-04` | JUnit 5 Tests, OWASP Security, UI Verification | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ২: বায়ার ইনকোয়ারি ও সম্ভাব্যতা (Module 2: Inquiry & RFQ)
> **স্কোপ**: ইনকোয়ারি টিকিট (`INQ-xxxx`), টেকনিক্যাল সম্ভাব্যতা যাচাই, প্রজেক্টেড কোয়ান্টিটি ও দ্রুত কোটেশন ট্র্যাকার।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M2-DB-01` | ইনকোয়ারি ও আরএফকিউ স্কিমা ড্রাফট (V28 Flyway) | `S1-M1-QA-05` | `inquiry_tickets`, `inquiry_quotations` tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M2-BE-02` | ব্যাকএন্ড ইনকোয়ারি সার্ভিস, ডাইনামিক কোড ও কনভার্সন এপিআই | `S1-M2-DB-01` | `InquiryService.java`, REST Endpoints | আরিফুল | 🔒 **LOCKED** |
| `S1-M2-FE-03` | ফ্রন্টএন্ড ইনকোয়ারি ম্যানেজমেন্ট বোর্ড ও লিড পাইপলাইন | `S1-M2-BE-02` | React 19 Kanban/Table view, Quick Costing Drawer | সাদিয়া | 🔒 **LOCKED** |
| `S1-M2-QA-04` | ইনকোয়ারি মডিউল কিউএ ভেরিফিকেশন ও সাইন-অফ | `S1-M2-FE-03` | Automated Tests, Conversion Audit | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৩: স্টাইল মাস্টার ও টেকপ্যাক হাব (Module 3: Style & Tech Pack)
> **স্কোপ**: স্টাইল মাস্টার (`STY-xxxx`), বায়ার স্টাইল কোড, ডিপার্টমেন্ট, টেকপ্যাক সংস্করণ ও POM টলারেন্স চার্ট।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M3-DB-01` | স্টাইল মাস্টার ও টেকপ্যাক সংস্করণ স্কিমা ড্রাফট (V29 Flyway) | `S1-M2-QA-04` | `style_master`, `tech_pack_revisions`, POM tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M3-BE-02` | ব্যাকএন্ড স্টাইল সার্ভিস, ফাইল স্টোরেজ ও POM স্পেক্স এপিআই | `S1-M3-DB-01` | `StyleService.java`, File Upload, REST API | আরিফুল | 🔒 **LOCKED** |
| `S1-M3-FE-03` | ফ্রন্টএন্ড স্টাইল ডিরেক্টরি, টেকপ্যাক হাব ও সাইজ গ্রেডিং ভিউ | `S1-M3-BE-02` | Style Details View, POM Interactive Grid | সাদিয়া | 🔒 **LOCKED** |
| `S1-M3-QA-04` | স্টাইল ও টেকপ্যাক কিউএ ভেরিফিকেশন ও সাইন-অফ | `S1-M3-FE-03` | Spec Precision Test, Revision Diff Audit | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৪: স্যাম্পল লাইফসাইকেল ও ল্যাব ডিপ অনুমোদন (Module 4: Sample & Lab Dip)
> **স্কোপ**: স্যাম্পল পর্যায় (Proto ➔ Fit ➔ SMS ➔ PP ➔ Gold Seal), কুরিয়ার ট্র্যাকিং, কালার ল্যাব ডিপ (A/B/C/D) ও ডেল্টা-ই।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M4-DB-01` | স্যাম্পল ট্র্যাকার ও ল্যাব ডিপ স্কিমা ড্রাফট (V30 Flyway) | `S1-M3-QA-04` | `sample_tracker`, `lab_dip_approvals` tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M4-BE-02` | ব্যাকএন্ড স্যাম্পল স্টেজ সার্ভিস ও শেড অ্যাপ্রুভাল এপিআই | `S1-M4-DB-01` | `SampleService.java`, `LabDipService.java` | আরিফুল | 🔒 **LOCKED** |
| `S1-M4-FE-03` | ফ্রন্টএন্ড স্যাম্পল লাইফসাইকেল ট্র্যাকার ও ল্যাব ডিপ বোর্ড | `S1-M4-BE-02` | Sample Approval Drawer, Lab Dip Shade Matrix | সাদিয়া | 🔒 **LOCKED** |
| `S1-M4-QA-04` | স্যাম্পল ও ল্যাব ডিপ কিউএ ভেরিফিকেশন ও সাইন-অফ | `S1-M4-FE-03` | Lifecycle Flow Tests, Stage Boundary Checks | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৫: বিওএম ও কনজাম্পশন ইঞ্জিন (Module 5: BOM & Consumption)
> **স্কোপ**: ডেনিম ও ওভেন শ্রিংকেজ পার্সেন্টেজ সমন্বয় ($\text{Warp \% / Weft \%}$), অপচয় বাফার এবং সুতা/বোতাম/জিপার একক।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M5-DB-01` | বিওএম ও কনজাম্পশন স্কিমা ড্রাফট (V31 Flyway) | `S1-M4-QA-04` | `fabric_consumption`, `trims_bom` tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M5-BE-02` | ব্যাকএন্ড কনজাম্পশন ক্যালকুলেটর (BigDecimal প্রিসিশন) | `S1-M5-DB-01` | `BomService.java`, Math Engine, REST API | আরিফুল | 🔒 **LOCKED** |
| `S1-M5-FE-03` | ফ্রন্টএন্ড বিওএম বিল্ডার ও ফর্মুলা কনজাম্পশন শিট UI | `S1-M5-BE-02` | High-Density BOM Table, Wastage Calculator | সাদিয়া | 🔒 **LOCKED** |
| `S1-M5-QA-04` | কনজাম্পশন ম্যাথ অডিট ও জিরো-রাউন্ডিং এরর সাইন-অফ | `S1-M5-FE-03` | Financial & Consumption Precision Audit | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৬: কস্টিং ও মার্জিন সুরক্ষা (Module 6: Pre-Order Costing)
> **স্কোপ**: ফেব্রিক + ট্রিমস + সিএম + ওয়াশ + ওভারহেড কস্টিং শিট, ম্যানেজমেন্ট মার্জিন লক ও অফিশিয়াল কোটেশন।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M6-DB-01` | কস্টিং শিট ও মার্জিন স্কিমা ড্রাফট (V32 Flyway) | `S1-M5-QA-04` | `costing_sheets`, `costing_approvals` tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M6-BE-02` | ব্যাকএন্ড কস্টিং ইঞ্জিন, মার্জিন লক ও কোটেশন এক্সপোর্ট এপিআই | `S1-M6-DB-01` | `CostingService.java`, PDF Quotation Generator | আরিফুল | 🔒 **LOCKED** |
| `S1-M6-FE-03` | ফ্রন্টএন্ড ইন্টারেক্টিভ কস্টিং শিট ও মার্জিন অ্যাপ্রুভাল UI | `S1-M6-BE-02` | Real-time Costing Grid, Currency Switcher | সাদিয়া | 🔒 **LOCKED** |
| `S1-M6-QA-04` | কস্টিং ইঞ্জিন অডিট ও সিকিউরিটি সাইন-অফ | `S1-M6-FE-03` | Margin Lock Tests, Permission Verification | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৭: বায়ার পারচেজ অর্ডার ও ২ডি সাইজ-কালার গ্রিড (Module 7: Buyer PO)
> **স্কোপ**: কনফার্মড পিও (`ORD-xxxx`), মাল্টিপল ডেলিভারি ও স্প্লিট শিপমেন্ট, ২ডি সাইজ-কালার-ইনসিম ম্যাট্রিক্স ও অ্যামেন্ডমেন্ট লগ।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M7-DB-01` | বায়ার পিও ও ২ডি ম্যাট্রিক্স স্কিমা ড্রাফট (V33 Flyway) | `S1-M6-QA-04` | `buyer_orders`, `order_matrix_items` tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M7-BE-02` | ব্যাকএন্ড অর্ডার সার্ভিস, স্প্লিট শিপমেন্ট ও ম্যাট্রিক্স এপিআই | `S1-M7-DB-01` | `OrderService.java`, REST Endpoints, Concurrency | আরিফুল | 🔒 **LOCKED** |
| `S1-M7-FE-03` | ফ্রন্টএন্ড হাই-স্পিড এক্সেল-স্টাইল ২ডি সাইজ-কালার গ্রিড UI | `S1-M7-BE-02` | TanStack 2D Matrix Grid, Live Auto-Sum | সাদিয়া | 🔒 **LOCKED** |
| `S1-M7-QA-04` | পিও বুকিং ও ম্যাট্রিক্স স্ট্রেস টেস্ট ও সাইন-অফ | `S1-M7-FE-03` | Bulk Matrix Concurrency, Split Delivery Audit | ফারহানা | 🔒 **LOCKED** |

---

## পর্ব ৮: টিএন্ডএ ক্যালেন্ডার ও কাঁচামাল বুকিং ব্রিজ (Module 8: T&A & Booking)
> **স্কোপ**: ক্রিটিক্যাল পাথ টাইম অ্যান্ড অ্যাকশন (T&A) ক্যালেন্ডার, ডিলে অ্যালার্ট এবং ইনভেন্টরির জন্য ম্যাটেরিয়াল বুকিং রিকুইজিশন।

| Step ID | Task Description | Depends On | Target / Deliverable | Owner | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `S1-M8-DB-01` | টিএন্ডএ ক্যালেন্ডার ও বুকিং স্কিমা ড্রাফট (V34 Flyway) | `S1-M7-QA-04` | `tna_calendars`, `material_bookings` tables | আরিফুল | 🔒 **LOCKED** |
| `S1-M8-BE-02` | ব্যাকএন্ড টিএন্ডএ ইঞ্জিন, ডিলে অ্যালার্ট ও বুকিং ব্রিজ এপিআই | `S1-M8-DB-01` | `TnaService.java`, Domain 02 Procurement Bridge | আরিফুল | 🔒 **LOCKED** |
| `S1-M8-FE-03` | ফ্রন্টএন্ড টিএন্ডএ গ্যান্ট/ক্যালেন্ডার ও বুকিং রিকুইজিশন শিট UI | `S1-M8-BE-02` | T&A Milestone Grid, Requisition Generator | সাদিয়া | 🔒 **LOCKED** |
| `S1-M8-QA-04` | ডোমেন ০১ পূর্ণাঙ্গ এন্ড-টু-এন্ড ইন্টিগ্রেশন অডিট ও ফাইনাল সাইন-অফ | `S1-M8-FE-03` | Full O2S Flow Audit, Zero-Error Verification | ফারহানা ও তানভীর | 🔒 **LOCKED** |

---

> 🔒 **স্টেপ ট্র্যাকার গভর্নেন্স**:  
> প্রস্তুতকারক: 👩‍💼 নাসরিন সুলতানা (Technical Writer) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)  
> পর্যালোচক: 👨‍💻 আরিফুল ইসলাম (Tech Lead) ও 👩‍💻 সাদিয়া জাহান (Frontend Lead)  
> চূড়ান্ত অনুমোদন ও আনলক গেটকিপার: 👨‍💼 **Product Director / CTO (স্যার)**

