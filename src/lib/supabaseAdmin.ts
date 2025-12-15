import { createClient } from '@supabase/supabase-js'

// Admin client for auth.admin operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tjrophtadiovtimgobsf.supabase.co';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm9waHRhZGlvdnRpbWdvYnNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIwMDEwOCwiZXhwIjoyMDgwNzc2MTA4fQ.J6KuB6cSRGdF4W8igk6ncWvecatJ-pLi31M_kbaUKao';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
