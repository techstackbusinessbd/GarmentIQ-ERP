-- =============================================================================
-- [EN] Flyway Migration V21: Reorganize User Management Screen Hierarchy (5-Tier)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২১: ৫-স্তরের এন্টারপ্রাইজ ট্যাক্সোনমি অনুযায়ী ইউজার ফিচার বিন্যাস
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] ১. User Directory (ইউজার তালিকা ও অ্যাকাউন্ট লাইফসাইকেল স্ক্রিন)
--      ২. Password Reset (পাসওয়ার্ড রিসেট সেন্টার স্ক্রিন)
--      ৩. Special Permissions (কাস্টম ক্লিয়ারেন্স ও স্পেশাল পারমিশন স্ক্রিন)
--      ৪. User Profile (ব্যক্তিগত প্রোফাইল ও প্রেফারেন্স স্ক্রিন)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Align Features and Navigation Anchors under user_mgmt Module
-- -----------------------------------------------------------------------------

-- A) Feature 1: User Directory (/app/admin/users)
UPDATE permissions
SET feature_id = 'user_directory',
    feature_name = 'User Directory',
    target_path = '/app/admin/users',
    sort_order = 20
WHERE permission_code = 'USER:MENU';

UPDATE permissions
SET feature_id = 'user_directory',
    feature_name = 'User Directory',
    target_path = '/app/admin/users',
    sort_order = 21
WHERE permission_code = 'USER:VIEW';

UPDATE permissions
SET feature_id = 'user_directory',
    feature_name = 'User Directory',
    target_path = '/app/admin/users',
    sort_order = 22
WHERE permission_code = 'USER:CREATE';

UPDATE permissions
SET feature_id = 'user_directory',
    feature_name = 'User Directory',
    target_path = '/app/admin/users',
    sort_order = 23
WHERE permission_code = 'USER:EDIT';

UPDATE permissions
SET feature_id = 'user_directory',
    feature_name = 'User Directory',
    target_path = '/app/admin/users',
    sort_order = 24
WHERE permission_code = 'USER:LOCK';

UPDATE permissions
SET feature_id = 'user_directory',
    feature_name = 'User Directory',
    target_path = '/app/admin/users',
    sort_order = 25
WHERE permission_code = 'USER:DELETE';

-- B) Feature 2: Password Reset (/app/admin/users/reset-password)
UPDATE permissions
SET feature_id = 'password_reset',
    feature_name = 'Password Reset',
    action_key = 'resetPassword',
    action_label = 'Reset Password',
    target_path = '/app/admin/users/reset-password',
    sort_order = 27
WHERE permission_code = 'USER:RESET_PASSWORD';

-- C) Feature 3: Special Permissions (/app/admin/users/special-permissions)
UPDATE permissions
SET feature_id = 'special_permissions',
    feature_name = 'Special Permissions',
    action_key = 'specialPermission',
    action_label = 'Special Permissions',
    target_path = '/app/admin/users/special-permissions',
    sort_order = 29
WHERE permission_code = 'USER:SPECIAL_PERMISSION';

-- D) Feature 4: User Profile (/app/admin/profile)
UPDATE permissions
SET feature_id = 'user_profile',
    feature_name = 'User Profile & Preferences',
    action_key = 'profile',
    action_label = 'User Profile',
    target_path = '/app/admin/profile',
    sort_order = 31
WHERE permission_code = 'USER:PROFILE';

-- -----------------------------------------------------------------------------
-- 2. Insert Dedicated Navigation Anchors (menu) for Independent Screens
-- -----------------------------------------------------------------------------
INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES
    (
        gen_random_uuid(), 'PASSWORD_RESET:MENU', 'USERS', 'Access Password Reset workspace in navigation',
        'admin', 'System Administration', 'user_mgmt', 'User Management', 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
        'password_reset', 'Password Reset', 'menu', 'Sidebar Menu', '/app/admin/users/reset-password', 26
    ),
    (
        gen_random_uuid(), 'SPECIAL_PERM:MENU', 'USERS', 'Access User Special Permissions workspace in navigation',
        'admin', 'System Administration', 'user_mgmt', 'User Management', 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
        'special_permissions', 'Special Permissions', 'menu', 'Sidebar Menu', '/app/admin/users/special-permissions', 28
    ),
    (
        gen_random_uuid(), 'PROFILE:MENU', 'USERS', 'Access User Profile & Preferences workspace in navigation',
        'admin', 'System Administration', 'user_mgmt', 'User Management', 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
        'user_profile', 'User Profile & Preferences', 'menu', 'Sidebar Menu', '/app/admin/profile', 30
    )
ON CONFLICT (permission_code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Populate Role Permissions for New Navigation Anchors
-- -----------------------------------------------------------------------------
-- A) Grant all 3 navigation anchors to ROLE_SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
  AND p.permission_code IN ('PASSWORD_RESET:MENU', 'SPECIAL_PERM:MENU', 'PROFILE:MENU')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B) Grant all 3 navigation anchors to ROLE_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_ADMIN'
  AND p.permission_code IN ('PASSWORD_RESET:MENU', 'SPECIAL_PERM:MENU', 'PROFILE:MENU')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- C) Grant PROFILE:MENU to ROLE_USER (Employees can access their profile)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_USER'
  AND p.permission_code = 'PROFILE:MENU'
ON CONFLICT (role_id, permission_id) DO NOTHING;
