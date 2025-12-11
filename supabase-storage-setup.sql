-- MedSpa Opus Storage Configuration
-- Run this SQL in your Supabase SQL Editor to set up Storage bucket and policies

-- ==========================================
-- STORAGE BUCKET SETUP
-- ==========================================

-- Insert the bucket into storage.buckets table (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee-files',
  'employee-files',
  true,  -- Make bucket public so we can get public URLs
  52428800,  -- 50MB file size limit
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- ROW LEVEL SECURITY POLICIES FOR STORAGE
-- ==========================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload files to employee-files bucket
CREATE POLICY "Allow authenticated uploads to employee-files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee-files');

-- Policy: Allow authenticated users to update files in employee-files bucket
CREATE POLICY "Allow authenticated updates to employee-files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'employee-files')
WITH CHECK (bucket_id = 'employee-files');

-- Policy: Allow authenticated users to delete files in employee-files bucket
CREATE POLICY "Allow authenticated deletes from employee-files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'employee-files');

-- Policy: Allow public read access to employee-files bucket
CREATE POLICY "Allow public read access to employee-files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'employee-files');

-- Policy: Allow anon (service role) to manage buckets
CREATE POLICY "Allow service role to manage buckets"
ON storage.buckets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==========================================
-- ADDITIONAL POLICIES (Optional but recommended)
-- ==========================================

-- If you want to restrict file access by user/role in the future, 
-- you can add more granular policies here. For now, we allow all authenticated users.

-- Example: Restrict uploads to specific folders by user
-- CREATE POLICY "Users can upload to their own folder"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'employee-files' AND
--   (storage.foldername(name))[1] = auth.uid()::text
-- );

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Run these to verify the setup:

-- Check if bucket exists
-- SELECT * FROM storage.buckets WHERE name = 'employee-files';

-- Check bucket policies
-- SELECT * FROM storage.objects WHERE bucket_id = 'employee-files';

-- Check RLS policies on storage.objects
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
