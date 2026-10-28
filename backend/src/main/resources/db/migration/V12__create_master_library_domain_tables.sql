-- =============================================================================
-- [EN] Flyway Migration V12: Master Library Domain-Driven Architecture (Rule 12 & ADR-015)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V12: মাস্টার লাইব্রেরি ডোমেন-ড্রিভেন আর্কিটেকচার টেবিল ও সিড ডেটা
-- =============================================================================
-- [EN] Establishes dynamic domain-driven master library catalog for Merchandising,
--      Fabric, Cutting, Sewing, Washing, Quality, Packing, Commercial, and Global specs.
-- [BN] পোশাক শিল্পের ৯টি ডোমেনের মাস্টার রেফারেন্স ডেটা সংরক্ষণের সেন্ট্রাল এক্সটেনসিবল টেবিল।

-- 1. [EN] Table: master_library_entries
--    [BN] টেবিল: master_library_entries - ডোমেন-ভিত্তিক মাস্টার লাইব্রেরি এন্ট্রি
CREATE TABLE IF NOT EXISTS master_library_entries (
    id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    domain_code VARCHAR(30) NOT NULL,      -- 'MERCHANDISING', 'FABRIC', 'CUTTING', 'SEWING', 'WASHING', 'QUALITY', etc.
    entity_type VARCHAR(50) NOT NULL,      -- 'GARMENT_ITEM', 'COLOR', 'SEASON', 'SAMPLE_STAGE', 'WEAVE', 'WASH_RECIPE', etc.
    entry_code VARCHAR(50) NOT NULL,       -- e.g. 'JEANS_5PKT', 'INDIGO_DARK', 'SS26', 'PROTO'
    entry_name VARCHAR(150) NOT NULL,      -- e.g. '5-Pocket Denim Jeans', 'Deep Indigo Blue'
    display_order INT DEFAULT 0,
    description TEXT,
    attributes JSONB,                      -- Dynamic specs: {"hexCode": "#1A2B4C", "pantone": "19-4007 TCX"}
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_system_seeded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    version BIGINT DEFAULT 0,
    CONSTRAINT uq_master_entry UNIQUE (tenant_id, domain_code, entity_type, entry_code)
);

-- Composite index for high-speed domain lookups (<20ms)
CREATE INDEX IF NOT EXISTS idx_master_library_lookup
    ON master_library_entries(tenant_id, domain_code, entity_type, is_active);

-- Comments for database auditing
COMMENT ON TABLE master_library_entries IS 'Central domain-driven master library hub for GarmentIQ-ERP (Rule 12 & ADR-015)';
COMMENT ON COLUMN master_library_entries.domain_code IS 'ERP business domain code: MERCHANDISING, FABRIC, CUTTING, SEWING, WASHING, QUALITY, etc.';
COMMENT ON COLUMN master_library_entries.attributes IS 'Dynamic JSONB attributes like pantone code, hex color, SMV values, or tolerance ranges';

-- 2. [EN] Baseline Seed Data: Merchandising Master Entries for Default Factory Tenant
-- =============================================================================
-- [BN] ডিফল্ট ক্লায়েন্ট ফ্যাক্টরির জন্য প্রাথমিক মার্চেন্ডাইজিং মাস্টার ডেটা সিডিং
-- =============================================================================
INSERT INTO master_library_entries (
    tenant_id, domain_code, entity_type, entry_code, entry_name, display_order, description, attributes, is_system_seeded
)
SELECT 
    t.id, v.domain_code, v.entity_type, v.entry_code, v.entry_name, v.display_order, v.description, v.attributes::jsonb, true
