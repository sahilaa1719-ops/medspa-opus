-- Create Type Management Tables
-- Run this in your Supabase SQL Editor

-- Document Types Table
CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- License Types Table
CREATE TABLE IF NOT EXISTS license_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Position Types Table
CREATE TABLE IF NOT EXISTS position_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_types ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations on document_types" ON document_types
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on license_types" ON license_types
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on position_types" ON position_types
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default document types
INSERT INTO document_types (name) VALUES
  ('Contract'),
  ('License Copy'),
  ('ID Copy'),
  ('Insurance'),
  ('Certification'),
  ('Policy'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- Insert default license types
INSERT INTO license_types (name) VALUES
  ('RN License'),
  ('LPN License'),
  ('Aesthetician License'),
  ('Medical Director License'),
  ('Botox Certification'),
  ('Dermal Filler Certification'),
  ('Laser Operator Certification'),
  ('CPR Certification'),
  ('First Aid Certification'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- Insert default position types
INSERT INTO position_types (name) VALUES
  ('RN'),
  ('LPN'),
  ('Aesthetician'),
  ('Medical Director'),
  ('Laser Technician'),
  ('Front Desk'),
  ('Manager'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

