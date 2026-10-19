# গার্মেন্টস ইআরপি - কোডিং স্ট্যান্ডার্ড, ফোল্ডার কাঠামো ও নেমিং কনভেনশন (Master Code Standards)

*প্রজেক্ট: RMG Woven, Denim & Non-Denim Enterprise ERP + Traceability + RFID Platform*  
*তত্ত্বাবধায়ক: 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect) ও 👨‍💻 আরিফুল ইসলাম (Tech Lead)*  
*তারিখ: ১৯ অক্টোবর ২০২৬*  

---

## 🎯 ১. নেমিং কনভেনশন (Global Naming Standards)

### ক. ব্যাকএন্ড (Java 21 / Spring Boot 3.3+):
| আইটেম | কনভেনশন | উদাহরণ | নিয়ম ও কারণ |
| :--- | :---: | :--- | :--- |
| **প্যাকেজ (Packages)** | `lowercase` | `com.garments.erp.modules.merchandising.service` | কোনো ক্যাপিটাল লেটার বা আন্ডারস্কোর থাকবে না। |
| **ক্লাস / ইন্টারফেস** | `PascalCase` | `BuyerOrderService`, `StyleMasterRepository`, `AuditableBaseEntity` | অর্থপূর্ণ ডোমেন নাউন। কোনো সংক্ষেপিত রোবোটিক নাম নিষিদ্ধ। |
| **মেথড ও ভ্যারিয়েবল** | `camelCase` | `calculateShrinkageRatio()`, `markerEfficiency`, `tenantId` | ক্রিয়াবাচক মেথড নাম (Verbs), বিশেষ্যবাচক ভ্যারিয়েবল। |
| **কনস্ট্যান্ট ও এনাম** | `UPPER_SNAKE` | `ORDER_CONFIRMED`, `AQL_MAJOR_DEFECT`, `UHF_GEN2_SGTIN96` | স্পষ্ট ক্যাপিটাল লেটার। |
| **ডিটিও রেকর্ডস** | `PascalCase` | `CreateStyleRequest`, `StyleSummaryResponse` | জাভা ২১ `record` ভিত্তিক ইমিউটেবল ক্লাস। |
| **এক্সেপশন ক্লাস** | `PascalCase` | `ResourceNotFoundException`, `BusinessException` | শেষে বাধ্যতামূলক `Exception` অনুসর্গ থাকবে। |

### খ. ডেটাবেজ (PostgreSQL 16 / 17):
| আইটেম | কনভেনশন | উদাহরণ | নিয়ম ও কারণ |
| :--- | :---: | :--- | :--- |
| **টেবিল নাম** | `snake_case` (বহুবচন) | `buyer_orders`, `style_masters`, `fabric_rolls`, `wash_recipes` | সবসময় বহুবচনে এবং ছোট হাতের অক্ষরে আন্ডারস্কোর সহ। |
| **কলাম নাম** | `snake_case` | `tenant_id`, `factory_unit_id`, `marker_efficiency`, `created_at` | কোনো ক্যাপিটাল লেটার নেই; স্ট্যান্ডার্ড এসকিউএল। |
| **প্রাইমারি কি** | `snake_case` | `id` (UUIDv7) | প্রতিটি টেবিলে প্রাইমারি কি কলামের নাম হবে `id`; বাধ্যতামূলক RFC 9562 UUIDv7 (টাইম-অর্ডারড)। সাধারণ আইডি বা UUIDv4 সম্পূর্ণ নিষিদ্ধ। |
| **ফরেন কি** | `snake_case` | `buyer_order_id`, `style_master_id` | মূল টেবিলের একবচন নাম + `_id`। |
| **ইনডেক্স নাম** | `snake_case` | `idx_orders_tenant_status`, `idx_rolls_barcode` | `idx_` প্রিফিক্স দিয়ে টেবিল ও ফিল্ড নাম। |

### গ. ফ্রন্টএন্ড (React 19 / Vite 6 / Tailwind v4):
| আইটেম | কনভেনশন | উদাহরণ | নিয়ম ও কারণ |
| :--- | :---: | :--- | :--- |
| **ফিচার ফোল্ডার** | `kebab-case` | `src/features/merchandising/`, `src/features/washing/` | ডোমেন অনুযায়ী সুনির্দিষ্ট ফোল্ডার। |
| **কম্পোনেন্ট ফাইল** | `PascalCase.jsx`| `OrderTableGrid.jsx`, `WashRecipeCard.jsx`, `AppLayout.jsx` | রিঅ্যাক্ট কম্পোনেন্ট সবসময় বড় হাতের অক্ষরে শুরু হবে। |
| **কাস্টম হুক্স** | `camelCase.js` | `useBuyerOrders.js`, `useRfidScanner.js`, `useDebounce.js` | শুরুতে বাধ্যতামূলক `use` প্রিফিক্স থাকবে। |
| **সেন্ট্রাল কনস্ট্যান্ট**| `camelCase.js` | `orderConstants.js`, `washingConstants.js` (রুল ১৯) | কোনো ইনলাইন স্ট্যাটিক ডেটা থাকবে না; সব কনস্ট্যান্টে। |
| **ডিজাইন টোকেন** | `kebab-case` | `--color-denim-600`, `--spacing-density-compact` (রুল ২০) | `src/index.css`-এর `@theme` ডিরেক্টিভে সেন্ট্রাল টোকেন। |
| **সার্ভিস / এপিআই** | `camelCase.js` | `apiClient.js`, `merchandisingApi.js` | সেন্ট্রালাইজড এপিআই হ্যান্ডলার। |

