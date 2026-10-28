-- =============================================================================
-- [EN] Flyway Migration V3: Add Employee Card Number to Users (Rule 12 & Rule 23)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V3: ব্যবহারকারী টেবিলে এমপ্লয়ি কার্ড নম্বর যোগকরণ (রুল ১২ ও রুল ২৩)
-- =============================================================================
-- [EN] Adds employee_card_no column for shop floor biometric, punch, and RFID tracking.
-- [BN] পোশাক কারখানার বায়োমেট্রিক, পাঞ্চ ও আরএফআইডি ট্র্যাকিংয়ের জন্য employee_card_no কলাম যোগ করে।

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS employee_card_no VARCHAR(50);

-- [EN] Performance index for tenant-scoped employee card lookups
-- [BN] টেন্যান্টভিত্তিক কার্ড নম্বরের দ্রুত অনুসন্ধানের জন্য পারফরম্যান্স ইনডেক্স
CREATE INDEX IF NOT EXISTS idx_users_tenant_card_no 
ON users(tenant_id, employee_card_no);
