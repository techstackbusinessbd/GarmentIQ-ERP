# ১০০% কম্পোনেন্ট-ভিত্তিক UI/UX আর্কিটেকচার নীতি (100% Component-Driven UI/UX Architecture Policy)

> 🛑 **পরম অনুশাসন (Rule 21)**:  
> গার্মেন্টসের এই এন্টারপ্রাইজ ইআরপি সিস্টেমের ফ্রন্টএন্ড UI/UX **১০০% কম্পোনেন্ট-ভিত্তিক (Component-Based)** হতে হবে। কোনো পেজ, ভিউ বা স্ক্রিন ফাইলে কখনো মনোলিথিক ইনলাইন এইচটিএমএল/জেএসএক্স ব্লক (`<table>`, `<input>`, `<button>`, বা কার্ডের এলোমেলো `<div>`) লিখে পেজ ভর্তি করা সম্পূর্ণ নিষিদ্ধ (❌ FORBIDDEN)। পুরো সিস্টেমটি রিইউজেবল, সেলফ-কন্টেইন্ড, ডিকাপল্ড এবং অত্যন্ত নিট ও ক্লিন মডুলার কম্পোনেন্ট দ্বারা গঠিত হতে হবে।

---

## ১. ❌ যা কোনো পেজ বা ফাইলে থাকা সম্পূর্ণ নিষিদ্ধ (Forbidden Monolithic Coding)

### ১. পেজ ফাইলে ইনলাইন টেবিল, ফর্ম বা কার্ডের মেগা-ব্লক লেখা যাবে না:
```jsx
// ❌ সম্পূর্ণ নিষিদ্ধ: পেজ ফাইলে সরাসরি র-এইচটিএমএল ও দীর্ঘ কোড
export default function OrderListPage() {
  return (
    <div className="p-6">
      <h1>Orders</h1>
      {/* ❌ নিষিদ্ধ: ইনলাইন টেবিল ও রো মার্কআপ পেজের পেটে লেখা */}
      <table className="min-w-full">
        <thead>
          <tr><th>Order #</th><th>Buyer</th><th>Style</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.orderNo}</td>
              {/* ❌ নিষিদ্ধ: ইনলাইন স্ট্যাটাস ব্যাজ ও বাটন */}
              <td><span className="bg-green-100 text-green-800 p-1 rounded">Active</span></td>
              <td><button className="bg-blue-600 text-white px-3 py-1">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## ২. ✅ ৪-স্তরের কম্পোনেন্ট হায়ারার্কি (4-Tier Modular Component Architecture)

পুরো ফ্রন্টএন্ডের কম্পোনেন্টগুলো নিচের ৪টি সুনির্দিষ্ট স্তরে বিভক্ত থাকবে:

```
frontend/src/
├── components/
│   ├── ui/             # স্তর ১: UI Primitives & Atoms (বাটন, ব্যাজ, ইনপুট, ড্রপডাউন, মোডাল)
│   ├── composite/      # স্তর ২: Composite Molecules (PageHeader, MetricCard, DataTable, FormField)
│   └── layout/         # স্তর ৩: Layouts & Shells (AppLayout, Sidebar, TopHeader, ThemeSwitcher)
└── features/
    └── {module}/
        ├── components/ # স্তর ৪: Domain Organisms (BuyerOrderGrid, MarkerRatioCard, WashBatchTable)
        └── pages/      # পেজ ভিউ (শুধুমাত্র অর্গানিজম ও মলিকিউলের পাতলা অর্কেস্ট্রেশন)
