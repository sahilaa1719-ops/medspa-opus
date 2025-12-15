import { createClient } from '@supabase/supabase-js'

// Admin client for auth.admin operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://tjrophtadiovtimgobsf.supabase.co';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm9waHRhZGlvdnRpbWdvYnNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIwMDEwOCwiZXhwIjoyMDgwNzc2MTA4fQ.J6KuB6cSRGdF4W8igk6ncWvecatJ-pLi31M_kbaUKao';

console.log('Initializing Supabase Admin client...', { url: supabaseUrl, hasKey: !!supabaseServiceRoleKey });

if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'your-service-role-key') {
  console.warn('Supabase service role key not configured. Admin operations will not work.');
}

// Ensure we have valid values
const finalUrl = supabaseUrl || 'https://tjrophtadiovtimgobsf.supabase.co';
const finalKey = supabaseServiceRoleKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm9waHRhZGlvdnRpbWdvYnNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIwMDEwOCwiZXhwIjoyMDgwNzc2MTA4fQ.J6KuB6cSRGdF4W8igk6ncWvecatJ-pLi31M_kbaUKao';

export const supabaseAdmin = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Supabase Admin client initialized');
