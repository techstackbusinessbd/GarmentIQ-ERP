-- =============================================================================
-- [EN] Database Migration: Account Locking and Brute Force Protection (V10)
-- [BN] ডেটাবেজ মাইগ্রেশন: অ্যাকাউন্ট লকিং ও ব্রুট-ফোর্স প্রটেকশন (V10)
-- =============================================================================
-- [EN] Author: Ariful Islam (Tech Lead & Backend Specialist)
-- [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
-- [BN] পর পর ৫ বার ভুল পাসওয়ার্ড দিলে অ্যাকাউন্ট স্বয়ংক্রিয় লক করার জন্য ফিল্ড সংযোজন।

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS failed_login_attempts INT NOT NULL DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN users.failed_login_attempts IS 'Consecutive failed authentication attempts counter (locks at 5)';
COMMENT ON COLUMN users.locked_until IS 'Timestamp until which the user account remains locked (NULL if unlocked)';
