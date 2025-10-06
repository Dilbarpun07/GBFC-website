import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Environment variables validation (removed logging for security)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are missing or empty. Please check your .env file.'
  );
  // For now, we'll proceed, but this is a critical warning.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
