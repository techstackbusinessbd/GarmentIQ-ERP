# ইউআই/ইউএক্স, স্ক্রিন কপি ও নোটিফিকেশন মানদণ্ড: জিরো-বাংলা ও ১০০% ইংরেজি নীতি (UI/UX 100% English Policy)

> 🛑 **পরম অনুশাসন (Ironclad Rule 04)**:  
> গার্মেন্টসের এই এন্টারপ্রাইজ ইআরপি অ্যাপ্লিকেশনের **সকল দৃশ্যমান উপাদান (UI/UX, Screens, Views, Navigation, Modals, Forms, Notifications, Toasts, Messages, Table Headers, Status Pills, Tooltips ইত্যাদি) বাধ্যতামূলকভাবে ১০০% বিশুদ্ধ, প্রফেশনাল ও মানবিক ইংরেজিতে (English) হতে হবে**। স্ক্রিনের কোথাও **১টি অক্ষরও বাংলা টেক্সট ব্যবহার করা সম্পূর্ণ নিষিদ্ধ (❌ ZERO BENGALI ON USER INTERFACE)**। বাংলা শুধুমাত্র ডেভেলপার টিমের অভ্যন্তরীণ আর্কিটেকচারাল ডকুমেন্টেশন ও কোডের দ্বিভাষিক কমেন্টে (`[BN]`) সীমাবদ্ধ থাকবে।

---

## ১. সার্বজনীন ইন্টারফেস ভাষা নীতি (100% English UI Mandate)

| উপাদান শ্রেণি (UI Category) | অনুমোদিত ভাষা | উদাহরণ (Approved English Pattern) | ❌ যা সম্পূর্ণ নিষিদ্ধ (Forbidden) |
| :--- | :--- | :--- | :--- |
| **পেজ টাইটেল ও সাবটাইটেল** | ১০০% ইংরেজি | `"Operations & Production Overview"` | কোনো বাংলা টাইটেল বা মিক্সড ভাষা |
| **সাইডবার ও নেভিগেশন মেনু**| ১০০% ইংরেজি | `"Merchandising"`, `"Cutting Room"`, `"Laundry"` | `"মার্চেন্ডাইজিং"`, `"কাটিং"` ইত্যাদি |
| **বাটন ও অ্যাকশন লেবেল** | ১০০% ইংরেজি | `"New Purchase Order"`, `"Save & Continue"` | `"নতুন অর্ডার"`, `"সংরক্ষণ"` ইত্যাদি |
| **ফর্ম লেবেল ও প্লেসহোল্ডার**| ১০০% ইংরেজি | `"Yarn Count (Ne)"`, `"Enter fabric GSM..."` | কোনো বাংলা নির্দেশিকা বা ইনপুট লেবেল |
| **টোস্ট ও নোটিফিকেশন** | ১০০% ইংরেজি | `"Roll #R-402 successfully approved."` | `"রোল সফলভাবে অনুমোদিত হয়েছে"` |
| **সিস্টেম অ্যালার্ট ও এরর** | ১০০% ইংরেজি | `"Unable to connect to washing plant PLC."` | কোনো বাংলা ত্রুটি বার্তা |
| **কনফার্মেশন ডায়ালগ** | ১০০% ইংরেজি | `"Are you sure you want to delete this order?"` | `"আপনি কি অর্ডারটি মুছতে চান?"` |
| **টেবিল হেডার ও স্ট্যাটাস পিলস**| ১০০% ইংরেজি | `"PO Number"`, `"Style Ref"`, `"Approved"`, `"Pending"` | `"অর্ডার নম্বর"`, `"অনুমোদিত"` ইত্যাদি |
| **ড্রপডাউন অপশন ও সুইচার**| ১০০% ইংরেজি | `"Royal Indigo"`, `"Sapphire Corporate"` | `"থিম নির্বাচন"`, `"বাংলা নাম"` ইত্যাদি |

---

## ২. ভাষার ধরন ও মানবিক অভিব্যক্তি (Human-Readable & No Robotic Vibe)

সফটওয়্যার ব্যবহার করবেন ফ্যাক্টরির কর্মীরা (মার্চেন্ডাইজার, স্টোরকিপার, কাটিং সুপারভাইজার, বায়ার অডিটর)। তাই ইংরেজি ভাষা হতে হবে **অত্যন্ত সহজ, স্পষ্ট, সাহায্যকারী এবং সম্পূর্ণ মানবিক**। কোনো জটিল প্রোগ্রামিং পরিভাষা, রোবোটিক কোড বা যান্ত্রিক স্ট্যাকট্রেস দেখানো কঠোরভাবে নিষিদ্ধ।

### ❌ রোবোটিক বনাম ✅ মানবিক ও প্রফেশনাল ইংরেজি মেসেজ:

