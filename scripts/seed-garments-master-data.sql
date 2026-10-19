-- =============================================================================
-- [EN] GARMENTS ERP MASTER SEED DATA (Bangladesh RMG Industry Standards)
-- [BN] গার্মেন্টস ইআরপি মাস্টার সিড ডেটা (বাংলাদেশের তৈরি পোশাক খাতের মানদণ্ড)
-- =============================================================================

-- [EN] 1. Enable pgcrypto and Create RFC 9562 UUIDv7 generator function
-- [BN] ১. pgcrypto এক্সটেনশন সক্রিয়করণ ও RFC 9562 UUIDv7 ফাংশন তৈরি
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

-- [EN] 2. Master Measurement Units (Fabrics, Trims, Yarns, and Finished Garments)
-- [BN] ২. পরিমাপের একক মাস্টার তালিকা (ফেব্রিক, ট্রিমস, সুতা এবং তৈরি পোশাকের একক)
CREATE TABLE IF NOT EXISTS master_units (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    unit_code VARCHAR(20) UNIQUE NOT NULL,
    unit_name VARCHAR(100) NOT NULL,
    unit_category VARCHAR(50) NOT NULL -- [EN] Category / [BN] ক্যাটাগরি: 'FABRIC', 'YARN', 'TRIMS', 'GARMENT'
);

INSERT INTO master_units (unit_code, unit_name, unit_category) VALUES
('PCS', 'Pieces', 'GARMENT'),
('DZN', 'Dozen (12 Pcs)', 'GARMENT'),
('YDS', 'Yards', 'FABRIC'),
('MTR', 'Meters', 'FABRIC'),
('KG', 'Kilograms', 'FABRIC'),
('LBS', 'Pounds', 'YARN'),
('CONE', 'Thread Cone', 'TRIMS'),
('GRS', 'Gross (144 Pcs)', 'TRIMS'),
('ROL', 'Fabric Roll', 'FABRIC')
ON CONFLICT (unit_code) DO NOTHING;

-- [EN] 3. Standard Garment Sizes (International alphanumeric sorting)
-- [BN] ৩. তৈরি পোশাকের আন্তর্জাতিক স্ট্যান্ডার্ড সাইজ তালিকা
CREATE TABLE IF NOT EXISTS master_sizes (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    size_code VARCHAR(20) UNIQUE NOT NULL,
    display_order INT NOT NULL
);

INSERT INTO master_sizes (size_code, display_order) VALUES
('XS', 1), ('S', 2), ('M', 3), ('L', 4), ('XL', 5), ('XXL', 6), ('3XL', 7)
ON CONFLICT (size_code) DO NOTHING;

-- [EN] 4. Standard Quality Defect Codes (ASTM 4-Point & Sewing Floor Standards)
-- [BN] ৪. মান নিয়ন্ত্রণ ডিফেক্ট কোড (ASTM ৪-পয়েন্ট ও সুইং ফ্লোর ত্রুটির কোড)
CREATE TABLE IF NOT EXISTS master_defect_codes (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    defect_code VARCHAR(20) UNIQUE NOT NULL,
    defect_name VARCHAR(100) NOT NULL,
    defect_category VARCHAR(50) NOT NULL -- 'FABRIC', 'SEWING', 'FINISHING'
);

INSERT INTO master_defect_codes (defect_code, defect_name, defect_category) VALUES
('DEF-FAB-01', 'Hole / Slub', 'FABRIC'),
('DEF-FAB-02', 'Shade Variation', 'FABRIC'),
('DEF-FAB-03', 'Yarn Contamination', 'FABRIC'),
('DEF-SEW-01', 'Broken Stitch', 'SEWING'),
('DEF-SEW-02', 'Skipped Stitch', 'SEWING'),
('DEF-SEW-03', 'Puckering / Pleat', 'SEWING'),
('DEF-SEW-04', 'Uneven Hemming', 'SEWING'),
('DEF-FIN-01', 'Oil / Dirty Spot', 'FINISHING'),
('DEF-FIN-02', 'Iron Shine Mark', 'FINISHING')
ON CONFLICT (defect_code) DO NOTHING;
