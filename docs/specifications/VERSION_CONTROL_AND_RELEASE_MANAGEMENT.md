# ভার্সন কন্ট্রোল ও রিলিজ ম্যানেজমেন্ট স্পেসিফিকেশন (Version Control & Release Management)

*প্রজেক্ট: GarmentIQ-ERP (RMG Woven, Denim & Non-Denim Enterprise ERP + Traceability + RFID Platform)*  
*অফিশিয়াল গিটহাব রিপোজিটরি: [https://github.com/techstackbusinessbd/GarmentIQ-ERP.git](https://github.com/techstackbusinessbd/GarmentIQ-ERP.git)*  
*তত্ত্বাবধায়ক: 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect) ও 👩‍🔬 ফারহানা চৌধুরী (QA Lead)*  
*তারিখ: ১৯ অক্টোবর ২০২৬ | ভার্সন: ১.০ | স্ট্যাটাস: অনুমোদিত (Approved by CTO)*  

---

## ১. ভূমিকা ও উদ্দেশ্য (Purpose & Governance)
এই স্পেসিফিকেশনের মূল উদ্দেশ্য হলো **GarmentIQ-ERP** প্ল্যাটফর্মের সোর্স কোড, ডেটাবেজ মাইগ্রেশন স্ক্রিপ্ট এবং আর্কিটেকচারাল নথিপত্রকে সম্পূর্ণ সুশৃঙ্খল, সুরক্ষিত এবং পরিবর্তনযোগ্য (Traceable) রাখা। এন্টারপ্রাইজ টিয়ার-১ (Tier-1) স্ট্যান্ডার্ড বজায় রেখে জিরো কোড লস এবং নিরবচ্ছিন্ন সিআই/সিডি নিশ্চিত করাই এর লক্ষ্য।

---

## ২. গিট ব্রাঞ্চিং মডেল (Enterprise Git Branching Model)
সিস্টেমে একটি হাইব্রিড **Git-Flow** মডেল অনুসৃত হবে:

```
[feature/s1-merchandising] ──┐
                             ▼
[hotfix/fix-token-leak] ──> [develop] ──(Sprint Gate Pass)──> [main (Protected)] ──> Tag: v1.0.0
```

### ব্রাঞ্চসমূহের দায়িত্ব ও নীতিমালা:
| ব্রাঞ্চের ধরন | নামকরণের নিয়ম | উৎস ব্রাঞ্চ | মার্জ টার্গেট | অ্যাক্সেস পলিসি |
| :--- | :--- | :---: | :---: | :--- |
| **Production (`main`)** | `main` | - | - | **Protected**: সরাসরি পুশ সম্পূর্ণ নিষিদ্ধ। শুধুমাত্র স্যারের প্রত্যক্ষ অনুমোদন ও পিআর (PR) সাপেক্ষে মার্জ হবে। |
| **Integration (`develop`)** | `develop` | `main` | `main` | চলমান স্প্রিন্টের সমস্ত ফিচারের সেন্ট্রাল টেস্ট ব্রাঞ্চ। |
| **Feature Branches** | `feature/<sprint-id>-<module-name>` | `develop` | `develop` | নতুন মডিউল বা ফিচারের জন্য সাময়িক ব্রাঞ্চ (যেমন: `feature/s1-denim-orders`)। |
| **Hotfix Branches** | `hotfix/<issue-description>` | `main` | `main` ও `develop` | লাইভ প্রোডাকশনে জরুরি বাগ ফিক্সের জন্য। |
| **Release Branches** | `release/v<major>.<minor>.<patch>` | `develop` | `main` ও `develop` | ফাইনাল রিলিজের পূর্বে স্ট্যাবিলাইজেশন ব্রাঞ্চ। |

---