| পরিস্থিতি | ❌ নিষিদ্ধ (রোবোটিক ও দুর্বোধ্য) | ✅ অনুমোদিত (সহজ, মানবিক ও অর্থপূর্ণ ইংরেজি) |
| :--- | :--- | :--- |
| **সফলভাবে সেভ হলে** | "Transaction committed successfully. Code 200." | "Purchase Order #PO-1042 has been successfully created." |
| **সার্ভার এরর হলে** | "Internal server error: NullPointerException in FabricRollService." | "We couldn't save this fabric roll right now. Please check your connection and try again." |
| **ফর্ম ভ্যালিডেশন** | "Validation failed: Attribute 'gsm' cannot be null or zero." | "Please enter a valid fabric GSM (e.g. 180) to continue." |
| **অর্ডার ডিলিট কনফার্মেশন**| "Are you sure you want to drop entity ID 84?" | "Are you sure you want to delete this order? This action cannot be undone." |
| **ফাঁকা টেবিল / নো ডেটা** | "Result set empty. 0 rows returned." | "No fabric rolls found yet. Click 'Scan New Roll' to add your first roll." |
| **স্টক অপর্যাপ্ত হলে** | "Exception: Inventory stock depletion limit exceeded." | "Not enough fabric in stock for this cut. You need 120 yards more." |

---

## ৩. অ্যাকশন বাটন ও মাইক্রোকপির নিয়ম (Action Buttons & Microcopy)

1. **স্পষ্ট অ্যাকশন ভার্ব (Specific Verbs)**:
   - শুধু "Submit" বা "OK" এর বদলে সুনির্দিষ্ট উদ্দেশ্য প্রকাশকারী ইংরেজি শব্দ:  
     - `"Create Purchase Order"` (Submit-এর বদলে)  
     - `"Save & Continue"`  
     - `"Approve Cutting Plan"`  
     - `"Print Bundle Barcodes"`  
     - `"Discard Changes"` (Cancel-এর বদলে)
2. **টোস্ট নোটিফিকেশন মানদণ্ড (Sonner Toasts)**:
   - সফল বার্তা: `"Roll #R-402 approved and assigned to Rack B-12."`
   - সতর্কবার্তা: `"Marker efficiency is 82.4%. Target efficiency is 85.0%."`
   - এরর বার্তা: `"Unable to save tech-pack. Please check required fabric fields."`

---

## ৪. বাংলা ব্যবহারের একমাত্র অনুমোদিত ক্ষেত্র (Where Bengali is Allowed)

সফটওয়্যারের ব্যবহারকারী ইন্টারফেসে বাংলা ১০০% নিষিদ্ধ হলেও, শুধুমাত্র নিচের দুটি ক্ষেত্রে বাংলা প্রযোজ্য:
1. **অভ্যন্তরীণ ডেভেলপার টিম যোগাযোগ ও আর্কিটেকচারাল ডিসিশন**: তানভীর, আরিফ, সাদিয়া ও ফারহানার নিজেদের মধ্যকার রিকোয়ারমেন্ট অ্যানালাইসিস এবং `docs/` ডিরেক্টরির স্পেসিফিকেশন ও এসআরএস ডকুমেন্টে।
2. **দ্বিভাষিক কোড কমেন্টিং ([Rule 15](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md))**: কোডের মধ্যে `// [EN] ...` এর পাশাপাশি `// [BN] ...` কমেন্ট যাতে দেশীয় যেকোনো ডেভেলপার সিস্টেমের লজিক দ্রুত বুঝতে পারেন।

---

## ৫. ফারহানা চৌধুরীর কিউএ গেটকিপার অডিট চেকলিস্ট (Farhana's Language Gate)

ফারহানা চৌধুরী যেকোনো ফ্রন্টএন্ড পিআর বা কোড অডিটের সময় নিচের চেকলিস্ট অনুসরণ করবেন:
- [ ] ব্রাউজারে রেন্ডার হওয়া কোনো স্ক্রিন, টাইটেল, মেনু বা বাটনে ১টি বাংলা অক্ষরও আছে কি না? (থাকলে ❌ **REJECTED**)।
- [ ] কোনো নোটিফিকেশন, টোস্ট, এরর মেসেজ বা ডায়ালগে বাংলা টেক্সট বা রোবোটিক কোড দেখানো হয়েছে কি না? (থাকলে ❌ **REJECTED**)।
- [ ] ব্যবহৃত ইংরেজি ভাষা অত্যন্ত সহজ, মানবিক এবং প্রফেশনাল কি না? (কঠিন বা দুর্বোধ্য পরিভাষা থাকলে ❌ **REJECTED**)।
- [ ] প্রতিটি বাটন ও লিঙ্কে স্পষ্ট ও উদ্দেশ্যমূলক ইংরেজি ভার্ব ব্যবহৃত হয়েছে কি না?