```

### স্তর ১: মৌলিক উপাদান — UI Primitives / Atoms (`src/components/ui/`)
- **বৈশিষ্ট্য**: অত্যন্ত হালকা, খাঁটি প্রেজেন্টেশনাল (Stateless/Minimal State), সম্পূর্ণ প্রপস-চালিত এবং কোনো ব্যবসায়িক যুক্তি (Business Logic) মুক্ত।
- **ম্যান্ডেটরি কম্পোনেন্টস**:
  - `Button.jsx` (Primary, Secondary, Outline, Ghost, Danger ভ্যারিয়েন্ট; `isLoading`, `icon`, `size`)
  - `Badge.jsx` ও `StatusBadge.jsx` (Semantic status pills: Active, Pending, Shipped, Defective)
  - `TextInput.jsx`, `NumberInput.jsx`, `Select.jsx`, `Checkbox.jsx`, `ToggleSwitch.jsx`
  - `Modal.jsx` (শুধুমাত্র "ভেরি স্মল" মাইক্রো-ডায়ালগ ও প্রম্পট; কোনো এনটিটি বা ফর্ম নিষিদ্ধ — রুল ২৭), `Drawer.jsx`, `Popover.jsx`, `Tooltip.jsx`, `DropdownMenu.jsx`
  - `SkeletonLoader.jsx`, `Spinner.jsx`, `EmptyState.jsx`, `Avatar.jsx`, `AlertBanner.jsx`

### স্তর ২: সমন্বিত কন্ট্রোল — Composite Molecules (`src/components/composite/`)
- **বৈশিষ্ট্য**: একাধিক অ্যাটম ও কনস্ট্রাক্ট মিলিয়ে তৈরি পুনর্ব্যবহারযোগ্য এন্টারপ্রাইজ কন্ট্রোল।
- **ম্যান্ডেটরি কম্পোনেন্টস**:
  - `PageHeader.jsx`: পেজ টাইটেল, সাবটাইটেল, ব্রেডক্রাম্ব এবং রাইট-অ্যালাইন্ড অ্যাকশন বাটনস।
  - `MetricCard.jsx`: কেপিআই ও অ্যানালিটিক্স কার্ড (আইকন, ভ্যালু, ট্রেন্ড ইন্ডিকেটর ও সাবটেক্সট)।
  - `DataTable.jsx`: ভার্চুয়ালাইজড TanStack Table গ্রিড (সার্চ, ফিল্টারিং, পেজিনেশন ও অ্যাকশন স্লট)।
  - `FormField.jsx`: লেবেল, ইনপুট স্লট, রিকোয়ার্ড এস্টেরিস্ক (`*`), হেল্পার টেক্সট ও ভ্যালিডেশন এরর।
  - `ConfirmDialog.jsx`: ডিলিট বা স্ট্যাটাস চেঞ্জের জন্য রিইউজেবল মাইক্রো-কনফার্মেশন প্রম্পট (রুল ২৭ অনুসারী)।

### স্তর ৩: ফ্রেমওয়ার্ক ও ফ্রেম — Layouts & Shells (`src/components/layout/`)
- **ম্যান্ডেটরি কম্পোনেন্টস**:
  - `AppLayout.jsx`: একক সেন্ট্রাল মাস্টার শেল।
  - `Sidebar.jsx`: কোল্যাপসিবল নেভিগেশন বার উইথ রোল-বেসড মেনু।
  - `TopHeader.jsx`: গ্লোবাল সার্চ, সিস্টেম নোটিফিকেশন, ইউজার প্রোফাইল।
  - `ThemeSwitcher.jsx`: ৪টি প্রিমিয়াম থিম টগল ড্রপডাউন।
  - `Breadcrumbs.jsx`: অটোমেটিক রুট-বেসড নেভিগেশন পাথ।

### স্তর ৪: ডোমেন অর্গানিজম — Domain-Specific Organisms (`src/features/{module}/components/`)
- **বৈশিষ্ট্য**: ডোমেন-নির্দিষ্ট জটিল ব্যবসায়িক ডেটা ও ফর্ম ডিসপ্লে।
- **উদাহরণ**: `BuyerOrderGrid.jsx`, `FabricRollMatrix.jsx`, `MarkerRatioOptimizer.jsx`, `BundleTrackingCard.jsx`, `DenimWashRecipePanel.jsx`।

---

## ৩. ✅ অনুমোদিত কম্পোনেন্ট-ভিত্তিক পেজের আদর্শ রূপ (The Approved Pattern)

প্রতিটি পেজ ফাইল হবে শুধুমাত্র সংশ্লিষ্ট কম্পোনেন্টগুলোর একটি পরিচ্ছন্ন অর্কেস্ট্রেশন (Orchestration Layer):

```jsx
// ✅ অনুমোদিত পদ্ধতি: ১০০% কম্পোনেন্ট-ভিত্তিক ও পরিষ্কার
import { PageHeader } from '@/components/composite/PageHeader';
import { MetricCard } from '@/components/composite/MetricCard';
import { BuyerOrderGrid } from '@/features/merchandising/components/BuyerOrderGrid';
import { useBuyerOrders } from '@/features/merchandising/hooks/useBuyerOrders';

