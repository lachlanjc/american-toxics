// lib/supabaseClient.ts

import type { SupabaseClient } from "@supabase/supabase-js";
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

// Admin client for server-side tasks, using service role key if available
const supabaseAdminUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin: SupabaseClient | undefined =
  supabaseAdminUrl && supabaseServiceRoleKey
    ? createClient(supabaseAdminUrl, supabaseServiceRoleKey)
    : undefined;
