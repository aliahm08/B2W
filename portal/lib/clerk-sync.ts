import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type ClerkOrganizationWebhook = {
  id: string;
  name: string;
  slug: string;
  created_by?: string;
};

type ClerkUserWebhook = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses?: Array<{ email_address: string }>;
  public_metadata?: Record<string, unknown>;
};

type ClerkMembershipWebhook = {
  id: string;
  public_user_data?: {
    user_id: string;
  };
  organization?: {
    id: string;
  };
  public_metadata?: Record<string, unknown>;
};

function getRoleFromMetadata(metadata: Record<string, unknown> | undefined) {
  const value = metadata?.role;
  if (value === 'admin' || value === 'team' || value === 'client_editor' || value === 'client_viewer') {
    return value;
  }

  return 'client_viewer';
}

export async function syncClerkOrganization(input: ClerkOrganizationWebhook) {
  const admin = createSupabaseAdminClient();
  await admin.from('organizations').upsert({
    clerk_org_id: input.id,
    name: input.name,
    slug: input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }, {
    onConflict: 'clerk_org_id'
  });
}

export async function syncClerkUser(input: ClerkUserWebhook) {
  const admin = createSupabaseAdminClient();
  const email = input.email_addresses?.[0]?.email_address ?? '';
  const fullName = [input.first_name, input.last_name].filter(Boolean).join(' ').trim() || null;
  const role = getRoleFromMetadata(input.public_metadata);
  const isInternal = role === 'admin' || role === 'team';

  await admin.from('profiles').upsert({
    clerk_user_id: input.id,
    email,
    full_name: fullName,
    role,
    is_internal: isInternal
  }, {
    onConflict: 'clerk_user_id'
  });
}

export async function syncClerkMembership(input: ClerkMembershipWebhook) {
  const admin = createSupabaseAdminClient();
  const clerkUserId = input.public_user_data?.user_id;
  const clerkOrgId = input.organization?.id;

  if (!clerkUserId || !clerkOrgId) {
    return;
  }

  const [{ data: organization }, { data: profile }] = await Promise.all([
    admin.from('organizations').select('id').eq('clerk_org_id', clerkOrgId).maybeSingle<{ id: string }>(),
    admin.from('profiles').select('id').eq('clerk_user_id', clerkUserId).maybeSingle<{ id: string }>()
  ]);

  if (!organization?.id || !profile?.id) {
    return;
  }

  await admin.from('profiles').update({
    organization_id: organization.id,
    role: getRoleFromMetadata(input.public_metadata)
  }).eq('id', profile.id);
}
