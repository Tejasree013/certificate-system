import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://nvauoyeetsepredjabnn.supabase.co";

const supabaseKey =
  "sb_publishable_GZGGLGEJ45td7qTLDe9s-w_RaHiUjla";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);