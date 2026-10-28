-- =============================================================================
-- [EN] Database Migration: User-Level Direct Custom Permissions (V11)
-- [BN] ডেটাবেজ মাইগ্রেশন: ব্যবহারকারীভিত্তিক কাস্টম ওভাররাইড পারমিশন (V11)
-- =============================================================================
-- [EN] Author: Ariful Islam (Tech Lead & Backend Specialist)
-- [EN] Reference: Rule 12 Approval Gate, docs/requirements/srs/SRS_00B_AUTH.md
-- [BN] রোলের বাইরে নির্দিষ্ট কর্মীকে বিশেষ ক্ষমতা প্রদান (Grant) বা খর্ব (Deny) করার টেবিল।

CREATE TABLE IF NOT EXISTS user_custom_permissions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_code VARCHAR(60) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    CONSTRAINT uq_user_custom_permission UNIQUE (user_id, permission_code)
);

CREATE INDEX IF NOT EXISTS idx_user_custom_permissions_user_id ON user_custom_permissions(user_id);

COMMENT ON TABLE user_custom_permissions IS 'User-level direct granular permission grants and explicit restrictions';
COMMENT ON COLUMN user_custom_permissions.id IS 'Primary key UUIDv7 of the custom grant record';
COMMENT ON COLUMN user_custom_permissions.user_id IS 'Foreign key reference to target user account';
COMMENT ON COLUMN user_custom_permissions.permission_code IS 'Unique functional permission key (e.g. ORDER:APPROVE, COSTING:APPROVE)';
COMMENT ON COLUMN user_custom_permissions.is_granted IS 'True indicates explicit grant; false indicates explicit revocation/denial';
COMMENT ON COLUMN user_custom_permissions.created_at IS 'Audit timestamp when the permission was assigned';
COMMENT ON COLUMN user_custom_permissions.created_by IS 'Username of the administrator authorizing the custom privilege';
