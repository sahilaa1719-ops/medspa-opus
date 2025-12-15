-- Fix Licenses Table RLS Policy
-- Run this in your Supabase SQL Editor

-- First, verify the table structure
-- Check if file_url column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'licenses' AND column_name = 'file_url'
    ) THEN
        ALTER TABLE licenses ADD COLUMN file_url TEXT;
    END IF;
END $$;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations on licenses" ON licenses;

-- Create new policy that allows authenticated users to perform all operations
CREATE POLICY "Allow all operations on licenses" ON licenses
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Verify RLS is enabled
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
