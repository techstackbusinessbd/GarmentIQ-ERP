# স্ক্রিন কালার রেশিও ও কম্পোনেন্ট কালার ম্যাপিং স্পেসিফিকেশন (Screen Color Ratio & Component Color Mapping)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (Senior Frontend Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)*  
*তারিখ: ২২ অক্টোবর ২০২৬ | ভার্সন: ২.০ (অফিশিয়াল এন্টারপ্রাইজ স্ট্যান্ডার্ড)*  
*রেফারেন্স: [Rule 04](file:///g:/ERP-Software/Garments-ERP/.agents/rules/04_ui_copywriting_and_ux.md) | [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Master Theme Spec](file:///g:/ERP-Software/Garments-ERP/docs/specifications/ENTERPRISE_THEME_DESIGN_SYSTEM.md)*

---

## ১. ভূমিকা ও চোখের স্বাচ্ছন্দ্য অনুপাত (Ergonomics & Eye-Comfort Ratio)

তৈরি পোশাক শিল্পের মার্চেন্ডাইজার, প্ল্যানিং অফিসার, কাটিং সুপারভাইজার ও একাউন্টস টিম একটানা দীর্ঘ শিফটে কাজ করেন। চোখে অতিরিক্ত চাপ না ফেলে উচ্চ ডেটা ঘনত্ব পরিচালনার জন্য GarmentIQ আন্তর্জাতিক এন্টারপ্রাইজ কালার রেশিও কঠোরভাবে অনুসরণ করে।

```
┌────────────────────────────────────────────────────────────────────────┐
│  70–80% QUIET WORKSPACE NEUTRALS & SURFACES                           │
│  Soft Slate Canvas (#F3F5F7) + White Content Surfaces (#FFFFFF)        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 10–18% STRUCTURAL NAVY BRAND SCAFFOLDING                         │  │
│  │ Midnight Navy Sidebar (#142B45) + Topbar Anchors                 │  │
│  │ ┌──────────────────────────────────────────────────────────────┐ │  │
│  │ │ 5–8% PURPOSEFUL TEAL ACCENT & PRIMARY ACTIONS                │ │  │
│  │ │ Refined Teal Buttons (#0F766E) + Selected Tabs + Active Dots │ │  │
│  │ │ ┌──────────────────────────────────────────────────────────┐ │ │  │
│  │ │ │ 1–3% SEMANTIC STATUS (Green #15803D, Amber, Red #B91C1C) │ │ │  │
│  │ │ └──────────────────────────────────────────────────────────┘ │ │  │
│  │ └──────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ২. কালার রেশিও ডিস্ট্রিবিউশন গাইডলাইন (Distribution Matrix)

| রেশিও অনুপাত | স্তর ও ভূমিকা | সিএসএস ডিজাইন টোকেনস | মান ও কালার | আরগোনোমিক প্রভাব |
| :---: | :--- | :--- | :--- | :--- |
| **৭০–৮০%** | **Quiet Workspace & Surfaces** | `--background`<br>`--surface`<br>`--surface-muted` | `#F3F5F7` (Soft Slate)<br>`#FFFFFF` (Cloud White)<br>`#EAF0F4` (Muted) | শূন্য গ্লেয়ার, চোখকে সম্পূর্ণ শান্ত ও আরামদায়ক রাখে। |
| **১০–১৮%** | **Structural Scaffolding** | `--primary`<br>`--primary-hover`<br>`--primary-soft` | `#142B45` (Midnight Navy)<br>`#1D3B5A`<br>`#E8EEF4` | ব্র্যান্ড আইডেন্টিটি ও ন্যাভিগেশন বাউন্ডারি নির্ধারণ করে। |
| **৫–৮%** | **Intentional Action (CTA)** | `--accent`<br>`--accent-hover` | `#0F766E` (Refined Teal)<br>`#115E59` | ব্যবহারকারীর দৃষ্টি সরাসরি কার্যকর অ্যাকশনে (Save, Approve) নিয়ে যায়। |
| **১–৩%** | **Semantic Status Feedback** | `--success`<br>`--warning`<br>`--danger`<br>`--info` | `#15803D`<br>`#B45309`<br>`#B91C1C`<br>`#1D4ED8` | শুধুমাত্র স্ট্যাটাস ও এক্সেপশন সতর্কতায় ব্যবহৃত হয়। |

---

## ৩. কম্পোনেন্ট-টু-কালার মাস্টার ম্যাপিং টেবিল (Component-to-Color Master Mapping)

### ৩.১ গ্লোবাল অ্যাপ্লিকেশন শেল (App Shell)
- **Top Header Bar (64px):** `bg-surface border-b border-border` (একক টপবার, জিরো সেকেন্ড টপবার)।
- **Sidebar Shell:** `bg-surface border-r border-border` (বা ডার্ক মোডে `bg-primary`).
- **Sidebar Level 1 Domain Selector:** `bg-surface-muted hover:bg-surface text-foreground border border-border`.
- **Sidebar Level 2 Module Header:** `text-muted-foreground hover:text-foreground font-semibold`.
- **Sidebar Level 3 Active Nav Item:** `bg-primary text-white font-medium shadow-xs`.

### ৩.২ বাটন কন্ট্রোলস (`Button.tsx`)
- **Primary CTA (Save, Submit, Approve):** `bg-accent hover:bg-accent-hover text-white shadow-xs`.
- **Secondary Action (Cancel, Back):** `bg-surface hover:bg-surface-muted text-foreground border border-border`.
- **Destructive Action (Delete, Reject):** `bg-danger hover:bg-red-700 text-white`.
- **Ghost Action:** `bg-transparent hover:bg-surface-muted text-muted-foreground hover:text-foreground`.

### ৩.৩ ডেটা গ্রিড ও টেবিল (`DataTable.tsx`)
- **Table Card Wrapper:** `bg-surface border border-border rounded-lg shadow-2xs`.
- **Table Header:** `bg-surface-muted text-foreground font-semibold border-b border-border`.
- **Table Row Hover:** `hover:bg-background transition-colors`.
- **Row Selected State:** `bg-primary-soft/60 border-l-2 border-accent`.
- **Numeric & Monetary Columns:** ডানদিকে অ্যালাইনড ও `tabular-nums`.
