// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bijugdyllpvdtakfimkb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpanVnZHlsbHB2ZHRha2ZpbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjI0MzAsImV4cCI6MjA2OTE5ODQzMH0.XeLhAeNqYCWrodWgkmVOLSHr38a6p3ErC9xxSDK4ZRE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

