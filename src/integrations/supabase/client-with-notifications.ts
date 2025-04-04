
import { createClient } from '@supabase/supabase-js';
import { DatabaseWithNotifications } from './types-database';

const SUPABASE_URL = "https://pmhxygkllzhokoeisjop.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtaHh5Z2tsbHpob2tvZWlzam9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODg2MzMsImV4cCI6MjA1ODI2NDYzM30.eailQLsKkhnmNeqzZrlZjKPzBIZvRIzmQ6VzfaL8Sew";

// Supabase client with notifications support
export const supabaseWithNotifications = createClient<DatabaseWithNotifications>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY
);
