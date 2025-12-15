-- Add missing columns to licenses table
-- Run this in your Supabase SQL Editor

-- Add issuing_authority column
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS issuing_authority TEXT;

-- Add status column with check constraint
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'expired', 'pending'));

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
