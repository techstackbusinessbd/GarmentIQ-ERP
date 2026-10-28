-- =============================================================================
-- [EN] Flyway Migration V22: Add Tenant Delete Permission (TENANT:DELETE)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২২: ক্লায়েন্ট ম্যানেজমেন্টে TENANT:DELETE পারমিশন সংযোজন
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval Gate),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] ক্লায়েন্ট/টেন্যান্ট অপসারণ বা ডি-প্রভিশনিং-এর জন্য TENANT:DELETE পারমিশন তৈরি
-- =============================================================================

INSERT INTO permissions (
    id, permission_code, module_name, description,
    domain_id, domain_title, module_id, module_title, module_description,
    feature_id, feature_name, action_key, action_label, target_path, sort_order
) VALUES (
    gen_random_uuid(),
    'TENANT:DELETE',
    'TENANTS',
    'De-provision or remove client factory tenant record',
    'admin',
    'System Administration',
    'client_mgmt',
    'Client Management',
    'Tenant multi-plant factory onboarding, client profiles, and plant licensing',
    'client_mgmt',
    'Client Management',
    'delete',
    'Delete',
    '/app/admin/clients',
    14
) ON CONFLICT (permission_code) DO NOTHING;

-- Grant TENANT:DELETE to ROLE_SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
  AND p.permission_code = 'TENANT:DELETE'
ON CONFLICT (role_id, permission_id) DO NOTHING;
