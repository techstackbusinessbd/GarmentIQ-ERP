# রুল ২৯: জিরো অপ্রয়োজনীয় টেক্সট নীতি — স্ক্রিনে যে টেক্সট না হলেই না, তা ছাড়া একটি বাড়তি অক্ষর বা শব্দও ব্যবহার সম্পূর্ণ নিষিদ্ধ (Zero Unnecessary Text & Ultra-Minimal Microcopy Policy)

> **পলিসি আইডি**: `RULE-29-ZERO-UNNECESSARY-TEXT`  
> **ক্যাটাগরি**: UI/UX Standards, Ergonomics, Visual De-Cluttering & Information Architecture  
> **প্রযোজ্য ক্ষেত্র**: ফ্রন্টএন্ডের সকল স্ক্রিন, হেডার, টেবিল কলাম, লেবেল, সাবটাইটেল, স্ট্যাটাস ব্যাজ, ড্রপডাউন ও ফুটনোট (`frontend/src/`)  
> **অনুমোদনকারী**: 👨‍💼 তানভীর আহমেদ *(Chief Architect & PM)*, 👨‍💻 আরিফুল ইসলাম *(Tech Lead)*, 👩‍💻 সাদিয়া জাহান *(Frontend Lead)*, 👩‍🔬 ফারহানা চৌধুরী *(QA Lead)*  
> **চূড়ান্ত অথরিটি**: 👨‍💼 **Product Director / CTO (স্যার)**  
> 🛑 **পরম অনুশাসন (Ironclad Mandate)**:  
> **"UI/UX ও স্ক্রিনে যে টেক্সট না হলেই না, কেবল সেটুকুই থাকবে। সেই অপরিহার্য টেক্সট ছাড়া একটি বাড়তি অক্ষর বা শব্দও ব্যবহার করা সম্পূর্ণ নিষিদ্ধ (Not a single extra letter or word is allowed on any screen unless 100% indispensable)। কোনো বড় লেকচার, দীর্ঘ সাবটাইটেল, স্বতঃসিদ্ধ লেবেল, টেবিল হেডারে ইমোজি বা বাড়তি ব্যাখ্যামূলক ফুটনোট থাকবে না। প্রতিটি দৃশ্যমান টেক্সট হতে হবে আল্ট্রা-মিনিমাল, তীক্ষ্ণ, সুস্পষ্ট ও কার্যমুখী।"**

---

## ১. কোর ভিশন ও সমস্যা প্রেক্ষাপট (Core Vision & Problem Statement)

একটি জটিল এন্টারপ্রাইজ ইআরপিতে ব্যবহারকারীরা কাজ করতে আসেন—পড়াশোনা বা প্রবন্ধ পড়তে নয়। স্ক্রিনের ভেতর অপ্রয়োজনীয় দীর্ঘ বাক্য বা ব্যাখ্যামূলক টেক্সট ঢুকিয়ে দিলে ইন্টারফেস অত্যন্ত ভারী, ক্লাটার্ড ও অপেশাদার মনে হয়।

### 🎯 দ্য গোল্ডেন স্ক্রিন টেস্ট (The "Is This Word Indispensable?" Test):
যেকোনো পেজ, বাটন, হেডার, টেবিল, ড্রপডাউন বা ব্যাজ বানানোর সময় ডেভেলপার ও ডিজাইনারকে এই একটি প্রশ্ন করতে হবে:  
> **"এই শব্দ বা অক্ষরটি বাদ দিলে কি ব্যবহারকারীর কাজ বিন্দুমাত্র ব্যাহত হবে?"**  
> যদি উত্তর হয় **"না"**, তবে সেই শব্দ বা অক্ষরটি স্ক্রিন থেকে **অবিলম্বে অপসারণ করা বাধ্যতামূলক**।

### ❌ স্ক্রিনে অপ্রয়োজনীয় টেক্সটের ক্ষতিকর রূপ:
1. **টেবিল হেডারে ইমোজি ও বড় শিরোনাম**: `🧭 Sidebar Menu`, `⚡ Standard CRUD Actions`, `🔐 Special Operations` ➔ এর বদলে একক শব্দ: `Menu`, `Actions`, `Special`।
2. **দীর্ঘ ব্যাকরণগত সাবটাইটেল**: পেজ হেডারে ২-৩ লাইনের দীর্ঘ প্রবন্ধ ("Configure fine-grained module overrides, individual operational clearances, and custom grants...") ➔ এর বদলে সর্বোচ্চ ৩-৫ শব্দের সংক্ষিপ্ত বাক্য অথবা সাবটাইটেল বাদ।
3. **স্বতঃসিদ্ধ লেবেল (Obvious Prefixes)**: যে তথ্য নিজেই স্পষ্ট, তার আগে লেবেল জুড়ে দেওয়া (যেমন: `Assigned Roles: [ADMIN]`, `Card: CARD-101`) ➔ সরাসরি ডাটা বা ব্যাজ প্রদর্শন।
4. **বাটন ও পিলের ভেতর ব্র্যাকেট ও অতিরিক্ত শব্দ**: `Visible (Role)`, `Visible (Special)`, `+2 Special Overrides` ➔ সরাসরি `Visible`, `+2`।
5. **টেবিলের নিচে উপদেশমূলক ফুটনোট**: "All special clearances are recorded to immutable audit history upon saving" ➔ সম্পূর্ণ নিষিদ্ধ ও অপসারিত।

