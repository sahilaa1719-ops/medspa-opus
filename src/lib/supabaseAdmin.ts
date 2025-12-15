import { createClient } from '@supabase/supabase-js'

// Admin client for auth.admin operations
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('Admin env vars:', { envUrl, envKey, hasEnvUrl: !!envUrl, hasEnvKey: !!envKey });

// Use hardcoded fallbacks if env vars are not available
const supabaseUrl = envUrl && typeof envUrl === 'string' && envUrl.startsWith('http') 
  ? envUrl 
  : 'https://tjrophtadiovtimgobsf.supabase.co';

const supabaseServiceRoleKey = envKey && typeof envKey === 'string' && envKey.length > 50
  ? envKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm9waHRhZGlvdnRpbWdvYnNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIwMDEwOCwiZXhwIjoyMDgwNzc2MTA4fQ.J6KuB6cSRGdF4W8igk6ncWvecatJ-pLi31M_kbaUKao';

console.log('Initializing Supabase Admin client...', { 
  url: supabaseUrl, 
  keyLength: supabaseServiceRoleKey?.length,
  usingFallback: !envUrl || !envKey 
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Supabase Admin client initialized successfully');
