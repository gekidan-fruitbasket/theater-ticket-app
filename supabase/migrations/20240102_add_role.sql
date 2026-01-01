-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update existing users to have 'user' role (if any nulls)
UPDATE profiles SET role = 'user' WHERE role IS NULL;
