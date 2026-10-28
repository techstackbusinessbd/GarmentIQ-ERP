-- =============================================================================
-- [EN] Flyway Migration V14: Add Permission Catalog Metadata & Dynamic Hierarchy
-- [BN] পারমিশন ক্যাটালগ মেটাডাটা ও ডাইনামিক হায়ারার্কিক্যাল স্ট্রাকচার মাইগ্রেশন
-- =============================================================================
-- [EN] Rules: Rule 01 (Dynamic Data), Rule 05 (DB Truth), Rule 07 (<300 lines),
--             Rule 09 (Production Ready), Rule 12 (Schema Approval), Rule 15 (Bilingual)
-- [BN] ফ্রন্টএন্ডে হার্ডকোডিংয়ের অবসান ঘটিয়ে পারমিশন গ্রুপিং ও হায়ারার্কি সরাসরি ডাটাবেজে রূপান্তর।
-- =============================================================================

-- 1. [EN] Add domain, module, feature and action metadata columns to `permissions` table
--    [BN] `permissions` টেবিলে ডোমেন, মডিউল, ফিচার ও অ্যাকশন মেটাডাটা কলামসমূহ যুক্ত করা
ALTER TABLE permissions
    ADD COLUMN domain_id VARCHAR(50),
    ADD COLUMN domain_title VARCHAR(100),
    ADD COLUMN module_id VARCHAR(50),
    ADD COLUMN module_title VARCHAR(100),
    ADD COLUMN module_description VARCHAR(255),
    ADD COLUMN feature_id VARCHAR(50),
    ADD COLUMN feature_name VARCHAR(100),
    ADD COLUMN action_key VARCHAR(30),
    ADD COLUMN action_label VARCHAR(50),
    ADD COLUMN target_path VARCHAR(100),
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0;

-- 2. [EN] Populate Domain 00 (System Administration) 5 Core Modules Metadata
--    [BN] ডোমেন ০০ (সিস্টেম অ্যাডমিনিস্ট্রেশন)-এর ৫টি কোর মডিউলের মেটাডাটা হালনাগাদ

-- 2.1 Module: Client Management (client_mgmt)
UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'client_mgmt', module_title = 'Client Management',
    module_description = 'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    feature_id = 'client_mgmt', feature_name = 'Client Management',
    action_key = 'menu', action_label = 'Sidebar Menu',
    target_path = '/app/admin/clients', sort_order = 10
WHERE permission_code = 'TENANT:MENU';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'client_mgmt', module_title = 'Client Management',
    module_description = 'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    feature_id = 'client_mgmt', feature_name = 'Client Management',
    action_key = 'view', action_label = 'View',
    target_path = '/app/admin/clients', sort_order = 11
WHERE permission_code = 'TENANT:VIEW';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'client_mgmt', module_title = 'Client Management',
    module_description = 'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    feature_id = 'client_mgmt', feature_name = 'Client Management',
    action_key = 'create', action_label = 'Create',
    target_path = '/app/admin/clients', sort_order = 12
WHERE permission_code = 'TENANT:CREATE';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'client_mgmt', module_title = 'Client Management',
    module_description = 'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    feature_id = 'client_mgmt', feature_name = 'Client Management',
    action_key = 'edit', action_label = 'Edit',
    target_path = '/app/admin/clients', sort_order = 13
WHERE permission_code = 'TENANT:EDIT';

-- 2.2 Module: User Management (user_mgmt)
UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = 'menu', action_label = 'Sidebar Menu',
    target_path = '/app/admin/users', sort_order = 20
WHERE permission_code = 'USER:MENU';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = 'view', action_label = 'View',
    target_path = '/app/admin/users', sort_order = 21
WHERE permission_code = 'USER:VIEW';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = 'create', action_label = 'Create',
    target_path = '/app/admin/users', sort_order = 22
WHERE permission_code = 'USER:CREATE';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = 'edit', action_label = 'Edit',
    target_path = '/app/admin/users', sort_order = 23
WHERE permission_code = 'USER:EDIT';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = 'delete', action_label = 'Delete',
    target_path = '/app/admin/users', sort_order = 24
WHERE permission_code = 'USER:DELETE';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = 'resetPassword', action_label = 'Reset Password',
    target_path = '/app/admin/users', sort_order = 25
WHERE permission_code = 'PASSWORD_RESET:EXECUTE';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'user_mgmt', module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_mgmt', feature_name = 'User Management',
    action_key = NULL, action_label = NULL,
    target_path = '/app/admin/users', sort_order = 26
WHERE permission_code = 'PASSWORD_RESET:MENU';

-- 2.3 Module: Role & Privilege Matrix (role_mgmt)
UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'role_mgmt', module_title = 'Role & Privilege Matrix',
    module_description = 'System security roles, access templates, and user custom permission overrides',
    feature_id = 'role_matrix', feature_name = 'Role & Privilege Matrix',
    action_key = 'menu', action_label = 'Sidebar Menu',
    target_path = '/app/admin/roles', sort_order = 30
