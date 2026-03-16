import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export async function createSupabaseServerClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: env.clerkSupabaseTemplate });

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
