-- Update tax_documents table to support admin uploads
-- Run this in your Supabase SQL Editor

-- Drop the existing table and recreate with correct columns
DROP TABLE IF EXISTS tax_documents CASCADE;

CREATE TABLE tax_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  tax_year INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by TEXT DEFAULT 'admin',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on tax_documents" ON tax_documents
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_tax_documents_employee_id ON tax_documents(employee_id);
CREATE INDEX idx_tax_documents_tax_year ON tax_documents(tax_year);
