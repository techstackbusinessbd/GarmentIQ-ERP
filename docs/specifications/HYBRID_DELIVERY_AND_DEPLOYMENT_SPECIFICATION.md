# গার্মেন্টস ইআরপি - হাইব্রিড ডেলিভারি ও ডেপ্লয়মেন্ট স্পেসিফিকেশন (HYBRID_DELIVERY_AND_DEPLOYMENT_SPECIFICATION.md)

> **ডকুমেন্ট আইডি**: `SPEC-013`  
> **রেফারেন্স**: [ADR-003](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md#L24), [ADR-013](file:///g:/ERP-Software/Garments-ERP/docs/decisions/ADR_LOG.md)  
> **প্রণেতা**: 👨‍💼 তানভীর আহমেদ (Chief Solutions Architect) ও 👨‍💻 আরিফুল ইসলাম (Tech Lead)  
> **অনুমোদনকারী**: 👑 প্রোডাক্ট ডিরেক্টর / সিটিও (স্যার)  
> **নীতিমালা**: রুল ০৭ (<৩০০ লাইন), রুল ১২ (স্কিমা গেট), রুল ১৫ (দ্বিভাষিক), রুল ১৭ (এন্টারপ্রাইজ)

---

## ১. কৌশলগত উদ্দেশ্য ও হাইব্রিড ডেলিভারি মডেল (Strategic Intent & Delivery Modes)

তৈরি পোশাক (RMG) খাতের ক্রেতা ও উৎপাদকদের ভিন্নধর্মী চাহিদার কারণে GarmentIQ ERP একটি একক সিস্টেমে দুটি পৃথক ডেলিভারি মোড পরিচালনা করে:

```
                                [ প্ল্যাটফর্ম অ্যাডমিন কনসোল (/platform/tenants) ]
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼                                                                   ▼
       [ মোড ১: CLOUD_SAAS ]                                             [ মোড ২: ON_PREM_SELF_HOSTED ]
  স্বতন্ত্র মাল্টি-টেন্যান্ট ক্লাউড                                        এয়ার-গ্যাপড অন-প্রেমিসেস ডেডিকেটেড ক্লাস্টার
  - অটো সাবডোমেন (`client.garmentiq.com`)                                - অটো-জেনারেটেড ডকার বান্ডল (`.zip`)
  - ওয়াইল্ডকার্ড ডিএনএস ও হোস্ট রাউটার                                    - শূন্য সোর্সকোড প্রকাশ (প্রাইভেট কন্টেইনার ইমেজ)
  - শেয়ার্ড ইনফ্রাস্ট্রাকচার + RLS আইসোলেশন                               - RSA-4096 সাইনড অফলাইন লাইসেন্স টোকেন
```

| প্যারামিটার | মোড ১: ক্লাউড SaaS (`CLOUD_SAAS`) | মোড ২: সেলফ-হোস্টেড অন-প্রেম (`ON_PREM_SELF_HOSTED`) |
| :--- | :--- | :--- |
| **টার্গেট অডিয়েন্স** | ছোট-মাঝারি কারখানা, বাইং হাউস, দ্রুত রোলআউট | বৃহৎ করপোরেট গ্রুপ (যেমন: ডিবিএল, হা-মীম, বেক্সিমকো) |
| **হোস্টিং ও ডেটা** | সেন্ট্রাল ক্লাউড প্ল্যাটফর্ম (AWS / GCP / Bare Metal) | ক্লায়েন্টের নিজস্ব অন-প্রিম ডেটাসেন্টার / লোকাল সার্ভার |
| **টেন্যান্ট আইসোলেশন** | Row-Level Security (`tenant_id`), Hibernate 6 | ফিজিক্যাল ডেটাবেজ ও নেটওয়ার্ক আইসোলেশন |
| **অ্যাক্সেস URL** | `https://{subdomain}.garmentiq.com` | `https://erp.{client-domain}.local` বা সরাসরি IP |
| **ডেলিভারি পদ্ধতি** | রিয়েল-টাইম অটোমেটিক ক্লাউড অ্যাক্টিভেশন | ১-ক্লিকে `garmentiq-onprem-bundle.zip` ডাউনলোড |

---

## ২. মোড ১: ক্লাউড SaaS অটোমেটেড সাবডোমেন প্রোভিশনিং (Cloud SaaS Engine)

### ২.১ রিয়েল-টাইম লাইফসাইকেল ফ্লো
1. **সাবডোমেন নির্বাচন ও ভ্যালিডেশন**:
   - প্ল্যাটফর্ম অ্যাডমিন রেজিস্ট্রেশন ফর্মে সাবডোমেন স্ল্যাগ প্রদান করে (যেমন: `ananta`)।
   - স্ল্যাগ ফরম্যাট: RFC 1123 কমপ্লায়েন্ট (শুধুমাত্র `a-z`, `0-9`, এবং `-`, ৩ থেকে ৩০ অক্ষর)।
   - রিজার্ভড স্ল্যাগ সুরক্ষা: `api`, `admin`, `platform`, `app`, `auth`, `cdn`, `mail` ইত্যাদি নিষিদ্ধ।
2. **ওয়াইল্ডকার্ড ডিএনএস ও ইনগ্রেস ট্র্যাফিক (Wildcard DNS)**:
   - প্ল্যাটফর্ম ডোমেনে একটি একক ওয়াইল্ডকার্ড `*.garmentiq.com` `A`/`CNAME` রেকর্ড প্ল্যাটফর্ম ইনগ্রেস (Cloudflare / Traefik / Nginx) এর সাথে সংযুক্ত থাকে। নতুন ক্লায়েন্টের জন্য কোনো ডিএনএস রিস্টার্ট বা বিলম্ব লাগে না।
3. **হোস্ট-হেডার রেজোলিউশন ও সাব-৫ms ক্যাশিং (Host-Header Resolver)**:
   - স্প্রিং বুট ফিল্টার `TenantSubdomainFilter` ইনকামিং রিকোয়েস্টের `Host` হেডার পার্স করে।
   - Redis ক্যাশ থেকে `tenant_subdomain:{subdomain}` চাবি অনুসন্ধান করে `tenant_id` বের করে।
   - ক্যাশ মিস হলে ডেটাবেজে কুয়েরি করে এবং রেডিসে ১ ঘণ্টা TTL দিয়ে ক্যাশ করে।
   - থ্রেড-লোকাল `TenantContext.setCurrentTenant(tenantId)` নির্ধারণ করে।

---

## ৩. মোড ২: অন-প্রেমিসেস ডকার বান্ডল জেনারেটর ইঞ্জিন (Docker Bundle Engine)

বৃহৎ গার্মেন্টস প্রতিষ্ঠানগুলো দুর্বল ইন্টারনেট ও আইপি সিকিউরিটির কারণে নিজস্ব সার্ভারে সিস্টেম চালায়। প্ল্যাটফর্ম কনসোল তাদের জন্য সম্পূর্ণ প্রস্তুত ডকার বান্ডল তৈরি করে:

### ৩.১ শূন্য সোর্সকোড এক্সপোজার গ্যারান্টি (Zero Source Code Exposure)
- ক্লায়েন্টকে কখনোই কোনো জাভা সোর্সকোড (`.java`) বা রিঅ্যাক্ট সোর্সকোড (`.tsx`) প্রদান করা হয় না।
- ক্লায়েন্ট পায় সিকিউরড, মিনিমালিস্ট এবং মাল্টি-স্টেজ অপটিমাইজড ডকার প্রোডাকশন ইমেজ।
- ইমেজগুলো আমাদের প্রাইভেট কন্টেইনার রেজিস্ট্রি (`registry.garmentiq.com/enterprise/*`) থেকে সাইনড টোকেন দিয়ে পুল করা হয়।

### ৩.২ জেনারেটেড বান্ডলের কাঠামো (`garmentiq-onprem-bundle.zip`)
```
garmentiq-onprem-{tenant_code}/
├── docker-compose.yml          # প্রি-কনফিগারড PostgreSQL 17, Redis 7, Backend, Frontend
├── .env.production             # অটো-জেনারেটেড এনক্রিপ্টেড সিক্রেটস ও ডাটাবেজ পাসওয়ার্ড
├── LICENSE.key                 # RSA-4096 ক্রিপ্টোগ্রাফিক সাইনড লাইসেন্স পে-লোড
├── deploy.sh                   # লিনাক্স ১-ক্লিক ডিপ্লয়মেন্ট স্ক্রিপ্ট (Docker Engine অডিট সহ)
├── deploy.ps1                  # উইন্ডোজ সার্ভার ১-ক্লিক ডিপ্লয়মেন্ট স্ক্রিপ্ট
└── diagnostics.sh              # কনটেইনার ও ডেটাবেজ কানেক্টিভিটি টেস্ট টুল
```

### ৩.৩ ক্রিপ্টোগ্রাফিক লাইসেন্সিং ও নোড-লকিং (Cryptographic License & Node-Lock)
- প্রতিটি অন-প্রেম বান্ডলে একটি `LICENSE.key` থাকে যা আমাদের প্ল্যাটফর্ম প্রাইভেট কি (RSA-4096) দ্বারা ডিজিটালভাবে স্বাক্ষরিত।
- পে-লোড ডেটা:
  ```json
  {
    "tenant_code": "DBL_GROUP",
    "issued_at": "2026-10-20T00:00:00Z",
    "expires_at": "2027-10-20T23:59:59Z",
    "max_factory_units": 12,
    "max_active_users": 500,
    "allowed_modules": ["MERCHANDISING", "INVENTORY", "CUTTING", "SEWING", "WASHING", "RFID"],
    "machine_fingerprint": "SHA256:4a8b... (অপশনাল নোড-লক)",
    "signature": "RSA4096_BASE64_SIGNATURE"
  }
  ```
- অন-প্রেম স্প্রিং বুট ব্যাকএন্ডে আমাদের পাবলিক কি হার্ডকোড থাকে, যা রানটাইমে স্টার্টআপের সময় এবং প্রতি ১ ঘণ্টায় লাইসেন্স ভ্যালিডেট করে। লাইসেন্স টেম্পার বা মেয়াদোত্তীর্ণ হলে সিস্টেম কেবল রিড-অনলি মোডে চলে যায়।

---

## ৪. ডেটাবেজ স্কিমা এক্সটেনশন প্রস্তাবনা (Rule 12 Database Schema Gate)

বর্তমান `tenants` টেবিলে নিচের কলামগুলো যুক্ত করার প্রস্তাব করা হলো (Flyway মাইগ্রেশন স্ক্রিপ্ট `V3__add_tenant_hybrid_delivery_columns.sql`):

```sql
-- [EN] Extend tenants table for hybrid cloud subdomain and on-prem licensing
-- [BN] ক্লাউড সাবডোমেন ও অন-প্রেম লাইসেন্সিংয়ের জন্য tenants টেবিল সম্প্রসারণ
ALTER TABLE tenants
    ADD COLUMN deployment_type VARCHAR(30) NOT NULL DEFAULT 'CLOUD_SAAS',
    ADD COLUMN subdomain VARCHAR(63) UNIQUE,
    ADD COLUMN custom_domain VARCHAR(255) UNIQUE,
    ADD COLUMN license_key_hash VARCHAR(255),
    ADD COLUMN license_expires_at TIMESTAMPTZ,
    ADD COLUMN max_factory_units INT NOT NULL DEFAULT 5,
    ADD COLUMN max_active_users INT NOT NULL DEFAULT 50,
    ADD COLUMN machine_fingerprint VARCHAR(128),
    ADD COLUMN is_airgapped BOOLEAN NOT NULL DEFAULT false;

-- [EN] Validation constraint: CLOUD_SAAS requires valid subdomain format
-- [BN] ভ্যালিডেশন কনস্ট্রেইন্ট: ক্লাউড SaaS-এর জন্য সাবডোমেন বাধ্যতামূলক ও সুনির্দিষ্ট ফরম্যাট
ALTER TABLE tenants ADD CONSTRAINT chk_tenant_deployment_mode 
    CHECK (
        (deployment_type = 'CLOUD_SAAS' AND subdomain IS NOT NULL) OR
        (deployment_type = 'ON_PREM_SELF_HOSTED')
    );

CREATE INDEX idx_tenants_subdomain ON tenants(subdomain) WHERE is_deleted = false;
CREATE INDEX idx_tenants_deployment_type ON tenants(deployment_type) WHERE is_deleted = false;
```

---

## ৫. প্ল্যাটফর্ম অনবোর্ডিং উইজার্ড UI/UX আর্কিটেকচার (Platform Admin Wizard)

সুপারঅ্যাডমিন যখন `/platform/tenants` স্ক্রিনে **"New Client Tenant"** বাটনে ক্লিক করবেন, তখন একটি ৪-ধাপের ইন্টারেক্টিভ উইজার্ড আসবে:

```
[১. ফ্যাক্টরি প্রোফাইল] ➔ [২. ডেলিভারি মোড নির্বাচন] ➔ [৩. রিসোর্স কোটা ও মডিউল] ➔ [৪. অ্যাক্টিভেশন / ডাউনলোড]
```

1. **ধাপ ১: লিগ্যাল প্রোফাইল**: ক্লায়েন্ট নাম, ইউনিক কোড (`ANANTA`), অ্যাডমিন ইমেইল ও পাসওয়ার্ড।
2. **ধাপ ২: ডেলিভারি মোড কার্ড নির্বাচন**:
   - ☁️ **Cloud Multi-Tenant SaaS**: ইনস্ট্যান্ট সাবডোমেন ইনপুট `[ ananta ] .garmentiq.com`। লাইভ স্ল্যাগ অ্যাভেইলেবিলিটি চেকার।
   - 🏢 **Self-Hosted Private Docker Cloud**: ক্লায়েন্ট সার্ভার মেমোরি (16GB/32GB/64GB) নির্বাচন ও মেশিন ফিঙ্গারপ্রিন্ট ইনপুট।
3. **ধাপ ৩: ক্যাপাসিটি কোটা**: সর্বোচ্চ ফ্যাক্টরি ইউনিট (১-২০), সর্বোচ্চ সক্রিয় ইউজার (১০-১০০০), আরএফআইডি ট্র্যাকিং গেট সক্রিয়করণ।
4. **ধাপ ৪: কমপ্লিশন অ্যাকশন**:
   - ক্লাউড মোডে: **"Provision & Launch Subdomain"** (ইনস্ট্যান্টলি লাইভ)।
   - অন-প্রেম মোডে: **"Generate Signed Docker Bundle"** (১ ক্লিকে `garmentiq-onprem-bundle.zip` ডাউনলোড ও লাইসেন্স কি ইস্যু)।

---

## ৬. টিম দায়িত্ব বণ্টন ও এক্সিকিউশন প্ল্যান (Virtual Team Allocation)

| সদস্য | দায়িত্ব ও ডেলিভারেবলস |
| :--- | :--- |
| **👨‍💼 তানভীর আহমেদ** | ডোমেন স্পেসিফিকেশন, লাইসেন্স পে-লোড কন্ট্রাক্ট ও সিটিও সাইন-অফ তত্ত্বাবধান। |
| **👨‍💻 আরিফুল ইসলাম** | Flyway V2 স্ক্রিপ্ট, `TenantSubdomainFilter`, ও `DockerBundleGeneratorService` তৈরি। |
| **👩‍💻 সাদিয়া জাহান** | `/platform/tenants/new` উইজার্ড UI, লাইভ স্ল্যাগ চেকার ও ১-ক্লিক বান্ডল ডাউনলোড ইন্টারফেস। |
| **👩‍🔬 ফারহানা চৌধুরী** | আরএসএ-৪০৯৬ লাইসেন্স ভ্যালিডেশন সিকিউরিটি টেস্ট ও মাল্টি-টেন্যান্ট ডেটা লিকেজ প্রিভেনশন অডিট। |
