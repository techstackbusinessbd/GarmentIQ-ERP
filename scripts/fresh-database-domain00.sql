-- =============================================================================
-- [EN] GARMENTS ERP - DOMAIN 00 DATABASE FULL FRESH PURGE SCRIPT
-- [BN] গার্মেন্টস ইআরপি - ডোমেন ০০ ডেটাবেজ ফুল ফ্রেশ পার্জ স্ক্রিপ্ট (রুল ১৩)
-- =============================================================================
-- [EN] Safely purges all test/demo tenants, test users, custom test roles,
--      test sequence trackers, and audit logs.
--      Preserves 100% bootstrap production state:
--      - SYSTEM Root Tenant (GarmentIQ Platform HQ)
--      - Platform Super Admin (superadmin)
--      - 3 Bootstrap System Roles (ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER)
--      - All 23 Enterprise Permission Definitions and System Role Mappings
-- =============================================================================

BEGIN;

-- 1. [EN] Truncate test audit logs
--    [BN] টেস্ট অডিট লগ খালি করা
TRUNCATE TABLE system_audit_logs;

-- 2. [EN] Truncate code sequence trackers
--    [BN] অটো-কোড সিকোয়েন্স ট্র্যাকার খালি করা
TRUNCATE TABLE code_sequence_trackers;

-- 3. [EN] Truncate custom user permissions
--    [BN] বিশেষ ব্যবহারকারী পারমিশন টেবিল খালি করা
TRUNCATE TABLE user_custom_permissions;

-- 4. [EN] Remove non-superadmin user-role associations
--    [BN] সুপারএডমিন ব্যতীত সকল ইউজারের রোল অ্যাসাইনমেন্ট অপসারণ
DELETE FROM user_roles 
WHERE user_id NOT IN (
    SELECT id FROM users WHERE username = 'superadmin'
);

-- 5. [EN] Remove all test users (Preserve only superadmin)
--    [BN] টেস্ট ইউজারসমূহ মুছে ফেলা (কেবল সুপারএডমিন বহাল রাখা)
DELETE FROM users 
WHERE username != 'superadmin';

-- 6. [EN] Remove role-permission mappings for custom test roles
--    [BN] কাস্টম রোলের পারমিশন ম্যাপিং অপসারণ
DELETE FROM role_permissions 
WHERE role_id IN (
    SELECT id FROM roles WHERE is_system_role = false
);

-- 7. [EN] Remove all custom test roles (Preserve only 3 bootstrap system roles)
--    [BN] সকল কাস্টম রোল মুছে ফেলা (৩টি সিস্টেম রোল বহাল রাখা)
DELETE FROM roles 
WHERE is_system_role = false;

-- 8. [EN] Remove non-system code sequence templates
--    [BN] টেস্ট কারখানার অটো-কোড টেমপ্লেট মুছে ফেলা
DELETE FROM code_sequence_templates 
WHERE tenant_id != '019472ba-0000-7000-8000-000000000000';

-- 9. [EN] Remove all test tenants (Preserve only SYSTEM tenant)
--    [BN] টেস্ট কারখানা/টেন্যান্টসমূহ মুছে ফেলা (কেবল SYSTEM রুট টেন্যান্ট বহাল রাখা)
DELETE FROM tenants 
WHERE tenant_code != 'SYSTEM';

-- 10. [EN] Reset Super Admin Account status to clean ACTIVE state
--     [BN] সুপার অ্যাডমিন অ্যাকাউন্টের স্ট্যাটাস সক্রিয় ও আনলক করা
UPDATE users 
SET status = 'ACTIVE',
    failed_login_attempts = 0,
    locked_until = NULL,
    is_deleted = false,
    updated_at = CURRENT_TIMESTAMP
WHERE username = 'superadmin';

COMMIT;
