-- =============================================================================
-- [EN] GARMENTS ERP - 1-CLICK DEMO DATA PURGE SCRIPT
-- [BN] গার্মেন্টস ইআরপি - ১-ক্লিক ডেমো ডেটা অপসারণ স্ক্রিপ্ট
-- =============================================================================
-- [EN] Safely purges demo transactional and sample data while preserving all
--      core master tables (measurement units, sizes, defect codes, user configs).
-- [BN] মূল মাস্টার কনফিগারেশন (একক, সাইজ, ডিফেক্ট কোড) অক্ষত রেখে সমস্ত নমুনা ও ডেমো
--      ট্রানজ্যাকশন ডেটা নিরাপদে মুছে ফেলে সিস্টেম ফ্রেশ প্রোডাকশন স্টেটে নেয়।
-- =============================================================================

BEGIN;

-- [EN] Safe execution block using PL/pgSQL
-- [BN] পিএল/পিজিএসকিউএল ব্যবহার করে নিরাপদ ট্রাঙ্কেশন ব্লক
DO $$ 
BEGIN
    -- [EN] Log the purge initiation to server output
    -- [BN] সার্ভার লগে ডেমো ডেটা অপসারণ শুরুর বার্তা প্রদান
    RAISE NOTICE '[EN] Starting 1-Click Demo Data Purge... / [BN] ডেমো ডেটা অপসারণ শুরু হচ্ছে...';

    -- [EN] Truncate cutting bundle cards if table exists
    -- [BN] কাটিং বান্ডিল কার্ড ট্রানজ্যাকশন টেবিল খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bundle_cards') THEN
        TRUNCATE TABLE bundle_cards CASCADE;
    END IF;

    -- [EN] Truncate cutting orders and marker plans
    -- [BN] কাটিং অর্ডার ও মার্কার প্ল্যান টেবিল খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cutting_orders') THEN
        TRUNCATE TABLE cutting_orders CASCADE;
    END IF;

    -- [EN] Truncate fabric inspection rolls and 4-point defect logs
    -- [BN] ফেব্রিক রোল ইন্সপেকশন ও ৪-পয়েন্ট ডিফেক্ট হিসেব খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'fabric_rolls') THEN
        TRUNCATE TABLE fabric_rolls CASCADE;
    END IF;

    -- [EN] Truncate purchase order size-color breakdown matrix
    -- [BN] পারচেজ অর্ডারের সাইজ ও কালার ব্রেকডাউন ম্যাট্রিক্স খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'po_size_color_breakdown') THEN
        TRUNCATE TABLE po_size_color_breakdown CASCADE;
    END IF;

    -- [EN] Truncate purchase orders and FOB commitments
    -- [BN] বায়ারের পারচেজ অর্ডার এবং এফওবি এগ্রিমেন্ট টেবিল খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'purchase_orders') THEN
        TRUNCATE TABLE purchase_orders CASCADE;
    END IF;

    -- [EN] Truncate style Bill of Materials (BOM) and consumption lines
    -- [BN] স্টাইল বিওএম (BOM) এবং ফেব্রিক/ট্রিমস কনজাম্পশন রেকর্ড খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'style_bom') THEN
        TRUNCATE TABLE style_bom CASCADE;
    END IF;

    -- [EN] Truncate garment styles and tech-pack references
    -- [BN] স্টাইল মাস্টার ও টেক-প্যাক রেফারেন্স টেবিল খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'styles') THEN
        TRUNCATE TABLE styles CASCADE;
    END IF;

    -- [EN] Truncate demo buyers and commercial profiles
    -- [BN] ডেমো বায়ার এবং বাণিজ্যিক প্রোফাইল টেবিল খালি করা
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'buyers') THEN
        TRUNCATE TABLE buyers CASCADE;
    END IF;

    -- [EN] Confirmation log: Core system units (PCS, KG) are preserved
    -- [BN] সফলতার বার্তা: কোর সিস্টেম এককসমূহ (PCS, KG) অক্ষত রাখা হয়েছে
    RAISE NOTICE '[EN] Demo data purge successful. System is clean. / [BN] ডেমো ডেটা অপসারণ সম্পন্ন। সিস্টেম সম্পূর্ণ ক্লিন।';
END $$;

COMMIT;
