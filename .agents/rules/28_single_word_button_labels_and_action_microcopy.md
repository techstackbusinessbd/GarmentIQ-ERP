# রুল ২৮: একক শব্দের বাটন লেবেল ও অ্যাকশন মাইক্রোকপি নীতি (Strict Single-Word Button Labels Policy)

> **পলিসি আইডি**: `RULE-28-SINGLE-WORD-BUTTON-LABELS`  
> **ক্যাটাগরি**: UI/UX Standards, Action Microcopy, Visual Cleanliness & Cognitive Ergonomics  
> **প্রযোজ্য ক্ষেত্র**: ফ্রন্টএন্ডের সকল বাটন, ড্রপডাউন ট্রিগার, টেবিল অ্যাকশন, মডাল বাটন ও ফ্লোটিং বার (`frontend/src/`)  
> **অনুমোদনকারী**: 👨‍💼 তানভীর আহমেদ *(Chief Architect & PM)*, 👨‍💻 আরিফুল ইসলাম *(Tech Lead)*, 👩‍💻 সাদিয়া জাহান *(Frontend Lead)*, 👩‍🔬 ফারহানা চৌধুরী *(QA Lead)*  
> **চূড়ান্ত অথরিটি**: 👨‍💼 **Product Director / CTO (স্যার)**  
> **সর্বোচ্চ নীতি**: **"বাটনের দৃশ্যমান নাম বা অ্যাকশন লেবেল বাধ্যতামূলকভাবে ঠিক ১টি শব্দে (Strictly 1 Word) হতে হবে। মাল্টি-ওয়ার্ড, বাক্য, অতিরিক্ত বিশেষ্য বা বিশালাকার বাটন টেক্সট ব্যবহার সম্পূর্ণ নিষিদ্ধ।"**

---

## ১. কোর ভিশন ও সমস্যা প্রেক্ষাপট (Core Vision & Problem Statement)

একটি জটিল এন্টারপ্রাইজ গার্মেন্টস ইআরপিতে (RMG Enterprise ERP) শত শত অ্যাকশন বাটন থাকে। বাটনের ভেতর অপ্রয়োজনীয় শব্দ জুড়ে দেওয়া (যেমন: `"Save Changes"`, `"Save Clearances"`, `"Revert to Role"`, `"Return to User Directory"`, `"Discard Modifications"`) একটি গুরুতর ইউআই/ইউএক্স অ্যান্টি-প্যাটার্ন।

### মাল্টি-ওয়ার্ড বাটনের প্রধান সমস্যাসমূহ:
1. **ভিজ্যুয়াল ক্লাটার ও ভারী চেহারা (Visual Clutter & Heaviness)**:
   - বাটনে ২-৩টি শব্দ থাকলে বাটনগুলো চওড়া হয়ে স্ক্রিনের মূল্যবান জায়গা দখল করে এবং টেবিল বা হেডারে জগাখিচুড়ি লাগে।
2. **কগনিটিভ ওভারলোড (Cognitive Overload)**:
   - ব্যবহারকারীকে অ্যাকশন বোঝার জন্য পুরো বাক্য পড়তে হয়। অথচ মানুষ সবসময় অ্যাকশনের মূল ভার্ব (Verb) খোঁজে।
3. **রেসপন্সিভ ব্রেক ও টেক্সট র‍্যাপিং (Broken Mobile & Tablet Layouts)**:
   - ট্যাবলেট বা ফ্যাক্টরি ফ্লোরের ছোট মনিটরে মাল্টি-ওয়ার্ড বাটন ভেঙে ২ লাইনে চলে যায় বা স্ক্রিনের বাইরে চলে যায়।
4. **অপ্রয়োজনীয় অবজেক্ট পুনরাবৃত্তি (Redundant Context)**:
   - একটি "User Special Permissions" পেজে সেভ বাটনে `"Save User Permissions"` লেখা সম্পূর্ণ অর্থহীন বাহুল্য; কারণ ব্যবহারকারী ইতিমধ্যেই জানে সে কোন পেজে আছে। শুধু `"Save"` লেখা যথেষ্ট।

---

## ২. অনুমোদিত একক শব্দের অ্যাকশন ম্যাপিং (Approved Single-Word Action Verbs)

নিচের স্ট্যান্ডার্ড অনুযায়ী সমস্ত বাটনের লেবেল **বাধ্যতামূলকভাবে ঠিক ১টি ইংরেজি শব্দে** সীমাবদ্ধ রাখতে হবে:

| অ্যাকশন ক্যাটাগরি | ❌ নিষিদ্ধ মাল্টি-ওয়ার্ড লেবেল (Forbidden) | ✅ অনুমোদিত একক শব্দের লেবেল (Approved 1 Word) | প্রাসঙ্গিক আইকন (Lucide Icon) |
| :--- | :--- | :--- | :--- |
| **সংরক্ষণ / সাবমিট** | `"Save Changes"`, `"Save Matrix"`, `"Save Clearances"`, `"Save Privileges"` | `Save` | `<Save size={13} />` |
| **বাতিলকরণ / বর্জন** | `"Discard Changes"`, `"Discard Modifications"`, `"Reject Changes"` | `Discard` | `<RotateCcw size={12} />` |
| **রিসেট / ডিফল্ট** | `"Reset to Default"`, `"Reset All Filters"`, `"Reset Module"` | `Reset` | `<RotateCcw size={12} />` |
| **পূর্বাবস্থায় ফেরা** | `"Revert to Role"`, `"Restore Baseline"`, `"Rollback Changes"` | `Revert` | `<RotateCcw size={12} />` |
| **নেভিগেশন / ব্যাক** | `"Return to User Directory"`, `"Back to Users"`, `"Go Back"` | `Back` অথবা `Directory` | `<ArrowLeft size={13} />` |
| **তৈরি / সংযোজন** | `"Create New User"`, `"New Purchase Order"`, `"Add Client"` | `Create` অথবা `New` | `<Plus size={13} />` |
| **সম্পাদনা** | `"Edit Profile"`, `"Modify Record"`, `"Edit User"` | `Edit` | `<Edit2 size={13} />` |
| **অপসারণ / মুছা** | `"Delete User"`, `"Remove Account"`, `"Delete Order"` | `Delete` | `<Trash2 size={13} />` |
| **লক / আনলক** | `"Lock User Account"`, `"Unlock Access"` | `Lock` / `Unlock` | `<Lock size={12} />` / `<Unlock size={12} />` |
| **ডায়ালগ বাতিল** | `"Cancel Action"`, `"Close Window"` | `Cancel` অথবা `Close` | `<X size={12} />` |
| **অনুমোদন** | `"Approve Order"`, `"Authorize Cutting Plan"` | `Approve` | `<CheckCircle2 size={12} />` |
| **প্রত্যাখ্যান** | `"Reject Request"`, `"Decline Order"` | `Reject` | `<XCircle size={12} />` |
| **এক্সপোর্ট / প্রিন্ট** | `"Export to Excel"`, `"Print Bundle Barcodes"` | `Export` / `Print` | `<Download size={13} />` / `<Printer size={13} />` |
| **ফিল্টার / সার্চ** | `"Apply Filter"`, `"Search Records"`, `"Filter Data"` | `Filter` / `Search` | `<Filter size={12} />` / `<Search size={12} />` |
| **অনুমতি প্রদান** | `"Grant Clearance"`, `"Special Grant"` | `Grant` | `<Plus size={10} />` |
| **অনুমতি প্রত্যাহার** | `"Revoke Clearance"`, `"Remove Override"` | `Revoke` | `<Minus size={10} />` |

---

## ৩. প্রাসঙ্গিক তথ্য প্রকাশের একমাত্র মাধ্যম (How to Convey Context)

বাটনের নাম ১ শব্দ হওয়ার পর বাড়তি কোনো প্রেক্ষাপট বা ব্যাখ্যা দেওয়ার প্রয়োজন হলে নিচের ২টি পদ্ধতি ব্যবহার করতে হবে:
1. **টুলটিপ বা `title` অ্যাট্রিবিউট**:
   - বাটনের ওপর মাউস নিলে পূর্ণাঙ্গ তথ্য টুলটিপে ডিসপ্লে হবে:  
     `title="Clear all individual overrides and restore assigned role baseline"`
2. **লেফট আইকন (Leading Icon)**:
   - বাটনের লেখার বামে প্রাসঙ্গিক একটি সুনির্দিষ্ট আইকন (যেমন: `<Save size={13} />`) থাকবে।

---

## ৪. ফারহানা চৌধুরীর কিউএ গেটকিপার অডিট চেকলিস্ট (Farhana's Single-Word Button Gate)

যেকোনো ফ্রন্টএন্ড পুল রিকোয়েস্ট বা কোড পর্যালোচনার সময় ফারহানা চৌধুরী নিচের অডিট সম্পন্ন করবেন:
- [ ] পেজের কোনো বাটনে কি একাধিক শব্দ (যেমন: `"Save Changes"`, `"New User"`) আছে? (থাকলে ❌ **REJECTED**)।
- [ ] বাটন লেবেল কি সরাসরি ১টি নির্দিষ্ট ইংরেজি ভার্ব (যেমন: `Save`, `Discard`, `Reset`, `Revert`, `Create`, `Edit`) দ্বারা গঠিত? (না হলে ❌ **REJECTED**)।
- [ ] বাটনের সাথে কি প্রাসঙ্গিক আইকন ও ব্যাখ্যামূলক `title` টুলটিপ যুক্ত আছে?
- [ ] ফ্লোটিং বারে কি একাধিক শব্দের বাটন রয়েছে? (থাকলে সংশোধন করে `Save` ও `Discard` করতে হবে)।
