import { PRIVATE_SUPABASE_SERVICE_ROLE_SECRET } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

const supabaseServiceRole = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE_SECRET, {
  auth: {
    persistSession: false,         // Disable session persistence for server-side operations
    autoRefreshToken: false,       // Disable automatic token refresh
    detectSessionInUrl: false,     // Disable session detection from the URL
  }
})

export default supabaseServiceRole;