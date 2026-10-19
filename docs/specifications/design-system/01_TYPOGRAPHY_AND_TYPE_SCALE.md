# এন্টারপ্রাইজ টাইপোগ্রাফি ও টাইপ-স্কেল স্পেসিফিকেশন (Typography & Type Scale)

*প্রজেক্ট: GarmentIQ-ERP (RMG Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (UI/UX Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Architect)*  
*রেফারেন্স: [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Rule 21](file:///g:/ERP-Software/Garments-ERP/.agents/rules/21_component_based_ui_ux_architecture.md)*

---

## ১. ফন্ট ফ্যামিলি আর্কিটেকচার (Font Families)

| টাইপোগ্রাফি রোল | ফন্ট ফ্যামিলি | ফলব্যাক স্ট্যাক | ব্যবহারের ক্ষেত্র (Usage Scope) |
| :--- | :--- | :--- | :--- |
| **Primary Sans** | `'Inter'` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` | সিস্টেমের সকল হেডলাইন, বডি টেক্সট, বাটন, মেনু ও ফর্ম লেবেল। |
| **Tabular Monospace** | `'JetBrains Mono'` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace` | সুতা/ফেব্রিক কনসাম্পশন, অর্ডার কোয়ান্টিটি, মানি ভ্যালু, বারকোড/RFID ও টাইমস্ট্যাম্প। |

---

## ২. টাইপ-স্কেল র‍্যাম্প ম্যাট্রিক্স (Type Scale Ramp: Size, Line-Height, Weight & Tracking)

গার্মেন্টস ইআরপির উচ্চ ঘনত্বের ডেটা ও ডিসপ্লে উপযোগিতা নিশ্চিত করতে নিচের ১০-স্তরের সুনির্দিষ্ট টাইপ স্কেল বাধ্যতামূলক:

| টোকেন নেম | সাইজ (REM / PX) | লাইন-হাইট (Line-Height) | ফন্ট ওয়েট (Weight) | ট্র্যাকিং (Letter Spacing) | ডোমেন ও ইউআই ব্যবহারের ক্ষেত্র |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`text-display`** | `2.25rem` (36px) | `2.75rem` (44px) / 1.22 | Bold (700) | `-0.025em` (-0.9px) | এক্সিকিউটিভ ড্যাশবোর্ড হিরো KPI ও বড় সংখ্যা |
| **`text-h1`** | `1.875rem` (30px) | `2.375rem` (38px) / 1.26 | Bold (700) | `-0.020em` (-0.6px) | মডিউল পেজ মাস্টার টাইটেল (PageHeader) |
| **`text-h2`** | `1.50rem` (24px) | `2.00rem` (32px) / 1.33 | SemiBold (600) | `-0.015em` (-0.36px) | সেকশন হেডার, ডায়ালগ/মোডাল টাইটেল |
| **`text-h3`** | `1.25rem` (20px) | `1.75rem` (28px) / 1.40 | SemiBold (600) | `-0.010em` (-0.2px) | উইজেট ও কার্ড টাইটেল, টেবিল গ্রুপ হেডার |
| **`text-h4`** | `1.125rem` (18px) | `1.625rem` (26px) / 1.44 | Medium (500) | `-0.005em` (-0.09px) | সাব-সেকশন হেডার, ড্রয়ার হেডার |
| **`text-body-lg`** | `1.00rem` (16px) | `1.50rem` (24px) / 1.50 | Regular (400) / 500 | `0.000em` (0px) | রিড-মোড টেক্সট, বড় ফর্ম ইনপুট ফিল্ড |
| **`text-body`** | `0.875rem` (14px) | `1.25rem` (20px) / 1.43 | Regular (400) / 500 | `0.000em` (0px) | স্ট্যান্ডার্ড বডি টেক্সট, ড্রপডাউন অপশন |
| **`text-body-sm`** | `0.8125rem` (13px)| `1.125rem` (18px) / 1.38 | Regular (400) / 500 | `0.005em` (+0.065px) | টেবিল ডেটা সেলস (স্ট্যান্ডার্ড মোড) |
| **`text-caption`** | `0.75rem` (12px) | `1.00rem` (16px) / 1.33 | Medium (500) / 600 | `0.010em` (+0.12px) | টেবিল কলাম হেডার, ইনপুট হেল্পার টেক্সট |
| **`text-micro`** | `0.625rem` (10px) | `0.875rem` (14px) / 1.40 | SemiBold (600) / 700 | `0.050em` (+0.5px) CAPS | স্ট্যাটাস ব্যাজ পিলস, ভার্সন ব্যাজ, ট্যাগস |

---

## ৩. ফন্ট ওয়েট স্কেল (Font Weight Scale)

```css
--font-weight-light: 300;     /* [EN] Fine subtext / [BN] সূক্ষ্ম সাবটেক্সট */
--font-weight-regular: 400;   /* [EN] Default body text / [BN] সাধারণ বডি টেক্সট */
--font-weight-medium: 500;    /* [EN] Interactive labels / [BN] ইন্টারঅ্যাক্টিভ লেবেল */
--font-weight-semibold: 600;  /* [EN] Headers & Badges / [BN] হেডার ও স্ট্যাটাস ব্যাজ */
--font-weight-bold: 700;      /* [EN] High emphasis titles / [BN] মূল পেজ টাইটেল ও কেপিআই */
--font-weight-extrabold: 800; /* [EN] Hero KPI numbers / [BN] হিরো মেট্রিক্স সংখ্যা */
```

---

## ৪. লাইন হাইট স্কেল (Leading Scale)

| টোকেন | অনুপাত (Ratio) | পিক্সেল ভিত্তি (14px Body) | ব্যবহার |
| :--- | :--- | :--- | :--- |
| **`leading-none`** | `1.0` | 14px | আইকন বাটন, সিঙ্গেল-লাইন ব্যাজ |
| **`leading-tight`** | `1.25` | 17.5px | বড় ডিসপ্লে ও H1/H2 হেডলাইন |
| **`leading-snug`** | `1.375` | 19.25px | টেবিল সেলস ও কমপ্যাক্ট লিস্ট |
| **`leading-normal`** | `1.50` | 21px | স্ট্যান্ডার্ড বডি টেক্সট ও প্যারাগ্রাফ |
| **`leading-relaxed`** | `1.625` | 22.75px | দীর্ঘ টেকনিক্যাল স্পেসিফিকেশন ও নোটস |

---

## ৫. ট্র্যাকিং ও লেটার স্পেসিং (Letter Spacing)

- **`tracking-tight` (`-0.025em`)**: বড় হেডলাইন (`text-display`, `text-h1`, `text-h2`) এ ব্যবহৃত হয় যাতে ফন্ট টাইট ও প্রিমিয়াম দেখায়।
- **`tracking-normal` (`0em`)**: সাধারণ বডি ও ফর্ম ইনপুটের জন্য ডিফল্ট।
- **`tracking-wide` (`0.025em`)**: ছোট টেক্সট (`text-caption`) যাতে সহজে পঠনযোগ্য হয়।
- **`tracking-widest` (`0.05em uppercase`)**: অল-ক্যাপস হেডার ও স্ট্যাটাস ব্যাজ (`DENIM & WOVEN O2S`, `ACTIVE`).

---

## ৬. গার্মেন্টস এন্টারপ্রাইজ নিউমেরিক ও ট্যাবুলার রুলস (`tabular-nums`)

তৈরি পোশাক কারখানার কাটিং ও ওয়াশিং ফ্লোরে কলামের সংখ্যা নিখুঁত সারিবদ্ধ থাকা বাধ্যতামূলক:
1. **Vertical Alignment**: টেবিলের সমস্ত সংখ্যা ও কারেন্সি ফিল্ডে অবশ্যই `font-mono tabular-nums` সিএসএস ক্লাস থাকতে হবে।
2. **ডেসিমাল প্রিসিশন স্ট্যান্ডার্ড**:
   - ফেব্রিক ও সুতা কনসাম্পশন: **৪ দশমিক ঘর** (যেমন: `1.3450 Yds/Dzn`).
   - মূল্য ও বাজেট (USD/BDT): **২ দশমিক ঘর** (যেমন: `$12,450.00`).
   - শ্রিংকেজ পার্সেন্টেজ: **১ দশমিক ঘর** (যেমন: `-3.5% x +1.2%`).
   - অর্ডার ও বান্ডিল পিসেস: **০ দশমিক ঘর / পূর্ণসংখ্যা** (যেমন: `12,000 Pcs`).
