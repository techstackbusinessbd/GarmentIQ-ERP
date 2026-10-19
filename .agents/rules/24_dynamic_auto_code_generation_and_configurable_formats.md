# ডাইনামিক অটো-কোড জেনারেশন ও কনফিগারেবল ফরম্যাট নীতি (Dynamic Auto-Code Generation & Configurable Formats Policy)

> 🛑 **অলঙ্ঘনীয় কোডিং ও আর্কিটেকচার অনুশাসন (Rule 24)**:  
> সিস্টেমের কোনো ব্যবসায়িক এনটিটির আইডেন্টিফায়ার বা বিজনেস কোড (যেমন: Buyer Code, Style Code, PO Number, Cutting Order Code, Bundle ID, Wash Challan, Invoice Number ইত্যাদি) **ব্যবহারকারী ম্যানুয়ালি টাইপ বা ইনপুট দিতে পারবে না**।  
> **সমস্ত বিজনেস কোড সিস্টেম দ্বারা ১০০% স্বয়ংক্রিয়ভাবে (System Auto-Generated) তৈরি হতে হবে এবং প্রতিটি কোডের ফরম্যাট অ্যাডমিন প্যানেল থেকে টেন্যান্ট অ্যাডমিন তার কারখানার পছন্দ অনুযায়ী যেকোনো সময় পরিবর্তন বা কনফিগার (100% Configurable) করতে পারবে।**

---

## ১. ব্যবসায়িক ও কৌশলগত প্রেক্ষাপট (RMG Business Rationale)
গার্মেন্টস কারখানায় প্রতিদিন হাজার হাজার রোল ফেব্রিক, কাটিং অর্ডার, সুইং বান্ডিল এবং এক্সপোর্ট কার্টনের মুভমেন্ট হয়।
1. **মানবীয় ভুল (Human Error) শূন্যের কোঠায় আনা**: অপারেটর বা মার্চেন্ডাইজার ম্যানুয়ালি কোড লিখলে ডুপ্লিকেট এন্ট্রি, টাইপো বা ভুল সিকোয়েন্স তৈরি হয়, যা RFID বা বারকোড স্ক্যানিংয়ে বিপর্যয় ঘটায়।
2. **কারখানাভিত্তিক স্বকীয়তা (Factory Flexibility)**: প্রতিটি গার্মেন্টস গ্রুপের নিজস্ব কোডিং প্যাটার্ন থাকে (যেমন: বায়ার কোড কেউ চায় `BYR-001`, কেউ চায় `ZAR-BYR-2601`)। সিস্টেম কোনো নির্দিষ্ট ফরম্যাট হার্ডকোড করবে না; অ্যাডমিন নিজের মতো করে ফরম্যাট তৈরি করে নেবে।

---

## ২. ডোমেনভিত্তিক অটো-জেনারেটেড কোড তালিকা (Core RMG Entities)

| Entity / Document | ডিফল্ট প্যাটার্ন (Default Pattern) | নমুনা আউটপুট (Sample Code) | কনফিগারেবিলিটি স্কোপ |
| :--- | :--- | :--- | :--- |
| **Buyer Profile** | `BYR-{SEQ:4}` | `BYR-0001` | অ্যাডমিন প্রিফিক্স ও প্যাডিং পরিবর্তনযোগ্য |
| **Style Profile** | `STY-{YYYY}-{SEQ:5}` | `STY-2026-00042` | বছর, বিভাগ ও ডিজিট সংখ্যা পরিবর্তনযোগ্য |
| **Purchase Order (PO)** | `PO-{YYYY}{MM}-{SEQ:4}` | `PO-202610-0018` | মাস, বছর ও সেপারেটর পরিবর্তনযোগ্য |
| **Fabric Roll Barcode** | `ROL-{YY}-{SEQ:6}` | `ROL-26-004512` | রোল লট ও মিলিসেকেন্ড বারকোড |
| **Marker Plan** | `MKR-{YYYY}-{SEQ:4}` | `MKR-2026-0105` | কাটিং টেবিল ও মার্কার ট্র্যাকিং |
| **Cutting Order** | `CUT-{YYYY}{MM}-{SEQ:4}` | `CUT-202610-0007` | কাটিং রুম ডেইলি সিকোয়েন্স |
| **Sewing Bundle RFID/QR**| `BDL-{YYYY}-{SEQ:7}` | `BDL-2026-0009841`| বান্ডিল ও শপ ফ্লোর লাইভ আইডি |
| **Wash Challan** | `WSH-CH-{YYYY}-{SEQ:4}` | `WSH-CH-2026-0089` | লন্ড্রি ও ডাইং চালান নম্বর |
| **Finishing Carton** | `CTN-{YYYY}-{SEQ:6}` | `CTN-2026-003412` | কার্টনিং ও প্যালেট বারকোড |
| **Commercial Invoice** | `EXP-INV-{YYYY}-{SEQ:4}` | `EXP-INV-2026-0015` | বায়ার কমার্শিয়াল এক্সপোর্ট ইনভয়েস |

---

## ৩. কনফিগারেশন টোকেন ও প্যাটার্ন ইঞ্জিন (Pattern Token Engine)

অ্যাডমিন প্যানেলে ফরম্যাট সাজানোর জন্য নিচের ডাইনামিক টোকেনগুলো সমর্থিত থাকবে:

| টোকেন (Token) | অর্থ ও রূপান্তর (Meaning & Dynamic Resolution) | উদাহরণ |
| :--- | :--- | :--- |
| `{PREFIX}` | অ্যাডমিন নির্ধারিত বর্ণমালা (Module Prefix) | `STY`, `PO`, `CUT` |
| `{YYYY}` | বর্তমান ৪-ডিজিটের বছর | `2026` |
| `{YY}` | বর্তমান ২-ডিজিটের সংক্ষিপ্ত বছর | `26` |
| `{MM}` | বর্তমান ২-ডিজিটের মাস (01 - 12) | `10` |
| `{DD}` | বর্তমান ২-ডিজিটের দিন (01 - 31) | `19` |
| `{TENANT}` | সংশ্লিষ্ট টেন্যান্ট বা কারখানা গ্রুপের ইউনিক কোড | `TEX`, `DNM` |
| `{DEPT}` | নির্দিষ্ট ডিপার্টমেন্ট বা সেকশন কোড | `MRCH`, `CUT`, `SEW` |
| `{SEQ:N}` | $N$ ডিজিটের প্যাডিংযুক্ত স্বয়ংক্রিয় ক্রমিক সংখ্যা | `{SEQ:4}` ➔ `0001`, `{SEQ:6}` ➔ `000001` |

### উদাহরণ (Admin Customization Example):
- অ্যাডমিন যদি স্টাইলের ফরম্যাট দেন: `TEX/{YY}/STY-{SEQ:4}`
- সিস্টেম জেনারেট করবে: `TEX/26/STY-0001`, `TEX/26/STY-0002` ইত্যাদি।

---

## ৪. ডেটাবেজ ও সিকোয়েন্স আর্কিটেকচার (Database Schema & Concurrency Safety)

কনকারেন্ট পরিবেশে যাতে একই সাথে একাধিক ইউজার সেভ চাপলেও কোনো ডুপ্লিকেট কোড তৈরি না হয় (Zero Race Condition):

### ক. `code_sequence_templates` টেবিল
```sql
CREATE TABLE code_sequence_templates (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    entity_type VARCHAR(50) NOT NULL, -- e.g. 'BUYER', 'STYLE', 'PO', 'CUTTING_ORDER'
    pattern VARCHAR(100) NOT NULL,    -- e.g. 'STY-{YYYY}-{SEQ:5}'
    prefix VARCHAR(20) NOT NULL,     -- e.g. 'STY'
    padding_length INT NOT NULL DEFAULT 5,
    reset_frequency VARCHAR(20) NOT NULL DEFAULT 'YEARLY', -- 'NEVER', 'YEARLY', 'MONTHLY', 'DAILY'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_tenant_entity_seq UNIQUE (tenant_id, entity_type)
);
```

### খ. `code_sequence_trackers` টেবিল (Atomic Lock Counter)
```sql
CREATE TABLE code_sequence_trackers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    entity_type VARCHAR(50) NOT NULL,
    current_year INT NOT NULL,
    current_month INT NOT NULL,
    last_sequence_value BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_tracker_period UNIQUE (tenant_id, entity_type, current_year, current_month)
);
```

### গ. জাভা সার্ভিস আর্কিটেকচার (Thread-Safe Atomic Execution):
```java
@Service
public class DynamicCodeGeneratorService {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized String generateNextCode(UUID tenantId, EntityTypeCode entityType) {
        // [EN] Lock tracker row atomically using SELECT ... FOR UPDATE or Redis INCR
        // [BN] কনকারেন্সি দ্বন্দ্ব এড়াতে অ্যাটমিকালি রো লক করে পরবর্তী ক্রমিক মান বের করা
        ...
        // [EN] Resolve tokens: {YYYY}, {MM}, {SEQ:N} into final immutable string
        // [BN] টোকেনগুলো বর্তমান সময় ও কাউন্টার দিয়ে প্রতিস্থাপন করে কোড তৈরি করা
        return resolvedCode;
    }
}
```

---

## ৫. অ্যাডমিন প্যানেল ইউআই ও লাইভ প্রিভিউ (Admin Panel UX)
1. **লাইভ প্রিভিউ (Live Preview)**: অ্যাডমিন যখন ইনপুটে প্যাটার্ন টাইপ করবে (যেমন: `BYR-{YYYY}-{SEQ:4}`), নিচে সাথে সাথে লাইভ প্রিভিউ ব্যাজ দেখাবে:  
   *Preview: `BYR-2026-0001`*।
2. **ফর্ম ইনপুট লকিং**: ফ্রন্টএন্ডের কোনো ফর্মে (যেমন: Add Buyer, Add Style, Create PO) কোড ইনপুট ফিল্ডটি এডিটেবল থাকবে না। এটি `Auto-generated on save` ব্যাজ দেখাবে অথবা সেভ হওয়ার পর পপুলেট হবে।

---

## ৬. ফারহানার কিউএ ভেরিফিকেশন গেট (Farhana's Auto-Code Gate)
ফারহানা চৌধুরী কোডবেস অডিটের সময় চেক করবেন:
- [ ] ফ্রন্টএন্ডের কোনো ফর্মে ব্যবহারকারীকে কোড ম্যানুয়ালি টাইপ করতে বাধ্য করা হচ্ছে কি না? (হলে রিজেক্ট)
- [ ] অ্যাডমিন প্যানেলে ফরম্যাট পরিবর্তন করলে পরবর্তী নতুন এন্ট্রিতে নতুন ফরম্যাট কাজ করছে কি না?
- [ ] ব্যাকএন্ডে ১০০টি কনকারেন্ট রিকোয়েস্ট একযোগে পাঠালে কোনো ডুপ্লিকেট কোড তৈরি হয় কি না? (স্ট্রিক্ট ইউনিক কনস্ট্রেইন্ট টেস্ট পাস হতে হবে)।
- [ ] প্রতিটি কোড জেনারেশন মেথড ও এসকিউএল স্ক্রিপ্টে রুল ১৫ অনুযায়ী `[EN]` ও `[BN]` কমেন্ট রয়েছে কি না?
