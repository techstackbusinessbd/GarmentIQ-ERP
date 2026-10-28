-- =============================================================================
-- [EN] Flyway Migration V26: Split Master Data Library into 6 Granular Features
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২৬: মাস্টার ডাটা লাইব্রেরি মডিউলকে ৬টি সুনির্দিষ্ট ফিচারে বিভক্তকরণ
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval Gate),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] ১. Measurement Units (UOM - পোশাক ও ফেব্রিক পরিমাপের একক)
--      ২. Garment Sizes (পোশাকের সাইজ ব্রেকডাউন ও গ্রিড ম্যাট্রিক্স)
--      ৩. Garment Items (পোশাকের আইটেম ক্যাটালগ - জিন্স, শার্ট, ট্রাউজার্স ইত্যাদি)
--      ৪. Colors & Pantones (কালার শেডস ও প্যান্টোন TCX স্ট্যান্ডার্ড)
--      ৫. Export Seasons (বায়ার এক্সপোর্ট সিজন - SS26, FW26 ইত্যাদি)
--      ৬. Quality Defects (কোয়ালিটি ইন্সপেকশন ডিফেক্ট ক্যাটালগ)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. [EN] Purge legacy coarse library permissions
--    [BN] পূর্বের জেনেরিক লাইব্রেরি পারমিশন অপসারণ (ON DELETE CASCADE)
-- -----------------------------------------------------------------------------
DELETE FROM permissions WHERE permission_code IN (
    'LIBRARY:MENU', 'LIBRARY:VIEW', 'LIBRARY:CREATE', 'LIBRARY:EDIT'
);

