# ব্যাকএন্ড ইঞ্জিনিয়ারিং নীতিমালা: জাভা (Java), স্প্রিং বুট (Spring Boot) ও পোস্টগ্রেসকিউএল (PostgreSQL)

## ১. আর্কিটেকচার কাঠামো: ক্লিন লেয়ারড আর্কিটেকচার
গার্মেন্টস ইআরপি-র প্রতিটি মডিউলে এই ফোল্ডার কাঠামো অবশ্যই মেনে চলতে হবে:

```
com.garments.erp/
├── core/                       # গ্লোবাল ও কোর ইঞ্জিনিয়ারিং উপাদান
│   ├── entity/                 # AuditableBaseEntity (@MappedSuperclass, @Version)
│   ├── exception/              # GlobalExceptionHandler, Custom Exceptions
│   ├── response/               # ApiResponse<T>, PaginatedResponse<T>
│   ├── security/               # JWT Filter, SecurityConfig, UserPrincipal
│   └── utils/                  # BigDecimalUtil, CurrencyUtil, UnitConverter
│
└── modules/<মডিউলের_নাম>/       # যেমন: merchandising, inventory, production, quality
    ├── controller/             # রেস্ট কন্ট্রোলার (REST API এন্ডপয়েন্ট ও Jakarta ভ্যালিডেশন)
    ├── dto/
    │   ├── request/            # ক্লায়েন্ট থেকে আসা ডেটার ইমিউটেবল রেকর্ড (Java Records)
    │   └── response/           # ক্লায়েন্টকে পাঠানো রেসপন্স DTOs
    ├── entity/                 # ডোমেন JPA এন্টিটি (PostgreSQL রিলেশনাল ম্যাপিং)
    ├── repository/             # Spring Data JPA রিপোজিটরি ও স্পেসিফিকেশন
    ├── service/                # বিজনেজ লজিক সার্ভিস ইন্টারফেস
    │   └── impl/               # সার্ভিস ইমপ্লিমেন্টেশন (@Transactional সহ)
    ├── exception/              # ডোমেন ভিত্তিক কাস্টম এরর
    └── mapper/                 # Entity থেকে DTO রূপান্তরকারী ম্যাপার
```

---

## ২. ইআরপি ও ডেটার নির্ভরযোগ্যতার নীতিমালা

1. **হিসাবের নির্ভুলতা (Precision & Calculation)**:
   - ফেব্রিক বা সুতার ওজন, গজ, মিটার, জিএসএম (GSM), ডজন প্রতি কনজাম্পশন এবং টাকার হিসেবে **কখনোই `float` বা `double` ব্যবহার করা যাবে না**।
   - সব সময় `java.math.BigDecimal` ব্যবহার করতে হবে এবং নির্দিষ্ট রাউন্ডিং মোড (যেমন: `RoundingMode.HALF_UP`) দিতে হবে।

2. **অডিট ট্রেইল ও বাধ্যতামূলক UUIDv7 প্রাইমারি কি**:
   - 🛑 **কঠোর নিয়ম**: কোনো সাধারণ ইন্টিজার/অটো-ইনক্রিমেন্ট বা র‍্যান্ডম UUIDv4 ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।
   - প্রতিটি মডিউলের টেবিলে অবশ্যই এই সাধারণ ফিল্ডগুলো থাকতে হবে:
     - `id`: টাইম-অর্ডারড ইউনিক আইডি—বাধ্যতামূলকভাবে **RFC 9562 UUIDv7** (`java.util.UUID`, `@Id`)
     - `created_at`: তৈরির সময়কাল (UTC Instant, কখনোই পরিবর্তন হবে না)
     - `updated_at`: সর্বশেষ পরিবর্তনের সময়কাল (UTC Instant)
     - `created_by`: কোন ইউজার তৈরি করেছে (User ID / Username)
     - `updated_by`: কোন ইউজার পরিবর্তন করেছে
     - `@Version Long version`: একই সাথে দুজন পরিবর্তন করতে গেলে যেন কনফ্লিক্ট না হয় (Optimistic Locking)।
     - `is_deleted`: সফট ডিলিটের জন্য বুলিয়ান ফ্ল্যাগ।

3. **ডেটাবেজ ট্রানজ্যাকশন**:
   - ডেটা পরিবর্তন করার মেথডে অবশ্যই `@Transactional(rollbackFor = Exception.class)` ব্যবহার করতে হবে। মাঝপথে এরর হলে যেন আংশিক ডেটা সেভ না হয়।

---

## ৩. পোস্টগ্রেসকিউএল (PostgreSQL) ডেটাবেজ নিয়ম
1. **নামকরণের নিয়ম**:
   - টেবিলের নাম: বহুবচন ও ছোট হাতের স্মেক কেস (যেমন: `fabric_rolls`, `purchase_orders`).
   - কলামের নাম: ছোট হাতের স্নেক কেস (যেমন: `order_number`, `unit_price`).
   - ইনডেক্স: ফরেন কি এবং সার্চ করা ফিল্ডে ইনডেক্সিং নিশ্চিত করতে হবে।
2. **মাইগ্রেশন ফাইল**:
   - প্রজেক্টে ডেটাবেজ তৈরির জন্য Flyway বা Liquibase ভার্সন কন্ট্রোলড SQL ফাইল ব্যবহার করতে হবে।
3. **সফট ডিলিট (Soft Delete)**:
   - প্রোডাকশন বা ফিনান্সিয়াল কোনো অর্ডার পুরোপুরি ডিলিট করা যাবে না। `is_deleted` বা স্ট্যাটাস কলাম দিয়ে ট্র্যাক রাখতে হবে।

---

## ৪. এরর হ্যান্ডলিং ও রেসপন্স ফরম্যাট
- সব কন্ট্রোলারের এরর ধরার জন্য সেন্ট্রালাইজড `@RestControllerAdvice` থাকবে।
- প্রতিটি রেসপন্স এই স্ট্যান্ডার্ড ফরম্যাটে পাঠানো হবে:
  ```json
  {
    "success": true,
    "timestamp": "2026-10-19T10:00:00Z",
    "data": { ... },
    "error": null
  }
  ```

---

## ৫. দ্বিভাষিক (বাংলা ও ইংরেজি) কোড কমেন্টিং
- প্রতিটি সার্ভিস, মেথড ও ক্যালকুলেশনে অবশ্যই `[EN]` এবং `[BN]` ফরম্যাটে দ্বিভাষিক কমেন্ট থাকতে হবে।
- বিস্তারিত গাইডলাইন: [.agents/rules/15_bilingual_code_commenting_standards.md](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md)।
