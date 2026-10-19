# বাংলা ও ইংরেজি দ্বিভাষিক কমেন্ট নীতিমালা (Bilingual Code Commenting Standards)

> 🛑 **অলঙ্ঘনীয় কোডিং অনুশাসন (Rule 15)**:  
> সিস্টেমের ব্যাকএন্ড (Java), ফ্রন্টএন্ড (React), ডেটাবেজ (SQL) এবং কনফিগারেশন ফাইলে কোডের প্রতিটি ক্লাস, মেথড, ফাংশন ও ব্যবসায়িক লজিকের সাথে **বাংলা এবং ইংরেজি উভয় ভাষায় (Bilingual: [EN] & [BN])** অর্থপূর্ণ কমেন্ট থাকতে হবে। এর মূল উদ্দেশ্য—ভবিষ্যতে যেকোনো স্থানীয় বা আন্তর্জাতিক ডেভেলপার যেন খুব সহজে কোড বুঝতে এবং রক্ষণাবেক্ষণ (maintain) করতে পারে।

---

## ১. দ্বিভাষিক কমেন্টের স্ট্যান্ডার্ড ফরম্যাট (Commenting Syntax & Template)

### ক. জাভা / স্প্রিং বুট ব্যাকএন্ড (Java & Spring Boot):
```java
/**
 * [EN] Calculates total fabric consumption in kilograms including cutting wastage allowance.
 * [BN] কাটিং অপচয় ও বায়ার টলারেন্স শতকরা হিসেব করে কিলোগ্রামে মোট ফেব্রিকের কনজাম্পশন বের করে।
 *
 * @param orderQuantityTotal [EN] Total garment order quantity in pieces / [BN] মোট পোশাকের সংখ্যা (পিস)
 * @param consumptionPerDozen [EN] Fabric consumption per dozen in yards / [BN] প্রতি ডজনে ফেব্রিকের চাহিদা (গজ)
 * @return [EN] Total required fabric in KG / [BN] মোট প্রয়োজনীয় ফেব্রিক (কেজি)
 */
public BigDecimal calculateFabricRequirement(Integer orderQuantityTotal, BigDecimal consumptionPerDozen) {
    // [EN] Step 1: Convert dozen consumption to single unit consumption
    // [BN] ধাপ ১: ডজনের কনজাম্পশনকে প্রতি একক পিসে রূপান্তর করা
    BigDecimal unitConsumption = consumptionPerDozen.divide(BigDecimal.valueOf(12), 4, RoundingMode.HALF_UP);

    // [EN] Step 2: Apply safety allowance percentage from database settings
    // [BN] ধাপ ২: ডেটাবেজ সেটিংস থেকে কাটিং সেফটি অ্যালাউন্স পার্সেন্টেজ যোগ করা
    return totalRequirement;
}
```

### খ. রিঅ্যাক্ট / ফ্রন্টএন্ড (React 19 & JavaScript):
```javascript
/**
 * [EN] Custom hook to fetch dynamic buyer list with TanStack Query caching.
 * [BN] ক্যাশিং সুবিধাসহ ব্যাকএন্ড থেকে বায়ারদের সক্রিয় তালিকা ফেচ করার কাস্টম হুক।
 */
export const useBuyers = () => {
  // [EN] Fetch active buyers only to avoid showing inactive entities
  // [BN] ড্রপডাউনে কেবল সক্রিয় বায়ারদের প্রদর্শন করতে ব্যাকএন্ড এপিআই কল করা
  return useQuery({
    queryKey: ['buyers', 'active'],
    queryFn: fetchActiveBuyers
  });
};
```

### গ. ডেটাবেজ ও এসকিউএল (PostgreSQL / Flyway Migrations):
```sql
-- =============================================================================
-- [EN] Table: buyers - Stores international garment buyers and commercial terms
-- [BN] টেবিল: buyers - আন্তর্জাতিক তৈরি পোশাকের ক্রেতা ও বাণিজ্যিক শর্তাবলি সংরক্ষণ করে
-- =============================================================================
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- [EN] Buyer official company name (Must be unique across system)
    -- [BN] বায়ারের প্রাতিষ্ঠানিক নাম (সিস্টেমে অবশ্যই ইউনিক হতে হবে)
    buyer_name VARCHAR(100) NOT NULL UNIQUE,
    
    -- [EN] Payment method: Letter of Credit (L/C) or Telegraphic Transfer (TT)
    -- [BN] পেমেন্ট পদ্ধতি: লেটার অব ক্রেডিট (এল/সি) বা টি/টি
    payment_terms VARCHAR(50) NOT NULL
);
```

---

## ২. কমেন্ট লেখার সুনির্দিষ্ট নিয়মাবলি (Guidelines)
1. **সহজ ও প্রাঞ্জল ভাষা**: বাংলা কমেন্টে সহজ, দৈনন্দিন সফটওয়্যার ও গার্মেন্টস পরিভাষা ব্যবহার করতে হবে (কোনো দুর্বোধ্য সাধু ভাষা বা রোবোটিক অনুবাদ নয়)।
2. **ব্যবসায়িক যুক্তির ওপর জোর**: কোড *কী* করছে তার চেয়ে *কেন* করছে (পোশাক খাতের সুনির্দিষ্ট সূত্র বা নিয়ম) তা কমেন্টে স্পষ্ট করা।
3. **নন-ট্রিভিয়াল কমেন্টিং**: প্রতি লাইনে অর্থহীন কমেন্ট (যেমন: `int a = 5; // a is 5`) পরিহার করে কমপ্লেক্স ডোমেন ক্যালকুলেশন ও আর্কিটেকচারাল ডিসিশন ব্যাখ্যা করা।

---

## ৩. ফারহানার কিউএ কমেন্টিং অডিট (Farhana's Bilingual Audit)
ফারহানা চৌধুরী কোড অডিটের সময় চেক করবেন:
- [ ] প্রতিটি নতুন মেথড/ফাংশনে `[EN]` এবং `[BN]` উভয় কমেন্ট রয়েছে কি না?
- [ ] কমেন্টগুলো কি ডেভেলপারের জন্য সহজবোধ্য ও তথ্যবহুল কি না?
- [ ] কোনো কমেন্ট মিসিং থাকলে সেই পিআর সাথে সাথে রিজেক্ট হবে।
