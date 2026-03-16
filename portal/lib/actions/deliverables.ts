'use server';

import { revalidatePath } from 'next/cache';
import { getAuthContext } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { requireAdminOrTeam } from '@/lib/permissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function createDeliverableAction(formData: FormData) {
  const context = await getAuthContext();
  requireAdminOrTeam(context);

  const payload = {
    organization_id: String(formData.get('organizationId') ?? ''),
    proposal_id: String(formData.get('proposalId') ?? '') || null,
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    version: String(formData.get('version') ?? 'v1'),
    uploaded_by: context.profileId
  };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('deliverables').insert(payload).select('id').single<{ id: string }>();
  if (error) {
    throw new Error(error.message);
  }

  await logAuditEvent({
    organizationId: payload.organization_id,
    actorProfileId: context.profileId,
    action: 'deliverable_uploaded',
    entityType: 'deliverable',
    entityId: data.id
  });

  revalidatePath('/portal/deliverables');
  revalidatePath('/portal/admin/deliverables');
}
