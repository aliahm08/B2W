import 'server-only';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { AppRole, AuthContext, ProfileRecord } from '@/lib/types';

function normalizeRole(value: unknown): AppRole {
  if (value === 'admin' || value === 'team' || value === 'client_editor' || value === 'client_viewer') {
    return value;
  }

  return 'client_viewer';
}

export async function getAuthContext(): Promise<AuthContext> {
  const session = await auth();
  const user = await currentUser();

  if (!session.userId) {
    throw new Error('Unauthenticated');
  }

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('id, organization_id, role, is_internal')
    .eq('clerk_user_id', session.userId)
    .maybeSingle<Pick<ProfileRecord, 'id' | 'organization_id' | 'role' | 'is_internal'>>();

  const metadataRole = normalizeRole(user?.publicMetadata?.role);
  const role = normalizeRole(profile?.role ?? metadataRole);
  const isInternal = Boolean(profile?.is_internal || role === 'admin' || role === 'team');

  return {
    clerkUserId: session.userId,
    clerkOrgId: session.orgId ?? null,
    role,
    email: user?.emailAddresses[0]?.emailAddress ?? null,
    organizationId: profile?.organization_id ?? null,
    profileId: profile?.id ?? null,
    isInternal
  };
}
