-- Update Documents Table Schema
-- Run this in your Supabase SQL Editor

-- Add missing columns
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Rename type to document_type for consistency
ALTER TABLE documents RENAME COLUMN type TO document_type;

-- Make uploaded_by nullable since we can get it from auth context
ALTER TABLE documents ALTER COLUMN uploaded_by DROP NOT NULL;

-- Update uploaded_by to use UUID and reference employees
-- First make it nullable and change type
ALTER TABLE documents ALTER COLUMN uploaded_by TYPE UUID USING uploaded_by::uuid;
ALTER TABLE documents ADD CONSTRAINT documents_uploaded_by_fkey 
  FOREIGN KEY (uploaded_by) REFERENCES employees(id) ON DELETE SET NULL;
