import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL ou Key não encontradas nas variáveis de ambiente.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;