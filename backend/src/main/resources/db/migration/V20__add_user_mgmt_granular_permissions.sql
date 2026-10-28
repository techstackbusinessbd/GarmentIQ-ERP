-- =============================================================================
-- [EN] Flyway Migration V20: Add User Management Granular Permissions
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২০: ইউজার ম্যানেজমেন্ট গ্র্যানুলার পারমিশন সংযোজন
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] ১. USER:PROFILE (ইউজার প্রোফাইল ও ক্রেডেনশিয়াল ভিউ)
--      ২. USER:LOCK (অ্যাকাউন্ট লক ও আনলক নিয়ন্ত্রণ)
--      ৩. USER:SPECIAL_PERMISSION (স্পেশাল পারমিশন ম্যানেজমেন্ট)
--      ৪. USER:RESET_PASSWORD (ইউজার ডিরেক্টরির অধীনে পাসওয়ার্ড রিসেট অ্যাকশন)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Insert New Granular Permissions for User Management
-- -----------------------------------------------------------------------------
INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES
    (
        gen_random_uuid(), 'USER:PROFILE', 'USERS', 'View employee user profile details and workspace preferences',
        'admin', 'System Administration', 'user_mgmt', 'User Management', 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
        'user_directory', 'User Directory', 'profile', 'User Profile', '/app/admin/profile', 21
    ),
    (
        gen_random_uuid(), 'USER:LOCK', 'USERS', 'Lock and unlock employee user accounts and login access',
        'admin', 'System Administration', 'user_mgmt', 'User Management', 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
        'user_directory', 'User Directory', 'lock', 'Lock / Unlock', '/app/admin/users', 24
    ),
    (
        gen_random_uuid(), 'USER:SPECIAL_PERMISSION', 'USERS', 'Configure and grant individual employee special permissions and clearances',
        'admin', 'System Administration', 'user_mgmt', 'User Management', 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
        'user_directory', 'User Directory', 'specialPermission', 'Special Permissions', '/app/admin/users/special-permissions', 25
    )
ON CONFLICT (permission_code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Consolidate Password Reset as Action under User Directory
-- -----------------------------------------------------------------------------
UPDATE permissions
SET permission_code = 'USER:RESET_PASSWORD',
    feature_id = 'user_directory',
    feature_name = 'User Directory',
    action_key = 'resetPassword',
    action_label = 'Reset Password',
    target_path = '/app/admin/users/reset-password',
    sort_order = 26
WHERE permission_code = 'PASSWORD_RESET:EXECUTE';

-- [EN] Remove redundant PASSWORD_RESET:MENU (now unified under USER:MENU & USER:RESET_PASSWORD)
-- [BN] অপ্রয়োজনীয় পৃথক PASSWORD_RESET:MENU অপসারণ (এখন USER:MENU ও USER:RESET_PASSWORD দ্বারা নিয়ন্ত্রিত)
DELETE FROM role_permissions
WHERE permission_id IN (SELECT id FROM permissions WHERE permission_code = 'PASSWORD_RESET:MENU');

DELETE FROM permissions
WHERE permission_code = 'PASSWORD_RESET:MENU';

-- -----------------------------------------------------------------------------
-- 3. Populate Default Permissions for Baseline Roles
-- -----------------------------------------------------------------------------
-- A) Grant all 4 new/aligned permissions to ROLE_SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
  AND p.permission_code IN ('USER:PROFILE', 'USER:LOCK', 'USER:SPECIAL_PERMISSION', 'USER:RESET_PASSWORD')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B) Grant all 4 to ROLE_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_ADMIN'
  AND p.permission_code IN ('USER:PROFILE', 'USER:LOCK', 'USER:SPECIAL_PERMISSION', 'USER:RESET_PASSWORD')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- C) Grant USER:PROFILE to ROLE_USER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_USER'
  AND p.permission_code = 'USER:PROFILE'
ON CONFLICT (role_id, permission_id) DO NOTHING;
