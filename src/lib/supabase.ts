import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://sqptjbsoyghacmvgtecz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcHRqYnNveWdoYWNtdmd0ZWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg0NjAsImV4cCI6MjA5NDExNDQ2MH0.RCh-WhZE5FYUSBu8-UXSJhKmfRo1FjTL4XUEFSBVnSA';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { SupabaseClient } from '@supabase/supabase-js';
