'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { getAuthContext } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { requireAdminOrTeam } from '@/lib/permissions';

export async function inviteClientUserAction(formData: FormData) {
  const context = await getAuthContext();
  requireAdminOrTeam(context);

  const emailAddress = String(formData.get('email') ?? '');
  const role = String(formData.get('role') ?? 'client_viewer');
  const clerkOrgId = String(formData.get('clerkOrgId') ?? '');

  const client = await clerkClient();
  const invitation = await client.organizations.createOrganizationInvitation({
    organizationId: clerkOrgId,
    emailAddress,
    inviterUserId: context.clerkUserId,
    role: 'org:member',
    publicMetadata: { role }
  });

  await logAuditEvent({
    organizationId: context.organizationId,
    actorProfileId: context.profileId,
    action: 'user_invited',
    entityType: 'invitation',
    entityId: invitation.id,
    metadata: { emailAddress, role, clerkOrgId }
  });
}
