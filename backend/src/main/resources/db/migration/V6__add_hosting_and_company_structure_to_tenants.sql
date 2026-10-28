-- =============================================================================
-- [EN] Flyway Migration V6: Company Structure, Hosting Model & Subdomain Support
-- [BN] প্রতিষ্ঠান কাঠামো, ক্লাউড/অন-প্রেমিসেস হোস্টিং এবং সাবডোমেন সাপোর্ট মাইগ্রেশন
-- =============================================================================
-- [EN] Reference: Approved Multi-Tenant Architecture Specification (2026-10-22)
-- [BN] গ্রুপ অফ কোম্পানিজ বনাম সিঙ্গেল কোম্পানি, ক্লাউড সাবডোমেন এবং সেলফ-হোস্টেড
--      কাস্টম ডোমেন সাপোর্ট ফিল্ডসমূহ tenants টেবিলে যুক্ত করা।
-- =============================================================================

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS company_type VARCHAR(50) NOT NULL DEFAULT 'GROUP_OF_COMPANIES',
    ADD COLUMN IF NOT EXISTS hosting_type VARCHAR(30) NOT NULL DEFAULT 'CLOUD_SAAS',
    ADD COLUMN IF NOT EXISTS subdomain VARCHAR(60),
    ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(150);

-- Unique index on subdomain to prevent duplicate tenant routing in multi-tenant cloud
CREATE UNIQUE INDEX IF NOT EXISTS uq_tenants_subdomain
    ON tenants (LOWER(subdomain))
    WHERE subdomain IS NOT NULL AND is_deleted = false;

-- Index on custom_domain for on-premise / private cloud routing
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain
    ON tenants (LOWER(custom_domain))
    WHERE custom_domain IS NOT NULL AND is_deleted = false;

-- Update existing platform root tenant with default system subdomain
UPDATE tenants
SET subdomain = 'system',
    company_type = 'GROUP_OF_COMPANIES',
    hosting_type = 'CLOUD_SAAS'
WHERE tenant_code = 'SYSTEM' AND subdomain IS NULL;

-- Update existing seed demo tenant if present
UPDATE tenants
SET subdomain = 'textech',
    company_type = 'GROUP_OF_COMPANIES',
    hosting_type = 'CLOUD_SAAS'
WHERE tenant_code = 'TEXTECH' AND subdomain IS NULL;
