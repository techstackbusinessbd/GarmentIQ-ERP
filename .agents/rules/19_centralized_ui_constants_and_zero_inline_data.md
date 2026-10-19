# সেন্ট্রালাইজড ইউআই কনস্ট্যান্টস ও জিরো ইনলাইন ডেটা নীতি (Centralized UI Constants Policy)

> 🛑 **পরম অনুশাসন (Rule 19)**:  
> রিঅ্যাক্ট ফ্রন্টএন্ডের কোনো কম্পোনেন্ট, স্ক্রিন বা JSX ফাইলে **ইনলাইন স্ট্যাটিক ডেটা (Inline Static Data) লেখা সম্পূর্ণ নিষিদ্ধ**। যদি UI/UX পরিচালনার জন্য কোনো স্ট্যাটিক কনফিগারেশন, মেনু আইটেম, ব্যাজ কালার ম্যাপিং বা ডিফল্ট সেটিং প্রয়োজন হয়, তবে তা অবশ্যই সেন্ট্রাল কনস্ট্যান্ট ডিরেক্টরি (`src/constants/`) থেকে ইমপোর্ট করে ব্যবহার করতে হবে।

---

## ১. ❌ যা কোনো কম্পোনেন্টে সরাসরি করা যাবে না (Inline Prohibitions)
কোনো JSX কম্পোনেন্টের ভেতর সরাসরি অ্যারে বা অবজেক্ট ডিক্লেয়ার করা নিষিদ্ধ:
```jsx
// ❌ সম্পূর্ণ নিষিদ্ধ (Anti-pattern: Inline Static Data in Component)
const OrderFilter = () => {
  const departments = ['Men', 'Women', 'Kids']; // ❌ ইনলাইন অ্যারে নিষিদ্ধ
  const statuses = [                             // ❌ ইনলাইন অবজেক্ট নিষিদ্ধ
    { id: 'DRAFT', label: 'Draft' },
    { id: 'CONFIRMED', label: 'Confirmed' }
  ];
  return ( ... );
};
```

---

## ২. সেন্ট্রালাইজড ডিরেক্টরি কাঠামো (Centralized Single Source of Truth)

ফ্রন্টএন্ডের সমস্ত স্ট্যাটিক কনফিগারেশন একটি নির্দিষ্ট সেন্ট্রাল ফোল্ডারে থাকবে:

```
frontend/src/constants/
├── index.js              # সমস্ত কনস্ট্যান্ট এক্সপোর্ট করার ব্যারেল ফাইল
├── navigation.js         # সাইডবার মেনু, রুট পাথ ও আইকন কনফিগারেশন
├── statusThemes.js       # স্ট্যাটাস ব্যাজের Tailwind v4 কালার ও লেবেল ম্যাপিং
├── pagination.js         # ডেটা টেবিলের ডিফল্ট পেজ সাইজ ও লিমিট
├── dateFormats.js        # আন্তর্জাতিক তারিখ ও সময় ফরম্যাট টোকেন
└── uiConfig.js           # অ্যাপ নেম, কপিরাইট ও ড্যাশবোর্ড গ্রিড স্পেসিং
```

---

## ৩. ✅ সঠিক ও অনুমোদিত পদ্ধতি (Centralized Import Pattern)

সব সময় সেন্ট্রাল ফাইল থেকে ইমপোর্ট করে ব্যবহার করতে হবে:

```jsx
// ✅ অনুমোদিত পদ্ধতি (Clean, Maintainable, Centralized)
import { ORDER_STATUS_CONFIG } from '@/constants/statusThemes';
import { TABLE_PAGINATION_LIMITS } from '@/constants/pagination';

export const OrderTable = () => {
  // সেন্ট্রাল কনফিগারেশন ব্যবহার করা হচ্ছে
  const activeConfig = ORDER_STATUS_CONFIG['CONFIRMED'];
  return (
    <span className={activeConfig.badgeClass}>
      {activeConfig.label}
    </span>
  );
};
```

---

## ৪. ডাইনামিক ডেটা বনাম সেন্ট্রাল কনস্ট্যান্টসের পার্থক্য

| ক্যাটাগরি | কোথায় থাকবে | উদাহরণ |
| :--- | :--- | :--- |
| **ব্যবসায়িক ডেটা (Operational Data)** | ১০০% পোস্টগ্রেসকিউএল ডেটাবেজ ➔ এপিআই (রুল ৫) | বায়ার তালিকা, সাইজ, ইউনিট, ফ্যাব্রিক টাইপ, অর্ডার কোয়ান্টিটি। |
| **ইউআই কনফিগারেশন (UI Settings)** | `frontend/src/constants/` (রুল ১৯) | সাইডবার রুট, টেবিলের কলাম উইথ, স্ট্যাটাস কালার প্যালেট, ডেট ফরম্যাট। |

---

## ৫. ফারহানার কিউএ গেটকিপার অডিট
ফারহানা চৌধুরী প্রতিটি ফ্রন্টএন্ড ফাইলে অডিট করবেন:
- [ ] কম্পোনেন্টের ভেতরে কোনো ইনলাইন ড্রপডাউন অপশন বা হার্ডকোডেড অ্যারে আছে কি? (থাকলে ❌ REJECTED)।
- [ ] সমস্ত স্ট্যাটিক সেটিংস `src/constants/` থেকে ক্লিনলি ইমপোর্ট করা হয়েছে কি না?
