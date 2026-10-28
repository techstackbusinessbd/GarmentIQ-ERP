# সেন্ট্রালাইজড ডিজাইন টোকেনস ও জিরো ইনলাইন স্টাইল নীতি (Centralized Design Tokens Policy)

> 🛑 **পরম অনুশাসন (Rule 20)**:  
> রিঅ্যাক্ট ফ্রন্টএন্ডের কোনো কম্পোনেন্ট, স্ক্রিন বা JSX ফাইলে **ইনলাইন স্টাইলিং (`style={{ ... }}`) বা অ্যাড-হক হেক্স কোড ক্লাস (`bg-[#123456]`, `text-[#0f766e]`) ব্যবহার করা সম্পূর্ণ নিষিদ্ধ**। সফটওয়্যারের সমস্ত কালার, টাইপোগ্রাফি, স্পেসিং, বর্ডার রেডিয়াস, শ্যাডো এবং গ্রিড ডেনসিটি অবশ্যই সেন্ট্রাল ফাইল (`src/index.css`)-এর **GarmentIQ প্রিমিয়াম আই-কমফোর্ট ডিজাইন টোকেনস (Design Tokens)** থেকে আসতে হবে।

---

## ১. ❌ যা কোনো ফাইলে থাকা সম্পূর্ণ নিষিদ্ধ (Forbidden Styles)

### ১. কোনো ইনলাইন স্টাইল অবজেক্ট (`style={{ ... }}`) লেখা যাবে না:
```jsx
// ❌ সম্পূর্ণ নিষিদ্ধ (Inline Style Object)
<div style={{ backgroundColor: '#142b45', padding: '16px', borderRadius: '8px' }}>
  <span style={{ color: '#0f766e', fontSize: '14px' }}>Active Order</span>
</div>
```

### ২. আর্বিট্রারি হার্ডকোডেড হেক্স বা পিক্সেল ক্লাস লেখা যাবে না:
```jsx
// ❌ সম্পূর্ণ নিষিদ্ধ (Arbitrary inline values scattered in classes)
<button className="bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] px-[18px] py-[9px]">
  Save PO
</button>
```

---

## ২. সেন্ট্রালাইজড ডিজাইন টোকেনস আর্কিটেকচার (`src/index.css`)

Tailwind CSS v4-এর আধুনিক `@theme inline` এবং CSS ভ্যারিয়েবল ব্যবহার করে একটি সেন্ট্রাল ফাইলে সমস্ত ডিজাইন টোকেন সংজ্ঞায়িত থাকবে:

```css
/* frontend/src/index.css */
@import "tailwindcss";

@theme inline {
  /* [EN] Structural Navy / [BN] কাঠামোগত নেভি ব্র্যান্ড টোকেন */
  --color-primary: var(--primary);              /* #142B45 */
  --color-primary-hover: var(--primary-hover);  /* #1D3B5A */
  --color-primary-soft: var(--primary-soft);    /* #E8EEF4 */

  /* [EN] Primary Action Accent / [BN] প্রাইমারি অ্যাকশন টিল টোকেন */
  --color-accent: var(--accent);                /* #0F766E */
  --color-accent-hover: var(--accent-hover);    /* #115E59 */

  /* [EN] Workspace Canvas & Surfaces / [BN] ক্যানভাস ও সারফেস */
  --color-background: var(--background);        /* #F3F5F7 */
  --color-surface: var(--surface);              /* #FFFFFF */
  --color-surface-muted: var(--surface-muted);  /* #EAF0F4 */

  /* [EN] Typography & Lines / [BN] টাইপোগ্রাফি ও বর্ডার */
  --color-border: var(--border);                /* #D8E0E8 */
  --color-foreground: var(--foreground);        /* #182536 */
  --color-muted-foreground: var(--muted-foreground); /* #526579 */

  /* [EN] Semantic Status / [BN] সেমান্টিক স্ট্যাটাস টোকেন */
  --color-success: var(--success);              /* #15803D */
  --color-warning: var(--warning);              /* #B45309 */
  --color-danger: var(--danger);                /* #B91C1C */
  --color-info: var(--info);                    /* #1D4ED8 */

  /* [EN] Fonts & Radii / [BN] ফন্ট ও বর্ডার রেডিয়াস */
  --font-sans: "Inter", "Noto Sans Bengali", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --radius-card: 0.625rem;                      /* 10px */
}
```

---

## ৩. ✅ সঠিক ও অনুমোদিত কম্পোনেন্ট ব্যবহার (Using Central Tokens)

কম্পোনেন্টে সরাসরি সেন্ট্রালাইজড সেমান্টিক ক্লাস ও টোকেন ব্যবহার করতে হবে:

```jsx
// ✅ অনুমোদিত প্রাইমারি অ্যাকশন বাটন (CTA)
<button className="rounded-md bg-accent px-4 py-2 text-white hover:bg-accent-hover shadow-xs focus:ring-2 focus:ring-accent/20">
  Confirm Order
</button>

// ✅ অনুমোদিত সেকেন্ডারি বাটন
<button className="rounded-md border border-border bg-surface px-4 py-2 text-foreground hover:bg-surface-muted">
  Cancel
</button>

// ✅ অনুমোদিত স্ট্যাটাস ব্যাজ
export const StatusBadge = ({ label, variant = 'success' }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-success border border-emerald-200">
      {label}
    </span>
  );
};
```

---

## ৪. একক মাস্টার লেআউট ও কালার অনুপাত গাইডলাইন

1. **৭০–৮০% ক্যানভাস ও সারফেস:** ব্যাকগ্রাউন্ড সর্বদা `bg-background` (`#F3F5F7`), কার্ড ও টেবিল `bg-surface` (`#FFFFFF`)।
2. **১০–১৮% নেভি স্ট্রাকচার:** সাইডবার ও ব্র্যান্ড এলিমেন্টে `bg-primary` (`#142B45`)।
3. **৫–৮% টিল অ্যাকশন:** প্রাইমারি বাটন (Save, Submit, Approve) এবং অ্যাক্টিভ ট্যাবে `bg-accent` (`#0F766E`)।
4. **১–৩% স্ট্যাটাস:** সতর্কতা ও এক্সেপশন চিপসে সুনির্দিষ্ট সেমান্টিক কালার।
5. **একক টপবার (Single Topbar Only):** ৬৪px হেডার, জিরো ২য় টপবার। ৩-লেভেল সাইডবার ন্যাভিগেশন।

---

## ৫. ফারহানার কিউএ ডিজাইন অডিট
ফারহানা চৌধুরী প্রতিটি ফ্রন্টএন্ড ফাইলের কোড রিভিউ করার সময় নিশ্চিত করবেন:
- [ ] ফাইলে কোনো `style={{ ... }}` উপস্থিত আছে কি না? (থাকলে ❌ REJECTED)।
- [ ] ফাইলে কোনো `[#hex]` বা আর্বিট্রারি ক্লাস লুকানো আছে কি না? (থাকলে ❌ REJECTED)।
- [ ] প্রাইমারি বাটন `bg-accent` ও সেকেন্ডারি বাটন `bg-surface border-border` মেনে চলেছে কি না?
- [ ] পেজের লেআউট সিঙ্গেল টপবার ও ৩-লেভেল সাইডবার আর্কিটেকচার মেনে চলছে কি না?
