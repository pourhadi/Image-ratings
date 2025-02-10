import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://fdkdwoztozsqeythsffx.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZka2R3b3p0b3pzcWV5dGhzZmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNTYwNDYsImV4cCI6MjA1NDczMjA0Nn0.32XwSScbULAVQALNAPsRF9-uDt5TcGAGHDFIThPBGww"
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZka2R3b3p0b3pzcWV5dGhzZmZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE1NjA0NiwiZXhwIjoyMDU0NzMyMDQ2fQ.WqNjbaH5dO4ef00i8qM4tQuXP7w2lfw6mMk47LS9Src"

// if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
//   throw new Error("Missing Supabase environment variables" + supabaseUrl + ", " + supabaseAnonKey + ", " + supabaseServiceRoleKey)
// }

// Client for public usage (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with elevated privileges (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

