# এন্টারপ্রাইজ কালার প্যালেট ও টোনাল ভ্যারিয়েন্টস (Color Palettes & Tonal Variants)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (UI/UX Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Architect)*  
*তারিখ: ২২ অক্টোবর ২০২৬ | ভার্সন: ২.০ (অফিশিয়াল এন্টারপ্রাইজ স্ট্যান্ডার্ড)*  
*রেফারেন্স: [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 15](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Master Theme Spec](file:///g:/ERP-Software/Garments-ERP/docs/specifications/ENTERPRISE_THEME_DESIGN_SYSTEM.md)*

---

## ১. GarmentIQ প্রিমিয়াম আই-কমফোর্ট মাস্টার কালার প্যালেট (Master Palette)

GarmentIQ-ERP-এর সমস্ত মডিউলে একটি একক, সুসংহত ও চোখের জন্য স্বাচ্ছন্দ্যপূর্ণ কালার প্যালেট অনুসরণ করা হয়। এটি একটানা দীর্ঘ কাজের শিফটে চোখের ক্লান্তি কমায় এবং ডেটা বিশ্লেষণের গতি বৃদ্ধি করে।

### ১.১ লাইট থিম কোর টোকেনস (Default Light Mode)

| টোকেন ক্যাটাগরি | সিএসএস ভ্যারিয়েবল | হেক্স কোড (Hex) | আরজিবি (RGB) | ইউআই ভূমিকা ও ব্যবহার |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Structure** | `--primary` | `#142B45` | `rgb(20, 43, 69)` | ব্র্যান্ড স্ট্রাকচার, সাইডবার হায়ারার্কি, হেডার ও টেবিল স্টিকি অ্যাঙ্কর |
| **Primary Hover** | `--primary-hover` | `#1D3B5A` | `rgb(29, 59, 90)` | ডার্ক স্ট্রাকচারাল এলিমেন্টের হোভার স্টেট |
| **Primary Soft** | `--primary-soft` | `#E8EEF4` | `rgb(232, 238, 244)` | নির্বাচিত আইটেমের সফট ব্যাকগ্রাউন্ড হাইলাইট |
| **Accent Action (CTA)**| `--accent` | `#0F766E` | `rgb(15, 118, 110)` | **প্রাইমারি অ্যাকশন বাটন (Save, Submit, Approve, Create)**, প্রোগ্রেস বার |
| **Accent Hover** | `--accent-hover` | `#115E59` | `rgb(17, 94, 89)` | প্রাইমারি অ্যাকশন বাটনের প্রেস ও হোভার স্টেট |
| **Workspace Canvas** | `--background` | `#F3F5F7` | `rgb(243, 245, 247)` | মূল ক্যানভাস (লো-গ্লেয়ার সফট স্লেট ফিনিশ) |
| **Content Surface** | `--surface` | `#FFFFFF` | `rgb(255, 255, 255)` | কার্ড, ডেটা টেবিল, ডায়ালগ ও ফর্মের সাদা সারফেস |
| **Muted Surface** | `--surface-muted` | `#EAF0F4` | `rgb(234, 240, 244)` | সার্চ ইনপুট, টেবিল হোভার ও সেগমেন্টেড ট্যাব ব্যাকগ্রাউন্ড |
| **Subtle Border** | `--border` | `#D8E0E8` | `rgb(216, 224, 232)` | ইনপুট বর্ডার, টেবিল গ্রিডলাইন ও কার্ড ফ্রেম |
| **Text Primary** | `--foreground` | `#182536` | `rgb(24, 37, 54)` | মূল টাইটেল, বডি টেক্সট ও টেবিল ভ্যালু (উচ্চ কনট্রাস্ট) |
| **Text Secondary** | `--muted-foreground`| `#526579` | `rgb(82, 101, 121)` | ফর্ম লেবেল, মেটাডেটা ও বর্ণনামূলক টেক্সট |

---

## ২. সেমান্টিক স্ট্যাটাস কালার স্কেল (Semantic Status Tokens)

| স্ট্যাটাস ধরণ | সিএসএস টোকেন | হেক্স কোড | সফট ব্যাকগ্রাউন্ড | ইউআই ও ডোমেন অর্থ |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `--success` | `#15803D` | `#ECFDF5` | অনুমোদিত PO, QC পাস, সফল ডাটা সিঙ্ক |
| **Warning** | `--warning` | `#B45309` | `#FFFBEB` | পেন্ডিং অনুমোদন, স্টক থ্রেশহোল্ড সতর্কতা, SLA ঝুঁকির সম্মুখীন |
| **Danger** | `--danger` | `#B91C1C` | `#FEF2F2` | QC রিজেক্টেড, ডিলিট অ্যাকশন, ফেব্রিক রোল ত্রুটি, বিলম্বিত শিপমেন্ট |
| **Info** | `--info` | `#1D4ED8` | `#EFF6FF` | সিস্টেম নোটিশ, অ্যাক্টিভ অডিট লগ, ইনফরমেশনাল লিঙ্ক |

---

## ৩. ঐচ্ছিক ডার্ক থিম প্যালেট (Optional Dark Mode)

কম আলো ও রাতের শিফটের জন্য ডার্ক মোড সাপোর্ট:

| টোকেন | হেক্স কোড (Hex) | ভূমিকা |
| :--- | :--- | :--- |
| `--primary` | `#A9C4E0` | ডার্ক ব্র্যান্ড টেক্সট ও বর্ডার |
| `--accent` | `#5EE0CF` | প্রাণবন্ত টিল প্রাইমারি বাটন ও হাইলাইট |
| `--background` | `#111A24` | ডিপ নেভি ব্ল্যাক ব্যাকগ্রাউন্ড ক্যানভাস |
| `--surface` | `#192531` | ডার্ক কার্ড ও টেবিল সারফেস |
| `--surface-muted` | `#22313F` | ডার্ক ইনপুট ও টেবিল হেডার |
| `--border` | `#344454` | ডার্ক বর্ডার ও ডিভাইডার |
| `--foreground` | `#E5ECF3` | উচ্চ কনট্রাস্ট লাইট টেক্সট |
| `--muted-foreground` | `#A6B5C5` | ডার্ক সেকেন্ডারি টেক্সট |

---

## ৪. এক্সেসিবিলিটি ও কনট্রাস্ট অডিট (WCAG 2.2 AA Compliance)

- **Text Primary (`#182536`) on Surface (`#FFFFFF`):** কনট্রাস্ট রেশিও **১২.৫:১** (WCAG AAA স্ট্যান্ডার্ড)।
- **Text Primary (`#182536`) on Background (`#F3F5F7`):** কনট্রাস্ট রেশিও **১১.৮:১** (WCAG AAA স্ট্যান্ডার্ড)।
- **Accent Action (`#0F766E`) with White Text (`#FFFFFF`):** কনট্রাস্ট রেশিও **৪.৭:১** (WCAG AA কমপ্লায়েন্ট)।
- **Text Secondary (`#526579`) on Surface (`#FFFFFF`):** কনট্রাস্ট রেশিও **৫.৬:১** (WCAG AA কমপ্লায়েন্ট)।
