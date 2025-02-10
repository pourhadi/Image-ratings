import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
//   throw new Error("Missing Supabase environment variables" + supabaseUrl + ", " + supabaseAnonKey + ", " + supabaseServiceRoleKey)
// }

// Client for public usage (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with elevated privileges (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

