-- =============================================================================
-- [EN] Flyway Migration V4: Provision Dedicated System Root Tenant (GarmentIQ HQ)
-- [BN] ডেডিকেটেড সিস্টেম রুট টেন্যান্ট ও প্ল্যাটফর্ম ওনার আইসোলেশন মাইগ্রেশন
-- =============================================================================
-- [EN] Reference: Approved Multi-Tenant Architecture Specification (2026-10-21)
-- [BN] প্ল্যাটফর্ম সুপার অ্যাডমিনকে সাধারণ ফ্যাক্টরি টেন্যান্ট থেকে পৃথক করে
--      কেন্দ্রীয় "SYSTEM" (GarmentIQ Platform HQ) রুট টেন্যান্টে স্থানান্তরণ।
-- =============================================================================

-- 1. Insert Reserved System Root Tenant / সিস্টেম রুট টেন্যান্ট রেকর্ড
INSERT INTO tenants (
    id, tenant_code, tenant_name, contact_email, contact_phone, address,
    subscription_tier, is_active, created_at, updated_at, created_by, updated_by, is_deleted, version
)
VALUES (
    '019472ba-0000-7000-8000-000000000000',
    'SYSTEM',
    'GarmentIQ Platform HQ',
    'platform-admin@garmentiq.com',
    '+880 1700-000000',
    'GarmentIQ Cloud Platform Core Headquarters, Dhaka, Bangladesh',
    'PLATFORM_ROOT',
    true,
    NOW(),
    NOW(),
    'SYSTEM',
    'SYSTEM',
    false,
    0
)
ON CONFLICT (tenant_code) DO NOTHING;

-- 2. Migrate Standard System Roles to System Root Tenant
-- স্ট্যান্ডার্ড রোলগুলোকে সিস্টেম রুট টেন্যান্টের অধীনে সংযুক্ত করা
UPDATE roles
SET tenant_id = '019472ba-0000-7000-8000-000000000000', updated_at = NOW()
WHERE tenant_id = '019472ba-7000-7000-8000-000000000001';

-- 3. Migrate Super Admin User to System Root Tenant
-- প্ল্যাটফর্ম সুপার অ্যাডমিনকে সিস্টেম রুট টেন্যান্টের অধীনে স্থানান্তরিত করা
UPDATE users
SET tenant_id = '019472ba-0000-7000-8000-000000000000', updated_at = NOW()
WHERE username = 'superadmin';

-- 4. Seed Dedicated Factory Admin for TexTech Client Factory
-- টেকটেক ক্লায়েন্ট ফ্যাক্টরির জন্য স্থানীয় ফ্যাক্টরি অ্যাডমিন ইউজার তৈরি
INSERT INTO users (
    id, tenant_id, username, email, password_hash, full_name, department, designation, employee_card_no, status
)
VALUES (
    '019472ba-7004-7000-8000-000000000002',
    '019472ba-7000-7000-8000-000000000001',
    'textech.admin',
    'admin@textech.com',
    '$2a$10$CuX2DpnjDYCTzVvLqeMbaeKuUuUefN/aIvYJjk.N2yDJ1PIgcjdpO', -- BCrypt: Password@123
    'TexTech Factory Administrator',
    'PLANT OPERATIONS',
    'Factory General Manager',
    'EMP-TT-001',
    'ACTIVE'
)
ON CONFLICT (tenant_id, username) DO NOTHING;

-- Assign ROLE_ADMIN to TexTech Factory Admin
INSERT INTO user_roles (user_id, role_id)
VALUES ('019472ba-7004-7000-8000-000000000002', '019472ba-7002-7000-8000-000000000002')
ON CONFLICT (user_id, role_id) DO NOTHING;
