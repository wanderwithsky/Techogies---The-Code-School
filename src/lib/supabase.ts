import { createClient } from "@supabase/supabase-js";

// Make sure to add these to your .env file
// Using a universal check to support both client (import.meta.env) and server (process.env) contexts
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) || 
  import.meta.env.VITE_SUPABASE_URL || 
  "https://placeholder-project.supabase.co";

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
