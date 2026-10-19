# এন্টারপ্রাইজ মাল্টি-থিম ও পূর্ণাঙ্গ ডিজাইন সিস্টেম স্পেসিফিকেশন (Enterprise Design System & Theme Engine)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (Senior Frontend Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)*  
*তারিখ: ১৯ অক্টোবর ২০২৬ | ভার্সন: ২.০ (সম্পূর্ণ এন্টারপ্রাইজ সংস্করণ)*  
*নীতিমালা রেফারেন্স: [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Rule 21](file:///g:/ERP-Software/Garments-ERP/.agents/rules/21_component_based_ui_ux_architecture.md)*

---

## ১. ভূমিকা ও সিস্টেম আর্কিটেকচার (System Architecture)

GarmentIQ-ERP-এর ডিজাইন সিস্টেম আন্তর্জাতিক মানসম্পন্ন (IBM Carbon ও Salesforce Lightning ধাঁচে) একটি **সম্পূর্ণ কম্পোনেন্ট-ভিত্তিক, হাইপার-পারফরম্যান্ট এবং সেন্ট্রালাইজড ডিজাইন ফ্রেমওয়ার্ক**। তৈরি পোশাক শিল্পে দীর্ঘ সময় একটানা কাজ করা মার্চেন্ডাইজার থেকে শুরু করে কাটিং ও ওয়াশিং ফ্লোরের টার্মিনাল অপারেটরদের চোখের স্বাচ্ছন্দ্য ও উচ্চ ডেটা ঘনত্বের চাহিদা মেটাতে এটি তৈরি করা হয়েছে।

```
[Theme Switcher Dropdown (Top Header)]
                 │
                 ▼ (Updates Zustand Store & LocalStorage)
     <html data-theme="sapphire">
                 │
                 ▼ (Native CSS Variable Cascading @ 60 FPS)
   Tailwind CSS v4 @theme Tokens -> Instant Global Style Update
```

---

## ২. মডুলার ডিজাইন সিস্টেম স্পেসিফিকেশন ডিরেক্টরি (Core Modules)

সম্পূর্ণ ডিজাইন সিস্টেমটি ৪টি বিস্তারিত উপ-স্পেসিফিকেশনে বিভক্ত:

| মডিউল রেফারেন্স | ডকুমেন্ট লিঙ্ক | মূল বিষয়বস্তু ও কভারেজ |
| :--- | :--- | :--- |
| **মডিউল ১: টাইপোগ্রাফি** | [01_TYPOGRAPHY_AND_TYPE_SCALE.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/01_TYPOGRAPHY_AND_TYPE_SCALE.md) | Inter ও JetBrains Mono ফন্ট, ১০-স্তরের টাইপ-স্কেল র‍্যাম্প (10px - 36px), লাইন-হাইট, ফন্ট ওয়েট ও `tabular-nums` রুলস। |
| **মডিউল ২: কালার প্যালেট** | [02_COLOR_PALETTES_AND_VARIANTS.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/02_COLOR_PALETTES_AND_VARIANTS.md) | ৪টি থিমের পূর্ণাঙ্গ ৫০-৯৫০ টোনাল স্কেল, ৪টি সেমান্টিক স্ট্যাটাস কালার, ৪টি কম্পোনেন্ট ভ্যারিয়েন্ট ও WCAG 2.1 AA/AAA অডিট। |
| **মডিউল ৩: গ্রিড ও এলিভেশন**| [03_SPATIAL_GRID_AND_ELEVATION.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/03_SPATIAL_GRID_AND_ELEVATION.md) | ৪px/৮px বেসলাইন গ্রিড, ৬টি রেসপনসিভ ব্রেকপয়েন্ট, লেআউট ডাইমেনশনস, বর্ডার রেডিয়াস স্কেল ও জেড-ইনডেক্স লেয়ারিং। |
| **মডিউল ৪: কম্পোনেন্ট অ্যানাটমি**| [04_COMPONENT_ANATOMY_AND_VARIANTS.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/04_COMPONENT_ANATOMY_AND_VARIANTS.md) | বাটন (৫ ভ্যারিয়েন্ট, ৪ সাইজ), স্ট্যাটাস ব্যাজ, ফর্ম কন্ট্রোলস, TanStack হাই-ডেনসিটি টেবিল ও মোডাল অ্যানাটমি। |
| **মডিউল ৫: স্ক্রিন কালার রেশিও ও ম্যাপিং**| [05_SCREEN_COLOR_RATIO_AND_COMPONENT_MAPPING.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/05_SCREEN_COLOR_RATIO_AND_COMPONENT_MAPPING.md) | ৬০-৩০-১০ ব্যালেন্স রুল, আই-কমফোর্ট আরগোনোমিক্স এবং কম্পোনেন্ট-টু-কালার ডিটারমিনিস্টিক মাস্টার ম্যাপিং। |

---

## ৩. ৪টি এন্টারপ্রাইজ থিমের কালার টোকেন ম্যাট্রিক্স (Master Token Matrix)

| সিএসএস টোকেন ভ্যারিয়েবল | ১. Royal Indigo (ডিফল্ট) | ২. Sapphire Corporate | ৩. Emerald Sustainable | ৪. Midnight Obsidian (ডার্ক) |
| :--- | :---: | :---: | :---: | :---: |
| **`--brand-sidebar`** | `#0f172a` (Slate 900) | `#111827` (Gray 900) | `#064e3b` (Emerald 950)| `#090d16` (Deep Obsidian) |
| **`--brand-sidebar-header`**| `#020617` (Slate 950) | `#030712` (Gray 950) | `#022c22` (Emerald 980)| `#05070c` (Ultra Dark) |
| **`--brand-sidebar-border`**| `#1e293b` (Slate 800) | `#1f2937` (Gray 800) | `#065f46` (Emerald 800)| `#161e30` (Obsidian Border) |
| **`--brand-accent`** | `#4f46e5` (Indigo 600) | `#2563eb` (Blue 600) | `#059669` (Emerald 600)| `#6366f1` (Neon Indigo) |
| **`--brand-accent-hover`**| `#4338ca` (Indigo 700) | `#1d4ed8` (Blue 700) | `#047857` (Emerald 700)| `#818cf8` (Indigo 400) |
| **`--brand-accent-light`**| `#e0e7ff` (Indigo 100) | `#dbeafe` (Blue 100) | `#d1fae5` (Emerald 100)| `#1e1b4b` (Indigo 950) |
| **`--surface-base`** | `#f8fafc` (Slate 50) | `#f9fafb` (Gray 50) | `#fafafa` (Zinc 50) | `#0b0f19` (Pitch Dark) |
| **`--surface-card`** | `#ffffff` (Pure White) | `#ffffff` (Pure White) | `#ffffff` (Pure White) | `#151c2c` (Charcoal Surface)|
| **`--surface-muted`** | `#f1f5f9` (Slate 100) | `#f3f4f6` (Gray 100) | `#f4f4f5` (Zinc 100) | `#1e293b` (Muted Dark) |
| **`--border-subtle`** | `#e2e8f0` (Slate 200) | `#e5e7eb` (Gray 200) | `#e4e4e7` (Zinc 200) | `#252f44` (Dark Border) |
| **`--text-primary`** | `#0f172a` (Slate 900) | `#111827` (Gray 900) | `#18181b` (Zinc 900) | `#f8fafc` (Slate 50) |
| **`--text-muted`** | `#64748b` (Slate 500) | `#6b7280` (Gray 500) | `#71717a` (Zinc 500) | `#94a3b8` (Slate 400) |

---

## ৪. থিমসমূহের ডোমেন উপযোগিতা ও লক্ষ্যমাত্রা (Domain Alignment)

1. **Royal Indigo & Raw Denim (`indigo`)**:
   - মার্চেন্ডাইজিং, বায়ার যোগাযোগ এবং টেক-প্যাক বিশ্লেষণে ডেনিম ইন্ডাস্ট্রির মৌলিক আভিজাত্য ফুটিয়ে তোলে।
2. **Sapphire Corporate & Pure Steel (`sapphire`)**:
   - ফিন্যান্স, কমার্শিয়াল শিপিং, এলসি ট্র্যাকিং ও এক্সিকিউটিভ ডিরেক্টরদের ডেটা ড্যাশবোর্ডের জন্য আন্তর্জাতিক মান।
3. **Emerald Loom & Sustainable Textile (`emerald`)**:
   - ইউরোপীয় বায়ার অডিট, কমপ্লায়েন্স, GOTS অর্গানিক কটন ও গ্রিন ফ্যাক্টরি (LEED Platinum) সার্টিফিকেশনের জন্য আদর্শ।
4. **Midnight Obsidian & Cyber Neon (`obsidian`)**:
   - কাটিং ও সুইং শপ ফ্লোরের টাচস্ক্রিন টার্মিনাল, রাতের শিফট এবং কম আলোর পরিবেশে জিরো আই-স্ট্রেন।

---

## ৫. ফ্রন্টএন্ড কোডিং ও বাস্তবায়ন মেকানিজম

1. **Tailwind CSS v4 `@theme` রেজিস্ট্রেশন**:
   - `frontend/src/index.css`-এ সমস্ত টোকেন ভ্যারিয়েবল হিসেবে সংজ্ঞায়িত এবং রুট অ্যাট্রিবিউট থেকে ডেটা গ্রহণ করে।
2. **Zustand থিম স্টোর (`frontend/src/store/themeStore.js`)**:
   - রিয়েক্টিভ স্টেট ম্যানেজমেন্ট এবং `garments_erp_theme` ব্রাউজার লোকালস্টোরেজ পারসিসটেন্স।
3. **থিম সুইচার পপওভার কম্পোনেন্ট (`frontend/src/components/ui/ThemeSwitcher.jsx`)**:
   - ডুয়াল-টোন কালার সার্কেল প্রিভিউ, টিকমার্ক ও কিবোর্ড ট্র্যাভার্সাল সমৃদ্ধ ইউআই প্রিম্যাটিভ।
4. **Zero FOUC গ্যারান্টি**:
   - `index.html`-এর হেড সেকশনে তাৎক্ষণিক ইনলাইন বুটস্ট্র্যাপ স্ক্রিপ্ট যা হোয়াইট ফ্ল্যাশ সম্পূর্ণ প্রতিরোধ করে।
