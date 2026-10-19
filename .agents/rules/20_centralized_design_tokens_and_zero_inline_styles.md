# সেন্ট্রালাইজড ডিজাইন টোকেনস ও জিরো ইনলাইন স্টাইল নীতি (Centralized Design Tokens Policy)

> 🛑 **পরম অনুশাসন (Rule 20)**:  
> রিঅ্যাক্ট ফ্রন্টএন্ডের কোনো কম্পোনেন্ট, স্ক্রিন বা JSX ফাইলে **ইনলাইন স্টাইলিং (`style={{ ... }}`) বা অ্যাড-হক হেক্স কোড ক্লাস (`bg-[#123456]`) ব্যবহার করা সম্পূর্ণ নিষিদ্ধ**। সফটওয়্যারের সমস্ত কালার, টাইপোগ্রাফি, স্পেসিং, বর্ডার রেডিয়াস, শ্যাডো এবং গ্রিড ডেনসিটি অবশ্যই সেন্ট্রাল ফাইল (`src/index.css`)-এর **ডিজাইন টোকেনস (Design Tokens)** থেকে আসতে হবে।

---

## ১. ❌ যা কোনো ফাইলে থাকা সম্পূর্ণ নিষিদ্ধ (Forbidden Inline Styles)

### ১. কোনো ইনলাইন স্টাইল অবজেক্ট (`style={{ ... }}`) লেখা যাবে না:
```jsx
// ❌ সম্পূর্ণ নিষিদ্ধ (Inline Style Object)
<div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px' }}>
  <span style={{ color: '#10b981', fontSize: '14px' }}>Active Order</span>
</div>
```

### ২. আর্বিট্রারি হার্ডকোডেড হেক্স বা পিক্সেল ক্লাস লেখা যাবে না:
```jsx
// ❌ সম্পূর্ণ নিষিদ্ধ (Arbitrary inline values scattered in classes)
<button className="bg-[#4f46e5] hover:bg-[#4338ca] text-[#ffffff] px-[18px] py-[9px]">
  Save
</button>
```

---

## ২. সেন্ট্রালাইজড ডিজাইন টোকেনস আর্কিটেকচার (`src/index.css`)

Tailwind CSS v4-এর আধুনিক `@theme` এবং CSS ভ্যারিয়েবল ব্যবহার করে একটি সেন্ট্রাল ফাইলে সমস্ত ডিজাইন টোকেন সংজ্ঞায়িত থাকবে:

```css
/* frontend/src/index.css */
@import "tailwindcss";

@theme {
  /* [EN] Brand Colors / [BN] ব্র্যান্ডের মূল কালার টোকেন */
  --color-brand-primary: #0f172a;       /* Slate 900 */
  --color-brand-accent: #4f46e5;        /* Indigo 600 */
  --color-brand-accent-hover: #4338ca;  /* Indigo 700 */

  /* [EN] Surface & Backgrounds / [BN] ব্যাকগ্রাউন্ড ও সারফেস কালার */
  --color-surface-base: #f8fafc;        /* Slate 50 */
  --color-surface-card: #ffffff;        /* Pure White */
  --color-surface-muted: #f1f5f9;       /* Slate 100 */

  /* [EN] Border & Dividers / [BN] বর্ডার ও ডিভাইডার টোকেন */
  --color-border-subtle: #e2e8f0;       /* Slate 200 */
  --color-border-strong: #cbd5e1;       /* Slate 300 */

  /* [EN] Status Semantic Tokens / [BN] স্ট্যাটাস সেমান্টিক টোকেন */
  --color-status-success: #059669;      /* Emerald 600 */
  --color-status-warning: #d97706;      /* Amber 600 */
  --color-status-danger: #e11d48;       /* Rose 600 */
  --color-status-info: #0284c7;         /* Sky 600 */

  /* [EN] Typography & Radii / [BN] ফন্ট ও বর্ডার রেডিয়াস */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --radius-subtle: 0.375rem;            /* 6px */
  --radius-card: 0.5rem;                /* 8px */
}
```

---

## ৩. ✅ সঠিক ও অনুমোদিত কম্পোনেন্ট ব্যবহার (Using Central Tokens)

কম্পোনেন্টে সরাসরি সেন্ট্রালাইজড ক্লাস ও টোকেন ব্যবহার করতে হবে:

```jsx
// ✅ অনুমোদিত পদ্ধতি: সম্পূর্ণ সেন্ট্রালাইজড ডিজাইন টোকেন চালিত
export const StatusBadge = ({ label, variant = 'success' }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-subtle text-xs font-medium bg-emerald-50 text-status-success border border-emerald-200">
      {label}
    </span>
  );
};
```

---