---

## 🏛️ ২. মাস্টার ডিরেক্টরি কাঠামো (Master Directory Tree)

```
Garments-ERP/
├── .agents/                                # ভার্চুয়াল টিমের কোর অপারেটিং রুলস (০-২০)
│   └── rules/                              # অনুমোদন গেট, টোকেনস, কনস্ট্যান্টস, কোডিং স্ট্যান্ডার্ড
│
├── docs/                                   # সেন্ট্রাল ডকুমেন্টেশন পোর্টাল ও প্রজেক্ট মেমোরি
│   ├── README.md                           # সেন্ট্রাল ডকুমেন্টেশন ইনডেক্স
│   ├── specifications/                     # মিশন, ভিশন, টেক স্ট্যাক, কস্টিং, ট্র্যাকিং স্পেক্স
│   ├── architecture/                       # সিস্টেম আর্কিটেকচার ও ডেটাবেজ ডিজাইন
│   ├── requirements/                       # সফটওয়্যার রিকোয়ারমেন্টস (SRS, BRD, SOP)
│   ├── management/                         # লাইভ মাইক্রো-স্টেপ ট্র্যাকার (STEP_TRACKER.md)
│   └── decisions/                          # আর্কিটেকচারাল ডিসিশন রেকর্ড (ADR-001 থেকে ADR-004)
│
├── docker/                                 # ডকার-ফার্স্ট কন্টেইনারাইজেশন
│   ├── docker-compose.yml                  # PostgreSQL, Backend, Frontend, pgAdmin
│   ├── Dockerfile.backend                  # জাভা ২১ মাল্টি-স্টেজ ডকার বিল্ড
│   └── Dockerfile.frontend                 # রিঅ্যাক্ট ও Nginx প্রডাকশন ইমেজ
│
├── backend/                                # জাভা ২১ ও স্প্রিং বুট ৩.৩+ (Modular Monolith DDD)
│   ├── pom.xml                             # ম্যাভেন বিল্ড কনফিগারেশন
│   └── src/main/java/com/garments/erp/
│       ├── ErpApplication.java             # মূল অ্যাপ্লিকেশন এন্ট্রি পয়েন্ট
│       ├── core/                           # গ্লোবাল ফ্রেমওয়ার্ক (Entity, Response, Exception, Security)
│       └── modules/                        # ১০টি বাউন্ডেড কনটেক্সট (Merchandising, Sewing, Washing...)
│
├── frontend/                               # রিঅ্যাক্ট ১৯ + টেইলউইন্ড সিএসএস v4 (Page-Driven Architecture)
│   ├── package.json                        # ফ্রন্টএন্ড লাইব্রেরি কনফিগ
│   ├── vite.config.js                      # Vite ৬ সুপারফাস্ট বিল্ডার
│   └── src/
│       ├── main.jsx                        # DOM মাউন্ট
│       ├── index.css                       # সেন্ট্রালাইজড ডিজাইন টোকেনস (@theme, রুল ২০)
│       ├── constants/                      # সেন্ট্রালাইজড ইউআই কনস্ট্যান্টস (রুল ১৯)
│       ├── components/ui/                  # প্রিমিয়াম ডিজাইন সিস্টেম কম্পোনেন্টস (Modal, Grid, Badge)
│       ├── features/                       # ডোমেন ভিত্তিক মডিউল (যেমন: merchandising)
│       │   └── <feature_name>/
│       │       ├── pages/                  # ডেডিকেটেড রুটেড পেজ (OrderListPage, OrderCreatePage, DetailsPage)
│       │       ├── components/             # মডিউলের রি-ইউজেবল কম্পোনেন্টস ও হাই-ডেনসিটি টেবিল
│       │       ├── modals/                 # ছোট ও সরল সিআরইউডি মডালস (QuickAddBuyerModal, AddColorModal)
│       │       ├── hooks/                  # মডিউল নির্দিষ্ট ডেটা ফেচিং হুকস
│       │       └── api/                    # মডিউলের ব্যাকএন্ড এপিআই ক্লায়েন্ট মেথডস
│       └── services/apiClient.js           # সেন্ট্রাল এপিআই ইন্টারসেপ্টর
│
└── scripts/                                # সিড ও পার্জ স্ক্রিপ্ট
    ├── seed-garments-master-data.sql       # মাস্টার সিড ডেটা
    └── purge-demo-data.sql                 # ১-ক্লিক পার্জ মেকানিজম (রুল ১৩)
```

