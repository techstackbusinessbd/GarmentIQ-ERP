-- =============================================================================
-- [EN] Flyway Migration V2: Master Units, Sizes & Defect Codes (Rule 23)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V2: মাস্টার পরিমাপের একক, সাইজ গ্রিড এবং ডিফেক্ট কোড (রুল ২৩)
-- =============================================================================
-- [EN] Establishes global master reference tables for fabric units, standard
--      alphanumeric size grids, and quality defect codes used across apparel manufacturing.
-- [BN] তৈরি পোশাক উৎপাদনের বিভিন্ন ধাপে ব্যবহৃত পরিমাপের একক, আন্তর্জাতিক সাইজ গ্রিড
--      এবং কোয়ালিটি ডিফেক্ট কোডের গ্লোবাল মাস্টার রেফারেন্স টেবিল প্রস্তুত করে।

-- 1. [EN] Table: master_units - Master Measurement Units
--    [BN] টেবিল: master_units - পরিমাপের একক মাস্টার তালিকা
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

-- 2. [EN] Table: master_sizes - Standard Garment Sizes
--    [BN] টেবিল: master_sizes - আন্তর্জাতিক স্ট্যান্ডার্ড পোশাকের সাইজ তালিকা
CREATE TABLE IF NOT EXISTS master_sizes (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    size_code VARCHAR(20) UNIQUE NOT NULL,
    display_order INT NOT NULL
);

INSERT INTO master_sizes (size_code, display_order) VALUES
('XS', 1), ('S', 2), ('M', 3), ('L', 4), ('XL', 5), ('XXL', 6), ('3XL', 7)
ON CONFLICT (size_code) DO NOTHING;

-- 3. [EN] Table: master_defect_codes - Standard Quality Defect Codes
--    [BN] টেবিল: master_defect_codes - মান নিয়ন্ত্রণ ডিফেক্ট কোড তালিকা
CREATE TABLE IF NOT EXISTS master_defect_codes (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    defect_code VARCHAR(20) UNIQUE NOT NULL,
    defect_name VARCHAR(100) NOT NULL,
    defect_category VARCHAR(50) NOT NULL -- [EN] 'FABRIC', 'SEWING', 'FINISHING'
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
