import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://localhost:54321' // local Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' // from Supabase Studio or .env

export const supabase = createClient(supabaseUrl, supabaseKey)
