-- Add profile columns for refined registration flow
-- real_name: 保護者氏名 (Optional)
-- member_name: 劇団員名 (Required)
-- phone_number: REMOVED (Not required)

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS real_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS member_name TEXT;