FROM (
    SELECT id FROM tenants WHERE tenant_code != 'SYSTEM' ORDER BY created_at ASC LIMIT 1
) t
CROSS JOIN (
    VALUES
    -- Garment Item Types
    ('MERCHANDISING', 'GARMENT_ITEM', 'JEANS_5PKT', '5-Pocket Denim Jeans', 1, 'Standard 5-pocket denim pant with coin pocket and rivets', '{"gender": "UNISEX", "fabricType": "DENIM", "hscode": "6203.42.00"}'),
    ('MERCHANDISING', 'GARMENT_ITEM', 'CHINO_PANT', 'Twill Chino Trouser', 2, 'Non-denim cotton twill casual chino with slant front pockets', '{"gender": "MEN", "fabricType": "NON_DENIM", "hscode": "6203.42.00"}'),
    ('MERCHANDISING', 'GARMENT_ITEM', 'CASUAL_SHIRT', 'Woven Casual Shirt', 3, 'Long sleeve / short sleeve woven casual button-down shirt', '{"gender": "MEN", "fabricType": "WOVEN", "hscode": "6205.20.00"}'),
    ('MERCHANDISING', 'GARMENT_ITEM', 'DENIM_JACKET', 'Denim Trucker Jacket', 4, 'Classic denim trucker jacket with chest flap pockets and metal shank buttons', '{"gender": "UNISEX", "fabricType": "DENIM", "hscode": "6201.92.00"}'),
    ('MERCHANDISING', 'GARMENT_ITEM', 'CARGO_SHORT', 'Woven Cargo Shorts', 5, 'Cotton twill multi-pocket outdoor utility cargo shorts', '{"gender": "MEN", "fabricType": "NON_DENIM", "hscode": "6203.42.00"}'),

    -- Color & Pantone Palette
    ('MERCHANDISING', 'COLOR', 'INDIGO_DARK', 'Deep Indigo Blue', 1, 'Dark rope-dyed indigo benchmark denim shade', '{"hexCode": "#1C2D42", "pantone": "19-4027 TCX"}'),
    ('MERCHANDISING', 'COLOR', 'INDIGO_BLEACH', 'Vintage Bleach Blue', 2, 'Light vintage washed bleached indigo denim shade', '{"hexCode": "#7CA5C9", "pantone": "15-4105 TCX"}'),
    ('MERCHANDISING', 'COLOR', 'RAW_INDIGO', 'Rigid Raw Indigo', 3, 'Unwashed dark un-sanforized/dry raw indigo shade', '{"hexCode": "#0F1A2C", "pantone": "19-4007 TCX"}'),
    ('MERCHANDISING', 'COLOR', 'BLACK_SULFUR', 'Sulfur Stay-Black', 4, 'Intense sulfur black denim yarn dye', '{"hexCode": "#222224", "pantone": "19-4005 TCX"}'),
    ('MERCHANDISING', 'COLOR', 'OPTIC_WHITE', 'Optic White', 5, 'Bleached optical pure white for shirts and chinos', '{"hexCode": "#F9F9FB", "pantone": "11-0601 TCX"}'),
    ('MERCHANDISING', 'COLOR', 'KHAKI_BEIGE', 'Classic Khaki Beige', 6, 'Standard military/chino khaki beige earth tone', '{"hexCode": "#C3B091", "pantone": "16-1108 TCX"}'),

    -- Season Master
    ('MERCHANDISING', 'SEASON', 'SS26', 'Spring / Summer 2026', 1, 'Global buyer spring and summer export order season', '{"year": 2026, "quarter": "Q1-Q2", "status": "ACTIVE"}'),
    ('MERCHANDISING', 'SEASON', 'FW26', 'Fall / Winter 2026', 2, 'Global buyer autumn and winter export order season', '{"year": 2026, "quarter": "Q3-Q4", "status": "PLANNING"}'),
    ('MERCHANDISING', 'SEASON', 'CORE_NOS', 'Core Never Out of Stock (NOS)', 3, 'Perennial ongoing buyer replenish program', '{"year": 2026, "quarter": "ANNUAL", "status": "ACTIVE"}'),

    -- Sample Stages
    ('MERCHANDISING', 'SAMPLE_STAGE', 'PROTO', 'Proto Sample (Development 1st Sample)', 1, 'Initial prototype for buyer style concept validation', '{"leadTimeDays": 14}'),
    ('MERCHANDISING', 'SAMPLE_STAGE', 'FIT', 'Fit Sample (Pattern & Body Fit Review)', 2, 'Live model fit test and pattern correction stage', '{"leadTimeDays": 10}'),
    ('MERCHANDISING', 'SAMPLE_STAGE', 'SIZE_SET', 'Size Set (Grading Measurement Set)', 3, 'Full size range sample set to verify grade rules', '{"leadTimeDays": 12}'),
    ('MERCHANDISING', 'SAMPLE_STAGE', 'PP_SAMPLE', 'Pre-Production (PP) Sample', 4, 'Final bulk sewing sign-off with actual bulk fabric and trims', '{"leadTimeDays": 7}'),
    ('MERCHANDISING', 'SAMPLE_STAGE', 'TOP_PRODUCTION', 'Top of Production (TOP QC)', 5, 'First off-the-line bulk garment for buyer lab & QC testing', '{"leadTimeDays": 3}'),
    ('MERCHANDISING', 'SAMPLE_STAGE', 'SHIPMENT', 'Shipment Sample (Final Gold Seal)', 6, 'Random sample drawn from packed export master cartons', '{"leadTimeDays": 2}')
) AS v(domain_code, entity_type, entry_code, entry_name, display_order, description, attributes)
WHERE t.id IS NOT NULL
ON CONFLICT (tenant_id, domain_code, entity_type, entry_code) DO NOTHING;

