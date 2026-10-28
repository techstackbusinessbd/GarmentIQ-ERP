-- =============================================================================
-- [EN] Flyway Migration V9: Standardize Employee Card Number to Numeric Format
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V9: এমপ্লয়ি কার্ড নম্বর নিউমেরিক ফরম্যাটে রূপান্তর (রুল ১২ ও ২৩)
-- =============================================================================
-- [EN] Converts legacy EMP- prefixed punch/card IDs to standard numeric punch codes (e.g. 255776).
-- [BN] পোশাক কারখানার প্রচলিত ৬-ডিজিট নিউমেরিক পাঞ্চ আইডি ফরম্যাটে রূপান্তর করে।

UPDATE users 
SET employee_card_no = '255776'
WHERE employee_card_no = 'EMP-ADM-001' 
   OR employee_card_no = 'EMP-TT-001' 
   OR employee_card_no = 'EMP-EXEC-001';
