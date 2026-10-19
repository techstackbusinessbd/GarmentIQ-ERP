# স্ক্রিন কালার রেশিও ও কম্পোনেন্ট কালার ম্যাপিং স্পেসিফিকেশন (Screen Color Ratio & Component Color Mapping)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (Senior Frontend Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)*  
*তারিখ: ১৯ অক্টোবর ২০২৬ | ভার্সন: ১.০ (অফিশিয়াল এন্টারপ্রাইজ স্ট্যান্ডার্ড)*  
*রেফারেন্স: [Rule 04](file:///g:/ERP-Software/Garments-ERP/.agents/rules/04_ui_copywriting_and_ux.md) | [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md)*

---

## ১. ভূমিকা ও চোখের স্বাচ্ছন্দ্য নীতি (Ergonomics & Eye Comfort)

তৈরি পোশাক শিল্পের মার্চেন্ডাইজার, প্ল্যানিং অফিসার, কাটিং সুপারভাইজার ও একাউন্টস টিম একটানা ৮ থেকে ১০ ঘণ্টা স্ক্রিনে কাজ করেন। একটি সাধারণ কালার প্যালেট স্ক্রিনে সরাসরি ছড়িয়ে দিলে চোখের তীব্র ক্লান্তি (Visual Fatigue) এবং ভুল ডেটা এন্ট্রির ঝুঁকি তৈরি হয়। 

GarmentIQ-ERP আন্তর্জাতিক **৬০-৩০-১০ কালার রেশিও ব্যালেন্স (60-30-10 Enterprise Balance)** এবং **ডিটারমিনিস্টিক কম্পোনেন্ট ম্যাপিং** কঠোরভাবে অনুসরণ করে।

```
┌────────────────────────────────────────────────────────────────────────┐
│  60% DOMINANT NEUTRAL BASE CANVAS & WORKSPACE                          │
│  Surface Base (#F8FAFC) + Pure White Surface Cards (#FFFFFF)           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 30% STRUCTURAL SURFACES & FRAMES                                 │  │
│  │ Sidebar (#0F172A) + Table Headers (#F1F5F9) + Borders (#E2E8F0) │  │
│  │ ┌──────────────────────────────────────────────────────────────┐ │  │
│  │ │ 10% INTENTIONAL FOCAL ACCENTS & INTERACTION                  │ │  │
│  │ │ Primary CTA Buttons (#2563EB) + Active States + Status Dots  │ │  │
│  │ └──────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ২. ৬০-৩০-১০ এন্টারপ্রাইজ কালার রেশিও স্পেসিফিকেশন (Distribution Contract)

| রেশিও অনুপাত | স্তর ও ভূমিকা | সিএসএস ডিজাইন টোকেনস | স্যাফায়ার কর্পোরেট মান | সাইকোলজিক্যাল ও আরগোনোমিক প্রভাব |
| :---: | :--- | :--- | :--- | :--- |
| **৬০%** | **Dominant Neutral Canvas**<br>*(ক্যানভাস ও কার্ড ব্যাকগ্রাউন্ড)* | `--surface-base`<br>`--surface-card` | `#f8fafc` (Slate 50)<br>`#ffffff` (Pure White) | জিরো গ্লেয়ার, সফট পেপার ফিনিশ যা দীর্ঘ সময়ের ডেটা বিশ্লেষণে চোখকে শান্ত রাখে। |
| **৩০%** | **Structural Scaffolding**<br>*(সাইডবার, ফ্রেম, বর্ডার, হেডার)* | `--brand-sidebar`<br>`--surface-muted`<br>`--border-subtle` | `#0f172a` (Slate 900)<br>`#f1f5f9` (Slate 100)<br>`#e2e8f0` (Slate 200) | অ্যাপ্লিকেশনের বাউন্ডারি, ডিভাইডার ও হেডার তৈরি করে; কোনো তীব্র রঙ থাকে না। |
| **১০%** | **Intentional Focal Accent**<br>*(অ্যাকশন, অ্যাক্টিভ ও স্ট্যাটাস)* | `--brand-accent`<br>`--brand-accent-hover`<br>`Status Tokens` | `#2563eb` (Blue 600)<br>`#1d4ed8` (Blue 700)<br>`Emerald, Amber, Rose` | চোখের দৃষ্টি সরাসরি জরুরি সিদ্ধান্ত ও অ্যাকশনে নিয়ে যায় (Save, Approve, Alert)। |

---

## ৩. সম্পূর্ণ কম্পোনেন্ট-টু-কালার মাস্টার ম্যাপিং টেবিল (Component-to-Color Master Mapping)

সিস্টেমের প্রতিটি কম্পোনেন্টে কোন নির্দিষ্ট টোকেন ব্যবহৃত হবে তার চূড়ান্ত ও অলঙ্ঘনীয় চুক্তি:

### ৩.১ গ্লোবাল নেভিগেশন ও সাইডবার (Global Navigation & Shell)
| কম্পোনেন্ট এলিমেন্ট | সিএসএস ব্যাকগ্রাউন্ড টোকেন | টেক্সট কালার টোকেন | বর্ডার ও রিং ক্লাস | হোভার / অ্যাক্টিভ স্টেট |
| :--- | :--- | :--- | :--- | :--- |
| **Sidebar Root Container** | `bg-brand-sidebar` | `text-slate-300` | `border-r border-brand-sidebar-border` | ফিক্সড ডার্ক স্লেট ব্যাকগ্রাউন্ড |
| **Brand / Logo Header** | `bg-brand-sidebar-header` | `text-white` | `border-b border-brand-sidebar-border` | লোগো অ্যাকসেন্ট: `bg-brand-accent` |
| **Inactive Nav Link** | `bg-transparent` | `text-slate-300` | নান | `hover:bg-white/10 hover:text-white` |
| **Active Nav Link** | `bg-brand-accent` | `text-white` | `shadow-xs` | `font-semibold` |
| **Sidebar Section Group** | `bg-transparent` | `text-slate-400` | নান | `uppercase text-[11px] font-semibold` |
| **User Profile Footer** | `bg-brand-sidebar-header/60` | `text-slate-200` | `border-t border-brand-sidebar-border` | `border border-white/10` |

### ৩.২ টপ অ্যাপ্লিকেশন হেডার (Top Application Bar)
| কম্পোনেন্ট এলিমেন্ট | সিএসএস ব্যাকগ্রাউন্ড টোকেন | টেক্সট কালার টোকেন | বর্ডার ও রিং ক্লাস | ইন্টারঅ্যাকশন স্টেট |
| :--- | :--- | :--- | :--- | :--- |
| **Header Root Bar** | `bg-surface-card` | `text-text-primary` | `border-b border-border-subtle` | স্টিকি টপ (z-20) |
| **Factory Unit Selector** | `bg-surface-muted` | `text-text-primary` | `border border-border-subtle` | `hover:bg-surface-hover` |
| **Global Search Trigger** | `bg-surface-muted` | `text-text-muted` | `border border-border-subtle` | `focus:ring-2 focus:ring-brand-accent/20` |
| **Notification Bell Button** | `bg-surface-card` | `text-text-muted` | `border border-border-subtle` | `hover:text-text-primary hover:bg-surface-muted` |
| **Live Alert Dot** | `bg-status-danger` | `text-white` | `ring-2 ring-surface-card` | ৮px রেড পালস ডট |

### ৩.৩ মাস্টার ডেটা গ্রিড ও টেবিল (TanStack Data Grid)
| টেবিল এলিমেন্ট | ব্যাকগ্রাউন্ড ক্লাস | টেক্সট কালার ক্লাস | বর্ডার টোকেন | বিশেষ আচরণ ও নোট |
| :--- | :--- | :--- | :--- | :--- |
| **Table Header Row (TH)** | `bg-surface-muted` | `text-text-muted` | `border-b border-border-subtle` | `uppercase text-caption font-semibold` |
| **Standard Even Row** | `bg-surface-card` | `text-text-primary` | `border-b border-border-subtle/80` | স্ট্যান্ডার্ড হোয়াইট ক্যানভাস |
| **Striped Odd Row** | `bg-surface-base` | `text-text-primary` | `border-b border-border-subtle/80` | স্লথ অল্টারনেটিং গ্রিড লাইন |
| **Hover Row State** | `hover:bg-brand-accent-light/40` | `text-text-primary` | অপরিবর্তিত | মসৃণ `transition-colors duration-150` |
| **Selected Row State** | `bg-brand-accent-light/70` | `text-text-primary font-medium` | `border-l-4 border-l-brand-accent` | বামপাশে ৪px অ্যাকসেন্ট বার |
| **Table Footer / Pagination**| `bg-surface-card` | `text-text-muted` | `border-t border-border-subtle` | বাটন: `variant="secondary"` |

### ৩.৪ ফর্ম কন্ট্রোল ও ইনপুট ফিল্ডস (Form Inputs & Selects)
| ইনপুট স্টেট | সারফেস ব্যাকগ্রাউন্ড | টেক্সট কালার | বর্ডার ক্লাস | ফোকাস রিং আউটলাইন |
| :--- | :--- | :--- | :--- | :--- |
| **Default Inactive** | `bg-surface-card` | `text-text-primary` | `border-border-subtle` | `outline-none` |
| **Hover State** | `bg-surface-card` | `text-text-primary` | `border-border-strong` | ট্রানজিশনাল বর্ডার ডার্কেনিং |
| **Focused State** | `bg-surface-card` | `text-text-primary` | `border-brand-accent` | `ring-2 ring-brand-accent/20` |
| **Validation Error** | `bg-surface-card` | `text-text-primary` | `border-status-danger` | `ring-2 ring-status-danger/20` |
| **Disabled Field** | `bg-surface-muted` | `text-slate-400` | `border-border-subtle` | `cursor-not-allowed opacity-60` |

### ৩.৫ অ্যাকশন বাটন ভ্যারিয়েন্টস (Action Buttons)
| বাটন ভ্যারিয়েন্ট | ব্যাকগ্রাউন্ড ক্লাস | টেক্সট কালার | বর্ডার ক্লাস | হোভার স্টেট | অ্যাক্টিভ / ফোকাস রিং |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `bg-brand-accent` | `text-white` | `border-transparent` | `hover:bg-brand-accent-hover` | `ring-2 ring-brand-accent/20 active:scale-[0.98]` |
| **Secondary** | `bg-surface-card` | `text-text-primary` | `border-border-subtle` | `hover:bg-surface-muted` | `ring-2 ring-slate-400/20 active:scale-[0.98]` |
| **Danger** | `bg-status-danger` | `text-white` | `border-transparent` | `hover:bg-rose-700` | `ring-2 ring-status-danger/20 active:scale-[0.98]` |
| **Outline** | `bg-transparent` | `text-brand-accent` | `border-brand-accent` | `hover:bg-brand-accent-light/30` | `ring-2 ring-brand-accent/20 active:scale-[0.98]` |
| **Ghost** | `bg-transparent` | `text-text-muted` | `border-transparent` | `hover:bg-surface-muted hover:text-text-primary` | `ring-0` |

### ৩.৬ স্ট্যাটাস ব্যাজ ও পিলস (Domain Status Pills)
| আরএমজি স্ট্যাটাস | ব্যাকগ্রাউন্ড ক্লাস | টেক্সট ক্লাস | বর্ডার ক্লাস | বাস্তব ডোমেন ব্যবহার |
| :--- | :--- | :--- | :--- | :--- |
| **Success (Pass/Approved)** | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | QC Passed, 4-Point Passed, Shipped On-Time |
| **Warning (In-Progress)** | `bg-amber-50` | `text-amber-700` | `border-amber-200` | Cutting In-Progress, Pending Lab Dip, Low Stock |
| **Danger (Reject/Critical)** | `bg-rose-50` | `text-rose-700` | `border-rose-200` | Fabric Rejected, Critical Defect, Shipment Delayed |
| **Info (Draft/Planning)** | `bg-sky-50` | `text-sky-700` | `border-sky-200` | Draft Buyer PO, In-Transit, Sample Sent |

### ৩.৭ মডাল, ড্রয়ার ও ফ্লোটিং প্যানেল (Overlays & Dialogs)
| ওভারলে উপাদান | ব্যাকগ্রাউন্ড ক্লাস | বর্ডার ও ডিভাইডার | এলিভেশন শ্যাডো | লেয়ার ও বিহেভিয়ার |
| :--- | :--- | :--- | :--- | :--- |
| **Scrim Backdrop** | `bg-slate-950/50` | নান | নান | `backdrop-blur-xs z-50` |
| **Modal Container** | `bg-surface-card` | `border border-border-subtle` | `shadow-2xl rounded-modal` | সেন্টার পপআপ (z-60) |
| **Slide-over Drawer** | `bg-surface-card` | `border-l border-border-subtle`| `shadow-2xl` | ডানপাশ থেকে স্লাইড ইন (z-50) |
| **Modal Header & Footer** | `bg-surface-card` | `border-b/t border-border-subtle` | নান | স্টিকি হেডার ও ফুটার অ্যাকশনস |

---

## ৪. ৪টি এন্টারপ্রাইজ থিমে কালার ভ্যালু ট্রানজিশন ম্যাট্রিক্স (Theme Adaptation Table)

| কম্পোনেন্ট সিএসএস ভ্যারিয়েবল | ১. Sapphire Corporate | ২. Nordic Mist (Steel) | ৩. Cashmere (Paper) | ৪. Charcoal Dim (Dark) |
| :--- | :---: | :---: | :---: | :---: |
| **`--brand-sidebar`** | `#0f172a` (Slate 900) | `#0a192f` (Deep Navy) | `#1c1917` (Warm Stone) | `#0d1117` (Dim Charcoal) |
| **`--brand-accent`** | `#2563eb` (Blue 600) | `#0284c7` (Sky Steel) | `#2563eb` (Pure Cobalt)| `#58a6ff` (Glacier Blue) |
| **`--surface-base`** | `#f8fafc` (Slate 50) | `#f1f5f9` (Mist Slate)| `#f7f7f5` (Alabaster) | `#161b22` (Charcoal Canvas) |
| **`--surface-card`** | `#ffffff` (Pure White)| `#ffffff` (Pure White)| `#ffffff` (Pure White) | `#21262d` (Dim Card Surface)|
| **`--surface-muted`** | `#f1f5f9` (Slate 100) | `#e2e8f0` (Slate 200)| `#e7e5e4` (Stone 200) | `#30363d` (Dim Border/Muted)|
| **`--border-subtle`** | `#e2e8f0` (Slate 200) | `#cbd5e1` (Slate 300)| `#e7e5e4` (Stone 200) | `#30363d` (Dim Line Border) |
| **`--text-primary`** | `#0f172a` (Slate 900) | `#0f172a` (Slate 900)| `#1c1917` (Warm 900)  | `#f0f6fc` (Bright Dim White)|
| **`--text-muted`** | `#64748b` (Slate 500) | `#475569` (Slate 600)| `#57534e` (Stone 500) | `#8b949e` (Dim Muted Gray) |

---

## ৫. ফ্রন্টএন্ড কোডিং ও কিউএ নিয়মাবলী (Frontend & QA Rules)

1. **জিরো হার্ডকোড ও জিরো ইনলাইন কালার**: কোনো কম্পোনেন্টে সরাসরি `#2563eb` বা `text-blue-600` লেখা সম্পূর্ণ নিষিদ্ধ; সর্বদা সিএসএস টোকেন ক্লাস (`text-brand-accent`, `bg-surface-card`) ব্যবহার করতে হবে।
2. **কন্ট্রাস্ট অডিট**: প্রতিটি টেক্সট ও ব্যাকগ্রাউন্ড পেয়ারিং বাধ্যতামূলকভাবে WCAG 2.1 AA (কমপক্ষে 4.5:1) এবং হেডার বা মূল কন্টেন্টে AAA (7:1) পূরণ করবে।
3. **এন্টারপ্রাইজ সংযম**: স্ক্রিনের মোট রঙের ১০%-এর বেশি অ্যাকসেন্ট কালার ছড়ানো যাবে না; অতিরিক্ত রঙ থাকলে তা ফারহানা চৌধুরী কিউএ রিভিউতে বাতিল করবেন।
