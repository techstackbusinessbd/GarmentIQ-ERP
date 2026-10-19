# পোস্টগ্রেসকিউএল ডেটাবেজ ডিজাইন ও স্কিমা আর্কিটেকচার (Database Design)

> 🛑 **অলঙ্ঘনীয় ডেটাবেজ আইন (Rule 12)**:  
> ডেটাবেজে কোনো নতুন টেবিল তৈরি বা কলাম পরিবর্তনের আগে প্রতিটি কলামের নাম ও টাইপ আমাদের **Product Director / CTO (স্যার / বস)**-এর সামনে পেশ করে রিভিউ ও অনুমোদন করিয়ে নেওয়া বাধ্যতামূলক। অনুমোদনহীন কোনো টেবিল বা কলাম তৈরি করা যাবে না। বিস্তারিত: [.agents/rules/12_database_schema_approval_gate.md](file:///g:/ERP-Software/Garments-ERP/.agents/rules/12_database_schema_approval_gate.md)।

---

## ১. কোর অডিট কাঠামো ও প্রাইমারি কি স্পেসিফিকেশন (UUIDv7 & Auditable Base Table Pattern)

> 🛑 **প্রাইমারি কি আইন (Mandatory UUIDv7 - ADR-007)**:  
> সিস্টেমের কোনো টেবিলে সাধারণ অটো-ইনক্রিমেন্ট আইডি (`SERIAL`, `BIGINT`, `SEQUENCE`) কিংবা সাধারণ র‍্যান্ডম `UUIDv4` ব্যবহার সম্পূর্ণ নিষিদ্ধ। প্রতিটি টেবিলে বাধ্যতামূলকভাবে RFC 9562 স্ট্যান্ডার্ডের টাইম-সর্টেড **UUIDv7** ব্যবহার করতে হবে।

গার্মেন্টস ইআরপি-র প্রতিটি ব্যবসায়িক টেবিল এই অডিট ফিল্ড ও UUIDv7 প্রাইমারি কি ধারণ করবে:

```sql
-- বেস অডিট কলামের স্ট্রাকচার (UUIDv7 Primary Key + Audit Trail)
id            UUID PRIMARY KEY,               -- RFC 9562 UUIDv7 (Time-ordered 48-bit Unix Epoch + Random)
created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by    VARCHAR(100) NOT NULL,
updated_by    VARCHAR(100) NOT NULL,
version       BIGINT NOT NULL DEFAULT 0,      -- Optimistic Locking এর জন্য
is_deleted    BOOLEAN NOT NULL DEFAULT FALSE  -- Soft Delete Support
```

### ⚡ কেন সাধারণ আইডি বা UUIDv4 নিষিদ্ধ এবং UUIDv7 বাধ্যতামূলক?
1. **জিরো B-Tree ফ্র্যাগমেন্টেশন**: UUIDv7-এর প্রথম ৪৮ বিট টাইমস্ট্যাম্প হওয়ায় পোস্টগ্রেসকিউএল B-Tree ইনডেক্সে ক্রম অনুযায়ী ইনসার্ট হয়, পেজ স্প্লিট হয় না।
2. **জিরো আইডি ইনিউমারেশন রিস্ক**: সাধারণ সিকোয়েন্স আইডির মতো বায়ার বা অর্ডার নম্বর আন্দাজ করে ডেটা চুরি করা অসম্ভব।
3. **ডিস্ট্রিবিউটেড ও অফলাইন ট্র্যাকিং**: সুইং ফ্লোরের হ্যান্ডহেল্ড RFID রিডার বা ট্যাবলেট সেন্ট্রাল ডিবিতে কানেক্ট না থেকেও ইউনিক UUIDv7 আইডি তৈরি করতে পারে যা পরবর্তীতে সিনক্রোনাইজেশনের সময় কোনো কনফ্লিক্ট তৈরি করে না।
4. **স্বয়ংক্রিয় ক্রোনোলজিক্যাল সর্টিং**: আলাদা `created_at` ছাড়াও `id` দিয়ে সর্ট করলেই রেকর্ড স্বয়ংক্রিয়ভাবে টাইম-অর্ডারে পাওয়া যায়।


---

## ২. মূল ডোমেন রিলেশনাল স্কিমা (Core ERD Relationships)

```
[buyers] 1 ────< [styles] 1 ────< [purchase_orders]
                     │                   │
                     ▼                   ▼
                [style_bom]     [po_size_color_breakdown]
                     │                   │
                     ▼                   ▼
           [fabric_rolls] 1 ───< [cutting_orders] 1 ───< [bundle_cards]
```

### প্রধান প্রধান টেবিলসমূহ:
1. **`buyers`**: বায়ারের নাম, দেশ, কারেন্সি, পেমেন্ট টার্মস (L/C, TT)।
2. **`styles`**: স্টাইল নম্বর, সিজন, ডিপার্টমেন্ট (Men/Women/Kids), টেকপ্যাক রেফারেন্স।
3. **`style_bom`**: একটি স্টাইলের জন্য কী কী ফেব্রিক ও ট্রিমস লাগবে এবং কত ডজনে কত কনজাম্পশন (`BigDecimal`)।
4. **`purchase_orders`**: বায়ারের দেওয়া নিশ্চিত অর্ডার, ডেলিভারি ডেট, টোটাল কোয়ান্টিটি ও FOB ভ্যালু।
5. **`po_size_color_breakdown`**: প্রতিটি কালার ও সাইজ অনুযায়ী এক্স্যাক্ট অর্ডারের সংখ্যা।
6. **`fabric_rolls`**: রোল নম্বর, লট নম্বর, জিএসএম (GSM), গজ/কেজি এবং ৪-পয়েন্ট কিউসি স্কোর।
7. **`cutting_orders`**: মার্কার লেন্থ, প্লাই কাউন্ট ও টোটাল কাটিং কোয়ান্টিটি।
8. **`bundle_cards`**: প্রতিটি কাটিং বান্ডিলের বারকোড, সাইজ, সিরিয়াল ও সুইং লাইন ট্র্যাকিং।

---

## ৩. মাল্টি-টেন্যান্ট ডাইনামিক ফিল্ডস ও মেটাডাটা স্কিমা (Tenant Dynamic Fields & JSONB Engine - ADR-008)

> 💡 **জিরো-কোড ক্লায়েন্ট কাস্টমাইজেশন নীতি**:  
> কোনো ক্লায়েন্টের জন্য আমাদের এক লাইনের কোড বা ডেটাবেজ স্কিমা (DDL) পরিবর্তন করতে হবে না। ক্লায়েন্ট অ্যাডমিন নিজেই সিস্টেম সেটিংস থেকে তার কারখানার সুবিধামতো যত খুশি নতুন ফিল্ড যোগ বা বাদ দিতে পারবে; ব্যাকএন্ড ও ডেটাবেজ থাকবে সম্পূর্ণ সুরক্ষিত, দ্রুতগতির ও সুশৃঙ্খল।

### ৩.১ মেটাডাটা ডেফিনিশন টেবিল (`tenant_custom_field_definitions`)
```sql
CREATE TABLE tenant_custom_field_definitions (
    id                UUID PRIMARY KEY,               -- RFC 9562 UUIDv7
    tenant_id         UUID NOT NULL,                  -- নির্দিষ্ট ফ্যাক্টরি ক্লায়েন্ট
    entity_name       VARCHAR(50) NOT NULL,           -- e.g. 'users', 'buyers', 'orders'
    field_name        VARCHAR(50) NOT NULL,           -- e.g. 'nid_number', 'blood_group'
    field_label       VARCHAR(100) NOT NULL,          -- UI প্রদর্শিত নাম
    data_type         VARCHAR(20) NOT NULL,           -- STRING, NUMBER, DATE, BOOLEAN, SELECT
    is_required       BOOLEAN NOT NULL DEFAULT FALSE, -- বাধ্যতামূলক কি না
    validation_regex  VARCHAR(255),                   -- ঐচ্ছিক ভ্যালিডেশন প্যাটার্ন
    dropdown_options  JSONB DEFAULT '[]'::jsonb,      -- SELECT হলে ড্রপডাউন অপশন তালিকা
    display_order     INT NOT NULL DEFAULT 0,         -- ইউআই সর্টিং ক্রম
    created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by        VARCHAR(100) NOT NULL,
    version           BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_tenant_entity_field UNIQUE (tenant_id, entity_name, field_name)
);
```

### ৩.২ ব্যবসায়িক টেবিলে কাস্টম অ্যাট্রিবিউটস JSONB কলাম ও GIN ইনডেক্সিং
প্রতিটি মূল ব্যবসায়িক টেবিলে (যেমন: `users`, `buyers`, `purchase_orders`) একটি `custom_attributes` কলাম থাকবে:
```sql
-- কাস্টম অ্যাট্রিবিউটস কলাম যুক্তকরণ
ALTER TABLE users ADD COLUMN custom_attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

-- দ্রুতগতির সার্চ ও ফিল্টারিং নিশ্চিত করতে PostgreSQL GIN ইনডেক্স
CREATE INDEX idx_users_custom_attrs ON users USING gin (custom_attributes jsonb_path_ops);
```

### ৩.৩ সংরক্ষিত ডেটার নমুনা ও উচ্চগতির কোয়েরি উদাহরণ
```json
// users.custom_attributes-এ সংরক্ষিত ডেটার বাস্তব রূপ
{
  "nid_number": "19941234567890123",
  "blood_group": "B+",
  "emergency_contact": "+8801712345678",
  "rfid_wristband_id": "RFID-W-9901"
}
```

```sql
-- নির্দিষ্ট টেন্যান্টের অধীনে ব্লাড গ্রুপ 'B+' কর্মী খোঁজার সাব-মিলিসেকেন্ড কোয়েরি
SELECT id, full_name, email, custom_attributes->>'blood_group' AS blood_group
FROM users
WHERE tenant_id = '0192a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b'
  AND custom_attributes @> '{"blood_group": "B+"}';
```


