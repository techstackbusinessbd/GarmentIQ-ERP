-- =============================================================================
-- [EN] GARMENTS ERP DATABASE INITIALIZATION SCRIPT (Docker Entrypoint)
-- [BN] গার্মেন্টস ইআরপি ডেটাবেজ ইনিশিয়ালাইজেশন স্ক্রিপ্ট (ডকার এন্ট্রি-পয়েন্ট)
-- =============================================================================
-- [EN] Rules: Rule 05 (Zero Hardcode & Dynamic Data), Rule 07 (<300 lines), Rule 15 (Bilingual)
-- [BN] এই স্ক্রিপ্ট শুধুমাত্র প্রয়োজনীয় পোস্টগ্রেস এক্সটেনশন ও ফাংশন প্রস্তুত করে।
--      কোনো প্রকার ডামি বা প্রাক-নির্ধারিত মাস্টার ডেটা সিড করা হয় না; সমস্ত ডেটা
--      সিস্টেম রান করার পর ব্যবহারকারী বা অ্যাডমিন ডাইনামিকালি এন্ট্রি করবেন।
-- =============================================================================

-- 1. [EN] Enable pgcrypto and Create RFC 9562 UUIDv7 generator function
--    [BN] ১. pgcrypto এক্সটেনশন সক্রিয়করণ ও RFC 9562 UUIDv7 ফাংশন তৈরি
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION generate_uuid_v7()
RETURNS uuid AS $$
DECLARE
    unix_time_ms bytea;
    uuid_bytes bytea;
BEGIN
    unix_time_ms = substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3 for 6);
    uuid_bytes = unix_time_ms || gen_random_bytes(10);
    -- set version to 7 (0111)
    uuid_bytes = set_byte(uuid_bytes, 6, (b'0111' || get_byte(uuid_bytes, 6)::bit(4))::bit(8)::int);
    -- set variant to 2 (10xx xxxx)
    uuid_bytes = set_byte(uuid_bytes, 8, (b'10' || get_byte(uuid_bytes, 8)::bit(6))::bit(8)::int);
    RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 2. [EN] Master Measurement Units Table (Schema only - zero seed data)
--    [BN] ২. পরিমাপের একক মাস্টার টেবিল (শুধুমাত্র স্কিমা - কোনো সিড ডেটা নেই)
CREATE TABLE IF NOT EXISTS master_units (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    unit_code VARCHAR(20) UNIQUE NOT NULL,
    unit_name VARCHAR(100) NOT NULL,
    unit_category VARCHAR(50) NOT NULL
);

-- 3. [EN] Standard Garment Sizes Table (Schema only - zero seed data)
--    [BN] ৩. পোশাকের সাইজ মাস্টার টেবিল (শুধুমাত্র স্কিমা - কোনো সিড ডেটা নেই)
CREATE TABLE IF NOT EXISTS master_sizes (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    size_code VARCHAR(20) UNIQUE NOT NULL,
    display_order INT NOT NULL
);

-- 4. [EN] Quality Defect Codes Table (Schema only - zero seed data)
--    [BN] ৪. কোয়ালিটি ডিফেক্ট কোড টেবিল (শুধুমাত্র স্কিমা - কোনো সিড ডেটা নেই)
CREATE TABLE IF NOT EXISTS master_defect_codes (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    defect_code VARCHAR(20) UNIQUE NOT NULL,
    defect_name VARCHAR(100) NOT NULL,
    defect_category VARCHAR(50) NOT NULL
);
