import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add console logs to verify environment variables are loaded and are not empty
console.log("Supabase URL:", supabaseUrl ? "Loaded" : "NOT LOADED", "Value:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey ? "Loaded" : "NOT LOADED", "Value:", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing or empty. Please check your .env file.");
  // For now, we'll proceed, but this is a critical warning.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);