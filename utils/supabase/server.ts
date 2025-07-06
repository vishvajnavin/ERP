// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { // <-- This is the required third argument (options object)
      cookies: {
        getAll() {
          return [] // Return an empty array if no cookies are relevant
        },
        setAll() {
        },
      },
    }
  )
}