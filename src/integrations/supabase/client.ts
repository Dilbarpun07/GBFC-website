import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add console logs to verify environment variables are loaded
console.log("Supabase URL:", supabaseUrl ? "Loaded" : "NOT LOADED");
console.log("Supabase Anon Key:", supabaseAnonKey ? "Loaded" : "NOT LOADED");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);