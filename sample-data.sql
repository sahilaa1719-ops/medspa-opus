-- Sample Data Migration Script for MedSpa Opus
-- Run this AFTER running the schema (supabase-schema.sql)
-- This adds sample employees, licenses, and documents for testing

-- Insert sample employees
INSERT INTO employees (
  id, full_name, email, phone, position, hire_date, photo_url, status,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
  employment_type, annual_salary, pay_frequency
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Sarah Johnson',
    'sarah.johnson@medspa.com',
    '(555) 234-5678',
    'Medical Aesthetician',
    '2022-01-15',
    'https://ui-avatars.com/api/?name=Sarah+Johnson&background=F3F4F6&color=374151',
    'active',
    'John Johnson',
    '(555) 234-5679',
    'Spouse',
    'full-time',
    75000.00,
    'annually'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Michael Chen',
    'michael.chen@medspa.com',
    '(555) 345-6789',
    'Laser Technician',
    '2021-06-01',
    'https://ui-avatars.com/api/?name=Michael+Chen&background=F3F4F6&color=374151',
    'active',
    'Lisa Chen',
    '(555) 345-6790',
    'Spouse',
    'full-time',
    65000.00,
    'annually'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'Emily Rodriguez',
    'emily.rodriguez@medspa.com',
    '(555) 456-7890',
    'Receptionist',
    '2023-03-10',
    'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F3F4F6&color=374151',
    'active',
    'Carlos Rodriguez',
    '(555) 456-7891',
    'Father',
    'full-time',
    45000.00,
    'annually'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    'David Thompson',
    'david.thompson@medspa.com',
    '(555) 567-8901',
    'Nurse Practitioner',
    '2020-08-20',
    'https://ui-avatars.com/api/?name=David+Thompson&background=F3F4F6&color=374151',
    'active',
    'Jennifer Thompson',
    '(555) 567-8902',
    'Spouse',
    'full-time',
    95000.00,
    'annually'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440006',
    'Amanda Lee',
    'amanda.lee@medspa.com',
    '(555) 678-9012',
    'Marketing Manager',
    '2022-11-01',
    'https://ui-avatars.com/api/?name=Amanda+Lee&background=F3F4F6&color=374151',
    'active',
    'Robert Lee',
    '(555) 678-9013',
    'Spouse',
    'full-time',
    70000.00,
    'annually'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample licenses
INSERT INTO licenses (
  employee_id, license_type, license_number, issuing_authority,
  issue_date, expiry_date, status, file_url
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Medical Aesthetician License',
    'MA-12345-CA',
    'California Board of Barbering and Cosmetology',
    '2021-01-10',
    '2026-01-10',
    'active',
    'https://example.com/licenses/sarah-aesthetician.pdf'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Laser Safety Certification',
    'LSC-67890-CA',
    'California Department of Health',
    '2020-05-15',
    '2025-05-15',
    'active',
    'https://example.com/licenses/michael-laser.pdf'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'Nurse Practitioner License',
    'NP-24680-CA',
    'California Board of Registered Nursing',
    '2019-08-01',
    '2025-08-01',
    'active',
    'https://example.com/licenses/david-np.pdf'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'DEA Registration',
    'DEA-13579-CA',
    'Drug Enforcement Administration',
    '2020-01-15',
    '2025-01-15',
    'active',
    'https://example.com/licenses/david-dea.pdf'
  )
ON CONFLICT DO NOTHING;

-- Insert sample documents
INSERT INTO documents (
  employee_id, title, type, file_url, file_size, uploaded_by
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'W-4 Form 2022',
    'Tax Document',
    'https://example.com/docs/sarah-w4.pdf',
    245678,
    'admin@medspa.com'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Employment Contract',
    'Contract',
    'https://example.com/docs/sarah-contract.pdf',
    512345,
    'admin@medspa.com'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'W-4 Form 2021',
    'Tax Document',
    'https://example.com/docs/michael-w4.pdf',
    234567,
    'admin@medspa.com'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Background Check',
    'HR Document',
    'https://example.com/docs/michael-background.pdf',
    156789,
    'admin@medspa.com'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'I-9 Form',
    'HR Document',
    'https://example.com/docs/emily-i9.pdf',
    198765,
    'admin@medspa.com'
  )
ON CONFLICT DO NOTHING;

-- Insert sample pay stubs (for testing payroll pages)
INSERT INTO pay_stubs (
  employee_id, pay_period_start, pay_period_end, pay_date,
  gross_pay, net_pay, regular_hours, overtime_hours,
  federal_tax, state_tax, social_security, medicare,
  health_insurance, retirement_401k, status
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    '2024-11-16',
    '2024-11-30',
    '2024-12-05',
    2884.62,
    2145.32,
    80.0,
    0.0,
    345.75,
    144.23,
    178.84,
    41.83,
    150.00,
    75.00,
    'paid'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    '2024-11-16',
    '2024-11-30',
    '2024-12-05',
    2500.00,
    1875.50,
    80.0,
    0.0,
    300.00,
    125.00,
    155.00,
    36.25,
    125.00,
    65.00,
    'paid'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    '2024-11-16',
    '2024-11-30',
    '2024-12-05',
    1730.77,
    1298.32,
    80.0,
    0.0,
    207.69,
    86.54,
    107.31,
    25.10,
    100.00,
    45.00,
    'paid'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    '2024-11-16',
    '2024-11-30',
    '2024-12-05',
    3653.85,
    2712.45,
    80.0,
    0.0,
    438.46,
    182.69,
    226.54,
    52.98,
    175.00,
    95.00,
    'paid'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440006',
    '2024-11-16',
    '2024-11-30',
    '2024-12-05',
    2692.31,
    2004.23,
    80.0,
    0.0,
    323.08,
    134.62,
    166.92,
    39.04,
    150.00,
    70.00,
    'paid'
  )
ON CONFLICT DO NOTHING;

-- Insert sample time entries
INSERT INTO time_entries (
  employee_id, work_date, regular_hours, overtime_hours, status, notes
) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', '2024-12-02', 8.0, 0.0, 'approved', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', '2024-12-03', 8.0, 0.0, 'approved', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', '2024-12-04', 8.0, 0.0, 'approved', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', '2024-12-05', 8.0, 1.5, 'approved', 'Extended hours for event'),
  ('550e8400-e29b-41d4-a716-446655440002', '2024-12-06', 8.0, 0.0, 'approved', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', '2024-12-09', 8.0, 0.0, 'pending', NULL),
  ('550e8400-e29b-41d4-a716-446655440003', '2024-12-02', 8.0, 0.0, 'approved', NULL),
  ('550e8400-e29b-41d4-a716-446655440003', '2024-12-03', 8.0, 0.0, 'approved', NULL),
  ('550e8400-e29b-41d4-a716-446655440003', '2024-12-09', 8.0, 0.0, 'pending', NULL)
ON CONFLICT (employee_id, work_date) DO NOTHING;

-- Insert sample tax documents
INSERT INTO tax_documents (
  employee_id, document_type, tax_year, wages, 
  federal_tax_withheld, state_tax_withheld, 
  social_security_wages, medicare_wages, status
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'W-2',
    2023,
    75000.00,
    8500.00,
    3500.00,
    75000.00,
    75000.00,
    'filed'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'W-2',
    2023,
    65000.00,
    7200.00,
    3000.00,
    65000.00,
    65000.00,
    'filed'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    'W-2',
    2023,
    95000.00,
    11500.00,
    4750.00,
    95000.00,
    95000.00,
    'filed'
  )
ON CONFLICT DO NOTHING;

-- Verify insertions
SELECT 'Employees:' as table_name, COUNT(*) as count FROM employees
UNION ALL
SELECT 'Locations:', COUNT(*) FROM locations
UNION ALL
SELECT 'Licenses:', COUNT(*) FROM licenses
UNION ALL
SELECT 'Documents:', COUNT(*) FROM documents
UNION ALL
SELECT 'Pay Stubs:', COUNT(*) FROM pay_stubs
UNION ALL
SELECT 'Time Entries:', COUNT(*) FROM time_entries
UNION ALL
SELECT 'Tax Documents:', COUNT(*) FROM tax_documents;
