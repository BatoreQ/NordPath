import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY brak w env — endpointy bazodanowe nie beda dzialac.'
  );
}

// Serwer uzywa service role key, wiec RLS jest omijane tutaj celowo —
// autoryzacja per-nauczyciel jest wymuszana recznie w warstwie routes (auth.js).
export const supabase = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY ?? '',
  { auth: { persistSession: false } }
);