---

## ২. টেক্সট সংক্ষেপকরণ ও ক্লিনআপ গাইডলাইন (De-Cluttering Standards)

| ক্ষেত্র | ❌ যা সম্পূর্ণ নিষিদ্ধ (Forbidden Text Clutter) | ✅ অনুমোদিত মিনিমাল টেক্সট (Approved Minimal) |
| :--- | :--- | :--- |
| **টেবিল কলাম হেডার** | `Subsystem Screen / Feature`, `Screen Name` | **`Feature`** |
| **টেবিল কলাম হেডার** | `🧭 Sidebar Menu`, `Menu Navigation` | **`Menu`** |
| **টেবিল কলাম হেডার** | `⚡ Standard CRUD Permissions / Actions` | **`Actions`** |
| **টেবিল কলাম হেডার** | `🔐 Special Operations / Advanced Permissions` | **`Special`** |
| **টেবিল কলাম হেডার** | `🎯 Clearance Status & Presets` | **`Status`** |
| **টেবিল কলাম হেডার** | `Module / Subsystem Information` | **`Module`** |
| **পেজ সাবটাইটেল** | "Configure fine-grained module overrides, individual operational clearances..." (১৪ শব্দ) | "Role clearances & permissions" (৪ শব্দ) |
| **ইউজার রোলস ডিসপ্লে** | `Assigned Roles: [ADMIN]` | সরাসরি ব্যাজ: `[ADMIN]` |
| **ইনলাইন মেট্রিক্স** | `Role Baseline: 21 • Special Overrides: +2 • Total Effective: 23 of 29` | `21 Base • +2 Custom • 23/29 Total` |
| **মেনু ভিজিবিলিটি বাটন** | `Visible (Role)`, `Visible (Special)` | `Visible` (টুলটিপে কোড দৃশ্যমান) |
| **মডিউল স্ট্যাটাস ব্যাজ** | `+1 Special Overrides` | `+1` অথবা `+1 Override` |
| **সার্চ প্লেসহোল্ডার** | "Search modules or clearance actions in this domain..." | "Search modules..." |
| **ড্রপডাউন প্লেসহোল্ডার** | "Please select a factory operating domain from list..." | "Select domain..." |
| **ইউজার লিস্ট হেডার** | `Factory Accounts (24 Users)` | `Accounts` (পাশে ছোট কাউন্টার: `24`) |
| **মডিউল ডেসক্রিপশন** | প্রতিটি রো-তে ২ লাইনের ডামি ডেসক্রিপশন ("Enterprise module clearance...") | ডেসক্রিপশন বাদ; শুধু মডিউল নাম ও পাথ ডিসপ্লে হবে |
| **টেবিল ফুটনোট** | "All special clearances are recorded to immutable audit history upon saving." | সম্পূর্ণ অপসারণ (জিরো ফুটনোট) |
| **নো-সিআরইউডি রো** | প্রতিটি অনুপস্থিত একশনে আলাদা ড্যাশ (`— — — —`) | রো-তে একটিমাত্র মার্জিত ড্যাশ (`—`) |

---

## ৩. ফারহানা চৌধুরীর কিউএ গেটকিপার অডিট চেকলিস্ট (Rule 29 QA Gate)

যেকোনো ফ্রন্টএন্ড পিআর বা কোড অডিটের সময় ফারহানা চৌধুরী নিচের বিষয়গুলো কঠোরভাবে ভেরিফাই করবেন:
- [ ] স্ক্রিনে এমন কোনো শব্দ বা অক্ষর আছে কি না যা বাদ দিলেও পেজের অর্থ বা কাজ সম্পূর্ণ অক্ষুণ্ন থাকে? (থাকলে ❌ **REJECTED**)।
- [ ] টেবিল হেডার বা সিস্টেম লেবেলে কোনো অপ্রয়োজনীয় ইমোজি বা বহু-শব্দের অলংকরণ আছে কি না? (থাকলে ❌ **REJECTED**)।
- [ ] পেজ সাবটাইটেল কি ৪-৫ শব্দের বেশি দীর্ঘ অথবা অপ্রয়োজনীয় প্রবন্ধ? (থাকলে ❌ **REJECTED**)।
- [ ] ব্যাজের সামনে কি অপ্রয়োজনীয় প্রিফিক্স (যেমন: "Roles:", "Status:") লেখা আছে? (থাকলে ❌ **REJECTED**)।
- [ ] টেবিলের নিচে কি অপ্রয়োজনীয় ব্যাখ্যামূলক ফুটনোট বা উপদেশ জুড়ে দেওয়া হয়েছে? (থাকলে ❌ **REJECTED**)।
- [ ] টেবিল রো বা ড্রপডাউনে কি অপ্রয়োজনীয় বয়ান বা রিপিটেটিভ শব্দ আছে? (থাকলে ❌ **REJECTED**)।
