import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pnpsdukyrjritwivwxsx.supabase.co";   // from Supabase dashboard
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucHNkdWt5cmpyaXR3aXZ3eHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzQyNjQsImV4cCI6MjA3MjU1MDI2NH0.O_G9bZqx64OQ77jOhJpZaATlw63_hrylv0sOPdO7P3Y";                     // from Supabase API settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey);