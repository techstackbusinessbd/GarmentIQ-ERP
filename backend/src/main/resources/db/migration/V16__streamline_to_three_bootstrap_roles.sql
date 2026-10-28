-- =============================================================================
-- [EN] Flyway Migration V16: Streamline to Three Bootstrap System Roles
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V16: বুটস্ট্র্যাপে শুধুমাত্র ৩টি ডিফল্ট সিস্টেম রোলে সুবিন্যস্তকরণ
-- =============================================================================
-- [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 12 (Schema Gate), Rule 15 (Bilingual)
-- [BN] বুটস্ট্র্যাপে শুধুমাত্র System Super Admin, Factory Admin ও General User থাকবে;
--      অন্যান্য সমস্ত রোল সিস্টেম চালুর পর অ্যাডমিন প্রয়োজন অনুযায়ী তৈরি করবেন।
-- =============================================================================

-- 1. [EN] Ensure General User role exists with is_system_role = true under SYSTEM root tenant
--    [BN] General User (ROLE_USER) সিস্টেম রোল হিসেবে নিশ্চিতকরণ
INSERT INTO roles (id, tenant_id, role_code, role_name, description, is_system_role, is_deleted)
VALUES (
    '019472ba-7002-7000-8000-000000000010',
    '019472ba-0000-7000-8000-000000000000',
    'ROLE_USER',
    'General User',
    'Base platform access for standard factory employees.',
    true,
    false
)
ON CONFLICT (tenant_id, role_code) DO UPDATE
SET role_name = EXCLUDED.role_name,
    description = EXCLUDED.description,
    is_system_role = true,
    is_deleted = false;

-- 2. [EN] Clean up and delete pre-seeded operational roles (To be created dynamically by Admin)
--    [BN] পূর্বে সিড করা ৭টি অপ্রয়োজনীয় অপারেশনাল রোল ডাটাবেজ থেকে অপসারণ (অ্যাডমিন প্রয়োজনে তৈরি করবেন)
DELETE FROM role_permissions
WHERE role_id IN (
    SELECT id FROM roles
    WHERE role_code IN (
        'ROLE_MERCHANDISER',
        'ROLE_CUTTING_MANAGER',
        'ROLE_SEWING_SUPERVISOR',
        'ROLE_QA_INSPECTOR',
        'ROLE_FINISHING_MANAGER',
        'ROLE_COMMERCIAL_OFFICER',
        'ROLE_EXECUTIVE_VIEWER'
    )
);

DELETE FROM roles
WHERE role_code IN (
    'ROLE_MERCHANDISER',
    'ROLE_CUTTING_MANAGER',
    'ROLE_SEWING_SUPERVISOR',
    'ROLE_QA_INSPECTOR',
    'ROLE_FINISHING_MANAGER',
    'ROLE_COMMERCIAL_OFFICER',
    'ROLE_EXECUTIVE_VIEWER'
);

-- 3. [EN] Seed baseline permissions for ROLE_USER (Read-only reference visibility)
--    [BN] ROLE_USER এর জন্য প্রাথমিক রেফারেন্স ও প্রোফাইল ভিউ পারমিশন যুক্ত করা
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.permission_code IN ('USER:VIEW', 'LIBRARY:VIEW')
WHERE r.role_code = 'ROLE_USER'
ON CONFLICT (role_id, permission_id) DO NOTHING;
