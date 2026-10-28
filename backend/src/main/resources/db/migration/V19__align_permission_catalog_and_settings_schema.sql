-- =============================================================================
-- [EN] Flyway Migration V19: Align Permission Catalog & Settings Schema
-- [BN] ফ্লাইওয়ে মাইগ্রেশন ১৯: পারমিশন ক্যাটালগ ও সেটিংস স্কিমা একীভূতকরণ
-- =============================================================================
-- [EN] Reference: Rule 05 (Database Ground Truth), Rule 12 (Schema Approval),
--                 Rule 15 (Bilingual), Rule 17 (Enterprise Standards)
-- [BN] ১. PASSWORD_RESET:MENU ও PASSWORD_RESET:EXECUTE ক্যাটালগে অন্তর্ভুক্ত করা
--      ২. Factory Shifts, Currency Exchange Rates ও System Audit Logs টেবিল তৈরি
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Align Permission Catalog Metadata for Password Reset & User Directory
-- -----------------------------------------------------------------------------
UPDATE permissions
SET module_id = 'user_mgmt',
    module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'user_directory',
    feature_name = 'User Directory'
WHERE permission_code IN ('USER:MENU', 'USER:VIEW', 'USER:CREATE', 'USER:EDIT', 'USER:DELETE');

UPDATE permissions
SET module_id = 'user_mgmt',
    module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'password_reset',
    feature_name = 'Password Reset',
    action_key = 'menu',
    action_label = 'Sidebar Menu',
    target_path = '/app/admin/users/reset-password',
    sort_order = 26
WHERE permission_code = 'PASSWORD_RESET:MENU';

UPDATE permissions
SET module_id = 'user_mgmt',
    module_title = 'User Management',
    module_description = 'Factory employee accounts, directory, credentials, user lifecycle, and password reset',
    feature_id = 'password_reset',
    feature_name = 'Password Reset',
    action_key = 'resetPassword',
    action_label = 'Reset Password',
    target_path = '/app/admin/users/reset-password',
    sort_order = 27
WHERE permission_code = 'PASSWORD_RESET:EXECUTE';

-- -----------------------------------------------------------------------------
-- 2. Create Factory Shifts Table (factory_shifts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS factory_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    break_minutes INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    shift_type VARCHAR(20) NOT NULL DEFAULT 'REGULAR',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_factory_shifts_tenant ON factory_shifts(tenant_id);

-- -----------------------------------------------------------------------------
-- 3. Create Currency Exchange Rates Table (currency_exchange_rates)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS currency_exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    currency_code VARCHAR(10) NOT NULL,
    currency_name VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    rate_to_usd NUMERIC(15, 6) NOT NULL DEFAULT 1.000000,
    rate_to_bdt NUMERIC(15, 4) NOT NULL DEFAULT 1.0000,
    is_master BOOLEAN NOT NULL DEFAULT false,
    is_operating BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_currency UNIQUE (tenant_id, currency_code)
);

CREATE INDEX IF NOT EXISTS idx_currency_rates_tenant ON currency_exchange_rates(tenant_id);

-- -----------------------------------------------------------------------------
-- 4. Create System Audit Logs Table (system_audit_logs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100),
    details TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
    ip_address VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_time ON system_audit_logs(tenant_id, timestamp DESC);
