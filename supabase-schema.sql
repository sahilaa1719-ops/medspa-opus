-- MedSpa Opus Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee', 'payroll')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  manager TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  hire_date DATE NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'terminated')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract')),
  hourly_rate NUMERIC(10, 2),
  overtime_rate NUMERIC(10, 2),
  annual_salary NUMERIC(10, 2),
  pay_frequency TEXT CHECK (pay_frequency IN ('hourly', 'weekly', 'bi-weekly', 'monthly', 'annually')),
  bank_account_last4 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  license_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'pending')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pay Stubs Table
CREATE TABLE IF NOT EXISTS pay_stubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  gross_pay NUMERIC(10, 2) NOT NULL,
  net_pay NUMERIC(10, 2) NOT NULL,
  regular_hours NUMERIC(6, 2),
  overtime_hours NUMERIC(6, 2),
  federal_tax NUMERIC(10, 2),
  state_tax NUMERIC(10, 2),
  social_security NUMERIC(10, 2),
  medicare NUMERIC(10, 2),
  health_insurance NUMERIC(10, 2),
  retirement_401k NUMERIC(10, 2),
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'processing')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Entries Table
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  regular_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
  overtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, work_date)
);

-- Tax Documents Table
CREATE TABLE IF NOT EXISTS tax_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('W-2', '1099')),
  tax_year INTEGER NOT NULL,
  wages NUMERIC(10, 2),
  federal_tax_withheld NUMERIC(10, 2),
  state_tax_withheld NUMERIC(10, 2),
  social_security_wages NUMERIC(10, 2),
  medicare_wages NUMERIC(10, 2),
  file_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'generated', 'sent', 'filed')) DEFAULT 'draft',
  generated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Reports Table
CREATE TABLE IF NOT EXISTS payroll_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  date_range_start DATE,
  date_range_end DATE,
  filters JSONB,
  file_url TEXT,
  generated_by TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed')) DEFAULT 'generating'
);

-- Scheduled Reports Table
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  recipients TEXT[] NOT NULL,
  filters JSONB,
  next_run_date DATE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pay_stubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing authenticated users to access data)
-- You may want to customize these based on your security requirements

CREATE POLICY "Allow authenticated users to read users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on locations" ON locations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on employees" ON employees
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on licenses" ON licenses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on documents" ON documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on pay_stubs" ON pay_stubs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on time_entries" ON time_entries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on tax_documents" ON tax_documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on payroll_reports" ON payroll_reports
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on scheduled_reports" ON scheduled_reports
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample users with passwords (using plain text for demo - in production use hashed passwords)
INSERT INTO users (email, password_hash, name, role) VALUES
  ('admin@medspa.com', 'admin123', 'Admin User', 'admin'),
  ('payroll@medspa.com', 'payroll123', 'Payroll Manager', 'payroll'),
  ('employee@medspa.com', 'employee123', 'Employee User', 'employee')
ON CONFLICT (email) DO NOTHING;

-- Insert sample location
INSERT INTO locations (id, name, address, city, state, zip_code, phone, manager) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Main Spa', '123 Beauty Lane', 'Los Angeles', 'CA', '90001', '(555) 123-4567', 'Sarah Johnson')
ON CONFLICT (id) DO NOTHING;

-- Note: You'll need to create the authentication users in Supabase Auth dashboard
-- Go to Authentication > Users > Add User
-- Create users with emails: admin@medspa.com, payroll@medspa.com, employee@medspa.com
-- Set their passwords to: admin123, payroll123, employee123 respectively
