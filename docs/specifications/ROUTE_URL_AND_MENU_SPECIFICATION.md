# এন্টারপ্রাইজ রাউট, ইউআরএল ও মেনু আর্কিটেকচার স্পেসিফিকেশন
## Enterprise Route, URL & Navigation Menu Specification

*প্রজেক্ট*: **GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)**  
*তত্ত্বাবধায়ক*: 👨‍💼 **তানভীর আহমেদ** (Chief Solutions Architect) ও 👩‍💻 **সাদিয়া জাহান** (Senior Frontend Lead)  
*অডিটর*: 👩‍🔬 **ফারহানা চৌধুরী** (Lead QA & Security Gatekeeper)  
*তারিখ*: ২০ অক্টোবর ২০২৬ | ভার্সন: ১.০ (অফিশিয়াল এন্টারপ্রাইজ স্ট্যান্ডার্ড)  
*রেফারেন্স*: [Rule 04 (UI Copywriting)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/04_ui_copywriting_and_ux.md) | [Rule 19 (Centralized Constants)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/19_centralized_ui_constants_and_zero_inline_data.md) | [Rule 20 (Design Tokens)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [06_THEME_LAYOUT_ARCHITECTURE.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md)

---

## ১. ভূমিকা ও রাউটিং দর্শন (Routing Philosophy & Architectural Principles)

GarmentIQ-ERP একটি আন্তর্জাতিক মানসম্পন্ন ডোমেন-ড্রিভেন মাল্টি-টেন্যান্ট SaaS এন্টারপ্রাইজ প্ল্যাটফর্ম। সিস্টেমের সমস্ত ফ্রন্টএন্ড পেজ, সাইডবার মেনু, ব্রেডক্রাম্ব এবং ব্যাকএন্ড এপিআই-এর মধ্যে ১০০% সংগতি বজায় রাখার জন্য নিচের ৫টি কোর রাউটিং নীতি বাধ্যতামূলক:

1. **Single Unified Route Architecture (`/app/{domain}/{module}/*`)**:
   - 🏭 **Unified Enterprise Scope (`/app/*`)**: লগইনের পর সিস্টেমের সমস্ত রুট একক ইউনিফাইড প্রিফিক্স `/app/{domain}/{module}/*` অনুসরণ করবে (যেমন: `/app/overview/dashboard`, `/app/merchandising/orders`, `/app/cutting/markers`, `/app/admin/users`)।
   - 🚫 **No Standalone Platform Prefix**: স্বতন্ত্র `/platform/*` প্রিফিক্স বাতিল করা হয়েছে। প্ল্যাটফর্ম ও টেন্যান্ট কনফিগারেশন সহ সমস্ত অ্যাডমিন অপারেশনস `/app/admin/*` ডোমেনের অন্তর্ভুক্ত এবং কঠোর RBAC (`ROLE_SUPER_ADMIN`, `ROLE_ADMIN`) দ্বারা সুরক্ষিত। ব্যাকওয়ার্ড কম্প্যাটিবিলিটির জন্য সমস্ত লেগাসি `/platform/*` রুট স্থায়ীভাবে সমতুল্য `/app/*` রুটে রিডাইরেক্ট করা হয়েছে।
2. **RESTful Kebab-Case URLs**: প্রতিটি ইউআরএল ছোট হাতের অক্ষরে এবং হাইফেন-যুক্ত হবে (যেমন: `/app/cutting/markers`, `/app/merchandising/orders`)। কোনো ক্যামেলকেস বা আন্ডারস্কোর ইউআরএল-এ ব্যবহৃত হবে না।
3. **Predictable Bounded Context Hierarchy**: প্রতিটি পাথ তার নিজস্ব বাউন্ডেড ডোমেন অনুসারে গ্রুপকৃত হবে (যেমন: `/app/merchandising/*`, `/app/inventory/*`, `/app/cutting/*`, `/app/admin/*`)।
4. **Strict RBAC Guarding**: প্রতিটি সুরক্ষিত রুটের সাথে নির্দিষ্ট রোল ও পারমিশন ট্যাগ থাকবে। অননুমোদিত প্রবেশ স্বয়ংক্রিয়ভাবে `ProtectedRoute` দ্বারা অবরুদ্ধ হবে।
5. **Deep Linking & Bookmark Support**: ফিল্টার, প্ল্যান্ট ইউনিট ও পেজিনেশন সর্বদা URL Query Parameters (`?unit=PLANT-ASH&status=ACTIVE&page=1`) এ সংরক্ষিত থাকবে—যাতে ইউজার লিংক শেয়ার করলে বা পেজ রিফ্রেশ করলে একই স্টেট বহাল থাকে।

---

## ২. সম্পূর্ণ মাস্টার রাউট ও ইউআরএল ডিরেক্টরি (Complete Master Route Directory)

### ২.১ পাবলিক রুটসমূহ (Public Routes - No Auth Required)

> 🔒 **এন্টারপ্রাইজ সিকিউরিটি পলিসি (Strict Zero-Public-Reset Policy)**:  
> তৈরি পোশাক ও রপ্তানিমুখী এন্টারপ্রাইজ ইআরপিতে ফিশিং, সোশ্যাল ইঞ্জিনিয়ারিং ও বহিরাগত হ্যাকিং রোধে **ইন্টারনেটে উন্মুক্ত কোনো পাবলিক সেলফ-সার্ভিস পাসওয়ার্ড রিসেট পেজ থাকবে না**। পাবলিকভাবে কেবল একক `/login` রুট উন্মুক্ত থাকবে। পাসওয়ার্ড পরিবর্তন ও রিসেট ১০০% অভ্যন্তরীণ ও প্রাইভেট প্রটেক্টেড রুটের মাধ্যমে নিয়ন্ত্রিত হবে।

| Route Path | View Component | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `/` | `RootRedirect` | রুট ল্যান্ডিং পেজ: অথেনটিকেটেড ইউজারকে `/app/overview/dashboard`-এ এবং গেস্টকে `/login`-এ পাঠায় | 🌐 Public |
| `/login` | `LoginPage` | কর্পোরেট স্প্লিট-স্ক্রিন লগইন ও টোকেন প্রদান | 🌐 Public |

---

### ২.২ লেগাসি প্ল্যাটফর্ম ব্যাকওয়ার্ড-কম্প্যাটিবিলিটি রিডাইরেক্টস (Legacy /platform/* Redirects)

> ⚠️ **স্থায়ী রিডাইরেক্ট পলিসি**: সমস্ত পুরাতন `/platform/*` লিংক স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট `/app/*` রুটে রিডাইরেক্ট হবে:

| Legacy Route Path | Redirects To | Description & Target |
| :--- | :--- | :--- |
| `/platform` | `/app/overview/dashboard` | ওভারভিউ ড্যাশবোর্ডে স্থায়ী রিডাইরেক্ট |
| `/platform/dashboard` | `/app/overview/dashboard` | গ্লোবাল ড্যাশবোর্ডে স্থায়ী রিডাইরেক্ট |
| `/platform/tenants` | `/app/admin/settings` | অ্যাডমিন সিস্টেম সেটিংস এ রিডাইরেক্ট |
| `/platform/users` | `/app/admin/users` | অ্যাডমিন ইউজার ম্যানেজমেন্ট এ রিডাইরেক্ট |
| `/platform/settings` | `/app/admin/settings` | অ্যাডমিন সিস্টেম সেটিংস এ রিডাইরেক্ট |

---

### ২.৩ ক্লায়েন্ট ফ্যাক্টরি কোর ওয়ার্কফ্লোজ (Client ERP Core Workflows - `/app/*`)

| Route Path | Menu Label | Lucide Icon | Description & Scope | Required RBAC Role / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/app/dashboard` | Dashboard Overview | `LayoutDashboard` | ফ্যাক্টরি ১০০% উইজেট ড্যাশবোর্ড, ও২এস পাইপলাইন, কেপিআই মেট্রিক্স | `AUTHENTICATED_USER` |
| `/app/merchandising` | Merchandising & Orders | `Shirt` | মার্চেন্ডাইজিং রুট সামারি ও বায়ার রিলেশনশিপ | `ROLE_MERCHANDISER`, `ROLE_ADMIN` |
| `/app/merchandising/orders` | Buyer Orders (PO) | `Shirt` | বায়ার পারচেজ অর্ডার বুকিং ও সাইজ-কালার ম্যাট্রিক্স | `ORDER:READ`, `ORDER:WRITE` |
| `/app/merchandising/orders/:id` | Order Detail (PO) | `Shirt` | নির্দিষ্ট পিও-র সম্পূর্ণ ও২এস ট্র্যাক ও বিওএম কস্টিং | `ORDER:READ` |
| `/app/merchandising/styles` | Styles & Tech-Packs | `Shirt` | স্টাইল মাস্টার, স্পেক শিট ও মেজারমেন্ট গ্রেডিং | `ORDER:READ`, `ORDER:WRITE` |
| `/app/merchandising/styles/:id` | Style Detail | `Shirt` | নির্দিষ্ট স্টাইলের মেজারমেন্ট চার্ট ও কনসাম্পশন | `ORDER:READ` |
| `/app/merchandising/costing` | BOM & Costing | `Shirt` | সুতা, ফেব্রিক, ট্রিমস ও মেকিং কস্ট (CM) বাজেট | `ORDER:WRITE`, `ROLE_ADMIN` |
| `/app/inventory` | Fabric Warehouse | `Layers` | ফেব্রিক ও ইয়ার্ন ইনভেন্টরি ড্যাশবোর্ড | `ROLE_CUTTING_MANAGER`, `ROLE_ADMIN` |
| `/app/inventory/rolls` | Roll Stock & Barcode | `Layers` | ফেব্রিক রোল রিসিভ, বারকোড ট্র্যাকিং ও লোকেশন | `INVENTORY:READ`, `INVENTORY:WRITE` |
| `/app/inventory/qc` | 4-Point Fabric QC | `Layers` | ৪-পয়েন্ট সিস্টেম রোল ইন্সপেকশন ও পেনাল্টি ক্যালকুলেশন | `QA:FABRIC_INSPECT` |

---

### ২.৪ ক্লায়েন্ট শপ ফ্লোর এক্সিকিউশন (Shop Floor Execution - `/app/*`)

| Route Path | Menu Label | Lucide Icon | Description & Scope | Required RBAC Role / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/app/cad-cutting` | CAD & Cutting Room | `Scissors` | মার্কার এফিসিয়েন্সি ও ফেব্রিক কাট প্ল্যানিং | `ROLE_CUTTING_MANAGER` |
| `/app/cad-cutting/markers` | Marker Planning | `Scissors` | শ্রিংকেজ রেশিও ভিত্তিক মার্কার লে-প্ল্যান | `CUTTING:EXECUTE` |
| `/app/cad-cutting/lay-orders` | Cutting Lay Orders | `Scissors` | টেবিল কাটিং স্প্রেডিং, প্লাই কাউন্ট ও বান্ডিল জেনারেশন | `CUTTING:EXECUTE` |
| `/app/cad-cutting/bundles` | Cut Bundles & QR | `Scissors` | বান্ডিল কিউআর ও আরএফআইডি ট্যাগ অ্যাসাইনমেন্ট | `CUTTING:EXECUTE` |
| `/app/embellishment` | Screen Print & Emb | `Palette` | কাট-প্যানেল প্রিন্টিং ও হাই-ডেনসিটি এমব্রয়ডারি | `ROLE_ADMIN`, `PRODUCTION:WRITE` |
| `/app/embellishment/chalan` | Chalan & Dispatch | `Palette` | প্রিন্ট/এমব্রয়ডারি চালান ইস্যু ও রিসিভ ট্র্যাকার | `PRODUCTION:WRITE` |
| `/app/sewing` | Sewing Floor & RFID | `Activity` | রিয়েল-টাইম লাইন ব্যালেন্সিং ও বান্ডিল প্রগ্রেস | `ROLE_SEWING_SUPERVISOR` |
| `/app/sewing/lines` | Line Output & Target | `Activity` | ঘণ্টাভিত্তিক লাইন আউটপুট ও এসএমভি এফিসিয়েন্সি | `SEWING:READ`, `SEWING:WRITE` |
| `/app/sewing/bundles` | Live Bundle Scan | `Activity` | সুইং অপারেটর বান্ডিল স্ক্যান ও প্রগ্রেস চেক | `SEWING:EXECUTE` |
| `/app/washing` | Denim Laundry Plant | `Waves` | ডেনিম ওয়াশ রেসিপি, ড্রাই ও ওয়েট প্রসেস | `ROLE_FINISHING_MANAGER` |
| `/app/washing/recipes` | Wash Recipes | `Waves` | এনজাইম স্টোন, ওজোন, রেজিন ও ব্লিচ রেসিপি | `WASHING:WRITE` |
| `/app/washing/batches` | Active Wash Batches | `Waves` | ড্রাম লোড ট্র্যাকিং, তাপমাত্রা ও লিকার রেশিও | `WASHING:EXECUTE` |

---

### ২.৫ ক্লায়েন্ট লজিস্টিকস, কিউসি ও শিপমেন্ট (Logistics, QC & Traceability - `/app/*`)

| Route Path | Menu Label | Lucide Icon | Description & Scope | Required RBAC Role / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/app/quality` | Quality & AQL Audit | `CheckCircle2` | সুইং ইন-লাইন, এন্ড-লাইন ও ফাইনাল AQL ২.৫ অডিট | `ROLE_QA_INSPECTOR` |
| `/app/quality/inline` | Inline & Endline QC | `CheckCircle2` | সুইং ডিফেক্ট ম্যাপিং ও ট্রাফিক লাইট সিস্টেম | `QA:INLINE_AUDIT` |
| `/app/quality/aql-audit` | Final AQL Audit | `CheckCircle2` | কার্টনিং পূর্ববর্তী বায়ার স্পেসিফিকেশন AQL অডিট | `QA:FINAL_AUDIT` |
| `/app/packing` | Carton RFID Packing | `PackageCheck` | ফিনিশিং প্রেস, মেটাল ডিটেক্টর ও আরএফআইডি কার্টনিং | `ROLE_FINISHING_MANAGER` |
| `/app/packing/cartons` | Master Cartons | `PackageCheck` | অ্যাসোর্টেড/সলিড সাইজ-কালার কার্টন স্ক্যান | `PACKING:EXECUTE` |
| `/app/packing/gate-pass` | RFID Gate Pass | `PackageCheck` | ডিসপ্যাচ টানেল অটো-ভেরিফিকেশন ও ই-গেট পাস | `PACKING:VERIFY` |
| `/app/commercial` | Commercial & Shipments| `Ship` | এক্সপোর্ট ইনভয়েস, প্যাকিং লিস্ট ও কন্টেইনার ডিসপ্যাচ | `ROLE_COMMERCIAL_OFFICER` |
| `/app/commercial/invoices` | Export Invoices | `Ship` | বায়ার কমার্শিয়াল ইনভয়েস ও এইচএস কোড ডেটা | `COMMERCIAL:WRITE` |
| `/app/commercial/shipments` | Container Dispatch | `Ship` | ফরোয়ার্ডার হ্যান্ডওভার ও বিল অফ লেডিং (BL) ট্র্যাকিং | `COMMERCIAL:EXECUTE` |

---

### ২.৬ ক্লায়েন্ট সিস্টেম প্রশাসন (Factory System Administration - `/app/admin/*`)

| Route Path | Menu Label | Lucide Icon | Description & Scope | Required RBAC Role / Permission |
| :--- | :--- | :--- | :--- | :--- |
| `/app/admin/profile` | My Profile & Preferences | `User` | ব্যক্তিগত প্রোফাইল, কর্পোরেট রোল ও সম্পূর্ণ থিম কাস্টমাইজেশন কেন্দ্র | `AUTHENTICATED_USER` |
| `/app/admin/users` | User Management | `Users` | কারখানা কর্মী একাউন্টস, প্রোফাইল, পদবী ও লাইফসাইকেল স্ট্যাটাস | `USER:MANAGE`, `ROLE_ADMIN` |
| `/app/admin/privileges` | Privilege & Roles | `ShieldCheck` | এন্টারপ্রাইজ সিস্টেম রোলস, পারমিশন ম্যাট্রিক্স ও অ্যাক্সেস কন্ট্রোল | `ROLE:MANAGE`, `ROLE_ADMIN` |
| `/app/admin/settings` | System Settings | `Settings` | অটো-কোড টেম্পলেটস (রুল ২৪), কারেন্সি এক্সচেঞ্জ ও শিফট ক্যালেন্ডার | `SETTINGS:CONFIG`, `ROLE_ADMIN` |
| `/app/admin/library` | Master Library | `Library` | ইউওএম, সাইজ গ্রিড, কালার, ফেব্রিক কনস্ট্রাকশন ও ডিফেক্ট লাইব্রেরি | `LIBRARY:READ`, `ROLE_ADMIN` |

---

### ২.৭ শপ ফ্লোর কিয়স্ক টার্মিনাল রুটসমূহ (Shop Floor Kiosk Touchscreens)

মাউস ছাড়া শুধুমাত্র টাচস্ক্রিন ও ফিক্সড বারকোড/RFID স্ক্যানার দিয়ে অপারেট করার জন্য ডেডিকেটেড টার্মিনাল মোড:

| Kiosk Route Path | Terminal Type | Target Location | Description |
| :--- | :--- | :--- | :--- |
| `/kiosk/cutting-table` | Spreading Kiosk | কাটিং টেবিল ০১-০৪ | প্লাই কাউন্ট ও বান্ডিল প্রিন্টিং টার্মিনাল |
| `/kiosk/sewing-line/:lineId` | Line Dashboard | সুইং লাইন মনিটর | ঘণ্টার টার্গেট বনাম অর্জন ও ডিফেক্ট অ্যালার্ট |
| `/kiosk/washing-drum/:drumId` | Laundry Terminal | ওয়াশিং প্ল্যান্ট ড্রাম | কেমিক্যাল রেসিপি ও সময় কাউন্টডাউন টাইমার |
| `/kiosk/rfid-gate/:gateId` | RFID Gate Monitor | টানেল গেট ০১-০৪ | স্বয়ংক্রিয় বান্ডিল/কার্টন ট্যাগ লাইভ স্ক্যানার |

---

## ৩. মাস্টার সাইডবার মেনু ট্যাক্সোনমি (Sidebar Menu Hierarchy)

সিস্টেমের মাস্টার সাইডবার ৪টি প্রধান ক্যাটাগরিতে বিভক্ত:

```
[Master Sidebar Navigation]
  ├── Core Workflows
  │     ├── 📊 Overview & Analytics (/)
  │     ├── 👕 Merchandising & Orders (/app/merchandising)
  │     │     ├── Buyer Orders (PO) (/app/merchandising/orders)
  │     │     ├── Styles & Tech-Packs (/app/merchandising/styles)
  │     │     └── BOM & Costing (/app/merchandising/costing)
  │     └── 🧵 Fabric & Yarn Warehouse (/app/inventory)
  │           ├── Roll Inventory & Stock (/app/inventory/rolls)
  │           └── 4-Point Fabric QC (/app/inventory/qc)
  │
  ├── Shop Floor Execution
  │     ├── ✂️ CAD & Cutting Room (/app/cad-cutting)
  │     │     ├── Marker Planning (/app/cad-cutting/markers)
  │     │     ├── Cutting Lay Orders (/app/cad-cutting/lay-orders)
  │     │     └── Cut Bundles & QR (/app/cad-cutting/bundles)
  │     ├── 🎨 Screen Print & Emb (/app/embellishment)
  │     │     └── Chalan & Dispatch (/app/embellishment/chalan)
  │     ├── 📈 Sewing Floor & RFID (/app/sewing)
  │     │     ├── Line Output & Target (/app/sewing/lines)
  │     │     └── Live Bundle Scan (/app/sewing/bundles)
  │     └── 🌊 Denim Laundry Plant (/app/washing)
  │           ├── Wash Recipes (/app/washing/recipes)
  │           └── Active Wash Batches (/app/washing/batches)
  │
  ├── Logistics & Traceability
  │     ├── ✅ Quality & AQL Audit (/app/quality)
  │     │     ├── Inline & Endline QC (/app/quality/inline)
  │     │     └── Final AQL Audit (/app/quality/aql-audit)
  │     ├── 📦 Carton RFID Packing (/app/packing)
  │     │     ├── Master Cartons (/app/packing/cartons)
  │     │     └── RFID Gate Pass (/app/packing/gate-pass)
  │     └── 🚢 Commercial & Shipments (/app/commercial)
  │           ├── Export Invoices (/app/commercial/invoices)
  │           └── Container Dispatch (/app/commercial/shipments)
  │
  └── System Administration
        ├── 👥 User Management (/app/admin/users)
        ├── 🛡️ Privilege & Roles (/app/admin/privileges)
        ├── ⚙️ System Settings (/app/admin/settings)
        └── 📚 Master Library (/app/admin/library)
```

---

## ৪. ডাইনামিক ইউআরএল প্যারামিটার ও কুয়েরি চুক্তি (URL Query Parameters Standard)

সমস্ত ডেটা গ্রিড ও টেবিল ভিউতে ফিল্টারিং ও পেজিনেশনের ক্ষেত্রে নিচের প্রমিত কুয়েরি স্ট্রিং ফরম্যাট ব্যবহৃত হবে:

```
[BASE_URL]/[RESOURCE]?[STANDARD_PARAMS]
```

### প্রমিত কুয়েরি প্যারামিটারসমূহ:

| Query Parameter | ডেটা টাইপ | ডিফল্ট মান | ডোমেন ভূমিকা ও উদাহরণ |
| :--- | :---: | :---: | :--- |
| `unit` | `string` | `PLANT-ASH` | সক্রিয় ফ্যাক্টরি ইউনিট (`PLANT-ASH`, `PLANT-GAZ`, `PLANT-NKN`) |
| `status` | `string` | `ALL` | স্ট্যাটাস ফিল্টার (`ACTIVE`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`) |
| `search` | `string` | `""` | বায়ার নাম, পিও নম্বর, স্টাইল কোড বা বারকোড দিয়ে লাইভ সার্চ |
| `page` | `number` | `1` | বর্তমান পেজ নম্বর (১-ইনডেক্সড) |
| `pageSize` | `number` | `25` | প্রতি পেজে দৃশ্যমান রেকর্ড সংখ্যা (`10`, `25`, `50`, `100`) |
| `sort` | `string` | `createdAt` | সাজানোর ফিল্ড নাম |
| `order` | `enum` | `desc` | সাজানোর ক্রম (`asc` বা `desc`) |

*বাস্তব উদাহরণ*:
```
https://erp.garmentiq.com/merchandising/orders?unit=PLANT-ASH&status=CONFIRMED&search=Wrangler&page=1&pageSize=50&sort=deliveryDate&order=asc
```

---

## ৫. ব্রেডক্রাম্ব ট্রেইল হায়ারার্কি চুক্তি (Breadcrumbs Hierarchy)

মার্চেন্ডাইজার ও অপারেশনাল টিম যাতে যেকোনো সময় বুঝতে পারেন তারা সিস্টেমের কোন স্তরে আছেন:

```
Level 1 (Root)     : Home
Level 2 (Domain)   : Merchandising
Level 3 (Entity)   : Buyer Orders (PO)
Level 4 (Record)   : PO-2026-9041 (Wrangler Slim Fit)
Level 5 (Tab/View) : BOM & Fabric Consumption
```

ইউআইতে প্রদর্শিত রূপ:
`Home` / `Merchandising` / `Buyer Orders` / `PO-2026-9041` / **BOM & Consumption**

---

## ৬. আরবিএসি ৯-রোল ইউআরএল অথরাইজেশন ম্যাট্রিক্স (RBAC URL Matrix)

| রোল কোড | ড্যাশবোর্ড (`/`) | মার্চেন্ডাইজিং (`/merchandising/*`) | কাটিং ও ফেব্রিক (`/cad-cutting/*`) | সুইং ফ্লোর (`/sewing/*`) | ওয়াশিং প্ল্যান্ট (`/washing/*`) | কোয়ালিটি অডিট (`/quality/*`) | কার্টনিং ও কমার্শিয়াল (`/packing/*`, `/commercial/*`) | সিস্টেম সেটিংস (`/settings/*`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `ROLE_SUPER_ADMIN` | 🟢 Read/Write | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access |
| `ROLE_ADMIN` | 🟢 Read/Write | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access |
| `ROLE_MERCHANDISER` | 🟢 Read | 🟢 Full Access | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | ⛔ Restricted |
| `ROLE_CUTTING_MANAGER`| 🟢 Read | 🟡 Read Only | 🟢 Full Access | 🟡 Read Only | ⛔ Restricted | 🟡 Read Only | ⛔ Restricted | ⛔ Restricted |
| `ROLE_SEWING_SUPERVISOR`| 🟢 Read | ⛔ Restricted | 🟡 Read Only | 🟢 Full Access | ⛔ Restricted | 🟡 Read Only | ⛔ Restricted | ⛔ Restricted |
| `ROLE_QA_INSPECTOR` | 🟢 Read | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟢 Full Access | 🟡 Read Only | ⛔ Restricted |
| `ROLE_FINISHING_MANAGER`| 🟢 Read | ⛔ Restricted | ⛔ Restricted | 🟡 Read Only | 🟢 Full Access | 🟡 Read Only | 🟢 Full Access | ⛔ Restricted |
| `ROLE_COMMERCIAL_OFFICER`| 🟢 Read| 🟡 Read Only | ⛔ Restricted | ⛔ Restricted | ⛔ Restricted | ⛔ Restricted | 🟢 Full Access | ⛔ Restricted |
| `ROLE_EXECUTIVE_VIEWER` | 🟢 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only | ⛔ Restricted |

---

## ৭. সিকিউরিটি গার্ড ও রিডাইরেক্ট রুলস (Security & Redirect Protocol)

1. **অননুমোদিত ভিজিটর**: টোকেন ছাড়া যেকোনো সংরক্ষিত পাথে ঢুকতে গেলে স্বয়ংক্রিয়ভাবে `/login` পেজে রিডাইরেক্ট হবে এবং অরিজিনাল ইউআরএল `location.state.from` এ সংরক্ষিত থাকবে। সফল লগইনের পর ইউজার আবার তার উদ্দিষ্ট পেজে ফিরে যাবেন।
2. **রোল অপ্রতুলতা (HTTP 403)**: ইউজারের লগইন সেশন বৈধ কিন্তু নির্দিষ্ট রুটের রোল নেই—এমন ক্ষেত্রে কাস্টম `Access Restricted` ভিউ প্রদর্শিত হবে (কোনো ব্ল্যাঙ্ক স্ক্রিন বা বিভ্রান্তিকর এরর দেওয়া যাবে না)।
3. **ভুল ইউআরএল (HTTP 404)**: কোনো ভুল বা মুছে ফেলা রুটে হিট করলে ক্যাচ-অল রুল স্বয়ংক্রিয়ভাবে নিরাপদ রুট `/` (Dashboard) এ রিডাইরেক্ট করবে।
