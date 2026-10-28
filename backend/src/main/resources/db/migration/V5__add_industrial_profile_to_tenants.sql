-- =============================================================================
-- [EN] Migration: V5__add_industrial_profile_to_tenants.sql (Rule 12 & 24)
-- [BN] মাইগ্রেশন: V5__add_industrial_profile_to_tenants.sql - কারখানার শিল্প অবকাঠামো ও কমপ্লায়েন্স প্রোফাইল
-- =============================================================================
-- [EN] Adds industrial apparel manufacturing domain fields to the tenants table:
--      business_type (DENIM, WOVEN, COMPOSITE, INTEGRATED), factory_zone,
--      sewing_lines, daily_capacity, has_washing_plant, trade_license_no, bgmea_reg_no.
-- [BN] তৈরি পোশাক ও ডেনিম উৎপাদন সংশ্লিষ্ট শিল্প প্যারামিটারসমূহ টেন্যান্ট টেবিলে যুক্ত করে।
-- =============================================================================

ALTER TABLE tenants 
    ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) NOT NULL DEFAULT 'DENIM',
    ADD COLUMN IF NOT EXISTS factory_zone VARCHAR(100) NOT NULL DEFAULT 'Ashulia Industrial Zone',
    ADD COLUMN IF NOT EXISTS sewing_lines INT NOT NULL DEFAULT 12,
    ADD COLUMN IF NOT EXISTS daily_capacity INT NOT NULL DEFAULT 15000,
    ADD COLUMN IF NOT EXISTS has_washing_plant BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS trade_license_no VARCHAR(100),
    ADD COLUMN IF NOT EXISTS bgmea_reg_no VARCHAR(100);

-- [EN] Comments explaining industrial columns / [BN] কলামসমূহের বিবরণ
COMMENT ON COLUMN tenants.business_type IS '[EN] Core apparel manufacturing domain (DENIM, WOVEN, COMPOSITE, INTEGRATED) / [BN] মূল পোশাক উৎপাদন ক্ষেত্র';
COMMENT ON COLUMN tenants.factory_zone IS '[EN] Industrial cluster or EPZ zone / [BN] কারখানা অবস্থিত শিল্প অঞ্চল বা ইপিজেড ক্লাস্টার';
COMMENT ON COLUMN tenants.sewing_lines IS '[EN] Total operational sewing lines / [BN] মোট সক্রিয় সুইং লাইনের সংখ্যা';
COMMENT ON COLUMN tenants.daily_capacity IS '[EN] Estimated daily garment production capacity in pieces / [BN] দৈনিক উৎপাদন সক্ষমতা (পিস)';
COMMENT ON COLUMN tenants.has_washing_plant IS '[EN] Flag indicating in-house denim/garment laundry / [BN] নিজস্ব ওয়াশিং ও ডায়িং প্ল্যান্ট ফ্ল্যাগ';
COMMENT ON COLUMN tenants.trade_license_no IS '[EN] Official government trade license registration number / [BN] ট্রেড লাইসেন্স নম্বর';
COMMENT ON COLUMN tenants.bgmea_reg_no IS '[EN] BGMEA / BKMEA export association membership registration / [BN] বিজিএমইএ বা বিকেএমইএ মেম্বারশিপ নম্বর';
