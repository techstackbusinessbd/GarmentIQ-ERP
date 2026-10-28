-- =============================================================================
-- [EN] Flyway Migration V25: Split System Settings into 5 Granular Features
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২৫: সিস্টেম সেটিংস মডিউলকে ৫টি সুনির্দিষ্ট ফিচারে বিভক্তকরণ
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval Gate),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] ১. Auto-Code Sequences & Templates (অটো-কোড টেম্পলেটস - রুল ২৪)
--      ২. Factory Shifts & Operating Hours (কারখানা শিফট ও কাজের সময়সূচী)
--      ৩. Currencies & Exchange Rates (মুদ্রা ও বৈদেশিক বিনিময় হার)
--      ৪. Platform Security Policies (লকআউট ও পাসওয়ার্ড পলিসি)
--      ৫. System Audit Logs (সিকিউরিটি অডিট ট্রেইল ও লগ)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. [EN] Purge legacy coarse settings permissions
--    [BN] পূর্বের জেনেরিক সেটিংস পারমিশন অপসারণ (ON DELETE CASCADE)
-- -----------------------------------------------------------------------------
DELETE FROM permissions WHERE permission_code IN ('SETTINGS:VIEW', 'SETTINGS:EDIT');

-- -----------------------------------------------------------------------------
-- 2. [EN] Align master SETTINGS:MENU as overarching navigation anchor
--    [BN] সার্বিক সেটিংস নেভিগেশন অ্যাঙ্কর হিসেবে SETTINGS:MENU আপডেট
-- -----------------------------------------------------------------------------
UPDATE permissions
SET domain_id = 'admin',
    domain_title = 'System Administration',
    module_id = 'settings_mgmt',
    module_title = 'System Settings',
    module_description = 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    feature_id = 'settings_overview',
    feature_name = 'Settings Overview',
    action_key = 'menu',
    action_label = 'Sidebar Menu',
    target_path = '/app/admin/settings',
    sort_order = 40
WHERE permission_code = 'SETTINGS:MENU';

-- -----------------------------------------------------------------------------
-- 3. [EN] Insert Granular Permissions across 5 Dedicated Subsystems
--    [BN] ৫টি পৃথক সাবসিস্টেমের জন্য গ্র্যানুলার পারমিশন কোড সংযোজন
-- -----------------------------------------------------------------------------
INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES 
-- Feature 1: Auto-Code Sequences & Dynamic Templates (settings_autocode)
(
    gen_random_uuid(), 'AUTO_CODE:MENU', 'SETTINGS',
    'Access auto-code formats tab and navigation view',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_autocode', 'Auto-Code Formats', 'menu', 'Sidebar Menu',
    '/app/admin/settings/auto-code', 41
),
(
    gen_random_uuid(), 'AUTO_CODE:VIEW', 'SETTINGS',
    'Inspect auto-code sequence formats and live pattern previews (Rule 24)',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_autocode', 'Auto-Code Formats', 'view', 'View',
    '/app/admin/settings/auto-code', 42
),
(
    gen_random_uuid(), 'AUTO_CODE:EDIT', 'SETTINGS',
    'Modify auto-code sequence patterns, prefixes, and padding digits',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_autocode', 'Auto-Code Formats', 'edit', 'Edit',
    '/app/admin/settings/auto-code', 43
),

-- Feature 2: Factory Shifts & Operating Hours (settings_shifts)
(
    gen_random_uuid(), 'SHIFT:MENU', 'SETTINGS',
    'Access factory shifts tab and navigation view',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_shifts', 'Factory Shifts & Hours', 'menu', 'Sidebar Menu',
    '/app/admin/settings/shifts', 44
),
(
    gen_random_uuid(), 'SHIFT:VIEW', 'SETTINGS',
    'View plant production shifts, break schedules, and shift timings',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_shifts', 'Factory Shifts & Hours', 'view', 'View',
    '/app/admin/settings/shifts', 45
),
(
    gen_random_uuid(), 'SHIFT:CREATE', 'SETTINGS',
    'Define and create new factory production shifts with custom break hours',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_shifts', 'Factory Shifts & Hours', 'create', 'Create',
    '/app/admin/settings/shifts', 46
),
(
    gen_random_uuid(), 'SHIFT:DELETE', 'SETTINGS',
    'Remove unused or deprecated factory production shifts',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_shifts', 'Factory Shifts & Hours', 'delete', 'Delete',
    '/app/admin/settings/shifts', 47
),

