# থিম লেআউট ও মাস্টার শেল আর্কিটেকচার স্পেসিফিকেশন (Theme Layout & Master Shell Architecture)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (Senior Frontend Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)*  
*তারিখ: ১৯ অক্টোবর ২০২৬ | ভার্সন: ১.০ (অফিশিয়াল এন্টারপ্রাইজ স্ট্যান্ডার্ড)*  
*রেফারেন্স: [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Rule 21](file:///g:/ERP-Software/Garments-ERP/.agents/rules/21_component_based_ui_ux_architecture.md) | [ADR-006](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#L67-L86)*

---

## ১. ভূমিকা ও লেআউট দর্শন (Layout Philosophy)

GarmentIQ-ERP-এর লেআউট আর্কিটেকচার আন্তর্জাতিক মানসম্পন্ন এন্টারপ্রাইজ সিস্টেমের (যেমন: Salesforce Lightning ও SAP Fiori) মতো **একক অভিন্ন মাস্টার শেল (Single Unified Shell)** আর্কিটেকচার মেনে চলে। প্রতিটি পেজে ভিন্ন লেআউট তৈরি করার বদলে পুরো প্ল্যাটফর্মে একটি সেন্ট্রাল ফ্রেমওয়ার্ক ব্যবহৃত হয়—যাতে ব্যবহারকারী যেকোনো মডিউলে কাজ করার সময় একই রকম স্বচ্ছ ও স্বাচ্ছন্দ্যময় অভিজ্ঞতা পান।

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. GLOBAL TOP APPLICATION HEADER (Height: 64px / h-16, Sticky z-20, Border-b #E2E8F0)   │
│ [Brand Mini] [Factory Unit Selector]     [Ctrl+K Search]   [Theme] [Alerts] [Avatar]   │
├────────────────────────┬───────────────────────────────────────────────────────────────┤
│ 2. MASTER SIDEBAR      │ 3. MAIN WORKSPACE CANVAS (PageShell)                          │
│ Expanded: 256px (w-64) │ ┌───────────────────────────────────────────────────────────┐ │
│ Collapsed: 80px (w-20) │ │ PageHeader: Breadcrumbs + Title + Sticky Action Toolbar   │ │
│ Fixed z-30, Border-r   │ ├───────────────────────────────────────────────────────────┤ │
│                        │ │ KPI Metric Cards Grid (Auto-fit: 4-Col / 2-Col / 1-Col)   │ │
│ • Active Tab Marker    │ ├───────────────────────────────────────────────────────────┤ │
│ • Group Accordions     │ │ Fluid Master Data Grid Canvas (Virtual Scroll Table)      │ │
│ • Live Badges          │ └───────────────────────────────────────────────────────────┘ │
│ • Release SemVer       │ 4. CONTEXTUAL SLIDE-OVER DRAWER (Right 480px, z-40)           │
└────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## ২. মাস্টার শেল ডিওএম হায়ারার্কি ও রেসপনসিভ কনট্রাক্ট (DOM Hierarchy)

সিস্টেমের রুট লেআউট কম্পোনেন্ট ট্রি নিচের হায়ারার্কি কঠোরভাবে অনুসরণ করবে:

```
<AppLayout> (min-h-screen flex bg-surface-base text-text-primary)
  ├── <aside> (Master Sidebar: fixed w-64 / w-20, shrink-0, z-30)
  │     ├── BrandHeader (h-16, flex items-center, border-b)
  │     ├── NavigationList (flex-1 overflow-y-auto, py-4, px-3)
  │     └── TenantProfileFooter (p-3 border-t, SemVer badge)
  └── <div role="main"> (flex-1 flex flex-col min-w-0)
        ├── <header> (Global Top Header: h-16 sticky top-0, z-20)
        │     ├── UnitSelector (Woven / Denim / Laundry Plant)
        │     ├── GlobalSearchBar (Hotkey: Ctrl + K)
        │     └── ActionGroup (ThemeSwitcher, Notifications, User)
        └── <PageShell> (flex-1 overflow-y-auto p-6 lg:p-8)
              ├── <PageHeader> (Breadcrumbs, Title, Sticky Actions)
              └── <Outlet> (Dynamic Routed Views / Data Grids)
```

---

## ৩. টপ অ্যাপ্লিকেশন হেডার স্পেসিফিকেশন (Top Application Header)

| প্যারামিটার | স্পেসিফিকেশন মান | ইউআই ও প্রযুক্তিগত ভূমিকা |
| :--- | :--- | :--- |
| **উচ্চতা (Height)** | `64px` (`h-16`) | আন্তর্জাতিক এন্টারপ্রাইজ ফিক্সড হেডার স্ট্যান্ডার্ড |
| **পজিশন ও লেয়ার** | `sticky top-0 z-20` | পেজ স্ক্রল করলেও হেডার সর্বদা স্ক্রিনের উপরে লক থাকবে |
| **সারফেস ও বর্ডার** | `bg-surface-card border-b border-border-subtle` | স্লিক হোয়াইট কার্ড লুক ও ১px সাবটেল স্লেট বর্ডার |
| **ফ্যাক্টরি ইউনিট ড্রপডাউন** | `bg-surface-muted border border-border-subtle` | মাল্টি-প্ল্যান্ট (Denim Plant, Woven Unit 1, Laundry) দ্রুত পরিবর্তন |
| **গ্লোবাল সার্চ বার** | শর্টকাট: `Ctrl + K` (Width: 320px) | বায়ার PO, স্টাইল নং, রোল বারকোড বা আরএফআইডি বান্ডিল তাৎক্ষণিক খোঁজা |
| **থিম সুইচার ড্রপডাউন** | পপওভার ডিরেকশন: `bottom-end` (z-40) | ৪টি এন্টারপ্রাইজ থিমের লাইভ ইনস্ট্যান্ট সুইচিং |
| **নোটিফিকেশন সেন্টার** | ব্যাজ: ৮px রেড পালস ডট | রিয়েল-টাইম QC রিজেক্ট ও ক্রিটিক্যাল শিডিউল সতর্কতা |

---

## ৪. মাস্টার কোল্যাপ্সিবল সাইডবার স্পেসিফিকেশন (Collapsible Sidebar)

সাইডবারটি কারখানার কাজের পরিস্থিতি অনুযায়ী দুটি মোডে রূপান্তরিত হবে:

### ৪.১ এক্সপ্যান্ডেড মোড বনাম মিনি মোড (Expanded vs Collapsed)
| স্পেসিফিকেশন আইটেম | ১. ফুল এক্সপ্যান্ডেড মোড (Default) | ২. কমপ্যাক্ট মিনি মোড (Collapsed) |
| :--- | :--- | :--- |
| **উইডথ (Width)** | `256px` (`w-64`) | `80px` (`w-20`) |
| **লোগো ডিসপ্লে** | লোগো আইকন + টেক্সট ব্র্যান্ড ("GARMENTS ERP") | শুধুমাত্র ব্রাইট ব্র্যান্ড আইকন ("R") |
| **ন্যাভিগেশন আইটেম** | আইকন + লেবেল টেক্সট + লাইভ কাউন্ট ব্যাজ | শুধুমাত্র কেন্দ্রীভূত ১৮px আইকন |
| **হোভার আচরণ** | রো হাইলাইট (`bg-white/10 text-white`) | ফ্লোটিং টুলটিপ পপওভার (`Radix Tooltip`, z-50) |
| **ট্রানজিশন গতি** | `transition-all duration-300 ease-in-out` | মসৃণ অ্যানিমেশন, লেআউট জাম্পিং সম্পূর্ণ নিষিদ্ধ |

### ৪.২ সাব-মডিউল গ্রুপিং ও হায়ারার্কি (Domain Module Groups)
1. **Core Workflows**: Dashboard, Merchandising (Styles, Tech-Pack, PO), Sourcing & Fabric Inventory.
2. **Shop Floor Execution**: CAD & Cutting Room, Embellishment (Print/Emb), Sewing Assembly, Denim Laundry Plant.
3. **Logistics & Traceability**: Quality & AQL Audit, Carton RFID Packing, Commercial & Shipping.

---

## ৫. পেজ শেল ও স্টিকি অ্যাকশন টুলবার স্পেসিফিকেশন (`PageShell`)

মার্চেন্ডাইজাররা যখন হাজার হাজার লাইনের ডেটা টেবিল বা বিওএম স্ক্রল করেন, তখন অ্যাকশন বাটন হারিয়ে যাওয়া রোধ করতে স্টিকি টুলবার বাধ্যতামূলক:

```
[PageShell Container: p-6 lg:p-8 space-y-6 max-w-[1920px] mx-auto]
 ├─ Breadcrumbs Trail: Home / Merchandising / Orders / PO-2026-9041
 ├─ Sticky Header Toolbar (sticky top-16 z-10 bg-surface-base/95 backdrop-blur-xs)
 │   ├── Title: "Purchase Order PO-2026-9041" (text-2xl font-bold)
 │   └── Actions: [Export Excel] [Print Tech-Pack] [Primary: Save PO]
 └─ Main Content (KPI Metric Cards + Master TanStack Virtual Table)
```

- **ম্যাক্সিমাম কন্টেইনার উইডথ**: সাধারণ ড্যাশবোর্ডে `max-w-[1920px]` ক্লাম্পড থাকবে, তবে বড় ডেটা টেবিল পেজে সম্পূর্ণ `w-full` ফ্লুইড হবে।
- **স্টিকি অ্যাকশন বার**: পেজ স্ক্রল করলেও অ্যাকশন বাটন গ্রুপ হেডার থেকে `top-16` দূরত্বে ভেসে থাকবে (`z-10`)।

---

## ৬. সেকেন্ডারি লেআউট ওভারলে (Contextual Drawers & Modals)

পেজ না ছেড়ে সহায়ক কাজ দ্রুত সম্পন্ন করার জন্য দুটি লেআউট প্যাটার্ন নির্ধারিত:

| ওভারলে টাইপ | প্রস্থ ও ডাইমেনশন | পজিশন ও লেয়ার | ডোমেন ব্যবহারের ক্ষেত্র |
| :--- | :--- | :--- | :--- |
| **Slide-over Drawer** | `480px` (স্ট্যান্ডার্ড) / `640px` (ওয়াইড) | স্ক্রিনের ডানপাশ (`right-0 h-full z-40`) | টেক-প্যাক মেজারমেন্ট স্পেক ভিউ, ফিল্টার ড্রয়ার, অ্যাক্টিভিটি হিস্ট্রি |
| **Compact Modal** | `440px` (`max-w-md`) | স্ক্রিনের কেন্দ্রে (`z-60`) | ডিলিট কনফার্মেশন, পাসওয়ার্ড চেঞ্জ, দ্রুত স্ট্যাটাস পরিবর্তন |
| **Standard Modal** | `640px` (`max-w-2xl`) | স্ক্রিনের কেন্দ্রে (`z-60`) | নতুন বায়ার যোগ, সাপ্লায়ার এন্ট্রি, মার্কার রেশিও পপআপ |
| **Large Audit Modal** | `960px` (`max-w-5xl`) | স্ক্রিনের কেন্দ্রে (`z-60`) | ৪-পয়েন্ট ফেব্রিক ডিফেক্ট ম্যাপ, শ্রিংকেজ ক্যালকুলেটর |

---

## ৭. শপ ফ্লোর কিয়স্ক ও ডিসপ্লে টার্মিনাল মোড (Kiosk Mode)

কাটিং টেবিল, ফ্লোর সুপারভাইজার মনিটর এবং ডেনিম ওয়াশিং টার্মিনালে মাউস ছাড়াও যাতে কাজ করা যায়:
1. **অটো-হাইড লেআউট**: কিয়স্ক মোড অন করলে টপ হেডার ও সাইডবার স্বয়ংক্রিয়ভাবে সংকুচিত হবে।
2. **ফুল-ভিউ টাচস্ক্রিন**: সমস্ত ইন্টারঅ্যাক্টিভ বাটনের উচ্চতা `48px` (`h-12`) এ উন্নীত হবে।
3. **জিরো ডাবল স্ক্রলবার**: ভিউপোর্টের উচ্চতা `100vh` লক থাকবে এবং ডেটা টেবিল ইন্টারনাল ভার্চুয়াল স্ক্রলিংয়ে চলবে।
