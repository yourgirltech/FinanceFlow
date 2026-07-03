import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // Not a crash — just a loud console warning so it's obvious in dev why
  // auth calls are failing. See .env.example for what's needed.
  console.warn(
    '[Finance Flow] Supabase is not configured. Copy .env.example to .env and add your project URL + anon key.'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
