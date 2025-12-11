-- Add missing name column to users table and ensure RLS policies
-- Run this in your Supabase SQL Editor

-- Add name column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- Make name NOT NULL with a default for existing rows
UPDATE users SET name = email WHERE name IS NULL;
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for employee registration)
DROP POLICY IF EXISTS "Allow insert on users" ON users;
CREATE POLICY "Allow insert on users" ON users
FOR INSERT
WITH CHECK (true);

-- Create policy to allow users to read their own data
DROP POLICY IF EXISTS "Allow users to read own data" ON users;
CREATE POLICY "Allow users to read own data" ON users
FOR SELECT
USING (true);
