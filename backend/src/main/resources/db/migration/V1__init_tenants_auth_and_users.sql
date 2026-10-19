-- =============================================================================
-- [EN] Flyway V1 Migration: Multi-Tenant Architecture, Auto-Code, and RBAC Security
-- [BN] ফ্লাইওয়ে V1 মাইগ্রেশন: মাল্টি-টেন্যান্ট আর্কিটেকচার, অটো-কোড ও আরবিকিউ সিকিউরিটি
-- =============================================================================
-- Governing Rules: Rule 15 (Bilingual), Rule 23 (Dependency), Rule 24 (Auto-Code)
-- Sequence: tenants -> code_sequences -> roles -> permissions -> users -> junctions

-- 1. [EN] Table: tenants - Multi-tenant parent organization isolation
--    [BN] টেবিল: tenants - মাল্টি-টেন্যান্ট মূল প্রতিষ্ঠান ও কারখানা গ্রুপ
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    tenant_code VARCHAR(30) NOT NULL UNIQUE,    -- [EN] Unique business code / [BN] ইউনিক কোড
    tenant_name VARCHAR(150) NOT NULL,          -- [EN] Full company name / [BN] কোম্পানির পূর্ণ নাম
    contact_email VARCHAR(100),                 -- [EN] Primary email / [BN] অফিসিয়াল ইমেইল
    contact_phone VARCHAR(30),                  -- [EN] Contact number / [BN] যোগাযোগের ফোন
    address TEXT,                               -- [EN] Head office address / [BN] প্রধান অফিসের ঠিকানা
    subscription_tier VARCHAR(30) NOT NULL DEFAULT 'ENTERPRISE', -- [EN] Plan tier / [BN] প্ল্যান
    is_active BOOLEAN NOT NULL DEFAULT true,    -- [EN] Active status / [BN] সক্রিয় অবস্থা
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    updated_by VARCHAR(100) DEFAULT 'SYSTEM',
    is_deleted BOOLEAN NOT NULL DEFAULT false,  -- [EN] Soft delete flag / [BN] সফট ডিলিট
    version BIGINT NOT NULL DEFAULT 0           -- [EN] Optimistic lock / [BN] কনকারেন্সি ভার্সন
);

-- 2. [EN] Table: code_sequence_templates - Configurable auto-code formats (Rule 24)
--    [BN] টেবিল: code_sequence_templates - অ্যাডমিন কনফিগারেবল অটো-কোড ফরম্যাট রুলস
CREATE TABLE code_sequence_templates (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,           -- [EN] E.g. BUYER, STYLE, PO / [BN] এনটিটির ধরন
    pattern VARCHAR(100) NOT NULL,              -- [EN] E.g. STY-{YYYY}-{SEQ:5} / [BN] প্যাটার্ন
    prefix VARCHAR(20) NOT NULL,                -- [EN] Default prefix / [BN] ডিফল্ট প্রিফিক্স
    padding_length INT NOT NULL DEFAULT 5,       -- [EN] Digit padding count / [BN] ডিজিটের দৈর্ঘ্য
    reset_frequency VARCHAR(20) NOT NULL DEFAULT 'YEARLY', -- [EN] Reset cycle / [BN] রিসেট সাইকেল
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_tenant_entity_template UNIQUE (tenant_id, entity_type)
);

-- 3. [EN] Table: code_sequence_trackers - Atomic concurrency lock counter (Rule 24)
--    [BN] টেবিল: code_sequence_trackers - অ্যাটমিক কনকারেন্সি লক কাউন্টার ট্র্যাকার
CREATE TABLE code_sequence_trackers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    current_year INT NOT NULL,                  -- [EN] Active year slice / [BN] চলতি বছর
    current_month INT NOT NULL,                 -- [EN] Active month slice / [BN] চলতি মাস
    last_sequence_value BIGINT NOT NULL DEFAULT 0, -- [EN] Last issued value / [BN] সর্বশেষ মান
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tracker_period UNIQUE (tenant_id, entity_type, current_year, current_month)
);

-- 4. [EN] Table: roles - Multi-tenant security authorization roles
--    [BN] টেবিল: roles - টেন্যান্টভিত্তিক সিকিউরিটি ও অথোরাইজেশন রোল
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_code VARCHAR(50) NOT NULL,             -- [EN] E.g. ROLE_MERCHANDISER / [BN] রোল কোড
    role_name VARCHAR(100) NOT NULL,            -- [EN] Readable role title / [BN] রোলের নাম
    description VARCHAR(255),
    is_system_role BOOLEAN NOT NULL DEFAULT false, -- [EN] System protected / [BN] সিস্টেম সুরক্ষিত
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    updated_by VARCHAR(100) DEFAULT 'SYSTEM',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_tenant_role_code UNIQUE (tenant_id, role_code)
);

-- 5. [EN] Table: permissions - Granular functional authorization permissions
--    [BN] টেবিল: permissions - গ্র্যানুলার ফাংশনাল পারমিশন সংজ্ঞাসমূহ
CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    permission_code VARCHAR(60) NOT NULL UNIQUE, -- [EN] E.g. ORDER:READ / [BN] পারমিশন কোড
    module_name VARCHAR(50) NOT NULL,            -- [EN] Functional module / [BN] মডিউল নাম
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. [EN] Table: role_permissions - Junction table binding permissions to roles
--    [BN] টেবিল: role_permissions - রোল এবং পারমিশনের অ্যাসোসিয়েশন জাংশন টেবিল
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 7. [EN] Table: users - Enterprise system users bound to tenants (Rule 23)
--    [BN] টেবিল: users - টেন্যান্টের অধীনে নিবন্ধিত সিস্টেম ব্যবহারকারী
CREATE TABLE users (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    username VARCHAR(50) NOT NULL,              -- [EN] Unique login handle / [BN] লগইন ইউজারনেম
    email VARCHAR(100) NOT NULL,                -- [EN] Official email / [BN] প্রাতিষ্ঠানিক ইমেইল
    password_hash VARCHAR(255) NOT NULL,        -- [EN] BCrypt password hash / [BN] হ্যাশড পাসওয়ার্ড
    full_name VARCHAR(100) NOT NULL,            -- [EN] Employee full name / [BN] পূর্ণ নাম
    department VARCHAR(50),                     -- [EN] E.g. MERCHANDISING / [BN] বিভাগ
    designation VARCHAR(50),                    -- [EN] Professional title / [BN] পদবী
    phone VARCHAR(30),                          -- [EN] Contact cell / [BN] ফোন নম্বর
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- [EN] ACTIVE, INACTIVE / [BN] স্ট্যাটাস
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    updated_by VARCHAR(100) DEFAULT 'SYSTEM',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_tenant_username UNIQUE (tenant_id, username),
    CONSTRAINT uq_tenant_email UNIQUE (tenant_id, email)
);

-- 8. [EN] Table: user_roles - Junction table assigning roles to users
--    [BN] টেবিল: user_roles - ব্যবহারকারীর সাথে রোলের সংযোগকারী জাংশন টেবিল
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 9. [EN] Performance indexes on foreign keys and lookup queries
--    [BN] দ্রুত অনুসন্ধানের জন্য ফরেন কি ও সার্চ কলামে পারফরম্যান্স ইনডেক্স
CREATE INDEX idx_tenants_code ON tenants(tenant_code);
CREATE INDEX idx_users_tenant_status ON users(tenant_id, status);
CREATE INDEX idx_roles_tenant ON roles(tenant_id);
CREATE INDEX idx_seq_template_lookup ON code_sequence_templates(tenant_id, entity_type);
CREATE INDEX idx_seq_tracker_lookup ON code_sequence_trackers(tenant_id, entity_type, current_year, current_month);

-- =============================================================================
-- [EN] Baseline Seed Data: Default Tenant, Auto-Code Formats, Roles, & Super Admin
-- [BN] বেসলাইন সিড ডেটা: প্রাথমিক টেন্যান্ট, অটো-কোড ফরম্যাট, রোল ও সুপার অ্যাডমিন
-- =============================================================================

-- [EN] Seed Tenant: TexTech Holdings Ltd / [BN] প্রাথমিক টেন্যান্ট: টেক্সটেক হোল্ডিংস
INSERT INTO tenants (id, tenant_code, tenant_name, contact_email, subscription_tier)
VALUES ('019472ba-7000-7000-8000-000000000001', 'TEXTECH', 'TexTech Apparels Group Ltd.', 'admin@textech.com', 'ENTERPRISE')
ON CONFLICT (id) DO NOTHING;

-- [EN] Seed Configurable Auto-Code Templates (Rule 24) / [BN] কনফিগারেবল অটো-কোড প্যাটার্নস
INSERT INTO code_sequence_templates (id, tenant_id, entity_type, pattern, prefix, padding_length, reset_frequency)
VALUES 
    ('019472ba-7001-7000-8000-000000000001', '019472ba-7000-7000-8000-000000000001', 'BUYER', 'BYR-{SEQ:4}', 'BYR', 4, 'NEVER'),
    ('019472ba-7001-7000-8000-000000000002', '019472ba-7000-7000-8000-000000000001', 'STYLE', 'STY-{YYYY}-{SEQ:5}', 'STY', 5, 'YEARLY'),
    ('019472ba-7001-7000-8000-000000000003', '019472ba-7000-7000-8000-000000000001', 'PURCHASE_ORDER', 'PO-{YYYY}{MM}-{SEQ:4}', 'PO', 4, 'MONTHLY'),
    ('019472ba-7001-7000-8000-000000000004', '019472ba-7000-7000-8000-000000000001', 'CUTTING_ORDER', 'CUT-{YYYY}{MM}-{SEQ:4}', 'CUT', 4, 'MONTHLY'),
    ('019472ba-7001-7000-8000-000000000005', '019472ba-7000-7000-8000-000000000001', 'BUNDLE', 'BDL-{YYYY}-{SEQ:7}', 'BDL', 7, 'YEARLY'),
    ('019472ba-7001-7000-8000-000000000006', '019472ba-7000-7000-8000-000000000001', 'CARTON', 'CTN-{YYYY}-{SEQ:6}', 'CTN', 6, 'YEARLY')
ON CONFLICT (tenant_id, entity_type) DO NOTHING;

-- [EN] Seed 9 Standard Enterprise System Roles / [BN] ৯টি স্ট্যান্ডার্ড সিস্টেম রোল
INSERT INTO roles (id, tenant_id, role_code, role_name, description, is_system_role)
VALUES
    ('019472ba-7002-7000-8000-000000000001', '019472ba-7000-7000-8000-000000000001', 'ROLE_SUPER_ADMIN', 'System Super Admin', 'Full multi-tenant system control', true),
    ('019472ba-7002-7000-8000-000000000002', '019472ba-7000-7000-8000-000000000001', 'ROLE_ADMIN', 'Factory Admin', 'Factory level administrative administration', true),
    ('019472ba-7002-7000-8000-000000000003', '019472ba-7000-7000-8000-000000000001', 'ROLE_MERCHANDISER', 'Merchandiser Lead', 'Costing, BOM and PO order management', true),
    ('019472ba-7002-7000-8000-000000000004', '019472ba-7000-7000-8000-000000000001', 'ROLE_CUTTING_MANAGER', 'Cutting Floor Manager', 'Marker planning and fabric cutting', true),
    ('019472ba-7002-7000-8000-000000000005', '019472ba-7000-7000-8000-000000000001', 'ROLE_SEWING_SUPERVISOR', 'Sewing Supervisor', 'Line loading and hourly sewing logs', true),
    ('019472ba-7002-7000-8000-000000000006', '019472ba-7000-7000-8000-000000000001', 'ROLE_QA_INSPECTOR', 'QA Inspector', 'Quality audit and fabric inspection', true),
    ('019472ba-7002-7000-8000-000000000007', '019472ba-7000-7000-8000-000000000001', 'ROLE_FINISHING_MANAGER', 'Finishing Manager', 'Washing, ironing and carton packing', true),
    ('019472ba-7002-7000-8000-000000000008', '019472ba-7000-7000-8000-000000000001', 'ROLE_COMMERCIAL_OFFICER', 'Commercial Officer', 'Export documentation and shipment', true),
    ('019472ba-7002-7000-8000-000000000009', '019472ba-7000-7000-8000-000000000001', 'ROLE_EXECUTIVE_VIEWER', 'Executive Viewer', 'Executive read-only dashboard access', true)
ON CONFLICT (tenant_id, role_code) DO NOTHING;

-- [EN] Seed Core Functional Permissions / [BN] কোর ফাংশনাল পারমিশনসমূহ
INSERT INTO permissions (id, permission_code, module_name, description)
VALUES
    ('019472ba-7003-7000-8000-000000000001', 'TENANT:MANAGE', 'ADMIN', 'Create and configure tenant organizations'),
    ('019472ba-7003-7000-8000-000000000002', 'USER:MANAGE', 'ADMIN', 'Create, update, and assign user accounts'),
    ('019472ba-7003-7000-8000-000000000003', 'SEQUENCE:CONFIGURE', 'ADMIN', 'Configure auto-code sequence formats'),
    ('019472ba-7003-7000-8000-000000000004', 'ORDER:READ', 'MERCHANDISING', 'View buyers, styles, and orders'),
    ('019472ba-7003-7000-8000-000000000005', 'ORDER:WRITE', 'MERCHANDISING', 'Create and edit orders and BOM'),
    ('019472ba-7003-7000-8000-000000000006', 'CUTTING:EXECUTE', 'PRODUCTION', 'Generate markers and execute cutting orders')
ON CONFLICT (permission_code) DO NOTHING;

-- [EN] Map Super Admin Role to All Permissions / [BN] সুপার অ্যাডমিন রোলে সকল পারমিশন ম্যাপিং
INSERT INTO role_permissions (role_id, permission_id)
SELECT '019472ba-7002-7000-8000-000000000001', id FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- [EN] Seed Initial Super Admin User (Password: Password@123) / [BN] প্রাথমিক সুপার অ্যাডমিন ইউজার
INSERT INTO users (id, tenant_id, username, email, password_hash, full_name, department, designation, status)
VALUES (
    '019472ba-7004-7000-8000-000000000001',
    '019472ba-7000-7000-8000-000000000001',
    'superadmin',
    'superadmin@garmentserp.com',
    '$2a$12$6uX7eWwMhA.wZz/xZ5Z5.e6gM5l8Q1l4t.VlJ2xZ0h0i8a7k6y5i.', -- [EN] BCrypt: Password@123
    'System Super Administrator',
    'IT & SYSTEMS',
    'Chief Technology Officer',
    'ACTIVE'
)
ON CONFLICT (tenant_id, username) DO NOTHING;

-- [EN] Assign ROLE_SUPER_ADMIN to Super Admin User / [BN] সুপার অ্যাডমিনকে রোল অ্যাসাইন
INSERT INTO user_roles (user_id, role_id)
VALUES ('019472ba-7004-7000-8000-000000000001', '019472ba-7002-7000-8000-000000000001')
ON CONFLICT (user_id, role_id) DO NOTHING;
