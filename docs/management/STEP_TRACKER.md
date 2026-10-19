# মাস্টার ডোমেন স্টেপ ট্র্যাকার ইনডেক্স (Master Step Tracker Index)

*সর্বশেষ আপডেট: ১৯ অক্টোবর ২০২৬*  
*তত্ত্বাবধায়ক: তানভীর আহমেদ (Chief Solutions Architect) ও ফারহানা চৌধুরী (QA Lead)*  
*নীতিমালা: [.agents/rules/14_granular_task_decomposition_and_step_tracking.md](file:///g:/ERP-Software/Garments-ERP/.agents/rules/14_granular_task_decomposition_and_step_tracking.md) ও [রুল ২২ (জিরো স্টেপ-স্কিপিং)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/22_strict_sequential_step_execution_and_zero_skipping.md)*

---

## 🔒 ডোমেন-ভিত্তিক ট্র্যাকার ও লকিং পলিসি (Domain Tracking & Lock Policy)
1. **ডোমেন-নির্দিষ্ট ফাইল**: প্রতিটি ডোমেনের জন্য পৃথক স্টেপ ট্র্যাকার ফাইল থাকবে:  
   `docs/management/step-tracking/STEP_TRACKER_DOMAIN_XX_*.md`
2. **ডোমেন লকিং প্রোটোকল**: যখন একটি ডোমেন ১০০% কিউএ-ভেরিফাইড ও সিটিও অনুমোদিত হবে, তখন সেই ডোমেনের ফাইলটি 🔒 **LOCKED & ARCHIVED** হিসেবে সিলগালা করা হবে (আর কোনো এডিট করা যাবে না)।
3. **পরবর্তী ডোমেন অ্যাক্টিভেশন**: পূর্ববর্তী ডোমেন লক হওয়ার পরেই কেবল পরবর্তী ডোমেনের জন্য নতুন ট্র্যাকার ফাইল সক্রিয় হবে।

---

## 🎯 বর্তমান সক্রিয় ডোমেন (Current Active Domain)

| সক্রিয় ডোমেন | ডোমেন নাম | ডেডিকেটেড ট্র্যাকার ফাইল | বর্তমান স্ট্যাটাস |
| :---: | :--- | :--- | :---: |
| **Domain 0** | **Foundation & Core Platform** | 👉 **[STEP_TRACKER_DOMAIN_00_FOUNDATION.md](file:///g:/ERP-Software/Garments-ERP/docs/management/step-tracking/STEP_TRACKER_DOMAIN_00_FOUNDATION.md)** | 🟢 **ACTIVE (চলমান)** |

---

## 📋 এন্টারপ্রাইজ ডোমেন পাইপলাইন মাস্টার ইনডেক্স (All ERP Domains)

| ডোমেন আইডি | ডোমেনের নাম ও মূল ফোকাস | ডেডিকেটেড ট্র্যাকার পাথ | স্ট্যাটাস | লকিং স্টেট |
| :---: | :--- | :--- | :---: | :---: |
| **`Domain 0`** | **Foundation, Master Data & IAM** | [STEP_TRACKER_DOMAIN_00_FOUNDATION.md](file:///g:/ERP-Software/Garments-ERP/docs/management/step-tracking/STEP_TRACKER_DOMAIN_00_FOUNDATION.md) | 🟢 **ACTIVE** | 🔓 উন্মুক্ত (চলমান) |
| **`Domain 1`** | **Merchandising & Style Master** | `docs/.../STEP_TRACKER_DOMAIN_01_MERCHANDISING.md` | ⚪ QUEUED | 🔒 লকড (Domain 0-এর অপেক্ষায়) |
| **`Domain 2`** | **Fabric Sourcing & Raw Material** | `docs/.../STEP_TRACKER_DOMAIN_02_FABRIC.md` | ⚪ QUEUED | 🔒 লকড |
| **`Domain 3`** | **Cutting Room & Marker Planning** | `docs/.../STEP_TRACKER_DOMAIN_03_CUTTING.md` | ⚪ QUEUED | 🔒 লকড |
| **`Domain 4`** | **Sewing Floor & RFID Tracking** | `docs/.../STEP_TRACKER_DOMAIN_04_SEWING.md` | ⚪ QUEUED | 🔒 লকড |
| **`Domain 5`** | **Laundry & Denim Washing Plant** | `docs/.../STEP_TRACKER_DOMAIN_05_WASHING.md` | ⚪ QUEUED | 🔒 লকড |
| **`Domain 6`** | **Finishing, QC & Cartoning** | `docs/.../STEP_TRACKER_DOMAIN_06_FINISHING.md` | ⚪ QUEUED | 🔒 লকড |
| **`Domain 7`** | **Commercial Shipment & Export** | `docs/.../STEP_TRACKER_DOMAIN_07_COMMERCIAL.md` | ⚪ QUEUED | 🔒 লকড |

---

> 💡 **নোট**: বর্তমানে চলমান কাজের ক্ষুদ্র ক্ষুদ্র মাইক্রো-স্টেপ দেখতে সরাসরি প্রবেশ করুন:  
> 👉 **[ডোমেন ০ স্টেপ ট্র্যাকার (STEP_TRACKER_DOMAIN_00_FOUNDATION.md)](file:///g:/ERP-Software/Garments-ERP/docs/management/step-tracking/STEP_TRACKER_DOMAIN_00_FOUNDATION.md)**
