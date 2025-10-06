import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Security: Never log sensitive values
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase configuration error: Missing required environment variables.'
  );
  // Consider throwing an error in production to prevent app from running with misconfiguration
  throw new Error('Supabase configuration is incomplete. Please check environment setup.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);