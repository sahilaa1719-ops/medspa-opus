-- Update Admin Email Address
-- Run this in your Supabase SQL Editor

-- This will help you find the admin user's ID and update their email
-- First, let's see all users and their metadata
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'name' as name
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';

-- After you see the admin user, use their ID to update the email
-- Replace 'USER_ID_HERE' with the actual admin user ID from above
-- Replace 'your-real-email@gmail.com' with your actual email

-- UPDATE auth.users 
-- SET email = 'your-real-email@gmail.com',
--     raw_user_meta_data = jsonb_set(raw_user_meta_data, '{email}', '"your-real-email@gmail.com"')
-- WHERE id = 'USER_ID_HERE';

-- Also update in employees table if email is stored there
-- UPDATE employees 
-- SET email = 'your-real-email@gmail.com'
-- WHERE email = 'admin@medspa.com';
