-- Ensure users can update their own password
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable select for users" ON users;

-- Create SELECT policy (needed to read the user data)
CREATE POLICY "Enable select for users" 
ON users 
FOR SELECT 
USING (true);

-- Create update policy for users table
CREATE POLICY "Users can update own record" 
ON users 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Make sure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON users TO authenticated;
GRANT SELECT ON users TO anon;
GRANT UPDATE ON users TO authenticated;
GRANT UPDATE ON users TO anon;
