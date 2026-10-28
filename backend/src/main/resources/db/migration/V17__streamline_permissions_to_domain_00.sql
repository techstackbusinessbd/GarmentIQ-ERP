-- =============================================================================
-- [EN] Flyway Migration V17: Streamline Permissions to Domain 00 (Foundation & Administration)
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V17: পারমিশন টেবিলকে ডোমেন ০০ (ফাউন্ডেশন ও প্রশাসন)-এ সুবিন্যস্তকরণ
-- =============================================================================
-- [EN] Rules: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 12 (Schema Gate), Rule 15 (Bilingual)
-- [BN] ডোমেন-ড্রিভেন ডিজাইন (DDD) ও YAGNI নীতি অনুযায়ী বর্তমান ডেভেলপমেন্ট স্কোপ শুধুমাত্র
--      ডোমেন ০০ (System Foundation & Administration)-এর মধ্যেই সীমাবদ্ধ।
--      ভবিষ্যতের অন্যান্য অপারেশনাল ডোমেনের (অর্ডার, কাটিং, সুইং, ওয়াশ, কমার্শিয়াল ইত্যাদি)
--      অকাল পারমিশনসমূহ অপসারিত হবে এবং সংশ্লিষ্ট ডোমেন ডেভেলপমেন্টের সময় মাইগ্রেশন দ্বারা যুক্ত হবে।
-- =============================================================================

-- 1. [EN] Clean up role permissions mapped to non-admin domain permissions
--    [BN] রোল-পারমিশন ম্যাপিং থেকে নন-অ্যাডমিন পারমিশন লিঙ্কসমূহ অপসারণ
DELETE FROM role_permissions
WHERE permission_id IN (
    SELECT id FROM permissions
    WHERE domain_id IS NULL OR domain_id != 'admin'
);

-- 2. [EN] Clean up user custom permissions mapped to non-admin domain permissions
--    [BN] ইউজার কাস্টম পারমিশন ওভাররাইড থেকে নন-অ্যাডমিন পারমিশন কোড অপসারণ
DELETE FROM user_custom_permissions
WHERE permission_code NOT IN (
    SELECT permission_code FROM permissions
    WHERE domain_id = 'admin'
);

-- 3. [EN] Purge premature non-admin domain permissions from master catalog
--    [BN] পারমিশন মাস্টার ক্যাটালগ থেকে অপ্রয়োজনীয় ৭২টি প্রি-ম্যাচিউর পারমিশন অপসারণ
DELETE FROM permissions
WHERE domain_id IS NULL OR domain_id != 'admin';

-- 4. [EN] Ensure System Super Admin (ROLE_SUPER_ADMIN) holds all 23 Domain 00 permissions
--    [BN] সিস্টেম সুপার অ্যাডমিনকে ডোমেন ০০-এর সম্পূর্ণ ২৩টি পারমিশন নিশ্চিত করা
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ROLE_SUPER_ADMIN'
  AND p.domain_id = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 5. [EN] Ensure Factory Admin (ROLE_ADMIN) holds operational permissions (21 permissions)
--    [BN] ফ্যাক্টরি অ্যাডমিনকে ২১টি প্রশাসনিক পারমিশন দেওয়া (টেন্যান্ট তৈরি/এডিটিং ব্যতীত)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.domain_id = 'admin' 
  AND p.permission_code NOT IN ('TENANT:CREATE', 'TENANT:EDIT')
WHERE r.role_code = 'ROLE_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 6. [EN] Ensure General User (ROLE_USER) holds baseline read-only visibility (2 permissions)
--    [BN] সাধারণ ব্যবহারকারীকে বেসলাইন ভিউ পারমিশন নিশ্চিত করা
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.permission_code IN ('USER:VIEW', 'LIBRARY:VIEW')
WHERE r.role_code = 'ROLE_USER'
ON CONFLICT (role_id, permission_id) DO NOTHING;
