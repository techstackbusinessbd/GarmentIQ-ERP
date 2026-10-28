-- =============================================================================
-- [EN] Flyway Migration V24: Add Restore and Purge Permissions
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২৪: রিস্টোর ও পার্জ (স্থায়ী ডিলিট) পারমিশন সংযোজন
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval Gate),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] সফট-ডিলিটকৃত রেকর্ড পুনর্বহাল (RESTORE) এবং ট্র্যাশ থেকে চিরতরে পার্জ (PURGE)
--      করার জন্য সুনির্দিষ্ট গ্র্যানুলার অ্যাকশন পারমিশন তৈরি।
-- =============================================================================

-- 1. [EN] Insert Restore & Purge permissions into master permissions catalog
--    [BN] পারমিশন ক্যাটালগে রিস্টোর ও পার্জ পারমিশন অন্তর্ভুক্তিকরণ
INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES 
-- Client Factory Restore & Purge
(
    gen_random_uuid(),
    'TENANT:RESTORE',
    'TENANTS',
    'Restore a deactivated or soft-deleted client factory tenant back to active state',
    'admin',
    'System Administration',
    'client_mgmt',
    'Client Management',
    'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    'client_mgmt',
    'Client Management',
    'restore',
    'Restore',
    '/app/admin/clients',
    15
),
(
    gen_random_uuid(),
    'TENANT:PURGE',
    'TENANTS',
    'Permanently purge a deactivated client factory tenant record from database',
    'admin',
    'System Administration',
    'client_mgmt',
    'Client Management',
    'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    'client_mgmt',
    'Client Management',
    'purge',
    'Purge',
    '/app/admin/clients',
    16
),
-- User Directory Restore & Purge
(
    gen_random_uuid(),
    'USER:RESTORE',
    'USERS',
    'Restore a soft-deleted user account from trash back to active status',
    'admin',
    'System Administration',
    'user_mgmt',
    'User Directory',
    'User accounts, credential lifecycle, and operational staffing',
    'user_directory',
    'User Directory',
    'restore',
    'Restore',
    '/app/admin/users',
    35
),
(
    gen_random_uuid(),
    'USER:PURGE',
    'USERS',
    'Permanently purge a soft-deleted user account from database',
    'admin',
    'System Administration',
    'user_mgmt',
    'User Directory',
    'User accounts, credential lifecycle, and operational staffing',
    'user_directory',
    'User Directory',
    'purge',
    'Purge',
    '/app/admin/users',
    36
),
-- Role & Privilege Matrix Restore & Purge
(
    gen_random_uuid(),
    'ROLE:RESTORE',
    'ROLES',
    'Restore a soft-deleted custom role from trash back to active status',
    'admin',
    'System Administration',
    'role_mgmt',
    'Role & Privilege Matrix',
    'Role-based access control, privilege definitions, and clearance matrix',
    'role_matrix',
    'Role & Privilege Matrix',
    'restore',
    'Restore',
    '/app/admin/roles',
    45
),
(
    gen_random_uuid(),
    'ROLE:PURGE',
    'ROLES',
    'Permanently purge a custom role definition from database',
    'admin',
    'System Administration',
    'role_mgmt',
    'Role & Privilege Matrix',
    'Role-based access control, privilege definitions, and clearance matrix',
    'role_matrix',
    'Role & Privilege Matrix',
    'purge',
    'Purge',
    '/app/admin/roles',
    46
)
ON CONFLICT (permission_code) DO NOTHING;

-- 2. [EN] Grant all 6 permissions to Platform Super Admin (ROLE_SUPER_ADMIN)
--    [BN] সুপার অ্যাডমিনকে ৬টি রিস্টোর ও পার্জ পারমিশন প্রদান
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
  AND p.permission_code IN (
      'TENANT:RESTORE', 'TENANT:PURGE',
      'USER:RESTORE', 'USER:PURGE',
      'ROLE:RESTORE', 'ROLE:PURGE'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. [EN] Grant operational restore permissions to Factory Admin (ROLE_ADMIN)
--    [BN] ফ্যাক্টরি অ্যাডমিনকে ইউজার ও রোল রিস্টোর করার অনুমতি প্রদান (পার্জ বাদে)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_ADMIN'
  AND p.permission_code IN ('USER:RESTORE', 'ROLE:RESTORE')
ON CONFLICT (role_id, permission_id) DO NOTHING;
