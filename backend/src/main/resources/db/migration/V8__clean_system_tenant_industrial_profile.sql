-- =============================================================================
-- [EN] Flyway Migration V8: Clean industrial specs for Platform Root Tenant (SYSTEM)
-- [BN] প্ল্যাটফর্ম রুট টেন্যান্টের (SYSTEM) জন্য শিল্প উৎপাদন প্যারামিটার N/A বা NULL নিশ্চিতকরণ
-- =============================================================================
-- [EN] The SYSTEM root platform tenant represents GarmentIQ Cloud HQ, not a manufacturing plant.
--      Its industrial fields (factory_zone, sewing_lines, daily_capacity, has_washing_plant)
--      must be NULL to indicate N/A.
-- [BN] SYSTEM রুট টেন্যান্ট পোশাক উৎপাদনকারী কারখানা নয়, এটি সেন্ট্রাল প্ল্যাটফর্ম কোর।
--      অতএব এর শিল্প অবকাঠামো ফিল্ডসমূহ NULL সেট করা হলো।
-- =============================================================================

UPDATE tenants
SET factory_zone = NULL,
    sewing_lines = NULL,
    daily_capacity = NULL,
    has_washing_plant = NULL
WHERE tenant_code = 'SYSTEM';
