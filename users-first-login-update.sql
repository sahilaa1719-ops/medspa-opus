-- Add is_first_login column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;

-- Update existing users to have is_first_login = false (for admins and existing users)
UPDATE users 
SET is_first_login = false 
WHERE role = 'admin' OR role = 'payroll';

-- For newly created employees, is_first_login will default to true
-- This column tracks whether the employee needs to change their password on first login
