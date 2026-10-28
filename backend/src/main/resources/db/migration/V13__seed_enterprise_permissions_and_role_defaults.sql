-- =============================================================================
-- [EN] Flyway Migration V13: Seed Complete Enterprise Permissions & Role Defaults
-- [BN] পূর্ণাঙ্গ এন্টারপ্রাইজ পারমিশন ক্যাটালগ ও সিস্টেম রোল বেসলাইন সিড মাইগ্রেশন
-- =============================================================================
-- [EN] Rules: Rule 05 (Database Ground Truth), Rule 12 (Schema Gate), Rule 15 (Bilingual)
-- [BN] হার্ডকোডেড ফ্রন্টএন্ড পারমিশন কনস্ট্যান্টস দূর করে পোস্টগ্রেসকিউএলকে ১০০% একক ট্রুথ প্রতিষ্ঠা।
-- =============================================================================

-- 1. Insert Standard Enterprise Permissions into `permissions` table
--    সকল অপারেশনাল ও অ্যাডমিন ডোমেনের গ্র্যানুলার পারমিশন কোড যুক্ত করা
INSERT INTO permissions (id, permission_code, module_name, description)
VALUES
    -- Admin: User Management
    (gen_random_uuid(), 'USER:MENU', 'USERS', 'Access User Management menu in sidebar navigation'),
    (gen_random_uuid(), 'USER:VIEW', 'USERS', 'View user directory and profile cards'),
    (gen_random_uuid(), 'USER:CREATE', 'USERS', 'Create and onboard new factory users'),
    (gen_random_uuid(), 'USER:EDIT', 'USERS', 'Edit existing user details and status'),
    (gen_random_uuid(), 'USER:DELETE', 'USERS', 'Deactivate or soft-delete user accounts'),

    -- Admin: Role Management
    (gen_random_uuid(), 'ROLE:MENU', 'ROLES', 'Access Role Directory menu in sidebar navigation'),
    (gen_random_uuid(), 'ROLE:VIEW', 'ROLES', 'View system roles and privilege matrix'),
    (gen_random_uuid(), 'ROLE:CREATE', 'ROLES', 'Create new custom enterprise roles'),
    (gen_random_uuid(), 'ROLE:EDIT', 'ROLES', 'Modify role permissions and access templates'),
    (gen_random_uuid(), 'ROLE:DELETE', 'ROLES', 'Delete non-system custom roles'),

    -- Admin: Tenant Factory Management
    (gen_random_uuid(), 'TENANT:MENU', 'TENANTS', 'Access Client Factory Directory in navigation'),
    (gen_random_uuid(), 'TENANT:VIEW', 'TENANTS', 'View tenant client factory profiles'),
    (gen_random_uuid(), 'TENANT:CREATE', 'TENANTS', 'Register and onboard new client factory tenant'),
    (gen_random_uuid(), 'TENANT:EDIT', 'TENANTS', 'Modify tenant subscription and plant configuration'),

    -- Admin: System Settings
    (gen_random_uuid(), 'SETTINGS:MENU', 'SETTINGS', 'Access System Settings menu in sidebar'),
    (gen_random_uuid(), 'SETTINGS:VIEW', 'SETTINGS', 'View system auto-code rules and security configuration'),
    (gen_random_uuid(), 'SETTINGS:EDIT', 'SETTINGS', 'Update auto-code sequences, shifts, and security policies'),

    -- Admin: Master Data Library
    (gen_random_uuid(), 'LIBRARY:MENU', 'LIBRARY', 'Access Master Data Library in navigation'),
    (gen_random_uuid(), 'LIBRARY:VIEW', 'LIBRARY', 'View master units, sizes, defect codes, and reference libraries'),
    (gen_random_uuid(), 'LIBRARY:CREATE', 'LIBRARY', 'Add new master reference data records'),
    (gen_random_uuid(), 'LIBRARY:EDIT', 'LIBRARY', 'Edit and update master library definitions'),

    -- Admin: Password Reset
    (gen_random_uuid(), 'PASSWORD_RESET:MENU', 'PASSWORD_RESET', 'Access Password Reset workspace in sidebar'),
    (gen_random_uuid(), 'PASSWORD_RESET:EXECUTE', 'PASSWORD_RESET', 'Execute administrative password reset and unlock user'),

    -- Merchandising: Buyer Orders (PO)
    (gen_random_uuid(), 'ORDER:MENU', 'ORDERS', 'Access Buyer Orders menu in sidebar navigation'),
    (gen_random_uuid(), 'ORDER:VIEW', 'ORDERS', 'View buyer purchase orders and booking grid'),
    (gen_random_uuid(), 'ORDER:CREATE', 'ORDERS', 'Create new buyer purchase order booking'),
    (gen_random_uuid(), 'ORDER:EDIT', 'ORDERS', 'Update order quantity, delivery dates, and breakdown'),
    (gen_random_uuid(), 'ORDER:DELETE', 'ORDERS', 'Cancel or delete purchase orders'),
    (gen_random_uuid(), 'ORDER:APPROVE', 'ORDERS', 'Approve buyer purchase order for production'),

    -- Merchandising: Styles & Tech-Packs
    (gen_random_uuid(), 'STYLE:MENU', 'STYLES', 'Access Styles and Tech-Pack workspace in sidebar'),
    (gen_random_uuid(), 'STYLE:VIEW', 'STYLES', 'View style details, size-color specs, and tech-packs'),
    (gen_random_uuid(), 'STYLE:CREATE', 'STYLES', 'Create new style and upload tech-pack specs'),
    (gen_random_uuid(), 'STYLE:EDIT', 'STYLES', 'Modify style measurements, grading, and artwork'),
    (gen_random_uuid(), 'STYLE:DELETE', 'STYLES', 'Deactivate obsolete styles'),

    -- Merchandising: BOM & Costing
    (gen_random_uuid(), 'COSTING:MENU', 'COSTING', 'Access BOM & Cost Sheets menu in sidebar'),
    (gen_random_uuid(), 'COSTING:VIEW', 'COSTING', 'View pre-costing, consumption, and BOM budgets'),
    (gen_random_uuid(), 'COSTING:CREATE', 'COSTING', 'Draft new BOM consumption and costing sheet'),
    (gen_random_uuid(), 'COSTING:EDIT', 'COSTING', 'Revise costing line items, yarn, and trims cost'),
    (gen_random_uuid(), 'COSTING:APPROVE', 'COSTING', 'Approve final garment cost sheet for production'),

    -- Inventory: Roll Stock & Bins
    (gen_random_uuid(), 'ROLL:MENU', 'ROLLS', 'Access Fabric Roll Stock in sidebar navigation'),
    (gen_random_uuid(), 'ROLL:VIEW', 'ROLLS', 'View roll inventory, warehouse bins, and lots'),
    (gen_random_uuid(), 'ROLL:CREATE', 'ROLLS', 'Receive and scan incoming fabric rolls into warehouse'),
    (gen_random_uuid(), 'ROLL:EDIT', 'ROLLS', 'Reallocate bins, issue fabric rolls to cutting floor'),
    (gen_random_uuid(), 'ROLL:DELETE', 'ROLLS', 'Write-off damaged rolls'),

    -- Inventory: 4-Point Fabric QC
    (gen_random_uuid(), 'FABRIC_QC:MENU', 'FABRIC_QC', 'Access 4-Point Fabric QC inspection in sidebar'),
    (gen_random_uuid(), 'FABRIC_QC:VIEW', 'FABRIC_QC', 'View roll inspection reports and defect points'),
    (gen_random_uuid(), 'FABRIC_QC:CREATE', 'FABRIC_QC', 'Perform 4-point inspection and log roll defects'),
    (gen_random_uuid(), 'FABRIC_QC:EDIT', 'FABRIC_QC', 'Update inspection audit score and shade grading'),
    (gen_random_uuid(), 'FABRIC_QC:APPROVE', 'FABRIC_QC', 'Approve inspected fabric lot for cutting release'),

    -- Cutting: Marker Planning
    (gen_random_uuid(), 'MARKER:MENU', 'MARKERS', 'Access Marker Planning in sidebar navigation'),
    (gen_random_uuid(), 'MARKER:VIEW', 'MARKERS', 'View CAD marker lay ratios, efficiency, and shrinkage allowances'),
    (gen_random_uuid(), 'MARKER:CREATE', 'MARKERS', 'Create marker plan with size-ratio combinations'),
    (gen_random_uuid(), 'MARKER:EDIT', 'MARKERS', 'Adjust marker width, shrinkage table, and cut lay ratio'),
    (gen_random_uuid(), 'MARKER:APPROVE', 'MARKERS', 'Approve marker layout for spreading and table execution'),

    -- Cutting: Lay Orders & Spreading
    (gen_random_uuid(), 'CUTTING:MENU', 'CUTTING', 'Access Cutting Lay Orders in sidebar navigation'),
    (gen_random_uuid(), 'CUTTING:VIEW', 'CUTTING', 'View cutting jobs, plies count, and fabric lay orders'),
    (gen_random_uuid(), 'CUTTING:CREATE', 'CUTTING', 'Issue new cutting lay order to spreader table'),
    (gen_random_uuid(), 'CUTTING:EXECUTE', 'CUTTING', 'Record actual cut ply count and generate bundle tags'),

    -- Sewing: Line Loading & Hourly Logs
    (gen_random_uuid(), 'SEWING:MENU', 'SEWING', 'Access Sewing Floor in sidebar navigation'),
    (gen_random_uuid(), 'SEWING:VIEW', 'SEWING', 'View line balance, hourly output, and operator allocations'),
    (gen_random_uuid(), 'SEWING:LOG', 'SEWING', 'Log hourly production count per sewing line'),
    (gen_random_uuid(), 'SEWING:EDIT', 'SEWING', 'Adjust target SMV, line allocation, and pitch time'),

    -- Sewing: RFID / Barcode Scanning
    (gen_random_uuid(), 'SCAN:MENU', 'SCAN', 'Access RFID Shop Floor Scanning in sidebar'),
    (gen_random_uuid(), 'SCAN:EXECUTE', 'SCAN', 'Scan UHF RFID tags or QR bundles at inspection checkpoints'),

    -- Laundry: Washing & Dry Process
    (gen_random_uuid(), 'WASH:MENU', 'WASH', 'Access Industrial Laundry in sidebar navigation'),
    (gen_random_uuid(), 'WASH:VIEW', 'WASH', 'View wet and dry washing recipes, enzyme wash, and tint batches'),
    (gen_random_uuid(), 'WASH:CREATE', 'WASH', 'Create wash recipe and chemical consumption batch'),
    (gen_random_uuid(), 'WASH:EDIT', 'WASH', 'Update recipe parameters, liquor ratio, and cycle time'),

    -- Laundry: Batch Processing
    (gen_random_uuid(), 'BATCH:MENU', 'BATCH', 'Access Wash Batches in sidebar navigation'),
    (gen_random_uuid(), 'BATCH:VIEW', 'BATCH', 'View live hydro-extractor and dryer batch status'),
    (gen_random_uuid(), 'BATCH:CREATE', 'BATCH', 'Dispatch garments bundle to hydro-drying batch'),

    -- Quality: Line End QC
    (gen_random_uuid(), 'QC:MENU', 'QC', 'Access Quality Control in sidebar navigation'),
    (gen_random_uuid(), 'QC:VIEW', 'QC', 'View defect Pareto charts, rejection logs, and DHU stats'),
    (gen_random_uuid(), 'QC:INSPECT', 'QC', 'Log garment defects at end-of-line checking station'),

    -- Quality: AQL Final Audit
    (gen_random_uuid(), 'AQL:MENU', 'AQL', 'Access AQL Final Audit in sidebar navigation'),
    (gen_random_uuid(), 'AQL:VIEW', 'AQL', 'View buyer AQL inspection standards (1.5, 2.5, 4.0)'),
    (gen_random_uuid(), 'AQL:AUDIT', 'AQL', 'Conduct carton sampling and submit final pass/fail audit report'),

    -- Packaging: Master Cartons
    (gen_random_uuid(), 'CARTON:MENU', 'CARTON', 'Access Carton Packaging in sidebar navigation'),
    (gen_random_uuid(), 'CARTON:VIEW', 'CARTON', 'View carton barcodes, packing lists, and assortments'),
    (gen_random_uuid(), 'CARTON:PACK', 'CARTON', 'Scan garments into master cartons and seal RFID shipping tags'),

    -- Packaging: Gate Pass
    (gen_random_uuid(), 'GATE_PASS:MENU', 'GATE_PASS', 'Access RFID Gate Pass in sidebar navigation'),
    (gen_random_uuid(), 'GATE_PASS:VIEW', 'GATE_PASS', 'View vehicle gate pass records and delivery challans'),
    (gen_random_uuid(), 'GATE_PASS:ISSUE', 'GATE_PASS', 'Issue dispatch gate pass for loaded vehicle exit'),

    -- Commercial: Invoices
    (gen_random_uuid(), 'INVOICE:MENU', 'INVOICE', 'Access Export Invoices in sidebar navigation'),
    (gen_random_uuid(), 'INVOICE:VIEW', 'INVOICE', 'View commercial invoices and packing lists'),
    (gen_random_uuid(), 'INVOICE:CREATE', 'INVOICE', 'Generate commercial invoice against export LC'),
    (gen_random_uuid(), 'INVOICE:EDIT', 'INVOICE', 'Update HS codes, shipping terms (FOB/CIF), and bank details'),

    -- Commercial: Shipments
    (gen_random_uuid(), 'SHIPMENT:MENU', 'SHIPMENT', 'Access Container Dispatch in sidebar navigation'),
    (gen_random_uuid(), 'SHIPMENT:VIEW', 'SHIPMENT', 'View container stuffing, bill of lading, and port milestones'),
    (gen_random_uuid(), 'SHIPMENT:DISPATCH', 'SHIPMENT', 'Confirm container gate-out and dispatch to seaport')
ON CONFLICT (permission_code) DO NOTHING;

-- 2. Populate Baseline Role Permissions in PostgreSQL (`role_permissions` table)

-- A) ROLE_SUPER_ADMIN: Granted 100% of all registered permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B) ROLE_ADMIN (Factory Admin): Administrative Authority + Operational Visibility
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