-- Feature 3: Currencies & Exchange Rates (settings_currencies)
(
    gen_random_uuid(), 'CURRENCY:MENU', 'SETTINGS',
    'Access currency exchange rates tab and navigation view',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_currencies', 'Currencies & Rates', 'menu', 'Sidebar Menu',
    '/app/admin/settings/currencies', 48
),
(
    gen_random_uuid(), 'CURRENCY:VIEW', 'SETTINGS',
    'View operating currencies, base conversion parameters, and BDT rates',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_currencies', 'Currencies & Rates', 'view', 'View',
    '/app/admin/settings/currencies', 49
),
(
    gen_random_uuid(), 'CURRENCY:EDIT', 'SETTINGS',
    'Update multi-currency conversion rates and baseline exchange rates',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_currencies', 'Currencies & Rates', 'edit', 'Edit',
    '/app/admin/settings/currencies', 50
),

-- Feature 4: Platform Security Policies (settings_security)
(
    gen_random_uuid(), 'SECURITY:MENU', 'SETTINGS',
    'Access platform security policies tab and navigation view',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_security', 'Platform Security', 'menu', 'Sidebar Menu',
    '/app/admin/settings/security', 51
),
(
    gen_random_uuid(), 'SECURITY:VIEW', 'SETTINGS',
    'Inspect active session timeouts, account lockout duration, and brute-force defenses',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_security', 'Platform Security', 'view', 'View',
    '/app/admin/settings/security', 52
),
(
    gen_random_uuid(), 'SECURITY:EDIT', 'SETTINGS',
    'Configure platform session duration, lockout limits, and failed attempt thresholds',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_security', 'Platform Security', 'edit', 'Edit',
    '/app/admin/settings/security', 53
),

-- Feature 5: System Audit Logs (settings_audit_logs)
(
    gen_random_uuid(), 'AUDIT_LOG:MENU', 'SETTINGS',
    'Access system audit trail workspace and navigation view',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_audit_logs', 'System Audit Logs', 'menu', 'Sidebar Menu',
    '/app/admin/audit-logs', 54
),
(
    gen_random_uuid(), 'AUDIT_LOG:VIEW', 'SETTINGS',
    'Inspect, search, and audit system governance logs, tenant actors, and security events',
    'admin', 'System Administration', 'settings_mgmt', 'System Settings', 'Platform auto-code sequences, factory shifts, currencies, security policies, and audit logs',
    'settings_audit_logs', 'System Audit Logs', 'view', 'View',
    '/app/admin/audit-logs', 55
)
ON CONFLICT (permission_code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. [EN] Re-align sort_order for Master Data Library module
--    [BN] মাস্টার ডাটা লাইব্রেরি মডিউলের sort_order ক্রমিক সামঞ্জস্য বিধান
-- -----------------------------------------------------------------------------
UPDATE permissions SET sort_order = 60 WHERE permission_code = 'LIBRARY:MENU';
UPDATE permissions SET sort_order = 61 WHERE permission_code = 'LIBRARY:VIEW';
UPDATE permissions SET sort_order = 62 WHERE permission_code = 'LIBRARY:CREATE';
UPDATE permissions SET sort_order = 63 WHERE permission_code = 'LIBRARY:EDIT';

-- -----------------------------------------------------------------------------
-- 5. [EN] Baseline Role Permissions Auto-Assignment
--    [BN] বেসলাইন রোলে নতুন পারমিশনসমূহ স্বয়ংক্রিয়ভাবে অ্যাসাইন করা
-- -----------------------------------------------------------------------------
-- A) ROLE_SUPER_ADMIN gets ALL registered system permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B) ROLE_ADMIN gets full clearance across settings_mgmt subsystems
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.module_id = 'settings_mgmt'
WHERE r.role_code = 'ROLE_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;