## ৩. কমিট মেসেজ স্ট্যান্ডার্ড (Conventional Commits v1.0.0)
প্রতিটি কমিট মেসেজ অবশ্যই **Conventional Commits** স্পেসিফিকেশন মেনে অর্থপূর্ণ ও সহজবোধ্য হতে হবে:

### ফরম্যাট:
```
<type>(<scope>): <imperative sentence in English>

[ঐচ্ছিক বিস্তারিত বিবরণ ও ব্যবসায়িক কারণ]
[ঐচ্ছিক রেফারেন্স: Closes #12, ADR-007, Rule-11]
```

### টাইপ তালিকা (Allowed Types):
- **`feat`**: নতুন ফিচার বা কার্যকারিতা সংযোজন (যেমন: `feat(denim): add wash shrinkage calculation engine`)
- **`fix`**: কোড বা লজিকের বাগ সংশোধন (যেমন: `fix(auth): prevent jwt expiration drift on refresh`)
- **`docs`**: শুধুমাত্র ডকুমেন্টেশন ও স্পেসিফিকেশন পরিবর্তন (যেমন: `docs(srs): add version control specification`)
- **`style`**: কোড ফরম্যাটিং বা হোয়াইটস্পেস পরিবর্তন (কোডের লজিক অপরিবর্তিত)
- **`refactor`**: কোড রিফ্যাক্টরিং যা বাগ ফিক্স বা নতুন ফিচার নয়
- **`perf`**: পারফরম্যান্স অপটিমাইজেশন (যেমন: `perf(grid): virtualize sewing line order table`)
- **`test`**: নতুন ইউনিট বা ইন্টিগ্রেশন টেস্ট সংযোজন (`test(uuid): add UUIDv7 monotonic ordering tests`)
- **`chore`**: ডিপেন্ডেন্সি আপডেট বা বিল্ড কনফিগ পরিবর্তন (`chore(deps): bump spring-boot to 3.3.4`)

---

## ৪. পিআর অনুমোদন ও কোয়ালিটি গেট (PR Approval & Quality Gates)

```
[ডেভেলপার: ফিচার শেষ] ➔ [ফারহানা: ১০-পয়েন্ট কিউএ অডিট] ➔ 🛑 [স্যার / সিটিও অনুমোদন গেট] ➔ [মেইন ব্রাঞ্চে মার্জ ও পুশ]
```