---

## 🔒 ৩. কোড কোয়ালিটি ও গোল্ডেন স্ট্যান্ডার্ডস (Code Quality Checklist)

1. **ফাইল সাইজের গোল্ডেন রুল ([রুল ০৭](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md))**: কোনো সোর্স কোড ফাইল **৩০০ লাইনের বেশি হবে না**।
2. **পেজ-ড্রিভেন আর্কিটেকচার বনাম মাইক্রো-মডাল পলিসি ([ADR-005](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#সিদ্ধান্ত-০০৫-পেজ-ড্রিভেন-ন্যাভিগেশন-ও-কনটেক্সচুয়াল-মাইক্রো-মডাল-পলিসি-page-driven-architecture))**:
   - কোনো গাদাগাদি এসপিএ (SPA) ভিউ হবে না; মূল ও জটিল ওয়ার্কফ্লোর জন্য **ডেডিকেটেড রুটেড পেজ** থাকবে (যাতে ব্রাউজার হিস্ট্রি, মাল্টি-ট্যাব বুকমার্কিং ও গভীর লিংকিং স্বাচ্ছন্দ্যে কাজ করে)।
   - শুধুমাত্র ছোট ও দ্রুত সেকেন্ডারি কাজের জন্য (যেমন: বায়ার যোগ, কালার কোড যোগ, কনফার্মেশন) **কনটেক্সচুয়াল মাইক্রো-মডাল** ব্যবহৃত হবে।
3. **বাংলা ও ইংরেজি দ্বিভাষিক কমেন্ট ([রুল ১৫](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md))**: প্রতিটি ক্লাস, মেথড ও কনফিগারেশনে `[EN]` ও `[BN]` পূর্ণাঙ্গ কমেন্ট থাকতে হবে।
4. **টাকা ও কাপড়ের নির্ভুলতা ([রুল ০১](file:///g:/ERP-Software/Garments-ERP/.agents/rules/01_backend_standards_java.md))**: কোনো ফ্লোটিং পয়েন্ট (`float`/`double`) নিষিদ্ধ; সবসময় **`BigDecimal`** ব্যবহার হবে।
5. **জিরো হার্ডকোড ও ইনলাইন নিষিদ্ধ ([রুল ১৯](file:///g:/ERP-Software/Garments-ERP/.agents/rules/19_centralized_ui_constants_and_zero_inline_data.md) ও [২০](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md))**: রিঅ্যাক্ট ফাইলে কোনো ইনলাইন স্টাইল (`style={{}}`) বা ইনলাইন স্ট্যাটিক ডেটা সম্পূর্ণ নিষিদ্ধ।
6. **মানবিক ইংরেজি ও জিরো এআই ফুটপ্রিন্ট ([রুল ০৪](file:///g:/ERP-Software/Garments-ERP/.agents/rules/04_ui_copywriting_and_ux.md) ও [১৬](file:///g:/ERP-Software/Garments-ERP/.agents/rules/16_human_engineering_craftsmanship_zero_ai_vibe.md))**: কোনো রোবোটিক স্ট্যাকট্রেস দেখানো যাবে না; সহজ মানবিক ইংরেজি ও বাস্তব টেক্সটাইল টার্মিনোলজি থাকবে।
7. **১০০% অভিন্ন গ্লোবাল ডিজাইন সিস্টেম ও মাস্টার লেআউট ([ADR-006](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#সিদ্ধান্ত-০০৬-১০০-অভিন্ন-গ্লোবাল-ডিজাইন-সিস্টেম-ও-মাস্টার-লেআউট-আর্কিটেকচার-unified-design-system) ও [রুল ২০](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md))**: ভিন্ন পেজে ভিন্ন ডিজাইন, কালার, স্পেসিং বা লেআউট ব্যবহার সম্পূর্ণ নিষিদ্ধ। পুরো ইআরপির প্রতিটি পেজ একই সাইডবার (`AppLayout`), একই পেজ হেডার (`PageHeader`), একই কার্ড বর্ডার/রেডিয়াস, একই টেবিল গ্রিড (`DataTable`) এবং সেন্ট্রাল কালার টোকেন মেনে চলবে।
8. **স্যারের পূর্বানুমোদন ছাড়া কোডিং সম্পূর্ণ নিষিদ্ধ ([রুল ১১](file:///g:/ERP-Software/Garments-ERP/.agents/rules/11_mandatory_user_approval_gate.md))**: বসের প্রত্যক্ষ নির্দেশ ছাড়া কোডিং শুরু করা যাবে না।


