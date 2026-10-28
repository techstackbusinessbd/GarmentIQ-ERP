# থিম লেআউট ও মাস্টার শেল আর্কিটেকচার স্পেসিফিকেশন (Theme Layout & Master Shell Architecture)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (Senior Frontend Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)*  
*তারিখ: ২২ অক্টোবর ২০২৬ | ভার্সন: ২.০ (অফিশিয়াল এন্টারপ্রাইজ স্ট্যান্ডার্ড)*  
*রেফারেন্স: [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 15](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Rule 21](file:///g:/ERP-Software/Garments-ERP/.agents/rules/21_component_based_ui_ux_architecture.md)*

---

## ১. মাস্টার শেল আর্কিটেকচার দর্শন (Unified Master Shell)

GarmentIQ-ERP আন্তর্জাতিক মানসম্পন্ন এন্টারপ্রাইজ আর্কিটেকচার মেনে চলে। প্রতিটি পেজে পৃথক লেআউট তৈরি করার বদলে পুরো প্ল্যাটফর্মে একটি সেন্ট্রাল, অপ্টিমাইজড **একক মাস্টার শেল (Single Unified Shell)** আর্কিটেকচার ব্যবহৃত হয়।

### লেআউট অনুশাসনসমূহ:
1. **একক টপবার (Single Topbar Only):** উচ্চতা ৬৪px (`h-16`), স্টিকি টপ-০, পিওর হোয়াইট সারফেস (`#FFFFFF`)। কোনো দ্বিতীয় সাব-হেডার বা ২য় টপবার সম্পূর্ণ নিষিদ্ধ।
2. **৩-স্তরের মেনু হায়ারার্কি (3-Level Navigation):**
   - **Level 1 (Domain):** সাইডবারের শীর্ষে ডেডিকেটেড ডোমেন পিকার (`SidebarDomainPicker`)।
   - **Level 2 (Module):** আইকনসহ ফোল্ডেবল অ্যাকর্ডিয়ন গ্রুপ (যেমন: Core Setup, Order Lifecycle)।
   - **Level 3 (Menu):** স্বতন্ত্র রুট লিঙ্ক (যেমন: Buyer Directory, PO Master Grid)।
3. **কোল্যাপ্সিবল সাইডবার (Collapsible Sidebar):** এক্সপ্যান্ডেড অবস্থায় ২৪০px (`w-60` / `w-64`), কোল্যাপ্সড অবস্থায় ৬০px (`w-15` / `w-16`)।
4. **ম্যাক্সিমাম ডেটা স্পেস:** টপ প্যাডিং মাত্র ৬৪px (`pt-16`), যা ডেটা টেবিলের জন্য বাড়তি ৪০px স্থান উন্মুক্ত রাখে।
5. **একক সেন্ট্রালাইজড ব্রেডক্রাম্ব (Topbar Only Breadcrumb):** ব্রেডক্রাম্ব নেভিগেশন কেবল গ্লোবাল টপবারে (`AppHeader`) সাইডবার টগল বাটনের পাশে রেন্ডার হবে (`HeaderBreadcrumb`)। পেজ ক্যানভাস বা `PageHeader`-এর ভেতর কোনো ডুপ্লিকেট ব্রেডক্রাম্ব থাকবে না, যা প্রতিটি পেজে গ্রিড ও ফর্মের জন্য ৩০px বাড়তি উল্লম্ব স্থান উন্মুক্ত রাখে।

---

## ২. মাস্টার শেল ডিওএম হায়ারার্কি (DOM Hierarchy)

```
<AppLayout> (min-h-screen flex flex-col bg-surface-base text-text-primary)
  │
  ├── <aside> (Full-Height Sidebar: fixed top-0 bottom-0 left-0 z-30, bg-[var(--sidebar-bg)] border-r)
  │     ├── BrandLogo Header (h-16 / 64px border-b border-[var(--sidebar-border)], inverted logo)
  │     ├── <SidebarDomainPicker> (Level 1: Domain Switcher Popover)
  │     ├── QuickMenuSearch (Real-time keyword filter)
  │     ├── <nav> (Level 2 Module Accordions & Level 3 Menu Links, overflow-y-auto)
  │     └── Footer (System Status & Version Badge)
  │
  ├── <AppHeader> (Top Header: fixed top-0 right-0 z-20 h-16, left-64/left-16, bg-surface border-b)
  │     ├── SidebarCollapseToggle (ChevronLeft / Menu)
  │     ├── BreadcrumbTrail (Domain > Module > Menu)
  │     └── ActionControls (GlobalSearch, Notifications, ThemeNavPopover, UserMenu)
  │
  └── <div role="main"> (Workspace Canvas: pt-16 pl-64/pl-16 min-h-screen transition-all)
        └── <Outlet> (High-Density Grids, Forms, Dashboards)
```

---

## ৩. ডাইমেনশন ও জ্যামিতিক স্ট্যান্ডার্ড (Layout Dimensions)

| এলিমেন্ট | ডাইমেনশন | সিএসএস ক্লাসেস | আচরণ |
| :--- | :--- | :--- | :--- |
| **Sidebar Top-to-Bottom** | `256px / 64px` | `fixed top-0 bottom-0 left-0 z-30 w-64 / w-16` | ১০০vh ফুল-হাইট, ব্র্যান্ড লোগো ও ৩-লেভেল ন্যাভিগেশন |
| **Global Top Header** | `64px` | `fixed top-0 right-0 z-20 h-16 left-64 / left-16` | সাইডবারের ডানপাশে ডকড, ব্রেডক্রাম্ব ও অ্যাকশন কনট্রোল |
| **Brand Logo Header** | `64px` | `h-16 shrink-0 border-b border-[var(--sidebar-border)]` | সাইডবারের শীর্ষে অথরিটেটিভ ব্র্যান্ড অ্যাঙ্কর |
| **Canvas Padding Top** | `64px` | `pt-16` | টপ হেডারের নিচে মসৃণ ট্রানজিশন |
| **Canvas Left Margin** | `256px / 64px` | `pl-64 / pl-16` | সাইডবারের প্রস্থ অনুযায়ী ডাইনামিক অফসেট |
