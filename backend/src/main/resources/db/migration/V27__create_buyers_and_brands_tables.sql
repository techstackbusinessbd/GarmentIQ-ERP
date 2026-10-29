-- =============================================================================
-- [EN] Flyway Migration V27: Create Buyer and Buyer Brand Tables (Domain 01)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২৭: বায়ার ও বায়ার সাব-ব্র্যান্ড টেবিল তৈরি (ডোমেন ০১)
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval Gate),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] অনুমোদিত স্কিমা: বায়ার মাস্টার প্রোফাইল এবং সাব-ব্র্যান্ড পোর্টফোলিও
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. [EN] Create 'buyers' table (Global Buyer Master Directory)
--    [BN] 'buyers' টেবিল তৈরি (গ্লোবাল বায়ার মাস্টার ডিরেক্টরি)
-- -----------------------------------------------------------------------------
CREATE TABLE buyers (
    id                      UUID PRIMARY KEY,
    tenant_id               UUID NOT NULL,
    buyer_code              VARCHAR(50) NOT NULL,
    buyer_name              VARCHAR(150) NOT NULL,
    short_name              VARCHAR(50),
    buyer_type              VARCHAR(30) NOT NULL DEFAULT 'DIRECT',
    commission_percentage   NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    country_of_origin       VARCHAR(100) NOT NULL,
    headquarters_address    TEXT,
    contact_person_name     VARCHAR(100),
    contact_email           VARCHAR(120),
    contact_phone           VARCHAR(50),
    default_currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_terms           VARCHAR(50) NOT NULL DEFAULT 'LC_AT_SIGHT',
    credit_period_days      INTEGER NOT NULL DEFAULT 30,
    compliance_status       VARCHAR(30) NOT NULL DEFAULT 'COMPLIANT',
    status                  VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    notes                   TEXT,
    
    -- [EN] Audit trail & soft delete
    -- [BN] অডিট ট্রায়াল ও সফট ডিলিট
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    deleted_at              TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT uk_buyers_tenant_code UNIQUE (tenant_id, buyer_code),
    CONSTRAINT uk_buyers_tenant_name UNIQUE (tenant_id, buyer_name),
    CONSTRAINT fk_buyers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    CONSTRAINT chk_buyers_type CHECK (buyer_type IN ('DIRECT', 'BUYING_HOUSE', 'AGENT', 'IMPORTER', 'DOMESTIC')),
    CONSTRAINT chk_buyers_commission CHECK (commission_percentage >= 0.00 AND commission_percentage <= 100.00),
    CONSTRAINT chk_buyers_currency_len CHECK (length(default_currency) = 3),
    CONSTRAINT chk_buyers_credit_period CHECK (credit_period_days >= 0),
    CONSTRAINT chk_buyers_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX idx_buyers_tenant_status ON buyers (tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_buyers_country ON buyers (tenant_id, country_of_origin);
CREATE INDEX idx_buyers_type ON buyers (tenant_id, buyer_type) WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 2. [EN] Create 'buyer_brands' table (Buyer Sub-Brand Portfolio)
--    [BN] 'buyer_brands' টেবিল তৈরি (বায়ারের সাব-ব্র্যান্ড পোর্টফোলিও)
-- -----------------------------------------------------------------------------
CREATE TABLE buyer_brands (
    id                      UUID PRIMARY KEY,
    tenant_id               UUID NOT NULL,
    buyer_id                UUID NOT NULL,
    brand_code              VARCHAR(50) NOT NULL,
    brand_name              VARCHAR(150) NOT NULL,
    target_market           VARCHAR(100),
    season_pattern          VARCHAR(50) NOT NULL DEFAULT 'FOUR_SEASONS',
    contact_person          VARCHAR(100),
    contact_email           VARCHAR(120),
    contact_phone           VARCHAR(50),
    status                  VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    notes                   TEXT,
    
    -- [EN] Audit trail & soft delete
    -- [BN] অডিট ট্রায়াল ও সফট ডিলিট
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    deleted_at              TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT uk_brands_tenant_buyer_code UNIQUE (tenant_id, buyer_id, brand_code),
    CONSTRAINT uk_brands_tenant_buyer_name UNIQUE (tenant_id, buyer_id, brand_name),
    CONSTRAINT fk_brands_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_brands_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE RESTRICT,
    CONSTRAINT chk_brands_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX idx_buyer_brands_buyer_status ON buyer_brands (buyer_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_buyer_brands_tenant ON buyer_brands (tenant_id);

-- -----------------------------------------------------------------------------
-- 3. [EN] Register Domain 01 Permissions for Buyer & Brand Management
--    [BN] বায়ার ও ব্র্যান্ড ম্যানেজমেন্টের জন্য ডোমেন ০১ পারমিশন অন্তর্ভুক্তি
-- -----------------------------------------------------------------------------
INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES 
-- Feature: Buyer Management (merch_buyers)
(gen_random_uuid(), 'BUYER:MENU', 'MERCHANDISING', 'Access buyer directory navigation menu',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_buyers', 'Buyer Directory', 'menu', 'Sidebar Menu', '/app/merchandising/buyers', 100),
(gen_random_uuid(), 'BUYER:VIEW', 'MERCHANDISING', 'View global buyer profiles, commercial terms, and compliance audit status',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_buyers', 'Buyer Directory', 'view', 'View', '/app/merchandising/buyers', 101),
(gen_random_uuid(), 'BUYER:CREATE', 'MERCHANDISING', 'Register new global buyers and configure commercial trade conditions',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_buyers', 'Buyer Directory', 'create', 'Create', '/app/merchandising/buyers', 102),
(gen_random_uuid(), 'BUYER:EDIT', 'MERCHANDISING', 'Update buyer profile, payment terms, or toggle active/inactive status',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_buyers', 'Buyer Directory', 'edit', 'Edit', '/app/merchandising/buyers', 103),
(gen_random_uuid(), 'BUYER:DELETE', 'MERCHANDISING', 'Soft-delete or deactivate buyer records from active commercial operations',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_buyers', 'Buyer Directory', 'delete', 'Delete', '/app/merchandising/buyers', 104),

-- Feature: Brand Portfolio (merch_brands)
(gen_random_uuid(), 'BRAND:MENU', 'MERCHANDISING', 'Access sub-brand portfolio view and drawer actions',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_brands', 'Brand Portfolio', 'menu', 'Sidebar Menu', '/app/merchandising/buyers', 105),
(gen_random_uuid(), 'BRAND:VIEW', 'MERCHANDISING', 'View sub-brands, target markets, and seasonal patterns for buyers',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_brands', 'Brand Portfolio', 'view', 'View', '/app/merchandising/buyers', 106),
(gen_random_uuid(), 'BRAND:CREATE', 'MERCHANDISING', 'Add new sub-brand under a parent buyer with market specifications',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_brands', 'Brand Portfolio', 'create', 'Create', '/app/merchandising/buyers', 107),
(gen_random_uuid(), 'BRAND:EDIT', 'MERCHANDISING', 'Update brand metadata, seasonal patterns, or contact channels',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_brands', 'Brand Portfolio', 'edit', 'Edit', '/app/merchandising/buyers', 108),
(gen_random_uuid(), 'BRAND:DELETE', 'MERCHANDISING', 'Deactivate or soft-delete sub-brands from buyer portfolio',
 'merchandising', 'Merchandising & Order Management', 'buyer_mgmt', 'Buyer & Brand Portfolio', 'Global buyer directory, compliance profile, and sub-brand portfolio',
 'merch_brands', 'Brand Portfolio', 'delete', 'Delete', '/app/merchandising/buyers', 109);

-- -----------------------------------------------------------------------------
-- 4. [EN] Assign Permissions to ROLE_SUPER_ADMIN and ROLE_ADMIN
--    [BN] সুপার অ্যাডমিন ও অ্যাডমিন রোলকে বায়ার ও ব্র্যান্ড পারমিশন প্রদান
-- -----------------------------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code IN ('ROLE_SUPER_ADMIN', 'ROLE_ADMIN')
  AND p.permission_code IN (
      'BUYER:MENU', 'BUYER:VIEW', 'BUYER:CREATE', 'BUYER:EDIT', 'BUYER:DELETE',
      'BRAND:MENU', 'BRAND:VIEW', 'BRAND:CREATE', 'BRAND:EDIT', 'BRAND:DELETE'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;
