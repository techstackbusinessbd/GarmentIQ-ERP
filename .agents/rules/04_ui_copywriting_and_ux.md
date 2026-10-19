# ইউআই/ইউএক্স, স্ক্রিন কপি ও নোটিফিকেশন মানদণ্ড (UI/UX Copywriting & Notification Standards)

## ১. সার্বজনীন ভাষা নীতি (Universal Application Language)
- **অ্যাপ্লিকেশনের সকল ইউআই (UI/UX)**: স্ক্রিন টাইটেল, মেনুবার, ফর্ম লেবেল, ইনপুট প্লেসহোল্ডার, বাটন, টেবিল হেডার, পপ-আপ মডাল, অ্যালার্ট এবং নোটিফিকেশন—সবকিছু **ইংরেজিতে (English)** হতে হবে।
- **ব্যতিক্রমহীন নিয়ম**: সফটওয়্যারের ইন্টারফেসে কোনো বাংলা টেক্সট বা রোবোটিক কম্পিউটার কোড দেখানো যাবে না।

---

## ২. ভাষার ধরন ও মানবিক অভিব্যক্তি (Human-Readable & No Robotic Vibe)
সফটওয়্যার ব্যবহার করবেন ফ্যাক্টরির সাধারণ মানুষ (মার্চেন্ডাইজার, স্টোরকিপার, কাটিং সুপারভাইজার)। তাই ইংরেজি ভাষা হতে হবে **অত্যন্ত সহজ, স্পষ্ট, সাহায্যকারী এবং সম্পূর্ণ মানবিক**। কোনো জটিল প্রোগ্রামিং পরিভাষা বা মেকানিক্যাল মেসেজ দেওয়া কঠোরভাবে নিষিদ্ধ।

### ❌ রোবোটিক / নিষিদ্ধ মেসেজ বনাম ✅ মানবিক / অনুমোদিত মেসেজ:

| পরিস্থিতি | ❌ নিষিদ্ধ (রোবোটিক ও দুর্বোধ্য) | ✅ অনুমোদিত (সহজ, মানবিক ও অর্থপূর্ণ) |
| :--- | :--- | :--- |
| **সফলভাবে সেভ হলে** | "Transaction committed successfully. Code 200." | "Purchase Order #PO-1042 has been successfully created." |
| **সার্ভার এরর হলে** | "Internal server error: NullPointerException in FabricRollService." | "We couldn't save this fabric roll right now. Please check your connection and try again." |
| **ফর্ম ভ্যালিডেশন** | "Validation failed: Attribute 'gsm' cannot be null or zero." | "Please enter a valid fabric GSM (e.g. 180) to continue." |
| **অর্ডার ডিলিট কনফার্মেশন**| "Are you sure you want to drop entity ID 84?" | "Are you sure you want to delete this order? This action cannot be undone." |
| **ফাঁকা টেবিল / নো ডেটা** | "Result set empty. 0 rows returned." | "No fabric rolls found yet. Click 'Scan New Roll' to add your first roll." |
| **স্টক অপর্যাপ্ত হলে** | "Exception: Inventory stock depletion limit exceeded." | "Not enough fabric in stock for this cut. You need 120 yards more." |

---

## ৩. অ্যাকশন বাটন ও মাইক্রোকপির নিয়ম (Action Buttons & Microcopy)
1. **স্পষ্ট অ্যাকশন ভার্ব**:
   - শুধু "Submit" বা "OK" এর বদলে স্পষ্ট শব্দ ব্যবহার করতে হবে:  
     - `"Create Order"` (Submit-এর বদলে)  
     - `"Save & Continue"`  
     - `"Approve Cutting Plan"`  
     - `"Print Bundle Barcodes"`  
     - `"Discard Changes"` (Cancel-এর বদলে)
2. **টোস্ট নোটিফিকেশন (Toast Messages)**:
   - সফল হলে: `"Roll #R-402 approved and assigned to Rack B-12."`
   - সতর্কবার্তা: `"Marker efficiency is 82%. Recommended target is 85%."`

---

## ৪. ভিজ্যুয়াল ক্লিনলিনেস ও নিট ইউআই নীতি (Neat, Clean & Clutter-Free UI)
- **পরিমিত ফাঁকা জায়গা (Breathing Room)**: কোনো স্ক্রিনে ডেটা গাদাগাদি বা ঘিঞ্জি করে রাখা যাবে না। কার্ড এবং টেবিলের মাঝে আরামদায়ক স্পেসিং (`p-6`, `gap-5`) থাকতে হবে।
- **চোখের জন্য আরামদায়ক রঙ (Soft & Modern Palette)**: তীব্র বা চড়া রঙ নিষিদ্ধ। প্রিমিয়াম Slate/Zinc ডার্ক-লাইট নিউট্রাল ব্যাকগ্রাউন্ড ও সফট পেস্টেল ব্যাজ ব্যবহার করতে হবে।
- **পরিপাটি গ্রিড ও টেবিল**: সংখ্যার জন্য `font-mono` বা `tabular-nums` যাতে কলামগুলো নিখুঁত সোজা থাকে। অপ্রয়োজনীয় বর্ডার বা ভিজ্যুয়াল নয়েজ পুরোপুরি পরিহার করতে হবে।

---

## ৫. কিউএ গেটকিপার অডিট চেকলিস্ট (Farhana's Gate)
- [ ] স্ক্রিনের কোথাও কি কোনো রোবোটিক বা ব্যাকএন্ড স্ট্যাকট্রেস এরর দেখানো হয়েছে? (থাকলে ❌ REJECTED)।
- [ ] প্রতিটি স্ক্রিন কি দেখতে অত্যন্ত পরিপাটি, গোছানো এবং দৃষ্টিনন্দন (Neat & Clean)? (গাদাগাদি থাকলে ❌ REJECTED)।
- [ ] কোনো কঠিন বা দুর্বোধ্য ইংরেজি শব্দ ব্যবহার করা হয়েছে কি? (সহজ শব্দে রূপান্তর করতে হবে)।
