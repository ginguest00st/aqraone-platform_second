import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Ambil kredensial dari environment variable (Vite)
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';


// Pengecekan ramah pengembang agar tidak crash jika .env belum diisi saat pertama kali cloning/setup
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.warn(
    '[Supabase Configuration Notice]\n' +
    'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum dikonfigurasi dengan benar di file .env.\n' +
    'Silakan salin .env.example ke .env lalu masukkan URL dan Anon Key proyek Supabase Anda.'
  );
}

// Inisialisasi Supabase Client dengan type Database
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
