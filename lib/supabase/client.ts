import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} belum tersedia.`);
  }

  return value;
}

const resolvedSupabaseUrl = requireEnv(
  "NEXT_PUBLIC_SUPABASE_URL",
  supabaseUrl,
);

if (resolvedSupabaseUrl.includes("/rest/v1")) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL harus berupa project URL Supabase tanpa suffix /rest/v1.",
  );
}

export const supabase = createClient(
  resolvedSupabaseUrl,
  requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    supabasePublishableKey,
  ),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
