import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tjrophtadiovtimgobsf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm9waHRhZGlvdnRpbWdvYnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDAxMDgsImV4cCI6MjA4MDc3NjEwOH0.b5JneuuVUDAkKfnRMxf9Jf4_8VtQrAoK3eHBN9o0eTg'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

console.log('Initializing Supabase client...', { url: supabaseUrl });

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('Supabase client initialized successfully');
