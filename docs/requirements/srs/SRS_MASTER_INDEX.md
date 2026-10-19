# সফটওয়্যার রিকোয়ারমেন্টস স্পেসিফিকেশন (SRS) - মাস্টার ইনডেক্স

*প্রজেক্ট: এন্টারপ্রাইজ গার্মেন্টস ইআরপি (Garments ERP)*  
*আর্কিটেকচার: মডুলার এসআরএস ফ্রেমওয়ার্ক (IEEE 830 Standard)*  
*দায়িত্বে: 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect & PM)*  

---

## 🗂️ মডিউলভিত্তিক এসআরএস নেভিগেশন (Module-Wise SRS Directory):

| মডিউল কোড | মডিউলের নাম | ফাইল লিংক | মূল কভারেজ |
| :--- | :--- | :--- | :--- |
| **SRS-00** | **ফাউন্ডেশন ও লোকাল এনভায়রনমেন্ট** | [SRS_00_FOUNDATION.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_00_FOUNDATION.md) | কোর টেক স্ট্যাক, ডকার কম্পোজ, জাভা ২১ স্প্রিং বুট প্যাকেজ, রিঅ্যাক্ট ১৯, ইউনিফাইড লেআউট ও টোকেন। |
| **SRS-01** | **মার্চেন্ডাইজিং ও অর্ডার ম্যানেজমেন্ট** | [SRS_01_MERCHANDISING.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_01_MERCHANDISING.md) | বায়ার প্রোফাইল, স্টাইল মাস্টার, BOM, কস্টিং শিট, সাইজ-কালার ম্যাট্রিক্স ও পিও বুকিং। |
| **SRS-02** | **ফেব্রিক ও ট্রিমস ইনভেন্টরি** | [SRS_02_FABRIC_INVENTORY.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_02_FABRIC_INVENTORY.md) | ইয়ার্ন স্টক, ৪-পয়েন্ট ফেব্রিক রোল চেকিং, শেড গ্রুপ, ওয়্যারহাউজ র্যাক লোকেশন ও স্টক লেজার। |
| **SRS-03** | **প্রোডাকশন প্ল্যানিং ও শপ ফ্লোর** | [SRS_03_PRODUCTION_PLANNING.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_03_PRODUCTION_PLANNING.md) | কাটিং মার্কার এফিসিয়েন্সি, বান্ডিল বারকোড জেনারেটর, সুইং লাইন লোডিং ও আওয়ারলি মনিটরিং। |
| **SRS-04** | **কোয়ালিটি অ্যাসুরেন্স ও কিউসি** | [SRS_04_QUALITY_CONTROL.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_04_QUALITY_CONTROL.md) | ফেব্রিক রোল কিউসি, সুইং ইন-লাইন/এন্ড-লাইন ট্রাফিক লাইট সিস্টেম ও AQL অডিট। |
| **SRS-05** | **কমার্শিয়াল, এক্সপোর্ট ও শিপমেন্ট** | [SRS_05_COMMERCIAL_SHIPPING.md](file:///g:/ERP-Software/Garments-ERP/docs/requirements/srs/SRS_05_COMMERCIAL_SHIPPING.md) | প্যাকিং লিস্ট, এক্সপোর্ট ইনভয়েস, কন্টেইনার স্টাফিং ও ফ্যাক্টরি গেট পাস। |

---

## 🔒 গ্লোবাল নন-ফাংশনাল নিয়মাবলী (Cross-Module Rules):
1. **টাকা ও ওজনের নির্ভুলতা**: সকল আর্থিক, সুতা ও ফেব্রিকের হিসেবে শুধুমাত্র `BigDecimal` ব্যবহার বাধ্যতামূলক।
2. **মডুলার ডিকাপলিং**: কোনো মডিউলের কোড সরাসরি অন্য মডিউলের ডেটাবেজ টেবিল পরিবর্তন করবে না; সার্ভিস লেয়ার বা ইভেন্টের মাধ্যমে ডেটা আদান-প্রদান হবে।
3. **অডিট ট্রেইল**: প্রতিটি এন্ট্রিতে `created_by`, `updated_by`, `created_at`, `updated_at` ও `@Version` থাকবে।