export default function OrderListPage() {
  const { orders, metrics, isLoading, handleCreateOrder } = useBuyerOrders();

  return (
    <div className="space-y-6">
      {/* ১. রিইউজেবল পেজ হেডার কম্পোনেন্ট */}
      <PageHeader
        title="Buyer Purchase Orders"
        subtitle="Manage export garments contracts, style BOMs, and delivery schedules"
        actionLabel="New Purchase Order"
        onAction={handleCreateOrder}
      />

      {/* ২. রিইউজেবল মেট্রিক কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {metrics.map(metric => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* ৩. রিইউজেবল ডোমেন অর্গানিজম (TanStack DataTable সমৃদ্ধ) */}
      <BuyerOrderGrid data={orders} isLoading={isLoading} />
    </div>
  );
}
```

---

## ৪. কম্পোনেন্ট ইঞ্জিনিয়ারিংয়ের ৯টি সুনির্দিষ্ট অনুশাসন (Core Rules)

1. **সিঙ্গেল রেসপনসিবিলিটি (Single Responsibility Principle - SRP)**:
   - একটি কম্পোনেন্ট শুধুমাত্র একটি সুনির্দিষ্ট কাজের দায়িত্ব পালন করবে।
2. **ফাইল সাইজ অনুর্ধ্ব ৩০০ লাইন (Rule 07 Compliance)**:
   - কোনো কম্পোনেন্ট ফাইল কখনোই ৩০০ লাইনের সীমা অতিক্রম করবে না। বড় কম্পোনেন্টকে তাৎক্ষণিকভাবে সাব-কম্পোনেন্টে ভাগ করতে হবে।
3. **কন্টেইনার বনাম প্রেজেন্টেশনাল পৃথকীকরণ (Separation of Concerns)**:
   - প্রেজেন্টেশনাল কম্পোনেন্ট শুধুমাত্র Props গ্রহণ করবে এবং Event Emit করবে (`onClick`, `onChange`)। ডেটা ফেচিং এবং লজিক কাস্টম হুক বা স্টোরে থাকবে।
4. **কম্পোজিশন বনাম ইনহেরিটেন্স (`children` & Slots)**:
   - কম্পোনেন্টগুলোকে অত্যন্ত নমনীয় রাখতে `children` বা নির্দিষ্ট স্লট প্রপস (`leadingIcon`, `actions`, `footer`) ব্যবহার করতে হবে।
5. **স্ট্যান্ডার্ড প্রপস ইন্টারফেস ও ডিফল্ট ভ্যালু**:
   - প্রতিটি কম্পোনেন্টে পরিষ্কার প্রপস ইন্টারফেস (`variant`, `size`, `disabled`, `isLoading`, `className`) এবং ডিফল্ট মান থাকতে হবে।
6. **জিরো মার্কআপ ডুপ্লিকেশন (DRY - Don't Repeat Yourself)**:
   - একই ধরনের বাটন, ইনপুট বা কার্ড দুই জায়গায় আলাদা করে মার্কআপ লেখা যাবে না; সার্বজনীন কম্পোনেন্ট ব্যবহার করতে হবে।
7. **সেন্ট্রালাইজড ডিজাইন টোকেনস সমন্বয় (Rule 20 Compliance)**:
   - কম্পোনেন্টে কোনো আর্বিট্রারি হেক্স কালার বা ইনলাইন স্টাইল থাকতে পারবে না; সব স্টাইলিং `@theme` টোকেন চালিত হবে।
8. **সেন্ট্রালাইজড কনস্ট্যান্টস সমন্বয় (Rule 19 Compliance)**:
   - কোনো হার্ডকোডেড লেবেল থাকবে না; সমস্ত টেক্সট সেন্ট্রাল কনস্ট্যান্টস থেকে আসবে।
9. **অ্যাক্সেসিবিলিটি ও কীবোর্ড নেভিগেশন (A11y)**:
   - উপযুক্ত ARIA রোলস, কীবোর্ড ট্র্যাভার্সাল (`Tab`, `Esc`) এবং ভিজ্যুয়াল ফোকাস রিং নিশ্চিত করতে হবে।

---

## ৫. ফারহানা চৌধুরীর কিউএ কম্পোনেন্ট অডিট গেট (QA Acceptance Gate)

ফারহানা চৌধুরী যেকোনো ফ্রন্টএন্ড পিআর বা কোড অডিটের সময় নিচের চেকলিস্ট অনুসরণ করবেন:
- [ ] পেজ বা ভিউ ফাইলে সরাসরি র-এইচটিএমএল `<button>`, `<input>`, বা `<table>` লেখা হয়েছে কি না? (থাকলে ❌ **REJECTED**)।
- [ ] ব্যবহৃত প্রতিটি বাটন, ব্যাজ ও ইনপুট `src/components/ui/` থেকে ইমপোর্ট করা কি না? (না হলে ❌ **REJECTED**)।
- [ ] প্রতিটি কম্পোনেন্ট ফাইল ৩০০ লাইনের মধ্যে সীমাবদ্ধ কি না? (না হলে ❌ **REJECTED**)।
- [ ] কম্পোনেন্টের প্রপস ও ইভেন্ট হ্যান্ডলার স্পষ্টভাবে সংজ্ঞায়িত কি না?
- [ ] স্ক্রিনের বিভিন্ন স্থানে একই ধরণের উপাদানের ভিজ্যুয়াল লুক ও অনুভূতির শতভাগ সামঞ্জস্য আছে কি না?