## ৪. এই নীতির মূল এন্টারপ্রাইজ সুবিধা (Single Source of Truth)
1. **এক ক্লিকে পুরো সিস্টেম থিমিং**: বাটন বা ফন্টের স্টাইল পরিবর্তন করতে চাইলে শত শত ফাইলে খোঁজাখুঁজি না করে শুধুমাত্র `index.css`-এর একটি টোকেন পরিবর্তন করলেই পুরো সফটওয়্যারে তা সাথে সাথে প্রতিফলিত হবে।
2. **জিরো সিএসএস ক্যাওস**: কোডের কোথাও ডুপ্লিকেট বা অসংলগ্ন মার্জিন/প্যাডিং তৈরি হবে না।
3. **হাই-ডেনসিটি ফ্লোর ভিউ**: কাটিং ও সুইং ফ্লোরের জন্য ডেনসিটি টোকেন সেন্ট্রালি স্কেল করা সম্ভব।

---

## ৫. ফারহানার কিউএ ডিজাইন অডিট
ফারহানা চৌধুরী প্রতিটি ফ্রন্টএন্ড ফাইলের কোড রিভিউ করার সময় নিশ্চিত করবেন:
- [ ] ফাইলে কোনো `style={{ ... }}` উপস্থিত আছে কি না? (থাকলে ❌ REJECTED)।
- [ ] ফাইলে কোনো `[#hex]` বা আর্বিট্রারি ক্লাস লুকানো আছে কি না? (থাকলে ❌ REJECTED)।
- [ ] সমস্ত স্টাইলিং সেন্ট্রাল ডিজাইন টোকেন মেনে চলেছে কি না?
- [ ] অন্য কোনো পেজের সাথে লেআউট, মার্জিন বা কালারের অমিল আছে কি না? (থাকলে ❌ REJECTED)।

---

## ৬. ১০০% অভিন্ন লেআউট ও ডিজাইন কনসিস্টেন্সি অনুশাসন (Zero Visual Inconsistency)
> 🛑 **বসের সরাসরি নির্দেশ**:  
> *"design, layout full system er jonno same hoba diffrent page diffrent layout, desing, color, spacing, etc hoba na"*

1. **একক মাস্টার লেআউট ফ্রেমওয়ার্ক (`AppLayout.jsx`)**:
   - প্রতিটি পেজ একই সাইডবার উইডথ (`w-64`), একই টপ হেডার (`h-16`) এবং একই মেইন র‍্যাপার প্যাডিং (`p-6 lg:p-8`) মেনে চলবে। কোনো পেজ নিজস্ব আলাদা সাইডবার বা লেআউট ব্যবহার করতে পারবে না।
2. **একক পেজ হেডার স্ট্রাকচার (`PageHeader.jsx`)**:
   - প্রতিটি পেজে একই ব্রেডক্রাম্ব হাইট ও ফন্ট, একই হেডার টাইটেল (`text-2xl font-bold tracking-tight text-slate-900 dark:text-white`), একই সাবটাইটেল এবং ডানপাশে একই প্রাইমারি/সেকেন্ডারি অ্যাকশন বাটন বিন্যাস থাকবে।
3. **একক কার্ড ও স্পেসিং গ্রিড**:
   - প্রতিটি সেকশনের মাঝে নির্দিষ্ট স্পেসিং (`space-y-6`), প্রতিটি কার্ডের ব্যাকগ্রাউন্ড (`bg-white dark:bg-slate-900`), বর্ডার (`border border-slate-200/80 dark:border-slate-800`), বর্ডার রেডিয়াস (`rounded-xl`), প্যাডিং (`p-6`) এবং সফট শ্যাডো (`shadow-xs`) পুরো সিস্টেমে ১০০% এক ও অভিন্ন হতে হবে।
4. **একক মাস্টার টেবিল সিস্টেম (`DataTable.jsx`)**:
   - মারচেন্ডাইজিং, কাটিং, ওয়াশিং, কোয়ালিটি বা কমার্শিয়াল—সব মডিউলের টেবিল হেডার, রো হাইট, ফন্ট ও কালার একই জেনেরিক TanStack Table র‍্যাপার থেকে রেন্ডার হবে। কোনো ডেভেলপার কোনো পেজে ভিন্ন রঙের বা ভিন্ন প্যাডিংয়ের টেবিল বানাতে পারবে না।
5. **একক ফর্ম কন্ট্রোলস কিট**:
   - সমস্ত ইনপুট ফিল্ড, সিলেক্ট ড্রপডাউন, ডেট পিকার এবং টেক্সটএরিয়ার বর্ডার, হাইট (`h-10`), ফোকাস রিং ও লেবেল ফন্ট হুবহু এক হবে।

