-- =============================================================================
-- [EN] Flyway Migration V23: Revoke Client Management From Non-Super-Admin Roles
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ২৩: সুপার অ্যাডমিন ব্যতীত অন্য সকল রোল থেকে ক্লায়েন্ট ম্যানেজমেন্ট পারমিশন প্রত্যাহার
-- =============================================================================
-- [EN] Reference: OWASP A01 (Broken Access Control), CWE-269 (Privilege Escalation)
--                 Rule 05 (Database Ground Truth), Rule 12 (Schema Approval Gate)
-- [BN] মাল্টি-টেন্যান্ট আইসোলেশন ও প্রিভিলেজ এসকেলেশন রোধে ফ্যাক্টরি অ্যাডমিন বা
--      অন্যান্য নন-সুপারঅ্যাডমিন রোল ও ইউজার থেকে TENANT:* পারমিশন সম্পূর্ণ প্রত্যাহার।
-- =============================================================================

-- 1. [EN] Revoke all Client Management (TENANT:*) permissions from non-super-admin roles
--    [BN] ROLE_SUPER_ADMIN ব্যতীত অন্য সমস্ত ভূমিকা থেকে TENANT পারমিশন অপসারণ
DELETE FROM role_permissions
WHERE role_id IN (
    SELECT id FROM roles WHERE role_code != 'ROLE_SUPER_ADMIN'
)
AND permission_id IN (
    SELECT id FROM permissions 
    WHERE module_id = 'client_mgmt' 
       OR permission_code LIKE 'TENANT:%'
);

-- 2. [EN] Revoke any accidental user direct custom overrides for TENANT:*
--    [BN] নন-সুপারঅ্যাডমিন ইউজারদের জন্য নির্ধারিত TENANT কাস্টম পারমিশন ওভাররাইড অপসারণ
DELETE FROM user_custom_permissions
WHERE permission_code LIKE 'TENANT:%'
  AND user_id NOT IN (
      SELECT u.id FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.role_code = 'ROLE_SUPER_ADMIN'
  );
