import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client — bypasses RLS, never exposed to browser
export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

export function isSupabaseConfigured() {
  return (
    Boolean(url) &&
    url !== "https://your-project.supabase.co" &&
    Boolean(serviceKey) &&
    serviceKey !== "your-service-role-key"
  );
}
