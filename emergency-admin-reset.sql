-- Emergency Admin Password Reset
-- Use this ONLY when admin is locked out and cannot receive emails
-- Run this in your Supabase SQL Editor

-- Step 1: Find the admin user
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'name' as name
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';

-- Step 2: Reset admin password to a temporary password
-- Replace 'USER_ID_HERE' with the actual admin user ID from Step 1
-- Replace 'TempPassword123!' with your desired temporary password

-- Note: You'll need to use the Supabase Dashboard's Authentication section
-- to reset the password, OR use the service role key programmatically

-- Alternative: Create a new admin user with a real email
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_user_meta_data,
--   created_at,
--   updated_at
-- )
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'your-real-email@gmail.com',
--   crypt('YourNewPassword123!', gen_salt('bf')),
--   now(),
--   '{"role": "admin", "name": "Admin", "is_first_login": false}'::jsonb,
--   now(),
--   now()
-- );
