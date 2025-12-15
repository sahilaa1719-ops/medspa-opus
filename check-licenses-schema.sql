-- Check and Fix Licenses Table Schema
-- Run this in your Supabase SQL Editor

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'licenses'
ORDER BY ordinal_position;

-- This will show you the actual column names in your database
-- After running this, you'll see the actual structure
