-- =============================================================================
-- [EN] Flyway Migration V15: Repopulate Complete Baseline Role Permissions
-- [BN] পূর্ণাঙ্গ সিস্টেম রোল বেসলাইন পারমিশন পুনঃসিংক ও ডেটাবেজ নিশ্চিতকরণ মাইগ্রেশন
-- =============================================================================
-- [EN] Rules: Rule 05 (Database Ground Truth), Rule 12 (Schema Gate), Rule 15 (Bilingual)
-- [BN] সকল ৯টি সিস্টেম রোলের সাথে তাদের পূর্বনির্ধারিত পারমিশন ম্যাপ পোস্টগ্রেসকিউএলে নিশ্চিত করা।
-- =============================================================================

-- A) ROLE_SUPER_ADMIN: 100% of all registered permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B) ROLE_ADMIN: Full Admin on USERS, ROLES, SETTINGS, LIBRARY, PASSWORD_RESET + View on Operations
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('USERS', 'ROLES', 'SETTINGS', 'LIBRARY', 'PASSWORD_RESET')
    OR p.permission_code IN (
        'TENANT:MENU', 'TENANT:VIEW',
        'ORDER:MENU', 'ORDER:VIEW',
        'STYLE:MENU', 'STYLE:VIEW',
        'COSTING:MENU', 'COSTING:VIEW',
        'ROLL:MENU', 'ROLL:VIEW',
        'FABRIC_QC:MENU', 'FABRIC_QC:VIEW',
        'MARKER:MENU', 'MARKER:VIEW',
        'CUTTING:MENU', 'CUTTING:VIEW',
        'SEWING:MENU', 'SEWING:VIEW',
        'SCAN:MENU',
        'WASH:MENU', 'WASH:VIEW',
        'BATCH:MENU', 'BATCH:VIEW',
        'QC:MENU', 'QC:VIEW',
        'AQL:MENU', 'AQL:VIEW',
        'CARTON:MENU', 'CARTON:VIEW',
        'GATE_PASS:MENU', 'GATE_PASS:VIEW',
        'INVOICE:MENU', 'INVOICE:VIEW',
        'SHIPMENT:MENU', 'SHIPMENT:VIEW'
    )
)
WHERE r.role_code = 'ROLE_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- C) ROLE_MERCHANDISER: Order-to-Costing Authority
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('ORDERS', 'STYLES', 'COSTING')
    OR p.permission_code IN ('LIBRARY:MENU', 'LIBRARY:VIEW', 'ROLL:MENU', 'ROLL:VIEW', 'INVOICE:MENU', 'INVOICE:VIEW')
)
WHERE r.role_code = 'ROLE_MERCHANDISER'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- D) ROLE_CUTTING_MANAGER: Fabric, Marker & Cutting Floor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('FABRIC_QC', 'MARKERS', 'CUTTING')
    OR p.permission_code IN ('ORDER:MENU', 'ORDER:VIEW', 'STYLE:MENU', 'STYLE:VIEW', 'ROLL:MENU', 'ROLL:VIEW', 'ROLL:CREATE', 'ROLL:EDIT')
)
WHERE r.role_code = 'ROLE_CUTTING_MANAGER'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- E) ROLE_SEWING_SUPERVISOR: Sewing Lines & Scanning
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('SEWING', 'SCAN')
    OR p.permission_code IN ('ORDER:MENU', 'ORDER:VIEW', 'STYLE:MENU', 'STYLE:VIEW', 'CUTTING:MENU', 'CUTTING:VIEW')
)
WHERE r.role_code = 'ROLE_SEWING_SUPERVISOR'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- F) ROLE_QA_INSPECTOR: Fabric QC, Line QC & AQL Audits
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('FABRIC_QC', 'QC', 'AQL')
    OR p.permission_code IN ('ORDER:MENU', 'ORDER:VIEW', 'STYLE:MENU', 'STYLE:VIEW', 'CUTTING:MENU', 'CUTTING:VIEW', 'SEWING:MENU', 'SEWING:VIEW')
)
WHERE r.role_code = 'ROLE_QA_INSPECTOR'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- G) ROLE_FINISHING_MANAGER: Laundry Wash, Dry & Carton Packaging
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('WASH', 'BATCH', 'CARTON', 'GATE_PASS')
    OR p.permission_code IN ('ORDER:MENU', 'ORDER:VIEW', 'STYLE:MENU', 'STYLE:VIEW', 'QC:MENU', 'QC:VIEW')
)
WHERE r.role_code = 'ROLE_FINISHING_MANAGER'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- H) ROLE_COMMERCIAL_OFFICER: Gate Pass, Export Invoices & Seaport Shipping
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.module_name IN ('INVOICE', 'SHIPMENT', 'GATE_PASS')
    OR p.permission_code IN ('ORDER:MENU', 'ORDER:VIEW', 'CARTON:MENU', 'CARTON:VIEW')
)
WHERE r.role_code = 'ROLE_COMMERCIAL_OFFICER'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- I) ROLE_EXECUTIVE_VIEWER: Read-Only Executive Visibility across All Operational Modules
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
    p.permission_code LIKE '%:MENU'
    OR p.permission_code LIKE '%:VIEW'
)
WHERE r.role_code = 'ROLE_EXECUTIVE_VIEWER'
ON CONFLICT (role_id, permission_id) DO NOTHING;
