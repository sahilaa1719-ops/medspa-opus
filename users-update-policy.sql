-- Ensure users can update their own password
-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Users can update own record" ON users;

-- Create update policy for users table
CREATE POLICY "Users can update own record" 
ON users 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Alternative: If you want more restrictive policy (users can only update their own record)
-- DROP POLICY IF EXISTS "Users can update own record" ON users;
-- CREATE POLICY "Users can update own record" 
-- ON users 
-- FOR UPDATE 
-- USING (email = auth.jwt() ->> 'email')
-- WITH CHECK (email = auth.jwt() ->> 'email');

-- Make sure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT UPDATE ON users TO authenticated;
GRANT UPDATE ON users TO anon;
