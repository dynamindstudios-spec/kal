import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iqddvpckxbdsiujdrjnz.supabase.co';
// Ensure clean base URL without /rest/v1/ suffix
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ku7k4z_DdnjNpfpc5GnU5g_3ARWOE7Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
