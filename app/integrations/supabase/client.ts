import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://zuphefzbbzkhlftiaajl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cGhlZnpiYnpraGxmdGlhYWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzAwODgsImV4cCI6MjA3NDkwNjA4OH0.osRPoS8zrAmmm5ffwkhSamOTjByjmFAWVvZr8hfKBSg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
