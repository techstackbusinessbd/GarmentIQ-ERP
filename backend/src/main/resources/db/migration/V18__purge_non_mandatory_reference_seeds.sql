-- =============================================================================
-- [EN] Flyway Migration V18: Purge Non-Mandatory Business Reference Seeds
-- [BN] ফ্লাইওয়ে মাইগ্রেশন V18: অ-বাধ্যতামূলক ব্যবসায়িক রেফারেন্স সিড ডেটা অপসারণ
-- =============================================================================
-- [EN] Rules: Rule 05 (Zero Hardcode & Dynamic Data), Rule 07 (<300 lines), Rule 12 (Schema Gate), Rule 15 (Bilingual)
-- [BN] সিস্টেম বুটস্ট্র্যাপের জন্য শুধুমাত্র প্ল্যাটফর্ম রুট টেন্যান্ট, সুপার অ্যাডমিন ও
--      ৩টি সিস্টেম রোল এবং ডোমেন ০০ পারমিশন ব্যতীত অন্য কোনো রেফারেন্স ডেটা (সাইজ, কালার,
--      ইউনিট, ডিফেক্ট কোড, আইটেম টাইপ ইত্যাদি) প্রাক-সিডেড থাকবে না।
--      অ্যাডমিন বা ব্যবহারকারী সিস্টেম রান করার পর সম্পূর্ণ ডায়নামিকালি ডেটা যুক্ত করবেন।
-- =============================================================================

-- 1. [EN] Purge all seeded master library entries (colors, garment items, seasons, sample stages)
--    [BN] মাস্টার লাইব্রেরি এন্ট্রি টেবিল থেকে প্রাক-সিডেড ২০টি রেকর্ড অপসারণ
DELETE FROM master_library_entries;

-- 2. [EN] Purge all seeded standard garment sizes
--    [BN] সাইজ মাস্টার টেবিল থেকে প্রাক-সিডেড ৭টি সাইজ অপসারণ (ব্ল্যাঙ্ক স্টেট)
DELETE FROM master_sizes;

-- 3. [EN] Purge all seeded master measurement units
--    [BN] মেজারমেন্ট ইউনিট মাস্টার টেবিল থেকে প্রাক-সিডেড ৯টি ইউনিট অপসারণ (ব্ল্যাঙ্ক স্টেট)
DELETE FROM master_units;

-- 4. [EN] Purge all seeded quality defect codes
--    [BN] কোয়ালিটি ডিফেক্ট কোড টেবিল থেকে প্রাক-সিডেড ৯টি ডিফেক্ট কোড অপসারণ (ব্ল্যাঙ্ক স্টেট)
DELETE FROM master_defect_codes;
