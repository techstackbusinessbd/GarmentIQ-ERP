# এন্টারপ্রাইজ মাল্টি-থিম ডিজাইন সিস্টেম স্পেসিফিকেশন (Enterprise Theme System)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (Senior Frontend Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect)*  
*তারিখ: ১৯ অক্টোবর ২০২৬ | ভার্সন: ১.০ | স্ট্যাটাস: পর্যালোচনার জন্য প্রস্তুত (Draft for Approval)*  
*পলিসি রেফারেন্স: [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) ও [ADR-010](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md)*  

---

## ১. থিম আর্কিটেকচার ও মূল কৌশল (Architecture & Strategy)

সিস্টেমে Tailwind CSS v4-এর সেন্ট্রালাইজড `@theme` এবং CSS Custom Properties (`var(--...)`) ব্যবহার করা হবে। এতে করে কোনো উপাদান রি-রেন্ডার না করে শুধুমাত্র ব্রাউজারের রুট নোডের `data-theme` পরিবর্তনের মাধ্যমে ৬০ FPS মসৃণতায় পুরো ইন্টারফেস নতুন রঙে উদ্ভাসিত হবে।

```
[Theme Switcher Dropdown (Top Header)]
                 │
                 ▼ (Updates Zustand Store & LocalStorage)
     <html data-theme="sapphire">
                 │
                 ▼ (Native CSS Variable Cascading)
   Tailwind CSS v4 @theme Tokens -> Instant Color Update
```

---

## ২. ৪টি থিমের সুনির্দিষ্ট কালার টোকেন ম্যাট্রিক্স (Color Token Specifications)

| সিএসএস টোকেন ভ্যারিয়েবল | ১. Royal Indigo (ডিফল্ট) | ২. Sapphire Corporate | ৩. Emerald Sustainable | ৪. Midnight Obsidian (ডার্ক) |
| :--- | :---: | :---: | :---: | :---: |
| **`--brand-sidebar`** | `#0f172a` (Slate 900) | `#111827` (Gray 900) | `#064e3b` (Emerald 950)| `#090d16` (Deep Obsidian) |
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

## ৩. থিমসমূহের ডোমেন উপযোগিতা (Domain Suitability)

1. **Royal Indigo & Raw Denim (`indigo`)**:
   - মার্চেন্ডাইজিং ও বায়ার যোগাযোগে ডেনিম ইন্ডাস্ট্রির মৌলিক আভিজাত্য ফুটিয়ে তোলে।
2. **Sapphire Corporate & Pure Steel (`sapphire`)**:
   - ফিন্যান্স, কমার্শিয়াল শিপিং ও এক্সিকিউটিভ ডিরেক্টরদের ডেটা ড্যাশবোর্ডের জন্য আন্তর্জাতিক মান।
3. **Emerald Loom & Sustainable Textile (`emerald`)**:
   - ইউরোপীয় বায়ার অডিট, কমপ্লায়েন্স, GOTS অর্গানিক কটন ও গ্রিন ফ্যাক্টরি সার্টিফিকেশনের জন্য আদর্শ।
4. **Midnight Obsidian & Cyber Neon (`obsidian`)**:
   - কাটিং ও সুইং শপ ফ্লোরের টাচস্ক্রিন টার্মিনাল, রাতের শিফট এবং কম আলোর পরিবেশে জিরো আই-স্ট্রেন।

---

## ৪. ফ্রন্টএন্ড আর্কিটেকচার ও ইমপ্লিমেন্টেশন রূপরেখা

### ৪.১ গ্লোবাল থিম স্টেট ম্যানেজার (`frontend/src/store/themeStore.js`)
- **Zustand Store**: নির্বাচিত থিম রিয়েক্টিভ স্টেটে রাখবে।
- **LocalStorage Sync**: কি `garments_erp_theme` স্বয়ংক্রিয়ভাবে ব্রাউজারে সংরক্ষিত হবে।
- **DOM Injection**: অ্যাপ মাউন্ট হওয়ার সময় এবং থিম পরিবর্তনের সময় `document.documentElement.setAttribute('data-theme', theme)` কল করবে।

### ৪.২ থিম সুইচার কম্পোনেন্ট (`frontend/src/components/ui/ThemeSwitcher.jsx`)
- টপ হেডারে নোটিফিকেশন বেল আইকনের পাশে প্রদর্শিত হবে।
- প্রতিটি থিমের রঙের ছোট কালার সার্কেল প্রিভিউ এবং নাম প্রদর্শিত হবে।

---

## ৫. কোয়ালিটি গেট ও অ্যাক্সেসিবিলিটি (Farhana's QA Gate)
- **WCAG 2.1 AA Compliance**: প্রতিটি থিমের টেক্সট ও ব্যাকগ্রাউন্ডের কন্ট্রাস্ট রেশিও কমপক্ষে ৪.৫:১ হওয়া নিশ্চিত করা হয়েছে।
- **Zero FOUC (Flash of Unstyled Content)**: পেজ লোডের সময় যাতে কোনো সাদা স্ক্রিন ব্লিঙ্ক না করে, সেজন্য `index.html`-এ ইনলাইন ইনিশিয়াল স্ক্রিপ্ট থাকবে।
- **Rule 20 Compliance**: কোডে কোনো ইনলাইন রঙ ব্যবহৃত হবে না; শতভাগ স্টাইল সিএসএস ভ্যারিয়েবল থেকে আসবে।