1. **ফারহানার ১০-পয়েন্ট কিউএ গেটকিপার অডিট ([রুল ০৩](file:///g:/ERP-Software/Garments-ERP/.agents/rules/03_qa_audit_and_gates.md))**:
   - [x] সমস্ত ইউনিট টেস্ট পাস করেছে কি না (`mvn test` / `npm run test`)।
   - [x] কোডে কোনো হার্ডকোডেড মান বা ফেক মক ডেটা অবশিষ্ট নেই ([রুল ০৫](file:///g:/ERP-Software/Garments-ERP/.agents/rules/05_zero_hardcoding_and_dynamic_data.md))।
   - [x] কোনো ফাইলের সাইজ ৩০০ লাইনের সীমা অতিক্রম করেনি ([রুল ০৭](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md))।
2. 🛑 **স্যারের অনুমোদন গেট ([রুল ১১](file:///g:/ERP-Software/Garments-ERP/.agents/rules/11_mandatory_user_approval_gate.md))**:
   - আমাদের **Product Director / CTO (স্যার / বস)**-এর প্রত্যক্ষ অনুমোদন ব্যতীত কোনো কোড `main` ব্রাঞ্চে মার্জ বা প্রোডাকশনে রিলিজ হবে না।

---

## ৫. ডেটাবেজ ভার্সন কন্ট্রোল স্ট্যান্ডার্ড (Flyway Migration Architecture)
ডেটাবেজের যেকোনো DDL পরিবর্তন অ্যাপ্লিকেশনের সাথে গিট ভার্সন কন্ট্রোলে ট্র্যাক থাকবে:

1. **ফাইল নেমিং স্ট্যান্ডার্ড**:
   - `V<Version>__<Description_in_snake_case>.sql`
   - উদাহরণ: `V1__initial_master_schema.sql`, `V2__create_denim_buyer_styles.sql`
2. **অপরিবর্তনীয়তা নীতি (Strict Immutability)**:
   - একবার কোনো মাইগ্রেশন ফাইল গিটহাবে পুশ হয়ে ডেটাবেজে রান হলে, **সেই ফাইলে আর কোনো পরিবর্তন করা সম্পূর্ণ নিষিদ্ধ**। কোনো পরিবর্তন আনতে হলে নতুন ভার্সন ফাইল (`V3__...sql`) তৈরি করতে হবে।
3. **কলাম ও স্কিমা পূর্বানুমোদন ([রুল ১২](file:///g:/ERP-Software/Garments-ERP/.agents/rules/12_database_schema_approval_gate.md))**:
   - নতুন কলাম বা টেবিল তৈরির মাইগ্রেশন লেখার আগে প্রতিটি কলামের নাম ও টাইপ স্যারের সামনে পেশ করে অনুমোদন নিতে হবে।
4. **প্রাইমারি কি স্ট্যান্ডার্ড ([ADR-007](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#সিদ্ধান্ত-০০৭-সমস্ত-ডেটাবেজ-টেবিলে-প্রাইমারি-কি-হিসেবে-uuidv7-ব্যবহারের-বাধ্যবাধকতা-mandatory-uuidv7-primary-key-architecture))**:
   - প্রতিটি টেবিলে বাধ্যতামূলকভাবে RFC 9562 `UUIDv7` ব্যবহার করতে হবে।

---

## ৬. সিম্যান্টিক রিলিজ ভার্সনিং ও ট্যাগিং (Semantic Versioning 2.0.0)
সিস্টেমের রিলিজ ভার্সন হবে **`vMAJOR.MINOR.PATCH`**:
- **MAJOR (`1.0.0`)**: প্ল্যাটফর্মের বড় মাইলস্টোন বা ব্রেকিং আর্কিটেকচারাল রিলিজ।
- **MINOR (`1.1.0`)**: ব্যাকওয়ার্ড-কম্প্যাটিবল নতুন ফিচার বা সম্পূর্ণ মডিউল যুক্ত হওয়া (যেমন: স্প্রিন্ট ১ মার্চেন্ডাইজিং রিলিজ)।
- **PATCH (`1.1.1`)**: ব্যাকওয়ার্ড-কম্প্যাটিবল বাগ ফিক্স বা সিকিউরিটি প্যাচ।

### গিট ট্যাগিং নিয়ম:
প্রতিটি স্প্রিন্ট বা রিলিজ শেষে `main` ব্রাঞ্চে অ্যানোটেটেড ট্যাগ তৈরি করতে হবে:
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Enterprise Core Scaffolding & Foundation"
git push origin v1.0.0
```

---

## ৭. সিক্রেটস ও ক্রিডেনশিয়াল সুরক্ষা নীতি (Zero Credential Leakage)
1. **কখনোই গিটহাবে পুশ হবে না**:
   - ডাটাবেজ পাসওয়ার্ড, ক্লাউড সিক্রেট কি, প্রাইভেট কি (`.pem`, `.key`), লাইভ টোকেন।
   - লোকাল এনভায়রনমেন্ট কনফিগ ফাইল (`docker/.env`, `.env.local`)।
2. **সুরক্ষা বলয় ([.gitignore](file:///g:/ERP-Software/Garments-ERP/.gitignore))**:
   - আমাদের প্রোজেক্টের রুট `.gitignore` ফাইলটি স্বয়ংক্রিয়ভাবে সমস্ত সেন্সিটিভ ফাইল ও বিল্ড আর্টফ্যাক্টসকে গিট ট্র্যাকিং থেকে সুরক্ষিত রাখে।
