-- =============================================================================
-- [EN] Flyway Migration V7: Make industrial profile columns nullable and remove hardcoded defaults
-- [BN] টেন্যান্ট টেবিলের শিল্প প্রোফাইল কলামসমূহ অপশনাল (Nullable) করা এবং হার্ডকোডেড ডিফল্ট অপসরণ
-- =============================================================================
-- [EN] Reference: Zero Hardcoded Data & Real Factory Spec Enforcement (Rule 19)
-- [BN] কোনো ক্লায়েন্টের জন্য কাল্পনিক বা অনুমাননির্ভর ডামি ডেটা প্রতিরোধে 
--      factory_zone, sewing_lines, daily_capacity, has_washing_plant কলামসমূহ 
--      ড্রপ ডিফল্ট ও নালযোগ্য করা হলো।
-- =============================================================================

ALTER TABLE tenants
    ALTER COLUMN business_type DROP NOT NULL,
    ALTER COLUMN business_type DROP DEFAULT,
    ALTER COLUMN factory_zone DROP NOT NULL,
    ALTER COLUMN factory_zone DROP DEFAULT,
    ALTER COLUMN sewing_lines DROP NOT NULL,
    ALTER COLUMN sewing_lines DROP DEFAULT,
    ALTER COLUMN daily_capacity DROP NOT NULL,
    ALTER COLUMN daily_capacity DROP DEFAULT,
    ALTER COLUMN has_washing_plant DROP NOT NULL,
    ALTER COLUMN has_washing_plant DROP DEFAULT;

-- Reset unconfigured industrial profile data for client tenants created without input
UPDATE tenants
SET factory_zone = NULL,
    sewing_lines = NULL,
    daily_capacity = NULL,
    has_washing_plant = NULL
WHERE tenant_code = 'CLT-0001';