WHERE permission_code = 'ROLE:MENU';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'role_mgmt', module_title = 'Role & Privilege Matrix',
    module_description = 'System security roles, access templates, and user custom permission overrides',
    feature_id = 'role_matrix', feature_name = 'Role & Privilege Matrix',
    action_key = 'view', action_label = 'View',
    target_path = '/app/admin/roles', sort_order = 31
WHERE permission_code = 'ROLE:VIEW';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'role_mgmt', module_title = 'Role & Privilege Matrix',
    module_description = 'System security roles, access templates, and user custom permission overrides',
    feature_id = 'role_matrix', feature_name = 'Role & Privilege Matrix',
    action_key = 'create', action_label = 'Create',
    target_path = '/app/admin/roles', sort_order = 32
WHERE permission_code = 'ROLE:CREATE';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'role_mgmt', module_title = 'Role & Privilege Matrix',
    module_description = 'System security roles, access templates, and user custom permission overrides',
    feature_id = 'role_matrix', feature_name = 'Role & Privilege Matrix',
    action_key = 'edit', action_label = 'Edit',
    target_path = '/app/admin/roles', sort_order = 33
WHERE permission_code = 'ROLE:EDIT';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'role_mgmt', module_title = 'Role & Privilege Matrix',
    module_description = 'System security roles, access templates, and user custom permission overrides',
    feature_id = 'role_matrix', feature_name = 'Role & Privilege Matrix',
    action_key = 'delete', action_label = 'Delete',
    target_path = '/app/admin/roles', sort_order = 34
WHERE permission_code = 'ROLE:DELETE';

-- 2.4 Module: System Settings (settings_mgmt)
UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'settings_mgmt', module_title = 'System Settings',
    module_description = 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    feature_id = 'system_settings', feature_name = 'System Settings',
    action_key = 'menu', action_label = 'Sidebar Menu',
    target_path = '/app/admin/settings', sort_order = 40
WHERE permission_code = 'SETTINGS:MENU';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'settings_mgmt', module_title = 'System Settings',
    module_description = 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    feature_id = 'system_settings', feature_name = 'System Settings',
    action_key = 'view', action_label = 'View',
    target_path = '/app/admin/settings', sort_order = 41
WHERE permission_code = 'SETTINGS:VIEW';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'settings_mgmt', module_title = 'System Settings',
    module_description = 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    feature_id = 'system_settings', feature_name = 'System Settings',
    action_key = 'edit', action_label = 'Edit',
    target_path = '/app/admin/settings', sort_order = 42
WHERE permission_code = 'SETTINGS:EDIT';

-- 2.5 Module: Master Data Library (library_mgmt)
UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'library_mgmt', module_title = 'Master Data Library',
    module_description = 'Measurement units, size charts, garment items, colors, export seasons, and defect catalogs',
    feature_id = 'master_library', feature_name = 'Master Data Library',
    action_key = 'menu', action_label = 'Sidebar Menu',
    target_path = '/app/admin/library', sort_order = 50
WHERE permission_code = 'LIBRARY:MENU';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'library_mgmt', module_title = 'Master Data Library',
    module_description = 'Measurement units, size charts, garment items, colors, export seasons, and defect catalogs',
    feature_id = 'master_library', feature_name = 'Master Data Library',
    action_key = 'view', action_label = 'View',
    target_path = '/app/admin/library', sort_order = 51
WHERE permission_code = 'LIBRARY:VIEW';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'library_mgmt', module_title = 'Master Data Library',
    module_description = 'Measurement units, size charts, garment items, colors, export seasons, and defect catalogs',
    feature_id = 'master_library', feature_name = 'Master Data Library',
    action_key = 'create', action_label = 'Create',
    target_path = '/app/admin/library', sort_order = 52
WHERE permission_code = 'LIBRARY:CREATE';

UPDATE permissions
SET domain_id = 'admin', domain_title = 'System Administration',
    module_id = 'library_mgmt', module_title = 'Master Data Library',
    module_description = 'Measurement units, size charts, garment items, colors, export seasons, and defect catalogs',
    feature_id = 'master_library', feature_name = 'Master Data Library',
    action_key = 'edit', action_label = 'Edit',
    target_path = '/app/admin/library', sort_order = 53
WHERE permission_code = 'LIBRARY:EDIT';

-- 3. [EN] Performance indexes for catalog queries
--    [BN] ক্যাটালগ কোয়েরির জন্য ইনডেক্স তৈরি
CREATE INDEX idx_permissions_domain_sort ON permissions(domain_id, sort_order);
CREATE INDEX idx_permissions_module ON permissions(module_id);
