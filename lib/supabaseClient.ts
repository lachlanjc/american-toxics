// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Ensure these env vars are set in your .env (or runtime environment)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment",
  );
}

// Client for use in browser or SSR
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