-- -----------------------------------------------------------------------------
-- 2. [EN] Insert Granular Permissions across 6 Dedicated Subsystems
--    [BN] ৬টি পৃথক সাবসিস্টেমের জন্য গ্র্যানুলার পারমিশন কোড সংযোজন
-- -----------------------------------------------------------------------------
INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES 
-- Feature 1: Measurement Units (library_units)
(gen_random_uuid(), 'UNIT:MENU', 'LIBRARY', 'Access measurement units tab and navigation view',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_units', 'Measurement Units', 'menu', 'Sidebar Menu', '/app/admin/library/units', 60),
(gen_random_uuid(), 'UNIT:VIEW', 'LIBRARY', 'View measurement units directory and unit conversion benchmarks',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_units', 'Measurement Units', 'view', 'View', '/app/admin/library/units', 61),
(gen_random_uuid(), 'UNIT:CREATE', 'LIBRARY', 'Define and register new textile and apparel measurement units (UOM)',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_units', 'Measurement Units', 'create', 'Create', '/app/admin/library/units', 62),
(gen_random_uuid(), 'UNIT:EDIT', 'LIBRARY', 'Modify unit titles, conversion factors, or toggle active status',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_units', 'Measurement Units', 'edit', 'Edit', '/app/admin/library/units', 63),
(gen_random_uuid(), 'UNIT:DELETE', 'LIBRARY', 'Remove unused or deprecated apparel measurement units',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_units', 'Measurement Units', 'delete', 'Delete', '/app/admin/library/units', 64),

-- Feature 2: Garment Sizes (library_sizes)
(gen_random_uuid(), 'SIZE:MENU', 'LIBRARY', 'Access garment sizes tab and navigation view',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_sizes', 'Garment Sizes', 'menu', 'Sidebar Menu', '/app/admin/library/sizes', 65),
(gen_random_uuid(), 'SIZE:VIEW', 'LIBRARY', 'View apparel size breakdowns and sorting matrix',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_sizes', 'Garment Sizes', 'view', 'View', '/app/admin/library/sizes', 66),
(gen_random_uuid(), 'SIZE:CREATE', 'LIBRARY', 'Register new garment size codes and grading order specs',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_sizes', 'Garment Sizes', 'create', 'Create', '/app/admin/library/sizes', 67),
(gen_random_uuid(), 'SIZE:EDIT', 'LIBRARY', 'Modify size display labels, sort indices, or active status',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_sizes', 'Garment Sizes', 'edit', 'Edit', '/app/admin/library/sizes', 68),
(gen_random_uuid(), 'SIZE:DELETE', 'LIBRARY', 'Remove unused or deprecated garment size specifications',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_sizes', 'Garment Sizes', 'delete', 'Delete', '/app/admin/library/sizes', 69),

-- Feature 3: Garment Items (library_items)
(gen_random_uuid(), 'ITEM:MENU', 'LIBRARY', 'Access garment items tab and navigation view',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_items', 'Garment Items', 'menu', 'Sidebar Menu', '/app/admin/library/items', 70),
(gen_random_uuid(), 'ITEM:VIEW', 'LIBRARY', 'View garment apparel items catalog and HS codes',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_items', 'Garment Items', 'view', 'View', '/app/admin/library/items', 71),
(gen_random_uuid(), 'ITEM:CREATE', 'LIBRARY', 'Register new garment styles and item classifications',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_items', 'Garment Items', 'create', 'Create', '/app/admin/library/items', 72),
(gen_random_uuid(), 'ITEM:EDIT', 'LIBRARY', 'Modify garment item descriptions, HS codes, or active status',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_items', 'Garment Items', 'edit', 'Edit', '/app/admin/library/items', 73),
(gen_random_uuid(), 'ITEM:DELETE', 'LIBRARY', 'Remove custom garment item classifications from library',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_items', 'Garment Items', 'delete', 'Delete', '/app/admin/library/items', 74),

-- Feature 4: Colors & Pantones (library_colors)
(gen_random_uuid(), 'COLOR:MENU', 'LIBRARY', 'Access color shades and pantone palette tab and navigation view',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_colors', 'Colors & Pantones', 'menu', 'Sidebar Menu', '/app/admin/library/colors', 75),
(gen_random_uuid(), 'COLOR:VIEW', 'LIBRARY', 'View color palette, HEX values, and Pantone TCX standards',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_colors', 'Colors & Pantones', 'view', 'View', '/app/admin/library/colors', 76),
(gen_random_uuid(), 'COLOR:CREATE', 'LIBRARY', 'Register new buyer color codes, HEX swatch codes, and Pantone formulas',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_colors', 'Colors & Pantones', 'create', 'Create', '/app/admin/library/colors', 77),
(gen_random_uuid(), 'COLOR:EDIT', 'LIBRARY', 'Modify color shade attributes, HEX values, or active status',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_colors', 'Colors & Pantones', 'edit', 'Edit', '/app/admin/library/colors', 78),
(gen_random_uuid(), 'COLOR:DELETE', 'LIBRARY', 'Remove custom color shades from tenant library catalog',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_colors', 'Colors & Pantones', 'delete', 'Delete', '/app/admin/library/colors', 79),

-- Feature 5: Export Seasons (library_seasons)
(gen_random_uuid(), 'SEASON:MENU', 'LIBRARY', 'Access export seasons tab and navigation view',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_seasons', 'Export Seasons', 'menu', 'Sidebar Menu', '/app/admin/library/seasons', 80),
(gen_random_uuid(), 'SEASON:VIEW', 'LIBRARY', 'View export season timeline, planning quarters, and active buyer seasons',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_seasons', 'Export Seasons', 'view', 'View', '/app/admin/library/seasons', 81),
(gen_random_uuid(), 'SEASON:CREATE', 'LIBRARY', 'Register new export order seasons and commercial timeframes',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_seasons', 'Export Seasons', 'create', 'Create', '/app/admin/library/seasons', 82),
(gen_random_uuid(), 'SEASON:EDIT', 'LIBRARY', 'Modify season labels, calendar quarters, or active status',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_seasons', 'Export Seasons', 'edit', 'Edit', '/app/admin/library/seasons', 83),
(gen_random_uuid(), 'SEASON:DELETE', 'LIBRARY', 'Remove custom export order seasons from library',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_seasons', 'Export Seasons', 'delete', 'Delete', '/app/admin/library/seasons', 84),

-- Feature 6: Quality Defects (library_defects)
(gen_random_uuid(), 'DEFECT:MENU', 'LIBRARY', 'Access quality defects catalog tab and navigation view',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_defects', 'Quality Defects', 'menu', 'Sidebar Menu', '/app/admin/library/defects', 85),
(gen_random_uuid(), 'DEFECT:VIEW', 'LIBRARY', 'View quality inspection defect codes and severity classifications',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_defects', 'Quality Defects', 'view', 'View', '/app/admin/library/defects', 86),
(gen_random_uuid(), 'DEFECT:CREATE', 'LIBRARY', 'Register new fabric, sewing, or washing quality defect codes',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_defects', 'Quality Defects', 'create', 'Create', '/app/admin/library/defects', 87),
(gen_random_uuid(), 'DEFECT:EDIT', 'LIBRARY', 'Modify defect descriptions, inspection stages, or active status',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_defects', 'Quality Defects', 'edit', 'Edit', '/app/admin/library/defects', 88),
(gen_random_uuid(), 'DEFECT:DELETE', 'LIBRARY', 'Remove custom inspection defect codes from quality library',
 'admin', 'System Administration', 'library_mgmt', 'Master Data Library', 'Measurement units, garment sizes, garment items, colors and pantones, export seasons, and quality inspection defects',
 'library_defects', 'Quality Defects', 'delete', 'Delete', '/app/admin/library/defects', 89)
ON CONFLICT (permission_code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. [EN] Baseline Role Permissions Auto-Assignment
--    [BN] বেসলাইন রোলে নতুন পারমিশনসমূহ স্বয়ংক্রিয়ভাবে অ্যাসাইন করা
-- -----------------------------------------------------------------------------
-- A) ROLE_SUPER_ADMIN gets ALL registered system permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B) ROLE_ADMIN gets full clearance across library_mgmt subsystems
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.module_id = 'library_mgmt'
WHERE r.role_code = 'ROLE_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;
