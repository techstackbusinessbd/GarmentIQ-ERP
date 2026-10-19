# কম্পোনেন্ট অ্যানাটমি ও ভ্যারিয়েন্টস স্পেসিফিকেশন (Component Anatomy & Variants)

*প্রজেক্ট: GarmentIQ-ERP (RMG Enterprise Platform)*  
*তত্ত্বাবধায়ক: 👩‍💻 সাদিয়া জাহান (UI/UX Lead) ও 👨‍💼 তানভীর আহমেদ (Chief Architect)*  
*রেফারেন্স: [Rule 07](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 20](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Rule 21](file:///g:/ERP-Software/Garments-ERP/.agents/rules/21_component_based_ui_ux_architecture.md)*

---

## ১. বাটন কম্পোনেন্ট ম্যাট্রিক্স (Button Component Anatomy & Specs)

বাটনের প্রতিটি সাইজ, প্যাডিং ও ভ্যারিয়েন্ট নিচের ছক অনুযায়ী ১০০% অপরিবর্তনীয় থাকবে:

### ১.১ সাইজ ও ডাইমেনশন স্কেল
| সাইজ টোকেন | উচ্চতা (Height) | হরিজন্টাল প্যাডিং (PX) | ফন্ট সাইজ ও ওয়েট | আইকন সাইজ | ডোমেন ব্যবহার |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`xs`** | `28px` (`h-7`) | `10px` (`px-2.5`) | `11px` / SemiBold | 12px | টেবিল অ্যাকশন রো বাটন |
| **`sm`** | `32px` (`h-8`) | `12px` (`px-3`) | `12px` / SemiBold | 14px | ফিল্টার ও টুলবার বাটন |
| **`md` (ডিফল্ট)**| `40px` (`h-10`) | `16px` (`px-4`) | `14px` / SemiBold | 16px | **স্ট্যান্ডার্ড ফর্ম ও পেজ অ্যাকশন** |
| **`lg`** | `48px` (`h-12`) | `24px` (`px-6`) | `16px` / SemiBold | 18px | টাচস্ক্রিন কাটিং ফ্লোর বিগ বাটন |

### ১.২ ভ্যারিয়েন্ট ও স্টেট ম্যাট্রিক্স
| ভ্যারিয়েন্ট | ব্যাকগ্রাউন্ড ক্লাস | টেক্সট কালার | বর্ডার ক্লাস | হোভার স্টেট | ফোকাস রিং |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`primary`** | `bg-brand-accent` | `text-white` | `border-transparent` | `hover:bg-brand-accent-hover` | `ring-2 ring-brand-accent/20` |
| **`secondary`**| `bg-surface-muted` | `text-text-primary` | `border-border-subtle` | `hover:bg-surface-hover` | `ring-2 ring-border-strong/30` |
| **`outline`** | `bg-transparent` | `text-brand-accent` | `border-brand-accent` | `hover:bg-brand-accent-light/30` | `ring-2 ring-brand-accent/20` |
| **`ghost`** | `bg-transparent` | `text-text-muted` | `border-transparent` | `hover:bg-surface-muted` | `ring-2 ring-surface-hover` |
| **`danger`** | `bg-status-danger` | `text-white` | `border-transparent` | `hover:opacity-90` | `ring-2 ring-status-danger/20` |

---

## ২. স্ট্যাটাস ব্যাজ কম্পোনেন্ট ম্যাট্রিক্স (Status Badge & Tag Specs)

| ভ্যারিয়েন্ট টাইপ | রেডিয়াস | প্যাডিং | টাইপোগ্রাফি | ব্যবহারের ক্ষেত্র |
| :--- | :--- | :--- | :--- | :--- |
| **`tag` (ডিফল্ট)** | `rounded-xs` (2px) | `px-2 py-0.5` | `text-micro font-semibold` | স্ট্যান্ডার্ড ডেটা টেবিল স্ট্যাটাস (Active, Pending, Rejected) |
| **`badge`** | `rounded-xs` (2px) | `px-2 py-0.5` | `text-micro font-medium` | ফেব্রিক টাইপ, বায়ার কোড, সাইজ ট্যাগ |
| **`pulse-dot`** | `rounded-xs` (2px) | `px-2 py-0.5` | টেক্সট + 6px লাইভ ডট | সুইং লাইন রানিং স্ট্যাটাস, লাইভ RFID রিডার লিসেনিং |

---

## ৩. ফর্ম ইনপুট ও সিলেক্ট কম্পোনেন্ট স্পেসিফিকেশন (Form Controls)

```
[Label: text-caption font-medium text-text-primary]
+-------------------------------------------------------------+
| [Leading Icon]  Input Value Text (14px)     [Clear / Action] | -> Height: 40px (h-10)
+-------------------------------------------------------------+
[Helper / Error Text: text-caption text-status-danger mt-1]
```

- **স্ট্যান্ডার্ড ফিল্ড হাইট**: `40px` (`h-10`), কাটিং ফ্লোর টাচ মোডে `48px` (`h-12`)।
- **ফোকাস রিং কন্ট্রাক্ট**: `focus:outline-hidden focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent`।
- **এরর স্টেট কন্ট্রাক্ট**: `border-status-danger focus:ring-status-danger/20 focus:border-status-danger`।
- **ডিজেবল্ড স্টেট**: `opacity-50 cursor-not-allowed bg-surface-muted`।

---

## ৪. মাস্টার ডেটা টেবিল স্পেসিফিকেশন (TanStack Table Specs)

গার্মেন্টস ফ্যাক্টরির দুটি নির্দিষ্ট ভিউ মোড বাধ্যতামূলক:

| স্পেসিফিকেশন আইটেম | ১. স্ট্যান্ডার্ড অফিস ভিউ (Default) | ২. হাই-ডেনসিটি শপ ফ্লোর ভিউ (High-Density) |
| :--- | :--- | :--- |
| **রো হাইট (Row Height)** | `48px` (`py-3.5 px-4`) | `36px` (`py-2 px-3`) |
| **হেডার টাইপোগ্রাফি** | `text-caption font-semibold uppercase` | `text-micro font-bold uppercase` |
| **ডেটা সেল টাইপোগ্রাফি** | `text-body-sm font-normal text-text-primary` | `text-caption font-normal text-text-primary` |
| **সংখ্যা কলাম এলাইনমেন্ট**| ডানপাশে (Right-Aligned) `tabular-nums font-mono`| ডানপাশে (Right-Aligned) `tabular-nums font-mono`|
| **টেক্সট কলাম এলাইনমেন্ট** | বামপাশে (Left-Aligned) | বামপাশে (Left-Aligned) |
| **অ্যাকশন বাটন কলাম** | কেন্দ্র (Centered) অথবা ডানপাশে | কেন্দ্র (Centered) |
| **হোভার ট্রানজিশন** | `hover:bg-surface-hover/80 transition-colors` | `hover:bg-surface-hover/80 transition-colors` |

---

## ৫. কেপিআই মেট্রিক কার্ড অ্যানাটমি (`MetricCard.jsx`)

```
+-------------------------------------------------------------+
| Active Orders (PO) [text-caption uppercase]    [Shirt Icon] |
| 48 Styles          [text-display font-mono tabular-nums]     |
| 1.2M Pcs Pipeline  [text-caption text-status-success mt-1]   |
+-------------------------------------------------------------+
Border: 1px border-border-subtle | Radius: 6px rounded-card | Padding: 20px (p-5)
```

---

## ৬. ডায়ালগ ও মোডাল উইন্ডো অ্যানাটমি (Modal & Drawer Specs)

1. **ব্যাকড্রপ**: `bg-slate-950/50 backdrop-blur-xs z-50`।
2. **ডায়ালগ উইন্ডো**: `bg-surface-card border border-border-subtle rounded-modal shadow-2xl`।
3. **হেডার**: টাইটেল (`text-h2`), সাবটাইটেল (`text-caption text-text-muted`) এবং ক্লোজ বাটন (`X` icon)।
4. **ফুটার বাটন গ্রুপ**: ডানপাশে সারিবদ্ধ — ক্যানসেল বাটন (`variant="secondary"`) ও কনফার্ম বাটন (`variant="primary"` বা `variant="danger"`).
