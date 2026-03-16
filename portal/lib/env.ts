import 'server-only';

type EnvShape = {
  clerkPublishableKey: string;
  clerkSecretKey: string;
  clerkWebhookSecret: string;
  clerkSupabaseTemplate: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  supabaseBucket: string;
  appUrl: string;
};

function getValue(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

export const env: EnvShape = {
  clerkPublishableKey: getValue('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  clerkSecretKey: getValue('CLERK_SECRET_KEY'),
  clerkWebhookSecret: getValue('CLERK_WEBHOOK_SECRET'),
  clerkSupabaseTemplate: getValue('CLERK_SUPABASE_JWT_TEMPLATE', 'supabase'),
  supabaseUrl: getValue('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getValue('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: getValue('SUPABASE_SERVICE_ROLE_KEY'),
  supabaseBucket: getValue('SUPABASE_STORAGE_BUCKET', 'portal-files'),
  appUrl: getValue('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
};
