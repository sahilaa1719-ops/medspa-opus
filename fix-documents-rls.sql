-- Fix Documents Table RLS Policy
-- Run this in your Supabase SQL Editor

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations on documents" ON documents;

-- Create new policy that allows authenticated users to perform all operations
CREATE POLICY "Allow all operations on documents" ON documents
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Verify RLS is enabled
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
